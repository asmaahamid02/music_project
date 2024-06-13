<template>
  <main>
    <!-- Music Header -->
    <section class="w-full mb-8 py-14 text-center text-white relative">
      <div
        class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
        style="background-image: url(/assets/img/song-header.png)"
      ></div>
      <div class="container mx-auto flex items-center">
        <!-- Play/Pause Button -->
        <button
          @click.prevent="newSong(song)"
          type="button"
          class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none"
        >
          <i class="fas" :class="{ 'fa-play': !playing, 'fa-pause': playing }"></i>
        </button>
        <div class="z-50 text-left ml-8">
          <!-- Song Info -->
          <div class="text-3xl font-bold">{{ song.modified_name }}</div>
          <div>{{ song.genre }}</div>
          <div class="song-price">{{ $n(10, 'currency') }}</div>
        </div>
      </div>
    </section>
    <!-- Form -->
    <section class="container mx-auto mt-6" id="comments">
      <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <!-- Comment Count -->
          <span class="card-title">{{ $tc('song.comment_count', song.comment_count) }}</span>
          <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
        </div>
        <div class="p-6">
          <div
            class="text-white text-center font-bold p-4 mb-4 rounded"
            :class="comment_alert_variant"
            v-if="comment_show_alert"
          >
            {{ comment_alert_text }}
          </div>
          <VeeForm :validation-schema="schema" @submit="addComment" v-if="userLoggedIn">
            <VeeField
              as="textarea"
              name="comment"
              class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
              :placeholder="$t('song.comment_placeholder')"
            ></VeeField>
            <ErrorMessage class="text-red-600" name="comment" />
            <button
              type="submit"
              class="py-1.5 px-3 rounded text-white bg-green-600 block"
              :disabled="comment_in_submission"
            >
              {{ $t('song.submit_comment') }}
            </button>
          </VeeForm>
          <!-- Sort Comments -->
          <select
            v-model="sort"
            class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          >
            <option value="1">{{ $t('song.latest') }}</option>
            <option value="2">{{ $t('song.oldest') }}</option>
          </select>
        </div>
      </div>
    </section>
    <!-- Comments -->
    <ul class="container mx-auto">
      <li
        class="p-6 bg-gray-50 border border-gray-200"
        v-for="comment in sortedComments"
        :key="comment.docID"
      >
        <!-- Comment Author -->
        <div class="mb-5">
          <div class="font-bold">{{ comment.name }}</div>
          <time>{{ new Date(comment.datePosted).toLocaleDateString() }}</time>
        </div>

        <p>
          {{ comment.content }}
        </p>
      </li>
    </ul>
  </main>
</template>

<script>
import { songsCollection, auth, commentsCollection } from '../includes/firebase'
import { mapState, mapActions } from 'pinia'
import useUserStore from '@/stores/user'
import usePlayerStore from '@/stores/player'

export default {
  name: 'SongView',
  data() {
    return {
      song: {},
      schema: {
        comment: 'required|min:3'
      },
      comment_in_submission: false,
      comment_show_alert: false,
      comment_alert_variant: 'bg-blue-500',
      comment_alert_text: '',
      comments: [],
      sort: '1' //latest to oldest
    }
  },
  computed: {
    ...mapState(useUserStore, ['userLoggedIn']),
    ...mapState(usePlayerStore, ['playing']),
    sortedComments() {
      return this.comments.slice().sort((a, b) => {
        if (this.sort === '1') {
          //desc
          return new Date(b.datePosted) - new Date(a.datePosted) //negative => b first | 0 => a,b remains at their respective indexes| positive => a first
        } else {
          //asc
          return new Date(a.datePosted) - new Date(b.datePosted)
        }
      }) //slice creates a copy of the original array
    }
  },
  async created() {
    const docSnapshot = await songsCollection.doc(this.$route.params.id).get()

    if (!docSnapshot.exists) {
      this.$router.push({ name: 'home' })
      return
    }

    const { sort } = this.$route.query

    this.sort = sort === '1' || sort === '2' ? sort : '1'

    this.song = docSnapshot.data()
    this.getComments()
  },
  methods: {
    ...mapActions(usePlayerStore, ['newSong']),
    async addComment(values, { resetForm }) {
      //destructuring context to grab resetForm
      this.comment_in_submission = true
      this.comment_show_alert = true
      this.comment_alert_variant = 'bg-blue-500'
      this.comment_alert_text = `${this.$t('action_messages.wait')} ${this.$t(
        'action_messages.adding_comment'
      )}`

      const comment = {
        content: values.comment,
        datePosted: new Date().toString(),
        sid: this.$route.params.id,
        name: auth.currentUser.displayName,
        uid: auth.currentUser.uid
      }

      try {
        await commentsCollection.add(comment)

        this.song.comment_count += 1
        await songsCollection.doc(this.$route.params.id).update({
          comment_count: this.song.comment_count
        })

        this.getComments()

        this.comment_in_submission = false
        this.comment_alert_variant = 'bg-green-500'
        this.comment_alert_text = `${this.$t('action_messages.success')} ${this.$t(
          'action_messages.comment_added'
        )}`

        resetForm()
      } catch (error) {
        this.comment_in_submission = false
        this.comment_alert_variant = 'bg-red-500'
        this.comment_alert_text = `${this.$t('action_messages.error')} ${this.$t(
          'action_messages.comment_not_added'
        )}`
      }
    },
    async getComments() {
      const snapshots = await commentsCollection.where('sid', '==', this.$route.params.id).get()

      this.comments = []

      snapshots.forEach((document) => {
        this.comments.push({
          docID: document.id,
          ...document.data()
        })
      })
    }
  },
  watch: {
    sort(newVal) {
      if (newVal === this.$route.query.sort) {
        return
      }

      this.$router.push({
        query: {
          sort: newVal
        }
      })
    }
  }
}
</script>

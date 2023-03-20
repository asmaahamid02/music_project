<template>
  <li
    class="flex justify-between items-center p-3 pl-6 cursor-pointer transition duration-300 hover:bg-gray-50"
  >
    <div>
      <RouterLink
        :to="{ name: 'song', params: { id: song.docID } }"
        class="font-bold block text-gray-600"
        >{{ song.modified_name }}</RouterLink
      >
      <span class="text-gray-500 text-sm">{{ song.display_name }}</span>
    </div>

    <div class="text-gray-600 text-lg">
      <span class="mr-3 text-red-500">
        <i
          :class="likedClass"
          class="fa-heart text-lg mr-2"
          @click.prevent="likeSong"
          v-if="userLoggedIn"
        ></i>
        <span>{{ song.like_count ?? 0 }}</span>
      </span>
      <RouterLink
        custom
        :to="{ name: 'song', params: { id: song.docID }, hash: '#comments' }"
        v-slot="{ navigate }"
      >
        <span class="comments" @click="navigate">
          <i class="fa fa-comments text-gray-600"></i>
          {{ song.comment_count < 10 ? `0${song.comment_count}` : song.comment_count }}
        </span>
      </RouterLink>
    </div>
  </li>
</template>

<script>
import { auth, likesCollection, songsCollection } from '@/includes/firebase'
import { mapState } from 'pinia'
import useUserStore from '@/stores/user'

export default {
  name: 'SongItem',
  props: {
    song: {
      type: Object,
      required: true
    }
  },
  data() {
    return {}
  },
  emits: ['like'],
  computed: {
    ...mapState(useUserStore, ['userLoggedIn']),
    likedClass() {
      return this.song.liked ? 'fas' : 'far'
    }
  },
  methods: {
    async likeSong() {
      // this.likedClass = this.likedClass === 'far' ? 'fas' : 'far'
      const data = {
        uid: auth.currentUser.uid,
        sid: this.song.docID
      }
      this.$emit('like', this.song.docID)
      try {
        const snapshot = await likesCollection
          .where('uid', '==', data.uid)
          .where('sid', '==', data.sid)
          .get()

        if (!snapshot.empty) {
          await likesCollection.doc(snapshot.docs[0].id).delete()
          await songsCollection.doc(this.song.docID).update({
            like_count: this.song.like_count > 0 ? this.song.like_count - 1 : 0
          })
        } else {
          await likesCollection.add(data)
          await songsCollection.doc(this.song.docID).update({
            like_count: this.song.like_count + 1
          })
        }
      } catch (err) {
        console.log(err)
        this.$emit('like', this.song.docID)
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>

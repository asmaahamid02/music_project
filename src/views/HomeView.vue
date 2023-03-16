<template>
  <main>
    <AppInroduction :title="title" :description="description" />

    <!-- Main Content -->
    <section class="container mx-auto">
      <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <span class="card-title text-xl text-yellow-400">{{ $t('home.songs_text') }}</span>
          <!-- Icon -->
          <!--the icon becomes a directive-->
          <!--Global: v-icon.right.yellow="'headphones-alt'"-->
          <!--locally:  v-icon-secondary="{ icon: 'headphones-alt', right: true }"-->
          <span v-icon-secondary="{ icon: 'headphones-alt', right: true }"></span>
        </div>
        <!-- Playlist -->
        <ol id="playlist">
          <SongItem v-for="song in songs" :key="song.docID" :song="song" />
        </ol>
        <!-- .. end Playlist -->
      </div>
    </section>
  </main>
</template>
<script>
import { songsCollection } from '@/includes/firebase'
import AppInroduction from '../components/AppInroduction.vue'
import SongItem from '../components/SongItem.vue'
import IconSecondary from '@/directives/icon_secondary'

export default {
  name: 'HomeView',
  components: {
    SongItem,
    AppInroduction
  },
  data() {
    return {
      songs: [],
      maxPerPage: 25,
      pendingRequests: false
    }
  },
  directives: {
    'icon-secondary': IconSecondary
  },
  async created() {
    this.getSongs()

    window.addEventListener('scroll', this.handleScroll)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  computed: {
    title() {
      return this.$t('home.listen')
    },
    description() {
      return this.$t('home.description')
    }
  },
  methods: {
    handleScroll() {
      const { scrollTop, offsetHeight } = document.documentElement
      const { innerHeight } = window

      const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight

      if (bottomOfWindow) {
        this.getSongs()
      }
    },
    async getSongs() {
      if (this.pendingRequests) {
        return
      }

      this.pendingRequests = true

      let snapshots

      if (this.songs.length) {
        const lastDoc = await songsCollection.doc(this.songs[this.songs.length - 1].docID).get()

        snapshots = await songsCollection
          .orderBy('modified_name')
          .startAfter(lastDoc)
          .limit(this.maxPerPage)
          .get()
      } else {
        snapshots = await songsCollection.orderBy('modified_name').limit(this.maxPerPage).get()
      }

      snapshots.forEach((document) => {
        this.songs.push({
          docID: document.id,
          ...document.data()
        })
      })

      this.pendingRequests = false
    }
  }
}
</script>

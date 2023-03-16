<template>
  <main>
    <AppInroduction :title="title" :description="description" />

    <!-- Main Content -->
    <section class="container mx-auto">
      <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div
          class="px-6 pt-6 pb-5 font-bold border-b border-gray-200"
          v-icon-secondary="{ icon: 'headphones-alt', right: true }"
        >
          <span class="card-title">Songs</span>
          <!-- Icon -->
          <!--the icon becomes a directive-->
          <!--Global: v-icon.right.yellow="'headphones-alt'"-->
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
      pendingRequests: false,
      title: 'Listen to Great Music!',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus et dolor mollis, congue augue non, venenatis elit. Nunc justo eros, suscipit ac aliquet imperdiet, venenatis et sapien. Duis sed magna pulvinar, fringilla lorem eget, ullamcorper urna.'
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

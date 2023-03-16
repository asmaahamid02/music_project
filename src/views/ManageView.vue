<template>
  <!-- Main Content -->
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <UploadFile ref="uploadRef" @addSong="addSong" />
      </div>
      <div class="col-span-2">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">{{ $t('manage.title') }}</span>
            <i class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
          </div>
          <div class="p-6">
            <CompositionItem
              v-for="(song, i) in songs"
              :key="song.docID"
              :index="i"
              :song="song"
              @updateSong="updateSong"
              @removeSong="removeSong"
              @updateUnsavedFlag="updateUnsavedFlag"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import UploadFile from '../components/UploadFile.vue'
import CompositionItem from '../components/CompositionItem.vue'
import { songsCollection, auth } from '../includes/firebase'

// import useUserStore from '@/stores/user'
export default {
  name: 'ManageView',
  components: { UploadFile, CompositionItem },
  data() {
    return {
      songs: [],
      unsavedFlag: false
    }
  },
  async created() {
    const snapshot = await songsCollection.where('uid', '==', auth.currentUser.uid).get()

    snapshot.forEach(this.addSong)
  },
  methods: {
    updateSong(i, values) {
      this.songs[i].modified_name = values.modified_name
      this.songs[i].genre = values.genre
    },
    removeSong(i) {
      this.songs.splice(i, 1)
    },
    addSong(document) {
      const song = {
        ...document.data(),
        docID: document.id
      }

      this.songs.push(song)
    },
    updateUnsavedFlag(value) {
      this.unsavedFlag = value
    }
  },
  beforeRouteLeave(to, from, next) {
    if (!this.unsavedFlag) {
      next()
    } else {
      const leave = confirm(this.$t('manage.unsaved_changes'))
      next(leave)
    }
  }
  //   beforeRouteEnter(to, from, next) {
  //     console.log('beforeRouteEnter Guard')
  //     const userStore = useUserStore()
  //     if (userStore.userLoggedIn) {
  //       next()
  //     } else {
  //       next({ name: 'home' })
  //     }
  //   },
  // beforeRouteLeave(to, from, next) {
  //   this.$refs.uploadRef.cancelUploads()
  //   next()
  // }
}
</script>

<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title">{{ $t('manage.upload') }}</span>
      <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
    </div>
    <div class="p-6">
      <!-- Upload Dropbox -->
      <div
        class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-500 hover:text-white hover:bg-green-400 hover:border-green-400 hover:border-solid"
        :class="{ 'bg-green-400 border-green-400 border-solid': is_dragover }"
        @drag.prevent.stop=""
        @dragstart.prevent.stop=""
        @dragend.prevent.stop="is_dragover = false"
        @dragover.prevent.stop="is_dragover = true"
        @dragenter.prevent.stop="is_dragover = true"
        @dragleave.prevent.stop="is_dragover = false"
        @drop.prevent.stop="upload($event)"
      >
        <h5>{{ $t('manage.drop') }}</h5>
      </div>
      <input type="file" multiple @change="upload($event)" />
      <hr class="my-6" />
      <!-- Progess Bars -->
      <div class="mb-4" v-for="upload in uploads" :key="upload.name">
        <!-- File Name -->
        <div class="font-bold text-sm mb-2" :class="upload.text_class">
          <i :class="upload.icon"></i> {{ upload.name }}
        </div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <!-- Inner Progress Bar -->
          <div
            class="transition-all"
            :class="[upload.varient, upload.transition]"
            :style="{ width: upload.current_progress + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import { ref } from 'vue'
import { storage, auth, songsCollection } from '@/includes/firebase'
export default {
  name: 'UploadFile',
  data() {
    return {
      is_dragover: false,
      uploads: []
    }
  },
  emits: ['addSong'],
  methods: {
    upload($event) {
      this.is_dragover = false

      const files = $event.dataTransfer ? [...$event.dataTransfer.files] : [...$event.target.files]

      files.forEach((file) => {
        if (file.type != 'audio/mpeg') {
          return
        }

        //check online status
        if (!navigator.onLine) {
          this.uploads.push({
            task: {},
            current_progress: 100,
            name: file.name,
            varient: 'bg-red-400',
            icon: 'fas fa-times',
            text_class: 'text-red-400'
          })
          return
        }

        const storageRef = storage.ref() //return: music-79fd8.appspot.com
        const songsRef = storageRef.child(`songs/${file.name}`) //music-79fd8.appspot.com/songs/example.mp3

        const task = songsRef.put(file)

        const uploadIndex =
          this.uploads.push({
            task,
            current_progress: 0,
            name: file.name,
            varient: 'bg-blue-400',
            icon: 'fas fa-spinner fa-spin',
            text_class: '',
            transition: 'progress-bar'
          }) - 1

        task.on(
          'state_changes',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            this.uploads[uploadIndex].current_progress = progress
          },
          (error) => {
            //error
            this.uploads[uploadIndex].varient = 'bg-red-400'
            this.uploads[uploadIndex].icon = 'fas fa-times'
            this.uploads[uploadIndex].text_class = 'text-red-400'
            this.uploads[uploadIndex].transition = ''
            console.log(error)
          },
          async () => {
            //success
            const song = {
              uid: auth.currentUser.uid,
              display_name: auth.currentUser.displayName,
              original_name: task.snapshot.ref.name,
              modified_name: task.snapshot.ref.name,
              genre: '',
              comment_count: 0
            }

            song.url = await task.snapshot.ref.getDownloadURL()
            const songRef = await songsCollection.add(song)
            const songSnapshot = await songRef.get()

            this.$emit('addSong', songSnapshot)

            this.uploads[uploadIndex].varient = 'bg-green-400'
            this.uploads[uploadIndex].icon = 'fas fa-check'
            this.uploads[uploadIndex].text_class = 'text-green-400'
            this.uploads[uploadIndex].transition = ''
          }
        )
      })
    },
    cancelUploads() {
      this.uploads.forEach((upload) => upload.task.cancel())
    }
  },
  beforeUnmount() {
    //cancel request
    // this.uploads.forEach((upload) => upload.task.cancel())
    this.cancelUploads()
  }
  //   setup() {
  //     const is_dragover = ref(false)

  //     const upload = ($event) => {
  //       is_dragover.value = false

  //       const files = [...$event.dataTransfer.files]

  //       files.forEach((file) => {
  //         if (file.type != 'audio/mpeg') {
  //           return
  //         }
  //       })
  //     }
  //     return {
  //       is_dragover,
  //       upload
  //     }
  //   }
}
</script>

<template>
  <!-- Composition Items -->
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div v-show="!showForm">
      <h4 class="inline-block text-2xl font-bold">{{ song.modified_name }}</h4>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
        @click.prevent="deleteSong"
      >
        <i class="fa fa-times"></i>
      </button>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
        @click.prevent="showForm = !showForm"
      >
        <i class="fa fa-pencil-alt"></i>
      </button>
    </div>
    <div v-show="showForm">
      <div
        class="text-white text-center font-bold mb-4 p-4 rounded"
        :class="alert_variant"
        v-if="show_alert"
      >
        {{ alert_message }}
      </div>
      <VeeForm :validation-schema="schema" :initial-values="song" @submit="edit">
        <div class="mb-3">
          <label class="inline-block mb-2">Song Title</label>
          <VeeField
            type="text"
            name="modified_name"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Song Title"
            @input="$emit('updateUnsavedFlag', true)"
          />
          <ErrorMessage class="text-red-600" name="modified_name" />
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">Genre</label>
          <VeeField
            type="text"
            name="genre"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Genre"
            @input="$emit('updateUnsavedFlag', true)"
          />
          <ErrorMessage class="text-red-500" name="genre" />
        </div>
        <button
          type="submit"
          class="py-1.5 px-3 rounded text-white bg-green-600"
          :disabled="in_submission"
        >
          Submit
        </button>
        <button
          type="button"
          class="py-1.5 px-3 rounded text-white bg-gray-600"
          :disabled="in_submission"
          @click.prevent="showForm = false"
        >
          Go Back
        </button>
      </VeeForm>
    </div>
  </div>
</template>

<script>
import { songsCollection, storage } from '../includes/firebase'

export default {
  name: 'CompositionItem',
  props: {
    song: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  emits: ['updateSong', 'removeSong', 'updateUnsavedFlag'],
  data() {
    return {
      showForm: false,
      schema: {
        modified_name: 'required',
        genre: 'alpha_spaces'
      },
      in_submission: false,
      show_alert: false,
      alert_variant: 'bg-blue-500',
      alert_message: 'Please wait! Updating song info..'
    }
  },
  methods: {
    async edit(values) {
      this.in_submission = true
      this.show_alert = true
      this.alert_variant = 'bg-blue-500'
      this.alert_message = 'Please wait! Updating song info..'

      try {
        await songsCollection.doc(this.song.docID).update(values)
      } catch (e) {
        this.in_submission = false

        this.alert_variant = 'bg-red-500'
        this.alert_message = 'Something went wrong! Try again later'
        return
      }

      this.$emit('updateSong', this.index, values)
      this.$emit('updateUnsavedFlag', false)

      this.in_submission = false
      this.alert_variant = 'bg-green-500'
      this.alert_message = 'Success!'
    },
    async deleteSong() {
      try {
        const storageRef = storage.ref()
        const songRef = storageRef.child(`songs/${this.song.original_name}`)
        await songRef.delete()
      } catch (e) {
        console.log(e)
      }

      await songsCollection.doc(this.song.docID).delete()

      this.$emit('removeSong', this.index)
    }
  }
}
</script>

<style lang="scss" scoped></style>

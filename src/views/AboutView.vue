<template>
  <main>
    <AppInroduction :title="title" :description="description" />

    <div class="about">
      <h1>This is an about page</h1>
      <base-primary-button />
    </div>
  </main>
</template>
<script>
import AppInroduction from '@/components/AppInroduction.vue'
export default {
  name: 'AboutView',
  components: {
    AppInroduction
  },
  computed: {
    title() {
      return this.$t('about.title')
    },
    description() {
      return this.$t('about.description')
    }
  }
}
</script>
<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>

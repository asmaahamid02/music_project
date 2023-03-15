<template>
  <AppInroduction :title="title" :description="description" />

  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>
<script>
import AppInroduction from '@/components/AppInroduction.vue'
export default {
  name: 'AboutView',
  components: {
    AppInroduction
  },
  data() {
    return {
      title: 'About Us!',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus et dolor mollis, congue augue non, venenatis elit. Nunc justo eros, suscipit ac aliquet imperdiet, venenatis et sapien. Duis sed magna pulvinar, fringilla lorem eget, ullamcorper urna.'
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

<template>
  <AppHeader />

  <RouterView v-slot="{ Component }">
    <Transition name="fade" mpde="out-in">
      <component :is="Component"> </component>
    </Transition>
  </RouterView>

  <SongPlayer />

  <AppAuth />
</template>
<script>
import AppHeader from './components/AppHeader.vue'
import AppAuth from './components/AppAuth.vue'
import SongPlayer from './components/SongPlayer.vue'
import useUserStore from '@/stores/user'
import { mapWritableState } from 'pinia'
import { auth } from '@/includes/firebase'

export default {
  name: 'App',
  components: {
    AppHeader,
    AppAuth,
    SongPlayer
  },
  computed: {
    ...mapWritableState(useUserStore, ['userLoggedIn'])
  },
  created() {
    if (auth.currentUser) {
      this.userLoggedIn = true
    }
  }
}
</script>
<style>
.fade-enter-from {
  opacity: 0;
}

.fade-enter-active {
  transition: all 0.5s linear;
}

.fade-leave-to {
  transition: all 0.5s linear;
  opacity: 0;
}
</style>

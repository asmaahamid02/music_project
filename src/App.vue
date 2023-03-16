<template>
  <AppHeader />

  <!--route transition-->
  <RouterView v-slot="{ Component }">
    <Transition name="fade" mode="out-in">
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
import useLocaleStore from '@/stores/locale'
import { mapWritableState, mapActions } from 'pinia'
import { auth } from '@/includes/firebase'

export default {
  name: 'App',
  components: {
    AppHeader,
    AppAuth,
    SongPlayer
  },
  computed: {
    ...mapWritableState(useUserStore, ['userLoggedIn']),
    ...mapWritableState(useLocaleStore, ['locale'])
  },
  methods: {
    ...mapActions(useLocaleStore, ['changeLocale'])
  },
  created() {
    if (auth.currentUser) {
      this.userLoggedIn = true
    }
    const savedLocale = localStorage.getItem('locale') || 'en'
    if (this.locale !== savedLocale) this.changeLocale(savedLocale)
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

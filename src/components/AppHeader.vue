<template>
  <!-- Header -->
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <!-- App Name -->
      <RouterLink
        :to="{ name: 'home' }"
        class="text-white font-bold uppercase text-2xl mr-4"
        exact-active-class="no-active"
        >Music</RouterLink
      >

      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-1">
          <!-- Navigation Links -->
          <li>
            <RouterLink :to="{ name: 'about' }" class="px-2 text-white">{{
              $t('header.about')
            }}</RouterLink>
          </li>
          <li v-if="!userStore.userLoggedIn">
            <a class="px-2 text-white" href="#" @click.prevent="toggleAuthModal">{{
              $t('header.login_register')
            }}</a>
          </li>
          <template v-else>
            <li>
              <RouterLink :to="{ name: 'manage' }" class="px-2 text-white">{{
                $t('header.manage')
              }}</RouterLink>
            </li>
            <li>
              <a class="px-2 text-white" href="#" @click.prevent="signOut">{{
                $t('header.logout')
              }}</a>
            </li>
          </template>
        </ul>
        <ul class="ml-auto">
          <li>
            <a class="text-white px-2" href="#" @click.prevent="changeLang">
              {{ current_local }}
            </a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
import useModalStore from '@/stores/modal'
import useUserStore from '@/stores/user'
import useLocaleStore from '@/stores/locale'
import { mapStores, mapActions } from 'pinia'
// import { setLocale } from '@vee-validate/i18n'

export default {
  name: 'AppHeader',
  computed: {
    ...mapStores(useModalStore, useUserStore, useLocaleStore),
    current_local() {
      return this.localeStore.locale === 'en' ? 'English' : 'العربية'
    }
  },
  methods: {
    toggleAuthModal() {
      this.modalStore.isOpen = !this.modalStore.isOpen
    },
    signOut() {
      this.userStore.signOut()

      // if (this.$route.name === 'manage')
      if (this.$route.meta.requiresAuth) this.$router.push({ name: 'home' })
    },
    changeLang() {
      this.changeLocale(this.localeStore.locale === 'en' ? 'ar' : 'en')
    },
    ...mapActions(useLocaleStore, ['changeLocale'])
  }
}
</script>

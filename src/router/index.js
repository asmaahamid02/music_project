import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import ManageView from '@/views/ManageView.vue'
import SongView from '@/views/SongView.vue'
import useUserStore from '@/stores/user'

const routes = [
  {
    name: 'home',
    path: '/',
    component: HomeView
  },
  {
    name: 'about',
    path: '/about',
    component: AboutView
  },
  {
    name: 'manage',
    // alias: '/manage', //instead of redirecting
    path: '/manage-music',
    component: ManageView,
    beforeEnter: (to, from, next) => {
      console.log('Manage Rout Guard')
      next()
    },
    meta: {
      requiresAuth: true
    }
  },
  {
    //better for SEO than aliases
    path: '/manage',
    redirect: { name: 'manage' }
  },
  {
    path: '/song/:id',
    name: 'song',
    component: SongView
  },
  {
    path: '/:catchAll(.*)*',
    redirect: { name: 'home' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkExactActiveClass: 'text-yellow-500'
})

router.beforeEach((to, from, next) => {
  // console.log('Global Guard')

  if (!to.meta.requiresAuth) {
    next()
    return
  }

  const userStore = useUserStore()

  if (userStore.userLoggedIn) {
    next()
  } else {
    next({ name: 'home' })
  }
})
export default router

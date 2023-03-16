<template>
  <!-- Login Form -->
  <div
    class="text-white text-center font-bold p-4 rounded mb-4"
    v-if="login_show_alert"
    :class="login_alert_variant"
  >
    {{ login_alert_msg }}
  </div>
  <VeeForm :validation-schema="loginSchema" @submit="login">
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{ $t('auth.email') }}</label>
      <VeeField
        type="email"
        name="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        :placeholder="$t('auth.email')"
      />
      <ErrorMessage class="text-red-600" name="email" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{ $t('auth.password') }}</label>
      <VeeField
        type="password"
        name="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        :placeholder="$t('auth.password')"
      />
      <ErrorMessage class="text-red-600" name="password" />
    </div>
    <button
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
      :disabled="login_in_submission"
    >
      {{ $t('auth.submit') }}
    </button>
  </VeeForm>
</template>

<script>
import { mapActions } from 'pinia'
import useUserStore from '@/stores/user'
export default {
  name: 'LoginForm',
  data() {
    return {
      loginSchema: {
        email: 'required|email|min:3|max:100',
        password: 'required|min:10|max:100|is_not:password'
      },
      login_in_submission: false,
      login_show_alert: false,
      login_alert_msg: 'Please wait! We are logging you in.',
      login_alert_variant: 'bg-blue-500'
    }
  },
  methods: {
    ...mapActions(useUserStore, ['authenticate']),
    async login(values) {
      this.login_in_submission = true
      this.login_show_alert = true
      this.login_alert_variant = 'bg-blue-500'
      this.login_alert_msg = 'Please wait! We are logging you in.'

      try {
        await this.authenticate(values)
      } catch (error) {
        this.login_alert_variant = 'bg-red-500'
        this.login_in_submission = false
        this.login_alert_msg = 'E-mail/Password is incorrect.'

        return
      }

      this.login_alert_msg = 'Success! You are now logged in.'
      this.login_alert_variant = 'bg-green-500'

      window.location.reload()
    }
  }
}
</script>

<style lang="scss" scoped></style>

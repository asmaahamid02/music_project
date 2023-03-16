<template>
  <!-- Registration Form -->
  <div
    class="text-white text-center font-bold p-4 rounded mb-4"
    v-if="reg_show_alert"
    :class="reg_alert_variant"
  >
    {{ reg_alert_msg }}
  </div>
  <VeeForm :validation-schema="schema" :initial-values="userData" @submit="register">
    <!-- Name -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{ $t('auth.name') }}</label>
      <VeeField
        type="text"
        name="name"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        :placeholder="$t('auth.name')"
      />
      <ErrorMessage class="text-red-600" name="name" />
    </div>
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
    <!-- Age -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{ $t('auth.age') }}</label>
      <VeeField
        type="number"
        name="age"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      />
      <ErrorMessage class="text-red-600" name="age" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{ $t('auth.password') }}</label>
      <VeeField name="password" :bails="false" v-slot="{ field, errors }">
        <input
          type="password"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          v-bind="field"
          :placeholder="$t('auth.password')"
        />
        <div class="text-red-600" v-for="error in errors" :key="error">{{ error }}</div>
      </VeeField>
      <!-- <ErrorMessage class="text-red-600" name="password" /> -->
    </div>
    <!-- Confirm Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{ $t('auth.confirm_password') }}</label>
      <VeeField
        type="password"
        name="confirm_password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        :placeholder="$t('auth.confirm_password')"
      />
      <ErrorMessage class="text-red-600" name="confirm_password" />
    </div>
    <!-- Country -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{ $t('auth.country') }}</label>
      <VeeField
        as="select"
        name="country"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      >
        <option value="USA">USA</option>
        <option value="Mexico">Mexico</option>
        <option value="Germany">Germany</option>
        <option value="Antarctica">Antarctica</option>
      </VeeField>
      <ErrorMessage class="text-red-600" name="country" />
    </div>
    <!--Type of Music-->
    <div class="mb-3">
      <label class="inline-block mb-2">{{ $t('auth.genre') }}</label>
      <VeeField
        as="select"
        name="genre"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      >
        <option value="Rock">Rock</option>
        <option value="Pop">Pop</option>
        <option value="Jazz">Jazz</option>
        <option value="Classical">Classical</option>
      </VeeField>
      <ErrorMessage class="text-red-600" name="genre" />
    </div>
    <!-- TOS -->
    <div class="mb-3 pl-6">
      <VeeField
        type="checkbox"
        name="tos"
        class="w-4 h-4 float-left -ml-6 mt-1 rounded"
        value="1"
      />
      <i18n-t class="inline-block" keypath="auth.accept" tag="label">
        <a href="#">{{ $t('auth.tos') }}</a>
      </i18n-t>
      <ErrorMessage class="text-red-600 block" name="tos" />
    </div>
    <button
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
      :disabled="reg_in_submission"
    >
      {{ $t('auth.submit') }}
    </button>
  </VeeForm>
</template>

<script>
import useUserStore from '@/stores/user'
import { mapActions } from 'pinia'

export default {
  name: 'RegisterForm',
  data() {
    return {
      schema: {
        name: 'required|min:3|max:100|alpha_spaces',
        email: 'required|email|min:3|max:100',
        age: 'required|min_value:18|max_value:100',
        password: 'required|min:10|max:100|is_not:password',
        confirm_password: 'required|password_mismatch:@password',
        country: 'required|is_not_country:Antarctica',
        tos: 'tos',
        genre: 'required'
      },
      userData: {
        country: 'USA',
        genre: 'Rock'
      },
      reg_in_submission: false,
      reg_show_alert: false,
      reg_alert_msg: '',
      reg_alert_variant: 'bg-blue-500'
    }
  },
  methods: {
    ...mapActions(useUserStore, {
      createUser: 'register'
    }),
    async register(values) {
      this.reg_in_submission = true
      this.reg_show_alert = true
      this.reg_alert_msg = `${this.$t('action_messages.wait')} ${this.$t(
        'action_messages.registering'
      )}`
      this.reg_alert_variant = 'bg-blue-500'

      try {
        await this.createUser(values)
      } catch (error) {
        this.reg_in_submission = false
        this.reg_alert_variant = 'bg-red-500'
        if (error.code === 'auth/email-already-in-use')
          this.reg_alert_msg = `${this.$t('action_messages.email_already_exists')}`
        else this.reg_alert_msg = `${this.$t('action_messages.error')}`
        console.log(error)
        return
      }

      this.reg_alert_variant = 'bg-green-500'
      this.reg_alert_msg = `${this.$t('action_messages.success')} ${this.$t(
        'action_messages.register'
      )}`

      window.location.reload()
    }
  }
}
</script>

<style lang="scss" scoped></style>

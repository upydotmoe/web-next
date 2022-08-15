<template>
  <form
    id="login"
    class="auth-form"
    @submit.prevent="login('login')"
  >
    <!-- login error message, show this alert when error occured while authenticating user -->
    <div v-if="loginErr" class="login-error-message">
      {{ loginErrMessage }}
    </div>

    <!-- email or username -->
    <n-validate 
      for="emailUsername" 
      :name="$t('logins.form.email_username')"
    >
      <input 
        v-model="inputs.emailUsername"
        type="text"
        rules="required|email"
        :placeholder="$t('logins.form.email_username')"
      >
    </n-validate>

    <!-- password -->
    <n-validate 
      for="password" 
      :name="$t('logins.form.password')"
    >
      <input
        v-model="inputs.password"
        type="password"
        autocomplete="off"
        rules="required|min:6|containSymbol|containNumber"
        :placeholder="$t('logins.form.password')"
      >
    </n-validate>

    <div 
      class="w-full text-right font-medium cursor-pointer icon-color"
      @click="toggleAccountRecoveryForm"
    >
      {{ $t('forgotPassword') }}
    </div>

    <button type="submit" class="w-full mt-4 primary-button">
      {{ $t('logins.login').toUpperCase() }}
    </button>
  </form>
</template>

<script setup>
import axios from 'axios';
import { useI18n } from 'vue-i18n'

// stores
import useAuthFormStore from '@/stores/auth-form.store'
import useAuthStore from '@/stores/auth.store'

const authFormStore = useAuthFormStore()
const auth = useAuthStore()

const { oApiConfiguration, fetchOptions } = useApiFetch()
const authApi = useAuth(oApiConfiguration, fetchOptions())

const { $router } = useNuxtApp()
const { t } = useI18n()

/**
 * @visiblity
 * Visiblity function to show and hide the login form or switching to other form like Registration form or Account Recovery form.
 */
const showForm = computed(() => authFormStore.showLogin)
const showRegistrationForm = computed(() => authFormStore.showRegistration)

const toggleAccountRecoveryForm = async () => await authFormStore.toggleAccountRecovery()
/**
 * @visibility
 */

/**
 * @form
 */
const inputs = ref({
  emailUsername: '',
  password: ''
})

/**
 * Authenticate user input and redirect to dashboard if success
 */
const login = async () => {
  // clear previous error message
  authFormStore.resetErr()
  loginErrMessage.value = ''

  // validate input before going to the next step
  validateForm()

  // proceed to validate user login information
  const [success, error] = await authApi.authenticate({
    emailUsername: inputs.value.emailUsername,
    password: inputs.value.password
  })

  if (success) {
    useModal().closeModal('auth-modal')

    $router.push('/feed')
  } else {
    triggerLoginError(error.message)
  }
}

/**
 * Validate form input before proceeding to the next step
 */
const validateForm = () => {
  const loginEl = document.getElementById('login')
  useValidator().validate(loginEl, t)
}
/**
 * @login
 */

/**
 * @errorHandling
 */
const loginErr = computed(() => authFormStore.loginErr)
const loginErrMessage = ref('')
const triggerLoginError = async (message) => {
  await authFormStore.triggerLoginErr()
  loginErrMessage.value = message
}
/**
 * @errorHandling
 */

/**
 * Watch for form show/hide changes, if it's switched then reset the form value
 */
watch (showForm, () => {
  resetForm()
})

/**
 * Reset login form inputs
 */
const resetForm = () => {
  // inputs.value.emailUsername = ''
  // inputs.value.password = ''
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/auth-form.scss';
</style>
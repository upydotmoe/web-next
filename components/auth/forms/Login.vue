<template>
  <form
    v-show="showForm"
    :id="formId"
    class="auth-form"
    @submit.prevent="login(formId)"
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
        rules="required"
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
        rules="required|min:6|containNumber|containSymbol"
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
import { useI18n } from 'vue-i18n'

// stores
import useAuthStore from '@/stores/auth-form.store'

// stores
const authForm = useAuthStore()

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const authApi = useAuth(oApiConfiguration, fetchOptions())

const { t } = useI18n()

const { $router } = useNuxtApp()

/**
 * @visiblity
 * Visiblity function to show and hide the login form or switching to other form like Registration form or Account Recovery form.
 */
const toggleAccountRecoveryForm = async () => {
  await authForm.toggleAccountRecovery()
  useValidator().clear()
}
/**
 * @visibility
 */

/**
 * @form
 */
const formId = 'login-form'
const inputs = ref({
  emailUsername: '',
  password: ''
})

/**
 * Authenticate user input and redirect to dashboard if success
 */
const login = async () => {
  // clear previous error message
  authForm.resetErr()
  loginErrMessage.value = ''

  // validate input before going to the next step
  useValidator().validate(formId, t)

  // proceed to validate user login information
  const [success, error] = await authApi.authenticate({
    emailUsername: inputs.value.emailUsername,
    password: inputs.value.password
  })

  if (success) {
    useModal().closeModal('auth-modal')

    $router.push('/feed')
  } else {
    triggerLoginError(error)
  }
}

/**
 * @login
 */

/**
 * @errorHandling
 */
const loginErr = computed(() => authForm.loginErr)
const loginErrMessage = ref('')
const triggerLoginError = async (message) => {
  await authForm.triggerLoginErr()
  loginErrMessage.value = message
}
/**
 * @errorHandling
 */

/**
 * Watch for form show/hide changes, if it's switched then reset the form value
 */
const showForm = computed(() => authForm.showLogin)
watch (() => authForm.showLogin, () => {
  resetForm()
})

/**
 * Reset login form inputs
 */
const resetForm = () => {
  inputs.value.emailUsername = ''
  inputs.value.password = ''
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/auth-form.scss';
</style>
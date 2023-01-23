<template>
  <form
    v-show="showForm"
    :id="formId"
    @submit.prevent="login(formId)"
  >
    <ErrorMessage
      :is-error="error ? true : false"
      :error-message="error"
    />

    <n-validate 
      for="username"
      :name="$t('logins.form.username')"
    >
      <input 
        v-model="inputs.username"
        type="text"
        rules="required|min:4|max:12"
        class="input-color-secondary"
        :placeholder="$t('logins.form.username')"
      >
    </n-validate>

    <n-validate 
      for="password" 
      :name="$t('logins.form.password')"
    >
      <input
        v-model="inputs.password"
        type="password"
        autocomplete="off"
        rules="required|min:6|containNumber|containSymbol"
        class="input-color-secondary"
        :placeholder="$t('logins.form.password')"
      >
    </n-validate>

    <div 
      class="w-full font-medium text-right cursor-pointer icon-color"
      @click="toggleAccountRecoveryForm"
    >
      {{ $t('forgotPassword') }}
    </div>

    <!-- CF turnstile captcha -->
    <div class="flex flex-row justify-center mt-2 w-full">
      <Turnstile
        v-model="token"
        :options="{
          theme: 'dark'
        }"
      />
    </div>

    <input
      type="submit"
      :value="$t('logins.login').toUpperCase()"
    >
  </form>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

// stores
import useAuthStore from '@/stores/auth-form.store'

// components
import ErrorMessage from './ErrorMessage.vue'

// stores
const authStore = useAuthStore()

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const authApi = useAuth(oApiConfiguration, fetchOptions())

const router = useRouter()
const { t } = useI18n()

const showForm = computed(() => authStore.showLogin)
watch (() => authStore.showLogin, () => {
  reset()
})

const toggleAccountRecoveryForm = async () => {
  await authStore.toggleAccountRecovery()
  useValidator().clear()
}

/**
 * @form
 */
const formId = 'login-form'
const inputs = ref({
  username: '',
  password: ''
})
const error = ref('')

const login = async () => {
  error.value = ''

  // validate input before going to the next step
  useValidator().validate(formId, t)

  // proceed to validate user login information
  const [success, authError] = await authApi.authenticate({
    username: inputs.value.username,
    password: inputs.value.password
  })

  if (authError) {
    error.value = authError
  } else {
    useModal().closeModal('auth-modal')
    router.push({
      path: '/feed',
      replace: true,
      force: true
    })
  }
}

const reset = () => {
  inputs.value.username = ''
  inputs.value.password = ''
  error.value = ''
}
</script>
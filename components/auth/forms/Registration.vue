<template>
  <div v-show="showForm" class="w-full">
    <div v-if="registerAlert.active" class="w-full rounded-md text-white p-2 bg-red-500 mb-2">
      {{ registerAlert.message }}
    </div>

    <form
      v-show="!showRegistrationSuccessDialog"
      :id="formId"
      @submit.prevent="proceed(formId)"
    >
      <n-validate 
        for="email"
        :name="$t('registration.form.email')"
      >
        <input
          v-model="formData.email"
          type="text"
          autocomplete="off"
          rules="required|email"
          class="form-input theme-color-secondary"
          :placeholder="$t('registration.form.email')"
        >
      </n-validate>

      <n-validate 
        for="username"
        :name="$t('registration.form.username')"
      >
        <input
          v-model="formData.username"
          type="text"
          autocomplete="off"
          rules="required|min:4|max:12"
          class="form-input theme-color-secondary"
          :placeholder="$t('registration.form.username')"
        >
      </n-validate>

      <n-validate 
        for="name"
        :name="$t('registration.form.name')"
      >
        <input
          v-model="formData.name"
          type="text"
          autocomplete="off"
          rules="required"
          class="form-input theme-color-secondary"
          :placeholder="$t('registration.form.name')"
        >
      </n-validate>

      <n-validate 
        for="password"
        :name="$t('registration.form.password')" 
      >
        <input
          v-model="formData.password"
          type="password"
          autocomplete="off"
          rules="required|containNumber|containSymbol"
          class="form-input theme-color-secondary"
          :placeholder="$t('registration.form.password')"
        >
      </n-validate>

      <button type="submit" class="primary-button float-right mt-4 w-full">
        {{ $t('registration.register').toUpperCase() }}
      </button>
    </form>

    <div v-show="showRegistrationSuccessDialog" id="success-dialog" class="w-full text-center">
      <div class="mb-4">
        {{ $t('registration.form.registered.accountCreatedInfo') }}
      </div>
      <div>
        {{ $t('registration.form.registered.didNotReceiveVerificationLink') }}
        <span class="font-medium cursor-pointer link-color" @click="resendEmailActivationInstruction()">Resend</span>
      </div>

      <div v-show="showResendNotification" class="w-full mt-4 rounded-md text-white p-2 bg-green-500">
        {{ $t('registration.form.registered.verificationLinkSent') }}
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { useI18n } from 'vue-i18n'

// stores
import useAuthFormStore from '@/stores/auth-form.store'

// stores
const authFormStore = useAuthFormStore()

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const authApi = useAuth(oApiConfiguration, fetchOptions())

const runtimeConfig = useRuntimeConfig()
const { t } = useI18n()

const showForm = computed(() => authFormStore.showRegistration)
watch (() => authFormStore.showRegistration, () => {
  resetForm()
})

const registerAlert = ref({
  active: computed(() => authFormStore.registerAlert),
  message: ''
})

const showRegistrationSuccessDialog = computed(() => authFormStore.showRegistrationSuccessDialog)
const showResendNotification = ref(false)
const registeredMail = ref('')

// input data
const initialValue = {
  username: runtimeConfig.public.dev ? 'rkgkmoe' : '',
  email: runtimeConfig.public.dev ? 'rkgk.moe@gmail.com' : '',
  name: runtimeConfig.public.dev ? 'Rkgk Moe' : '',
  gender: runtimeConfig.public.dev ? 'm' : 'm',
  password: runtimeConfig.public.dev ? 'password123!' : ''
}
const formData = reactive({ ...initialValue })

// reset inputted data everytime user switched to login form
const resetForm = () => {
  // reset err
  authFormStore.resetErr()

  Object.assign(formData, { ...initialValue })
}

const formId = 'user-registration-form'
const proceed = async () => {
  useValidator().validate(formId, t)

  const [success, error] = await authApi.registerNewAccount({
    email: formData.email,
    password: formData.password,
    username: formData.username,
    name: formData.name
  })

  if (error) {
    showError(error)
  } else {
    registeredMail.value = formData.email
    resetForm()
    authFormStore.toggleSuccessDialog(true)
  }
}
const showError = async (message) => {
  authFormStore.triggerRegisterAlert()
  registerAlert.value.message = message
}

const resendEmailActivationInstruction = async () => {
  showResendNotification.value = false

  const [success, error] = await authApi.resendVerificationLink(registeredMail.value)

  if (error) {
    showResendNotification.value = true
  } else {
    setTimeout(() => {
      showResendNotification.value = true
    }, 1500)
  }
}
</script>

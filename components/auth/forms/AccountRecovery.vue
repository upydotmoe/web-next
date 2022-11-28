<template>
  <div v-show="showForm || directMode" class="w-full">
    <div v-show="!showRecoveryLinkSentDialog" class="text-base mb-2">
      {{ $t('accountRecovery.form.recoverYourPassword') }}
    </div>

    <form
      v-show="!showRecoveryLinkSentDialog"
      :id="formId"
      @submit.prevent="proceed(formId)"
    >
      <n-validate
        for="email"
        :name="$t('accountRecovery.form.email')"
      >
        <input 
          v-model="inputData.email" 
          type="email" 
          rules="required|email"
          :class="[
            'form-input',
            { 'theme-color-secondary': !directMode }
          ]"
          :placeholder="$t('accountRecovery.form.email')"
        >
      </n-validate>

      <button
        type="submit"
        class="float-right primary-button mt-2"
      >
        {{ $t('next') }}
      </button>
    </form>

    <div v-show="showRecoveryLinkSentDialog" class="w-full text-center">
      <div class="mb-4">
        {{ $t('accountRecovery.form.recoveryLinkSentInfo') }}
      </div>
      <div>
        {{ $t('accountRecovery.form.didNotReceiveRecoveryLink') }}
        <span class="font-medium cursor-pointer link-color" @click="resend">{{ $t('accountRecovery.form.resend') }}</span>
      </div>

      <div v-show="showResendInfo" class="w-full mt-4 rounded-md text-white p-2 bg-green-500">
        {{ $t('accountRecovery.form.recoveryLinkSent') }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

// stores
import useAuthFormStore from '@/stores/auth-form.store'

// stores
const authForm = useAuthFormStore()

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const authApi = useAuth(oApiConfiguration, fetchOptions())

const { t } = useI18n()

const props = defineProps ({
  directMode: {
    type: Boolean,
    default: false
  }
})

const showForm = computed(() => authForm.showAccountRecovery)

const initAlert = {
  show: false,
  message: ''
}
const alert = reactive({ ...initAlert })

const showRecoveryLinkSentDialog = computed(() => authForm.showRecoveryLinkSentDialog)
const showResendInfo = ref(false)

const formId = 'account-recovery-form' + (props.directMode ?? '-direct')
const initialValue = {
  email: ''
}
const inputData = reactive({ ...initialValue })
const cachedEmail = ref('')
const proceed = async () => {
  useValidator().validate(formId, t)

  cachedEmail.value = inputData.email

  const [success, error] = await authApi.recoverAccount(cachedEmail.value)

  if (error) {
    triggerErrorMessage(error)
  } else {
    setTimeout(async () => {
      authForm.toggleShowRecoveryLinkSentDialog(true)
    }, 1500)
  }
}
const triggerErrorMessage = async (message) => {
  authForm.triggerAccountRecoveryAlert()
  alert.show = true
  alert.message = message
}
const _showResendInfo = () => {
  return setTimeout(() => {
    showResendInfo.value = true
  }, 1500)
}

const resend = () => {
  showResendInfo.value = false
  proceed()
  _showResendInfo()
}

watch (showForm, () => {
  resetForm()
  showResendInfo.value = false
  Object.assign(alert, { ...initAlert })
})
const resetForm = () => {
  Object.assign(inputData, { ...initialValue })
}
</script>

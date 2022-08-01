<template>
  <div v-show="showForm || directMode" class="w-full">
    <div v-show="!showRecoveryLinkSentDialog" class="text-base mb-2">
      {{ $t('accountRecovery.form.recoverYourPassword') }}
    </div>

    <!-- VV -->

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
defineProps({
  directMode: {
    type: Boolean,
    default: false
  }
})

const store = useStore()
const { $axios } = useContext()

const showForm = computed(() => store.state.authForm.showAccountRecovery)

const initAlert = {
  show: false,
  message: ''
}
const alert = reactive({ ...initAlert })

const showRecoveryLinkSentDialog = computed(() => store.state.authForm.showRecoveryLinkSentDialog)
const showResendInfo = ref(false)

const initialValue = {
  email: ''
}
const inputData = reactive({ ...initialValue })
const cachedEmail = ref('')
const proceed = async () => {
  cachedEmail.value = inputData.email

  try {
    const response = await $axios.post('user/password/forgot', { email: cachedEmail.value })

    if (response.status === 200) {
      setTimeout(async () => {
        await store.commit('authForm/toggleShowRecoveryLinkSentDialog', true)
      }, 1500)
    } else {
      triggerErrorMessage(response.data.message)
    }
  } catch (error) {
    triggerErrorMessage(error.response.data.message)
  }
}
const triggerErrorMessage = async (message) => {
  await store.commit('authForm/triggerAccountRecoveryAlert')
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

watch(showForm, () => {
  resetForm()
  showResendInfo.value = false
  Object.assign(alert, { ...initAlert })
})
const resetForm = () => {
  Object.assign(inputData, { ...initialValue })
}
</script>

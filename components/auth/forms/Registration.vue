<template>
  <div v-show="showForm" class="w-full">
    <!-- VV -->

    <div v-show="showRegistrationSuccessDialog" id="success-dialog" class="w-full text-center">
      <div class="mb-4">
        {{ $t('registration.form.registered.accountCreatedInfo') }}
      </div>
      <div>
        {{ $t('registration.form.registered.didNotReceiveVerificationLink') }}
        <span class="font-medium cursor-pointer link-color" @click="resendEmailActivationInstruction">Resend</span>
      </div>

      <div v-show="showResendNotification" class="w-full mt-4 rounded-md text-white p-2 bg-green-500">
        {{ $t('registration.form.registered.verificationLinkSent') }}
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'

// stores
import useAuthFormStore from '@/stores/auth-form.store'

const authFormStore = useAuthFormStore()

const showForm = computed(() => authFormStore.showRegistration)
const registerAlert = reactive({
  active: computed(() => authFormStore.registerAlert),
  message: ''
})

const showRegistrationSuccessDialog = computed(() => authFormStore.showRegistrationSuccessDialog)
const showResendNotification = ref(false)
const registeredMail = ref('')

// input data
const initialValue = {
  username: '',
  email: '',
  name: '',
  gender: 'm',
  password: ''
}
const formData = reactive({ ...initialValue })

// reset inputted data everytime user switched to login form
watch(showForm, () => {
  resetForm()
})
const resetForm = () => {
  Object.assign(formData, { ...initialValue })
}

const proceed = async () => {
  try {
    const response = await axios.post('/auth/registration/register', formData)

    if (response.status === 201) {
      registeredMail.value = formData.email
      resetForm()
      authFormStore.toggleSuccessDialog(true)
    } else {
      triggerRegisterAlert(response.data.message)
    }
  } catch (error) {
    const errorResponse = error.response
    triggerRegisterAlert(errorResponse.data.message)
  }
}
const triggerRegisterAlert = async (message) => {
  authFormStore.triggerRegisterAlert()
  registerAlert.message = message
}

const resendEmailActivationInstruction = async () => {
  try {
    showResendNotification.value = false
    await $axios.post('/auth/registration/resend-verification', JSON.stringify({ email: registeredMail.value }), {
      headers: {
        'Content-type': 'application/json'
      }
    })
    setTimeout(() => {
      showResendNotification.value = true
    }, 1500)
  } catch (error) {
    showResendNotification.value = true
  }
}
</script>

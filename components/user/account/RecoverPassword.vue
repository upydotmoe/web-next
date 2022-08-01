<template>
  <Layout 
    :with-footer="false" 
    :hide-side="true"
  >
    <div class="w-1/3 mx-auto rounded p-2 pt-4">
      <div class="">
        <div v-if="!showSuccess" class="text-base mb-2">
          {{ $t('accountRecovery.resetPassword') }}
        </div>
        
        <!-- VV -->
      </div>
    </div>
  </Layout>
</template>

<script setup>
// components
import Layout from '~/components/layouts/Layout.vue'

// API
import {
  UserForgotPasswordApi
} from '~/api/openapi/api'

// composables
import useApiFetch from '~/composables/useApiFetch'

const { route, redirect, app } = useContext()
const { iv, content } = route.value.params

// composables
const { oApiConfiguration } = useApiFetch()

onMounted(() => {
  checkTokenValidity()
})

const checkTokenValidity = async () => {
  try {
    const { data } = await new UserForgotPasswordApi(oApiConfiguration)
      .checkResetPasswordTokenValidity(iv, content)

    if (!data.valid) {
      redirect(app.localePath('/'))
    }
  } catch (error) {
    redirect(app.localePath('/'))
  }
}

const newPassword = ref('')
const reNewPassword = ref('')

const showErrorMessage = ref(false)
const errorMessage = ref('')
const showSuccess = ref(false)
const reset = async () => {
  showSuccess.value = false
  showErrorMessage.value = false

  await new UserForgotPasswordApi(oApiConfiguration)
    .recoverChangePassword({
      iv,
      content,
      new_password: newPassword.value
    })
    .then(({ success, message }) => {
      if (success) {
        showSuccess.value = true
      } else {
        showError(message)
      }
    })
    .catch((error) => {
      error.text().then((err) => {
        const { message } = JSON.parse(err)
        showError(message)
      })
    })
}

const showError = (err) => {
  showErrorMessage.value = true
  errorMessage.value = err
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/tailwind.scss';
</style>

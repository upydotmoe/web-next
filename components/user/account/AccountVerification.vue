<template>
  <Layout :with-footer="false">
    <div class="mx-auto text-center">
      <div class="mb-4">
        {{ message }}
      </div>
      <span class="font-medium cursor-pointer link-color hover:underline"><a href="/">{{ $t('goToHome') }}</a></span>
      or
      <span class="font-medium cursor-pointer link-color hover:underline" @click="openModal('auth-modal')">{{ $t('logins.login') }}</span>
    </div>
  </Layout>
</template>

<script setup>
// components
import Layout from '~/components/layouts/Layout.vue'

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const authApi = useAuth(oApiConfiguration, fetchOptions())

const { $router } = useNuxtApp()

onMounted (() => {
  verifyAccount()
})

const message = ref('')

const verifyAccount = async () => {
  const { iv, content } = $router.currentRoute.value.params
  
  const [success, error] = await authApi.verifyEmailAddress({
    iv,
    content
  })

  if (error) {
    if (error.message === 'Request failed with status code 409') {
      message.value = t('registration.form.registered.accountAlreadyVerified')
    } else {
      message.value = t('errors.somethingWentWrong')
    }
  } else {
    message.value = t('registration.form.registered.accountSuccessfullyVerified')
  }
}
</script>

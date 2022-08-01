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

<script>
// components
import Layout from '~/components/layouts/Layout.vue'

export default {
  components: {
    Layout
  },
  setup (_, context) {
    const { route, $axios } = useContext()
    const ctxRoot = context.root

    onMounted(() => {
      verifyAccount()
    })

    const status = ref(0)
    const message = ref('')

    const verifyAccount = async () => {
      const { iv, content } = route.value.params

      try {
        const response = await $axios.get(`/auth/registration/verify/email/${iv}/${content}`)

        status.value = response.status
        if (response.status === 200) {
          message.value = ctxRoot.$t('registration.form.registered.accountSuccessfullyVerified')
        } else if (response.status === 409) {
          message.value = ctxRoot.$t('registration.form.registered.accountAlreadyVerified')
        } else {
          message.value = response.message
        }
      } catch (error) {
        if (error.message === 'Request failed with status code 409') {
          status.value = 409
          message.value = ctxRoot.$t('registration.form.registered.accountAlreadyVerified')
        } else {
          status.value = 500
          message.value = ctxRoot.$t('errors.somethingWentWrong')
        }
      }
    }

    return {
      status,
      message
    }
  }
}
</script>

<style scoped>
</style>

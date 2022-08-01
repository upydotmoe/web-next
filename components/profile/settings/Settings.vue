<template>
  <div class="w-full">
    <!-- Part 1: Update profile settings/personalization -->
    <!-- VV -->
  </div>
</template>

<script setup>
// composables
import useApiFetch from '~/composables/useApiFetch'
import useUser from '~/composables/users/useUser'

const { oApiConfiguration, fetchOptions } = useApiFetch()
const userApi = useUser(oApiConfiguration, fetchOptions())

const { $auth, redirect } = useContext()

onBeforeMount(() => {
  if (!$auth.loggedIn) {
    redirect('/')
  }
})

onMounted(() => {
  fetchUserInfo()
})

// 
const inputData = ref({
  showExplicit: false
})
const fetchUserInfo = async () => {
  if ($auth.loggedIn) {
    const [data, error] = await userApi.getInfo($auth.user.id)

    if (error) {
      // todo: handle error
    } else {
      inputData.value.showExplicit = !!data.user_settings.show_explicit
    }
  } else {
    // todo: handle unauthenticated user
  }
}

const saving = ref({
  settings: {
    loading: false,
    success: false,
    buttonDisabled: false
  }
})

/** Save changes */
const update = async () => {
  saving.value.settings.loading = true
  
  const [success, error] = await userApi.updateSettings({
    userId: $auth.user.id,
    showExplicit: inputData.value.showExplicit
  })

  if (!success && error) {
    saving.value.settings.success = false
    // todo: handle error
  } else {
    saving.value.settings.success = true
  }

  saving.value.settings.loading = false
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/tailwind.scss';

form {
  .input-block {

    .field {
      @apply mt-2 pb-2;
    }
  }
}
</style>

<template>
  <div class="w-full">
    <!-- Part 1: Update profile socials information -->
    <!-- VV -->
  </div>
</template>

<script setup>
// components
import Icon from '~/components/globals/Icon.vue'

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
  facebook: '',
  twitter: '',
  instagram: '',
  patreon: '',
  youtube: ''
})
const fetchUserInfo = async () => {
  if ($auth.loggedIn) {
    const [data, error] = await userApi.getInfo($auth.user.id)

    if (error) {
      // todo: handle error
    } else {
      inputData.value.facebook = data.user_socials.facebook
      inputData.value.twitter = data.user_socials.twitter
      inputData.value.instagram = data.user_socials.instagram
      inputData.value.patreon = data.user_socials.patreon
      inputData.value.youtube = data.user_socials.youtube
    }
  } else {
    // todo: handle unauthenticated user
  }
}

const saving = ref({
  socials: {
    loading: false,
    success: false,
    buttonDisabled: false
  }
})

/** Save changes */
const update = async () => {
  saving.value.socials.loading = true
  
  const [success, error] = await userApi.updateSocials({
    userId: $auth.user.id,
    facebook: inputData.value.facebook,
    twitter: inputData.value.twitter,
    instagram: inputData.value.instagram,
    patreon: inputData.value.patreon,
    youtube: inputData.value.youtube
  })

  if (!success && error) {
    saving.value.socials.success = false
    // todo: handle error
  } else {
    saving.value.socials.success = true
  }

  saving.value.socials.loading = false
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

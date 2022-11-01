<template>
  <Profile 
    :user-logon="true"
    @setMeta="setMeta"
  />
</template>

<script setup>
// stores
import useAuthStore from '@/stores/auth.store'

// components
import Profile from '~/components/profile/Profile.vue'

// stores
const auth = useAuthStore()

const router = useRouter()

/**
 * @meta
 */
useHead ({
  title: useI18n().tl('profile.profile')
})

onBeforeMount (() => {
  if (!auth.loggedIn) {
    router.push({
      path: '/',
      force: true
    })
  }
})
</script>

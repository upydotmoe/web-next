<template>
  <Profile 
    :user-logon="true"
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

onBeforeMount (() => {
  if (!auth.loggedIn) {
    router.push({
      path: '/',
      force: true
    })
  }
})
</script>

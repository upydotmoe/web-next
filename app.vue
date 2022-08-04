<template>
  <NuxtPage />
</template>

<script setup>
import { initApp } from './utils/init-app'

// stores
import authStore from '@/stores/auth.store'

initApp()

const auth = authStore()

onBeforeMount(() => {
  if (auth.loggedIn) {
    refreshUserData()
  }
})

/**
 * @auth
 */
const refreshUserData = () => {
  auth.getAuthenticatedUserInfo()
}
/**
 * @auth
 */
</script>

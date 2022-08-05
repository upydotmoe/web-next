<template>
  <NuxtPage />
</template>

<script setup>
import { initApp } from './utils/init-app'

// stores
import authStore from '@/stores/auth.store'

initApp()

const auth = authStore()

const { oApiConfiguration, fetchOptions } = useApiFetch()
const authApi = useAuth(oApiConfiguration, fetchOptions())

onBeforeMount(async () => {
  const tokenValid = await authApi.checkTokenValidity()

  if (tokenValid && auth.loggedIn) {
    await refreshUserData()
  } else {
    auth.logout()
  }
})

/**
 * @auth
 */

const refreshUserData = async () => {
  await authApi.getAuthenticatedUserData()
}
/**
 * @auth
 */
</script>

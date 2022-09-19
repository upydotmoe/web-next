<template>
  <NuxtLoadingIndicator
    class="loading-indicator-color"
    color="loading-indicator-color"
    height="8"
    throttle="0"
  />

  <KeepAlive>
    <NuxtPage />
  </KeepAlive>
</template>

<script setup>
import { initApp } from './utils/init-app'
import { useI18n } from 'vue-i18n'

// stores
import useAuthStore from '@/stores/auth.store'

definePageMeta ({
  keepalive: true
})

initApp()
const { t } = useI18n()

/**
 * @meta
 */
useHead ({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - ` + t('meta.title.app') : t('meta.title.app')
  }
})

// stores
const auth = useAuthStore()

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const authApi = useAuth(oApiConfiguration, fetchOptions())

onMounted (async () => {
  if (auth.loggedIn && auth.user.id) {
    const tokenValid = await authApi.checkTokenValidity()

    if (tokenValid) {
      await authApi.getAuthenticatedUserData()
    } else {
      auth.logout()
    }
  } else {
    auth.logout()
  }
})
</script>

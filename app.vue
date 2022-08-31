<template>
  <NuxtLoadingIndicator
    class="loading-indicator-color"
    color="loading-indicator-color"
    height="8"
    throttle="0"
  />
  <NuxtPage />
</template>

<script setup>
import { initApp } from './utils/init-app'
import { useI18n } from 'vue-i18n'

// stores
import authStore from '@/stores/auth.store'

definePageMeta ({
  keepAlive: {
    exclude: [
      'post',
      'pages/post'
    ]
  }
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

const auth = authStore()

const { oApiConfiguration, fetchOptions } = useApiFetch()
const authApi = useAuth(oApiConfiguration, fetchOptions())

onBeforeMount (async () => {
  if (auth.loggedIn) {
    const tokenValid = await authApi.checkTokenValidity()

    if (tokenValid) {
      await refreshUserData()
    } else {
      auth.logout()
    }
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

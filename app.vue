<template>
  <NuxtLoadingIndicator
    class="loading-indicator-color"
    color="loading-indicator-color"
    :height="5"
  />

  <!-- floating buttons -->
  <div class="float-right fixed right-2 bottom-2 z-30 md:right-6 md:bottom-6">
    <div class="flex flex-col gap-y-2">
      <a
        v-if="auth.loggedIn"
        :href="route.name === 'post' ? '#' : '/post'"
        class="p-2 w-10 h-10 text-xs text-white align-middle rounded-full shadow-xl button-color"
      >
        <Icon
          class="text-white hover:text-white"
          :name="'i-ion-add'"
          :text-size="'text-2xl'"
        />
      </a>
      <a href="#" class="p-2 w-10 h-10 text-xs text-white align-middle rounded-full shadow-xl button-color">
        <Icon
          class="text-white hover:text-white"
          :name="'i-material-symbols-keyboard-arrow-up-rounded'"
          :text-size="'text-2xl'"
        />
      </a>
    </div>
  </div>

  <NuxtPage />
</template>

<script setup>
import { initApp } from './utils/init-app'
import { useI18n } from 'vue-i18n'

// stores
import useAuthStore from '@/stores/auth.store'

// components
import Icon from '~/components/globals/Icon.vue'

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

onBeforeMount (async () => {
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

const route = useRoute()
</script>
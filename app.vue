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

<style lang="scss">
.filepond--root, .filepond--hopper, .filepond--panel, .filepond--panel-root {
  @apply rounded-md;
}

/* .filepond--drop-label {
  @apply text-color;
} */

.quillWrapper, .filepond--panel .filepond--panel-root {
  @apply theme-color rounded-md;
}

.ql-toolbar.ql-snow, .ql-container.ql-snow {
  @apply border-0 border-none;
}

.ql-toolbar.ql-snow .ql-formats, .ql-snow .ql-picker {
  @apply text-color-secondary;
}

.ql-snow.ql-toolbar button, .ql-snow .ql-toolbar button {
  @apply hover:theme-color-secondary;
}

.ql-picker-label::hover {
  @apply theme-color-secondary;
}

.ql-snow .ql-picker {
  @apply text-color;
}

.ql-snow .ql-stroke, .quillWrapper .ql-snow .ql-stroke {
  stroke: var(--theme-text-color);
}

.ql-snow .ql-fill, .ql-snow .ql-stroke.ql-fill {
  fill: var(--theme-text-color);
}

.ql-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-label, .ql-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-options {
  @apply theme-color;
}

.ql-snow.ql-toolbar .ql-picker-item.ql-selected, .ql-snow .ql-toolbar .ql-picker-item.ql-selected, .ql-snow.ql-toolbar .ql-picker-item:hover, .ql-snow .ql-toolbar .ql-picker-item:hover, .ql-snow.ql-toolbar .ql-picker-label.ql-active, .ql-snow .ql-toolbar .ql-picker-label.ql-active, .ql-snow.ql-toolbar .ql-picker-label:hover, .ql-snow .ql-toolbar .ql-picker-label:hover, .ql-snow.ql-toolbar button.ql-active, .ql-snow .ql-toolbar button.ql-active, .ql-snow.ql-toolbar button:focus, .ql-snow .ql-toolbar button:focus, .ql-snow.ql-toolbar button:hover, .ql-snow .ql-toolbar button:hover {
  @apply text-colored;
}

.ql-toolbar {
  @apply border-0 rounded-t-md rounded-b-none;
}

.ql-container {
  @apply rounded-b-md rounded-t-none border-0;
}

.ql-editor {
  /* @apply px-2; */
}

.ql-editor.ql-blank::before {
  @apply text-color-dimmed;
}

.ql-size-large {
  @apply text-lg;
}

.ql-editor {
  @apply text-xs;
}
</style>
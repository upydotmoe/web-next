<template>
  <NuxtLoadingIndicator
    class="loading-indicator-color"
    color="loading-indicator-color"
    :height="5"
  />

  <!-- floating buttons -->
  <div class="float-right fixed right-2 bottom-2 z-30 flex-md-hidden md:right-6 md:bottom-6">
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
import { useI18n } from 'vue-i18n'
import { initApp } from './utils/init-app'

// stores
import useAuthStore from '@/stores/auth.store'

// components
import Icon from '~/components/globals/Icon.vue'

initApp()
const { t } = useI18n()

/**
 * @meta
 */
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - ` + t('meta.title.app') : t('meta.title.app')
  }
})

// stores
const auth = useAuthStore()

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const authApi = useAuth(oApiConfiguration, fetchOptions())

onBeforeMount(async () => {
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

<!-- chat bro (https://www.chatbro.com/en/edit/98kjU/) -->
<script id="chatBroEmbedCode">
function ChatbroLoader(chats,async){async=!1!==async;var params={embedChatsParameters:chats instanceof Array?chats:[chats],lang:navigator.language||navigator.userLanguage,needLoadCode:'undefined'==typeof Chatbro,embedParamsVersion:localStorage.embedParamsVersion,chatbroScriptVersion:localStorage.chatbroScriptVersion},xhr=new XMLHttpRequest;xhr.withCredentials=!0,xhr.onload=function(){eval(xhr.responseText)},xhr.onerror=function(){console.error('Chatbro loading error')},xhr.open('GET','https://www.chatbro.com/embed.js?'+btoa(unescape(encodeURIComponent(JSON.stringify(params)))),async),xhr.send()}
ChatbroLoader({encodedChatId: '98kjU'});
</script>

<style lang="scss">
@import '~/assets/css/tailwind.scss';

form {
  .input-block {
    @apply mb-4;
  }
}

.chatbro_chat .chatbro_movable_chat .chatbro_opacity, .chatbro_minimized_chat, .chatbro_chat {
  left: auto;
  right: 60px !important;
}

/**
* Filepond
*/
.filepond--root, .filepond--hopper, .filepond--panel, .filepond--panel-root {
  @apply rounded-md;
  margin-bottom: 0px !important;
}

.filepond--panel .filepond--panel-root {
  @apply rounded-md;
  background: var(--theme-color) !important;
  color: var(--theme-text-color) !important;
}

/* .filepond--drop-label {
  @apply text-color;
} */

/**
* Rich Text Editor (QuillEditor)
*/
.quillWrapper .ql-snow.ql-toolbar {
  background-color: var(--quill-toolbar-background) !important;
  color: var(--theme-text-color) !important;
}

.quillWrapper {
  @apply rounded-md;
  background: var(--theme-color) !important;
  color: var(--theme-text-color) !important;
}

.ql-toolbar.ql-snow, .ql-container.ql-snow {
  @apply border-0 border-none;
}

.ql-picker-label {
  color: #333333 !important;

  :hover {
    color: var(--theme-text-color) !important;
  }
}

.ql-snow .ql-picker {
  color: var(--theme-text-color) !important;
}

.ql-snow .ql-stroke, .quillWrapper .ql-snow .ql-stroke {
  stroke: var(--theme-text-color);
}

.ql-snow .ql-fill, .ql-snow .ql-stroke.ql-fill {
  fill: var(--theme-text-color);
}

.ql-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-label, .ql-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-options {
  background: var(--theme-color) !important;
  color: var(--theme-text-color) !important;
}

.ql-picker-item {
  :hover {
    background: var(--theme-color) !important;
    color: var(--theme-text-color) !important;
  }
}

.ql-snow.ql-toolbar .ql-picker-item.ql-selected, .ql-snow .ql-toolbar .ql-picker-item.ql-selected, .ql-snow.ql-toolbar .ql-picker-item:hover, .ql-snow .ql-toolbar .ql-picker-item:hover, .ql-snow.ql-toolbar .ql-picker-label.ql-active, .ql-snow .ql-toolbar .ql-picker-label.ql-active, .ql-snow.ql-toolbar .ql-picker-label:hover, .ql-snow .ql-toolbar .ql-picker-label:hover, .ql-snow.ql-toolbar button.ql-active, .ql-snow .ql-toolbar button.ql-active, .ql-snow.ql-toolbar button:focus, .ql-snow .ql-toolbar button:focus, .ql-snow.ql-toolbar button:hover, .ql-snow .ql-toolbar button:hover {
  color: var(--button) !important;
}

.ql-toolbar {
  @apply border-0 rounded-t-md rounded-b-none;
}

.ql-container {
  @apply rounded-b-md rounded-t-none border-0;
}

.ql-editor {
  @apply mb-10;
  font-size: 12px !important;
}
.ql-editor.ql-blank::before {
  color: var(--text-color-dimmed) !important;
}

.ql-size-large {
  @apply text-lg;
}
</style>

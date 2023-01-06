<template>
  <div class="feed__left-buttons">
    <button
      :class="[
        'left-button',
        currentView == 'feed' ? 'theme-colored' : 'theme-color'
      ]"
      @click="changeView('feed')"
    >
      <Icon :name="'i-akar-icons-home'" />
      <span class="hidden ml-3 lg:block">{{ $t('feeds.all') }}</span>
    </button>

    <button
      :class="[
        'left-button',
        currentView == 'text' ? 'theme-colored' : 'theme-color'
      ]"
      @click="changeView('text')"
    >
      <Icon :name="'i-ion-text-sharp'" />
      <span class="hidden ml-3 lg:block">{{ $t('feeds.textOnly') }}</span>
    </button>

    <button
      :class="[
        'left-button',
        currentView == POST_TYPES.ARTWORK ? 'theme-colored' : 'theme-color'
      ]"
      @click="changeView(POST_TYPES.ARTWORK)"
    >
      <Icon :name="'i-gg-image'" />
      <span class="hidden ml-3 lg:block">{{ $t('feeds.artworkOnly') }}</span>
    </button>
  </div>
</template>

<script setup>
import { POST_TYPES } from '~/utils/constants'

// stores
import useAuthStore from '@/stores/auth.store'

// components
import Icon from '~/components/globals/Icon.vue'

// stores
const auth = useAuthStore()

const emits = defineEmits(['refetch'])
const props = defineProps({
  currentView: {
    type: String,
    default: 'feed'
  }
})

const changeView = (mode) => {
  emits('refetch', mode)
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/tailwind.scss';

.feed__left-buttons {
  @apply flex flex-col gap-2 w-4/5;

  .left-button {
    @apply flex flex-row py-3 px-4 font-medium leading-5 rounded ring-offset-2 transition-all duration-200 cursor-pointer parent-icon hover:button hover:text-white;

    .icon {
      @apply text-3xl lg:text-lg hover:text-white;
    }
  }
}
</style>
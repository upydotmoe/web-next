<template>
  <div class="feed__left-buttons">
    <button
      @click="changeView('feed')"
      :class="[
        'left-button',
        currentView == 'feed' ? 'theme-colored' : 'theme-color'
      ]"
    >
      <Icon :name="'i-akar-icons-home'" class="text-lg hover:text-white" />
      <span class="hidden ml-3 lg:block">{{ $t('feeds.all') }}</span>
    </button>

    <button
      @click="changeView('text')"
      :class="[
        'left-button',
        currentView == 'text' ? 'theme-colored' : 'theme-color'
      ]"
    >
      <Icon :name="'i-ion-text-sharp'" class="text-lg hover:text-white" />
      <span class="hidden ml-3 lg:block">{{ $t('feeds.textOnly') }}</span>
    </button>

    <button
      @click="changeView('artwork')"
      :class="[
        'left-button',
        currentView == 'artwork' ? 'theme-colored' : 'theme-color'
      ]"
    >
      <Icon :name="'i-gg-image'" class="text-lg hover:text-white" />
      <span class="hidden ml-3 lg:block">{{ $t('feeds.artworkOnly') }}</span>
    </button>
  </div>
</template>

<script setup>
// stores
import useAuthStore from '@/stores/auth.store'

// components
import Icon from '~/components/globals/Icon.vue'

// stores
const auth = useAuthStore()

const emits = defineEmits (['refetch'])

const currentView = ref('feed')
const changeView = (mode) => {
  currentView.value = mode
  emits('refetch', mode)
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/tailwind.scss';

.feed__left-buttons {
  @apply flex flex-col gap-2;

  .left-button {
    @apply flex flex-row py-3 px-4 font-medium leading-5 rounded ring-offset-2 transition-all duration-200 cursor-pointer parent-icon hover:button hover:text-white;
  }
}
</style>
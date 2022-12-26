<template>
  <div 
    v-show="loading || empty || error"
    :class="[
      'loading-empty-error-message',
      backgroundColor != '' ? backgroundColor : (isMobile() ? 'theme-color-secondary' : 'theme-color')
    ]"
  >
    <!-- When loading is in progress -->
    <span v-show="loading" class="flex flex-row justify-center">
      <Spinner class="mr-2" />

      <b class="mr-1">(•◡•)</b>
      {{ $t('loadingPleaseWait') }}
    </span>

    <!-- If there is no artwork to show -->
    <div
      v-show="empty"
      class="inline-flex flex-row gap-2 justify-center w-full"
    >
      <b v-if="emptyMessage === ''">(ㆆ_ㆆ)</b>
      <Icon v-if="emptyIcon" :name="emptyIcon" />
      {{ emptyMessage !== '' ? emptyMessage : $t('nothingToShow') }}
    </div>
    
    <!-- When error occured -->
    <span v-show="error && !loading">
      <b>(T_T)</b> 
      {{ $t('errors.somethingWentWrong') }} 
      <b class="cursor-pointer" @click="fetch">{{ $t('tryAgain') }}</b>
    </span>
  </div>
</template>

<script setup>
// components
import Spinner from '~/components/globals/Spinner.vue'
import Icon from './Icon.vue'

defineProps ({
  loading: {
    type: Boolean,
    default: false
  },
  fetch: {
    type: Function,
    default: () => {}
  },
  backgroundColor: {
    type: String,
    default: () => ''
  },
  empty: {
    type: Boolean,
    default: false
  },
  emptyMessage: {
    type: String,
    default: ''
  },
  emptyIcon: {
    type: String,
    default: ''
  },
  error: {
    type: Boolean,
    default: false
  },
})
</script>

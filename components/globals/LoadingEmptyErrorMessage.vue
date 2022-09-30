<template>
  <div 
    v-show="loading || empty || error"
    class="p-4 text-center rounded-md message theme-color-secondary"
  >
    <!-- When loading is in progress -->
    <span v-show="loading" class="flex flex-row justify-center">
      <Spinner class="mr-2" />

      <b class="mr-1">(•◡•)</b>
      {{ $t('loadingPleaseWait') }}
    </span>

    <!-- If there is no artwork to show -->
    <span v-show="empty">
      <b>(ㆆ_ㆆ)</b> 
      {{ $t('nothingToShow') }}
    </span>
    
    <!-- When error occured -->
    <span v-show="error && !loading">
      <b>(T_T)</b> 
      {{ $t('errors.somethingWentWrong') }} 
      <b class="cursor-pointer" @click="fetch">{{ $t('tryAgain') }}</b>
    </span>
  </div>
</template>

<script setup>
import Spinner from '~/components/globals/Spinner.vue'

defineProps ({
  loading: {
    type: Boolean,
    default: false
  },
  fetch: {
    type: Function,
    default: () => {}
  },
  empty: {
    type: Boolean,
    default: false
  },
  error: {
    type: Boolean,
    default: false
  },
  customEmptyMessage: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div class="splash">
    <div class="flex flex-row">
      <Icon 
        :name="icon" 
        class="mr-2 text-base" 
      /> 
      <span>{{ text }}</span>
    </div>
  </div>
</template>

<script setup>
import Icon from '~/components/globals/Icon.vue'

defineProps ({
  text: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: 'checkmark-outline'
  }
})
</script>

<style lang="scss" scoped>
@import '~/assets/css/tailwind.scss';

.splash {
  @apply fixed bottom-0 left-1/2 z-50 p-4 align-middle rounded-md shadow-xl transform -translate-x-1/2 -translate-y-1/2 theme-colored text-white w-11/12 mx-auto md:w-auto;

  .icon {
    @apply text-white;
  }
}
</style>

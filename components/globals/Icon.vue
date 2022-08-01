<template>
  <div
    :class="[
      name,
      'transition-all focus:outline-none icon',
      iconColor,
      { 'mr-2': withPadding }
    ]"
    aria-hidden="true"
    title=""
  />
</template>

<script setup>
defineProps({
  name: {
    type: String,
    default: ''
  },
  iconColor: {
    type: String,
    default: 'icon-color'
  },
  withPadding: {
    type: Boolean,
    default: false
  }
})
</script>

<style>
ion-icon:before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>

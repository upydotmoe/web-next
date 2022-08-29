<template>
  <div
    :class="[
      name,
      'transition-all focus:outline-none icon',
      iconColor,
      { 'mr-2': withPadding },
      textSize
    ]"
    aria-hidden="true"
    :title="textSize"
  />
</template>

<script setup>
defineProps ({
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
  },
  textSize: {
    type: String,
    default: 'text-lg'
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

<template>
  <nuxt-link
    :to="'/pro'"
    class="inline-flex flex-row gap-1 py-1 px-2 font-bold text-white align-middle bg-fuchsia-500 rounded-md hover:bg-fuchsia-600 text-xxs"
  >
    <Icon
      :name="'i-mdi-heart-multiple-outline'"
      :text-size="'text-sm'"
      class="text-white"
    />
    PRO
  </nuxt-link>
</template>

<script setup>
import Icon from './Icon.vue'
</script>
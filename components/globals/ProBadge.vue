<template>
  <nuxt-link
    v-if="!auth.i502p00r0"
    :to="'/pro'"
    class="py-1 px-2 font-bold text-black align-middle bg-yellow-200 rounded-md text-xxs hover:text-black"
  >
    PRO
  </nuxt-link>
</template>

<script setup>
// stores
import useAuthStore from '~/stores/auth.store'

const auth = useAuthStore()
</script>
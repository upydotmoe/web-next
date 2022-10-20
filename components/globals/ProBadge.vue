<template>
  <nuxt-link
    v-if="forceShow ? auth.i502p00r0 : !auth.i502p00r0"
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

defineProps ({
  forceShow: {
    type: Boolean,
    default: false
  }
})
</script>
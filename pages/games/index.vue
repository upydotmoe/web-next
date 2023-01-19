<template>
  <div>
    <!-- todo -->
  </div>
</template>

<script setup>
// stores
import useAuthStore from '@/stores/auth.store'

// stores
const auth = useAuthStore()

// compositions
const { oApiConfiguration, fetchOptions } = useApiFetch()
</script>
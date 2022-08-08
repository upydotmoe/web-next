<template></template>

<script setup>
import useAuthStore from '@/stores/auth.store'

const auth = useAuthStore()

onBeforeMount (() => {
  auth.logout()
})
</script>
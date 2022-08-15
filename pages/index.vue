<template>
  <div>&nbsp;</div>
</template>

<script setup>
import authStore from '@/stores/auth.store'

const auth = authStore()

const { $router } = useNuxtApp()

onMounted (() => {
  if (!auth.loggedIn) {
    $router.push('/explore')
  } else {
    $router.push('/feed')
  }
})
</script>

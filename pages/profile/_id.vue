<template>
  <Profile
    :id="userId"
  />
</template>

<script setup>
import Profile from '~/components/profile/Profile.vue'

const { $router } = useNuxtApp()

const { id } = $router.currentRoute.value.params.path
const userId = Number(id)
</script>

<template>
  <Profile 
    :id="userId"
  />
</template>

<script setup>
import Profile from '~/components/profile/Profile.vue'

const { route } = useContext()

const { id } = route.value.params
const userId = Number(id)
</script>

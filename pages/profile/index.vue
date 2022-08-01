<template>
  <Profile 
    :user-logon="true"
  />
</template>

<script setup>
// components
import Profile from '~/components/profile/Profile.vue'

const { $auth, redirect, app } = useContext()

onBeforeMount(() => {
  if (!$auth.loggedIn) {
    redirect(app.localePath('/'))
  }
})
</script>

<template>
  <Profile 
    v-if="userId"
    :id="userId"
  />
</template>

<script setup>
// API
import {
  UserApi
} from '~/api/openapi/api'

// components
import Profile from '~/components/profile/Profile.vue'

const { $router } = useNuxtApp()

onBeforeMount (() => {
  getUserId()
})

const { username } = $router.currentRoute.value.params.path

const userId = ref(0)
const getUserId = async () => {
  try {
    const { data } = await new UserApi(useApiFetch().oApiConfiguration)
      .getUserInfoByUsername(username)

    userId.value = data.id
  } catch (error) {
    // 
  }
}
</script>

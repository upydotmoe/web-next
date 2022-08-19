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

// composables
import useUser from '~/composables/users/useUser'

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const userApi = useUser(oApiConfiguration, fetchOptions())

const { $router } = useNuxtApp()

onBeforeMount (() => {
  getUserId()
})

const { username } = $router.currentRoute.value.params

const userId = ref(0)
const getUserId = async () => {
  const [data, error] = await userApi.getInfoByUsername(username)

  if (error) {
    // todo: handle error
  } else {
    userId.value = data.id
  }
}
</script>

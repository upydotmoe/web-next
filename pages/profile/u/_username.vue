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

// composables
import useApiFetch from '~/composables/useApiFetch'

// components
import Profile from '~/components/profile/Profile.vue'

const { route } = useContext()

onBeforeMount(() => {
  getUserId()
})

const { username } = route.value.params

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

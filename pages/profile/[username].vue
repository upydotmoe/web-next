<template>
  <div>
    <Profile
      v-if="userId"
      :id="userId"
    />
  </div>
</template>

<script setup>
// components
import Profile from '~/components/profile/Profile.vue'

// composables
import useUser from '~/composables/users/useUser'

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const userApi = useUser(oApiConfiguration, fetchOptions())

const route = useRoute()

onBeforeMount(() => {
  getUserId()
})

const { username } = route.params

const userId = ref(0)
const getUserId = async () => {
  const [data, error] = await userApi.getInfoByUsername(username)

  if (error) {
    // todo: handle error
  } else {
    useHead({
      title: `(${data.username}) ${data.name}`
    })

    userId.value = data.id
  }
}
</script>

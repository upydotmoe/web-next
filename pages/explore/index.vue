<template>
  <Layout 
    :with-footer="true" 
    :hide-side="true"
    :no-right-side="true"
  >
    <div class="flex flex-col mt-2">
      <Recent class="mb-10" />
      <Following v-if="auth.loggedIn && isFollowingSomeone" class="mb-10" />
      <Popular />
    </div>
  </Layout>
</template>

<script setup>
// components
import Layout from '~~/components/layouts/Layout.vue'
import Recent from '~~/components/artworks/index/Recent.vue'
import Following from '~~/components/artworks/index/Following.vue'
import Popular from '~~/components/artworks/index/Popular.vue'

// composables
import useUser from '~~/composables/users/useUser'

// stores
import authStore from '@/stores/auth.store'

// composables use
const { oApiConfiguration, fetchOptions } = useApiFetch()
const userApi = useUser(oApiConfiguration, fetchOptions())

const auth = authStore()

onMounted (() => {
  if (auth.loggedIn) {
    getFollowedUsers()
  }
})

const isFollowingSomeone = ref(false)
const getFollowedUsers = async () => {
  const [followedUsers, error] = await userApi.getFollowingList({
    userId: auth.user.id,
    pagination: {
      page: 0,
      perPage: 1
    }
  })

  isFollowingSomeone.value = followedUsers.pagination.record_total > 0
}
</script>

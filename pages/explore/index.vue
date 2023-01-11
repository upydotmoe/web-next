<template>
  <Layout
    :with-footer="true"
    :hide-side="true"
    :no-right-side="true"
    :fullscreen="true"
  >
    <div class="flex flex-col mt-2 w-full">
      <Recent class="mb-10" />
      <Following
        v-if="auth.loggedIn && isFollowingSomeone"
        class="mb-10"
      />
      <Popular />
    </div>
  </Layout>
</template>

<script setup>
// stores
import useAuthStore from '@/stores/auth.store'

// components
import Layout from '~/components/layouts/Layout.vue'
import Recent from '~/components/artworks/index/Recent.vue'
import Following from '~/components/artworks/index/Following.vue'
import Popular from '~/components/artworks/index/Popular.vue'

// composables
import useUser from '~/composables/users/useUser'

// stores
const auth = useAuthStore()

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const userApi = useUser(oApiConfiguration, fetchOptions())

const { t } = useI18n()

useHead({
  title: t('explore')
})

onMounted(() => {
  if (auth.loggedIn) {
    countFollowing()
  }
})

const route = useRoute()
watch(() => route.query, (_) => {
  setTimeout(() => {
    // close all artwork modal
    useModal().closeModal('recent-modal')
    useModal().closeModal('popular-modal')
    useModal().closeModal('following-modal')

    // close collection selection modal
    useModal().closeModal('collection-selection-modal')

    // close album selection modal
    useModal().closeModal('album-selection-modal')

    // close report modal
    useModal().closeModal('report-modal')
  }, 50)
})

const isFollowingSomeone = ref(false)
const countFollowing = async () => {
  // reset current state
  isFollowingSomeone.value = false

  const [totalFollowing, error] = await userApi.countFollowings(auth.user.id)

  if (error) {
    isFollowingSomeone.value = false
  } else {
    isFollowingSomeone.value = totalFollowing > 0
  }
}
</script>

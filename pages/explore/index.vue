<template>
  <Layout
    :with-footer="true"
    :hide-side="true"
    :no-right-side="true"
    :fullscreen="true"
  >
    <div class="flex flex-col gap-12 px-2 mt-2 w-full">
      <div
        v-if="!auth.loggedIn"
        class="flex flex-row gap-2 p-4 text-black bg-yellow-300 rounded-md"
      >
        <Icon
          :name="'i-mdi-information-variant'"
          :text-size="'text-lg'"
          :icon-color="'text-black'"
        /> {{ $t('loginFullFeature') }}
      </div>

      <Recent />
      <Following v-if="auth.loggedIn && isFollowingSomeone" />
      <Popular />
    </div>
  </Layout>
</template>

<script setup>
// stores
import useAuthStore from '@/stores/auth.store'

// components
import Icon from '~~/components/globals/Icon.vue'
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

definePageMeta({
  keepalive: false
})

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

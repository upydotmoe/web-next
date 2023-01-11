<template>
  <Layout
    :with-footer="true"
  >
    <ArtworkForm
      :id="id"
      :is-update="true"
    />
  </Layout>
</template>

<script setup>
// stores
import useAuthStore from '@/stores/auth.store'

// components
import Layout from '~/components/layouts/Layout.vue'
import ArtworkForm from '~/components/artworks/forms/ArtworkForm.vue'

// stores
const auth = useAuthStore()

// composition
const { oApiConfiguration, fetchOptions } = useApiFetch()
const artworkApi = useArtwork(oApiConfiguration, fetchOptions())

const { $router } = useNuxtApp()
const router = useRouter()

const { id } = $router.currentRoute.value.params

onBeforeMount(async () => {
  await checkAuthority()
})

onMounted(() => {
  fetchWorkInfo()
})

const checkAuthority = async () => {
  const [data, error] = await artworkApi.getWorkById(id)

  if (data.user_id !== auth.user.id || error) {
    router.push({
      path: '/'
    })
  }
}

// fetch work info to show the current info before updating
const currentInfo = ref({})
const fetchWorkInfo = async () => {
  try {
    const [data, error] = await artworkApi.getWorkById(id)

    if (error) {
      // todo: handle error
    } else {
      currentInfo.value = data
    }
  } catch (error) {
    // todo: handle error
  }
}
</script>

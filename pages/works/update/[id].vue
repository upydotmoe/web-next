<template>
  <Layout
    :with-footer="true"
    :h-screen="true"
  >
    <UpdateForm
      :id="id"
    />

    <template #right-side>
      <h1 class="mb-3 text-base font-bold">Current Info</h1>

      <div class="mt-2">
        <label class="italic font-medium text-color-secondary">Title</label>
        <p>{{ currentInfo.title }}</p>
      </div>
      <div class="mt-2">
        <label class="italic font-medium text-color-secondary">Description</label>
        <p v-html="currentInfo.description" class="text-justify" />
      </div>
      <div class="mt-2">
        <label class="italic font-medium text-color-secondary">Explicit</label>
        <p>{{ currentInfo.is_explicit ? 'Yes' : 'No' }}</p>
      </div>
      <div v-if="currentInfo.artwork_has_tags && currentInfo.artwork_has_tags.length" class="mt-2">
        <label class="italic font-medium text-color-secondary">Tags</label>
        <div class="tags">
          <span
            v-for="tag in currentInfo.artwork_has_tags"
            :key="tag.artwork_tags.id"
            class="tag"
          >
            {{ tag.artwork_tags.tag }}
          </span>
        </div>
      </div>
      <div class="mt-2">
        <label class="italic font-medium text-color-secondary">Publish Date</label>
        <p>{{ formatDate(currentInfo.scheduled_post) }}</p>
      </div>
    </template>
  </Layout>
</template>

<script setup>
// stores
import useAuthStore from '@/stores/auth.store'

// components
import Layout from '~/components/layouts/Layout.vue'
import UpdateForm from '~/components/artworks/forms/UpdateForm'

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

onMounted (() => {
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

<style lang="scss" scoped>
@import '~/assets/css/tailwind.scss';

.tags {
  @apply flex flex-wrap mb-4 mt-1;

  .tag {
    @apply py-1 px-2 mr-1 mt-1 rounded transition-all duration-150 button;

    &:hover {
      @apply button-hover;
    }
  }
}
</style>

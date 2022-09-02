<template>
  <Layout
    :with-footer="true"
    :h-screen="true"
  >
    <UpdateForm
      :id="id"
    />

    <template #right-side>
      <h1 class="font-bold text-base mb-3">Current Info</h1>

      <div class="mt-2">
        <label class="text-color-secondary font-medium italic">Title</label>
        <p>{{ currentInfo.title }}</p>
      </div>
      <div class="mt-2">
        <label class="text-color-secondary font-medium italic">Description</label>
        <p class="text-justify">{{ currentInfo.description }}</p>
      </div>
      <div class="mt-2">
        <label class="text-color-secondary font-medium italic">Explicit</label>
        <p>{{ currentInfo.is_explicit ? 'Yes' : 'No' }}</p>
      </div>
      <div v-if="currentInfo.artwork_has_tags && currentInfo.artwork_has_tags.length" class="mt-2">
        <label class="text-color-secondary font-medium italic">Tags</label>
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
        <label class="text-color-secondary font-medium italic">Publish Date</label>
        <p>{{ formatDate(currentInfo.scheduled_post) }}</p>
      </div>
    </template>
  </Layout>
</template>

<script setup>
// components
import Layout from '~/components/layouts/Layout.vue'
import UpdateForm from '~/components/artworks/forms/UpdateForm'

const { oApiConfiguration, fetchOptions } = useApiFetch()
const artworkApi = useArtwork(oApiConfiguration, fetchOptions())

const { $router } = useNuxtApp()

const { id } = $router.currentRoute.value.params

onMounted (() => {
  fetchWorkInfo()
})

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

<template>
  <Layout
    :with-footer="true"
    :hide-side="true"
    :no-right-side="true"
  >
    <div class="flex flex-row gap-2 justify-center mb-4 w-full">
      <button
        :class="tags.options.data.orderBy == undefined ? 'primary-button' : 'light-button'"
        @click="tags.options.data.orderBy = undefined"
      >
        A-Z
      </button>
      <button
        :class="tags.options.data.orderBy == 'count' ? 'primary-button' : 'light-button'"
        @click="tags.options.data.orderBy = 'count'"
      >
        {{ $t('tags.artworkCount') }}
      </button>
    </div>

    <div
      class="grid grid-flow-col gap-3"
      :style="[
        'grid-template-rows: repeat('+ Math.round(tags.total/(!isMobile() ? 4 : (!isMobileDevice() ? 2 : 1))) +', minmax(0, 1fr))'
      ]"
    >
      <nuxt-link
        v-for="tag in tags.data"
        :key="tag.id"
        :to="'/artworks/browse?tags=' + tag.tag.replaceAll(' ', '+')"
        class="flex flex-row justify-between p-2 w-full rounded-md cursor-pointer button-light hover:theme-colored hover:font-bold"
      >
        {{ tag.tag }}
        <b>{{ tag._count.artwork_has_tags }}</b>
      </nuxt-link>
    </div>
  </Layout>
</template>

<script setup>
// stores
import useAuthStore from '@/stores/auth.store'

// components
import Layout from '~/components/layouts/Layout.vue'

// stores
const auth = useAuthStore()

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const tagsApi = useTags(oApiConfiguration, fetchOptions())

const router = useRouter()

onBeforeMount(() => {
  if (!auth.loggedIn) {
    router.push('/')
  }
})

onMounted(() => {
  fetch()
})

const tags = ref({
  total: 0,
  data: [],
  options: {
    data: {
      orderBy: undefined
    },
    isError: false
  }
})
const fetch = async () => {
  const [tagsCount, data, error] = await tagsApi.getAllTags({
    orderBy: tags.value.options.data.orderBy
  })

  if (!error) {
    tags.value.total = tagsCount
    tags.value.data = data
  } else {
    tags.value.options.isError = true
  }
}

/**
 * Watch for order mode change
 */
watch(() => tags.value.options.data.orderBy, () => {
  sort()
})

const sort = () => {
  const orderBy = tags.value.options.data.orderBy

  if (orderBy == 'count') {
    tags.value.data = tags.value.data.sort((a, b) => b._count.artwork_has_tags - a._count.artwork_has_tags)
  } else {
    tags.value.data = tags.value.data.sort((a, b) => (a.tag > b.tag) ? 1 : ((b.tag > a.tag) ? -1 : 0))
  }
}
</script>

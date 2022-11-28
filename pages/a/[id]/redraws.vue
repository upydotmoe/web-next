<template>
  <Layout 
    :with-footer="true" 
    :hide-side="true"
    :no-right-side="true"
  >
    <div class="flex flex-row justify-start w-full md:w-auto">
      <a @click.prevent="$router.back()" class="mb-4 light-button">
        <Icon :name="'i-typcn-arrow-back'" />
        {{ $t('back') }}
      </a>
    </div>

    <!-- original artwork info -->
    <div
      v-if="!redrawedArtwork.options.loading"
      class="p-2 mb-6 w-full rounded-md theme-color"
    >
      <nuxt-link
        :to="'/a/'+workId"
        class="flex flex-row gap-2"
      >
        <div v-if="redrawedArtwork.data.artwork_assets">
          <!-- test --> <img
            preload
            loading="lazy"
            class="w-40 rounded-md"
            :src="artworkThumb(redrawedArtwork.data.artwork_assets[0].bucket, redrawedArtwork.data.artwork_assets[0].filename, 'thumbnail', false)"
            @error="imageLoadError"
          />
        </div>

        <div class="flex flex-col">
          <span class="mb-2 text-lg font-bold">{{ redrawedArtwork.data.title }}</span>

          <p
            v-html="redrawedArtwork.data.description.length > 200 ? redrawedArtwork.data.description.slice(0, 200) + '..' : redrawedArtwork.description"
          />
        </div>
      </nuxt-link>
    </div>

    <!-- redraw list -->
    <div>
      <div class="section-title">{{ $t('artworks.redraws') }}</div>
    
      <div id="lists">
        <keep-alive>
          <WorkList
            v-show="!artworkRedraws.options.isEmpty"
            :section-class="'work-grid'"
            :works="artworkRedraws.data"
            :view="null"
            :hide-redraw-icon="true"
          />
        </keep-alive>

        <!-- loading -->
        <LoadingEmptyErrorMessage
          class="mb-2"
          :loading="artworkRedraws.options.loading"
          :empty="artworkRedraws.options.isEmpty"
          :error="false"
          :fetch="fetch"
        />

        <button
          v-if="artworkRedraws.pagination.next_previous && artworkRedraws.pagination.next_previous.next_page"
          @click="loadMore()"
          class="w-full primary-button"
        >
          {{ $t('loadMore') }}
        </button>
      </div>
    </div>
  </Layout>
</template>

<script setup>
// components
import Layout from '~/components/layouts/Layout.vue'
import WorkList from '~/components/artworks/WorkList.vue'
import LoadingEmptyErrorMessage from '~/components/globals/LoadingEmptyErrorMessage.vue'
import Icon from '~/components/globals/Icon.vue'

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const artworkApi = useArtwork(oApiConfiguration, fetchOptions())

const route = useRoute()
const { id: workId } = route.params

onMounted (() => {
  fetchRedraws()
  fetchRedrawedArtworkInfo()
})

// get original artwork info (only show for redraw artwork)
const redrawedArtwork = ref({
  options: {
    loading: true
  },
  data: {}
})
const fetchRedrawedArtworkInfo = async () => {
  redrawedArtwork.value.options.loading = true

  const [data, error] = await artworkApi.getWorkById(workId)

  if (error) {
    // todo: handle error
  } else {
    redrawedArtwork.value.data = data
  }

  redrawedArtwork.value.options.loading = false
}

// redraws
const artworkRedraws = ref({
  options: {
    loading: true,
    pagination: {
      page: 0,
      perPage: 24
    },
    isEmpty: false
  },
  data: [],
  pagination: {}
})
const fetchRedraws = async () => {
  artworkRedraws.value.options.pagination.page = 0

  await fetch()
}

const loadMore = async () => {
  artworkRedraws.value.options.pagination.page += 1

  await fetch()
}

const fetch = async () => {
  artworkRedraws.value.options.loading = true

  const [redraws, paginationData, error] = await artworkApi.getRedraws({
    workId,
    pagination: {
      page: artworkRedraws.value.options.pagination.page,
      perPage: artworkRedraws.value.options.pagination.perPage
    }
  })

  if (!error) {
    redraws.forEach((redraw) => {
      artworkRedraws.value.data.push(redraw)
    })
    
    artworkRedraws.value.pagination = paginationData

    // if no record found
    artworkRedraws.value.options.isEmpty = false
    if (!paginationData.record_total) {
      artworkRedraws.value.options.isEmpty = true
    }
  }

  artworkRedraws.value.options.loading = false
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/tailwind.scss';
@import '~/assets/css/artworks/list-6.scss';
</style>
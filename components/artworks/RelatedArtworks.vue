<template>
  <div id="lists">
    <LoadingEmptyErrorMessage
      :loading="relatedArtworks.loadings.first"
      :empty="relatedArtworks.options.isEmpty"
      :error="relatedArtworks.options.isError"
      :fetch="getRelatedArtworks"
      :background-color="isModal ? 'theme-color-secondary' : 'theme-color'"
      class="mt-2"
    />

    <div v-if="!relatedArtworks.loadings.first">
      <WorkList
        v-if="!relatedArtworks.options.isEmpty"
        :section-class="'work-grid'"
        :view="view"
        :works="relatedArtworks.data"
        :is-href="isModal ? false : true"
        :direct-open="true"
      />

      <div 
        v-show="relatedArtworks.options.paginations.showLoadMore"
        class="w-full primary-button"
        :class="relatedArtworks.loadings.loading ? 'animate-pulse' : ''"
        @click="loadMore"
      >
        {{ $t('loadMore') }}
      </div>
    </div>
  </div>
</template>

<script setup>
// components
import WorkList from '~/components/artworks/WorkList.vue'
import LoadingEmptyErrorMessage from '~/components/globals/LoadingEmptyErrorMessage.vue'

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const artworkApi = useArtwork(oApiConfiguration, fetchOptions())

const props = defineProps({
  workId: {
    type: Number,
    default: 0
  },
  view: {
    type: Function,
    default: () => {}
  },
  isModal: {
    type: Boolean,
    default: true
  }
})

onMounted (() => {
  setTimeout(() => {
    getRelatedArtworks()
  }, 2000)
})

const relatedArtworks = ref({
  loadings: {
    first: true,
    loading: true
  },
  data: [],
  options: {
    isEmpty: false,
    isError: false,
    paginations: {
      page: 0,
      perPage: 12,
      showLoadMore: true
    }
  }
})
const getRelatedArtworks = async () => {
  relatedArtworks.value.loadings.loading = true

  // reset
  relatedArtworks.value.options.isError = false
  relatedArtworks.value.options.isEmpty = false

  const [data, paginations, error] = await artworkApi.getRelatedArtworks({
    workId: props.workId,
    pagination: {
      page: relatedArtworks.value.options.paginations.page,
      perPage: relatedArtworks.value.options.paginations.perPage,
    }
  })

  if (error) {
    relatedArtworks.value.options.isError = true
  } else if (relatedArtworks.value.options.paginations.page == 0 && !data.length) {
    relatedArtworks.value.options.isEmpty = true
  } else {
    for (let workIdx = 0; workIdx < data.length; workIdx++) {
      relatedArtworks.value.data.push(data[workIdx])
    }

    if (paginations.next_previous.next_page == null) {
      relatedArtworks.value.options.paginations.showLoadMore = false
    }

    // increase pagination level
    relatedArtworks.value.options.paginations.page+=1
  }

  // stop loading
  if (relatedArtworks.value.options.paginations.page == 1) {
    relatedArtworks.value.loadings.first = false
  }
  relatedArtworks.value.loadings.loading = false
}

const loadMore = () => {
  getRelatedArtworks()
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/artworks/list-6.scss';

</style>

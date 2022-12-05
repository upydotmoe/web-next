<template>
  <div id="lists">
    <div v-show="!loading">
      <keep-alive>
        <WorkList 
          v-show="!isEmpty"
          :section-class="'work-grid'"
          :works="works"
          :view="view"
        />
      </keep-alive>

      <div 
        v-show="showLoadMoreButton" 
        :class="[
          !canLoadMore ? 'disabled-button' : 'primary-button',
          { 'animate-pulse': loadMoreOptions.delay },
          { 'inline-block flex-row w-full text-center': !canLoadMore }
        ]" 
        @click="!canLoadMore ? null : loadMore()"
      >
        {{ $t('loadMore') }}<ProBadge v-if="!canLoadMore" class="ml-2" />
      </div>
    </div>

    <LoadingEmptyErrorMessage 
      :loading="loading"
      :empty="isEmpty"
      :error="isError"
      :fetch="fetch"
      :background-color="'theme-color-secondary'"
    />

    <!-- modal view -->
    <div 
      :id="section+'-modal'"
      class="modal work-view" 
    >
      <ModalView 
        v-show="!loading" 
        ref="artworkModalViewRef"
        :section="section"
      />
    </div>
  </div>
</template>

<script setup>
// components
import WorkList from '~/components/artworks/WorkList.vue'
import ModalView from '~/components/artworks/views/ModalView.vue'
import LoadingEmptyErrorMessage from '~/components/globals/LoadingEmptyErrorMessage.vue'
import ProBadge from '~/components/globals/ProBadge.vue'

// stores
import useAuthStore from '@/stores/auth.store'

// stores
const auth = useAuthStore()

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const artworkApi = useArtwork(oApiConfiguration, fetchOptions())
const settingApi = useSetting(oApiConfiguration, fetchOptions())

const props = defineProps ({
  userId: {
    type: Number,
    default: 0
  }
})

const section = 'profile-liked'
const loading = ref(true)

const maxFreeItems = ref(0)
const canLoadMore = computed(() => auth.i502p00r0 ? true : (pagination.value.page*pagination.value.perPage) < maxFreeItems.value)

onBeforeMount (() => {
  if (!auth.i502p00r0) {
    fetchMaxFree()
  }

  fetchTop()
})

const fetchMaxFree = async () => {
  const maxFreeItemLimit = await settingApi.getSetting('max_free_liked_artworks')
  maxFreeItems.value = Number(maxFreeItemLimit)
}

const fetchTop = async () => {
  const [dataWorks, dataPagination] = await fetch()

  // assign data to works ref
  for (let workIdx = 0; workIdx < dataWorks.length; workIdx++) {
    works.value.push(dataWorks[workIdx].artworks)
  }
  
  // read pagination status
  if (dataPagination.record_total <= pagination.value.perPage) {
    hideLoadMoreButton()
  }
  
  if (dataPagination.record_total === 0) {
    showEmpty()
  }
}

const works = ref([])
const pagination = ref({
  perPage: 24,
  page: 0
})
const fetch = async () => {
  if (pagination.value.page === 0) {
    loading.value = true
  }

  const [works, workPagination, error] = await artworkApi.getUserLikedArtworks({
    userId: props.userId,
    pagination: {
      page: pagination.value.page,
      perPage: pagination.value.perPage
    }
  })

  if (error) {
    showError()
  } else {
    // pagination
    if (workPagination.record_total <= pagination.value.perPage) {
      hideLoadMoreButton()
    }
    if (workPagination.record_total === 0) {
      showEmpty()
    }

    pagination.value.page += 1
    reset()

    return [works, workPagination]
  }
}

/** Reset refs */
const reset = () => {
  loading.value = false
  isEmpty.value = false
  isError.value = false
}

/** Show/hide load more button for pagination */
const showLoadMoreButton = ref(true)
const hideLoadMoreButton = () => {
  showLoadMoreButton.value = false
}

const loadMoreOptions = ref({
  delay: false
})
const loadMore = async () => {
  loadMoreOptions.value.delay = true
  const [dataWorks, dataPagination] = await fetch()

  for (let workIdx = 0; workIdx < dataWorks.length; workIdx++) {
    works.value.push(dataWorks[workIdx].artworks)
  }

  loadMoreOptions.value.delay = false

  if (!dataPagination.next_previous.next_page) {
    hideLoadMoreButton()
  }

  if (dataPagination.next_previous.next_page && dataPagination.current_page === loadMoreOptions.maxLoad) {
    hideLoadMoreButton()
    loadMoreOptions.showDiscoveryButton = true
  }
}

/** Show empty if there's no artwork to show */
const isEmpty = ref(false)
const showEmpty = () => {
  isEmpty.value = true
  loading.value = false
  hideLoadMoreButton()
  emits('onEmpty')
}

/** Show error message when error occured while trying to fetch artworks */
const isError = ref(false)
const showError = () => {
  loading.value = false
  isError.value = true
  hideLoadMoreButton()
}

const artworkModalViewRef = ref(null)
const view = (workId, keepArtistPageNumber = false) => {
  artworkModalViewRef.value.view(workId, keepArtistPageNumber)

  useModal().openModal(section + '-modal')
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/tailwind.scss';
@import '~/assets/css/artworks/list-6.scss';

</style>

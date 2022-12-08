<template>
  <div id="lists">
    <div v-show="!loading">
      <keep-alive>
        <WorkList 
          v-show="!isEmpty"
          :section-class="'work-grid'"
          :works="works"
          :view="view"
          :manage-mode="manageMode"
          @feedManageList="feedManageList"
        />
      </keep-alive>

      <div 
        v-show="showLoadMoreButton" 
        class="primary-button" 
        :class="loadMoreOptions.delay ? 'animate-pulse' : ''" 
        @click="loadMore"
      >
        {{ $t('loadMore') }}
      </div>
    </div>

    <LoadingEmptyErrorMessage 
      :loading="loading"
      :empty="isEmpty"
      :error="isError"
      :fetch="fetch"
      :background-color="'theme-color-secondary'"
      class="mt-2"
    />

    <!-- modal view -->
    <div 
      :id="section+'-modal'"
      class="modal work-view" 
    >
      <ModalView 
        v-show="!loading" 
        ref="profileModalViewRef"
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

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const artworkApi = useArtwork(oApiConfiguration, fetchOptions())

const emits = defineEmits (['feedSelectedItems', 'onEmpty'])
const props = defineProps ({
  userId: {
    type: Number,
    default: 0
  },
  manageMode: {
    type: Boolean,
    default: false
  },
  sortBy: {
    type: String,
    default: 'default'
  }
})

const section = 'profile'
const loading = ref(true)

onMounted (() => {
  fetchTop()
})

const fetchTop = async () => {
  pagination.value.page = 0

  const [dataWorks, dataPagination] = await fetch()

  // assign data to works ref
  works.value = dataWorks
  
  // read pagination status
  if (dataPagination.record_total <= pagination.value.perPage) {
    hideLoadMoreButton()
  }
  
  if (dataPagination.record_total === 0) {
    showEmpty()
  }
}

watch (() => props.sortBy, () => {
  fetchTop()
})

const works = ref([])
const pagination = ref({
  perPage: 24,
  page: 0
})
const fetch = async () => {
  if (pagination.value.page === 0) {
    loading.value = true
  }

  const [works, workPagination, error] = await artworkApi.getUserArtworks({
    userId: props.userId,
    sortBy: props.sortBy,
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
  const [dataWorks, workPagination] = await fetch()

  for (let workIdx = 0; workIdx < dataWorks.length; workIdx++) {
    works.value.push(dataWorks[workIdx])
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

const profileModalViewRef = ref(null)
const view = (workId, keepArtistPageNumber = false) => {
  profileModalViewRef.value.view(workId, keepArtistPageNumber)

  useModal().openModal(section + '-modal')
}

/** Listen to manage item changes */
const feedManageList = (selectedItems) => {
  emits('feedSelectedItems', selectedItems)
}

// const closeModal = () => {
//   useModal().closeModal('profile-modal')
// }
// onClickOutside(profileModalViewRef, closeModal)
</script>

<style lang="scss" scoped>
@import '~/assets/css/tailwind.scss';
@import '~/assets/css/artworks/list-6.scss';

</style>

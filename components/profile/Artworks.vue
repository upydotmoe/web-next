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

    <ErrorMessages 
      :loading="loading"
      :empty="isEmpty"
      :error="isError"
      :fetch="fetch"
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
// API
import {
  ArtworkListApi
} from '~/api/openapi/api'

// components
import WorkList from '~/components/artworks/WorkList.vue'
import ModalView from '~/components/artworks/views/ModalView.vue'
import ErrorMessages from '~/components/globals/ErrorMessages.vue'

// composables
import useApiFetch from '~/composables/useApiFetch'
import useModal from '~/composables/useModal'

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()

const emit = defineEmits(['feedSelectedItems', 'onEmpty'])
const props = defineProps({
  userId: {
    type: Number,
    default: 0
  },
  manageMode: {
    type: Boolean,
    default: false
  }
})

const section = 'profile'
const loading = ref(false)

onBeforeMount(() => {
  fetchTop()
})

const fetchTop = async () => {
  const data = await fetch()
  
  const dataWorks = data.works
  const dataPagination = data.pagination

  works.value = dataWorks
  
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

  try {
    const { data } = await new ArtworkListApi(oApiConfiguration)
      .getUserArtworks(
        props.userId,
        pagination.value.perPage,
        pagination.value.page,
        fetchOptions()
      )
    
    // pagination
    const dataPagination = data.pagination
    if (dataPagination.record_total <= pagination.value.perPage) {
      hideLoadMoreButton()
    }
    if (dataPagination.record_total === 0) {
      showEmpty()
    }

    pagination.value.page += 1
    reset()

    return data
  } catch (error) {
    showError()
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
  const data = await fetch()

  const dataWorks = data.works
  const dataPagination = data.pagination

  dataWorks.forEach((work) => {
    works.value.push(work)
  })

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
  emit('onEmpty')
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
  emit('feedSelectedItems', selectedItems)
}

// const closeModal = () => {
//   useModal().closeModal('profile-modal')
// }
// onClickOutside(profileModalViewRef, closeModal)
</script>

<style lang="scss" scoped>
@import '~/assets/css/tailwind.scss';
@import '~/assets/css/artworks/list.scss';

</style>

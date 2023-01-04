<template>
  <Layout
    :with-footer="true"
    :hide-side="true"
    :no-right-side="true"
    :fullscreen="true"
  >
    <div id="lists">
      <!-- Top navigations -->
      <div class="navigations">
        <div class="title">
          {{ $t('artworks.latestArtworks') }}
        </div>

        <!-- Options -->
        <div class="buttons">
          <!-- Filter by tags -->
          <div class="filter-buttons">
            <button
              class="px-3 rounded-md button-item"
              :class="filterTagsCount ? 'button' : 'theme-color'"
              @click="openTagsFilterSelection"
            >
              {{ filterTagsCount }} {{ $t('tagsApplied') }}
            </button>
          </div>

          <!-- Filter explicit content -->
          <div
            v-if="auth.loggedIn && auth.user.user_settings.show_explicit"
            class="filter-buttons"
          >
            <p
              class="rounded-l-md button-item"
              :class="[explicitMode === undefined ? 'button' : 'theme-color']"
              @click="changeExplicitMode(undefined)"
            >
              {{ $t('default') }}
            </p>

            <p
              class="button-item"
              :class="[explicitMode === 'safe' ? 'button' : 'theme-color']"
              @click="changeExplicitMode('safe')"
            >
              {{ $t('safe') }}
            </p>

            <p
              class="rounded-r-md button-item"
              :class="[explicitMode === 'explicit' ? 'button' : 'theme-color']"
              @click="changeExplicitMode('explicit')"
            >
              <Icon
                :name="'i-material-symbols-explicit-outline'"
                :class="{ 'text-white': explicitMode === 'explicit' }"
              />
              {{ $t('explicit') }}
            </p>
          </div>
        </div>
      </div>

      <!-- On loading, empty or error-->
      <LoadingEmptyErrorMessage
        :loading="loading"
        :empty="isEmpty"
        :error="isError"
        :fetch="fetchTop"
      />

      <!-- Artwork list -->
      <div
        v-show="!loading"
        class="mt-4"
      >
        <WorkList
          v-show="!isEmpty"
          :section-class="'work-grid'"
          :works="works"
          :view="view"
        />

        <!-- Load more button -->
        <div
          v-show="showLoadMoreButton"
          class="w-full primary-button"
          :class="loadMoreOptions.delay ? 'animate-pulse' : ''"
          @click="loadMore"
        >
          {{ $t('loadMore') }}
        </div>
      </div>

      <!-- Artwork modal view -->
      <div
        id="recent-modal"
        class="modal work-view"
      >
        <ModalView
          v-show="!loading"
          ref="recentModalViewRef"
          section="recent"
        />
      </div>

      <!-- Tag filter selection modal -->
      <TagFilterSelection
        v-show="!loading"
        id="tag-filter-selection-modal"
        ref="tagFilterSelectionModalRef"
        class="modal"
        @apply="applyTagFilter"
      />
    </div>
  </Layout>
</template>

<script setup>
// stores
import authStore from '@/stores/auth.store'

// components
import Icon from '~/components/globals/Icon.vue'
import Layout from '~/components/layouts/Layout.vue'
import WorkList from '~/components/artworks/WorkList.vue'
import ModalView from '~/components/artworks/views/ModalView.vue'
import LoadingEmptyErrorMessage from '~/components/globals/LoadingEmptyErrorMessage.vue'
import TagFilterSelection from '~/components/globals/TagFilterSelection.vue'

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const artworkApi = useArtwork(oApiConfiguration, fetchOptions())

defineProps({
  browseMode: {
    type: Boolean,
    default: false
  }
})

const auth = authStore()

/** Before mount, fetch first rows */
onBeforeMount(() => {
  fetchTop()
})

// Change epxlicit mode for authenticated user and user who activate explicit content
const explicitMode = ref(undefined)
const changeExplicitMode = async (mode) => {
  explicitMode.value = mode
  pagination.value.page = 0

  await fetchTop()
}

/**
 * FILTER BY TAGS ===========================================================================================================================
 */
const tagFilterSelectionModalRef = ref(null)
const openTagsFilterSelection = () => {
  tagFilterSelectionModalRef.value.init(toRaw(previousSelectedTags.value))
  useModal().openModal('tag-filter-selection-modal')
}

const filterTags = ref('')
const previousSelectedTags = ref()
const filterTagsCount = ref(0)
const applyTagFilter = async (selectedTags, selectedTagsJoined) => {
  previousSelectedTags.value = selectedTags
  filterTags.value = selectedTagsJoined
  filterTagsCount.value = selectedTagsJoined !== '' ? selectedTagsJoined.split(',').length : 0
  pagination.value.page = 0

  // close tag selection modal and refetch the list
  useModal().closeModal('tag-filter-selection-modal')
  await fetchTop()
}

/** Fetch first row */
watch(async () => previousSelectedTags.value, (_) => {
  fetchTop()
})

const works = ref([])
const fetchTop = async () => {
  resetBeforeFetch()

  const { works: dataWorks, pagination: dataPagination } = await fetch()

  if (dataWorks.length && dataPagination.record_total) {
    works.value = dataWorks
  }
}

/** Fetch */
const loading = ref(true)
const isError = ref(false)
const isEmpty = computed(() => !isError.value && !works.value.length)
const showLoadMoreButton = ref(true)
const pagination = ref({
  perPage: 40,
  page: 0
})
const fetch = async () => {
  const [data, error] = await artworkApi.getLatest({
    pagination: {
      perPage: pagination.value.perPage,
      page: pagination.value.page
    },
    explicitMode: explicitMode.value,
    tags: filterTags.value
  })

  loading.value = false

  // hide load more button if there is no more artwork to load
  if (!data.pagination.next_previous.next_page) {
    showLoadMoreButton.value = false
  }

  if (error) {
    isError.value = true
  } else {
    pagination.value.page += 1
    return data
  }
}

// Load more function
const loadMoreOptions = ref({
  delay: false
})
const loadMore = async () => {
  loadMoreOptions.value.delay = true
  const { works: dataWorks } = await fetch()

  dataWorks.forEach((work) => {
    works.value.push(work)
  })

  loadMoreOptions.value.delay = false
}

const resetBeforeFetch = () => {
  works.value = []
  showLoadMoreButton.value = true
  pagination.value.page = 0
  loading.value = true
  isError.value = false
}

/** Artwork viewer, open a modal */
const recentModalViewRef = ref(null)
const view = (workId, keepArtistPageNumber = false) => {
  recentModalViewRef.value.view(workId, keepArtistPageNumber)

  useModal().openModal('recent-modal')
}

// const closeModal = (modalId) => {
//   useModal().closeModal(modalId)
// }
// onClickOutside(recentModalViewRef, () => closeModal('recent-modal'))
</script>

<style lang="scss" scoped>
// @import '~/assets/css/tailwind.scss';
@import '~/assets/css/artworks/list.scss';
</style>

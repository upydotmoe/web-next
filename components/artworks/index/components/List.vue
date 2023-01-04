<template>
  <div>
    <div id="lists">
      <!-- Top navigations -->
      <div class="navigations">
        <div class="title hidden-md-flex">
          {{ title }}
        </div>
        <nuxt-link
          :to="discoverRoute"
          class="flex flex-row justify-between title md:hidden"
        >
          {{ title }}
          <Icon
            :name="'i-fluent-arrow-enter-20-filled'"
            class="text-xl text-colored"
          />
        </nuxt-link>

        <div class="buttons">
          <div 
            v-if="auth.loggedIn && auth.user.user_settings && auth.user.user_settings.show_explicit"
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
          <div class="hidden-md-flex">
            <nuxt-link
              class="discover-button"
              :to="discoverRoute"
            >
              {{ $t('seeMore') }}
            </nuxt-link>
          </div>
        </div>
      </div>

      <!-- On loading, empty or error-->
      <LoadingEmptyErrorMessage
        :loading="loading"
        :empty="isEmpty"
        :empty-message="'No artwork yet, be the first one to upload your artwork here.'"
        :error="isError"
        :fetch="fetchTop"
      />

      <!-- List area -->
      <div v-show="!loading">
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

        <!-- Open discover page when the pagination already show too much -->
        <div v-show="loadMoreOptions.showDiscoveryButton">
          <nuxt-link
            :to="'/artworks/' + section"
            class="w-full primary-button"
          >
            <Icon
              :name="'i-fluent-arrow-enter-20-filled'"
              class="mr-1 text-white hover:text-white"
            />
            {{ $t('seeMore') }}
          </nuxt-link>
        </div>
      </div>

      <!-- Artwork modal view -->
      <div 
        :id="section+'-modal'"
        class="modal work-view" 
      >
        <ModalView 
          v-show="!loading"
          :ref="section+'ModalViewRef'"
          :section="section"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
// stores
import useAuthStore from '@/stores/auth.store'

// components
import Icon from '~/components/globals/Icon.vue'
import WorkList from '~/components/artworks/WorkList.vue'
import ModalView from '~/components/artworks/views/ModalView.vue'
import LoadingEmptyErrorMessage from '~/components/globals/LoadingEmptyErrorMessage.vue'

// stores
const auth = useAuthStore()

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const artworkApi = useArtwork(oApiConfiguration, fetchOptions())

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  section: {
    type: String,
    default: ''
  },
  paginationProp: {
    type: Object,
    default() {
      return {
        perPage: {
          type: Number,
          default: 6
        },
        maxLoadMore: {
          type: Number,
          default: 5
        }
      }
    }
  },
  discoverRoute: {
    type: String,
    default: '/'
  }
})

onMounted(async () => {
  await fetchTop()
})

/** Fetch first row */
const works = ref([])
const fetchTop = async () => {
  const data = await fetch()

  if (data) {
    const dataWorks = data.works
    const dataPagination = data.pagination

    works.value = dataWorks
    
    if (dataPagination.record_total <= pagination.perPage) {
      hideLoadMoreButton()
    }

    if (dataPagination.record_total === 0) {
      showEmpty()
    }
  } else {
    showError()
  }
}

/** Fetch */
const loading = ref(true)
const explicitMode = ref(undefined)
const pagination = reactive({
  perPage: props.paginationProp.perPage,
  page: ref(0)
})
const fetch = async () => {
  if (pagination.page === 0) {
    loading.value = true
  }

  try {
    let data, error

    if (props.section === 'recent') {
      const [latestArtworks, fetchError] = await artworkApi.getLatest({
        pagination: {
          page: pagination.page,
          perPage: pagination.perPage
        },
        explicitMode: explicitMode.value
      })

      if (latestArtworks) {
        data = latestArtworks
      } else {
        error = fetchError
      }
    } else if (props.section === 'following') {
      const [followingArtworks, fetchError] = await artworkApi.getFollowing({
        pagination: {
          page: pagination.page,
          perPage: pagination.perPage
        },
        explicitMode: explicitMode.value
      })

      if (followingArtworks) {
        data = followingArtworks
      } else {
        error = fetchError
      }
    } else if (props.section === 'popular') {
      const [popularArtworks, fetchError] = await artworkApi.getMostPopular({
        pagination: {
          page: pagination.page,
          perPage: pagination.perPage
        },
        explicitMode: explicitMode.value,
        range: 'daily',
        rangeMode: 'views'
      })

      if (popularArtworks) {
        data = popularArtworks
      } else {
        error = fetchError
      }
    }

    pagination.page += 1
    reset()

    return data
  } catch (error) {
    showError()
  }
}

// Load more function
const loadMoreOptions = ref({
  delay: false,
  maxLoad: props.paginationProp.maxLoadMore,
  showDiscoveryButton: false
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

  if (dataPagination.next_previous.next_page && dataPagination.current_page === loadMoreOptions.value.maxLoad) {
    hideLoadMoreButton()
    loadMoreOptions.value.showDiscoveryButton = true
  }
}

/** Show/hide load more button for pagination */
const showLoadMoreButton = ref(true)
const hideLoadMoreButton = () => {
  showLoadMoreButton.value = false
}

/** Show empty if there's no artwork to show */
const isEmpty = ref(false)
const showEmpty = () => {
  isEmpty.value = true
  hideLoadMoreButton()
}

/** Show error message when error occured while trying to fetch artworks */
const isError = ref(false)
const showError = () => {
  loading.value = false
  isError.value = true
  hideLoadMoreButton()
}

/** Reset refs */
const reset = () => {
  loading.value = false
  isEmpty.value = false
  isError.value = false
}

/** Change epxlicit mode for authenticated user and user who activate explicit content */
const changeExplicitMode = (mode) => {
  explicitMode.value = mode
  pagination.page = 0
  showLoadMoreButton.value = true
  loadMoreOptions.value.showDiscoveryButton = false

  fetchTop()
}

/** Artwork viewer, open a modal */
const recentModalViewRef = ref(null)
const followingModalViewRef = ref(null)
const popularModalViewRef = ref(null)
const view = (workId, keepArtistPageNumber = false) => {
  if (props.section === 'recent') {
    recentModalViewRef.value.view(workId, keepArtistPageNumber)
  }

  if (props.section === 'following') {
    followingModalViewRef.value.view(workId, keepArtistPageNumber)
  }

  if (props.section === 'popular') {
    popularModalViewRef.value.view(workId, keepArtistPageNumber)
  }

  useModal().openModal(`${props.section}-modal`)
}
</script>

<style lang="scss" scoped>
// @import '~/assets/css/tailwind.scss';
@import '~/assets/css/artworks/list.scss';
</style>

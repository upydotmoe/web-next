<template>
  <div>
    <div
      id="options"
      class="md:z-10 md:sticky md:top-0"
    >
      <div class="navigations">
        <div class="title">
          {{ $t('artworks.artworks') }}
        </div>

        <!-- Options -->
        <!-- Filter popularity range by Daily/Weekly/Monthly or All-time -->
        <div class="buttons">
          <!-- Following only -->
          <div
            v-show="auth.loggedIn"
            class="filter-buttons"
          >
            <button 
              class="px-3 rounded-md button-item"
              :class="followingOnly ? 'button' : 'theme-color'"
              @click="toggleFollowingOnlyFilter()" 
            >
              <Icon
                v-show="followingOnly"
                :name="'i-fluent-people-checkmark-24-regular'"
                class="text-white"
              />
              <Icon
                v-show="!followingOnly"
                :name="'i-fluent-people-checkmark-24-regular'"
              /> 
              
              {{ $t('followingOnly') }}
            </button>
          </div>

          <!-- Toggle list by latest or popularity -->
          <div class="filter-buttons">
            <p 
              class="rounded-l-md button-item"
              :class="[listMode === 'recent' ? 'button' : 'theme-color']"
              @click="changeListMode('recent')"
            >
              {{ $t('artworks.newest') }}
            </p>
            <p 
              class="rounded-r-md button-item"
              :class="[listMode === 'popularity' ? 'button' : 'theme-color']"
              @click="changeListMode('popularity')"
            >
              <Icon 
                :name="'i-icon-park-outline-oval-love-two'"
                :class="[
                  { 'text-white': listMode === 'popularity' }
                ]"
              /> 
              {{ $t('artworks.mostPopular') }}
            </p>
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

      <div
        v-if="listMode === 'popularity'"
        class="navigations"
      >
        <div />
        <div class="buttons">
          <div class="filter-buttons">
            <p 
              class="rounded-l-md button-item"
              :class="[popularityRange === 'daily' ? 'button' : 'theme-color']"
              @click="changePopularityRange('daily')"
            >
              {{ $t('daily') }}
            </p>
            <p 
              class="button-item" 
              :class="[popularityRange === 'weekly' ? 'button' : 'theme-color']"
              @click="changePopularityRange('weekly')"
            >
              {{ $t('weekly') }}
            </p>
            <p 
              class="button-item" 
              :class="[popularityRange === 'monthly' ? 'button' : 'theme-color']"
              @click="changePopularityRange('monthly')"
            >
              {{ $t('monthly') }}
            </p>
            <p 
              class="rounded-r-md button-item" 
              :class="[popularityRange === 'all' ? 'button' : 'theme-color']"
              @click="changePopularityRange('all')"
            >
              {{ $t('allTime') }}
            </p>
          </div>

          <div class="filter-buttons">
            <div class="inline-block w-full md:w-52 group">
              <button class="flex items-center py-2 px-3 w-full rounded-md border-2 border-transparent outline-none md:w-52 theme-color hover:button focus:outline-none">
                <span class="flex-1 pr-1">{{ sortBy === 'views' ? $t('mostViewed') : sortByTitle }}</span>
                <span>
                  <svg
                    class="w-4 h-4 transition duration-150 ease-in-out transform fill-current group-hover:-rotate-180"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </span>
              </button>
              <ul class="absolute z-10 mt-1 w-full text-center rounded-md transition duration-150 ease-in-out transform origin-top scale-0 md:w-52 theme-color group-hover:scale-100">
                <!-- <li class="py-2 px-3 rounded-t-md cursor-pointer hover:button" :class="{ 'button': sortBy === 'none' }" @click="changeSort('none', $t('default'))">{{ $t('default') }}</li> -->
                <li
                  class="flex flex-row justify-between py-2 px-3 cursor-pointer hover:button icon-hover-parent"
                  :class="{ 'button': sortBy === 'views' }"
                  @click="changeSort('views', $t('mostViewed'))"
                >
                  <Icon
                    :name="'i-mi-eye'"
                    :class="{ 'text-white': sortBy === 'views' }"
                  />
                  {{ $t('mostViewed') }}
                </li>
                <li
                  class="flex flex-row justify-between py-2 px-3 cursor-pointer hover:button icon-hover-parent"
                  :class="{ 'button': sortBy === 'likes' }"
                  @click="changeSort('likes', $t('mostLiked'))"
                >
                  <Icon
                    :name="'i-ri-heart-3-line'"
                    :class="{ 'text-white': sortBy === 'likes' }"
                  />
                  {{ $t('mostLiked') }}
                </li>
                <li
                  class="flex flex-row justify-between py-2 px-3 rounded-b-md cursor-pointer hover:button icon-hover-parent"
                  :class="{ 'button': sortBy === 'comments' }"
                  @click="changeSort('comments', $t('mostCommented'))"
                >
                  <Icon
                    :name="'i-mdi-comment-multiple-outline'"
                    :class="{ 'text-white': sortBy === 'comments' }"
                  />
                  {{ $t('mostCommented') }}
                </li>
              </ul>
            </div>
          </div>
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
        :section-class="'work-grid-6'"
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

    <!-- artwork modal view component -->
    <div 
      id="popular-modal"
      class="modal work-view" 
    >
      <ModalView 
        v-show="!loading"
        ref="popularModalViewRef"
        section="popular"
      />
    </div>
  </div>
</template>

<script setup>
// stores
import useAuthStore from '@/stores/auth.store'

// components
import Icon from '~/components/globals/Icon.vue'
import WorkList from '~/components/artworks/WorkList.vue'
import LoadingEmptyErrorMessage from '~/components/globals/LoadingEmptyErrorMessage.vue'
import ModalView from '~/components/artworks/views/ModalView.vue'

// stores
const auth = useAuthStore()

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const artworkApi = useArtwork(oApiConfiguration, fetchOptions())

const emit = defineEmits([
  'countArtworks'
])

const route = useRoute()
const { q } = route.query

// watch for search query/keyword change
watch (() => route.query.q, (newKeyword, oldKeyword) => {
  if (newKeyword !== oldKeyword) {
    keyword.value = newKeyword
    
    if (newKeyword && newKeyword !== '') {
      fetchTop()
    }
  }
})

/** Before mount, fetch first row */
const keyword = ref(q)
onMounted (() => {
  fetchTop()

  addClassToStickyOptionsElement()
})

const addClassToStickyOptionsElement = () => {
  var newEl = document.createElement("div")
  newEl.classList.add("myObserver")
  var optionsEl = document.querySelector("#options")
  insertBefore(newEl, optionsEl);
  function insertBefore(el, referenceNode) {
    referenceNode.parentNode.insertBefore(el, referenceNode)
  }

  var observer = new IntersectionObserver(
    function (entries) {
      if (entries[0].intersectionRatio === 0) {
        document.querySelector("#options").classList.add("md:pt-4", "md:pb-1", "md:theme-color-secondary", "md:rounded-b-md", "md:px-6", "md:mt-2", "md:border-color-button-color", "md:border-2", "md:border-t-0")
      } else if (entries[0].intersectionRatio === 1) {
        document.querySelector("#options").classList.remove("md:pt-4", "md:pb-1", "md:theme-color-secondary", "md:rounded-b-md", "md:px-6", "md:mt-2", "md:border-color-button-color", "md:border-2", "md:border-t-0")
      }
    },
    { threshold: [0, 1] }
  );

  observer.observe(document.querySelector(".myObserver"))
}

// change list mode by latest uploaded works or popularity
const listMode = ref('recent')
const changeListMode = async (mode) => {
  listMode.value = mode
  await fetchTop()
}

// Change epxlicit mode for authenticated user and user who activate explicit content
const explicitMode = ref(undefined)
const changeExplicitMode = async (mode) => {
  explicitMode.value = mode

  await fetchTop()
}

// Change sort option
const sortBy = ref('views')
const sortByTitle = ref('')
const changeSort = async (key, text) => {
  sortBy.value = key
  sortByTitle.value = text

  await fetchTop()
}

// Change popularity range (default, daily, weekly, monthly)
const popularityRange = ref('daily')
const changePopularityRange = async (mode) => {
  popularityRange.value = mode

  await fetchTop()
}

// Show works by followed users only
const followingOnly = ref(false)
const toggleFollowingOnlyFilter = async () => {
  followingOnly.value = !followingOnly.value

  await fetchTop()
}

/**
 * Fetch first row.
 * Fired when:
 *  - Opening the page for the first time
 *  - Changing filters that need to clear current results
 */
const works = ref([])
const fetchTop = async () => {
  resetBeforeFetch()

  const { works: dataWorks, pagination: dataPagination } = await fetch()
  
  if (dataWorks.length && dataPagination.record_total) {
    works.value = dataWorks
  }

  emit('countArtworks', dataPagination.record_total)
}

/**
 * Fetch next page
 */
const loading = ref(true)
const isError = ref(false)
const isEmpty = computed(() => !isError.value && !works.value.length)
const showLoadMoreButton = ref(true)
const pagination = ref({
  perPage: 24,
  page: 0
})
const fetch = async () => {
  const [data, error] = await artworkApi.getSearch({
    recentMode: listMode.value === 'recent',
    range: popularityRange.value,
    rangeMode: sortBy.value,
    explicitMode: explicitMode.value,
    keyword: keyword.value ?? '',
    followingOnly: followingOnly.value === false ? undefined : followingOnly.value,
    pagination: {
      perPage: pagination.value.perPage,
      page: pagination.value.page
    }
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

// Artwork view modal element ref
const popularModalViewRef = ref(null)
const view = (workId, keepArtistPageNumber = false) => {
  popularModalViewRef.value.view(workId, keepArtistPageNumber)
  useModal().openModal('popular-modal')
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/tailwind.scss';
@import '~/assets/css/artworks/list.scss';
</style>

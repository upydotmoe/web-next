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
          {{ $t('followings.followings') }}
        </div>

        <!-- Options -->
        <div class="buttons">
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

      <!-- List area -->
      <div
        v-show="!loading"
        class="mt-4"
      >
        <WorkList
          v-show="!isEmpty"
          :section-class="'work-grid-10'"
          :works="works"
          :view="view"
        />
      </div>

      <!-- Paging control -->
      <div
        v-if="!loading && !isEmpty && !isError"
        class="art-list-view-paging-control"
      >
        <button
          :class="[
            config.pagination.enablePrev ? 'primary-button' : 'disabled-button'
          ]"
          @click="movePage('prev')"
        >
          <Icon :name="'i-ion-chevron-back-outline'" />
          {{ $t('pagination.previous') }}
        </button>
        <button
          :class="[
            config.pagination.enableNext ? 'primary-button' : 'disabled-button'
          ]"
          @click="movePage('next')"
        >
          {{ $t('pagination.next') }}
          <Icon
            :name="'i-ion-chevron-forward-outline'"
            class="md:ml-2"
            style="margin-right: 0 !important"
          />
        </button>
      </div>

      <!-- artwork modal view component -->
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
    </div>
  </Layout>
</template>

<script setup>
// stores
import useAuthStore from '@/stores/auth.store'

// components
import Icon from '~/components/globals/Icon.vue'
import Layout from '~/components/layouts/Layout.vue'
import WorkList from '~/components/artworks/WorkList.vue'
import ModalView from '~/components/artworks/views/ModalView.vue'
import LoadingEmptyErrorMessage from '~/components/globals/LoadingEmptyErrorMessage.vue'

// stores
const auth = useAuthStore()

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const artworkApi = useArtwork(oApiConfiguration, fetchOptions())

const { $router } = useNuxtApp()

/** Before mount, fetch first rows */
onBeforeMount(() => {
  if (!auth.loggedIn) {
    $router.push('/')
  }

  fetchTop()
})

// Change epxlicit mode for authenticated user and user who activate explicit content
const explicitMode = ref(undefined)
const changeExplicitMode = async (mode) => {
  explicitMode.value = mode
  pagination.page = 0

  await fetchTop()
}

/** Fetch first row */
const works = ref([])
const config = ref({
  pagination: {
    enablePrev: true,
    enableNext: true
  }
})
const fetchTop = async () => {
  const data = await fetch()

  const dataWorks = data.works
  const dataPagination = data.pagination

  // handle empty data
  if (!dataWorks.length && dataPagination.record_total === 0) {
    showEmpty()
  } else {
    works.value = dataWorks

    if (dataPagination.next_previous.next_page === null) {
      config.value.pagination.enableNext = false
    } else {
      config.value.pagination.enableNext = true
    }

    if (dataPagination.next_previous.prev_page === null) {
      config.value.pagination.enablePrev = false
    } else {
      config.value.pagination.enablePrev = true
    }
  }
}

/** Fetch */
const loading = ref(true)
const pagination = reactive({
  perPage: 30,
  page: ref(0)
})
const fetch = async () => {
  if (pagination.page === 0) {
    loading.value = true
  }

  const [data, error] = await artworkApi.getFollowing({
    pagination: {
      perPage: pagination.perPage,
      page: pagination.page
    },
    explicitMode: explicitMode.value
  })

  if (error) {
    showError()
  } else {
    reset()
    return data
  }
}

// Control pagination and fetch
const movePage = async (mode) => {
  if (mode === 'prev') {
    pagination.page -= 1
  } else {
    pagination.page += 1
  }

  await fetchTop()
  window.scrollTo(0, 0)
}

/** Show empty if there's no artwork to show */
const isEmpty = ref(false)
const showEmpty = () => {
  isEmpty.value = true
}

/** Show error message when error occured while trying to fetch artworks */
const isError = ref(false)
const showError = () => {
  loading.value = false
  isError.value = true
  hideButton()
}

/** Reset refs */
const reset = () => {
  loading.value = false
  isEmpty.value = false
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

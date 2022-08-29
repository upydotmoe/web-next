<template>
  <div class="artist-works">
    <div class="heading">
      <span>
        {{ $t('artworks.moreArtworkBy') }}
        <nuxt-link v-if="artworkDetail.users" :to="'/profile/u/'+artworkDetail.users.username" class="text-colored">
          {{ artworkDetail.users.username }} &#60;{{ artworkDetail.users.name }}&#62;
        </nuxt-link>
      </span>

      <nuxt-link :to="'/profile/u/'+artworkDetail.users.username" target="_blank" class="flex flex-row cursor-pointer">
        <Icon :name="'i-ci-external-link'" />
      </nuxt-link>
    </div>

    <!-- User artwork's list -->
    <WorkList 
      v-show="!isError"
      class="gap-3 md:gap-4"
      :class="[ pagination.options.nextPrevLoading ? 'animate-pulse' : '', paginationPerPage === 6 ? 'grid-cols-6' : 'grid-cols-4' ]"
      :section-class="'works'"
      :works="worksByArtist"
      :view="view"
      :is-href="isHref"
      :is-mini-list="true"
    />

    <!-- Pagination controller -->
    <div v-if="artworkDetail.users" class="pagination-controller">
      <span 
        @click="pagination.options.disableArtistPrevButton ? null : nextPrevByArtist(artworkDetail.users.id, 'prev')"
      >
        <Icon :name="'i-ion-chevron-back'" />
      </span>
      <span 
        @click="pagination.options.disableArtistNextButton ? null : nextPrevByArtist(artworkDetail.users.id, 'next')"
      >
        <Icon :name="'i-ion-chevron-forward'" />
      </span>
    </div>
  </div>
</template>

<script setup>
// components
import WorkList from '~/components/artworks/WorkList.vue'
import Icon from '~/components/globals/Icon.vue'

/**
 * @props
 */
const props = defineProps ({
  artworkDetail: {
    type: Object,
    default () {
      return {}
    }
  },
  keepArtistPageNumber: {
    type: Boolean,
    default: false
  },
  view: Function,
  isHref: {
    type: Boolean,
    default: false
  },
  paginationPerPage: {
    type: Number,
    default: 4
  }
})

// assign artwork detail from props to variable detail
const detail = props.artworkDetail

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const artworkApi = useArtwork(oApiConfiguration, fetchOptions())

// 
const currentViewUserId = ref(null)

onMounted (() => {
  if (!props.keepArtistPageNumber) {
    pagination.page = -1
  }
  nextPrevByArtist(detail.users.id)
})

/** Get artist's works */
const worksByArtist = ref([])
const pagination = reactive({
  page: 0,
  perPage: props.paginationPerPage,
  options: {
    nextPrevLoading: false,
    disableArtistNextButton: true,
    disableArtistPrevButton: true
  }
})
const nextPrevByArtist = async (userId, mode) => {
  pagination.options.nextPrevLoading = true

  if (userId !== currentViewUserId.value) {
    currentViewUserId.value = userId
    pagination.page = -1
  }

  if (mode === 'prev') {
    pagination.page -= 1
  } else {
    pagination.page += 1
  }

  const [works, workPagination, error] = await artworkApi.getUserArtworks({
    userId,
    pagination: {
      page: pagination.page,
      perPage: pagination.perPage
    }
  })

  if (error) {
    showError()
  } else {
    if (workPagination.next_previous.prev_page === null || workPagination.next_previous.prev_page === undefined) {
      pagination.options.disableArtistPrevButton = true
    } else {
      pagination.options.disableArtistPrevButton = false
    }

    if (workPagination.next_previous.next_page === null || workPagination.next_previous.next_page === undefined) {
      pagination.options.disableArtistNextButton = true
    } else {
      pagination.options.disableArtistNextButton = false
    }
    
    worksByArtist.value = works
  }

  pagination.options.nextPrevLoading = false
}

/** When error occured while trying to fetch user's artworks */
const isError = ref(false)
const showError = () => {
  isError.value = true
}
</script>

<style lang="scss" scoped>
@import "~/assets/css/artworks/view.scss";
</style>

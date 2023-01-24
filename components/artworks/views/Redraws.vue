<template>
  <section
    v-if="artwork.redraw_of"
    id="original-artwork-info-section"
  >
    <h2 class="title">
      {{ $t('artworks.originalArtwork') }}
    </h2>
          
    <!-- original artwork info -->
    <!-- loading screen -->
    <div
      v-if="originalArtworkLoading"
      class="flex flex-row gap-2"
    >
      <Spinner /> {{ $t('artworks.redrawOriginalLoading') }}
    </div>

    <!-- mini preview of original artwork -->
    <MiniArtworkPreview
      v-else
      :data="originalArtwork"
      :work-id="artwork.redraw_of"
    />
  </section>

  <div
    v-if="artwork.allow_redraw"
    class="custom-divider"
  />

  <!-- redraw list section (show this if current artwork is redrawable) -->
  <section
    v-if="artwork.allow_redraw || (artworkRedraws.data && artworkRedraws.data.length)"
    id="redrawable-section"
    class="flex flex-col gap-4"
  >
    <h2 class="title">
      {{ $t('artworks.redraws') }}
      ({{ artworkRedraws.pagination && artworkRedraws.pagination.record_total ? artworkRedraws.pagination.record_total : 0 }})
    </h2>

    <!-- redraw list -->
    <section
      v-if="artworkRedraws.data && artworkRedraws.data.length"
      id="redraw-list-section"
    >
      <WorkList
        :section-class="'redraw-works'"
        :works="artworkRedraws.data"
        :view="view"
        :is-href="isHref"
        :is-mini-list="true"
        :current-work-id="artwork.id"
        :direct-open="true"
        :hide-redraw-icon="true"
      />

      <nuxt-link
        v-if="artworkRedraws.pagination.next_previous.next_page" 
        :to="'/a/'+artwork.id+'/redraws'"
        class="mt-2 primary-button"
      >
        <Icon
          :name="'i-fluent-arrow-enter-20-filled'"
          class="mr-1 text-white hover:text-white"
        />
        {{ $t('seeMore') }}
      </nuxt-link>
    </section>

    <!-- redraw button -->
    <div
      v-if="auth.loggedIn && !myRedraw.id"
      class="flex flex-row gap-2 justify-between w-full"
    >
      <nuxt-link
        :to="'/post?redrawWorkId='+artwork.id"
        :class="[
          !isModal ? 'light-button' : 'secondary-button'
        ]"
      >
        <Icon :name="'i-typcn-brush'" />
        {{ $t('artworks.redrawThisArtwork') }}
      </nuxt-link>
    </div>
          
    <!-- my redraw/current user submission (show only if user has redrawed this artwork) -->
    <section
      v-if="auth.loggedIn && myRedraw.id"
      id="my-redraw-section"
    >
      <h2 class="title-tiny">
        {{ $t('artworks.myRedraw') }}
      </h2>

      <!-- current user redraw image, title, description, etc. -->
      <nuxt-link
        :to="'/a/'+myRedraw.id"
        class="flex flex-row gap-2 w-full"
      >
        <div
          v-if="myRedraw.artwork_assets"
          class="w-1/3"
        >
          <nuxt-img
            preload
            loading="lazy"
            class="w-40 rounded-md"
            :src="artworkThumb(myRedraw.artwork_assets[0].bucket, myRedraw.artwork_assets[0].filename, 'thumbnail', false)"
            @error="imageLoadError"
          />
        </div>

        <div class="w-2/3">
          <span class="title">{{ myRedraw.title }}</span>
          <p
            class="mb-2"
            v-html="myRedraw.description ? (myRedraw.description.length > 100 ? myRedraw.description.slice(0, 100) + '..' : originalArtwork.description) : $t('artworks.noDescription')"
          />

          <span class="italic">{{ formatDate(myRedraw.scheduled_post) }}</span>
        </div>
      </nuxt-link>
    </section>
  </section>
</template>

<script setup>
// stores
import useAuthStore from '@/stores/auth.store'

// components
import Icon from '~/components/globals/Icon.vue'
import Spinner from '~/components/globals/Spinner.vue'
import WorkList from '~/components/artworks/WorkList.vue'
import MiniArtworkPreview from './MiniArtworkPreview.vue'

// stores
const auth = useAuthStore()

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const artworkApi = useArtwork(oApiConfiguration, fetchOptions())

const props = defineProps({
  artwork: {
    type: Object,
    default: () => {}
  },
  isModal: {
    type: Boolean,
    default: false
  }
})

onMounted(async () => {
  await countRedraws()

  if (props.artwork.redraw_of) {
    fetchoriginalArtworkInfo(props.artwork.redraw_of)
  }
})

const originalArtwork = ref({})
const originalArtworkLoading = ref(true)
const fetchoriginalArtworkInfo = async (originalArtworkId) => {
  originalArtworkLoading.value = true

  const [data, error] = await artworkApi.getWorkById(originalArtworkId)

  if (error) {
    // todo: handle error
  } else {
    originalArtwork.value = data
  }

  originalArtworkLoading.value = false
}

const redrawCount = ref(0)
const countRedraws = async () => {
  const [redrawTotal, error] = await artworkApi.countRedraws(props.artwork.id)

  redrawCount.value = redrawTotal

  if (redrawTotal) {
    await fetchRedraws(props.artwork.id)
    
    if (auth.loggedIn) {
      await fetchMyRedraw(props.artwork.id)
    }
  }
}

// get redraws of artwork
const artworkRedraws = ref({
  data: [],
  pagination: {}
})
const fetchRedraws = async (workId) => {
  const [redraws, paginationData, error] = await artworkApi.getRedraws({
    workId,
    pagination: {
      page: 0,
      perPage: 8
    }
  })

  if (!error) {
    artworkRedraws.value.data = redraws
    artworkRedraws.value.pagination = paginationData
  }
}

const myRedraw = ref({})
const fetchMyRedraw = async (workId) => {
  const [redraw, error] = await artworkApi.getMyRedraw({
    workId
  })

  if (!error) {
    myRedraw.value = redraw
  }
}
</script>
<template>
  <section
    v-if="feed.artwork_share_info"
    id="shared-artwork-info"
    :class="[
      'my-2 w-full rounded-md',
      colorReversed ? 'theme-color' : 'theme-color-secondary'
    ]"
  >
    <ArtistDetail
      :feed="feed.artwork_share_info"
    />

    <!-- title & description of shared artwork -->
    <ArtworkMetadata
      :feed="feed.artwork_share_info"
      :bypass="true"
    />

    <!-- artwork image(s) -->
    <div>
      <div
        :class="[
          'p-2',
          { 'cursor-pointer': !feed.apply_explicit_filter || feed.apply_gore_filter }
        ]"
        @click.prevent="$emit(
          'view',
          feed.artwork_share_info.id,
          feed.apply_gore_filter ? feed.apply_gore_filter : feed.apply_explicit_filter,
          feedIdx
        )"
      >
        <div
          :class="[
            'overflow-hidden relative md:p-2 rounded-md',
            { 'md:mx-2': feed.apply_explicit_filter || feed.apply_gore_filter }
          ]"
        >
          <ImageList
            :class="[
              { 'blur-3xl unclickable': feed.apply_explicit_filter || feed.apply_gore_filter },
              feed.apply_explicit_filter || feed.apply_gore_filter ? 'brightness-50' : 'brightness-100'
            ]"
            :work="feed"
          />

          <!-- filter message -->
          <div
            v-if="feed.apply_explicit_filter || feed.apply_gore_filter"
            :class="[
              'p-2 mx-auto w-full text-center rounded-md opacity-90',
              feed.apply_gore_filter ? 'bg-red-500 text-white' : 'bg-yellow-300 text-black'
            ]"
          >
            <div v-if="feed.apply_explicit_filter && !feed.apply_gore_filter">
              {{ auth.loggedIn ? $t('explicitContentAlert') : $t('explicitContentAlertForGuest') }}
            </div>
            <div v-if="feed.apply_gore_filter">
              {{ auth.loggedIn ? $t('goreContentAlert') : $t('goreContentAlertForGuest') }}
            </div>

            <button class="mx-auto mt-2 primary-button">
              {{ $t('explicitShowMeThisContent') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// stores
import useAuthStore from '@/stores/auth.store'

// components
import ArtistDetail from './ArtistDetail.vue'
import ImageList from '~/components/feeds/ImageList.vue'
import ArtworkMetadata from './ArtworkMetadata.vue'

// stores
const auth = useAuthStore()

defineEmits(['readMore', 'view'])
defineProps({
  colorReversed: {
    type: Boolean,
    default: false
  },
  feed: {
    type: Object,
    default: () => {}
  },
  feedIdx: {
    type: Number,
    default: () => 0
  }
})
</script>
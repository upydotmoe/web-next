<template>
  <section
    v-if="feed.type === 'feed'"
    id="text-feed"
    class="px-2 md:px-4"
  >
    <p
      v-if="feed.text"
      :id="'feed-text-'+feed.id"
      v-html="feed.text.length > 500 ? `${feed.text.slice(0, 500)}...` : feed.text"
    />

    <a
      v-if="feed.text && feed.text.length > 500"
      :id="'feed-read-more-'+feed.id"
      class="href"
      @click.prevent="$emit('readMore', feed.text, feed.id, 'feed-read-more-', 'feed-text-')"
    >
      {{ $t('readMore') }}
    </a>

    <!-- shared artwork post detail -->
    <SharedArtworkDetail
      :feed="feed"
      @read-more="readMore"
      @view="view"
    />
  </section>
</template>

<script setup>
// stores
import useAuthStore from '@/stores/auth.store'
import ArtistDetail from './ArtistDetail.vue';
import SharedArtworkDetail from './SharedArtworkDetail.vue';

// stores
const auth = useAuthStore()

defineEmits(['readMore', 'view'])
defineProps({
  feed: {
    type: Object,
    default: () => {}
  },
  feedIdx: {
    type: Number,
    default: () => 0
  },
  readMore: {
    type: Function,
    default: () => {}
  },
  view: {
    type: Function,
    default: () => {}
  }
})
</script>
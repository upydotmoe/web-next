<template>
  <section
    v-if="bypass || feed.type === 'feed'"
    id="text-feed"
    :class="[
      'px-2 mb-2 mx-0 md:px-4',
      { '!p-0': isModal }
    ]"
  >
    <p
      v-if="feed.text"
      :id="`${isModal}feed-text-`+feed.id"
      v-html="feed.text.length > 500 ? `${feed.text.slice(0, 500)}...` : feed.text"
    />

    <a
      v-if="feed.text && feed.text.length > 500"
      :id="`${isModal}feed-text-read-more-`+feed.id"
      class="href read-more-button"
      @click.prevent="$emit('readMore', feed.text, feed.id, `${isModal}feed-text-read-more-`, `${isModal}feed-text-`)"
    >
      {{ $t('readMore') }}
    </a>

    <!-- shared artwork post detail -->
    <SharedArtworkDetail
      :feed="feed"
      :color-reversed="colorReversed"
      :feed-idx="feedIdx"
      :read-more="readMore"
      :is-modal="isModal"
      @read-more="readMore"
      @view="view"
    />
  </section>
</template>

<script setup>
// stores
import useAuthStore from '@/stores/auth.store'
import SharedArtworkDetail from './SharedArtworkDetail.vue';

// stores
const auth = useAuthStore()

defineEmits(['readMore', 'view'])
defineProps({
  bypass: {
    type: Boolean,
    default: false
  },
  isModal: {
    type: Boolean,
    default: false
  },
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
<template>
  <section
    v-if="bypass || feed.type === 'feed'"
    id="text-feed"
    :class="[
      'px-2 mb-2 md:px-4',
      { '!p-0': isModal }
    ]"
  >
    <p
      v-if="feed.text"
      :id="readMoreSelector+feed.id"
      v-html="feed.text.length > 500 ? `${feed.text.slice(0, 500)}...` : feed.text"
    />

    <a
      v-if="feed.text && feed.text.length > 500"
      :id="'el-'+readMoreSelector+feed.id"
      class="href read-more-button"
      @click.prevent="$emit('readMore', feed.text, feed.id, 'el-'+readMoreSelector, readMoreSelector)"
    >
      {{ $t('readMore') }}
    </a>

    <!-- shared artwork post detail -->
    <SharedArtworkDetail
      :feed="feed"
      :color-reversed="colorReversed"
      :feed-idx="feedIdx"
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
  readMoreSelector: {
    type: String,
    default: 'feed-text-'
  },
  view: {
    type: Function,
    default: () => {}
  }
})
</script>
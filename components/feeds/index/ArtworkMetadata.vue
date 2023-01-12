<template>
  <div
    v-if="bypass || feed.type === POST_TYPES.ARTWORK"
    class="feed__info"
  >
    <span class="feed__info__title">{{ feed.title }}</span>

    <div
      v-if="feed.description"
      class="feed__info__description"
    >
      <p
        :id="`${isModal}feed-description-`+feed.id"
        class="feed-description"
        v-html="feed.description.length > 300 ? `${feed.description.slice(0, 300)}...` : feed.description"
      />

      <a
        v-if="feed.description.length > 300"
        :id="`${isModal}feed-read-more-`+feed.id"
        @click.prevent="$emit('readMore', feed.description, feed.id, `${isModal}feed-read-more-`, `${isModal}feed-description-`)"
      >
        {{ $t('readMore') }}
      </a>
    </div>
  </div>
</template>

<script setup>
import { POST_TYPES } from '~/utils/constants'

defineEmits(['readMore'])
defineProps({
  bypass: {
    type: Boolean,
    default: false
  },
  feed: {
    type: Object,
    default: () => {}
  },
  isModal: {
    type: Boolean,
    default: false
  }
})
</script>

<style lang="scss" scoped>
.feed__info {
  @apply px-2 md:px-4;

  &__title {
    @apply font-semibold text-tiny md:text-base;
  }

  &__description {
    p {
      @apply text-xs mt-2;
    }

    a {
      @apply href;
    }
  }
}
</style>
<template>
  <section
    id="artwork-feed"
    class="feed"
  >
    <ArtworkMetadata
      :feed="feed"
      @readMore="readMore"
    />

    <!-- if artwork is a redraw of someone's artwork then show the original artwork information -->
    <section
      id="redraw"
      class="feed__redraw"
    >
      <div
        v-if="feed.redraw_of && feed.redrawed_artwork_info"
        class="feed__redraw__mini-preview"
      >
        <a
          :href="'/a/'+feed.redraw_of"
          target="_blank"
        >
          <i class="text-xs">{{ $t('artworks.redrawed') }}</i>

          <!-- image -->
          <div class="feed__redraw__mini-preview__image">
            <nuxt-img
              preload
              loading="lazy"
              :src="artworkThumb(feed.redrawed_artwork_info.artwork_assets.bucket, feed.redrawed_artwork_info.artwork_assets.filename, 'thumbnail', false)"
              @error="imageLoadError"
            />
            <span class="preview-title">{{ feed.redrawed_artwork_info.title }}</span>
          </div>
        </a>
      </div>

      <!-- image list -->
      <div class="feed__image-list">
        <div
          v-if="feed.type === POST_TYPES.ARTWORK"
          class="cursor-pointer"
          @click.prevent="$emit('view', feed.id)"
        >
          <ImageList
            class="image-list"
            :work="feed"
          />
        </div>
      </div>
    </section>
  </section>
</template>

<script setup>
// constants
import { POST_TYPES } from '~/utils/constants'

// components
import ImageList from '~/components/feeds/ImageList.vue'
import ArtworkMetadata from './ArtworkMetadata.vue'

defineEmits(['view'])
defineProps({
  feed: {
    type: Object,
    default: () => {}
  },
  readMore: {
    type: Function,
    default: () => ({})
  }
})
</script>

<style lang="scss" scoped>
.feed {
  &__redraw {
    &__mini-preview {
      @apply px-2 mt-2 -mb-2 md:px-4;

      a {
        @apply flex flex-col gap-2 p-2 w-full rounded-md theme-color-secondary hover:theme-colored;
      }

      &__image {
        @apply inline-block flex-row w-full rounded-md;

        img {
          @apply inline-block mr-2 w-10 rounded-md;
        }

        .preview-title {
          @apply font-bold text-base;
        }
      }
    }
  }

  &__image-list {
    div {
      @apply cursor-pointer;

      .image-list {
        @apply p-2 md:p-4;
      }
    }
  }
}
</style>
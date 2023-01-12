<template>
  <section
    v-if="feed.users"
    id="artist-info"
    :class="[
      'feeds__artist',
      { '!px-0': isModal }
    ]"
  >
    <div class="flex flex-row gap-2">
      <nuxt-link
        class="feeds__artist__avatar"
        :to="'/u/' + feed.users.username"
      >
        <img
          :src="avatarCoverUrl(feed.users.avatar_bucket, feed.users.avatar_filename)"
          @error="defaultCoverImage"
        >
      </nuxt-link>

      <div class="feeds__artist__name-username">
        <nuxt-link
          :to="'/u/' + feed.users.username"
          class="name"
        >
          {{ feed.users.name }}
        </nuxt-link>
      
        <br>

        <nuxt-link
          :to="'/u/' + feed.users.username"
          class="username"
        >
          @{{ feed.users.username }}
        </nuxt-link>

        <span class="dot-divider">·</span>

        <nuxt-link
          :to="(feed.type === POST_TYPES.ARTWORK || isArtwork ? '/a/' : '/feed/') + feed.id"
          class="post-date"
        >
          {{ formatDate(feed.scheduled_post ? feed.scheduled_post : feed.created_at, true) }}
        </nuxt-link>
      </div>
    </div>

    <Icon
      v-if="showCloseButton"
      :name="'i-ion-close-outline'"
      :text-size="'text-2xl'"
      @click="closeModal(closeModalTarget)"
    />
  </section>
</template>

<script setup>
// constants
import { POST_TYPES } from '~/utils/constants'

// components
import Icon from '~/components/globals/Icon.vue'

defineProps({
  feed: {
    type: Object,
    default: () => {}
  },
  isModal: {
    type: Boolean,
    default: false
  },
  showCloseButton: {
    type: Boolean,
    default: false
  },
  closeModalTarget: {
    type: String,
    default: ''
  },
  isArtwork: {
    type: Boolean,
    default: false
  }
})
</script>

<style lang="scss" scoped>
.feeds__artist {
  @apply flex flex-row justify-between p-2 md:p-4;

  &__avatar {
    img {
      @apply w-10 h-10 rounded-md;
    }
  }

  &__name-username {
    .name {
      @apply text-tiny font-semibold hover:href;
    }

    .username {
      @apply hover:underline text-xxs;
    }

    .dot-divider {
      @apply mx-1;
    }

    .post-date {
      @apply hover:underline text-xxs;
    }
  }
}
</style>
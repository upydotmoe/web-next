<template>
  <section
    v-if="feed.users"
    id="artist-info"
    class="feeds__artist"
  >
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
        :to="(feed.type === POST_TYPES.ARTWORK ? '/a/' : '/feed/') + feed.id"
        class="post-date"
      >
        {{ formatDate(feed.scheduled_post ? feed.scheduled_post : feed.created_at, true) }}
      </nuxt-link>
    </div>
  </section>
</template>

<script setup>
// constants
import { POST_TYPES } from '~/utils/constants'

defineProps({
  feed: {
    type: Object,
    default: () => {}
  }
})
</script>

<style lang="scss" scoped>
.feeds__artist {
  @apply flex flex-row p-2 md:p-4;

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
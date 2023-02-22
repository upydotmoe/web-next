<template>
  <section class="flex-col info">
    <div
      v-if="artworkDetail.users"
      class="user-info"
    >
      <div class="flex flex-row gap-2 w-full">
        <nuxt-link :to="'/u/' + artworkDetail.users.username">
          <img
            class="avatar"
            :src="avatarCoverUrl(artworkDetail.users.avatar_bucket, artworkDetail.users.avatar_filename)"
            @error="defaultCoverImage"
          >
        </nuxt-link>
        <div class="w-full name">
          <div class="flex flex-row justify-between">
            <div class="flex flex-col">
              <nuxt-link
                :to="'/u/' + artworkDetail.users.username"
                class="flex flex-row gap-2 fullname"
              >
                {{ artworkDetail.users.name }}
                <ProBadge v-if="artworkDetail.users.is_pro" />
              </nuxt-link>
              <nuxt-link
                :to="'/u/' + artworkDetail.users.username"
                class="username"
              >
                @{{ artworkDetail.users.username }}
              </nuxt-link>
            </div>

            <!-- close modal button -->
            <div
              v-show="isModal"
              class="p-1 h-7 font-bold text-white bg-red-500 rounded-md border-2 border-red-500 cursor-pointer hover:bg-red-600 hover:border-red-600"
              style="font-size: 10px;"
              @click="closeModal(`${section}-modal`)"
            >
              ESC
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="title">
      {{ artworkDetail.title }}
    </div>

    <div
      v-if="artworkDetail.description"
      class="mb-4"
    >
      <span
        :id="'mview-'+isDesktop+'-description-'+artworkDetail.id"
        v-html="artworkDetail.description.length > 300 ? `${artworkDetail.description.slice(0, 300)}...` : artworkDetail.description"
      />
      <a 
        v-if="artworkDetail.description.length > 300" 
        :id="'mview-'+isDesktop+'-read-more-'+artworkDetail.id" 
        class="href" 
        @click.prevent="readMore(artworkDetail.description, artworkDetail.id, 'mview-'+isDesktop+'-read-more-', 'mview-'+isDesktop+'-description-')"
      >
        {{ $t('readMore') }}
      </a>
    </div>

    <div class="mb-4">
      <span
        :class="[
          'italic text-color-secondary',
          { 'font-bold text-red-400': previewMode }
        ]"
      >
        {{ !previewMode ? $t('publishedIn', { publishDate: formatDate(artworkDetail.scheduled_post) }) : $t('willBePublishedIn', { publishDate: formatDate(artworkDetail.scheduled_post) }) }}
      </span>
    </div>

    <!-- tags -->
    <div
      v-if="artworkDetail.artwork_has_tags && artworkDetail.artwork_has_tags.length"
      class="tags"
    >
      <span 
        v-for="tag in artworkDetail.artwork_has_tags" 
        :key="tag.artwork_tags.id" 
        class="tag"
      >
        <nuxt-link
          :to="`/artworks/browse?tags=${tag.artwork_tags.tag.replaceAll(' ', '+')}`"
          @click="closeModal(`${section}-modal`)"
        >
          {{ tag.artwork_tags.tag }}
        </nuxt-link>
      </span>
      
      <!-- <span class="suggest">
        +suggest
      </span> -->
    </div>
  </section>
</template>

<script setup>
// composables
import useReadMore from '~/composables/useReadMore'

// components
import Icon from '~/components/globals/Icon.vue'
import ProBadge from '~/components/globals/ProBadge.vue'

defineProps({
  section: {
    type: String,
    default: ''
  },
  isModal: {
    type: Boolean,
    default: false
  },
  artworkDetail: {
    type: Object,
    default: () => {}
  },
  previewMode: {
    type: Boolean,
    default: false
  },
  isDesktop: {
    type: Boolean,
    default: false
  }
})

const route = useRoute()

/** Read more description */
const readMore = (description, workId, selectorElId, descriptionElId) => {
  useReadMore().readMore(description, workId, selectorElId, descriptionElId)
}
</script>

<style lang="scss" scoped>
@import "~/assets/css/artworks/view.scss";
</style>

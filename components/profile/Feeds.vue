<template>
  <div class="left-0 w-full md:w-2/3">
    <div
      v-for="(feed, feedIdx) in feeds"
      :key="feed.id"
    >
      <div class="flex flex-row mb-2 rounded-lg border-none shadow-none theme-color-secondary">
        <!-- Images -->
        <div class="w-full">
          <ArtistDetail
            :feed="feed"
          />

          <TextPostDetail
            :feed="feed"
            :read-more="readMore"
            :view="viewArtwork"
            :bypass="true"
            :color-reversed="true"
            @read-more="readMore"
            @view="viewArtwork"
          />

          <!-- Intereaction area -->
          <section
            id="interaction-button-section"
            class="interactions !px-4"
          >
            <div />

            <div
              v-if="auth.loggedIn"
              class="interactions__items"
            >
              <!-- Like -->
              <div 
                class="interactions__item"
                @click="likedIds.includes(feed.id) ? unlike(feed.id) : like(feed.id)"
              >
                <Icon 
                  v-show="likedIds.includes(feed.id)"
                  :id="'profileFeedLikeButton-'+feed.id"
                  :name="'i-ion-heart'" 
                  class="mr-1 text-red-500 hover:text-red-500"
                />
                <Icon
                  v-show="!likedIds.includes(feed.id)"
                  :name="'i-ri-heart-3-line'" 
                  class="mr-1 icon-color hover:text-red-500"
                />
                {{ thousand(feed._count.feed_likes) }}
              </div>

              <!-- Comment -->
              <div
                class="interactions__item"
                @click.prevent="viewFeed(feed.id)"
              >
                <Icon 
                  :name="'i-mdi-comment-multiple-outline'" 
                  class="mr-1 icon-color hover:text-blue-500"
                />
                {{ thousand(feed._count.feed_comments) }}
              </div>

              <!-- option buttons -->
              <div class="ellipsis-menus dropdown">
                <button 
                  type="button" 
                  aria-haspopup="true" 
                  aria-expanded="true" 
                  aria-controls="ellipsis-menu"
                  @click="feedEllipsisClicked(feed.id, feedIdx)"
                >
                  <span>
                    <Icon :name="'i-uit-ellipsis-v'" />
                  </span>
                </button>
                
                <div class="ellipsis-menus__content dropdown-menu">
                  <div 
                    id="ellipsis-menu" 
                    class="ellipsis-menus__content__wrapper"
                    aria-labelledby="option-dropdown-buttons" 
                    role="menu"
                  >
                    <nuxt-link 
                      :to="'/feed/'+feed.id"
                    >
                      <Icon :name="'i-fluent-arrow-enter-20-filled'" />
                      {{ $t('open') }}
                    </nuxt-link>
                    
                    <nuxt-link 
                      :to="'/feed/'+feed.id"
                      target="_blank" 
                    >
                      <Icon :name="'i-ci-external-link'" />
                      {{ $t('openInNewTab') }}
                    </nuxt-link>

                    <div
                      v-if="auth.loggedIn && feed.user_id && auth.user.id === feed.user_id"
                      class="custom-divider"
                    />

                    <div v-if="auth.loggedIn && feed.user_id && auth.user.id === feed.user_id">
                      <a @click="openModal('profile-feed-deletion-confirm-modal')">
                        <Icon :name="'i-ion-trash-outline'" />
                        {{ $t('delete') }}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
    
    <InfiniteLoading
      :load="fetch"
      :is-initial="false"
    >
      <template #loading>
        <div class="loading-empty-error-message">
          <Icon
            :name="'i-line-md-loading-twotone-loop'"
            :text-size="'text-3xl'"
          />
          <div class="mt-2 text-tiny">
            Currently making magic..
          </div>
        </div>
      </template>
      
      <template #no-results>
        <div class="mx-auto mt-10 text-center">
          <b>(ㆆ_ㆆ)</b> {{ $t('feeds.haventPostedAnyUpdate') }}
        </div>
      </template>
        
      <template #no-more>
        <div class="mx-auto text-center">
          {{ $t('youHaveReachedTheEnd') }}
        </div>
      </template>
    </InfiniteLoading>
    
    <!-- Feed Modal View -->
    <div 
      :id="'chronological-feed-modal'"
      class="modal work-view" 
    >
      <FeedModalView
        ref="chronologicalFeedModalViewRef"
        :section="'chronological-feed'"
      />
    </div>

    <!-- artwork modal view component -->
    <div 
      :id="'artwork-modal'"
      class="modal work-view" 
    >
      <ModalView 
        ref="artworkModalViewRef"
        :section="POST_TYPES.ARTWORK"
      />
    </div>
    
    <!-- Feed deletion confirmation dialog -->
    <ConfirmationDialog
      id="profile-feed-deletion-confirm-modal"
      :modal-id="'profile-feed-deletion-confirm-modal'"
      :message="`${$t('alert.areYouSure')} ${$t('alert.youCannotUndoThisAction')}`"
      class="modal"
      @on-accept="removeFeed()"
    />
  </div>
</template>

<script setup>
import { VueEternalLoading as InfiniteLoading } from '@ts-pro/vue-eternal-loading'

import { POST_TYPES } from '~/utils/constants'

// stores
import useAuthStore from '@/stores/auth.store'

// components
import FeedModalView from '~/components/feeds/FeedModalView.vue'
import ModalView from '~/components/artworks/views/ModalView.vue'
import Icon from '~/components/globals/Icon.vue'
import ConfirmationDialog from '~/components/globals/ConfirmationDialog.vue'
import ArtistDetail from '~/components/feeds/index/ArtistDetail.vue'
import TextPostDetail from '~/components/feeds/index/TextPostDetail.vue'

// stores
const auth = useAuthStore()

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const feedApi = useFeed(oApiConfiguration, fetchOptions())
const { generateArtworkThumb } = useUpyImage()

const props = defineProps({
  userId: {
    type: Number,
    default: 0
  }
})

const route = useRoute()

watch (() => route.query, () => {
  setTimeout(() => {
    // close modal on changing route or going back to previous page
    useModal().closeModal('chronological-modal')
    useModal().closeModal('chronological-feed-modal')

    // close collection selection modal
    useModal().closeModal('feed-collection-selection-modal')

    // close collection selection modal
    useModal().closeModal('collection-selection-modal')

    // close album selection modal
    useModal().closeModal('album-selection-modal')

    // close report modal
    useModal().closeModal('report-modal')
  }, 10);
})

const ellipsisFeedIdClicked = ref(0)
const ellipsisFeedIdClickedIdx = ref(0)
const feedEllipsisClicked = (feedId, feedIdx) => {
  ellipsisFeedIdClicked.value = feedId
  ellipsisFeedIdClickedIdx.value = feedIdx
}

const feeds = ref([])
const pagination = ref({
  page: 0,
  perPage: 10
})
const fetch = async ({ loaded }) => {
  const [data, error] = await feedApi.getFeedByUserId({
    userId: props.userId,
    pagination: {
      page: pagination.value.page,
      perPage: pagination.value.perPage
    }
  })

  if (error) {
    // todo: handle error
  }

  pagination.value.page += 1

  for (let feedIdx = 0; feedIdx < data.feeds.length; feedIdx++) {
    const feed = data.feeds[feedIdx]
    
    if (feed.liked) {
      likedIds.value.push(feed.id)
    }

    // collect images and transform to readable url to render in image list
    if (feed.artworks) {
      feed.artworks.images = []
      feed.artworks.apply_explicit_filter = false
      for (let assetIdx = 0; assetIdx < feed.artworks.artwork_assets.length; assetIdx++) {
        if (assetIdx <= 3) {
          const imageUrl = await generateArtworkThumb(feed.artworks.artwork_assets[assetIdx].bucket, feed.artworks.artwork_assets[assetIdx].filename, 'feed')
          feed.artworks.images.push(imageUrl)
        }
      }

      // apply explicit alert if user doesn't activated explicit content in user settings
      if (feed.artworks != null && ((!auth.loggedIn && feed.artworks.is_explicit) || (feed.artworks.is_explicit && !auth.user.user_settings.show_explicit))) {
        feed.artworks.apply_explicit_filter = true
      }
    }

    // finally, push it to feeds array
    feeds.value.push(feed)
  }

  loaded(data.feeds.length, pagination.value.perPage)
}

const chronologicalFeedModalViewRef = ref(null)
const viewFeed = (feedId) => {
  chronologicalFeedModalViewRef.value.view(feedId)

  useModal().openModal('chronological-feed-modal')
}

const artworkModalViewRef = ref(null)
const viewArtwork = (workId, isExplicitFilterApplied, feedIdx) => {
  if (isExplicitFilterApplied) {
    feeds.value[feedIdx].artworks.apply_explicit_filter = false
  } else {
    artworkModalViewRef.value.view(workId)

    useModal().openModal('artwork-modal')
  }
}

/**
 * LIKE & UNLIKE
 */
// like function
const likedIds = ref([])
const like = async (id) => {
  const [success, error] = await feedApi.like({
    feedId: id
  })
  
  if (success) {
    likedIds.value.push(id)
    
    // animate
    const likeButton = document.getElementById(`profileFeedLikeButton-${id}`)
    likeButton.classList.add('animate-bounce')
    setInterval(() => {
      likeButton.classList.remove('animate-bounce')
    }, 2500)
  } else {
    // todo: handle error
  }
}

const unlike = async (id) => {
  const [success, error] = await feedApi.unlike({
    feedId: id
  })
  
  if (success) {
    const indexOfIdToRemove = likedIds.value.indexOf(id)
    likedIds.value.splice(indexOfIdToRemove, 1)
  } else {
    // todo: handle error
  }
}

const readMore = (text, postId, selectorElId, textElid) => {
  useReadMore().readMore(text, postId, selectorElId, textElid)
}

/**
 * Remove/delete feed
 */
const removeFeed = async () => {
  const [success, error] = await feedApi.remove(ellipsisFeedIdClicked.value)

  if (success) {
    feeds.value.splice(ellipsisFeedIdClickedIdx.value, 1)
  } else {
    // todo: handle error
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/tailwind.scss';

.user-info {
  @apply flex flex-row;

  .avatar {
    @apply mr-3 w-10 h-10 rounded-md;
  }

  .name {
    .fullname {
      @apply text-tiny font-bold;
    }
    .username {
      @apply text-xs;
    }
  }
}

.info {
  @apply mb-4;
  
  .creator-publish {
    @apply flex flex-row justify-between mb-2 align-middle;
  }
  .tags {
    @apply flex flex-wrap mb-4;

    .tag {
      @apply py-1 px-3 mr-1 text-xs rounded-full transition-all ease-in delay-75 button;

      &:hover {
        @apply button-hover;
      }
    }

    .suggest {
      @apply py-1 px-3 mr-1 text-xs text-black bg-gray-200 rounded-full transition-all ease-in delay-75;

      .icon {
        @apply text-black align-middle;
      }

      &:hover {
        @apply text-black bg-gray-300 transition-all delay-75;
      }
    }

    span {
      @apply mr-1 mb-1 transition-all duration-100 cursor-pointer text-colored;

      &:hover {
        // @apply button-hover;
        @apply text-blue-700
      }
    }
  }
}
.comments {
  @apply mt-4;

  .comment-box {
    @apply mb-6;

    textarea {
      @apply mt-0 mb-0 w-full form-input input;
    }

    button {
      @apply w-full font-bold primary-button;
    }
  }

  .comment-content {
    .comment-order {
      @apply flex justify-end mb-4 w-full;

      button {
        @apply py-2 px-3 underline rounded-sm cursor-pointer;
      }
    }

    .comment-item {
      @apply mb-4;

      .comment-time {
        @apply italic;
        color: var(--link);
      }

      .reactions {
        @apply flex justify-end;

        .reaction {
          @apply ml-3 whitespace-nowrap;

          .icon {
            @apply mr-1 align-middle transition-all cursor-pointer;
          }
        }
      }
    }
  }
}

.option {
  @apply inline relative z-20 justify-end;

  .thumbnail {
    @apply transition-all cursor-pointer icon-color focus:outline-none;

    img {
      @apply object-cover w-9 h-9 rounded-md shadow-lg;
    }
  }

  .option-dropdown {
    @apply flex invisible z-20 flex-col opacity-0 transition-all duration-300 transform origin-top-right scale-95;

    .toggler {
      @apply absolute right-0 z-20 mt-2 rounded-md shadow-lg origin-top-right outline-none theme-color;

      .menu-wrapper {
        @apply p-1 rounded-md theme-color;

        .menu {
          @apply flex z-50 flex-row py-3 px-4 mx-auto w-full capitalize rounded-md cursor-pointer;

          .icon {
            @apply mr-2;
          }

          &:hover {
            @apply text-white;
            background: var(--button);
            border-color: var(--button);
          }
        }
      }
    }
  }
}
</style>

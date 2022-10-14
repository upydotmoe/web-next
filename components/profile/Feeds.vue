<template>
  <div class="mx-auto w-full md:w-2/3">
    <div v-for="(feed, feedIdx) in feeds" :key="feed.id">
      <div class="flex flex-row mb-2 rounded-lg border-none shadow-none theme-color-secondary">
        <!-- Images -->
        <div class="w-full">
          <div v-if="feed.users" class="p-4 user-info">
            <nuxt-link :to="'/profile/'+feed.users.username">
              <img class="avatar" :src="avatarCoverUrl(feed.users.avatar_bucket, feed.users.avatar_filename)" @error="imageLoadError">
            </nuxt-link>
            <div class="name">
              <nuxt-link 
                :to="'/profile/'+feed.users.username" 
                class="fullname"
              >
                {{ feed.users.name }}
              </nuxt-link>
              <br>
              <nuxt-link 
                :to="'/profile/'+feed.users.username" 
                class="username hover:underline"
              >
                @{{ feed.users.username }}
              </nuxt-link>
              
              <span class="mx-1">·</span>
              
              <span class="text-xxs">
                {{ formatDate(feed.scheduled_post ? feed.scheduled_post : feed.created_at, true) }}
              </span>
            </div>
          </div>

          <!-- text feed -->
          <div class="px-2 md:px-4">
            <p
              :id="'feed-text-'+feed.id"
              v-html="feed.text.split('<br>').length > 3 && feed.text.length > 300 ? `${feed.text.slice(0, 300)}...` : feed.text"
            />
            
            <a 
              v-if="feed.text.split('<br>').length > 3 && feed.text.length > 300" 
              :id="'feed-read-more-'+feed.id" 
              class="href" 
              @click.prevent="readMore(feed.text, feed.id, 'feed-read-more-', 'feed-text-')"
            >
              {{ $t('readMore') }}
            </a>

            <!-- shared artwork post detail -->
            <div v-if="feed.artworks" class="my-2 w-full rounded-md theme-color">
              <!-- creator information -->
              <div v-if="feed.artworks.users" class="p-2 md:p-4 user-info">
                <nuxt-link :to="'/profile/'+feed.artworks.users.username">
                  <img class="avatar" :src="avatarCoverUrl(feed.artworks.users.avatar_bucket, feed.artworks.users.avatar_filename)" @error="imageLoadError">
                </nuxt-link>
                <div class="name">
                  <nuxt-link 
                    :to="'/profile/'+feed.artworks.users.username" 
                    class="fullname hover:href"
                  >
                    {{ feed.artworks.users.name }}
                  </nuxt-link>
                  <br>
                  <nuxt-link 
                    :to="'/profile/'+feed.artworks.users.username" 
                    class="hover:underline text-xxs"
                  >
                    @{{ feed.artworks.users.username }}
                  </nuxt-link>
                  
                  <span class="mx-1">·</span>
                  
                  <nuxt-link :to="'/a/' + feed.artworks.id" class="hover:underline text-xxs">
                    {{ formatDate(feed.artworks.scheduled_post ? feed.artworks.scheduled_post : feed.artworks.created_at, true) }}
                  </nuxt-link>
                </div>
              </div>

              <!-- title & description of shared artwork -->
              <div class="px-2 mt-2 md:px-4">
                <span class="text-xs font-semibold">{{ feed.artworks.title }}</span>
                <p v-show="feed.artworks.description">
                  <span :id="'feed-description-'+feed.artworks.id">
                    {{ feed.artworks.description.length > 300 ? `${feed.artworks.description.slice(0, 300)}...` : feed.artworks.description }}
                  </span>
                  
                  <a 
                    v-if="feed.artworks.description.length > 300" 
                    :id="'feed-read-more-'+feed.artworks.id" 
                    class="href" 
                    @click.prevent="readMore(feed.artworks.description, feed.artworks.id, 'feed-read-more-', 'feed-description-')"
                  >
                    {{ $t('readMore') }}
                  </a>
                </p>
              </div>

              <!-- artwork images -->
              <div>
                <!-- desktop -->
                <div
                  v-if="!isMobile()"
                  :class="[
                    'p-2',
                    { 'cursor-pointer': !feed.artworks.apply_explicit_filter }
                  ]"
                  @click.prevent="viewArtwork(feed.artworks.id, feed.artworks.apply_explicit_filter, feedIdx)"
                >
                  <div
                    :class="[
                      'overflow-hidden relative p-2 rounded-md',
                      { 'md:mx-2': feed.artworks.apply_explicit_filter }
                    ]"
                  >
                    <ImageList
                      :class="[
                        { 'blur-3xl unclickable': feed.artworks.apply_explicit_filter },
                        feed.artworks.apply_explicit_filter ? 'brightness-50' : 'brightness-100'
                      ]"
                      :work="feed.artworks"
                    />

                    <!-- filter message -->
                    <div v-if="feed.artworks.apply_explicit_filter" class="p-2 mx-auto w-full text-center rounded-md opacity-90 theme-color">
                      <div>{{ auth.loggedIn ? $t('explicitContentAlert') : $t('explicitContentAlertForGuest') }}</div>
                      <button class="mx-auto mt-2 primary-button">{{ $t('explicitShowMeThisContent') }}</button>
                    </div>
                  </div>
                </div>

                <!-- mobile/smaller device -->
                <nuxt-link
                  v-if="isMobile()"
                  :to="feed.artworks.apply_explicit_filter ? null : '/a/'+feed.artworks.id"
                  @click.prevent="viewArtwork(feed.artworks.id, feed.artworks.apply_explicit_filter, feedIdx)"
                  class="cursor-pointer"
                >
                  <div
                    :class="[
                      'overflow-hidden relative p-2 rounded-md',
                      { 'm-2': feed.artworks.apply_explicit_filter }
                    ]"
                  >
                    <ImageList
                      :class="[
                        { 'blur-3xl unclickable': feed.artworks.apply_explicit_filter },
                        feed.artworks.apply_explicit_filter ? 'brightness-50' : 'brightness-100'
                      ]"
                      :work="feed.artworks"
                    />

                    <!-- filter message -->
                    <div v-if="feed.artworks.apply_explicit_filter" class="p-2 mx-auto w-full text-center rounded-md opacity-90 theme-color">
                      <div>{{ auth.loggedIn ? $t('explicitContentAlert') : $t('explicitContentAlertForGuest') }}</div>
                      <button class="mx-auto mt-2 primary-button">{{ $t('explicitShowMeThisContent') }}</button>
                    </div>
                  </div>
                </nuxt-link>
              </div>
            </div>
          </div>

          <!-- Intereaction area -->
          <div class="float-right mx-4 mt-2 interactions">
            <!-- Reactions -->
            <div v-if="auth.loggedIn" class="reactions">
              <!-- Like -->
              <span 
                class="leading-8" 
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
              </span>

              <!-- Comment -->
              <span 
                class="leading-8"
                @click.prevent="viewFeed(feed.id)"
              >
                <Icon 
                  :name="'i-mdi-comment-multiple-outline'" 
                  class="mr-1 icon-color hover:text-blue-500"
                />
                {{ thousand(feed._count.feed_comments) }}
              </span>

              <!-- ellipsis other interaction -->
              <div class="option dropdown">
                <button 
                  type="button" 
                  aria-haspopup="true" 
                  aria-expanded="true" 
                  aria-controls="option-dropdown-items"
                  @click="feedEllipsisClicked(feed.id, feedIdx)"
                >
                  <span>
                    <Icon
                      :name="'i-uit-ellipsis-v'" 
                      class="align-middle icon icon-color"
                    />
                  </span>
                </button>
                
                <div class="option-dropdown dropdown-menu">
                  <div 
                    id="option-dropdown-items" 
                    class="w-52 toggler"
                    aria-labelledby="option-dropdown-buttons" 
                    role="menu"
                  >
                    <div class="menu-wrapper">
                      <nuxt-link 
                        :to="'/feed/'+feed.id"
                        class="flex py-2 px-3 w-full rounded-md transition-all duration-150 hover:button-color parent-icon hover:text-white"
                      >
                        <Icon :name="'i-fluent-arrow-enter-20-filled'" class="mr-2 text-base" /> {{ $t('open') }}
                      </nuxt-link>
                      <nuxt-link 
                        :to="'/feed/'+feed.id"
                        target="_blank" 
                        class="flex z-20 py-2 px-3 w-full rounded-md transition-all duration-150 hover:button-color parent-icon hover:text-white"
                      >
                        <Icon :name="'i-ci-external-link'" class="mr-2 text-base" /> {{ $t('openInNewTab') }}
                      </nuxt-link>

                      <!-- <div class="custom-divider" /> -->
                      
                      <!-- report feed post -->
                      <!-- <nuxt-link 
                        :to="'#'" 
                        class="flex py-2 px-3 w-full rounded-md transition-all duration-150 hover:button-color parent-icon hover:text-white"
                        @click.prevent 
                      >
                        <Icon :name="'i-akar-icons-flag'" class="mr-2 text-base" /> {{ $t('report') }}
                      </nuxt-link> -->

                      <!-- copy sharable link -->
                      <!-- <a
                        class="flex py-2 px-3 w-full leading-4 rounded-md transition-all duration-150 cursor-pointer hover:button-color parent-icon hover:text-white"
                        @click="'/feed/'+feed.id" 
                      >
                        <Icon :name="'i-icon-park-outline-copy'" class="mr-2 text-base" /> {{ $t('copySharableLink') }}
                      </a> -->

                      <div v-if="auth.loggedIn && feed.user_id && auth.user.id === feed.user_id" class="custom-divider" />

                      <div 
                        v-if="auth.loggedIn && feed.user_id && auth.user.id === feed.user_id" 
                        :to="'/feed/'+feed.id" 
                        class="flex z-50 py-2 px-3 w-full rounded-md transition-all duration-150 cursor-pointer bg-danger hover:button-color parent-icon hover:text-white"
                        @click="openModal('profile-feed-deletion-confirm-modal')"
                      >
                        <Icon :name="'i-ion-trash-outline'" class="mr-2 text-base" /> {{ $t('delete') }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <InfiniteLoading
      :load="fetch"
    >
      <template #loading>
        <div class="mx-auto text-center">
          <Icon :name="'i-line-md-loading-twotone-loop'" class="text-3xl" />
        </div>
      </template>
      
      <template #no-results>
        <div class="mx-auto mt-10 text-center">
          <b>(ㆆ_ㆆ)</b> {{ $t('nothingToShow') }}
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

    <!-- Artwork Modal View -->
    <div 
      :id="'artwork-modal'"
      class="modal work-view" 
    >
      <ModalView 
        ref="artworkModalViewRef"
        :section="'artwork'"
      />
    </div>
    
    <!-- Feed deletion confirmation dialog -->
    <ConfirmationDialog
      id="profile-feed-deletion-confirm-modal"
      :modal-id="'profile-feed-deletion-confirm-modal'"
      :message="`${$t('alert.areYouSure')} ${$t('alert.youCannotUndoThisAction')}`"
      class="modal"
      @onAccept="removeFeed()"
    />
  </div>
</template>

<script setup>
import { VueEternalLoading as InfiniteLoading } from '@ts-pro/vue-eternal-loading'

// stores
import useAuthStore from '@/stores/auth.store'

// composables
import useImage from '~/composables/useImage'

// components
import FeedModalView from '~/components/feeds/FeedModalView.vue'
import ModalView from '~/components/artworks/views/ModalView.vue'
import Icon from '~/components/globals/Icon.vue'
import ImageList from '~/components/feeds/ImageList.vue'
import ConfirmationDialog from '~/components/globals/ConfirmationDialog.vue'

// stores
const auth = useAuthStore()

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const feedApi = useFeed(oApiConfiguration, fetchOptions())
const { generateArtworkThumb } = useImage()

const props = defineProps ({
  userId: {
    type: Number,
    default: 0
  }
})

const router = useRouter()

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
    console.log('removing explicit filter..')
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
    // setTimeout(() => {
    //   router.push({
    //     path: '/'
    //   })
    // }, 1000)
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

.interactions {
  @apply flex flex-row justify-between mb-6;

  .reaction-counters {
    .counter {
      @apply mr-3 whitespace-nowrap;

      .icon {
        @apply mr-1 text-lg text-gray-400 align-middle transition-all hover:text-gray-400;
      }

      span {
        @apply align-middle;
      }
    }
  }

  .reactions {
    span {
      @apply ml-3 whitespace-nowrap;

      .icon {
        @apply ml-1 text-xl align-middle transition-all cursor-pointer;
      }
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

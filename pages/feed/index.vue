<template>
  <keep-alive>
    <Layout 
      :with-footer="true"
      :hide-side="isMobile()"
    >
      <SplashAlert 
        v-show="copied"
        id="copy-alert"
        :text="$t('linkCopied')"
        :icon="'i-bi-check-all'"
      />

      <div class="mx-auto w-full">
        <div class="grid grid-cols-1 gap-1 mx-auto md:gap-2 xl:w-11/12">
          <div v-for="feed in feeds" :key="feed.id+feed.type" class="rounded-md lg:mx-6">
            <div class="flex flex-row rounded-md theme-color">
              <!-- Images -->
              <div class="w-full">
                <div v-if="feed.users" class="p-2 md:p-4 user-info">
                  <nuxt-link :to="'/profile/'+feed.users.username">
                    <img class="avatar" :src="avatarCoverUrl(feed.users.avatar_bucket, feed.users.avatar_filename)" @error="imageLoadError">
                  </nuxt-link>
                  <div class="name">
                    <nuxt-link 
                      :to="'/profile/'+feed.users.username" 
                      class="fullname hover:href"
                    >
                      {{ feed.users.name }}
                    </nuxt-link>
                    <br>
                    <nuxt-link 
                      :to="'/profile/'+feed.users.username" 
                      class="hover:underline text-xxs"
                    >
                      @{{ feed.users.username }}
                    </nuxt-link>
                    
                    <span class="mx-1">·</span>
                    
                    <nuxt-link :to="(feed.type === 'artwork' ? '/a/' : '/feed/') + feed.id" class="hover:underline text-xxs">
                      {{ formatDate(feed.scheduled_post ? feed.scheduled_post : feed.created_at, true) }}
                    </nuxt-link>
                  </div>
                </div>

                <!-- information for feed type artwork -->
                <div v-if="feed.type === 'artwork'" class="px-2 mt-2 md:px-4">
                  <span class="text-xs font-semibold">{{ feed.title }}</span>
                  <p v-show="feed.description">
                    <span :id="'feed-description-'+feed.id">
                      {{ feed.description.length > 300 ? `${feed.description.slice(0, 300)}...` : feed.description }}
                    </span>
                    <a 
                      v-if="feed.description.length > 300" 
                      :id="'feed-read-more-'+feed.id" 
                      class="href" 
                      @click.prevent="readMore(feed.description, feed.id, 'feed-read-more-', 'feed-description-')"
                    >
                      {{ $t('readMore') }}
                    </a>
                  </p>
                </div>

                <!-- Image view on Desktop -->
                <div v-if="feed.type === 'artwork' && !isMobile()" class="cursor-pointer" @click.prevent="view(feed.id)">
                  <ImageList class="p-2 md:p-4" :work="feed" />
                </div>
                
                <!-- Image view on mobile or smaller device -->
                <nuxt-link v-if="feed.type === 'artwork' && isMobile()" :to="'/a/'+feed.id" class="cursor-pointer">
                  <ImageList class="p-2" :work="feed" />
                </nuxt-link>

                <!-- feed type text post -->
                <div v-if="feed.type === 'feed'" class="px-2 md:px-4">
                  <p v-show="feed.text" class="mt-2">
                    {{ feed.text }}
                  </p>

                  <!-- shared artwork post detail -->
                  <div v-if="feed.artwork_share_info" class="my-2 w-full rounded-md theme-color-secondary">
                    <!-- creator information -->
                    <div v-if="feed.artwork_share_info.user" class="p-2 md:p-4 user-info">
                      <nuxt-link :to="'/profile/'+feed.artwork_share_info.user.username">
                        <img class="avatar" :src="avatarCoverUrl(feed.artwork_share_info.user.avatar_bucket, feed.artwork_share_info.user.avatar_filename)" @error="imageLoadError">
                      </nuxt-link>
                      <div class="name">
                        <nuxt-link 
                          :to="'/profile/'+feed.artwork_share_info.user.username" 
                          class="fullname hover:href"
                        >
                          {{ feed.artwork_share_info.user.name }}
                        </nuxt-link>
                        <br>
                        <nuxt-link 
                          :to="'/profile/'+feed.artwork_share_info.user.username" 
                          class="hover:underline text-xxs"
                        >
                          @{{ feed.artwork_share_info.user.username }}
                        </nuxt-link>
                        
                        <span class="mx-1">·</span>
                        
                        <nuxt-link :to="'/a/' + feed.artwork_share_info.id" class="hover:underline text-xxs">
                          {{ formatDate(feed.artwork_share_info.scheduled_post ? feed.artwork_share_info.scheduled_post : feed.artwork_share_info.created_at, true) }}
                        </nuxt-link>
                      </div>
                    </div>

                    <!-- title & description of shared artwork -->
                    <div class="px-2 mt-2 md:px-4">
                      <span class="text-xs font-semibold">{{ feed.artwork_share_info.title }}</span>
                      <p v-show="feed.artwork_share_info.description">
                        <span :id="'feed-description-'+feed.artwork_share_info.id">
                          {{ feed.artwork_share_info.description.length > 300 ? `${feed.artwork_share_info.description.slice(0, 300)}...` : feed.artwork_share_info.description }}
                        </span>
                        <a 
                          v-if="feed.artwork_share_info.description.length > 300" 
                          :id="'feed-read-more-'+feed.artwork_share_info.id" 
                          class="href" 
                          @click.prevent="readMore(feed.artwork_share_info.description, feed.artwork_share_info.id, 'feed-read-more-', 'feed-description-')"
                        >
                          {{ $t('readMore') }}
                        </a>
                      </p>
                    </div>

                    <!-- the artwork(s) -->
                    <div>
                      <!-- Image view on mobile or smaller device -->
                      <nuxt-link v-if="isMobile()" :to="'/a/'+feed.artwork_share_info.id" class="cursor-pointer">
                        <ImageList class="p-2" :work="feed" />
                      </nuxt-link>

                      <!-- Image view on Desktop -->
                      <div v-if="!isMobile()" class="cursor-pointer" @click.prevent="view(feed.artwork_share_info.id)">
                        <ImageList class="p-2 md:p-4" :work="feed" />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Intereaction area -->
                <div class="float-right mx-4 mt-2 interactions">
                  <!-- Reactions -->
                  <div v-if="auth.loggedIn" class="reactions">
                    <!-- Like -->
                    <span
                      @click="
                        feed.type === 'artwork' ?
                          likedIds.includes('a-'+feed.id) ? unlike('a-'+feed.id, feed.type) : like('a-'+feed.id, feed.type) : 
                          likedIds.includes('f-'+feed.id) ? unlike('f-'+feed.id, feed.type) : like('f-'+feed.id, feed.type)
                      "
                    >
                      <Icon 
                        v-show="feed.type === 'artwork' ? likedIds.includes('a-'+feed.id) : likedIds.includes('f-'+feed.id)"
                        :id="'feed-like-button-'+feed.type+'-'+feed.id"
                        :name="'i-ion-heart'" 
                        class="mr-1 text-red-500 hover:text-red-500"
                      />
                      <Icon
                        v-show="feed.type === 'artwork' ? !likedIds.includes('a-'+feed.id) : !likedIds.includes('f-'+feed.id)"
                        :name="'i-ion-heart-outline'" 
                        class="mr-1 icon-color hover:text-red-500"
                      />
                      {{ thousand(feed._count.likes) }}
                    </span>

                    <!-- Comment -->
                    <span @click.prevent="feed.type === 'artwork' ? view(feed.id) : viewFeed(feed.id)">
                      <Icon 
                        :name="'i-mdi-comment-multiple-outline'" 
                        class="mr-1 icon-color hover:text-blue-500"
                      />
                      {{ thousand(feed._count.comments) }}
                    </span>

                    <!-- Save -->
                    <span v-if="feed.type === 'artwork'" @click="showCollectionSelectionModal(feed.id)">
                      <Icon 
                        v-show="savedIds.includes(feed.id)"
                        :id="'save-to-collection-button-'+feed.id"
                        :name="'i-ion-bookmark'" 
                        class="text-blue-500 hover:text-blue-500"
                      />
                      <Icon 
                        v-show="!savedIds.includes(feed.id)"
                        :name="'i-majesticons-bookmark-line'" 
                        class="icon-color hover:text-blue-500"
                      />
                    </span>

                    <!-- ellipsis other interaction -->
                    <div class="option dropdown">
                      <button 
                        type="button" 
                        aria-haspopup="true" 
                        aria-expanded="true" 
                        aria-controls="option-dropdown-items"
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
                              :to="feed.type === 'artwork' ? '/a/'+feed.id : '/feed/'+feed.id"
                              class="flex py-2 px-3 w-full rounded-md transition-all duration-150 hover:button-color parent-icon hover:text-white"
                            >
                              <Icon :name="'i-fluent-arrow-enter-20-filled'" class="mr-2 text-base" /> {{ $t('open') }}
                            </nuxt-link>
                            <nuxt-link 
                              :to="feed.type === 'artwork' ? '/a/'+feed.id : '/feed/'+feed.id"
                              target="_blank" 
                              class="flex z-20 py-2 px-3 w-full rounded-md transition-all duration-150 hover:button-color parent-icon hover:text-white"
                            >
                              <Icon :name="'i-ci-external-link'" class="mr-2 text-base" /> {{ $t('openInNewTab') }}
                            </nuxt-link>

                            <div class="custom-divider" />
                            
                            <!-- report -->
                            <!-- <nuxt-link 
                              :to="'#'" 
                              class="flex py-2 px-3 w-full rounded-md transition-all duration-150 hover:button-color parent-icon hover:text-white"
                              @click.prevent 
                            >
                              <Icon :name="'i-akar-icons-flag'" class="mr-2 text-base" /> {{ $t('report') }}
                            </nuxt-link> -->

                            <!-- copy sharable link -->
                            <a
                              class="flex py-2 px-3 w-full leading-4 rounded-md transition-all duration-150 cursor-pointer hover:button-color parent-icon hover:text-white"
                              @click="copyLink(feed.type === 'artwork' ? '/a/'+feed.id : '/feed/'+feed.id)" 
                            >
                              <Icon :name="'i-icon-park-outline-copy'" class="mr-2 text-base" /> {{ $t('copySharableLink') }}
                            </a>
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
            class="mt-6"
            :load="fetch"
          >
            <template #loading>
              <div class="mx-auto text-center">
                <Icon :name="'i-line-md-loading-twotone-loop'" class="text-3xl" />
              </div>
            </template>

            <template #no-results>
              <div class="mx-auto text-center">
                {{ $t('feeds.nothingToShow') }}
              </div>
            </template>

            <template #no-more>
              <div class="mx-auto text-center">
                {{ $t('youHaveReachedTheEnd') }}
                <br>
                {{ $t('feeds.followMorePeople') }}
              </div>
            </template>
          </InfiniteLoading>

          <!-- Artwork Modal View -->
          <div 
            :id="'chronological-modal'"
            class="modal work-view" 
          >
            <ModalView 
              ref="chronologicalModalViewRef"
              :section="'chronological'"
            />
          </div>

          <!-- Feed Modal View -->
          <div 
            :id="'chronological-feed-modal'"
            class="modal work-view z-30"
          >
            <FeedModalView
              ref="chronologicalFeedModalViewRef"
              :section="'chronological-feed'"
            />
          </div>

          <!-- add or remove from selected collection(s) -->
          <ManageSave 
            id="feed-collection-selection-modal"
            :modal-id="'feed-collection-selection-modal'"
            ref="collectionSelectionModalRef"
            :work-id="collectionWorkId"
            class="modal"
            @save="save"
          />
        </div>
      </div>

      <template #right-side>
        <FeedSide />
      </template>
    </Layout>
  </keep-alive>
</template>

<script setup>
import { useClipboard } from '@vueuse/core'
import { VueEternalLoading as InfiniteLoading } from '@ts-pro/vue-eternal-loading'

// stores
import useAuthStore from '@/stores/auth.store'

// composables
import useImage from '~/composables/useImage'

// components
import Icon from '~/components/globals/Icon.vue'
import Layout from '~/components/layouts/Layout.vue'
import ModalView from '~/components/artworks/views/ModalView.vue'
import FeedModalView from '~/components/feeds/FeedModalView.vue'
import ImageList from '~/components/feeds/ImageList.vue'
import FeedSide from '~/components/layouts/right-sides/FeedSide.vue'
import ManageSave from '~/components/artworks/ManageSave.vue'
import SplashAlert from '~/components/globals/SplashAlert.vue'

/**
 * @meta
 */
definePageMeta ({
  keepalive: true
})

useHead ({
  title: useI18n().tl('meta.title.feed')
})

/**
 * @props
 */
defineProps ({
  changeMode: {
    type: Function,
    default: () => {}
  }
})

/**
 * @stores
 */
const auth = useAuthStore()

/**
 * @composables
 */
const { generateArtworkThumb } = useImage()
const { oApiConfiguration, fetchOptions } = useApiFetch()
const artworkApi = useArtwork(oApiConfiguration, fetchOptions())
const feedApi = useFeed(oApiConfiguration, fetchOptions())
/**
 * @composables
 */

/**
 * @nuxt
 */
const runtimeConfig = useRuntimeConfig()
const { $router } = useNuxtApp()

// onMounted (() => {
//   window.addEventListener('keydown', (e) => {
//     if (e.key === 'Escape') {
//       closeArtworkModals()
//     }
//   })
// })

/**
 * @watchers
 */
watch (() => $router.currentRoute.value.params.path, () => {
  // close modal on changing route or going back to previous page
  closeArtworkModals()

  // close collection selection modal
  useModal().closeModal('feed-collection-selection-modal')
})

/**
 * @methods
 */
const options = ref({
  explicitMode: undefined,
  pagination: {
    page: 0,
    perPage: 10
  }
})

/** Fetch / inifinite load */
const feeds = ref([])
const fetch = async ({ loaded }) => {
  const [data, error] = await feedApi.getChronologicalFeeds({
    explicitMode: options.value.explicitMode,
    pagination: {
      page: options.value.pagination.page,
      perPage: options.value.pagination.perPage
    }
  })

  if (error) {
    // todo: handle error
  }

  options.value.pagination.page += 1

  for (let feedIdx = 0; feedIdx < data.feeds.length; feedIdx++) {
    const feed = data.feeds[feedIdx]

    // collect liked feed IDs
    if (feed.liked) {
      if (feed.type === 'artwork') {
        likedIds.value.push('a-' + feed.id)
      } else {
        likedIds.value.push('f-' + feed.id)
      }
    }

    feed.images = []
    if (feed.type === 'artwork' || (feed.type === 'feed' && feed.artwork_share_info != null)) {
      // collect to saved IDs
      if (feed.type === 'artwork') {
        if (feed.saved) {
          savedIds.value.push(feed.id)
        }
      }

      // collect images and transform to readable url to render in image list
      for (let assetIdx = 0; assetIdx < feed.artwork_assets.length; assetIdx++) {
        if (assetIdx <= 3) {
          const imageUrl = await generateArtworkThumb(feed.artwork_assets[assetIdx].bucket, feed.artwork_assets[assetIdx].filename, 'feed')
          feed.images.push(imageUrl)
        }
      }
    }

    // finally, push it to feeds array
    feeds.value.push(feed)
  }

  loaded(data.feeds.length, options.value.pagination.perPage)
}

/** Modal view */
const chronologicalModalViewRef = ref(null)
const view = (workId) => {
  chronologicalModalViewRef.value.view(workId)

  useModal().openModal('chronological-modal')
}

const chronologicalFeedModalViewRef = ref(null)
const viewFeed = (feedId) => {
  chronologicalFeedModalViewRef.value.view(feedId)

  useModal().openModal('chronological-feed-modal')
}

const readMore = (description, workId, selectorElId, descriptionElid) => {
  useReadMore().readMore(description, workId, selectorElId, descriptionElid)
}

const copied = ref(false)
let splashInterval
const copyLink = (link) => {
  const source = ref(runtimeConfig.public.appUrl + link)
  const { copy } = useClipboard({ source })
  copy()

  // show splash notification
  useSplash().splash(splashInterval, copied, 'copy-alert')
}

// save function
const savedIds = ref([])

// like function
const likedIds = ref([])
const like = async (id, type) => {
  const likedFeedId = parseInt(id.split('-')[1])
  let success = false

  if (type === 'artworks') {
    const [likeSuccess, error] = await artworkApi.like({
      workId: likedFeedId
    })

    success = likeSuccess
  } else if (type === 'feeds') {
    const [likeSuccess, error] = await feedApi.like({
      feedId: likedFeedId
    })

    success = likeSuccess
  }
  
  if (success) {
    likedIds.value.push(id)
    
    // animate
    const likeButton = document.getElementById(`feed-like-button-${type}-${likedFeedId}`)
    likeButton.classList.add('animate-bounce')
    setInterval(() => {
      likeButton.classList.remove('animate-bounce')
    }, 2500)
  } else {
    // todo: handle error
  }
}

const unlike = async (id, type) => {
  const unlikedFeedId = parseInt(id.split('-')[1])
  let success = false

  if (type === 'artworks') {
    const [unlikeSuccess, error] = await artworkApi.unlike({
      workId: unlikedFeedId
    })

    success = unlikeSuccess
  } else if (type === 'feeds') {
    const [unlikeSuccess, error] = await feedApi.unlike({
      feedId: unlikedFeedId
    })

    success = unlikeSuccess
  }
  
  if (success) {
    const indexOfIdToRemove = likedIds.value.indexOf(id)
    likedIds.value.splice(indexOfIdToRemove, 1)
  } else {
    // todo: handle error
  }
}

const closeArtworkModals = () => {
  useModal().closeModal('chronological-modal')
  useModal().closeModal('chronological-feed-modal')
}

/** 
 * ====================================================================================================================
 * COLLECTIONS
 * ====================================================================================================================
*/
/**
 * Show collection selection modal
 * When triggering this action it will automatically fetch where the item were saved, and
 * automatically select the selected collections.
 */
const collectionSelectionModalRef = ref(null)
const collectionWorkId = ref(0)
const showCollectionSelectionModal = (workId) => {
  collectionWorkId.value = workId

  useModal().openModal('feed-collection-selection-modal')
  collectionSelectionModalRef.value.fetchCurrentSaved()
}

/**
 * This method will be triggered via event handling called `@save` on component `ManageSave` 
 * once the user selects a collection and clicks the save button, and it will automatically close 
 * the modal and update the collection selection.
 */
const save = (unsaved) => {
  if (unsaved) {
    const indexOfIdToRemove = savedIds.value.indexOf(collectionWorkId.value)
    savedIds.value.splice(indexOfIdToRemove, 1)
  } else {
    savedIds.value.push(collectionWorkId.value)
  }

  // animate
  useBounceAnimation().animate('save-to-collection-button-' + collectionWorkId.value)
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
    @apply flex flex-row;

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
  @apply inline relative z-10 justify-end;

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

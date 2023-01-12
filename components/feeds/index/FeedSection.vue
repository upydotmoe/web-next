<template>
  <section
    id="feeds"
    class="feeds"
  >
    <!-- switch between following only and global for text feed -->
    <nav
      v-if="fetchMode == 'text'"
      class="feeds__global-following-switch"
    >
      <button
        :class="showPublicTextPost == false ? 'primary-button' : 'light-button'"
        @click="showPublicTextPost = false"
      >
        <Icon :name="'i-fluent-people-checkmark-24-regular'" />
        {{ $t('followings.followingOnly') }}
      </button>
      <button
        :class="showPublicTextPost == true ? 'primary-button' : 'light-button'"
        @click="showPublicTextPost = true"
      >
        <Icon :name="'i-heroicons-globe-asia-australia'" />
        {{ $t('followings.global') }}
      </button>
    </nav>

    <!-- feed list -->
    <section
      v-for="(feed, feedIdx) in feeds"
      id="feed-list"
      :key="feed.id+feed.type"
      class="feeds__list"
    >
      <!-- artist info -->
      <ArtistDetail
        :feed="feed"
      />

      <!-- detail of feed type artwork -->
      <ArtworkDetail
        v-if="feed.type === POST_TYPES.ARTWORK"
        :feed="feed"
        :feed-idx="feedIdx"
        @read-more="readMore"
        @view="view"
      />

      <!-- detail of feed type text post -->
      <TextPostDetail
        v-if="feed.type === POST_TYPES.FEED"
        :feed="feed"
        :feed-idx="feedIdx"
        :read-more="readMore"
        :view="view"
        @read-more="readMore"
        @view="view"
      />

      <!-- intereaction buttons -->
      <section
        id="interaction-button-section"
        class="interactions !px-4"
      >
        <div />

        <div class="interactions__items">
          <!-- like button -->
          <div
            class="interactions__item"
            @click="
              feed.type === POST_TYPES.ARTWORK ?
                likedIds.includes('a-'+feed.id) ? unlike('a-'+feed.id, feed.type) : like('a-'+feed.id, feed.type) :
                likedIds.includes('f-'+feed.id) ? unlike('f-'+feed.id, feed.type) : like('f-'+feed.id, feed.type)
            "
          >
            <Icon
              v-show="feed.type === POST_TYPES.ARTWORK ? likedIds.includes('a-'+feed.id) : likedIds.includes('f-'+feed.id)"
              :id="'feed-like-button-'+feed.type+'-'+feed.id"
              :name="'i-ion-heart'"
              class="text-red-500 hover:text-red-500"
            />
            <Icon
              v-show="feed.type === POST_TYPES.ARTWORK ? !likedIds.includes('a-'+feed.id) : !likedIds.includes('f-'+feed.id)"
              :name="'i-ri-heart-3-line'"
              class="icon-color hover:text-red-500"
            />
            {{ thousand(feed._count.likes) }}
          </div>

          <!-- comment button (open modal detail modal to show the comment section) -->
          <div
            class="interactions__item"
            @click.prevent="feed.type === POST_TYPES.ARTWORK ? view(feed.id) : viewFeed(feed.id)"
          >
            <Icon
              :name="'i-mdi-comment-multiple-outline'"
              class="icon-color hover:text-blue-500"
            />
            {{ thousand(feed._count.comments) }}
          </div>

          <!-- save to collection button (only show for feed type artwork) -->
          <div
            v-if="feed.type === POST_TYPES.ARTWORK"
            class="interactions__item"
            @click="showCollectionSelectionModal(feed.id)"
          >
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
          </div>

          <!-- option buttons -->
          <div class="ellipsis-menus dropdown">
            <button 
              type="button" 
              aria-haspopup="true" 
              aria-expanded="true" 
              aria-controls="ellipsis-menus"
            >
              <Icon :name="'i-uit-ellipsis-v'" />
            </button>

            <div class="ellipsis-menus__content dropdown-menu">
              <div 
                id="ellipsis-menus"
                class="ellipsis-menus__content__wrapper"
                aria-labelledby="headlessui-menu-button-1" 
                role="menu"
              >
                <nuxt-link :to="feed.type === POST_TYPES.ARTWORK ? '/a/'+feed.id : '/feed/'+feed.id">
                  <Icon :name="'i-fluent-arrow-enter-20-filled'" />
                  {{ $t('open') }}
                </nuxt-link>

                <nuxt-link
                  :to="feed.type === POST_TYPES.ARTWORK ? '/a/'+feed.id : '/feed/'+feed.id"
                  target="_blank"
                >
                  <Icon :name="'i-ci-external-link'" />
                  {{ $t('openInNewTab') }}
                </nuxt-link>

                <div class="custom-divider" />

                <div>
                  <a @click="copyLink(feed.type === POST_TYPES.ARTWORK ? '/a/'+feed.id : '/feed/'+feed.id)">
                    <Icon :name="'i-icon-park-outline-copy'" />
                    {{ $t('copySharableLink') }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>

    <!-- supporting components -->
    <InfiniteLoading
      v-model:is-initial="isInitial"
      :load="fetch"
    >
      <template #loading>
        <div class="loading-empty-error-message">
          <Icon
            :name="'i-line-md-loading-twotone-loop'"
            :text-size="'text-3xl'"
          />
          <div class="justify-center mt-2 text-tiny hidden-md-flex">
            Currently making magic..
          </div>
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

    <!-- artwork modal view component -->
    <div
      :id="'chronological-modal'"
      class="modal work-view"
    >
      <ModalView
        ref="chronologicalModalViewRef"
        :section="'chronological'"
      />
    </div>

    <!-- feed modal view compoennt -->
    <div
      :id="'chronological-feed-modal'"
      class="z-30 modal work-view"
    >
      <FeedModalView
        ref="chronologicalFeedModalViewRef"
        :section="'chronological-feed'"
        :is-modal="true"
      />
    </div>

    <!-- add or remove from selected collection(s) -->
    <ManageSave
      id="feed-collection-selection-modal"
      ref="collectionSelectionModalRef"
      :modal-id="'feed-collection-selection-modal'"
      :work-id="collectionWorkId"
      class="modal"
      @save="save"
    />

    <SplashAlert
      v-show="copied"
      id="copy-alert"
      :text="$t('linkCopied')"
      :icon="'i-bi-check-all'"
    />
  </section>
</template>

<script setup>
import { useClipboard } from '@vueuse/core'
import { VueEternalLoading as InfiniteLoading } from '@ts-pro/vue-eternal-loading'

import { POST_TYPES } from '~/utils/constants'

// stores
import useAuthStore from '@/stores/auth.store'

// components
import Icon from '~/components/globals/Icon.vue'
import ModalView from '~/components/artworks/views/ModalView.vue'
import FeedModalView from '~/components/feeds/FeedModalView.vue'
import ManageSave from '~/components/artworks/ManageSave.vue'
import SplashAlert from '~/components/globals/SplashAlert.vue'
import ArtistDetail from './ArtistDetail.vue'
import ArtworkDetail from './ArtworkDetail.vue'
import TextPostDetail from './TextPostDetail.vue'

// stores
const auth = useAuthStore()

// composables
const { generateArtworkThumb } = useUpyImage()
const { oApiConfiguration, fetchOptions } = useApiFetch()
const artworkApi = useArtwork(oApiConfiguration, fetchOptions())
const feedApi = useFeed(oApiConfiguration, fetchOptions())

useHead({
  title: useI18n().tl('meta.title.feed.feed')
})

const emit = defineEmits(['updateFeedLength', 'updateShowSuggestedUsers'])
const props = defineProps({
  fetchMode: {
    type: String,
    default: 'feed'
  },
  changeMode: {
    type: Function,
    default: () => {}
  }
})

const runtimeConfig = useRuntimeConfig()
const router = useRouter()
const route = useRoute()

onBeforeMount(() => {
  if (!auth.loggedIn) {
    router.push({
      path: '/explore'
    })
  }
})

onMounted(() => {
  // window.addEventListener('keydown', (e) => {
  //   if (e.key === 'Escape') {
  //     closeArtworkModals()
  //   }
  // })
})

/**
 * @watchers
 */
watch(() => route.query, () => {
  setTimeout(() => {
    // close modal on changing route or going back to previous page
    closeArtworkModals()

    // close collection selection modal
    useModal().closeModal('feed-collection-selection-modal')

    // close collection selection modal
    useModal().closeModal('collection-selection-modal')

    // close album selection modal
    useModal().closeModal('album-selection-modal')

    // close report modal
    useModal().closeModal('report-modal')
  }, 10)
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

const showPublicTextPost = ref(false)

// switch text post between following only and global
watch(() => showPublicTextPost.value, () => {
  refetch()
})

/** Fetch / inifinite load */
const isInitial = ref(false)
const feeds = ref([])
const fetch = async ({ loaded }) => {
  const [data, error] = await feedApi.getChronologicalFeeds({
    fetchMode: props.fetchMode,
    explicitMode: options.value.explicitMode,
    showAllTextPost: showPublicTextPost.value,
    pagination: {
      page: options.value.pagination.page,
      perPage: options.value.pagination.perPage
    }
  })

  if (error) {
    // todo: handle error
  }

  // if no feeds returned, get suggested users to follow
  if (!data.feeds.length) {
    emit('updateShowSuggestedUsers', true)
  }

  options.value.pagination.page += 1

  if (data.feeds.length) {
    for (let feedIdx = 0; feedIdx < data.feeds.length; feedIdx++) {
      const feed = data.feeds[feedIdx]

      // collect liked feed IDs
      if (feed.liked) {
        if (feed.type === POST_TYPES.ARTWORK) {
          likedIds.value.push('a-' + feed.id)
        } else {
          likedIds.value.push('f-' + feed.id)
        }
      }

      feed.images = []
      feed.apply_explicit_filter = false
      feed.apply_gore_filter = false
      if (feed.type === POST_TYPES.ARTWORK || (feed.type === 'feed' && feed.artwork_share_info != null)) {
        // collect to saved IDs
        if (feed.type === POST_TYPES.ARTWORK) {
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

        // apply explicit alert if user did not activate explicit content
        if (feed.artwork_share_info != null && ((!auth.loggedIn && feed.artwork_share_info.is_explicit) || (feed.artwork_share_info.is_explicit && !auth.user.user_settings.show_explicit))) {
          feed.apply_explicit_filter = true
        }

        // apply gore alert if user did not activate gore content
        if (feed.artwork_share_info != null && ((!auth.loggedIn && feed.artwork_share_info.is_gore) || (feed.artwork_share_info.is_gore && !auth.user.user_settings.show_gore))) {
          feed.apply_gore_filter = true
        }
      }

      // finally, push it to feeds array
      feeds.value.push(feed)
      emit('updateFeedLength', data.feeds.length)
    }
  }

  loaded(data.feeds.length, options.value.pagination.perPage)
}

const refetch = () => {
  // reset current state
  options.value.pagination.page = 0
  feeds.value = []

  isInitial.value = true
}

/** Modal view */
const chronologicalModalViewRef = ref(null)
const view = (workId, isExplicitFilterApplied, feedIdx) => {
  if (isExplicitFilterApplied) {
    feeds.value[feedIdx].apply_explicit_filter = false
    feeds.value[feedIdx].apply_gore_filter = false
  } else {
    chronologicalModalViewRef.value.view(workId)
    useModal().openModal('chronological-modal')
  }
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

  if (type === POST_TYPES.ARTWORK) {
    const [likeSuccess, error] = await artworkApi.like({
      workId: likedFeedId
    })

    success = likeSuccess
  } else if (type === 'feed') {
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

  if (type === POST_TYPES.ARTWORK) {
    const [unlikeSuccess, error] = await artworkApi.unlike({
      workId: unlikedFeedId
    })

    success = unlikeSuccess
  } else if (type === 'feed') {
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
  collectionSelectionModalRef.value.fetchCollection()
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

defineExpose({
  refetch,
})
</script>

<style lang="scss" scoped>
.feeds {
  @apply grid grid-cols-1 gap-1 mx-auto md:gap-4 lg:w-5/6 xl:w-full;

  &__global-following-switch {
    @apply flex flex-row gap-x-2 justify-center mb-2;
  }

  &__list {
    @apply flex relative flex-col rounded-md lg:mx-6 theme-color;
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
</style>
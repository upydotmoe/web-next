<template>
  <Layout 
    v-if="auth.loggedIn"
    :with-footer="true"
    :hide-side="isMobileDevice()"
    :no-right-side="isMobile()"
  >
    <template #left-side>
      <FeedLeftSide
        v-if="feeds.length"
        :current-view="fetchMode"
        @refetch="changeFetchMode"
      />
    </template>

    <div class="mx-auto w-full lg:w-5/6 xl:w-full">
      <!-- switch between following only and global for text feed -->
      <div
        v-if="fetchMode == 'text'"
        class="flex flex-row gap-x-2 justify-center mb-4"
      >
        <button
          @click="showPublicTextPost = false"
          :class="showPublicTextPost == false ? 'primary-button' : 'light-button'"
        >
          <Icon :name="'i-fluent-people-checkmark-24-regular'" />
          {{ $t('followings.followingOnly') }}
        </button>
        <button 
          @click="showPublicTextPost = true"
          :class="showPublicTextPost == true ? 'primary-button' : 'light-button'"
        >
          <Icon :name="'i-heroicons-globe-asia-australia'" />
          {{ $t('followings.global') }}
        </button>
      </div>

      <div
        v-if="showSuggestedUsers"
        class="h-screen"
      >
        <!-- Welcome -->
        <div>
          <h1 class="section-title">{{ $t('feeds.newUser.welcome') }}</h1>

          <div class="grid grid-cols-4 gap-4 mx-auto mt-6 text-center">
            <nuxt-link
              v-for="menu in newUserWelcomeMenus"
              :key="menu.href"
              :to="menu.href"
              class="flex flex-col gap-3 p-4 w-full text-center rounded-md theme-color hover:shadow-md hover:theme-colored"
            >
              <Icon
                :name="menu.icon"
                :text-size="'text-2xl'"
                class="mx-auto"
              />
              {{ $t(menu.title) }}
            </nuxt-link>
          </div>
        </div>

        <!-- Follow Suggestions -->
        <div
          v-if="suggestedUsersToFollow && suggestedUsersToFollow.length"
          class="mt-14"
        >
          <div class="section-title">{{ $t('feeds.newUser.suggestedUsers') }}</div>

          <UserList
            :users="suggestedUsersToFollow"
            :column-type="2"
            class="mt-6"
          />
        </div>
      </div>
      
      <div
        v-show="!showSuggestedUsers"
        class="grid grid-cols-1 gap-1 mx-auto md:gap-4"
      >
        <div
          v-for="(feed, feedIdx) in feeds"
          :key="feed.id+feed.type"
          class="relative rounded-md lg:mx-6"
        >
          <div class="flex flex-row rounded-md theme-color">
            <!-- Images -->
            <div class="w-full">
              <div v-if="feed.users" class="p-2 md:p-4 user-info">
                <nuxt-link :to="'/u/' + feed.users.username">
                  <img class="avatar" :src="avatarCoverUrl(feed.users.avatar_bucket, feed.users.avatar_filename)" @error="defaultCoverImage">
                </nuxt-link>
                <div class="name">
                  <nuxt-link 
                    :to="'/u/' + feed.users.username" 
                    class="fullname hover:href"
                  >
                    {{ feed.users.name }}
                  </nuxt-link>
                  <br>
                  <nuxt-link 
                    :to="'/u/' + feed.users.username" 
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
              <div v-if="feed.type === 'artwork'" class="px-2 md:px-4">
                <span class="feed-title">{{ feed.title }}</span>
                <p v-if="feed.description">
                  <span
                    :id="'feed-description-'+feed.id"
                    v-html="feed.description.length > 300 ? `${feed.description.slice(0, 300)}...` : feed.description"
                    class="feed-description"
                  />

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

              <!-- if artwork is a redraw of someone's artwork then show the original artwork information -->
              <div
                v-if="feed.redraw_of && feed.redrawed_artwork_info"
                class="px-2 mt-2 -mb-2 md:px-4"
              >
                <a
                  :href="'/a/'+feed.redraw_of"
                  target="_blank"
                  class="flex flex-col gap-2 p-2 w-full rounded-md theme-color-secondary hover:theme-colored"
                >
                  <i class="text-xs">{{ $t('artworks.redrawed') }}</i>

                  <!-- image -->
                  <div class="inline-block flex-row w-full rounded-md">
                    <!-- test --> <nuxt-img
                      preload
                      loading="lazy"
                      class="inline-block mr-2 w-10 rounded-md"
                      :src="artworkThumb(feed.redrawed_artwork_info.artwork_assets.bucket, feed.redrawed_artwork_info.artwork_assets.filename, 'thumbnail', false)"
                      @error="imageLoadError"
                    />
                    <span class="feed-title">{{ feed.redrawed_artwork_info.title }}</span>
                  </div>
                </a>
              </div>

              <!-- Image List -->
              <div>
                <div
                  v-if="feed.type === 'artwork'" 
                  class="cursor-pointer"
                  @click.prevent="view(feed.id)"
                >
                  <ImageList class="p-2 md:p-4" :work="feed" />
                </div>
              </div>

              <!-- feed type text post -->
              <div v-if="feed.type === 'feed'" class="px-2 md:px-4">
                <p
                  v-if="feed.text"
                  v-html="feed.text.split('<br>').length > 3 && feed.text.length > 300 ? `${feed.text.slice(0, 300)}...` : feed.text"
                  :id="'feed-text-'+feed.id"
                  :class="[
                    'text-tiny',
                    { 'mb-2 mt-2': !feed.artwork_share_info }
                  ]"
                />
                
                <a 
                  v-if="feed.text && feed.text.split('<br>').length > 3 && feed.text.length > 300" 
                  :id="'feed-read-more-'+feed.id" 
                  class="href" 
                  @click.prevent="readMore(feed.text, feed.id, 'feed-read-more-', 'feed-text-')"
                >
                  {{ $t('readMore') }}
                </a>

                <!-- shared artwork post detail -->
                <div v-if="feed.artwork_share_info" class="my-2 w-full rounded-md theme-color-secondary">
                  <!-- creator information -->
                  <div v-if="feed.artwork_share_info.user" class="p-2 md:p-4 user-info">
                    <nuxt-link :to="'/u/' + feed.artwork_share_info.user.username">
                      <img class="avatar" :src="avatarCoverUrl(feed.artwork_share_info.user.avatar_bucket, feed.artwork_share_info.user.avatar_filename)" @error="defaultCoverImage">
                    </nuxt-link>
                    <div class="name">
                      <nuxt-link 
                        :to="'/u/' + feed.artwork_share_info.user.username" 
                        class="fullname hover:href"
                      >
                        {{ feed.artwork_share_info.user.name }}
                      </nuxt-link>
                      <br>
                      <nuxt-link 
                        :to="'/u/' + feed.artwork_share_info.user.username" 
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
                  <div class="px-2 md:px-4">
                    <span class="feed-title">{{ feed.artwork_share_info.title }}</span>
                    <div
                      v-if="feed.artwork_share_info.description"
                      class="mt-2"
                    >
                      <p
                        :id="'feed-description-'+feed.artwork_share_info.id"
                        v-html="feed.artwork_share_info.description.length > 300 ? `${feed.artwork_share_info.description.slice(0, 300)}...` : feed.artwork_share_info.description"
                        class="feed-description"
                      />
                      
                      <a 
                        v-if="feed.artwork_share_info.description.length > 300" 
                        :id="'feed-read-more-'+feed.artwork_share_info.id" 
                        class="href" 
                        @click.prevent="readMore(feed.artwork_share_info.description, feed.artwork_share_info.id, 'feed-read-more-', 'feed-description-')"
                      >
                        {{ $t('readMore') }}
                      </a>
                    </div>
                  </div>

                  <!-- artwork images -->
                  <div>
                    <!-- desktop -->
                    <div
                      :class="[
                        'p-2',
                        { 'cursor-pointer': !feed.apply_explicit_filter || feed.apply_gore_filter }
                      ]"
                      @click.prevent="view(feed.artwork_share_info.id, feed.apply_explicit_filter ? feed.apply_gore_filter : feed.apply_explicit_filter, feedIdx)"
                    >
                      <div
                        :class="[
                          'overflow-hidden relative md:p-2 rounded-md',
                          { 'md:mx-2': feed.apply_explicit_filter || feed.apply_gore_filter }
                        ]"
                      >
                        <ImageList
                          :class="[
                            { 'blur-3xl unclickable': feed.apply_explicit_filter || feed.apply_gore_filter },
                            feed.apply_explicit_filter || feed.apply_gore_filter ? 'brightness-50' : 'brightness-100'
                          ]"
                          :work="feed"
                        />

                        <!-- filter message -->
                        <div
                          v-if="feed.apply_explicit_filter || feed.apply_gore_filter"
                          :class="[
                            'p-2 mx-auto w-full text-center rounded-md opacity-90',
                            feed.apply_gore_filter ? 'bg-red-200' : 'bg-yellow-200'
                          ]"
                        >
                          <div v-if="feed.apply_explicit_filter && !feed.apply_gore_filter">{{ auth.loggedIn ? $t('explicitContentAlert') : $t('explicitContentAlertForGuest') }}</div>
                          <div v-if="feed.apply_gore_filter">{{ auth.loggedIn ? $t('goreContentAlert') : $t('goreContentAlertForGuest') }}</div>

                          <button class="mx-auto mt-2 light-bordered-button">{{ $t('explicitShowMeThisContent') }}</button>
                        </div>
                      </div>
                    </div>

                    <!-- mobile/smaller device -->
                    <!-- <nuxt-link
                      v-if="isMobile()"
                      :to="feed.apply_explicit_filter || feed.apply_gore_filter ? null : '/a/'+feed.artwork_share_info.id"
                      @click.prevent="view(feed.artwork_share_info.id, feed.apply_explicit_filter ? feed.apply_gore_filter : feed.apply_explicit_filter, feedIdx)"
                      class="cursor-pointer"
                    >
                      <div
                        :class="[
                          'overflow-hidden relative p-2 rounded-md',
                          { 'm-2': feed.apply_explicit_filter || feed.apply_gore_filter }
                        ]"
                      >
                        <ImageList
                          :class="[
                            { 'blur-3xl unclickable': feed.apply_explicit_filter || feed.apply_gore_filter },
                            feed.apply_explicit_filter || feed.apply_gore_filter ? 'brightness-50' : 'brightness-100'
                          ]"
                          :work="feed"
                        />

                        <div v-if="feed.apply_explicit_filter || feed.apply_gore_filter" class="p-2 mx-auto w-full text-center rounded-md opacity-90 theme-color">
                          <div>{{ auth.loggedIn ? $t('explicitContentAlert') : $t('explicitContentAlertForGuest') }}</div>
                          <button class="mx-auto mt-2 primary-button">{{ $t('explicitShowMeThisContent') }}</button>
                        </div>
                      </div>
                    </nuxt-link> -->
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
                      :name="'i-ri-heart-3-line'" 
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
                          
                          <div>
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
        </div>

        <InfiniteLoading
          :load="fetch"
          v-model:is-initial="isInitial"
        >
          <template #loading>
            <div class="loading-empty-error-message">
              <Icon :name="'i-line-md-loading-twotone-loop'" class="text-3xl" />
              <div class="justify-center mt-2 text-tiny hidden-md-flex">Currently making magic..</div>
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
          class="z-30 modal work-view"
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
        
        <SplashAlert 
          v-show="copied"
          id="copy-alert"
          :text="$t('linkCopied')"
          :icon="'i-bi-check-all'"
        />
      </div>
    </div>

    <template #right-side>
      <FeedSide />
      <!-- suggested users -->
      <div v-if="feeds.length">
        <div class="section-title">{{ $t('feeds.suggestedUsers') }}</div>
        
        <UserList
          :users="suggestedUsersToFollow"
          :column-type="1"
          class="mt-2"
        />
      </div>
    </template>
  </Layout>
</template>

<script setup>
import { useClipboard } from '@vueuse/core'
import { VueEternalLoading as InfiniteLoading } from '@ts-pro/vue-eternal-loading'

// stores
import useAuthStore from '@/stores/auth.store'

// composables
import useUser from '~/composables/users/useUser'

// components
import Icon from '~/components/globals/Icon.vue'
import Layout from '~/components/layouts/Layout.vue'
import ModalView from '~/components/artworks/views/ModalView.vue'
import FeedModalView from '~/components/feeds/FeedModalView.vue'
import ImageList from '~/components/feeds/ImageList.vue'
import FeedLeftSide from '~/components/feeds/FeedLeftSide.vue'
import FeedSide from '~/components/layouts/right-sides/FeedSide.vue'
import ManageSave from '~/components/artworks/ManageSave.vue'
import SplashAlert from '~/components/globals/SplashAlert.vue'

// constants
import { newUserWelcomeMenus } from '~/utils/constants/feed'
import UserList from '~~/components/users/UserList.vue'

// stores
const auth = useAuthStore()

// composables
const { generateArtworkThumb } = useUpyImage()
const { oApiConfiguration, fetchOptions } = useApiFetch()
const artworkApi = useArtwork(oApiConfiguration, fetchOptions())
const feedApi = useFeed(oApiConfiguration, fetchOptions())
const userApi = useUser(oApiConfiguration, fetchOptions())

useHead ({
  title: useI18n().tl('meta.title.feed.feed')
})

defineProps ({
  changeMode: {
    type: Function,
    default: () => {}
  }
})

const runtimeConfig = useRuntimeConfig()
const router = useRouter()
const route = useRoute()

onBeforeMount (() => {
  if (!auth.loggedIn) {
    router.push({
      path: '/explore'
    })
  }
})

onMounted (async () => {
  await getSuggestedUsersToFollow()
  // window.addEventListener('keydown', (e) => {
  //   if (e.key === 'Escape') {
  //     closeArtworkModals()
  //   }
  // })
})

/**
 * @watchers
 */
watch (() => route.query, () => {
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
  }, 10);
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
watch (() => showPublicTextPost.value, () => {
  refetch()
})

/** Fetch / inifinite load */
const isInitial = ref(false)
const feeds = ref([])
const fetchMode = ref('feed')
const fetch = async ({ loaded }) => {
  const [data, error] = await feedApi.getChronologicalFeeds({
    fetchMode: fetchMode.value,
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
    showSuggestedUsers.value = true
  }

  options.value.pagination.page += 1

  if (data.feeds.length) {
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
      feed.apply_explicit_filter = false
      feed.apply_gore_filter = false
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
    }
  }

  loaded(data.feeds.length, options.value.pagination.perPage)
}

const changeFetchMode = (mode) => {
  fetchMode.value = mode

  refetch()
}

const refetch = () => {
  // reset current state
  options.value.pagination.page = 0
  feeds.value = []

  isInitial.value = true
}

/** Get users suggestion to follow */
const showSuggestedUsers = ref(false)
const suggestedUsersToFollow = ref([])
const getSuggestedUsersToFollow = async () => {
  const [suggestions, error] = await userApi.getSuggestedUsersToFollow()

  if (suggestions.length) {
    suggestedUsersToFollow.value = suggestions
  }
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

  if (type === 'artwork') {
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

  if (type === 'artwork') {
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

.feed-title {
  @apply font-bold text-base;
}

.feed-description {
  @apply text-xs mt-2;
}
</style>

<template>
  <Layout 
    :hide-side="true"
    :with-footer="true"
    :no-right-side="true"
  >
    <!-- cover -->
    <div>
      <nuxt-img 
        preload
        loading="lazy"
        :src="avatarCoverUrl(userInfo.cover_bucket, userInfo.cover_filename)" 
        class="object-cover object-top w-full h-32 rounded-t md:h-52 lg:h-72 xl:h-96 unselectable" 
        @error="defaultCoverImage"
      />
      <nuxt-link
        v-if="auth.loggedIn && auth.user.id === userInfo.id"
        :to="'/profile/setting'"
        class="float-right absolute right-4 mt-2 shadow-md icon-button-primary-color flex-md-hidden"
      >
        <Icon :name="'i-ph-gear-six'" />
      </nuxt-link>
    </div>
    
    <div class="px-2 pb-4 w-full rounded md:px-6 md:pb-6 theme-color">
      <div class="flex-row justify-between hidden-md-flex">
        <!-- DESKTOP: left side -->
        <div class="mr-6 w-1/5">
          <!-- avatar -->
          <nuxt-img
            preload
            loading="lazy"
            class="hidden -mt-2 w-full md:-mt-16 avatar md:flex"
            :src="avatarCoverUrl(userInfo.avatar_bucket, userInfo.avatar_filename)"
            @error="defaultCoverImage"
          />

          <!-- desktop -->
          <FollowButtons
            v-if="!loading"
            class="mt-2 hidden-md-flex"
            :user-info="userInfo"
            :followers-count="counter.followers"
            :followings-count="counter.followings"
            :is-following="followingData.isFollowing"
            :is-private="followingData.isPrivate"
            :following-since="followingData.followingSince"
            @changeCurrentState="changeCurrentState"
          />
        </div>

        <!-- user information -->
        <div class="hidden flex-row justify-between w-full md:flex md:mt-6">
          <div class="flex flex-col w-full">
            <div class="flex flex-row w-full">
              <!-- user info such as name, pen name, etc. -->
              <div class="w-9/12">
                <div>
                  <span class="text-base font-semibold">{{ userInfo.name }}</span>&nbsp;
                  <span class="mr-2 italic">@{{ userInfo.username }}</span>

                  <ProBadge v-if="userInfo.is_pro" />
                </div>

                <div class="flex flex-row mt-2">
                  <div
                    v-if="userInfo.pen_name && userInfo.pen_name !== ''"
                    class="mr-1"
                  >
                    <span class="flex flex-row rounded-md border-2 border-color-button-color button-color">
                      <div class="flex flex-row gap-1 p-1 pr-2 button-color">
                        <Icon :name="'i-mdi-fountain-pen-tip'" /> 
                        {{ $t('profile.penName') }}
                      </div>
                      <div class="py-1 px-2 rounded-md theme-color">{{ userInfo.pen_name }}</div>
                    </span>
                  </div>
                </div>
              </div>

              <div class="float-right w-3/12 text-right">
                <!-- setting/update profile button -->
                <nuxt-link 
                  v-if="auth.loggedIn && auth.user.id === userInfo.id"
                  :to="'/profile/setting'" 
                  class="float-right -mt-20 shadow-md"
                >
                  <button class="shadow-md light-button">
                    <Icon :name="'i-ph-gear-six'" />
                    <span class="leading-4">{{ $t('profile.setting') }}</span>
                  </button>
                </nuxt-link>
              </div>
            </div>

            <div>
              <p
                v-if="userInfo.bio"
                :id="'user-bio-'+userInfo.id"
                class="mt-4"
                v-html="userInfo.bio && userInfo.bio.length > 300 ? `${userInfo.bio.slice(0, 300)}..` : userInfo.bio"
              />

              <a 
                v-if="userInfo.bio && userInfo.bio.length > 300" 
                :id="'user-bio-read-more-'+userInfo.id" 
                class="href" 
                @click.prevent="readMore(userInfo.bio, userInfo.id, 'user-bio-read-more-', 'user-bio-')"
              >
                {{ $t('readMore') }}
              </a>
            </div>

            <!-- social links -->
            <Socials
              v-if="userInfo.user_socials"
              :socials="userInfo.user_socials"
            />
          </div>
        </div>
      </div>

      <!-- user info: for mobile or smaller device -->
      <div class="flex flex-col text-center md:hidden">
        <!-- avatar -->
        <nuxt-img
          preload
          loading="lazy"
          class="flex mx-auto -mt-14 w-2/6 sm:-mt-16 sm:w-1/5 avatar md:hidden"
          :src="avatarCoverUrl(userInfo.avatar_bucket, userInfo.avatar_filename)" 
          @error="defaultCoverImage"
        />

        <!-- user info -->
        <div class="mt-4 text-base font-semibold">
          {{ userInfo.name }}
        </div>
        <div>
          @{{ userInfo.username }}
        </div>

        <div class="flex flex-row justify-center mt-4">
          <span
            v-if="userInfo.pen_name"
            class="flex flex-row mr-1"
          >
            <span class="flex flex-row rounded-md border-2 border-color-secondary">
              <div class="flex flex-row gap-1 p-1 pr-2 theme-color-secondary">
                <Icon :name="'i-mdi-fountain-pen-tip'" /> 
                {{ $t('profile.penName') }}
              </div>
              <div class="py-1 px-2 rounded-md">{{ userInfo.pen_name }}</div>
            </span>
          </span>
        </div>

        <div
          v-if="userInfo.bio"
          class="mx-2 mt-4 text-center"
        >
          <p
            :id="'mobile__user-bio-'+userInfo.id"
            v-html="userInfo.bio && userInfo.bio.length > 150 ? `${userInfo.bio.slice(0, 300)}..` : userInfo.bio"
          />

          <a 
            v-if="userInfo.bio && userInfo.bio.length > 150"
            :id="'mobile__user-bio-read-more-'+userInfo.id" 
            class="href" 
            @click.prevent="readMore(userInfo.bio, userInfo.id, 'mobile__user-bio-read-more-', 'mobile__user-bio-')"
          >
            {{ $t('readMore') }}
          </a>
        </div>

        <!-- mobile -->
        <FollowButtons
          v-if="!loading"
          class="mt-4 mb-2 flex-md-hidden"
          :user-info="userInfo"
          :followers-count="counter.followers"
          :followings-count="counter.followings"
          :is-following="followingData.isFollowing"
          :is-private="followingData.isPrivate"
          :following-since="followingData.followingSince"
          @changeCurrentState="changeCurrentState"
        />
      </div>

      <!-- MOBILE: social links -->
      <Socials
        v-if="userInfo.user_socials"
        class="mb-6 md:hidden"
        :socials="userInfo.user_socials"
      />

      <div class="mt-2">
        <!-- mobile or smaller device navigation -->
        <div class="flex flex-row gap-x-2 justify-center md:hidden">
          <!-- dashboard -->
          <div 
            class="profile-navigation__mobile theme-color-secondary"
            :class="{ 'button-color text-white': currentState == 'dashboard' }"
            @click="changeCurrentState('dashboard')"
          >
            <div>
              <Icon
                v-show="currentState == 'dashboard'"
                :name="'i-ion-home-outline'"
                class="text-white"
              />
              <Icon
                v-show="currentState != 'dashboard'"
                :name="'i-ion-home-outline'"
                class="hover:text-white"
              />
            </div>
            <span>{{ $t('dashboard') }}</span>
          </div>

          <!-- album -->
          <div 
            class="profile-navigation__mobile theme-color-secondary"
            :class="{ 'button-color text-white': currentState == 'albums' }"
            @click="changeCurrentState('albums')"
          >
            <div>
              <Icon
                v-show="currentState == 'albums'"
                :name="'i-ion-folder-outline'"
                class="text-white"
              />
              <Icon
                v-show="currentState != 'albums'"
                :name="'i-ion-folder-outline'"
                class="hover:text-white"
              />
            </div>
            <span>{{ $t('albums.albums') }}</span>
          </div>

          <!-- collection -->
          <div 
            class="profile-navigation__mobile theme-color-secondary"
            :class="{ 'button-color text-white': currentState == 'collections' }"
            @click="changeCurrentState('collections')"
          >
            <div>
              <Icon
                v-show="currentState == 'collections'"
                :name="'i-majesticons-bookmark-line'"
                class="text-white"
              />
              <Icon
                v-show="currentState != 'collections'"
                :name="'i-majesticons-bookmark-line'"
                class="hover:text-white"
              />
            </div>
            <span>{{ $t('collections.collections') }}</span>
          </div>

          <!-- liked -->
          <div 
            v-if="auth.loggedIn && auth.user.id === userInfo.id"
            class="profile-navigation__mobile theme-color-secondary"
            :class="{ 'button-color text-white': currentState == 'liked' }"
            @click="changeCurrentState('liked')"
          >
            <div>
              <Icon
                v-show="currentState == 'liked'"
                :name="'i-ri-heart-3-line'"
                class="text-white"
              />
              <Icon
                v-show="currentState != 'liked'"
                :name="'i-ri-heart-3-line'"
                class="hover:text-white"
              />
            </div>
            <span>{{ $t('artworks.liked') }}</span>
          </div>
        </div>

        <div class="flex flex-row justify-between mt-2 md:mt-6">
          <!-- left side -->
          <div class="hidden flex-col lg:w-1/5 md:flex">
            <div 
              class="profile-navigation left-menu-link theme-color-secondary"
              :class="{ 'button-color text-white': currentState === 'dashboard' }"
              @click="changeCurrentState('dashboard')"
            >
              <div class="profile-navigation_wrapper">
                <Icon
                  v-show="currentState === 'dashboard'"
                  :name="'i-humbleicons-dashboard'"
                  class="text-white"
                />
                <Icon
                  v-show="currentState !== 'dashboard'"
                  :name="'i-humbleicons-dashboard'"
                />
                <label class="hidden-lg-flex">
                  {{ $t('dashboard') }}
                </label>
              </div>
              <span class="hidden-lg-flex" />
            </div>
            
            <div 
              class="profile-navigation left-menu-link theme-color-secondary"
              :class="{ 'button-color text-white': currentState === 'albums' }"
              @click="changeCurrentState('albums')"
            >
              <div class="profile-navigation_wrapper">
                <Icon
                  v-show="currentState === 'albums'"
                  :name="'i-bx-photo-album'"
                  class="text-white"
                />
                <Icon
                  v-show="currentState !== 'albums'"
                  :name="'i-bx-photo-album'"
                />
                <label class="hidden-lg-flex">
                  {{ $t('albums.albums') }}
                </label>
              </div>
              <span class="hidden-lg-flex">{{ thousand(counter.album) }}</span>
            </div>

            <div 
              class="profile-navigation left-menu-link theme-color-secondary"
              :class="{ 'button-color text-white': currentState === 'collections' }"
              @click="changeCurrentState('collections')"
            >
              <div class="profile-navigation_wrapper">
                <Icon
                  v-show="currentState === 'collections'"
                  :name="'i-majesticons-bookmark-line'"
                  class="text-white"
                />
                <Icon
                  v-show="currentState !== 'collections'"
                  :name="'i-majesticons-bookmark-line'"
                />
                <label class="hidden-lg-flex">
                  {{ $t('collections.collections') }}
                </label>
              </div>
              <span class="hidden-lg-flex">{{ thousand(counter.collection) }}</span>
            </div>

            <div
              v-if="auth.loggedIn && auth.user.id === userInfo.id"
              class="custom-divider"
            />

            <div 
              v-if="auth.loggedIn && auth.user.id === userInfo.id"
              class="profile-navigation left-menu-link theme-color-secondary"
              :class="{ 'button-color text-white': currentState === 'liked' }"
              @click="changeCurrentState('liked')"
            >
              <div class="profile-navigation_wrapper">
                <Icon
                  v-show="currentState === 'liked'"
                  :name="'i-ri-heart-3-line'"
                  class="text-white"
                />
                <Icon
                  v-show="currentState !== 'liked'"
                  :name="'i-ri-heart-3-line'"
                />
                <label class="hidden-lg-flex">
                  {{ $t('artworks.liked') }}
                </label>
              </div>
              <span class="hidden-lg-flex">{{ thousand(counter.liked) }}</span>
            </div>
          </div>

          <!-- START OF: CONTENT -->
          <div class="w-full md:ml-6">
            <!-- view mode: dashboard -->
            <div v-if="currentState === 'dashboard'">
              <div class="flex flex-row w-full">
                <div 
                  class="flex flex-row justify-between w-full md:justify-center profile-category-button left-menu-link theme-color-secondary md:w-auto"
                  :class="{ 'button-color text-white': activeDashboard === 'feed' }"
                  @click="activeDashboard = 'feed'" 
                >
                  {{ $t('feed') }}
                  <span 
                    class="px-1 ml-2 rounded" 
                    :class="activeDashboard === 'feed' ? 'theme-color' : 'button-color text-white'"
                  >
                    {{ thousand(counter.feed) }}
                  </span>
                </div>

                <div 
                  class="flex flex-row justify-between mr-0 w-full md:justify-center profile-category-button left-menu-link theme-color-secondary md:w-auto"
                  :class="{ 'button-color text-white': activeDashboard === POST_TYPES.ARTWORK }"
                  @click="activeDashboard = POST_TYPES.ARTWORK" 
                >
                  {{ $t('artworks.artwork') }}
                  <span 
                    class="px-1 ml-2 rounded" 
                    :class="activeDashboard === POST_TYPES.ARTWORK ? 'theme-color' : 'button-color text-white'"
                  >
                    {{ thousand(counter.artwork) }}
                  </span>
                </div>
              </div>

              <div 
                v-show="!loading && auth.loggedIn && (auth.user.id === userInfo.id) && activeDashboard === POST_TYPES.ARTWORK && config.showManageMode" 
                class="flex flex-row gap-2 justify-between mt-4 w-full"
              >
                <!-- left side: artwork sort -->
                <div class="w-full md:w-auto">
                  <div class="inline-block w-full group md:w-52">
                    <button
                      class="flex items-center py-2 w-full rounded-md border-2 border-transparent outline-none md:w-52 theme-color-secondary hover:button"
                      @click="togglePopularOrderStatus()"
                    >
                      <span class="flex-1 pr-1">{{ sortBy === 'latest' ? $t('profile.artworks.sorter.latest') : sortByTitle }}</span>
                      <span>
                        <svg
                          class="w-4 h-4 transition duration-150 ease-in-out transform fill-current group-hover:-rotate-180"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </span>
                    </button>
                    <ul
                      id="profile-artwork-order" 
                      class="absolute z-50 mt-1 w-6/12 text-center rounded-md transition duration-150 ease-in-out transform origin-top scale-0 md:w-52 theme-color group-hover:scale-100"
                    >
                      <li
                        :class="[
                          { 'button': sortBy === 'latest' },
                          { 'rounded-b-md': !auth.loggedIn }
                        ]" 
                        @click="changeSort('latest', $t('profile.artworks.sorter.latest'))"
                      >
                        <Icon
                          :name="'i-material-symbols-fiber-new'"
                          :class="{ 'text-white': sortBy === 'latest' }"
                        />
                        Latest
                      </li>

                      <li
                        :class="[
                          { 'button': sortBy === 'popular' },
                          { 'rounded-b-md': !auth.loggedIn }
                        ]" 
                        @click="changeSort('popular', $t('profile.artworks.sorter.popular'))"
                      >
                        <Icon
                          :name="'i-ic-twotone-star'"
                          :class="{ 'text-white': sortBy === 'popular' }"
                        />
                        Popular
                      </li>

                      <li
                        :class="[
                          { 'button': sortBy === 'oldest' },
                          { 'rounded-b-md': !auth.loggedIn }
                        ]" 
                        @click="changeSort('oldest', $t('profile.artworks.sorter.oldest'))"
                      >
                        <Icon
                          :name="'i-ic-baseline-update'"
                          :class="{ 'text-white': sortBy === 'oldest' }"
                        />
                        Oldest
                      </li>
                    </ul>
                  </div>
                </div>

                <!-- right side: manage button -->
                <div class="flex flex-row gap-x-2 w-full md:w-auto">
                  <button
                    :class="[
                      'w-full action-button md:w-auto md:mt-0',
                      config.manageMode ? 'danger-button' : 'secondary-button'
                    ]"
                    @click="config.manageMode = !config.manageMode"
                  >
                    <Icon 
                      :name="config.manageMode ? 
                        'i-ion-close-outline' : 
                        'i-material-symbols-library-add-check-outline-rounded'"
                    />
                    {{ config.manageMode ? $t('quit') : $t('manage') }}
                  </button>

                  <button
                    v-show="config.manageMode"
                    class="w-full primary-button md:w-auto"
                    @click="openAlbumSelectionModal()"
                  >
                    <Icon :name="'i-ion-add-outline'" />
                    {{ $t('albums.addToAlbum') }}
                  </button>
                </div>
              </div>

              <LoadingEmptyErrorMessage
                class="mt-2"
                :loading="loading"
                :background-color="'theme-color-secondary'"
              />
              
              <!-- manage mode message -->
              <div
                v-show="config.manageMode"
                class="p-2 mt-2 text-black bg-yellow-200 rounded-md"
              >
                {{ $t('profile.manageModeActiveMessage') }}
              </div>
              
              <!-- content -->
              <div class="mt-2">
                <!-- feeds -->
                <Feeds
                  v-if="activeDashboard === 'feed'"
                  ref="feedListRef"
                  :user-id="userInfo.id"
                />

                <!-- artworks -->
                <Artworks
                  v-if="!loading && activeDashboard === POST_TYPES.ARTWORK"
                  ref="artworkListRef"
                  :key="artworkListKey"
                  :user-id="userInfo.id"
                  :manage-mode="config.manageMode"
                  :sort-by="sortBy"
                  @feedSelectedItems="feedSelectedItems"
                  @onEmpty="onEmpty"
                />
              </div>
            </div>

            <!-- view mode: albums -->
            <div v-if="currentState === 'albums'">
              <Album
                v-if="!loading"
                :user-id="userInfo.id"
              />
            </div>

            <!-- view mode: collections -->
            <div v-if="currentState === 'collections'">
              <Collection
                v-if="!loading"
                :user-id="userInfo.id"
              />
            </div>

            <!-- view mode: liked artworks -->
            <div v-if="auth.loggedIn && auth.user.id === userInfo.id && currentState === 'liked'">
              <Liked
                v-if="!loading"
                :user-id="userInfo.id"
                @onEmpty="onEmpty"
              />
            </div>

            <!-- view mode: follower list -->
            <div v-if="currentState === 'followerList'">
              <FollowerList
                v-if="!loading"
                :user-id="userInfo.id"
                :hide="auth.loggedIn ? (userInfo.id === auth.user.id) : userInfo.is_pro && !!userInfo.user_settings.hide_follower_list"
                :user-hide-follower-list-status="!!userInfo.user_settings.hide_follower_list"
              />
            </div>

            <!-- view mode: following list -->
            <div v-if="currentState === 'followingList'">
              <FollowingList
                v-if="!loading"
                :user-id="userInfo.id"
                :hide="isHideFollowingList"
                :user-hide-following-list-status="!!userInfo.user_settings.hide_following_list"
              />
            </div>
          </div>
          <!-- END OF: CONTENT -->
        </div>
      </div>
    </div>

    <!-- external website visit confirmation dialog -->
    <ConfirmationDialog
      v-if="userInfo.user_socials && userInfo.user_socials.personal_website"
      id="external-website-visit-confirmation-modal"
      class="modal"
      :modal-id="'external-website-visit-confirmation-modal'"
      :message="'<div>You are going to visit this website, are you sure?</div><div class=\'text-center w-full italic href mt-4 rounded-md p-2 rounded-md theme-color-secondary\'>'+userInfo.user_socials.personal_website+'</div>'"
      @onAccept="visitExternalWebsite"
    />

    <!-- Miscellaneous -->
    <!-- [Add selected item(s) to albums] Select album where the items will be stored. -->
    <ManageAlbum
      v-if="!loading"
      id="album-selection-modal"
      ref="albumSelectionModalRef"
      class="modal"
      :work-ids="selectedItems"
      @addedToAlbum="addedToAlbum"
    />
    <SplashAlert
      v-show="isSelectedItemsAddedToSelectedAlbums"
      id="item-added-to-album-alert"
      :text="$t('albums.itemAdded')"
    />
  </Layout>
</template>

<script setup>
import { POST_TYPES } from '~/utils/constants'

// stores
import useAuthStore from '@/stores/auth.store'

// components
import Socials from './Socials.vue'
import FollowButtons from './FollowButtons.vue'
import Layout from '~/components/layouts/Layout.vue'
import Icon from '~/components/globals/Icon.vue'
import SplashAlert from '~/components/globals/SplashAlert.vue'
import ManageAlbum from '~/components/albums/ManageAlbum.vue'
import Feeds from '~/components/profile/Feeds.vue'
import Artworks from '~/components/profile/Artworks.vue'
import Album from '~/components/profile/Album.vue'
import Collection from '~/components/profile/Collection.vue'
import Liked from '~/components/profile/artworks/Liked.vue'
import FollowerList from '~/components/profile/FollowerList.vue'
import FollowingList from '~/components/profile/FollowingList.vue'
import LoadingEmptyErrorMessage from '~/components/globals/LoadingEmptyErrorMessage.vue'
import ProBadge from '~/components/globals/ProBadge.vue'
import ConfirmationDialog from '~/components/globals/ConfirmationDialog.vue'

// composables
import useUser from '~/composables/users/useUser'
import useAlbum from '~/composables/users/useAlbum'
import useCollection from '~/composables/users/useCollection'

// stores
const auth = useAuthStore()

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const userApi = useUser(oApiConfiguration, fetchOptions())
const album = useAlbum(oApiConfiguration, fetchOptions())
const collectionApi = useCollection(oApiConfiguration, fetchOptions())
const artworkApi = useArtwork(oApiConfiguration, fetchOptions())

const emit = defineEmits(['setMeta'])
const props = defineProps({
  id: {
    type: Number,
    default: 0
  },
  userLogon: {
    type: Boolean,
    default: false
  }
})

const route = useRoute()
const router = useRouter()

const { o } = route.query

const loading = ref(true)
const currentState = o != null ? ref(o) : ref('dashboard')
const activeDashboard = ref(POST_TYPES.ARTWORK)
const artworkListKey = ref(0)
const userId = computed(() => {
  return props.userLogon && auth.loggedIn ? auth.user.id : props.id
})
const config = ref({
  manageMode: false,
  showManageMode: true
})

onMounted(async () => {
  await fetchUserInfo()
})

const changeCurrentState = (state) => {
  currentState.value = state
  config.value.manageMode = false
  if (o != null) {
    router.push('/profile')
  }
}

const userInfo = ref({})
const counter = ref({
  feed: 0,
  artwork: 0,
  comic: 0,
  tutorial: 0,
  album: 0,
  collection: 0,
  liked: 0,
  followers: 0,
  followings: 0,
})
const followingData = ref({
  isFollowing: false,
  isPrivate: false,
  followingSince: ''
})
const isHideFollowingList = computed(() => {
  const proHide = userInfo.value.is_pro && userInfo.value.user_settings.hide_following_list

  return ((!auth.loggedIn && proHide) || (auth.loggedIn && auth.user.id !== userInfo.value.id && proHide))
})
console.log('is hide following list:', isHideFollowingList.value)
const fetchUserInfo = async () => {
  loading.value = true

  try {
    const [userData] = await userApi.getInfo(userId.value)
    userInfo.value = userData

    // is user followed or not
    if (auth.loggedIn && (auth.user.id !== userId.value)) {
      const [followData] = await userApi.isFollowing(userId.value)

      followingData.value = {
        isFollowing: followData.is_following,
        isPrivate: followData.is_private,
        followingSince: followData.following_since
      }
    }

    // count feed total
    const [feedTotal] = await userApi.countFeeds(userId.value)
    counter.value.feed = feedTotal

    // count artwork total
    const [artworkTotal] = await userApi.countArtworks(userId.value)
    counter.value.artwork = artworkTotal

    // count followers
    const [followersTotal] = await userApi.countFollowers(userId.value)
    counter.value.followers = followersTotal

    // count followings
    const [followingsTotal] = await userApi.countFollowings(userId.value)
    counter.value.followings = followingsTotal

    // count album total
    const [albumTotal] = await album.countAlbums(userId.value)
    counter.value.album = albumTotal

    // count collection total
    const [collectionTotal] = await collectionApi.countCollections(userId.value)
    counter.value.collection = collectionTotal

    // count liked artwork total
    if (auth.loggedIn && auth.user.id === userInfo.value.id) {
      const [likedArtworkTotal] = await artworkApi.countUserLikedArtworks({
        userId: userId.value
      })
      counter.value.liked = likedArtworkTotal
    }

    emit('setMeta', {
      title: `(${userInfo.value.username}) ${userInfo.value.name}`
    })
  } catch (error) {
    // 
  }

  loading.value = false
}

/**
 * Get a feedback of the selected items that being selected on work list component and 
 * send it to the manage album component to be added to selected albums.
 */
const artworkListRef = ref(null)
const selectedItems = ref([])
const feedSelectedItems = (items) => {
  selectedItems.value = items
}

const onEmpty = () => {
  config.value.showManageMode = false
}

const albumSelectionModalRef = ref(null)
const openAlbumSelectionModal = () => {
  useModal().openModal('album-selection-modal')
  // albumSelectionModalRef.value.fetchAlbums()
}

/**
 * On selected items added to the selected albums show a splash notification to the user 
 * that tells them that the items have been added to the selected albums.
 */
const isSelectedItemsAddedToSelectedAlbums = ref(false)
let selectedItemAddedInterval
const addedToAlbum = () => {
  useSplash().splash(selectedItemAddedInterval, isSelectedItemsAddedToSelectedAlbums, 'item-added-to-album-alert')
}

/**
 * @sorting
 */
const sortBy = ref('latest')
const sortByTitle = ref('')
const changeSort = async (key, text) => {
  sortBy.value = key
  sortByTitle.value = text

  unfoldArtworkOrder()
}
const unfoldArtworkOrder = () => {
  const popularOrderOptions = document.getElementById('profile-artwork-order')
  popularOrderOptions.classList.add('scale-0')
}
/**
 * @sorting
 */

const sliceBio = ref(true)
const readMore = (bio, userId, selectorElId, bioElId) => {
  sliceBio.value = false
  useReadMore().readMore(bio, userId, selectorElId, bioElId)
}

const visitExternalWebsite = () => {
  if (userInfo.value.user_socials && userInfo.value.user_socials.personal_website) {
    window.open(userInfo.value.user_socials.personal_website, '_blank')
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/tailwind.scss';

.avatar {
  @apply shadow-lg shadow-gray-300;
}

.profile-navigation {
  @apply flex flex-row py-3 px-4 mb-2 font-medium leading-5 rounded ring-offset-2 transition-all duration-200 cursor-pointer parent-icon hover:button hover:text-white justify-between;

  .profile-navigation_wrapper {
    @apply flex flex-row ml-2 lg:ml-0;

    label {
      @apply hidden lg:block cursor-pointer;
    }

    .icon {
      @apply mr-3 text-lg hover:text-white;
    }
  }
}

.profile-navigation__mobile {
  @apply flex flex-col py-2 px-3 w-full text-center rounded md:hidden hover:button hover:text-white;

  .icon {
    @apply mb-1 mt-1 w-full text-lg text-center hover:text-white;
  }
}

#profile-artwork-order {
  li {
    @apply flex flex-row justify-between py-2 px-3 cursor-pointer hover:button icon-hover-parent;
  }
}
</style>

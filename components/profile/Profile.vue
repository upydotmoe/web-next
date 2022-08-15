<template>
  <Layout 
    :hide-side="true"
    :with-footer="true"
    :no-right-side="true"
  >
    <!-- cover -->
    <div>
      <img 
        :src="avatarCoverUrl(userInfo.cover_bucket, userInfo.cover_filename)" 
        class="object-cover object-top w-full h-32 rounded-t md:h-52 lg:h-72 xl:h-96 unselectable" 
        @error="imageLoadError"
      >
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
        <!-- for desktop: left side -->
        <div class="mr-6 w-1/5">
          <!-- avatar -->
          <img 
            :src="avatarCoverUrl(userInfo.avatar_bucket, userInfo.avatar_filename)" 
            class="hidden -mt-2 w-full md:-mt-16 avatar md:flex" 
            @error="imageLoadError"
          >

          <!-- follow & unfollow -->
          <div class="mt-4">
            <div 
              v-if="auth.loggedIn && userInfo.id !== auth.user.id"
              class="mt-2 primary-button"
              :class="{ 'hover:danger-button': isFollowing }"
              @click="isFollowing ? unfollow(userInfo.id) : follow(userInfo.id)"
              @mouseover="unfollowHoverLeave('i-fluent-person-32-regular-remove-outline', $t('unfollow'))"
              @mouseleave="unfollowHoverLeave('checkmark-done-outline', $t('following'))"
            >
              <!-- if not following -->
              <div v-show="!isFollowing" class="flex flex-row">
                <Icon :name="'i-fluent-person-32-regular-add-outline'" />
                {{ $t('follow') }}
              </div>

              <!-- if following -->
              <div 
                v-show="isFollowing" 
                class="flex flex-row"
              >
                <Icon :name="unfollowIcon" />
                {{ unfollowText === null ? $t('following') : unfollowText }}
              </div>
            </div>

            <!-- followers and followings -->
            <div class="flex-row justify-center mt-2 hidden-md-flex">
              <div class="mr-4 cursor-pointer" @click="currentState = 'followerList'">
                <b>{{ counter.followers }}</b>&nbsp;
                <i>{{ $t('followers').toLowerCase() }}</i>
              </div>
              <div class="cursor-pointer" @click="currentState = 'followingList'">
                <b>{{ counter.followings }}</b>&nbsp;
                <i>{{ $t('following').toLowerCase() }}</i>
              </div>
            </div>
          </div>
        </div>

        <!-- user information -->
        <div class="hidden flex-row justify-between w-full md:flex md:mt-6">
          <div class="flex flex-col w-full">
            <div class="flex flex-row w-full">
              <!-- user info such as name, pen name, etc. -->
              <div class="w-9/12">
                <div>
                  <span class="text-base font-semibold">{{ userInfo.name }}</span>&nbsp;
                  <span class="mr-2 italic">{{ userInfo.username }}</span>
                </div>

                <div class="flex flex-row mt-2">
                  <div class="mr-1">
                    <span class="flex flex-row">
                      <Icon :name="'i-ion-pencil-outline'" class="mr-1 text-base font-bold" /> 
                      {{ userInfo.pen_name && userInfo.pen_name !== '' ? userInfo.pen_name : '-' }}
                    </span>
                  </div>

                  <div class="mr-1">
                    <span v-if="userInfo.gender === 'm'" class="flex flex-row">
                      <Icon :name="'i-ion-male-outline'" class="mr-1 ml-2 text-base font-bold" /> he/his
                    </span>
                    <span v-if="userInfo.gender === 'f'" class="flex flex-row">
                      <Icon :name="'i-ion-female-outline'" class="mr-1 ml-2 text-base font-bold" /> she/her
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
                  <button class="flex flex-row primary-button">
                    <Icon :name="'i-ph-gear-six'" class="mr-2" />
                    <span class="leading-4">{{ $t('profile.setting') }}</span>
                  </button>
                </nuxt-link>

                <!-- social links -->
                <div v-if="userInfo.user_socials" class="mt-4">
                  <a 
                    v-if="userInfo.user_socials.facebook" 
                    :href="'https://facebook.com/' + userInfo.user_socials.facebook" 
                    target="blank" 
                    class="ml-3 cursor-pointer"
                  >
                    <Icon :name="'i-ion-logo-facebook'" class="text-xl" />
                  </a>
                  
                  <a 
                    v-if="userInfo.user_socials.instagram" 
                    :href="'https://instagram.com/' + userInfo.user_socials.instagram + '/'"
                    target="blank" 
                    class="ml-3 cursor-pointer"
                  >
                    <Icon :name="'i-ion-logo-instagram'" class="text-xl" />
                  </a>

                  <a 
                    v-if="userInfo.user_socials.twitter" 
                    :href="'https://twitter.com/' + userInfo.user_socials.twitter" 
                    target="blank" 
                    class="ml-3 cursor-pointer"
                  >
                    <Icon :name="'i-ion-logo-twitter'" class="text-xl" />
                  </a>
                  
                  <a 
                    v-if="userInfo.user_socials.youtube" 
                    :href="'https://youtube.com/channel/' + userInfo.user_socials.youtube"
                    target="blank" 
                    class="ml-3 cursor-pointer"
                  >
                    <Icon :name="'i-ion-logo-youtube'" class="text-xl" />
                  </a>
                  
                  <a 
                    v-if="userInfo.user_socials.patreon" 
                    :href="'https://patreon.com/' + userInfo.user_socials.patreon + '/'"
                    target="blank" 
                    class="ml-3 cursor-pointer"
                  >
                    <Icon :name="'heart'" class="text-xl" />
                  </a>
                </div>
              </div>
            </div>

            <div>
              <p v-if="userInfo.bio" class="mt-4">
                <span :id="'user-bio-'+userInfo.id">
                  {{ userInfo.bio.length > 300 ? `${userInfo.bio.slice(0, 300)}...` : userInfo.bio }}
                </span>
                <a 
                  v-if="userInfo.bio.length > 300" 
                  :id="'user-bio-read-more-'+userInfo.id" 
                  class="href" 
                  @click.prevent="readMore(userInfo.bio, userInfo.id, 'user-bio-read-more-', 'user-bio-')"
                >
                  {{ $t('readMore') }}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- user info: for mobile or smaller device -->
      <div class="flex flex-col text-center md:hidden">
        <!-- avatar -->
        <img 
          :src="avatarCoverUrl(userInfo.avatar_bucket, userInfo.avatar_filename)" 
          class="flex mx-auto -mt-14 w-2/6 sm:-mt-16 sm:w-1/5 avatar md:hidden"
          @error="imageLoadError"
        >

        <!-- user info -->
        <div class="mt-4 text-base font-semibold">
          {{ userInfo.name }}
        </div>
        <div>
          {{ userInfo.username }}
        </div>

        <div class="flex flex-row justify-center mt-4">
          <span v-if="userInfo.pen_name" class="flex flex-row mr-1">
            <Icon :name="'i-ion-pencil-outline'" class="mr-1 text-base font-bold" /> 
            {{ userInfo.pen_name && userInfo.pen_name !== '' ? userInfo.pen_name : '-' }}
          </span>

          <div class="mr-1">
            <span v-if="userInfo.gender === 'm'" class="flex flex-row">
              <Icon :name="'i-ion-male-outline'" class="mr-1 ml-2 text-base font-bold" /> he/his
            </span>
            <span v-if="userInfo.gender === 'f'" class="flex flex-row">
              <Icon :name="'i-ion-female-outline'" class="mr-1 ml-2 text-base font-bold" /> she/her
            </span>
          </div>
        </div>

        <div v-if="userInfo.bio" class="mx-2 mt-4 text-justify">
          <span :id="'mobile__user-bio-'+userInfo.id">
            {{ userInfo.bio.length > 150 ? `${userInfo.bio.slice(0, 150)}...` : userInfo.bio }}
          </span>
          <a 
            v-if="userInfo.bio.length > 150"
            :id="'mobile__user-bio-read-more-'+userInfo.id" 
            class="href" 
            @click.prevent="readMore(userInfo.bio, userInfo.id, 'mobile__user-bio-read-more-', 'mobile__user-bio-')"
          >
            {{ $t('readMore') }}
          </a>
        </div>

        <!-- social links -->
        <div v-if="userInfo.user_socials" class="flex flex-row justify-center mt-4">
          <a 
            v-if="userInfo.user_socials.facebook" 
            :href="'https://facebook.com/' + userInfo.user_socials.facebook" 
            target="blank" 
            class="ml-3 cursor-pointer"
          >
            <Icon :name="'i-ion-logo-facebook'" class="text-xl" />
          </a>
          
          <a 
            v-if="userInfo.user_socials.instagram" 
            :href="'https://instagram.com/' + userInfo.user_socials.instagram + '/'"
            target="blank" 
            class="ml-3 cursor-pointer"
          >
            <Icon :name="'i-ion-logo-instagram'" class="text-xl" />
          </a>

          <a 
            v-if="userInfo.user_socials.twitter" 
            :href="'https://twitter.com/' + userInfo.user_socials.twitter" 
            target="blank" 
            class="ml-3 cursor-pointer"
          >
            <Icon :name="'i-ion-logo-twitter'" class="text-xl" />
          </a>
          
          <a 
            v-if="userInfo.user_socials.youtube" 
            :href="'https://youtube.com/channel/' + userInfo.user_socials.youtube"
            target="blank" 
            class="ml-3 cursor-pointer"
          >
            <Icon :name="'i-ion-logo-youtube'" class="text-xl" />
          </a>
          
          <a 
            v-if="userInfo.user_socials.patreon" 
            :href="'https://patreon.com/' + userInfo.user_socials.patreon + '/'"
            target="blank" 
            class="ml-3 cursor-pointer"
          >
            <Icon :name="'i-ion-heart'" class="text-xl" />
          </a>
        </div>

        <!-- follow & unfollow -->
        <div class="flex flex-row justify-center mt-6 w-full">
          <div class="mr-4 cursor-pointer" @click="currentState = 'followerList'">
            <b>{{ counter.followers }}</b>&nbsp;
            <i>{{ $t('followers') }}</i>
          </div>
          <div class="cursor-pointer" @click="currentState = 'followingList'">
            <b>{{ counter.followings }}</b>&nbsp;
            <i>{{ $t('following') }}</i>
          </div>
        </div>

        <div 
          v-if="auth.loggedIn && userInfo.id !== auth.user.id"
          class="mt-2 w-auto"
          :class="isFollowing ? 'danger-button' : 'primary-button'"
          @click="isFollowing ? unfollow(userInfo.id) : follow(userInfo.id)"
        >
          <!-- if not following -->
          <div v-show="!isFollowing" class="flex flex-row">
            <Icon :name="'i-fluent-person-32-regular-add-outline'" />
            {{ $t('follow') }}
          </div>

          <!-- if following -->
          <div 
            v-show="isFollowing" 
            class="flex flex-row"
          >
            <Icon :name="unfollowIcon" />
            {{ unfollowText === null ? $t('following') : unfollowText }}
          </div>
        </div>
      </div>

      <div class="mt-8">
        <!-- mobile or smaller device navigation -->
        <div class="flex flex-row justify-center md:hidden">
          <div 
            class="mr-2 profile-navigation__mobile theme-color-secondary"
            :class="{ 'button-color text-white': currentState == 'dashboard' }"
            @click="changeCurrentState('dashboard')"
          >
            <div>
              <Icon v-show="currentState == 'dashboard'" :name="'i-ion-home-outline'" class="text-white" />
              <Icon v-show="currentState != 'dashboard'" :name="'i-ion-home-outline'" class="hover:text-white" />
            </div>
            <span>{{ $t('dashboard') }}</span>
          </div>
          <div 
            class="mr-2 profile-navigation__mobile theme-color-secondary"
            :class="{ 'button-color text-white': currentState == 'albums' }"
            @click="changeCurrentState('albums')"
          >
            <div>
              <Icon v-show="currentState == 'albums'" :name="'i-ion-folder-outline'" class="text-white" />
              <Icon v-show="currentState != 'albums'" :name="'i-ion-folder-outline'" class="hover:text-white" />
            </div>
            <span>{{ $t('albums.album') }}</span>
          </div>
          <div 
            class="profile-navigation__mobile theme-color-secondary"
            :class="{ 'button-color text-white': currentState == 'collections' }"
            @click="changeCurrentState('collections')"
          >
            <div>
              <Icon v-show="currentState == 'collections'" :name="'i-majesticons-bookmark-line'" class="text-white" />
              <Icon v-show="currentState != 'collections'" :name="'i-majesticons-bookmark-line'" class="hover:text-white" />
            </div>
            <span>{{ $t('collections.collection') }}</span>
          </div>
        </div>

        <div class="flex flex-row justify-between mt-8">
          <!-- left side -->
          <div class="hidden flex-col mr-6 lg:w-1/5 md:flex">
            <div 
              class="profile-navigation left-menu-link theme-color-secondary"
              :class="{ 'button-color text-white': currentState === 'dashboard' }"
              @click="changeCurrentState('dashboard')"
            >
              <div class="profile-navigation_wrapper">
                <Icon v-show="currentState === 'dashboard'" :name="'i-humbleicons-dashboard'" class="text-white" />
                <Icon v-show="currentState !== 'dashboard'" :name="'i-humbleicons-dashboard'" />
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
                <Icon v-show="currentState === 'albums'" :name="'i-bx-photo-album'" class="text-white" />
                <Icon v-show="currentState !== 'albums'" :name="'i-bx-photo-album'" />
                <label class="hidden-lg-flex">
                  {{ $t('albums.album') }}
                </label>
              </div>
              <span class="hidden-lg-flex">{{ counter.album }}</span>
            </div>

            <div 
              class="profile-navigation left-menu-link theme-color-secondary"
              :class="{ 'button-color text-white': currentState === 'collections' }"
              @click="changeCurrentState('collections')"
            >
              <div class="profile-navigation_wrapper">
                <Icon v-show="currentState === 'collections'" :name="'i-majesticons-bookmark-line'" class="text-white" />
                <Icon v-show="currentState !== 'collections'" :name="'i-majesticons-bookmark-line'" />
                <label class="hidden-lg-flex">
                  {{ $t('collections.collection') }}
                </label>
              </div>
              <span class="hidden-lg-flex">{{ counter.collection }}</span>
            </div>
          </div>

          <!-- right side -->
          <div class="w-full">
            <!-- dashboard -->
            <div v-if="currentState === 'dashboard'">
              <!-- navigation buttons -->
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
                    {{ counter.feed }}
                  </span>
                </div>

                <div 
                  class="flex flex-row justify-between mr-0 w-full md:justify-center profile-category-button left-menu-link theme-color-secondary md:w-auto"
                  :class="{ 'button-color text-white': activeDashboard === 'artwork' }"
                  @click="activeDashboard = 'artwork'" 
                >
                  {{ $t('artworks.artwork') }}
                  <span 
                    class="px-1 ml-2 rounded" 
                    :class="activeDashboard === 'artwork' ? 'theme-color' : 'button-color text-white'"
                  >
                    {{ counter.artwork }}
                  </span>
                </div>
                <!-- <div 
                  class="profile-category-button left-menu-link theme-color-secondary"
                  :class="{ 'button-color text-white': activeDashboard === 'comic' }"
                  @click="activeDashboard = 'comic'" 
                >
                  Comic
                </div> -->
                <!-- <div 
                  class="profile-category-button left-menu-link theme-color-secondary"
                  :class="{ 'button-color text-white': activeDashboard === 'tutorial' }"
                  @click="activeDashboard = 'tutorial'" 
                >
                  Tutorial
                </div> -->
              </div>

              <!-- manage mode: action button -->
              <div 
                v-show="auth.loggedIn && (auth.user.id === userInfo.id) && activeDashboard === 'artwork' && config.showManageMode" 
                class="flex flex-row gap-2 justify-between w-full md:justify-end"
              >
                <button class="w-full action-button secondary-button md:w-auto" @click="config.manageMode = !config.manageMode">
                  <Icon :name="config.manageMode ? 'i-ion-close-outline' : 'i-material-symbols-library-add-check-outline-rounded'" />
                  {{ config.manageMode ? $t('quit') : $t('manage') }}
                </button>

                <button v-show="config.manageMode" class="w-full primary-button md:w-auto" @click="openAlbumSelectionModal()">
                  <Icon :name="'i-ion-add-outline'" />
                  {{ $t('albums.addToAlbum') }}
                </button>
              </div>
              
              <!-- manage mode message -->
              <div v-show="config.manageMode" class="p-2 mt-2 text-black bg-yellow-200 rounded-md">
                {{ $t('profile.manageModeActiveMessage') }}
              </div>
              
              <!-- CONTENTS -->
              <div>
                <!-- feeds -->
                <Feeds
                  v-if="activeDashboard === 'feed'"
                  ref="feedListRef"
                  class="mt-2"
                  :user-id="userInfo.id"
                />

                <!-- artworks -->
                <Artworks
                  v-if="!loading && activeDashboard === 'artwork'"
                  ref="artworkListRef"
                  :user-id="userInfo.id"
                  :manage-mode="config.manageMode"
                  @feedSelectedItems="feedSelectedItems"
                  @onEmpty="onEmpty"
                />
              </div>
            </div>

            <!-- albums -->
            <div v-if="currentState === 'albums'">
              <Album
                v-if="!loading"
                :user-id="userInfo.id"
              />
            </div>

            <!-- collections -->
            <div v-if="currentState === 'collections'">
              <Collection
                v-if="!loading"
                :user-id="userInfo.id"
              />
            </div>

            <div v-if="currentState === 'followerList'">
              <FollowerList
                v-if="!loading"
                :user-id="userInfo.id"
              />
            </div>

            <div v-if="currentState === 'followingList'">
              <FollowingList
                v-if="!loading"
                :user-id="userInfo.id"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

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
// stores
import useAuthStore from '@/stores/auth.store'

// components
import Layout from '~/components/layouts/Layout.vue'
import Icon from '~/components/globals/Icon.vue'
import SplashAlert from '~/components/globals/SplashAlert.vue'
import ManageAlbum from '~/components/albums/ManageAlbum.vue'
import Feeds from '~/components/profile/Feeds.vue'
import Artworks from '~/components/profile/Artworks.vue'
import Album from '~/components/profile/Album.vue'
import Collection from '~/components/profile/Collection.vue'
import FollowerList from '~/components/profile/FollowerList.vue'
import FollowingList from '~/components/profile/FollowingList.vue'

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

/**
 * @props
 */
const props = defineProps ({
  id: {
    type: Number,
    default: 0
  },
  userLogon: {
    type: Boolean,
    default: false
  }
})

const { $router } = useNuxtApp()
const { o } = $router.currentRoute.value.query

const loading = ref(false)
const currentState = o != null ? ref(o) : ref('dashboard')
const activeDashboard = ref('artwork')
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
    $router.push('/profile')
  }
}

const userInfo = ref({})
const counter = ref({
  feed: 0,
  artwork: 0,
  comic: 0,
  tutorial: 0,
  album: 0,
  followers: 0,
  followings: 0
})
const fetchUserInfo = async () => {
  loading.value = true

  try {
    const [userData] = await userApi.getInfo(userId.value)
    userInfo.value = userData

    // is user followed or not
    if (auth.loggedIn && (auth.user.id !== userId.value)) {
      const [isUserFollowing] = await userApi.isFollowing(userId.value)
      isFollowing.value = isUserFollowing.is_following
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
 * FOLLOW AND UNFOLLOW =======================================================================================================================
 */
const isFollowing = ref(false)

const unfollowText = ref(null)
const unfollowIcon = ref('checkmark-done-outline')
const unfollowHoverLeave = (iconName, text) => {
  unfollowIcon.value = iconName
  unfollowText.value = text
}

const follow = async (userToFollow) => {
  const [success, error] = await userApi.follow(userToFollow)

  if (error) {
    // todo: handle error
  } else {
    // todo: user has been followed
    isFollowing.value = true
  }
}

const unfollow = async (userToUnfollow) => {
  const [success, error] = await userApi.unfollow(userToUnfollow)

  if (error) {
    // todo: handle error
  } else {
    // todo: user has been followed
    isFollowing.value = false
  }
}

const readMore = (bio, userId, selectorElId, bioElId) => {
  useReadMore().readMore(bio, userId, selectorElId, bioElId)
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/tailwind.scss';

.avatar {
  @apply object-cover rounded-md shadow-lg;
  aspect-ratio: 1/1;
}

.profile-navigation {
  @apply flex flex-row py-3 px-4 lg:mr-2 mb-2 font-medium leading-5 rounded ring-offset-2 transition-all duration-200 cursor-pointer parent-icon hover:button hover:text-white justify-between;

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
</style>
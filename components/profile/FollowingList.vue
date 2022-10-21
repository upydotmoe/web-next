<template>
  <div>
    <div class="flex flex-row justify-between">
      <div class="text-lg font-bold">{{ $t('followings') }}</div>

      <div>
        <div
          v-if="auth.loggedIn && auth.i502p00r0 && auth.user.id == userId"
          @click="fetchTop(privateOnlyFollowing ? false : true)"
          :class="[
            'flex flex-row cursor-pointer href',
            { 'font-bold': privateOnlyFollowing }
          ]"
        >
          <Icon v-show="privateOnlyFollowing" :name="'i-mdi-eye-check'" />
          <div class="mr-1">
            <Icon v-show="!privateOnlyFollowing" :name="'i-fluent-inprivate-account-16-regular'" />
            <Icon v-show="privateOnlyFollowing" :name="'i-fluent-inprivate-account-16-filled'" />
          </div>
          <span>{{ $t('privateFollow') }}</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4 mt-4 w-full md:grid-cols-2 lg:grid-cols-3">
      <nuxt-link
        v-for="(following, index) in followingList"
        :key="following.id"
        :to="'/profile/' + following.username"
        class="flex object-cover flex-row rounded-md shadow-lg cursor-pointer theme-color-secondary hover:shadow-xl"
        :style="following.cover_bucket && following.cover_filename ? 'background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('+avatarCoverUrl(following.cover_bucket, following.cover_filename)+');background-size:cover;' : 'background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('+abstractImgUrl+');background-size:cover;'"
      >
        <div class="flex flex-col w-full">
          <div class="flex flex-row w-full">
            <img
              :src="avatarCoverUrl(following.avatar_bucket, following.avatar_filename)"
              :class="[
                'rounded-bl-none avatar',
                following.artworks.length ? 'rounded-r-none' : 'rounded-tr-none'
              ]"
              @error="imageLoadError"
            >

            <div class="flex flex-col justify-between p-3 w-full text-white">
              <div class="flex flex-col">
                <span class="font-bold">{{ following.name }}</span>
                <span class="text-xxs">{{ following.pen_name }}</span>
              </div>

              <div class="flex flex-row w-full">
                <!-- user follow status, not appeared if the user is current login user -->
                <div v-if="auth.loggedIn && following.id !== auth.user.id" class="flex flex-row">
                  <!-- follow -->
                  <div 
                    v-show="!following.is_following"
                    class="flex flex-row"
                    @click.prevent="followUser(index, following.id)"
                  >
                    <Icon :name="'i-ri-user-add-fill'" class="text-gray-300 hover:text-white" />
                  </div>
                  
                  <div 
                    v-show="following.is_following"
                    class="flex flex-row" 
                    @mouseover="showUnfollow = following.id" 
                    @mouseout="showUnfollow = 0"
                    @click.prevent="unfollowUser(index, following.id)"
                  >
                    <!-- following -->
                    <Icon v-show="showUnfollow !== following.id" :name="'i-ri-user-follow-fill'" class="text-green-400" />

                    <!-- unfollow -->
                    <Icon v-show="showUnfollow && showUnfollow === following.id" :name="'i-ri-user-unfollow-fill'" class="text-red-400 hover:text-red-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="work-grid">
            <div
              v-for="(latestArtwork, workIndex) in following.artworks"
              :key="latestArtwork.id"
              :class="[
                'work-thumbnail theme-color-bg',
                latestArtwork._count.artwork_assets > 1 && currentWorkId != latestArtwork.id ? 'work-multiple' : ''
              ]"
            >
              <a
                :href="'/a/'+latestArtwork.id"
                target="_blank"
                class="w-full h-full theme-color-bg"
              >
                <div 
                  :class="[
                    'overflow-hidden relative text-center',
                    { 'rounded-bl-md': workIndex == 0 },
                    { 'rounded-br-md': workIndex == 2 }
                  ]"
                >
                  <!-- <p v-if="latestArtwork._count.artwork_assets > 1 && !applyExplicitFilter(auth, latestArtwork.is_explicit)">{{ latestArtwork._count.artwork_assets }}</p> -->
                  <span v-if="applyExplicitFilter(auth, latestArtwork.is_explicit)" class="absolute top-1/2 left-1/2 z-10 text-xl font-semibold text-white transform -translate-x-1/2 -translate-y-1/2">{{ $t('explicitContent') }}</span>
                  
                  <a 
                    :href="'/a/'+latestArtwork.id"
                    :class="[
                      { 'animate-wigglefast': manageMode }
                    ]"
                  >
                    <img 
                      :class="[
                        'w-full h-full unselectable',
                        { 'object-cover': !isUncropped },
                        isUncropped ? 'object-contain object-center h-44' : 'object-cover',
                        { 'blur-3xl brightness-50 unclickable': applyExplicitFilter(auth, latestArtwork.is_explicit) }
                      ]"
                      :src="artworkThumb(latestArtwork.artwork_assets[0].bucket, latestArtwork.artwork_assets[0].filename, 'thumbnail', false)"
                      @error="imageLoadError"
                    >
                  </a>
                </div>
              </a>
            </div>
          </div>
        </div>
      </nuxt-link>
    </div>

    <div v-show="showLoadMore" class="mt-4 primary-button" @click="fetch(false)">
      {{ $t('loadMore') }}
    </div>

    <!-- On loading, empty or error occured -->
    <LoadingEmptyErrorMessage
      :loading="loading"
      :empty="isEmpty"
      :error="isError"
      :fetch="fetchTop"
    />
  </div>
</template>

<script setup>
// assets
import abstractImgUrl from '~/static/bg-abstract.png'

// stores
import useAuthStore from '@/stores/auth.store'

// components
import Icon from '~/components/globals/Icon.vue'
import LoadingEmptyErrorMessage from '~/components/globals/LoadingEmptyErrorMessage.vue'

// composables
import useUser from '~/composables/users/useUser'

// stores
const auth = useAuthStore()

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const userApi = useUser(oApiConfiguration, fetchOptions())

const props = defineProps ({
  userId: {
    type: Number,
    default: 0
  }
})

onMounted (() => {
  fetch(false)
})

const privateOnlyFollowing = ref(false)
const fetchTop = async (isPrivateOnly) => {
  followingList.value = []
  pagination.value.page = 0
  privateOnlyFollowing.value = isPrivateOnly
  await fetch(isPrivateOnly)
}

const followingList = ref([])
const loading = ref(true)
const pagination = ref({
  page: 0,
  perPage: 12
})
const isError = ref(false)
const isEmpty = ref(false)
const showLoadMore = ref(false)
const fetch = async (isPrivateOnly) => {
  resetLoadingEmptyErrorMessage()
  loading.value = true

  const [data, error] = await userApi.getFollowingList({
    userId: props.userId,
    isPrivateOnly: isPrivateOnly ? 1 : 0,
    pagination: {
      page: pagination.value.page,
      perPage: pagination.value.perPage
    }
  })

  if (error) {
    isError.value = true
  } else {
    if (!data.followings.length) {
      isEmpty.value = true
    }

    data.followings.forEach((following) => {
      followingList.value.push(following)
    })

    pagination.value.page += 1
    if (data.pagination.next_previous.next_page) {
      showLoadMore.value = true
    } else {
      showLoadMore.value = false
    }
  }

  loading.value = false
}

const resetLoadingEmptyErrorMessage = () => {
  isEmpty.value = false
  isError.value = false
}

const showUnfollow = ref(0)
</script>

<style lang="scss" scoped>
@import '~/assets/css/tailwind.scss';

.avatar {
  @apply object-cover h-24;
  aspect-ratio: 1/1;
}

.work-grid {
  @apply grid z-0 grid-cols-3;

  .work-thumbnail {
    @apply object-cover shadow-lg transition-all duration-200 cursor-pointer;
  
    a {
      p {
        @apply absolute m-2 w-5 h-5 text-center text-white align-middle bg-gray-600 bg-opacity-70 rounded-sm;
      }
      img {
        @apply w-full theme-color;
        // object-cover object-top 
        aspect-ratio: 1/1;
      }
    }
  }
}
</style>

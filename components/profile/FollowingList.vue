<template>
  <div>
    <div class="flex flex-row justify-between">
      <div class="section-title">{{ $t('followings.followings') }}</div>

      <div class="inline-flex flex-row gap-4">
        <div class="flex flex-col justify-center align-middle">
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

        <!-- hide following list toggle -->
        <label 
          v-if="auth.loggedIn && auth.i502p00r0 && auth.user.id === userId"
          @click.prevent="toggleFollowingVisibility()"
          for="hide-following-toggle"
          class="inline-flex relative flex-row justify-center items-center cursor-pointer"
        >
          <input 
            id="hide-following-toggle" 
            type="checkbox" 
            class="inline-block align-middle sr-only peer"
            :checked="hideFollowingListToggle"
            :disabled="!auth.i502p00r0"
          >
          <div 
            :class="[
              'w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[\'\'] after:absolute after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600',
              { 'unclickable': !auth.i502p00r0 },
              auth.i502p00r0 ? ' after:top-[4px]' : ' after:top-[6px]'
            ]"
          />
          <span class="ml-2">{{ $t('followings.hideMyFollowings') }}</span>
          
          <ProBadge v-if="!auth.i502p00r0" class="ml-1" />
        </label>
      </div>
    </div>

    <div v-if="!hide && !loading && !isEmpty && !isError">
      <UserList
        class="mt-4"
        :users="followingList"
        :column-type="3"
      />

      <div v-show="showLoadMore" class="mt-4 primary-button" @click="fetch(false)">
        {{ $t('loadMore') }}
      </div>
    </div>

    <!-- On loading, empty or error occured -->
    <LoadingEmptyErrorMessage
      class="mt-2"
      :loading="loading"
      :empty="isEmpty"
      :empty-message="hideFollowings ? $t('followings.followingsHidden') : null"
      :empty-icon="'i-ri-eye-close-fill'"
      :error="isError"
      :fetch="fetchTop"
      :background-color="'theme-color-secondary'"
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
import UserList from '~/components/users/UserList.vue'

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
  },
  hide: {
    type: Boolean,
    default: true
  },
  userHideFollowingListStatus: {
    type: Boolean,
    default: false
  }
})

const hideFollowingListToggle = ref(false)
const hideFollowings = ref(false)

onMounted (() => {
  hideFollowingListToggle.value = props.userHideFollowingListStatus
  
  if (!props.hide) {
    fetch(false)
  } else {
    loading.value = false
    
    isEmpty.value = true
    hideFollowings.value = true
  }
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

/**
 * PRO feature
 * toggle to hide following list from being seen by the public
 */
const toggleFollowingVisibility = async () => {
  if (!auth.i502p00r0) {
    return null
  }

  const [success, error] = await userApi.toggleFollowingPrivacy()

  if (success) {
    hideFollowingListToggle.value = !hideFollowingListToggle.value
  } else {
    // todo: handle error
    console.error("ERROR: can't toggle following visibility setting.");
  }
}
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

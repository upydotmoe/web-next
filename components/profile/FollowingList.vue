<template>
  <div>
    <div class="flex flex-row justify-between">
      <div class="text-lg font-bold">{{ $t('followings.followings') }}</div>

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

    <UserList
      class="mt-4"
      :users="followingList"
      :column-type="3"
    />

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

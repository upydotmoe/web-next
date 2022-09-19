<template>
  <div>
    <div class="text-lg font-bold">{{ $t('followings') }}</div>

    <div class="grid grid-cols-1 gap-4 mt-4 w-full md:grid-cols-2 lg:grid-cols-3">
      <nuxt-link
        v-for="(following, index) in followingList"
        :key="following.id"
        :to="'/profile/' + following.username"
        class="flex object-cover flex-row rounded-md shadow-lg cursor-pointer theme-color-secondary hover:shadow-xl"
        :style="following.cover_bucket && following.cover_filename ? 'background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('+avatarCoverUrl(following.cover_bucket, following.cover_filename)+');background-size:cover;' : 'background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('+abstractImgUrl+');background-size:cover;'"
      >
        <div class="flex flex-row w-full">
          <img :src="avatarCoverUrl(following.avatar_bucket, following.avatar_filename)" class="avatar" @error="imageLoadError">

          <div class="flex flex-col justify-between p-3 w-full text-white">
            <div class="flex flex-col">
              <span class="font-bold">{{ following.name }}</span>
              <span class="text-xxs">{{ following.pen_name }}</span>
            </div>

            <div class="flex flex-row w-full">
              <!-- user follow status, not appeared if the user is current login user -->
              <div v-if="auth.loggedIn && following.id !== auth.user.id" class="flex flex-row">
                <div 
                  v-show="!following.is_following"
                  class="flex flex-row"
                  @click.prevent="followUser(index, following.id)"
                >
                  <Icon :name="'i-fluent-person-32-regular-add'" class="text-gray-300 hover:text-white" />
                </div>
                
                <div 
                  v-show="following.is_following"
                  class="flex flex-row" 
                  @mouseover="showUnfollow = following.id" 
                  @mouseout="showUnfollow = 0"
                  @click.prevent="unfollowUser(index, following.id)"
                >
                  <Icon v-show="showUnfollow !== following.id" :name="'i-fluent-person-32-regular'" class="text-green-400" />
                  <Icon v-show="showUnfollow && showUnfollow === following.id" :name="'i-fluent-person-32-regular-remove'" class="text-red-400 hover:text-red-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </nuxt-link>
    </div>

    <div v-show="showLoadMore" class="primary-button mt-4" @click="fetch()">
      {{ $t('loadMore') }}
    </div>

    <!-- On loading, empty or error occured -->
    <ErrorMessages
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
import ErrorMessages from '~/components/globals/ErrorMessages.vue'

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
  fetch()
})

const fetchTop = async () => {
  followingList.value = []
  pagination.value.page = 0
  await fetch()
}

const followingList = ref([])
const loading = ref(false)
const pagination = ref({
  page: 0,
  perPage: 12
})
const isError = ref(false)
const isEmpty = ref(false)
const showLoadMore = ref(false)
const fetch = async () => {
  resetErrorMessages()
  loading.value = true

  const [data, error] = await userApi.getFollowingList({
    userId: props.userId,
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

const resetErrorMessages = () => {
  isEmpty.value = false
  isError.value = false
}

const showUnfollow = ref(0)
</script>

<style lang="scss" scoped>
@import '~/assets/css/tailwind.scss';

.avatar {
  @apply object-cover h-24 rounded-md;
  aspect-ratio: 1/1;
}
</style>

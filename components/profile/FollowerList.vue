<template>
  <div>
    <div class="text-lg font-bold">{{ $t('followers') }}</div>

    <div class="grid grid-cols-1 gap-4 mt-4 w-full md:grid-cols-2 lg:grid-cols-3">
      <nuxt-link
        v-for="(follower, index) in followerList"
        :key="follower.id"
        :to="'/profile/' + follower.username"
        class="flex object-cover flex-row rounded-md shadow-lg cursor-pointer theme-color-secondary hover:shadow-xl"
        :style="follower.cover_bucket && follower.cover_filename ? 'background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('+avatarCoverUrl(follower.cover_bucket, follower.cover_filename)+');background-size:cover;' : 'background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('+abstractImgUrl+');background-size:cover;'"
      >
        <div class="flex flex-row w-full">
          <img :src="avatarCoverUrl(follower.avatar_bucket, follower.avatar_filename)" class="avatar" @error="imageLoadError">

          <div class="flex flex-col justify-between p-3 w-full text-white">
            <div class="flex flex-col">
              <span class="font-bold">{{ follower.name }}</span>
              <span class="text-xxs">{{ follower.pen_name }}</span>
            </div>

            <div class="flex flex-row w-full">
              <!-- user follow status, not appeared if the user is current login user -->
              <div v-if="auth.loggedIn && follower.id !== auth.user.id" class="flex flex-row">
                <div 
                  v-show="!follower.is_following"
                  class="flex flex-row"
                  @click.prevent="followUser(index, follower.id)"
                >
                  <Icon :name="'i-ri-user-add-fill'" class="text-gray-300 hover:text-white" />
                </div>
                
                <div 
                  v-show="follower.is_following"
                  class="flex flex-row" 
                  @mouseover="showUnfollow = follower.id" 
                  @mouseout="showUnfollow = 0"
                  @click.prevent="unfollowUser(index, follower.id)"
                >
                  <Icon v-show="showUnfollow !== follower.id" :name="'i-ri-user-follow-fill'" class="text-green-400" />
                  <Icon v-show="showUnfollow && showUnfollow === follower.id" :name="'i-ri-user-unfollow-fill'" class="text-red-400 hover:text-red-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </nuxt-link>
    </div>

    <div v-show="showLoadMore" class="mt-4 primary-button" @click="fetch()">
      {{ $t('loadMore') }}
    </div>

    <!-- On loading, empty or error occured -->
    <ErrorMessages
      :loading="loading"
      :empty="isEmpty"
      :error="isError"
      :fetch="fetch"
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

const followerList = ref([])
const loading = ref(true)
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

  const [data, error] = await userApi.getFollowerList({
    userId: props.userId,
    pagination: {
      page: pagination.value.page,
      perPage: pagination.value.perPage
    }
  })

  if (error) {
    isError.value = true
  } else {
    if (!data.followers.length) {
      isEmpty.value = true
    }
    
    data.followers.forEach((follower) => {
      followerList.value.push(follower)
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

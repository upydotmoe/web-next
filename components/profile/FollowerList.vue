<template>
  <div>
    <div class="text-lg font-bold">{{ $t('followers') }}</div>

    <UserList
      class="mt-4"
      :users="followerList"
      :column-type="3"
    />

    <div v-show="showLoadMore" class="mt-4 primary-button" @click="fetch()">
      {{ $t('loadMore') }}
    </div>

    <!-- On loading, empty or error occured -->
    <LoadingEmptyErrorMessage
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
  resetLoadingEmptyErrorMessage()
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

const resetLoadingEmptyErrorMessage = () => {
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

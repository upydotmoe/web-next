<template>
  <div>
    <div class="flex flex-row justify-between">
      <div class="section-title">
        {{ $t('followers.followers') }}
      </div>

      <!-- options -->
      <div>
        <!-- hide follower list toggle -->
        <label 
          v-if="auth.loggedIn && auth.i502p00r0 && auth.user.id === userId"
          for="hide-follower-toggle"
          class="inline-flex relative flex-row justify-center items-center cursor-pointer"
          @click.prevent="toggleFollowerVisibility()"
        >
          <input 
            id="hide-follower-toggle" 
            type="checkbox" 
            class="sr-only peer" 
            :checked="hideFollowerListToggle"
            :disabled="!auth.i502p00r0"
          >
          <div 
            :class="[
              'w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[\'\'] after:absolute after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600',
              { 'unclickable': !auth.i502p00r0 },
              auth.i502p00r0 ? ' after:top-[2px]' : ' after:top-[4px]'
            ]"
          />
          <span class="ml-2">{{ $t('followers.hideMyFollowers') }}</span>
          
          <ProBadge
            v-if="!auth.i502p00r0"
            class="ml-1"
          />
        </label>
      </div>
    </div>

    <div v-if="!hide && !loading && !isEmpty && !isError">
      <UserList
        class="mt-4"
        :users="followerList"
        :column-type="3"
      />

      <div
        v-show="showLoadMore"
        class="mt-4 primary-button"
        @click="fetch()"
      >
        {{ $t('loadMore') }}
      </div>
    </div>

    <!-- On loading, empty or error-->
    <LoadingEmptyErrorMessage
      class="mt-2"
      :loading="loading"
      :empty="isEmpty"
      :empty-message="hideFollowers ? $t('followers.followersHidden') : null"
      :empty-icon="'i-ri-eye-close-fill'"
      :error="isError"
      :fetch="fetch"
      :background-color="'theme-color-secondary'"
    />
  </div>
</template>

<script setup>
// stores
import useAuthStore from '~/stores/auth.store'

// composables
import useUser from '~/composables/users/useUser'

// components
import LoadingEmptyErrorMessage from '~/components/globals/LoadingEmptyErrorMessage.vue'
import UserList from '~/components/users/UserList.vue'
import ProBadge from '~/components/globals/ProBadge.vue'

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
  userHideFollowerListStatus: {
    type: Boolean,
    default: false
  }
})

const hideFollowers = ref(false)
const hideFollowerListToggle = ref(false)

onMounted (() => {
  hideFollowerListToggle.value = props.userHideFollowerListStatus

  if (!props.hide) {
    fetch()
  } else {
    loading.value = false
    
    isEmpty.value = true
    hideFollowers.value = true
  }
})

const followerList = ref([])
const loading = ref(true)
const pagination = ref({
  page: 0,
  perPage: 12
})
const isError = ref(false)
const isEmpty = ref(false)
const customEmptyMessage = ref('')
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

/**
 * PRO feature
 * toggle to hide follower list from being seen by the public
 */
const toggleFollowerVisibility = async () => {
  if (!auth.i502p00r0) {
    return null
  }

  const [success, error] = await userApi.toggleFollowerPrivacy()

  if (success) {
    hideFollowerListToggle.value = !hideFollowerListToggle.value
  } else {
    // todo: handle error
    console.error("ERROR: can't toggle follower visibility setting.");
  }
}
</script>

<style lang="scss" scoped>
// @import '~/assets/css/tailwind.scss';

.avatar {
  @apply object-cover h-24 rounded-md;
  aspect-ratio: 1/1;
}
</style>

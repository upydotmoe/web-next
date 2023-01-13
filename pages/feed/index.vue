<template>
  <Layout
    :with-footer="true"
    :hide-side="isMobileDevice()"
    :no-right-side="isMobile()"
    :is-no-data="isNoData"
  >
    <!-- left side area -->
    <template #left-side>
      <FeedLeftSide
        v-if="feedLength"
        :current-view="fetchMode"
        @refetch="changeFetchMode"
      />
    </template>

    <!-- middle area: feeds -->
    <section
      id="middle"
    >
      <!-- welcome message, show this only if users haven't followed any users yet -->
      <WelcomeSection
        v-if="isFollowingSomeone ? showSuggestedUsers : !isFollowingSomeone"
        :suggested-users-to-follow="suggestedUsersToFollow"
      />

      <!-- feeds, show this only if user has followed other users -->
      <FeedSection
        v-show="isFollowingSomeone"
        ref="feedRef"
        :fetch-mode="fetchMode"
        @update-feed-length="updateFeedLength"
        @update-show-suggested-users="updateShowSuggestedUsers"
        @no-data="showNoData"
      />
    </section>

    <template #right-side>
      <div />

      <!-- suggested users -->
      <div v-if="feedLength && suggestedUsersToFollow.length">
        <div class="title">
          {{ $t('feeds.suggestedUsers') }}
        </div>

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
// stores
import useAuthStore from '@/stores/auth.store'

// composables
import useUser from '~/composables/users/useUser'

// components
import Layout from '~/components/layouts/Layout.vue'
import WelcomeSection from '~/components/feeds/index/WelcomeSection.vue'
import FeedSection from '~/components/feeds/index/FeedSection.vue'
import UserList from '~/components/users/UserList.vue'
import FeedLeftSide from '~/components/feeds/FeedLeftSide.vue'

// stores
const auth = useAuthStore()

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const userApi = useUser(oApiConfiguration, fetchOptions())

const router = useRouter()

onMounted(async () => {
  if (auth.loggedIn) {
    await getSuggestedUsersToFollow()
    await countFollowing()
  } else {
    router.push('/explore')
  }
})

const isFollowingSomeone = ref(false)
const countFollowing = async () => {
  // reset current state
  isFollowingSomeone.value = false

  const [totalFollowing, error] = await userApi.countFollowings(auth.user.id)

  if (error) {
    isFollowingSomeone.value = false
  } else {
    isFollowingSomeone.value = totalFollowing > 0
  }
}

const showSuggestedUsers = ref(false)
const suggestedUsersToFollow = ref([])
const getSuggestedUsersToFollow = async () => {
  const [suggestions, error] = await userApi.getSuggestedUsersToFollow()

  if (suggestions.length) {
    suggestedUsersToFollow.value = suggestions
  }
}
const updateShowSuggestedUsers = (value) => {
  showSuggestedUsers.value = value
}

const fetchMode = ref('feed')
const feedRef = ref(null)
const changeFetchMode = (mode) => {
  fetchMode.value = mode
  feedRef.value.refetch()
  isNoData.value = false
}

const feedLength = ref(0)
const updateFeedLength = (foundFeedCount) => {
  console.log('feed count:', foundFeedCount)
  feedLength.value = foundFeedCount
}

// if user already following someone but the users they follow doesn't uploaded any artwork or posted text post yet,
// then, keep showing the follow suggestion section
watch (() => feedLength.value, () => {
  if (!feedLength.value) {
    showSuggestedUsers.value = true
  }
})

const isNoData = ref(false)
const showNoData = () => {
  console.log('fired');
  isNoData.value = true
}
</script>

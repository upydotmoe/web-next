<template>
  <div>
    <div class="flex flex-row justify-between w-full md:p-2">
      <!-- notification content -->
      <div class="flex flex-col md:mr-2 md:w-2/6">
        <button
          class="flex flex-row justify-between text-left rounded-md category-button-secondary"
          :class="{ 'button-color text-white': currentSection === 'likes' }" 
          @click.prevent="currentSection = 'likes'"
        >
          <div class="flex flex-row justify-start">
            <Icon v-show="currentSection === 'likes'" :name="'heart-outline'" class="text-white md:mr-2" />
            <Icon v-show="currentSection !== 'likes'" :name="'heart-outline'" class="md:mr-2" />

            <div class="hidden-md-flex">{{ $t('notifications.likes') }}</div>
          </div>

          <div 
            v-show="artworkLikeNotiNotificationTotal > 0" 
            class="font-bold counter hidden-md-flex" 
            :class="currentSection === 'likes' ? 'text-white' : 'text-red-400'"
          >
            {{ artworkLikeNotiNotificationTotal > 99 ? '99+' : artworkLikeNotiNotificationTotal }}
          </div>
        </button>
        <button
          class="flex flex-row justify-between text-left rounded-md category-button-secondary"
          :class="{ 'button-color text-white': currentSection === 'comments' }" 
          @click.prevent="currentSection = 'comments'"
        >
          <div class="flex flex-row justify-start">
            <Icon v-show="currentSection === 'comments'" :name="'chatbubble-outline'" class="text-white md:mr-2" />
            <Icon v-show="currentSection !== 'comments'" :name="'chatbubble-outline'" class="md:mr-2" />

            <div class="hidden-md-flex">{{ $t('notifications.comments') }}</div>
          </div>

          <div 
            v-show="artworkCommentsNotificationTotal > 0" 
            class="font-bold counter hidden-md-flex" 
            :class="currentSection === 'comments' ? 'text-white' : 'text-red-400'"
          >
            {{ artworkCommentsNotificationTotal > 99 ? '99+' : artworkCommentsNotificationTotal }}
          </div>
        </button>
        <button
          class="flex flex-row justify-between text-left rounded-md category-button-secondary"
          :class="{ 'button-color text-white': currentSection === 'follows' }" 
          @click.prevent="currentSection = 'follows'"
        >
          <div class="flex flex-row justify-start">
            <Icon v-show="currentSection === 'follows'" :name="'person-add-outline'" class="text-white md:mr-2" />
            <Icon v-show="currentSection !== 'follows'" :name="'person-add-outline'" class="md:mr-2" />

            <div class="hidden-md-flex">{{ $t('notifications.follows') }}</div>
          </div>

          <div 
            v-show="userFollowNotifNotificationTotal > 0" 
            class="font-bold counter hidden-md-flex" 
            :class="currentSection === 'follows' ? 'text-white' : 'text-red-400'"
          >
            {{ userFollowNotifNotificationTotal > 99 ? '99+' : userFollowNotifNotificationTotal }}
          </div>
        </button>
      
        <button
          class="flex flex-row justify-between text-left rounded-md category-button-secondary"
          :class="{ 'button-color text-white': currentSection === 'feeds' }" 
          @click.prevent="currentSection = 'feeds'"
        >
          <div class="flex flex-row justify-start">
            <Icon v-show="currentSection === 'feeds'" :name="'newspaper-outline'" class="text-white md:mr-2" />
            <Icon v-show="currentSection !== 'feeds'" :name="'newspaper-outline'" class="md:mr-2" />

            <div class="hidden-md-flex">{{ $t('notifications.feeds') }}</div>
          </div>

          <div 
            v-show="feedNotificationTotal > 0" 
            class="font-bold counter hidden-md-flex" 
            :class="currentSection === 'feeds' ? 'text-white' : 'text-red-400'"
          >
            {{ feedNotificationTotal > 99 ? '99+' : feedNotificationTotal }}
          </div>
        </button>
      </div>

      <!-- notification content -->
      <div class="w-full">
        <!-- artworks -->
        <Likes v-show="currentSection == 'likes' || currentSection == 'all'" />
        <CommentsAndReplies v-show="currentSection == 'comments' || currentSection == 'all'" />
        <Follows v-show="currentSection == 'follows' || currentSection == 'all'" />

        <!-- feeds -->
        <Feeds v-show="currentSection == 'feeds' || currentSection == 'all'" />
      </div>
    </div>
  </div>
</template>

<script setup>
// components
import Likes from './Likes.vue'
import CommentsAndReplies from './comments/CommentsAndReplies.vue'
import Follows from './Follows.vue'
import Feeds from './Feeds.vue'
import Icon from '~/components/globals/Icon.vue'

// composables
import useApiFetch from '~/composables/useApiFetch'
import useNotification from '~/composables/useNotification'

const { oApiConfiguration, fetchOptions } = useApiFetch()
const notificationApi = useNotification(oApiConfiguration, fetchOptions())

const { $auth, redirect, app } = useContext()

const currentSection = ref('all')
onMounted(async () => {
  if (!$auth.loggedIn) {
    redirect(app.localePath('/'))
  }

  setTimeout(() => {
    currentSection.value = 'likes'
  }, 500)

  await countArtworkLikeNotifications()
  await countArtworkCommentsNotifications()
  await countUserFollowNotifications()
  await countFeedNotifications()
})

const artworkLikeNotiNotificationTotal = ref(0)
const countArtworkLikeNotifications = async () => {
  const [data, error] = await notificationApi.countArtworkLikeNotifications()

  if (error) {
    // todo: handle error
  } else {
    artworkLikeNotiNotificationTotal.value = data.count
  }
}

const artworkCommentsNotificationTotal = ref(0)
const countArtworkCommentsNotifications = async () => {
  const [data, error] = await notificationApi.countArtworkCommentRelatedNotifications()

  if (error) {
    // todo: handle error
  } else {
    artworkCommentsNotificationTotal.value = data.count
  }
}

const userFollowNotifNotificationTotal = ref(0)
const countUserFollowNotifications = async () => {
  const [data, error] = await notificationApi.countUserFollowNotifications()

  if (error) {
    // todo: handle error
  } else {
    userFollowNotifNotificationTotal.value = data.count
  }
}

const feedNotificationTotal = ref(0)
const countFeedNotifications = async () => {
  const [data, error] = await notificationApi.countFeedNotifications()

  if (error) {
    // todo: handle error
  } else {
    feedNotificationTotal.value = data.count
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/navbar.scss';

.category-button-secondary:hover .counter {
  @apply text-white;
}
</style>

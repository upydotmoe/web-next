<template>
  <div class="flex flex-col w-full">
    <div class="mb-3 w-full text-right">
      <button 
        class="py-1 px-2 mr-1 rounded theme-color-secondary hover:button-color hover:text-white" 
        @click.prevent="markAllAsRead()"
      >
        Mark all as read
      </button>

      <button 
        class="py-1 px-2 rounded theme-color-secondary hover:button-color hover:text-white" 
        @click.prevent="clearNotifs()"
      >
        Clear
      </button>
    </div>

    <div class="grid overflow-auto gap-2 max-h-96">
      <div 
        v-for="(notification, index) in notifications"
        :key="notification.id"
        class="flex flex-row gap-2 p-2 mr-2 text-left rounded-md fit- hover:shadow-md hover:button-color hover:text-white"
        :class="{ 'theme-color-secondary': !notification.is_read }"
        @click="openNotification(notification, index)"
      >
        <!-- artwork mini thumbnail -->
        <img
          :src="artworkThumb(notification.users[0].avatar_bucket, notification.users[0].avatar_filename, 'thumbnail')"
          class="object-cover w-12 h-12 rounded unselectable"
          @error="imageLoadError"
        >

        <!-- description -->
        <div>
          <span v-for="(user, index) in notification.users" :key="user.id">
            <span 
              class="font-bold hover:underline"
              @click.prevent="openUserProfile(user.username)" 
            >
              {{ user.name }}
            </span>{{ (index+1) != notification.users.length ? ', ' : '' }}
          </span>

          {{ notification.rest_total > 0 && notification.type === 'like' ? 'and' : '' }}
          <span :class="{ 'font-bold': notification.rest_total > 0 }">
            {{ notification.rest_total > 0 && notification.type === 'like' ? notification.rest_total+' others' : '' }}
          </span> {{ notification.type === 'like' ? 'liked your post' : 'commented on your post' }}

          <div v-if="notification.type === 'comment'" class="mt-1 italic text-xxs">
            {{ notification.comment.length > 45 ? `${notification.comment.slice(0, 45)}...` : notification.comment }}
          </div>
        </div>
      </div>

      <InfiniteLoading @infinite="fetch">
        <span slot="no-more">
          {{ $t('youHaveReachedTheEnd') }}
        </span>
        <span slot="no-results">
          <div class="mt-10">
            <b>(ㆆ_ㆆ)</b> {{ $t('nothingToShow') }}
          </div>
        </span>
      </InfiniteLoading>
    </div>
  </div>
</template>

<script setup>
import { VueEternalLoading as InfiniteLoading } from '@ts-pro/vue-eternal-loading'

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const notificationApi = useNotification(oApiConfiguration, fetchOptions())

const { $router } = useNuxtApp()

const notifications = ref([])
const options = ref({
  showLimit: 1,
  pagination: {
    page: 0,
    perPage: 10
  }
})
const fetch = async ($state) => {
  try {
    const [data, error] = await notificationApi.getFeedNotifications({
      showLimit: options.value.showLimit,
      pagination: {
        page: options.value.pagination.page,
        perPage: options.value.pagination.perPage
      }
    })

    if (data.notifications.length) {
      options.value.pagination.page += 1

      data.notifications.forEach((notification) => {
        notifications.value.push(notification)
      })

      $state.loaded()
    } else {
      $state.complete()
    }
  } catch (error) {
    // todo: handle error
  }
}

const openNotification = async (notification, index) => {
  // mark clicked notification as read
  const [success, error] = await notificationApi.markFeedNotificationAsRead({
    type: notification.type,
    feedId: notification.id
  })

  if (success) {
    notifications.value[index].is_read = 1
  }

  $router.push('/feed/' + notification.id)
}

const markAllAsRead = async () => {
  const [success, error] = await notificationApi.markAllFeedNotificationAsRead()

  if (success) {
    notifications.value.forEach((notification) => {
      notification.is_read = 1
    })
  }
}

const openUserProfile = (username) => {
  $router.push('/profile/u/' + username)
}

const clearNotifs = async () => {
  const [success, error] = await notificationApi.clearAllFeedNotifications()

  if (success) {
    notifications.value = []
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/navbar.scss';
</style>

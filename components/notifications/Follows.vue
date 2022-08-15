<template>
  <div class="flex flex-col w-full">
    <div class="mb-3 w-full text-right">
      <button 
        class="py-1 px-2 rounded theme-color-secondary hover:button-color hover:text-white mr-1" 
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
        class="flex flex-row gap-2 p-2 mr-2 text-left rounded-md hover:shadow-md hover:button-color hover:text-white"
        :class="{ 'theme-color-secondary': !notification.is_read }"
        @click="openNotification(notification, index)"
      >
        <!-- follower avatar -->
        <img 
          :src="avatarCoverUrl(notification.follower_detail.avatar_bucket, notification.follower_detail.avatar_filename)"
          class="object-cover w-12 h-12 rounded unselectable"
          @error="imageLoadError"
        >

        <!-- description -->
        <div>
          <span 
            class="font-bold hover:underline"
            @click.prevent="openUserProfile(notification.follower_detail.username)" 
          >
            {{ notification.follower_detail.name }}
          </span> started following you
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
  pagination: {
    page: 0,
    perPage: 10
  }
})
const fetch = async ($state) => {
  try {
    const [data, error] = await notificationApi.getFollowNotifications({
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
  const [success, error] = await notificationApi.markUserFollowAsRead({
    followerId: notification.follower_detail.id
  })

  if (success) {
    notifications.value[index].is_read = 1
  }

  openUserProfile(notification.follower_detail.username)
}

const markAllAsRead = async () => {
  const [success, error] = await notificationApi.markAllUserFollowAsRead()

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
  const [success, error] = await notificationApi.clearUserFollowNotifications()

  if (success) {
    notifications.value = []
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/navbar.scss';
</style>
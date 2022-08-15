<template>
  <div>
    <div class="hidden" @click="markAllAsRead()" />
    <div class="hidden" @click="clear()" />

    <!-- notification list -->
    <div class="grid overflow-auto gap-2 max-h-96">
      <div 
        v-for="(notification, index) in notifications"
        :key="notification.id"
        class="flex flex-row gap-2 p-2 mr-2 text-left align-middle rounded-md hover:shadow-md hover:button-color hover:text-white"
        :class="{ 'theme-color-secondary': !notification.is_read }"
        @click="openNotification(notification, index)"
      >
        <!-- artwork mini thumbnail -->
        <img
          :src="artworkThumb(notification.artworks.artwork_assets[0].bucket, notification.artworks.artwork_assets[0].filename, 'thumbnail')"
          class="object-cover w-12 h-12 rounded unselectable"
          @error="imageLoadError"
        >

        <!-- description -->
        <div class="flex flex-col">
          <div class="mb-1">
            <span 
              class="font-bold hover:underline"
              @click.prevent="openUserProfile(notification.users.username)" 
            >
              {{ notification.users.name }}
            </span> commented on your artwork
          </div>
          <div class="text-xxs italic">
            {{ notification.comment.length > 45 ? `${notification.comment.slice(0, 45)}...` : notification.comment }}
          </div>
        </div>
      </div>

      <client-only>
        <InfiniteLoading :identifier="'comment-infinite-notifs'" @infinite="fetchCommentNotifs">
          <span slot="no-more">
            {{ $t('youHaveReachedTheEnd') }}
          </span>
          <span slot="no-results">
            <div class="mt-4">
              <b>(ㆆ_ㆆ)</b> {{ $t('nothingToShow') }}
            </div>
          </span>
        </InfiniteLoading>
      </client-only>
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
const fetchCommentNotifs = async ($state) => {
  try {
    const [data, error] = await notificationApi.getArtworkCommentNotifications({
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

const markAllAsRead = () => {
  notifications.value.forEach((notification) => {
    notification.is_read = 1
  })
}

const clear = () => {
  notifications.value = []
}

const openNotification = async (notification, index) => {
  // mark clicked notification as read
  const [success, error] = await notificationApi.markCommentNotificationAsRead({
    workId: notification.work_id,
    commentId: notification.id
  })

  if (success) {
    notifications.value[index].is_read = 1
  }

  $router.push('/work/' + notification.work_id)
}

const openUserProfile = (username) => {
  redirect('/profile/u/' + username)
}
</script>
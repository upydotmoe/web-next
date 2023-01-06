<template>
  <div 
    :class="[
      'flex flex-col w-full',
      route.name == 'notifications' && !props.isNavbar ? (isMobile() ? 'max-h-screen' : 'h-full') : 'h-auto'
    ]"
  >
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

    <div 
      :class="[
        'grid gap-2 overflow-auto',
        route.name == 'notifications' && !props.isNavbar ? (isMobile() ? 'max-h-screen overflow-auto' : 'h-full') : 'max-h-96 overflow-auto'
      ]"
    >
      <div 
        v-for="(notification, index) in notifications"
        :key="notification.id"
        class="flex flex-row gap-2 p-2 mr-2 text-left rounded-md cursor-pointer fit- hover:shadow-md hover:button-color hover:text-white"
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
          <span
            v-for="(user, index) in notification.users"
            :key="user.id"
          >
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

          <div
            v-if="notification.type === 'comment'"
            class="mt-1 italic text-xxs"
          >
            {{ notification.comment.length > 45 ? `${notification.comment.slice(0, 45)}...` : notification.comment }}
          </div>
        </div>
      </div>

      <InfiniteLoading :load="fetch">
        <template #loading>
          <div class="mx-auto text-center">
            <Icon
              :name="'i-line-md-loading-twotone-loop'"
              class="text-3xl"
            />
          </div>
        </template>

        <template #no-results>
          <div class="mx-auto text-center">
            <b>(ㆆ_ㆆ)</b> {{ $t('nothingToShow') }}
          </div>
        </template>

        <template #no-more>
          <p />
        </template>
      </InfiniteLoading>
    </div>
  </div>
</template>

<script setup>
import { VueEternalLoading as InfiniteLoading } from '@ts-pro/vue-eternal-loading'

// components
import Icon from '~/components/globals/Icon.vue'

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const notificationApi = useNotification(oApiConfiguration, fetchOptions())

const props = defineProps({
  isNavbar: {
    type: Boolean,
    default: false
  }
})

const route = useRoute()
const { $router } = useNuxtApp()

const notifications = ref([])
const options = ref({
  showLimit: 1,
  pagination: {
    page: 0,
    perPage: 10
  }
})
const fetch = async ({ loaded }) => {
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
  }

  loaded(data.notifications.length, options.value.pagination.perPage)
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
  $router.push('/u/' + username)
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

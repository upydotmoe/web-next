<template>
  <!-- notification list -->
  <div 
    :class="[
      'grid gap-2 overflow-auto',
      route.name == 'notifications' && !props.isNavbar ? (isMobile() ? 'max-h-screen overflow-auto' : 'h-full') : 'max-h-96 overflow-auto'
    ]"
  >
    <div 
      v-for="(notification, index) in notifications"
      :key="notification.id"
      class="flex flex-row gap-2 p-2 mr-2 text-left align-middle rounded-md cursor-pointer hover:shadow-md hover:button-color hover:text-white"
      :class="{ 'theme-color-secondary': !notification.is_read }"
      @click="openNotification(notification, index)"
    >
      <!-- artwork mini thumbnail -->
      <img
        :src="artworkThumb(notification.artworks.assets.bucket, notification.artworks.assets.filename, 'thumbnail')"
        class="object-cover w-12 h-12 rounded unselectable"
        @error="imageLoadError"
      >

      <!-- description -->
      <div>
        <span
          v-for="(user, index) in notification.user_liked"
          :key="user.id"
        >
          <span 
            class="font-bold hover:underline"
            @click.prevent="openUserProfile(user.username)" 
          >
            {{ user.name }}
          </span>{{ (index+1) != notification.user_liked.length ? ', ' : '' }}
        </span>

        {{ notification.rest_total_liked > 0 ? 'and' : '' }}
        <span :class="{ 'font-bold': notification.rest_total_liked > 0 }">
          {{ notification.rest_total_liked > 0 ? notification.rest_total_liked+' others' : '' }}
        </span> liked your comment
      </div>
    </div>

    <InfiniteLoading
      v-model:is-initial="fetchInitial"
      :load="fetch"
    >
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

const fetchInitial = ref(false)
const init = ref(false)
const fire = () => {
  fetchInitial.value = true
  init.value = true
}

const notifications = ref([])
const options = ref({
  showLimit: 1,
  pagination: {
    page: 0,
    perPage: 10
  }
})
const fetch = async ({ loaded }) => {
  if (init.value) {
    const [data, error] = await notificationApi.getArtworkCommentLikeNotifications({
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
  const [success, error] = await notificationApi.markArtworkCommentLikeNotificationAsRead({
    commentId: notification.comment_id
  })

  if (success) {
    notifications.value[index].is_read = 1
  }

  $router.push('/a/'+notification.artworks.id)
}

const openUserProfile = (username) => {
  $router.push('/u/' + username)
}

defineExpose({
  fire,
  markAllAsRead,
  clear
})
</script>

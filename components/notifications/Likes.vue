<template>
  <div 
    :class="[
      'flex flex-col w-full',
      route.name == 'notifications' && !props.isNavbar ? (isMobile() ? 'max-h-screen' : 'h-full') : 'h-auto'
    ]"
  >
    <div class="flex flex-row justify-end mb-3 w-full text-right">
      <button 
        class="py-1 px-2 mr-1 rounded theme-color-secondary hover:button-color hover:text-white" 
        @click.prevent="markAllAsRead()"
      >
        {{ $t('notifications.markAllAsRead') }}
      </button>

      <button 
        class="inline-flex flex-row gap-1 py-1 px-2 rounded theme-color-secondary hover:button-color hover:text-white" 
        @click.prevent="clearNotifs()"
      >
        <Icon :name="'i-material-symbols-clear-all-rounded'" />
        {{ $t('notifications.clear') }}
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
          :src="artworkThumb(notification.bucket, notification.filename, 'thumbnail')"
          class="object-cover w-12 h-12 rounded unselectable"
          @error="imageLoadError"
        >

        <!-- description -->
        <div>
          <span
            v-for="(user, index) in notification.users_liked"
            :key="user.id"
          >
            <span 
              class="font-bold hover:underline"
              @click.prevent="openUserProfile(user.username)" 
            >
              {{ user.name }}
            </span>{{ (index+1) != notification.users_liked.length ? ', ' : '' }}
          </span>

          {{ notification.rest_total_liked > 0 ? 'and' : '' }}
          <span :class="{ 'font-bold': notification.rest_total_liked > 0 }">
            {{ notification.rest_total_liked > 0 ? notification.rest_total_liked+' others' : '' }}
          </span> liked your artwork
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
    const [data, error] = await notificationApi.getArtworkLikesNotification({
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

const openNotification = async (notification, index) => {
  // mark clicked notification as read
  const [success, error] = await notificationApi.markArtworkLikeAsRead({
    workId: notification.work_id
  })

  if (success) {
    notifications.value[index].is_read = 1
  }

  $router.push('/a/'+notification.work_id)
}

const markAllAsRead = async () => {
  const [success, error] = await notificationApi.markAllArtworkLikeAsRead()

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
  const [success, error] = await notificationApi.clearArtworkLikeNotifs()

  if (success) {
    notifications.value = []
  }
}

defineExpose({
  fire
})
</script>

<style lang="scss" scoped>
@import '~/assets/css/navbar.scss';
</style>

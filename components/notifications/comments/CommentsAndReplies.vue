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

    <!-- section categories -->
    <div class="flex flex-row">
      <button
        class="rounded-l-md section-button"
        :class="activeSection == 'comments' ? 'button-color text-white' : 'button-color-secondary'"
        @click="activeSection = 'comments'"
      >
        <Icon v-show="activeSection != 'comments'" :name="'chatbubble-outline'" class="mr-1 w-4 h-4" />
        <Icon v-show="activeSection == 'comments'" :name="'chatbubble'" class="mr-1 w-4 h-4" :icon-color="'text-white'" />
        
        <span>Comments</span>
      </button>
      <button
        class="section-button"
        :class="activeSection == 'likes' ? 'button-color text-white' : 'button-color-secondary'"
        @click="activeSection = 'likes'"
      >
        <Icon v-show="activeSection != 'likes'" :name="'heart-outline'" class="mr-1 w-4 h-4" />
        <Icon v-show="activeSection == 'likes'" :name="'heart'" class="mr-1 w-4 h-4" :icon-color="'text-white'" />
        
        <span>Likes</span>
      </button>
      <button
        class="rounded-r-md section-button"
        :class="activeSection == 'replies' ? 'button-color text-white' : 'button-color-secondary'"
        @click="activeSection = 'replies'"
      >
        <Icon v-show="activeSection != 'replies'" :name="'arrow-undo-outline'" class="mr-1 w-4 h-4" />
        <Icon v-show="activeSection == 'replies'" :name="'arrow-undo'" class="mr-1 w-4 h-4" :icon-color="'text-white'" />
        
        <span>Replies</span>
      </button>
    </div>

    <div class="custom-divider" />

    <!-- content -->
    <!-- comment notifications -->
    <Comments 
      v-show="activeSection == 'comments' || activeSection == 'all'"
      ref="commentNotifsRef"
    />

    <!-- comment like notifications -->
    <CommentLikes
      v-show="activeSection == 'likes' || activeSection == 'all'"
      ref="commentLikeNotifsRef"
    />

    <!-- comment reply notifications -->
    <CommentReplies 
      v-show="activeSection == 'replies' || activeSection == 'all'"
      ref="commentRepliesRef"
    />
  </div>
</template>

<script setup>
// components
import Comments from './Comments.vue'
import CommentLikes from './CommentLikes.vue'
import CommentReplies from './CommentReplies.vue'

import Icon from '~/components/globals/Icon.vue'

// composables
import useApiFetch from '~/composables/useApiFetch'
import useNotification from '~/composables/useNotification'

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const notificationApi = useNotification(oApiConfiguration, fetchOptions())

const activeSection = ref('all')

onMounted(() => {
  setTimeout(() => {
    activeSection.value = 'comments'
  }, 500)
})

const commentNotifsRef = ref(null)
const commentLikeNotifsRef = ref(null)
const commentRepliesRef = ref(null)
const markAllAsRead = async () => {
  const [success, error] = await notificationApi.markAllCommentAndReplyNotificationAsRead()

  if (success) {
    commentNotifsRef.value.markAllAsRead()
    commentLikeNotifsRef.value.markAllAsRead()
    commentRepliesRef.value.markAllAsRead()
  }
}

const clearNotifs = async () => {
  const [success, error] = await notificationApi.clearAllCommentAndReplyNotifications()

  if (success) {
    commentNotifsRef.value.clear()
    commentLikeNotifsRef.value.clear()
    commentRepliesRef.value.clear()
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/tailwind.scss';
@import '~/assets/css/navbar.scss';

.section-button {
  @apply flex flex-row p-2 w-full hover:button-color justify-center hover:text-white;

  &:hover ion-icon {
    @apply text-white;
  }
}
</style>

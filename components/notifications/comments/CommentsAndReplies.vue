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

    <!-- section categories -->
    <div class="flex flex-row">
      <button
        class="rounded-l-md section-button"
        :class="activeSection == 'comments' ? 'button-color text-white' : 'button-color-secondary'"
        @click="activeSection = 'comments'"
      >
        <Icon
          v-show="activeSection != 'comments'"
          :name="'i-mdi-comment-multiple-outline'"
          class="mr-1 w-4 h-4"
        />
        <Icon
          v-show="activeSection == 'comments'"
          :name="'i-mdi-comment-multiple-outline'"
          class="mr-1 w-4 h-4"
          :icon-color="'text-white'"
        />
        
        <span>Comments</span>
      </button>
      <button
        class="section-button"
        :class="activeSection == 'likes' ? 'button-color text-white' : 'button-color-secondary'"
        @click="activeSection = 'likes'"
      >
        <Icon
          v-show="activeSection != 'likes'"
          :name="'i-ri-heart-3-line'"
          class="mr-1 w-4 h-4"
        />
        <Icon
          v-show="activeSection == 'likes'"
          :name="'i-ion-heart'"
          class="mr-1 w-4 h-4"
          :icon-color="'text-white'"
        />
        
        <span>Likes</span>
      </button>
      <button
        class="rounded-r-md section-button"
        :class="activeSection == 'replies' ? 'button-color text-white' : 'button-color-secondary'"
        @click="activeSection = 'replies'"
      >
        <Icon
          v-show="activeSection != 'replies'"
          :name="'i-ion-arrow-undo-outline'"
          class="mr-1 w-4 h-4"
        />
        <Icon
          v-show="activeSection == 'replies'"
          :name="'i-ion-arrow-undo'"
          class="mr-1 w-4 h-4"
          :icon-color="'text-white'"
        />
        
        <span>Replies</span>
      </button>
    </div>

    <div class="custom-divider" />

    <!-- content -->
    <!-- comment notifications -->
    <Comments 
      v-show="activeSection == 'comments' || activeSection == 'all'"
      ref="commentNotifsRef"
      :is-navbar="props.isNavbar"
    />

    <!-- comment like notifications -->
    <CommentLikes
      v-show="activeSection == 'likes' || activeSection == 'all'"
      ref="commentLikeNotifsRef"
      :is-navbar="props.isNavbar"
    />

    <!-- comment reply notifications -->
    <CommentReplies 
      v-show="activeSection == 'replies' || activeSection == 'all'"
      ref="commentRepliesRef"
      :is-navbar="props.isNavbar"
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
const { oApiConfiguration, fetchOptions } = useApiFetch()
const notificationApi = useNotification(oApiConfiguration, fetchOptions())

const props = defineProps({
  isNavbar: {
    type: Boolean,
    default: false
  }
})

onMounted (() => {
  setTimeout(() => {
    activeSection.value = 'comments'
  }, 500)
})

const route = useRoute()

const activeSection = ref('all')

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
// @import '~/assets/css/tailwind.scss';
@import '~/assets/css/navbar.scss';

.section-button {
  @apply flex flex-row p-2 w-full hover:button-color justify-center hover:text-white;

  &:hover .icon {
    @apply text-white;
  }
}
</style>

<template>
  <div>
    <div class="notification">
      <!-- notification content -->
      <section
        id="notification-navigator-section"
        class="notification__navigator"
      >
        <!-- artwork likes -->
        <button
          :class="{ 'button-active': currentSection === NOTIFICATION_SECTIONS.LIKES }" 
          @click.prevent="changeCurrentSection(NOTIFICATION_SECTIONS.LIKES)"
        >
          <div class="icon-label">
            <Icon
              v-show="currentSection === NOTIFICATION_SECTIONS.LIKES"
              :name="'i-ri-heart-3-line'"
              class="text-white"
            />
            <Icon
              v-show="currentSection !== NOTIFICATION_SECTIONS.LIKES"
              :name="'i-ri-heart-3-line'"
            />

            <div class="label">
              {{ $t('notifications.likes') }}
            </div>
          </div>

          <div 
            v-show="artworkLikeNotiNotificationTotal > 0" 
            class="counter" 
            :class="currentSection === NOTIFICATION_SECTIONS.LIKES ? 'text-white' : 'text-red-400'"
          >
            {{ artworkLikeNotiNotificationTotal > 99 ? '99+' : artworkLikeNotiNotificationTotal }}
          </div>
        </button>

        <!-- comments and replies -->
        <button
          :class="{ 'button-active': currentSection === NOTIFICATION_SECTIONS.COMMENTS }" 
          @click.prevent="changeCurrentSection(NOTIFICATION_SECTIONS.COMMENTS)"
        >
          <div class="icon-label">
            <Icon
              v-show="currentSection === NOTIFICATION_SECTIONS.COMMENTS"
              :name="'i-mdi-comment-multiple-outline'"
              class="text-white"
            />
            <Icon
              v-show="currentSection !== NOTIFICATION_SECTIONS.COMMENTS"
              :name="'i-mdi-comment-multiple-outline'"
            />

            <div class="label">
              {{ $t('notifications.comments') }}
            </div>
          </div>

          <div 
            v-show="artworkCommentsNotificationTotal > 0" 
            class="counter" 
            :class="currentSection === NOTIFICATION_SECTIONS.COMMENTS ? 'text-white' : 'text-red-400'"
          >
            {{ artworkCommentsNotificationTotal > 99 ? '99+' : artworkCommentsNotificationTotal }}
          </div>
        </button>

        <!-- user follows -->
        <button
          :class="{ 'button-active': currentSection === NOTIFICATION_SECTIONS.FOLLOWS }" 
          @click.prevent="changeCurrentSection(NOTIFICATION_SECTIONS.FOLLOWS)"
        >
          <div class="icon-label">
            <Icon
              v-show="currentSection === NOTIFICATION_SECTIONS.FOLLOWS"
              :name="'i-fluent-people-checkmark-24-regular'"
              class="text-white"
            />
            <Icon
              v-show="currentSection !== NOTIFICATION_SECTIONS.FOLLOWS"
              :name="'i-fluent-people-checkmark-24-regular'"
            />

            <div class="label">
              {{ $t('notifications.follows') }}
            </div>
          </div>

          <div 
            v-show="userFollowNotifNotificationTotal > 0" 
            class="counter" 
            :class="currentSection === NOTIFICATION_SECTIONS.FOLLOWS ? 'text-white' : 'text-red-400'"
          >
            {{ userFollowNotifNotificationTotal > 99 ? '99+' : userFollowNotifNotificationTotal }}
          </div>
        </button>
      
        <!-- feeds -->
        <button
          :class="{ 'button-active': currentSection === NOTIFICATION_SECTIONS.FEEDS }" 
          @click.prevent="changeCurrentSection(NOTIFICATION_SECTIONS.FEEDS)"
        >
          <div class="icon-label">
            <Icon
              v-show="currentSection === NOTIFICATION_SECTIONS.FEEDS"
              :name="'i-ion-newspaper-outline'"
              class="text-white"
            />
            <Icon
              v-show="currentSection !== NOTIFICATION_SECTIONS.FEEDS"
              :name="'i-ion-newspaper-outline'"
            />

            <div class="label">
              {{ $t('notifications.feeds') }}
            </div>
          </div>

          <div 
            v-show="feedNotificationTotal > 0" 
            class="counter" 
            :class="currentSection === NOTIFICATION_SECTIONS.FEEDS ? 'text-white' : 'text-red-400'"
          >
            {{ feedNotificationTotal > 99 ? '99+' : feedNotificationTotal }}
          </div>
        </button>
      </section>

      <!-- notification content -->
      <section
        id="content-section"
        class="w-full"
      >
        <!-- artworks -->
        <Likes
          v-show="currentSection == NOTIFICATION_SECTIONS.LIKES"
          ref="likesRef"
          :is-navbar="props.isNavbar"
        />
        <CommentsAndReplies
          v-show="currentSection == NOTIFICATION_SECTIONS.COMMENTS"
          ref="commentRef"
          :is-navbar="props.isNavbar"
        />
        <Follows
          v-show="currentSection == NOTIFICATION_SECTIONS.FOLLOWS"
          ref="followRef"
          :is-navbar="props.isNavbar"
        />

        <!-- feeds -->
        <Feeds
          v-show="currentSection == NOTIFICATION_SECTIONS.FEEDS"
          ref="feedRef"
        />
      </section>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { TNotificationSections, NOTIFICATION_SECTIONS } from '~/utils/constants/notification'

// stores
import useAuthStore from '@/stores/auth.store'

// components
import Likes from './Likes.vue'
import CommentsAndReplies from './comments/CommentsAndReplies.vue'
import Follows from './Follows.vue'
import Feeds from './Feeds.vue'
import Icon from '~/components/globals/Icon.vue'

// stores
const auth = useAuthStore()

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const notificationApi = useNotification(oApiConfiguration, fetchOptions())

const props = defineProps({
  isNavbar: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()

const currentSection = ref<TNotificationSections>(NOTIFICATION_SECTIONS.ALL)
onMounted(async () => {
  if (!auth.loggedIn) {
    router.push('/')
  }

  await countArtworkLikeNotifications()
  await countArtworkCommentsNotifications()
  await countUserFollowNotifications()
  await countFeedNotifications()
})

// open notification, fire some function when notification icon clicked
const open = () => {
  if (currentSection.value === NOTIFICATION_SECTIONS.ALL) {
    changeCurrentSection(NOTIFICATION_SECTIONS.LIKES)
  }
}

const likesRef = ref()
const commentRef = ref()
const followRef = ref()
const feedRef = ref()
const changeCurrentSection = (section: TNotificationSections) => {
  currentSection.value = section
  if (section === NOTIFICATION_SECTIONS.LIKES) {
    likesRef.value.fire()
  } else if (section === NOTIFICATION_SECTIONS.COMMENTS) {
    commentRef.value.fire()
  } else if (section === NOTIFICATION_SECTIONS.FOLLOWS) {
    followRef.value.fire()
  } else if (section === NOTIFICATION_SECTIONS.FEEDS) {
    feedRef.value.fire()
  }
}

const artworkLikeNotiNotificationTotal = ref<number>(0)
const countArtworkLikeNotifications = async () => {
  const [data, error] = await notificationApi.countArtworkLikeNotifications()

  if (error) {
    // todo: handle error
  } else {
    artworkLikeNotiNotificationTotal.value = data.count
  }
}

const artworkCommentsNotificationTotal = ref<number>(0)
const countArtworkCommentsNotifications = async () => {
  const [data, error] = await notificationApi.countArtworkCommentRelatedNotifications()

  if (error) {
    // todo: handle error
  } else {
    artworkCommentsNotificationTotal.value = data.count
  }
}

const userFollowNotifNotificationTotal = ref<number>(0)
const countUserFollowNotifications = async () => {
  const [data, error] = await notificationApi.countUserFollowNotifications()

  if (error) {
    // todo: handle error
  } else {
    userFollowNotifNotificationTotal.value = data.count
  }
}

const feedNotificationTotal = ref<number>(0)
const countFeedNotifications = async () => {
  const [data, error] = await notificationApi.countFeedNotifications()

  if (error) {
    // todo: handle error
  } else {
    feedNotificationTotal.value = data.count
  }
}

defineExpose({
  open
})
</script>

<style lang="scss" scoped>
@import '~/assets/css/navbar.scss';

.notification {
  @apply flex flex-row justify-between w-full text-xs cursor-default md:p-2;

  &__navigator {
    @apply flex flex-col md:mr-2 md:w-6/12;

    button {
      @apply flex flex-row justify-between text-left rounded-md category-button-secondary;
      margin-bottom: 0px !important;
    }

    button:hover .counter {
      @apply text-white;
    }

    .button-active {
      @apply button-color text-white;
    }

    .icon-label {
      @apply flex flex-row justify-start;

      .icon {
        @apply md:mr-2;
      }

      .label {
        @apply hidden-md-flex;
      }

      .counter {
        @apply font-bold hidden-md-flex;
      }
    }
  }
}
</style>

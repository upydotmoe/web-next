<template>
  <div 
    class="work-container work-view"
    :class="!isModal ? 'w-full' : 'w-full md:w-9/12 lg:w-3/6 mx-auto md:p-6 p-4 theme-color'"
    style="height: fit-content !important"
  >
    <div class="hidden" @click="view()" />
  
    <div class="w-full">
      <div class="flex flex-row justify-between mb-2 w-full">
        <div v-if="feedDetail.users" class="user-info">
          <nuxt-link :to="'/profile/'+feedDetail.users.username">
            <img class="avatar" :src="avatarCoverUrl(feedDetail.users.avatar_bucket, feedDetail.users.avatar_filename)" @error="imageLoadError">
          </nuxt-link>
          <div class="name">
            <nuxt-link :to="'/profile/'+feedDetail.users.username" class="fullname">
              {{ feedDetail.users.name }}
            </nuxt-link>
            <br>
            <nuxt-link :to="'/profile/'+feedDetail.users.username" class="username">
              @{{ feedDetail.users.username }}
            </nuxt-link>

            <span class="mx-1">·</span>
                  
            <span class="text-xxs">
              {{ formatDate(feedDetail.created_at, true) }}
            </span>
          </div>
        </div>

        <div v-if="isModal" class="flex float-right flex-row gap-2 mb-4 cursor-pointer">
          <div class="modal-close" @click="closeModal(section + '-modal')">
            <Icon :name="'i-ion-close'" class="text-2xl" />
          </div>
        </div>
      </div>

      <div 
        v-if="feedDetail.text"
        class="mb-6"
        :class="feedDetail.text.length <= 300 ? 'text-lg' : ''"
      >
        {{ feedDetail.text }}
      </div>

      <!-- reactions -->
      <div v-if="feedDetail._count" class="flex flex-row justify-between">
        <div v-if="feedDetail._count.feed_comments">
          <b>{{ thousand(feedDetail._count.feed_comments) }}</b> {{ feedDetail._count.feed_comments > 1 ? $t('count.comments') : $t('count.comment') }}
        </div>
        <div v-if="!feedDetail._count.feed_comments" />

        <div v-if="auth.loggedIn">
          <!-- Like -->
          <div class="flex flex-row" @click="liked ? unlike() : like()">
            <Icon 
              v-show="liked"
              :id="'feedLikeButton'+feedDetail.id"
              :name="'i-ion-heart'" 
              class="mr-2 text-xl text-red-500 cursor-pointer hover:text-red-500"
            />
            <Icon 
              v-show="!liked"
              :name="'i-ion-heart-outline'" 
              class="mr-2 text-xl cursor-pointer hover:text-red-500"
            />

            <span>{{ thousand(feedDetail._count.feed_likes) }}</span>
          </div>
        </div>
      </div>

      <!-- comment section -->
      <!-- comment input -->
      <div class="mt-6 mb-2">
        <div v-if="auth.loggedIn" class="comment-box">
          <div class="flex flex-col">
            <div class="flex relative flex-col">
              <textarea
                v-model="commentInput"
                class="input form-input"
                :class="[{ 'cursor-not-allowed': submitCommentLoading }, { 'theme-color-secondary textarea': isModal }]"
                :readonly="submitCommentLoading"
                cols="20"
                :rows="commentInput != null && commentInput != '' ? '6' : '0'"
                :placeholder="$t('comments.inputPlaceholder')"
                :maxlength="commentMaxChar"
                data-gramm="false"
              />
              <span 
                v-show="commentInput != null && commentInput != ''" 
                class="absolute left-4 bottom-6 py-1 px-2 text-white rounded-md button-color"
              >
                {{ commentCharLeft }}
              </span>
              <span class="absolute right-2 bottom-5 py-1 px-2" @click.prevent="submitComment()">
                <Icon 
                  v-show="commentInput != null && commentInput != '' && !submitCommentLoading"
                  :name="'i-ion-prism'" 
                  class="text-xl transition-all duration-100 rotate-90 cursor-pointer text-colored"
                />
                <Spinner v-show="submitCommentLoading" />
              </span>
            </div>
          </div>
        </div>

        <!-- if user not logged in, hide comment input and show this instead -->
        <div v-if="!auth.loggedIn" class="p-4 mb-4 text-center rounded-md theme-color-secondary">
          {{ $t('comments.loginOrRegisterToLeaveComment') }}
        </div>
      </div>

      <!-- comments -->
      <div 
        class="comment-content"
        :class="[{ 'h-screen max-h-96 pr-3 overflow-x-hidden overflow-y-scroll': isModal }, { 'mb-20': !isModal }]"
      >
        <div 
          v-auto-animate
          v-for="comment in comments" 
          :key="comment.id" 
          class="flex flex-row w-full comment-item"
        >
          <nuxt-link class="mr-2" :to="'/profile/'+comment.users.username">
            <img class="w-10 h-10 avatar" :src="avatarCoverUrl(comment.users.avatar_bucket, comment.users.avatar_filename)" @error="imageLoadError">
          </nuxt-link>

          <div class="w-full">
            <div 
              class="p-4 w-full rounded-md"
              :class="!isModal ? 'theme-color' : 'theme-color-secondary'"
            >
              <div class="flex justify-between">
                <nuxt-link :to="'/profile/'+comment.users.username" class="mb-2 text-xs font-medium transition-all duration-150 cursor-pointer hover:font-bold">
                  {{ comment.users.name }}
                </nuxt-link>
                <div class="comment-time">
                  {{ formatDate(comment.created_at, true) }}
                </div>
              </div>

              <div>
                {{ comment.comment }}
              </div>

              <div v-if="auth.loggedIn" class="reactions hidden">
                <div class="flex flex-row">
                  <!-- <span class="reaction" @click="likedComments.includes(comment.id) ? unlikeComment(comment.id) : likeComment(comment.id)">
                    <Icon v-show="!likedComments.includes(comment.id)" :name="'i-ion-heart-outline'" class="text-gray-500 hover:text-red-500" />
                    <Icon v-show="likedComments.includes(comment.id)" :id="'comment-like-button-'+comment.id" :name="'i-ion-heart'" class="text-red-500 hover:text-red-500" />
                    {{ comment._count.artwork_comment_has_likes }}
                  </span>
                  <span class="reaction" @click="showReplyInput(comment.id) && showReplies(comment.id)">
                    <Icon :name="'i-ion-arrow-undo-outline'" class="text-gray-500 hover:text-blue-500" />
                    {{ comment._count.artwork_comment_has_replies }}
                  </span> -->

                  <!-- Other comment interaction buttons -->
                  <!-- <div class="inline-block relative ml-2 dropdown">
                    <div class="invisible z-50 rounded-md opacity-0 transition-all duration-300 transform origin-top-right scale-95 -translate-y-2 cursor-pointer dropdown-menu">
                      <div 
                        id="headlessui-menu-items-feed-more-options" 
                        class="absolute right-0 z-50 p-1 mt-2 w-56 rounded-md border shadow-lg origin-top-right outline-none border-color theme-color"
                        aria-labelledby="headlessui-menu-button-1" 
                        role="menu"
                      >
                        <nuxt-link 
                          :to="'/profile/'+comment.users.username" 
                          class="flex z-50 py-2 px-3 w-full rounded-md transition-all duration-150 theme-color hover:button-color parent-icon hover:text-white"
                          @click.prevent 
                        >
                          <Icon :name="'i-fluent-person-32-regular'" class="mr-2 text-base" /> {{ $t('viewProfile') }}
                        </nuxt-link>
                        <div
                          v-if="auth.loggedIn && auth.user.id === comment.users.id"
                          class="flex z-50 py-2 px-3 w-full rounded-md transition-all duration-150 theme-color hover:button-color parent-icon hover:text-white"
                          @click="deleteComment(comment.id)"
                        >
                          <Icon :name="'i-ion-trash-outline'" class="mr-2 text-base" /> {{ $t('delete') }}
                        </div>
                        <nuxt-link 
                          v-if="auth.loggedIn && auth.user.id !== comment.users.id"
                          :to="'#'" 
                          class="flex z-50 py-2 px-3 w-full rounded-md transition-all duration-150 theme-color hover:button-color parent-icon hover:text-white"
                          @click.prevent 
                        >
                          <Icon :name="'i-akar-icons-flag'" class="mr-2 text-base" /> {{ $t('report') }}
                        </nuxt-link>
                      </div>
                    </div>
                  </div> -->
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="feedDetail._count"
          v-show="feedDetail._count.feed_comments > commentPagination.perPage && showLoadOlderComments"
          class="text-center capitalize href"
          @click.prevent="loadMoreComments(feedDetail.id)"
        >
          {{ $t('comments.loadOlder') }}
        </div>

        <div v-show="comments.length && !showLoadOlderComments" class="w-full text-xs italic text-center">
          {{ $t('comments.reachedTheEnd') }}
        </div>

        <div v-if="auth.loggedIn && !comments.length" class="mt-4 w-full text-xs italic text-center">
          {{ $t('comments.noCommentYet') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import 'viewerjs/dist/viewer.css'

// stores
import useAuthStore from '@/stores/auth.store'

// components
import Icon from '~/components/globals/Icon.vue'
import Spinner from '~/components/globals/Spinner.vue'

/**
 * @stores
 */
const auth = useAuthStore()

/**
 * @props
 */
const props = defineProps ({
  id: {
    type: String,
    default: ''
  },
  section: {
    type: String,
    default: ''
  }
})

const { $router } = useNuxtApp()

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const feedApi = useFeed(oApiConfiguration, fetchOptions())

onMounted (() => {
  if (props.id !== '') {
    view(props.id)
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      useModal().closeModal(`${props.section}-modal`)
    }
  })
})

const isModal = props.id === ''

/** Open the modal view function */
const loading = ref(true)

const feedDetail = ref({})
const liked = ref(false)

const view = async (selectedFeedId) => {
  loading.value = true

  // reset comment data and options
  comments.value = []
  commentPagination.value.page = 0

  // fetch artwork detail
  try {
    const [data, error] = await feedApi.feedDetail({
      id: selectedFeedId
    })

    feedDetail.value = data.feed
    liked.value = data.feed.liked

    await getComments(selectedFeedId)
  } catch (error) {
    showError()
  }

  loading.value = false
}

/** Likes */
const like = async () => {
  const [success, error] = await feedApi.like({
    feedId: feedDetail.value.id
  })

  if (success) {
    liked.value = true
    feedDetail.value._count.feed_likes++

    // animate
    const likeButton = document.getElementById('feedLikeButton' + feedDetail.value.id)
    likeButton.classList.add('animate-bounce')
    setInterval(() => {
      likeButton.classList.remove('animate-bounce')
    }, 2500)
  } else {
    // todo: handle error
  }
}

const unlike = async () => {
  const [success, error] = await feedApi.unlike({
    feedId: feedDetail.value.id
  })

  if (success) {
    liked.value = false
    feedDetail.value._count.feed_likes--
  } else {
    // todo: handle error
  }
}

/** Comments */
// comments
const comments = ref([])
const commentPagination = ref({
  perPage: 5,
  page: 0
})
const commentIndexes = ref([])
const fetchComments = async (feedId) => {
  try {
    const [data, error] = await feedApi.fetchComments({
      feedId,
      pagination: {
        page: commentPagination.value.page,
        perPage: commentPagination.value.perPage
      }
    })

    if (data.pagination.current_page === data.pagination.first_last.last_page) {
      showLoadOlderComments.value = false
    } else {
      showLoadOlderComments.value = true
    }

    data.comments.forEach((comment) => {
      // // collect liked feed by current user logon
      // if (comment.liked) {
      //   likedComments.value.push(comment.id)
      // }

      // push comment id to comment indexes, used to remove the comment from comments ref when deleting a comment
      commentIndexes.value.push(comment.id)
    })

    return data.comments
  } catch (error) {
    // 
  }
}

/** Get first few comments */
const getComments = async (feedId) => {
  try {
    const firstFewComments = await fetchComments(feedId)

    firstFewComments.forEach(comment => comments.value.push(comment))
  } catch (error) {
    // 
  } 
}

/** Load more comments (comment pagination) */
const showLoadOlderComments = ref(false)
const loadMoreComments = async (feedId) => {
  try {
    commentPagination.value.page += 1
    const moreComments = await fetchComments(feedId)

    moreComments.forEach(comment => comments.value.push(comment))
  } catch (error) {
    // 
  }
}

const commentInput = ref()
const commentMaxChar = 200
const commentCharLeft = computed(() => (commentInput.value != null && commentInput.value !== '') ? commentMaxChar - commentInput.value.length : commentMaxChar)

/** Submit a comment */
const submitCommentLoading = ref(false)
const submitComment = async () => {
  submitCommentLoading.value = true

  try {
    const [success, data, error] = await feedApi.comment({
      feedId: feedDetail.value.id,
      comment: commentInput.value
    })

    if (success) {
      commentInput.value = ''
      comments.value.splice(0, 0, data)
      comments.value.join()

      // push comment id to comment indexes
      commentIndexes.value.splice(0, 0, data.id)
      commentIndexes.value.join()
    }
  } catch (error) {
    // 
  }

  submitCommentLoading.value = false
}

const deleteComment = async (commentId) => {
  try {
    // const { success } = await new ArtworkCommentsApi(oApiConfiguration).removeComment(commentId, fetchOptions())

    // // remove deleted comment from `comments` ref
    // if (success) {
    //   const indexOfIdToRemove = commentIndexes.value.indexOf(commentId)
    //   comments.value.splice(indexOfIdToRemove, 1)

    //   commentIndexes.value.splice(indexOfIdToRemove, 1)
    // }
  } catch (error) {
    // 
  }
}

const likedComments = ref([])
const likeComment = async (commentId) => {
  try {
    // const { success } = await new ArtworkCommentsLikesApi(oApiConfiguration).likeAComment(commentId, fetchOptions())

    // // comment liked
    // if (success) {
    //   likedComments.value.push(commentId)

    //   // animate
    //   const likeButton = document.getElementById(`comment-like-button-${commentId}`)
    //   likeButton.classList.add('animate-bounce')
    //   setInterval(() => {
    //     likeButton.classList.remove('animate-bounce')
    //   }, 2500)
    // }
  } catch (error) {
    // 
  }
}

const unlikeComment = async (commentId) => {
  try {
    // const { success } = await new ArtworkCommentsLikesApi(oApiConfiguration).unlikeAComment(commentId, fetchOptions())

    // // comment unliked
    // if (success) {
    //   const indexOfIdToRemove = likedComments.value.indexOf(commentId)
    //   likedComments.value.splice(indexOfIdToRemove, 1)
    // }
  } catch (error) {
    // 
  }
}

/** Show error on fetch failure */
const isError = ref(false)
const showError = () => {
  isError.value = true
}

/** Cancel publish or delete work */
const deleteConfirmationDialog = ref(false)
const deleteSuccess = ref(false)
const deleteWork = async (workId) => {
  try {
    // const { success } = await new ArtworkCRUDApi(oApiConfiguration)
    //   .deleteWork(
    //     [workId],
    //     fetchOptions()
    //   )

    // if (success) {
    //   deleteSuccess.value = true

    //   setTimeout(() => {
    //     $router.push('/')
    //   }, 1500)
    // }
  } catch (error) {
    // 
  }
}

/**
 * @expose
 */
defineExpose ({
  view
})
</script>

<style lang="scss" scoped>
@import "~/assets/css/artworks/view.scss";

.user-info {
  @apply flex flex-row mb-4;

  .avatar {
    @apply mr-3 w-10 h-10 rounded-md object-cover;
    aspect-ratio: 1/1;
  }

  .name {
    .fullname {
      @apply font-bold text-tiny;
    }
    .username {
      @apply text-xs;
    }
  }
}

.comment-content {
  .comment-order {
    @apply flex justify-end mb-4 w-full;

    button {
      @apply py-2 px-3 underline rounded-sm cursor-pointer;
    }
  }

  .comment-item {
    @apply mb-2;

    .comment-time {
      @apply italic text-xxs;
      color: var(--link);
    }

    .reactions {
      @apply flex flex-row justify-between w-full;

      .reaction {
        @apply flex ml-3 leading-5;

        .icon {
          @apply mr-1 text-xl cursor-pointer;
        }
      }
    }
  }
}
</style>

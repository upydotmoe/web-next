<template>
  <section
    id="comment-section"
    class="comments"
  >
    <!-- comment text box -->
    <div
      v-if="auth.loggedIn"
      class="comment-box"
    >
      <div class="flex flex-col">
        <div class="flex relative flex-col">
          <textarea
            v-model="commentInput"
            cols="30"
            data-gramm="false"
            :class="[
              'input form-input',
              { 'cursor-not-allowed': submitCommentLoading },
              { 'theme-color-secondary textarea': isModal }
            ]"
            :readonly="submitCommentLoading"
            :rows="commentInput != null && commentInput != '' ? '4' : '0'"
            :placeholder="$t('comments.inputPlaceholder')"
            :maxlength="commentMaxChar"
          />
          <span 
            v-show="commentInput != null && commentInput != ''" 
            class="absolute left-4 bottom-6 py-1 px-2 text-white rounded-md button-color"
          >
            {{ commentCharLeft }}
          </span>
          <span
            class="absolute right-2 bottom-5 py-1 px-2"
            @click.prevent="submitComment()"
          >
            <Icon 
              v-show="commentInput != null && commentInput != '' && !submitCommentLoading"
              :name="'i-carbon-send-filled'" 
              class="text-xl transition-all duration-100 cursor-pointer text-colored"
            />
            <Spinner v-show="submitCommentLoading" />
          </span>
        </div>
      </div>
    </div>

    <!-- if user not logged in, can't comment -->
    <div
      v-if="!auth.loggedIn"
      class="p-4 mb-4 text-center rounded-md theme-color-secondary"
    >
      {{ $t('comments.loginOrRegisterToLeaveComment') }}
    </div>

    <!-- comment section -->
    <section
      id="comment-section"
      class="comments__items"
    >
      <div class="flex flex-row justify-end mb-2">
        <div v-if="artwork._count && artwork._count.artwork_comments">
          <b>{{ thousand(artwork._count.artwork_comments) }}</b> {{ artwork._count.artwork_comments > 1 ? $t('count.comments') : $t('count.comment') }}
        </div>
      </div>

      <div 
        v-for="comment in comments"
        :key="comment.id" 
        v-auto-animate 
        class="comments__item"
      >
        <!-- commenter avatar -->
        <nuxt-link
          class="comments__item__user-avatar"
          :to="'/u/' + comment.users.username"
        >
          <img
            :src="avatarCoverUrl(comment.users.avatar_bucket, comment.users.avatar_filename)"
            @error="defaultCoverImage"
          >
        </nuxt-link>
        
        <div class="comments__item__wrapper">
          <div
            :class="[
              'comments__item__comment',
              !isModal ? 'theme-color' : 'theme-color-secondary'
            ]"
          >
            <!-- commenter username & comment time -->
            <div class="comments__item__comment__user-info">
              <nuxt-link :to="'/u/' + comment.users.username">
                <b>{{ comment.users.name }}</b>&nbsp;
                <span class="hover:underline">@{{ comment.users.username }}</span>
              </nuxt-link>

              <div class="time">
                {{ formatDate(comment.created_at, true) }}
              </div>
            </div>
                  
            <!-- the comment -->
            <p>{{ comment.comment }}</p>

            <!-- interaction & option buttons -->
            <div class="comments__item__comment__buttons">
              <!--
                left side: 
                  - show X reply/ie(s)
              -->
              <div 
                class="cursor-pointer hover:underline"
                @click="activeReplyTray == comment.id ? hideReplies(comment.id) : showReplies(comment.id)"
              >
                <span v-if="comment._count.artwork_comment_has_replies > 0">
                  <b>{{ shortNumber(comment._count.artwork_comment_has_replies) }}</b> 
                  {{ comment._count.artwork_comment_has_replies > 1 ? $t('comments.replies.replies').toLowerCase() : $t('comments.replies.reply').toLowerCase() }} 
                </span>
              </div>

              <!-- right side: interaction & option buttons -->
              <div
                v-if="auth.loggedIn"
                class="comments__item__comment__buttons__item"
              >
                <!-- like a comment button -->
                <button @click="likedComments.includes(comment.id) ? unlikeComment(comment.id) : likeComment(comment.id)">
                  <Icon
                    v-show="!likedComments.includes(comment.id)"
                    :name="'i-ri-heart-3-line'"
                    class="text-gray-500 hover:text-red-500"
                  />
                  <Icon
                    v-show="likedComments.includes(comment.id)"
                    :id="'comment-like-button-'+comment.id"
                    :name="'i-ion-heart'"
                    class="text-red-500 hover:text-red-500"
                  />
                  {{ shortNumber(comment._count.artwork_comment_has_likes) }}
                </button>

                <!-- reply a comment button -->
                <button @click="showReplyInput(comment.id)">
                  <Icon
                    :name="'i-quill-reply'"
                    class="text-gray-500 hover:text-blue-500"
                  />
                </button>

                <!-- option buttons -->
                <div class="ellipsis-menus dropdown">
                  <button 
                    type="button" 
                    aria-haspopup="true" 
                    aria-expanded="true" 
                    aria-controls="ellipsis-menus"
                    @click="showReplyInputId = 0"
                  >
                    <span>
                      <Icon :name="'i-uit-ellipsis-v'" />
                    </span>
                  </button>

                  <div class="ellipsis-menus__content dropdown-menu">
                    <div 
                      id="ellipsis-menus"
                      class="ellipsis-menus__content__wrapper"
                      aria-labelledby="headlessui-menu-button-1"
                      role="menu"
                    >
                      <!-- view profile -->
                      <nuxt-link :to="'/u/' + comment.users.username">
                        <Icon :name="'i-fluent-person-32-regular'" />
                        {{ $t('viewProfile') }}
                      </nuxt-link>

                      <!-- delete comment button -->
                      <div v-if="auth.loggedIn && auth.user.id === comment.users.id">
                        <a @click="deleteComment(comment.id)">
                          <Icon :name="'i-ion-trash-outline'" />
                          {{ $t('delete') }}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- comment replies -->
          <section
            id="replies-section"
            class="replies"
          >
            <section 
              v-if="auth.loggedIn" 
              v-show="showReplyInputId === comment.id"
              id="reply-input-section"
              class="replies__reply-box"
            >
              <textarea
                :id="'reply-'+comment.id"
                v-model="replyInput"
                cols="30"
                data-gramm="false"
                :class="[
                  { '!cursor-not-allowed': submitReplyLoading },
                  { 'theme-color-secondary textarea': isModal }
                ]"
                :readonly="submitReplyLoading"
                :rows="replyInput != null && replyInput != '' ? '4' : '0'"
                :placeholder="$t('comments.replies.write')"
                :maxlength="replyMaxChar"
              />
              
              <div
                v-show="replyInput != null && replyInput != ''" 
                class="replies__reply-box__str-left-counter"
              >
                {{ replyCharLeft }}
              </div>

              <button @click.prevent="submitReply(comment.id)">
                <Icon 
                  v-show="replyInput != null && replyInput != '' && !submitReplyLoading"
                  :name="'i-carbon-send-filled'" 
                />
                <Spinner v-show="submitReplyLoading" />
              </button>
            </section>
                
            <section
              :id="'comment-replies-'+comment.id"
              class="hidden replies__items"
            >
              <!-- hide button -->
              <div 
                v-if="commentReplies[comment.id] && commentReplies[comment.id].length"
                class="replies__items__hide"
              >
                <span class="italic text-color-secondary">{{ $t('comments.replies.replies') }}</span>

                <span
                  class="cursor-pointer hover:font-semibold"
                  @click="hideReplies(comment.id)" 
                >
                  {{ $t('hide') }}
                </span>
              </div>

              <!-- reply list -->
              <div
                v-for="reply in commentReplies[comment.id]"
                :key="reply.id"
                :class="[
                  'replies__items__item',
                  !isModal ? 'theme-color' : 'theme-color-secondary'
                ]"
              >
                <div class="replies__items__item__user-info">
                  <nuxt-link
                    :to="'/u/' + reply.users.username"
                    class="replies__items__item__avatar"
                  >
                    <img
                      class="!w-6 !h-6"
                      :src="avatarCoverUrl(reply.users.avatar_bucket, reply.users.avatar_filename)"
                      @error="defaultCoverImage"
                    >
                    <span class="transition-all duration-150 cursor-pointer hover:font-bold">{{ reply.users.name }}</span>
                  </nuxt-link>

                  <span class="time">
                    {{ formatDate(reply.created_at, true) }}
                  </span>
                </div>

                <!-- the reply -->
                <p>{{ reply.content }}</p>

                <!-- interaction & option buttons -->
                <div
                  v-if="auth.loggedIn"
                  class="comments__item__comment__buttons"
                >
                  <div />

                  <!-- right side: interaction & option buttons -->
                  <div class="comments__item__comment__buttons__item">
                    <button @click="likedReplies.includes(reply.id) ? unlikeReply(reply.id) : likeReply(reply.id)">
                      <Icon
                        v-show="likedReplies.includes(reply.id)"
                        :id="'reply-like-button-'+reply.id"
                        :name="'i-ion-heart'"
                        class="text-red-500 hover:text-red-500"
                      />
                      <Icon
                        v-show="!likedReplies.includes(reply.id)"
                        :name="'i-ri-heart-3-line'"
                        class="text-gray-500 hover:text-red-500"
                      />
                      {{ shortNumber(reply._count.artwork_comment_reply_has_likes) }}
                    </button>
                        
                    <!-- Other reply interaction buttons -->
                    <div class="ellipsis-menus dropdown">
                      <button 
                        type="button" 
                        aria-haspopup="true" 
                        aria-expanded="true" 
                        aria-controls="ellipsis-menus"
                      >
                        <span>
                          <Icon :name="'i-uit-ellipsis-v'" />
                        </span>
                      </button>

                      <!-- option buttons -->
                      <div class="ellipsis-menus__content dropdown-menu">
                        <div 
                          id="ellipsis-menus" 
                          class="ellipsis-menus__content__wrapper"
                          aria-labelledby="headlessui-menu-button-1" 
                          role="menu"
                        >
                          <!-- view profile -->
                          <nuxt-link
                            :to="'/u/' + reply.users.username" 
                            @click.prevent 
                          >
                            <Icon :name="'i-fluent-person-32-regular'" />
                            {{ $t('viewProfile') }}
                          </nuxt-link>

                          <!-- delete reply -->
                          <div v-if="auth.loggedIn && auth.user.id === reply.users.id">
                            <a @click="deleteReply(comment.id, reply.id)">
                              <Icon :name="'i-ion-trash-outline'" />
                              {{ $t('delete') }}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div 
                v-if="commentReplies[comment.id] && showLoadMoreReplies" 
                class="mb-1 text-center transition ease-in-out delay-75 cursor-pointer hover:font-semibold hover:underline text-color-secondary href"
                @click="loadMoreReplies(comment.id)"
              >
                {{ $t('comments.replies.loadMore') }}
              </div>
            </section>
          </section>
        </div>
      </div>
    </section>

    <div
      v-if="artwork._count"
      v-show="artwork._count.artwork_comments > 3 && showLoadOlderComments"
      class="comments__load-more-button"
      @click.prevent="loadMoreComments(artwork.id)"
    >
      {{ $t('comments.loadOlder') }}
    </div>

    <div
      v-show="comments.length && !showLoadOlderComments"
      class="comments__no-more-item"
    >
      {{ $t('comments.reachedTheEnd') }}
    </div>

    <div
      v-if="auth.loggedIn && !comments.length"
      class="comments__no-comment"
    >
      {{ $t('comments.noCommentYet') }}
    </div>
  </section>
</template>

<script setup>
// stores
import useAuthStore from '@/stores/auth.store'

// components
import Icon from '~/components/globals/Icon.vue'
import Spinner from '~/components/globals/Spinner.vue'

// stores
const auth = useAuthStore()

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const artworkApi = useArtwork(oApiConfiguration, fetchOptions())

const props = defineProps({
  artwork: {
    type: Object,
    default: () => {}
  },
  isModal: {
    type: Boolean,
    default: false
  }
})

onMounted(() => {
  reset()

  // fetch comments
  getComments(props.artwork.id)
})

const reset = () => {
  commentInput.value = ''
  comments.value = []
  commentReplies.value = []
}

const comments = ref([])
const commentPagination = reactive({
  perPage: 3,
  page: 0
})
const commentIndexes = ref([])

const fetchComments = async (workId) => {
  const [data, error] = await artworkApi.getComments({
    workId,
    pagination: {
      page: commentPagination.page,
      perPage: commentPagination.perPage
    }
  })

  if (data) {
    if (data.pagination.current_page === data.pagination.first_last.last_page) {
      showLoadOlderComments.value = false
    } else {
      showLoadOlderComments.value = true
    }

    // collect liked artwork by current user logon
    data.comments.forEach((comment) => {
      if (comment.liked) {
        likedComments.value.push(comment.id)
      }

      // push comment id to comment indexes, used to remove the comment from comments ref when deleting a comment
      commentIndexes.value.push(comment.id)
    })

    return data.comments
  } else {
    // todo: handle error
  }
}

/** Get first few comments */
const getComments = async (workId) => {
  try {
    const firstFewComments = await fetchComments(workId)

    firstFewComments.forEach(comment => comments.value.push(comment))
  } catch (error) {
    // 
  } 
}

/** Load more comments (comment pagination) */
const showLoadOlderComments = ref(false)
const loadMoreComments = async (workId) => {
  try {
    commentPagination.page += 1
    const moreComments = await fetchComments(workId)

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
    const [success, data, error] = await artworkApi.addComment({
      workId: props.artwork.id,
      comment: commentInput.value
    })

    if (success) {
      commentInput.value = ''
      comments.value.splice(0, 0, data)
      comments.value.join()

      // push comment id to comment indexes
      commentIndexes.value.splice(0, 0, data.id)
      commentIndexes.value.join()
    } else {
      // todo: handle error
    }
  } catch (error) {
    // 
  }

  submitCommentLoading.value = false
}

const deleteComment = async (commentId) => {
  const [success, error] = await artworkApi.deleteComment({
    commentId
  })

  // remove deleted comment from `comments` ref
  if (success) {
    const indexOfIdToRemove = commentIndexes.value.indexOf(commentId)
    comments.value.splice(indexOfIdToRemove, 1)

    commentIndexes.value.splice(indexOfIdToRemove, 1)
  } else {
    // todo: handle error
  }
}

const likedComments = ref([])
const likeComment = async (commentId) => {
  const [success, error] = await artworkApi.likeComment({
    commentId
  })
  
  if (success) {
    likedComments.value.push(commentId)

    // animate
    const commentLikeButtonEl = document.getElementById(`comment-like-button-${commentId}`)
    commentLikeButtonEl.classList.add('animate-bounce')
    setInterval(() => {
      commentLikeButtonEl.classList.remove('animate-bounce')
    }, 2500)
  } else {
    // todo: handle error
  }
}

const unlikeComment = async (commentId) => {
  const [success, error] = await artworkApi.unlikeComment({
    commentId
  })

  if (success) {
    const indexOfIdToRemove = likedComments.value.indexOf(commentId)
    likedComments.value.splice(indexOfIdToRemove, 1)
  } else {
    // todo: handle error
  }
}

/** Replies */
const commentReplyPagination = reactive({
  perPage: 2,
  page: 0
})
const commentReplies = ref([])
const commentReplyIndexes = ref([])
const showLoadMoreReplies = ref(true)

const fetchReplies = async (commentId) => {
  const [replies, pagination, error] = await artworkApi.getCommentReplies({
    commentId,
    pagination: {
      page: commentReplyPagination.page,
      perPage: commentReplyPagination.perPage
    }
  })

  if (error) {
    // todo: handle error
  } else {
    if (pagination.current_page === pagination.first_last.last_page) {
      showLoadMoreReplies.value = false
    }

    // push reply id to reply indexes, used for delete reply function
    replies.map(reply => commentReplyIndexes.value.push(reply.id))

    return replies
  }
}

const activeReplyTray = ref(0)
const showReplies = async (commentId) => {
  showLoadMoreReplies.value = true
  commentReplyIndexes.value = []

  try {
    const data = await fetchReplies(commentId)
    commentReplies.value = {
      [commentId]: data
    }

    // collect liked replies
    data.forEach((reply) => {
      if (reply.liked) {
        likedReplies.value.push(reply.id)
      }
    })

    if (activeReplyTray.value) {
      hideReplies(activeReplyTray.value)
    }

    const commentReplyEl = document.getElementById(`comment-replies-${commentId}`)
    commentReplyEl.classList.add('flex')
    commentReplyEl.classList.remove('hidden')

    activeReplyTray.value = commentId
  } catch (error) {
    // 
  }
}

const hideReplies = (commentId) => {
  const commentReplyEl = document.getElementById(`comment-replies-${commentId}`)
  commentReplyEl.classList.remove('flex')
  commentReplyEl.classList.add('hidden')

  activeReplyTray.value = 0
}

const loadMoreReplies = async (commentId) => {
  commentReplyPagination.page += 1
  try {
    const data = await fetchReplies(commentId)
    data.forEach((reply) => {
      commentReplies.value[commentId].push(reply)
    })
  } catch (error) {
    // 
  }
}

const showReplyInputId = ref(0)
const showReplyInput = async (commentId) => {
  await showReplies(commentId)
  showReplyInputId.value = commentId
}

const replyInput = ref()
const replyMaxChar = 200
const replyCharLeft = computed(() => (replyInput.value != null && replyInput.value !== '') ? replyMaxChar - replyInput.value.length : replyMaxChar)

/** Submit reply */
const submitReplyLoading = ref(false)
const submitReply = async (commentId) => {
  submitReplyLoading.value = true

  try {
    const [success, data, error] = await artworkApi.addReply({
      commentId,
      reply: replyInput.value
    })

    if (success) {
      // expand replies div
      showReplies(commentId)
      
      replyInput.value = ''
      commentReplies.value[commentId].splice(0, 0, data)
      commentReplies.value[commentId].join()

      showReplyInputId.value = 0

      // push reply id to reply indexes
      commentReplyIndexes.value.splice(0, 0, data.id)
      commentReplyIndexes.value.join()
    } else {
      // todo: handle error
    }
  } catch (error) {
    // 
  }

  submitReplyLoading.value = false
}

const deleteReply = async (commentId, replyId) => {
  const [success, error] = await artworkApi.deleteReply({
    replyId
  })

  if (success) {
    const indexOfIdToRemove = commentReplyIndexes.value.indexOf(replyId)
    commentReplies.value[commentId].splice(indexOfIdToRemove, 1)

    commentReplyIndexes.value.splice(indexOfIdToRemove, 1)
  } else {
    // todo: handle error
  }
}

const likedReplies = ref([])
const likeReply = async (replyId) => {
  const [success, error] = await artworkApi.likeReply({
    replyId
  })

  if (success) {
    likedReplies.value.push(replyId)
    
    // animate
    const replyCommentLikeButtonEl = document.getElementById(`reply-like-button-${replyId}`)
    replyCommentLikeButtonEl.classList.add('animate-bounce')
    setInterval(() => {
      replyCommentLikeButtonEl.classList.remove('animate-bounce')
    }, 2500)
  } else {
    // todo: handle error
  }
}

const unlikeReply = async (replyId) => {
  const [success, error] = await artworkApi.unlikeReply({
    replyId
  })
  
  if (success) {
    const indexOfIdToRemove = likedReplies.value.indexOf(replyId)
    likedReplies.value.splice(indexOfIdToRemove, 1)
  } else {
    // todo: handle error
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/tailwind.scss';
@import '~/assets/css/comments.scss';
@import '~/assets/css/replies.scss';
</style>
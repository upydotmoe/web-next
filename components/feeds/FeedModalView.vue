<template>
  <div 
    :class="[
      'z-40 work-container work-view mx-auto',
      { 'w-full md:w-2/3 lg:w-6/12 xl:w-4/12 py-4 pl-4 md:p-4 theme-color': isModal }
    ]"
  > 
    <div
      :class="[
        'w-full',
        { 'overflow-y-scroll pr-4': isModal }
      ]"
    >
      <div
        :class="[
          'mb-2 rounded-md theme-color pb-2',
        ]"
      >
        <ArtistDetail
          :feed="feedDetail"
          :is-modal="isModal"
          :show-close-button="isModal"
          :close-modal-target="'chronological-feed-modal'"
          :class="[
            { '!-mt-2': isModal }
          ]"
        />

        <TextPostDetail
          :bypass="true"
          :is-modal="isModal"
          :feed="feedDetail"
          :read-more="readMore"
          :view="view"
          @read-more="readMore"
          @view="view"
        />
      </div>

      <!-- reactions -->
      <section
        v-if="feedDetail._count"
        id="interaction-buttons"
        class="interactions !px-4"
      >
        <div>
          <div v-if="feedDetail._count.feed_comments">
            <b>{{ thousand(feedDetail._count.feed_comments) }}</b> {{ feedDetail._count.feed_comments > 1 ? $t('count.comments') : $t('count.comment') }}
          </div>
          <div v-if="!feedDetail._count.feed_comments" />
        </div>

        <div class="interactions__items">
          <!-- like button -->
          <div
            v-if="auth.loggedIn"
            class="interactions__item"
            @click="liked ? unlike() : like()"
          >
            <Icon 
              v-show="liked"
              :id="'feedLikeButton'+feedDetail.id"
              :name="'i-ion-heart'" 
              class="text-red-500 hover:text-red-500"
            />
            <Icon 
              v-show="!liked"
              :name="'i-ri-heart-3-line'" 
              class="hover:text-red-500"
            />
            {{ thousand(feedDetail._count.feed_likes) }}
          </div>

          <!-- option buttons -->
          <div
            v-if="!feedDetail.artworks && (auth.loggedIn && feedDetail.user_id && auth.user.id === feedDetail.user_id)"
            class="ellipsis-menus dropdown"
          >
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

            <div class="ellipsis-menus__content dropdown-menu">
              <div 
                id="ellipsis-menus"
                class="ellipsis-menus__content__wrapper"
                aria-labelledby="headlessui-menu-button-1" 
                role="menu"
              >
                <div v-if="auth.loggedIn && feedDetail.user_id && auth.user.id === feedDetail.user_id">
                  <a @click="openModal('feed-deletion-confirm-modal')">
                    <Icon :name="'i-ion-trash-outline'" />
                    {{ $t('delete') }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- comment section -->
      <section
        id="comment-section"
        class=""
      >
        <section id="comment-input-section">
          <div v-if="auth.loggedIn">
            <div class="flex flex-col">
              <div class="comments__comment-box">
                <textarea
                  ref="commentInputRef"
                  v-model="commentInput"
                  :class="[{ 'cursor-not-allowed': submitCommentLoading }, { 'theme-color-secondary textarea': isModal }]"
                  :readonly="submitCommentLoading"
                  cols="20"
                  :rows="commentInput != '' ? '6' : '0'"
                  :placeholder="$t('comments.inputPlaceholder')"
                  :maxlength="commentMaxChar"
                  data-gramm="false"
                />

                <span 
                  v-show="commentInput != ''" 
                  class="comments__str-left-counter"  
                >
                  {{ commentCharLeft }}
                </span>

                <button
                  class="comments__submit"
                  @click.prevent="submitComment()"
                >
                  <Icon
                    v-show="commentInput != '' && !submitCommentLoading"
                    :name="'i-carbon-send-filled'"
                  />
                  <Spinner v-show="submitCommentLoading" />
                </button>
              </div>
            </div>
          </div>

          <!-- if user not logged in, hide comment input and show this alert instead -->
          <div
            v-if="!auth.loggedIn"
            class="must-login-alert"
          >
            {{ $t('comments.loginOrRegisterToLeaveComment') }}
          </div>
        </section>

        <!-- comments -->
        <div 
          class="comments__items"
          :class="[
            { 'overflow-x-hidden': isModal },
            { 'mb-20': !isModal }
          ]"
        >
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

            <div
              :class="[
                'comments__item__comment',
                !isModal ? 'theme-color' : 'theme-color-secondary'
              ]"
            >
              <!-- commenter user info and comment time -->
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

              <!-- item buttons -->
              <div class="comments__item__comment__buttons">
                <div />

                <div class="comments__item__comment__buttons__item">
                  <button
                    v-if="comment.users.id === auth.user.id"
                    @click="removeComment(comment.id)"
                  >
                    <Icon
                      :name="'i-akar-icons-trash-bin'"
                      :text-size="'text-base'"
                      class="hover:bg-red-400"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- load more comments -->
          <div
            v-if="feedDetail._count"
            v-show="feedDetail._count.feed_comments > commentPagination.perPage && showLoadOlderComments"
            class="comments__load-more-button"
            @click.prevent="loadMoreComments(feedDetail.id)"
          >
            <Spinner v-if="loadingOlderComment" />
            {{ $t('comments.loadOlder') }}
          </div>

          <!-- have reached the end message -->
          <div
            v-show="comments.length && !showLoadOlderComments"
            class="comments__no-more-item"
          >
            {{ $t('comments.reachedTheEnd') }}
          </div>

          <!-- no comment message -->
          <div
            v-if="auth.loggedIn && !comments.length"
            class="comments__no-comment"
          >
            {{ $t('comments.noCommentYet') }}
          </div>
        </div>
      </section>
    </div>

    <!-- artwork modal view component -->
    <div 
      :id="'chronological-modal'"
      class="modal work-view" 
    >
      <ModalView 
        ref="sharedWorkModalViewRef"
        :section="'chronological'"
      />
    </div>

    <!-- Feed deletion confirmation dialog -->
    <ConfirmationDialog
      id="feed-deletion-confirm-modal"
      :modal-id="'feed-deletion-confirm-modal'"
      :message="`${$t('alert.areYouSure')} ${$t('alert.youCannotUndoThisAction')}`"
      class="modal"
      @on-accept="removeFeed(feedDetail.id)"
    />
  </div>
</template>

<script setup>
import 'viewerjs/dist/viewer.css'

// stores
import useAuthStore from '@/stores/auth.store'

// components
import Icon from '~/components/globals/Icon.vue'
import Spinner from '~/components/globals/Spinner.vue'
import ModalView from '~/components/artworks/views/ModalView.vue'
import ConfirmationDialog from '~/components/globals/ConfirmationDialog.vue'
import ArtistDetail from '~/components/feeds/index/ArtistDetail.vue'
import TextPostDetail from '~/components/feeds/index/TextPostDetail.vue'

// stores
const auth = useAuthStore()

const emit = defineEmits(['setMeta', 'showEmpty', 'showError'])
const props = defineProps({
  id: {
    type: Number,
    default: 0
  },
  section: {
    type: String,
    default: ''
  },
  isModal: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()
const { $router } = useNuxtApp()

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const feedApi = useFeed(oApiConfiguration, fetchOptions())
const { generateArtworkThumb } = useUpyImage()

const commentInputRef = ref(null)

onMounted (() => {
  if (props.id !== 0) {
    view(props.id)
  }

  window.addEventListener('keydown', (e) => {
    // get element of shared artwork modal view
    const sharedWorkModal = document.getElementById('chronological-modal')

    if (e.key === 'Escape'
      && (!sharedWorkModal || sharedWorkModal.style.display != 'flex')
    ) {
      useModal().closeModal(`${props.section}-modal`)
    }
  })
})

const feedId = computed(() => feedDetail.value.id)

/** Open the modal view function */
const loading = ref(true)

const feedDetail = ref({})
const liked = ref(false)

const readMore = (description, workId, selectorElId, descriptionElid) => {
  useReadMore().readMore(description, workId, selectorElId, descriptionElid)
}

const view = async (selectedFeedId) => {
  loading.value = true

  // reset comment data and options
  comments.value = []
  commentPagination.value.page = 0

  // fetch artwork detail
  const [data, error] = await feedApi.feedDetail({
    id: selectedFeedId
  })

  if (error) {
    if (error == 'Post not found') {
      emit('showEmpty')
    } else {
      emit('showError')
    }
  } else {
    if (data.feed.artworks) {
      data.feed.artworks.images = []
      for (let assetIdx = 0; assetIdx < data.feed.artworks.artwork_assets.length; assetIdx++) {
        if (assetIdx <= 3) {
          const imageUrl = await generateArtworkThumb(data.feed.artworks.artwork_assets[assetIdx].bucket, data.feed.artworks.artwork_assets[assetIdx].filename, 'feed')
          data.feed.artworks.images.push(imageUrl)
        }
      }

      if (((!auth.loggedIn && data.feed.artworks.is_explicit) || (data.feed.artworks.is_explicit && !auth.user.user_settings.show_explicit))) {
        data.feed.artworks.apply_explicit_filter = true
      }
    }

    feedDetail.value = data.feed

    liked.value = data.feed.liked

    await getComments(selectedFeedId)

    if (!props.isModal) {
      const strippedText = data.feed.text.replace(/<[^>]*>?/gm, '')
      emit('setMeta', {
        title: strippedText > 20 ? `${strippedText.substring(0, 20)}..` : strippedText
      })
    }
  }

  loading.value = false
}

const sharedWorkModalViewRef = ref(null)
const viewArtwork = async (workId, isExplicitFilterApplied) => {
  if (isExplicitFilterApplied) {
    feedDetail.value.artworks.apply_explicit_filter = false
  } else {
    sharedWorkModalViewRef.value.view(workId)
    useModal().openModal('chronological-modal')
  }
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
const loadingOlderComment = ref(false)
const loadMoreComments = async (feedId) => {
  loadingOlderComment.value = true

  commentPagination.value.page += 1
  const moreComments = await fetchComments(feedId)

  moreComments.forEach(comment => comments.value.push(comment))
  
  loadingOlderComment.value = false
}

const commentInput = ref('')
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

const removeComment = async (commentId) => {
  const [success, error] = await feedApi.removeComment(commentId)

  if (error) {
    // todo: handle error
  } else {
    const indexOfIdToRemove = commentIndexes.value.indexOf(commentId)

    comments.value.splice(indexOfIdToRemove, 1)
    commentIndexes.value.splice(indexOfIdToRemove, 1)
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

/**
 * Remove/delete feed
 */
const removeFeed = async (feedId) => {
  const [success, error] = await feedApi.remove(feedId)

  if (success) {
    setTimeout(() => {
      router.push({
        path: '/'
      })
    }, 1000)
  } else {
    // todo: handle error
  }
}

// expose functions
defineExpose ({
  view
})
</script>

<style lang="scss" scoped>
@import "~/assets/css/artworks/view.scss";
@import '~/assets/css/comments.scss';
</style>

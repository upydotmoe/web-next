<template>
  <div 
    :class="[
      'z-40 work-container work-view mx-auto',
      { 'w-full md:w-2/3 lg:w-6/12 xl:w-4/12 py-4 pl-4 md:p-6 theme-color': isModal }
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
          'mb-4 rounded-md theme-color',
          { 'p-4': !isModal },
        ]"
      >
        <!-- user info -->
        <div class="flex flex-row justify-between w-full">
          <div
            v-if="feedDetail.users"
            class="user-info"
          >
            <nuxt-link :to="'/u/' + feedDetail.users.username">
              <img
                class="avatar"
                :src="avatarCoverUrl(feedDetail.users.avatar_bucket, feedDetail.users.avatar_filename)"
                @error="defaultCoverImage"
              >
            </nuxt-link>
            <div class="name">
              <nuxt-link
                :to="'/u/' + feedDetail.users.username"
                class="fullname"
              >
                {{ feedDetail.users.name }}
              </nuxt-link>
              <br>
              <nuxt-link
                :to="'/u/' + feedDetail.users.username"
                class="username"
              >
                @{{ feedDetail.users.username }}
              </nuxt-link>

              <span class="mx-1">·</span>
                    
              <span class="text-xxs">
                {{ formatDate(feedDetail.created_at, true) }}
              </span>
            </div>
          </div>

          <div
            v-if="isModal"
            class="flex float-right flex-row gap-2 mb-4 cursor-pointer"
          >
            <div
              class="modal-close"
              @click="closeModal(section + '-modal')"
            >
              <Icon
                :name="'i-ion-close'"
                class="text-2xl"
              />
            </div>
          </div>
        </div>

        <!-- feed text -->
        <div 
          v-if="feedDetail.text"
          v-html="feedDetail.text"
        />

        <!-- shared artwork post detail -->
        <div
          v-if="feedDetail.artworks"
          class="mt-4 rounded-md theme-color-secondary"
        >
          <!-- creator information -->
          <div
            v-if="feedDetail.artworks.users"
            class="p-2 md:p-4 user-info"
          >
            <nuxt-link :to="'/u/' + feedDetail.artworks.users.username">
              <img
                class="avatar"
                :src="avatarCoverUrl(feedDetail.artworks.users.avatar_bucket, feedDetail.artworks.users.avatar_filename)"
                @error="defaultCoverImage"
              >
            </nuxt-link>
            <div class="name">
              <nuxt-link 
                :to="'/u/' + feedDetail.artworks.users.username" 
                class="fullname hover:href"
              >
                {{ feedDetail.artworks.users.name }}
              </nuxt-link>
              <br>
              <nuxt-link 
                :to="'/u/' + feedDetail.artworks.users.username" 
                class="hover:underline text-xxs"
              >
                @{{ feedDetail.artworks.users.username }}
              </nuxt-link>
              
              <span class="mx-1">·</span>
              
              <nuxt-link
                :to="'/a/' + feedDetail.artworks.id"
                class="hover:underline text-xxs"
              >
                {{ formatDate(feedDetail.artworks.scheduled_post ? feedDetail.artworks.scheduled_post : feedDetail.artworks.created_at, true) }}
              </nuxt-link>
            </div>
          </div>

          <!-- title & description of shared artwork -->
          <div class="px-2 md:px-4">
            <span class="text-xs font-semibold">{{ feedDetail.artworks.title }}</span>
            <p v-show="feedDetail.artworks.description">
              <span :id="'feed-description-'+feedDetail.artworks.id">
                {{ feedDetail.artworks.description.length > 300 ? `${feedDetail.artworks.description.slice(0, 300)}...` : feedDetail.artworks.description }}
              </span>
              <a 
                v-if="feedDetail.artworks.description.length > 300" 
                :id="'feed-read-more-'+feedDetail.artworks.id" 
                class="href" 
                @click.prevent="readMore(feedDetail.artworks.description, feedDetail.artworks.id, 'feed-read-more-', 'feed-description-')"
              >
                {{ $t('readMore') }}
              </a>
            </p>
          </div>

          <!-- the artwork(s) -->
          <div class="px-2">
            <!-- Image view on Desktop -->
            <div
              v-if="feedDetail.artworks"
              class="cursor-pointer"
              @click.prevent="viewArtwork(feedDetail.artworks.id, feedDetail.artworks.apply_explicit_filter)"
            >
              <!-- <ImageList class="p-2 md:p-4" :work="feedDetail.artworks" /> -->
              <div
                :class="[
                  'overflow-hidden relative rounded-md',
                  !isMobile() ? 'p-2' : 'pt-2',
                  { 'm-2': feedDetail.artworks.apply_explicit_filter }
                ]"
              >
                <ImageList
                  :class="[
                    'mb-2',
                    { 'blur-3xl unclickable': feedDetail.artworks.apply_explicit_filter },
                    feedDetail.artworks.apply_explicit_filter ? 'brightness-50' : 'brightness-100'
                  ]"
                  :work="feedDetail.artworks"
                />

                <!-- filter message -->
                <div
                  v-if="feedDetail.artworks.apply_explicit_filter"
                  class="p-2 mx-auto w-full text-center rounded-md opacity-90 theme-color"
                >
                  <div>{{ auth.loggedIn ? $t('explicitContentAlert') : $t('explicitContentAlertForGuest') }}</div>
                  <button class="mx-auto mt-2 primary-button">
                    {{ $t('explicitShowMeThisContent') }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Image view on mobile or smaller device -->
            <!-- <nuxt-link v-if="feedDetail.artworks && isMobile()" :to="'/a/'+feedDetail.id" class="cursor-pointer">
              <ImageList class="p-2" :work="feedDetail.artworks" />
            </nuxt-link> -->
          </div>
        </div>
      </div>

      <!-- reactions -->
      <div
        v-if="feedDetail._count"
        class="flex flex-row justify-between"
      >
        <div v-if="feedDetail._count.feed_comments">
          <b>{{ thousand(feedDetail._count.feed_comments) }}</b> {{ feedDetail._count.feed_comments > 1 ? $t('count.comments') : $t('count.comment') }}
        </div>
        <div v-if="!feedDetail._count.feed_comments" />

        <div
          v-if="auth.loggedIn"
          class="flex flex-row gap-x-2"
        >
          <!-- Like -->
          <div
            class="flex flex-row"
            @click="liked ? unlike() : like()"
          >
            <Icon 
              v-show="liked"
              :id="'feedLikeButton'+feedDetail.id"
              :name="'i-ion-heart'" 
              class="mr-2 text-xl text-red-500 cursor-pointer hover:text-red-500"
            />
            <Icon 
              v-show="!liked"
              :name="'i-ri-heart-3-line'" 
              class="mr-2 text-xl cursor-pointer hover:text-red-500"
            />

            <span>{{ thousand(feedDetail._count.feed_likes) }}</span>
          </div>

          <!-- ellipsis other interaction -->
          <div
            v-if="!feedDetail.artworks"
            class="inline-block relative z-30 dropdown"
          >
            <button 
              type="button" 
              aria-haspopup="true" 
              aria-expanded="true" 
              aria-controls="headlessui-menu-items-feed-more-options"
            >
              <span>
                <Icon
                  :name="'i-ion-ellipsis-vertical-outline'" 
                  class="align-middle icon icon-color"
                />
              </span>
            </button>
            <div class="invisible rounded-md opacity-0 transition-all duration-300 transform origin-top-right scale-95 -translate-y-2 dropdown-menu">
              <div 
                id="headlessui-menu-items-feed-more-options"
                class="absolute right-0 p-1 mt-2 w-56 rounded-md shadow-lg origin-top-right outline-none theme-color"
                aria-labelledby="headlessui-menu-button-1" 
                role="menu"
              >
                <div 
                  v-if="auth.loggedIn && feedDetail.user_id && auth.user.id === feedDetail.user_id" 
                  :to="'/feed/'+feedDetail.id" 
                  class="flex z-50 py-2 px-3 w-full rounded-md transition-all duration-150 cursor-pointer bg-danger hover:button-color parent-icon hover:text-white"
                  @click="openModal('feed-deletion-confirm-modal')"
                >
                  <Icon
                    :name="'i-ion-trash-outline'"
                    class="mr-2 text-base"
                  /> {{ $t('delete') }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- comment section -->
      <!-- comment input -->
      <div class="mt-6 mb-2">
        <div
          v-if="auth.loggedIn"
          class="comment-box"
        >
          <div class="flex flex-col">
            <div class="flex relative flex-col">
              <textarea
                v-model="commentInput"
                class="input form-input"
                :class="[{ 'cursor-not-allowed': submitCommentLoading }, { 'theme-color-secondary textarea': isModal }]"
                :readonly="submitCommentLoading"
                cols="20"
                :rows="commentInput != null && commentInput != '' ? '4' : '0'"
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

        <!-- if user not logged in, hide comment input and show this instead -->
        <div
          v-if="!auth.loggedIn"
          class="p-4 mb-4 text-center rounded-md theme-color-secondary"
        >
          {{ $t('comments.loginOrRegisterToLeaveComment') }}
        </div>
      </div>

      <!-- comments -->
      <div 
        class="comment-content"
        :class="[
          { 'overflow-x-hidden': isModal },
          { 'mb-20': !isModal }
        ]"
      >
        <div 
          v-for="comment in comments"
          :key="comment.id" 
          v-auto-animate 
          class="comment-item"
        >
          <nuxt-link
            class="mr-2"
            :to="'/u/' + comment.users.username"
          >
            <img
              class="w-10 h-10 avatar"
              :src="avatarCoverUrl(comment.users.avatar_bucket, comment.users.avatar_filename)"
              @error="defaultCoverImage"
            >
          </nuxt-link>

          <div class="w-full">
            <div 
              class="p-4 w-full rounded-md"
              :class="!isModal ? 'theme-color' : 'theme-color-secondary'"
            >
              <div class="flex justify-between">
                <nuxt-link
                  :to="'/u/' + comment.users.username"
                  class="mb-2 text-xs font-medium transition-all duration-150 cursor-pointer hover:font-bold"
                >
                  {{ comment.users.name }}
                </nuxt-link>
                <div class="comment-time">
                  {{ formatDate(comment.created_at, true) }}
                </div>
              </div>

              <div>
                {{ comment.comment }}
              </div>

              <div
                v-if="auth.loggedIn"
                class="hidden reactions"
              >
                <div class="flex flex-row">
                  <!-- <span class="reaction" @click="likedComments.includes(comment.id) ? unlikeComment(comment.id) : likeComment(comment.id)">
                    <Icon v-show="!likedComments.includes(comment.id)" :name="'i-ri-heart-3-line'" class="text-gray-500 hover:text-red-500" />
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
                          :to="'/u/' + comment.users.username" 
                          class="flex z-50 py-2 px-3 w-full rounded-md transition-all duration-150 theme-color hover:button-color parent-icon hover:text-white"
                          @click.prevent 
                        >
                          <Icon :name="'i-ri-user-follow-fill'" class="mr-2 text-base" /> {{ $t('viewProfile') }}
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
          class="mx-auto w-full md:w-fit primary-button"
          @click.prevent="loadMoreComments(feedDetail.id)"
        >
          {{ $t('comments.loadOlder') }}
        </div>

        <div
          v-show="comments.length && !showLoadOlderComments"
          class="w-full text-xs italic text-center"
        >
          {{ $t('comments.reachedTheEnd') }}
        </div>

        <div
          v-if="auth.loggedIn && !comments.length"
          class="mt-4 w-full text-xs italic text-center"
        >
          {{ $t('comments.noCommentYet') }}
        </div>
      </div>
    </div>

    <!-- Artwork Modal View -->
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
      @onAccept="removeFeed(feedDetail.id)"
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
import ImageList from './ImageList.vue'
import ModalView from '~/components/artworks/views/ModalView.vue'
import ConfirmationDialog from '~/components/globals/ConfirmationDialog.vue'

/**
 * @stores
 */
const auth = useAuthStore()

const emit = defineEmits (['setMeta', 'showEmpty', 'showError'])
const props = defineProps ({
  id: {
    type: Number,
    default: 0
  },
  section: {
    type: String,
    default: ''
  }
})

const router = useRouter()
const { $router } = useNuxtApp()

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const feedApi = useFeed(oApiConfiguration, fetchOptions())
const { generateArtworkThumb } = useUpyImage()

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

const isModal = props.id === 0

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

    if (!isModal) {
      emit('setMeta', {
        title: data.feed.text.length > 20 ? `${data.feed.text.substring(0, 20)}..` : data.feed.text
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
  perPage: 10,
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
  @apply flex flex-col gap-4;

  .comment-order {
    @apply flex justify-end mb-4 w-full;

    button {
      @apply py-2 px-3 underline rounded-sm cursor-pointer;
    }
  }

  .comment-item {
    @apply flex flex-row w-full;

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

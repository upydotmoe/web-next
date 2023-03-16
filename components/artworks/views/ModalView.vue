<template>
  <button
    class="hidden"
    @click="view"
  />

  <!-- loading -->
  <div
    v-show="loading && isModal"
    class="mx-auto w-full align-middle md:w-1/2"
  >
    <LoadingEmptyErrorMessage
      :loading="loading"
    />
  </div>

  <!--  -->
  <div
    v-show="!loading"
    :class="[
      'work-container work-view',
      { '2xl:w-4/6 2xl:mx-auto p-2 md:p-6 overflow-y-scroll theme-color': isModal }
    ]"
  >
    <main class="flex flex-col w-full lg:flex-row">
      <!-- Left side: Image view; total of views, likes, comments, and other works by user -->
      <section
        id="left-side-section"
        class="left-side"
      >
        <!-- close artwork modal button -->
        <div
          v-if="isModal && isMobileDevice()"
          class="text-right"
        >
          <Icon
            :name="'i-ion-close-outline'"
            :text-size="'text-3xl'"
            @click="closeModal(section + '-modal')"
          />
        </div>

        <!-- preview mode, show this if the artwork isn't published yet -->
        <PreviewAlert
          :is-preview="previewMode"
          :artwork-id="artworkDetail.id"
          @delete-work="deleteWork"
        />

        <div
          v-if="deleteSuccess"
          class="alert-success"
        >
          {{ $t('artworks.successDelete') }}
        </div>

        <!-- mature content alert for explicit and gore content -->
        <MatureContentAlert
          :show="showExplicitAlert"
          :is-explicit="artworkDetail.is_explicit"
          :is-gore="artworkDetail.is_gore"
          @remove-filter="removeFilter"
        />

        <ImgComparisonSlider
          v-if="!loading && artworkDetail.is_before_after"
          hover="hover"
          tabindex="0"
          class="rounded-md slider-example-opacity-and-size rendered"
        >
          <img
            slot="first"
            style="width: 100%"
            :src="beforeAfter.before"
            :class="[
              { 'blur-lg unclickable': showExplicitAlert },
            ]"
          >
          <img
            slot="second"
            style="width: 100%"
            :src="beforeAfter.after"
            :class="[
              { 'blur-lg unclickable': showExplicitAlert },
            ]"
          >
        </ImgComparisonSlider>

        <!-- artwork image data -->
        <Images
          v-if="!loading && !artworkDetail.is_before_after"
          :is-modal="isModal"
          :artwork="artworkDetail"
          :show-explicit-alert="showExplicitAlert"
          :original-artwork="originalArtwork"
        />

        <!-- mini artwork info badges -->
        <section
          v-if="artworkDetail.is_explicit || artworkDetail.is_gore || artworkDetail.is_original_character || artworkDetail.is_before_after"
          id="mini-badge-info-section"
          class="flex flex-row gap-2 mb-4"
        >
          <!-- before-after badge, show this if the artwork is a before-after work -->
          <div
            v-if="artworkDetail.is_before_after"
            class="flex flex-row gap-2 p-2 bg-blue-500 rounded-md"
          >
            <Icon
              :name="'i-tabler-square-half'"
              :text-size="'text-lg'"
              :icon-color="'text-white'"
            />
          </div>


          <!-- explicit badge, show this if the artwork has "explicit" mark -->
          <div
            v-if="artworkDetail.is_explicit"
            :class="[
              'py-2 px-3 font-bold rounded-md',
              isModal ? 'theme-color-secondary' : 'bg-tag'
            ]"
          >
            E
          </div>

          <!-- gore badge, show this if the artwork has "gore" mark -->
          <div
            v-if="artworkDetail.is_gore"
            :class="[
              'py-2 px-3 font-bold rounded-md bg-red-400 text-white'
            ]"
          >
            G
          </div>

          <!-- original character badge, show this if the artwork has "OC" mark -->
          <div
            v-if="artworkDetail.is_original_character"
            class="flex flex-row gap-2 p-2 px-4 rounded-md theme-colored"
          >
            <Icon
              :name="'i-clarity-cursor-hand-click-line'"
              :text-size="'text-sm'"
            />
            {{ $t('artworks.originalCharacter') }}
          </div>
        </section>

        <!-- Intereaction area -->
        <section
          id="interaction-button-section"
          class="interactions"
        >
          <!-- counter -->
          <section
            id="interaction-counter-section"
            class="interactions__left"
          >
            <!-- total of views -->
            <span
              v-show="artworkDetail.views > 0" 
              class="interactions__left__item"
            >
              <Icon :name="'i-mi-eye'" />
              <b>{{ shortNumber(artworkDetail.views) }}</b>
            </span>
            
            <!-- total of likes -->
            <span 
              v-if="artworkDetail._count"
              v-show="artworkDetail._count.artwork_likes > 0"
              class="interactions__left__item hover:href hover:underline"
              @click="showUserLikedModal()"
            >
              <b>{{ thousand(artworkDetail._count.artwork_likes) }}</b> {{ artworkDetail._count.artwork_likes > 1 ? $t('count.likes') : $t('count.like') }}
            </span>
            
            <!-- total of shares -->
            <span 
              v-if="artworkDetail._count"
              v-show="artworkDetail._count.feeds > 0"
              class="interactions__left__item hover:href hover:underline"
              @click="showUserSharedModal()"
            >
              <b>{{ thousand(artworkDetail._count.feeds) }}</b> {{ $t('count.share') }}
            </span>

            <!-- total of comments -->
            <!-- <a
              v-if="artworkDetail._count"
              href="#comments"
              v-show="artworkDetail._count.artwork_comments > 0" 
              class="counter"
            >
              <b>{{ thousand(artworkDetail._count.artwork_comments) }}</b> {{ artworkDetail._count.artwork_comments > 1 ? $t('count.comments') : $t('count.comment') }}
            </a> -->
            
            <!-- total of saves -->
            <!-- <span 
              v-if="artworkDetail._count"
              v-show="artworkDetail._count.artwork_collection_has_works" 
              class="counter"
            >
              <b>{{ thousand(artworkDetail._count.artwork_collection_has_works) }}</b>
            </span> -->
          </section>

          <!-- reaction buttons, such as like, add to collection, add to album, etc. -->
          <section
            v-if="!previewMode"
            id="reaction-button-section"
            class="interactions__items"
          >
            <!-- like button -->
            <span
              v-if="auth.loggedIn"
              class="interactions__item"
            >
              <span @click="liked ? unlike() : like()">
                <Icon 
                  v-show="liked"
                  id="like-button"
                  :name="'i-ion-heart'" 
                  class="text-red-500 hover:text-red-500"
                />
                <Icon 
                  v-show="!liked"
                  :name="'i-ri-heart-3-line'" 
                  class="hover:text-red-500"
                />
              </span>
            </span>

            <!-- save to collection button -->
            <span 
              v-if="auth.loggedIn"
              class="interactions__item"
              @click="showCollectionSelectionModal()"
            >
              <Icon 
                v-show="saved"
                id="save-to-collection-button"
                :name="'i-majesticons-bookmark'" 
                class="text-blue-500 hover:text-blue-500"
              />
              <Icon 
                v-show="!saved"
                :name="'i-majesticons-bookmark-line'" 
                class="hover:text-blue-500"
              />
              
              <span
                v-if="artworkDetail._count && artworkDetail._count.collection_has_artworks"
              >
                {{ thousand(artworkDetail._count.collection_has_artworks) }}
              </span>
            </span>

            <!-- add to album button -->
            <span 
              v-if="auth.loggedIn && (artworkDetail.users && auth.user.id === artworkDetail.users.id)"
              class="interactions__item"
              @click="showAlbumSelectionModal()"
            >
              <Icon 
                v-show="inAlbum"
                id="save-to-album-button"
                :name="'i-ion-folder-open'" 
                class="text-green-500 hover:text-green-500"
              />
              <Icon 
                v-show="!inAlbum"
                :name="'i-bx-photo-album'" 
                class="hover:text-blue-500"
              />
            </span>

            <!-- share button -->
            <span
              v-if="auth.loggedIn"
              class="interactions__item"
            >
              <Icon 
                :name="'i-uil-share'"
                class="hover:text-blue-500"
                @click="showShareToFeedModal()"
              />
            </span>

            <!-- option buttons -->
            <section
              id="ellipsis-menu-section"
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
                  <!-- open / open in new tab button -->
                  <nuxt-link 
                    v-if="isModal" 
                    :to="'/a/'+artworkDetail.id" 
                  >
                    <Icon
                      :name="'i-fluent-arrow-enter-20-filled'"
                      class="mr-2 text-base"
                    />
                    {{ $t('open') }}
                  </nuxt-link>
                  <nuxt-link 
                    v-if="isModal" 
                    :to="'/a/'+artworkDetail.id" 
                    target="_blank" 
                  >
                    <Icon
                      :name="'i-ci-external-link'"
                      class="mr-2 text-base"
                    />
                    {{ $t('openInNewTab') }}
                  </nuxt-link>
                  
                  <div
                    v-if="isModal"
                    class="custom-divider"
                  />

                  <!-- report button -->
                  <div
                    v-if="auth.loggedIn && artworkDetail.users && auth.user.id != artworkDetail.users.id && !auth.user.is_admin && !auth.user.is_moderator"
                    :class="{ 'rounded-t-md': !isModal }"
                  >
                    <a @click.prevent="showReportModal()">
                      <Icon
                        :name="'i-akar-icons-flag'"
                        class="mr-2 text-base"
                      />
                      {{ $t('report') }}
                    </a>
                  </div>

                  <!-- copy sharable link button -->
                  <div>
                    <a @click.prevent="copyLink('/a/'+artworkDetail.id)">
                      <Icon
                        :name="'i-icon-park-outline-copy'"
                        class="mr-2 text-base"
                      />
                      {{ $t('copySharableLink') }}
                    </a>
                  </div>

                  <div
                    v-if="auth.loggedIn && artworkDetail.users && auth.user.id === artworkDetail.users.id"
                    class="custom-divider"
                  />

                  <!-- update artwork button -->
                  <a
                    v-if="auth.loggedIn && artworkDetail.users && auth.user.id === artworkDetail.users.id"
                    :href="'/artworks/update/'+artworkDetail.id"
                  >
                    <Icon
                      :name="'i-ion-settings-outline'"
                      class="mr-2 text-base"
                    />
                    {{ $t('update') }}
                  </a>

                  <!-- delete artwork button -->
                  <div v-if="auth.loggedIn && artworkDetail.users && auth.user.id === artworkDetail.users.id">
                    <a @click.prevent="openModal('work-deletion-confirm-modal')">
                      <Icon
                        :name="'i-akar-icons-trash-bin'"
                        class="mr-2 text-base"
                      />
                      {{ $t('delete') }}
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </section>
        </section>

        <!-- 
          artwork basic info, such as title, description, etc. 
          (show this only on desktop device or wider device screen)
        -->
        <ModalViewInfo
          :section="section"
          class="flex-md-hidden"
          :is-modal="isModal"
          :artwork-detail="artworkDetail"
          :preview-mode="previewMode"
          :is-desktop="true"
        />

        <!--
          other artowrks by artist list
          (show this only on desktop device or wider device screen)
        -->
        <keep-alive>
          <ArtistWorks
            v-if="!loading"
            class="mb-6 hidden-md-flex"
            :artwork-detail="artworkDetail"
            :view="view"
            :is-href="!isModal"
            :keep-artist-page-number="true"
            :pagination-per-page="isMobile() ? 4 : 4"
          />
        </keep-alive>
      </section>

      <!-- Right side: artwork information, comment section -->
      <section
        id="right-side-section"
        class="right-side"
      >
        <!-- 
          artwork basic info, such as title, description, etc. 
          (show this only on non-desktop device, such as mobile or smaller device)
        -->
        <ModalViewInfo
          :section="section"
          class="hidden-md-flex"
          :is-modal="isModal"
          :artwork-detail="artworkDetail"
          :preview-mode="previewMode"
          :is-desktop="false"
        />

        <!--
          other artowrks by artist list
          (show this only on non-desktop device, such as mobile or smaller device)
        -->
        <ArtistWorks 
          v-if="!loading"
          class="flex-md-hidden"
          :artwork-detail="artworkDetail"
          :view="view"
          :is-href="!isModal"
          :keep-artist-page-number="true"
          :pagination-per-page="isMobile() ? 4 : 4"
        />

        <!-- 
          original artwork info
          (show this only if current artwork is a redrawn version of other artwork)
         -->
        <Redraws
          v-if="!previewMode && !loading"
          :artwork="artworkDetail"
        />

        <div class="custom-divider" />

        <!-- comment section -->
        <ArtworkComments
          v-if="!previewMode && !loading"
          :artwork="artworkDetail"
          :is-modal="isModal"
        />
      </section>
    </main>

    <div class="custom-divider" />

    <!-- related artworks -->
    <section
      v-if="isPublished"
      id="related-artworks-section"
      class="mt-4 w-full"
    >
      <div class="title">
        {{ $t('artworks.similarArtworks') }}
      </div>

      <RelatedArtworks
        v-if="!loading && isPublished"
        :work-id="artworkDetail.id"
        :is-modal="isModal"
        :view="view"
      />
    </section>

    <!-- add or remove from selected collection(s) -->
    <ManageSave 
      v-if="!loading"
      id="collection-selection-modal"
      ref="collectionSelectionModalRef"
      :modal-id="'collection-selection-modal'"
      :work-id="artworkDetail.id"
      class="modal"
      @save="save"
    />

    <!-- add or remove from selected album(s) -->
    <ManageAlbum
      v-if="!loading && (auth.loggedIn && artworkDetail.users && auth.user.id == artworkDetail.users.id)"
      id="album-selection-modal"
      ref="albumSelectionModalRef"
      class="modal"
      :modal-id="'album-selection-modal'"
      :work-id="artworkDetail.id"
      @addedToAlbum="addedToAlbum"
    />

    <!-- Work deletion confirmation dialog -->
    <ConfirmationDialog
      id="work-deletion-confirm-modal"
      class="modal"
      :modal-id="'work-deletion-confirm-modal'"
      :message="`${$t('alert.areYouSure')} ${$t('alert.youCannotUndoThisAction')}`"
      @on-accept="deleteWork(artworkDetail.id)"
    />

    <!-- Report modal -->
    <ReportModal 
      id="report-modal"
      ref="reportModalRef"
      class="modal"
      :type="POST_TYPES.ARTWORK"
      :post-id="artworkDetail.id"
      :report-status="reportStatus"
    />

    <!-- Share to Feed -->
    <ShareArtworkToFeedModal
      id="share-to-feed-modal"
      ref="shareToFeedModalRef"
      class="modal"
      :post-id="artworkDetail.id"
    />

    <!-- User liked list -->
    <UserLiked
      id="user-liked-modal"
      class="modal"
      :work-id="artworkDetail.id"
    />

    <!-- User shared list -->
    <UserShared
      id="user-shared-modal"
      class="modal"
      :work-id="artworkDetail.id"
    />
    
    <!-- Link copied notification -->
    <SplashAlert 
      v-show="copied"
      id="copy-alert"
      :text="$t('linkCopied')"
      :icon="'i-bi-check-all'"
    />
  </div>
</template>

<script setup>
import 'viewerjs/dist/viewer.css'
import { useClipboard } from '@vueuse/core'
import { ImgComparisonSlider } from '@img-comparison-slider/vue'

// constants
import { POST_TYPES } from '~/utils/constants'

// stores
import useAuthStore from '@/stores/auth.store'

// components
import ModalViewInfo from './ModalViewInfo.vue'
import ArtistWorks from '~/components/artworks/views/ArtistWorks.vue'
import Icon from '~/components/globals/Icon.vue'
import Spinner from '~/components/globals/Spinner.vue'
import ManageSave from '~/components/artworks/ManageSave.vue'
import ManageAlbum from '~/components/albums/ManageAlbum'
import ConfirmationDialog from '~/components/globals/ConfirmationDialog.vue'
import SplashAlert from '~/components/globals/SplashAlert.vue'
import ReportModal from '~/components/reports/ReportModal.vue'
import ShareArtworkToFeedModal from '~/components/feeds/ShareArtworkToFeedModal.vue'
import LoadingEmptyErrorMessage from '~/components/globals/LoadingEmptyErrorMessage.vue'
import UserLiked from '~/components/artworks/views/UserLiked.vue'
import UserShared from '~/components/artworks/views/UserShared.vue'
import WorkList from '~/components/artworks/WorkList.vue'
import RelatedArtworks from '~/components/artworks/RelatedArtworks.vue'
import PreviewAlert from './PreviewAlert.vue'
import MatureContentAlert from './MatureContentAlert.vue'
import Images from './Images.vue'
import ArtworkComments from './ArtworkComments.vue'
import Redraws from './Redraws.vue'

// stores
const auth = useAuthStore()

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const { applyExplicitFilter, removeExplicitFilter } = useUpyImage()
const artworkApi = useArtwork(oApiConfiguration, fetchOptions())
const reportApi = useReport(oApiConfiguration, fetchOptions())
const { generateSemiCompressedArtworkUrl } = useUpyImage()

const emit = defineEmits(['setMeta', 'stopLoading', 'showEmpty', 'showError'])
const props = defineProps({
  id: {
    type: Number,
    default: 0
  },
  section: {
    type: String,
    default: ''
  }
})

const runtimeConfig = useRuntimeConfig()
const router = useRouter()
const route = useRoute()

/**
 * @watchers
 */
watch (() => route.query, () => {
  setTimeout(() => {
    // close modal on changing route or going back to previous page
    closeArtworkModals()

    // close collection selection modal
    useModal().closeModal('collection-selection-modal')

    // close album selection modal
    useModal().closeModal('album-selection-modal')

    // close report modal
    useModal().closeModal('report-modal')
  }, 1)
})

onMounted (() => {
  if (props.id !== 0) {
    view(props.id)
  }

  window.addEventListener('keydown', (e) => {
    const collectionSelectorModalEl = document.getElementById('collection-selection-modal')
    const albumSelectorModalEl = document.getElementById('album-selection-modal')
    const reportModalEl = document.getElementById('report-modal')
    const viewerModalEl = document.querySelectorAll('.viewer-in')

    if (e.key === 'Escape' 
        && (!collectionSelectorModalEl || collectionSelectorModalEl.style.display != 'flex')
        && (!albumSelectorModalEl || albumSelectorModalEl.style.display != 'flex')
        && (!reportModalEl || reportModalEl.style.display != 'flex')
        && !viewerModalEl.length
    ) {
      closeArtworkModals()
    }
  })
})

const isModal = props.id === 0

/**
 * @explicit_filter
 */
const showExplicitAlert = ref(false)
const removeFilter = () => {
  showExplicitAlert.value = false
  removeExplicitFilter()
}

/** Increase view count */
const increaseView = async (workId) => {
  await artworkApi.incraseViewCount(workId)
}

/** Open the modal view function */
const previewMode = ref(false)

const loading = ref(true)

const artworkDetail = ref({})
const isPublished = ref(false)

const liked = ref(false)
const saved = ref(false)
const inAlbum = ref(false)

const beforeAfter = ref({
  before: '',
  after: ''
})

const view = async (selectedWorkId) => {
  previewMode.value = false
  loading.value = true

  // fetch artwork detail
  const [data, error] = await artworkApi.getWorkById(selectedWorkId)

  if (error) {
    if (error == 'Work not found') {
      emit('showEmpty')
    } else {
      emit('showError')
    }
  } else {
    artworkDetail.value = data

    // if before-after, form the before and after image
    if (artworkDetail.value.is_before_after) {
      const artworkAssets = artworkDetail.value.artwork_assets
      for (let beforeAfterIdx = 0; beforeAfterIdx < artworkAssets.length; beforeAfterIdx++) {
        beforeAfter.value = {
          before: generateSemiCompressedArtworkUrl(artworkAssets[0].bucket, artworkAssets[0].filename, false),
          after: generateSemiCompressedArtworkUrl(artworkAssets[1].bucket, artworkAssets[1].filename, false)
        }
      }
    }
    
    // check if artwork marked as explicit or gore content
    // if yes then apply filter to hide the artwork from users that didn't activated the explicit/gore content
    if (
      (!auth.loggedIn && data.is_explicit) 
      || (data.is_explicit && !auth.user.user_settings.show_explicit) 
      || (data.is_gore && !auth.user.user_settings.show_gore)
    ) {
      showExplicitAlert.value = true
      applyExplicitFilter()
    } else {
      showExplicitAlert.value = false
    }

    // apply liked, saved and saved in album state
    liked.value = data.liked
    saved.value = data.saved
    inAlbum.value = data.in_album

    // get publish status, if it's not published yet, redirect non-authorized user to homepage, otherwise show the artwork
    isPublished.value = useDate().formatApiToWeb(data.scheduled_post) < useDate().currentUtcTime()
    if (!isPublished.value) {
      if (auth.user.id !== data.users.id) {
        router.push('/')
      } else {
        previewMode.value = true
      }
    } else {
      // increase view count
      if (!auth.loggedIn || auth.user.id !== data.users.id) {
        await increaseView(selectedWorkId)
      }

      // Get report status if user is logged in, if user alreadey reported the post, then prevent user to re-report it
      if (auth.loggedIn) {
        await getReportStatus(selectedWorkId)
      }
    }

    if (!isModal) {
      emit('setMeta', {
        title: artworkDetail.value.title
      })
    }
  }

  loading.value = false
  emit('stopLoading')
}

const reportStatus = ref({})
const getReportStatus = async (workId) => {
  const [report, error] = await reportApi.getReportStatus({
    type: POST_TYPES.ARTWORK,
    postId: workId
  })

  if (error) {
    // todo: handle error
  } else if (report.length) {
    reportStatus.value = report[0]
  } else {
    reportStatus.value = {}
  }
}

/** Likes */
const like = async () => {
  const [success, error] = await artworkApi.like({
    workId: artworkDetail.value.id
  })
  
  if (success) {
    liked.value = true

    // animate
    const artworkLikeButtonEl = document.getElementById('like-button')
    artworkLikeButtonEl.classList.add('animate-bounce')
    setInterval(() => {
      artworkLikeButtonEl.classList.remove('animate-bounce')
    }, 2500)
  } else {
    // todo: handle error
  }
}

const showUserLikedModal = () => {
  useModal().openModal('user-liked-modal')
}

const showUserSharedModal = () => {
  useModal().openModal('user-shared-modal')
}

const unlike = async () => {
  const [success, error] = await artworkApi.unlike({
    workId: artworkDetail.value.id
  })
  
  if (success) {
    liked.value = false
  } else {
    // todo: handle error
  }
}

/** Cancel publish or delete work */
const deleteSuccess = ref(false)
const deleteWork = async (workId) => {
  const [success, error] = await artworkApi.deleteWork({
    workId: [workId]
  })

  if (success) {
    deleteSuccess.value = true

    setTimeout(() => {
      router.push({
        path: '/',
        replace: true,
        force: true
      })
    }, 1000)
  } else {
    // todo: handle error
  }
}

/** 
 * ====================================================================================================================
 * COLLECTIONS
 * ====================================================================================================================
*/
/**
 * Show collection selection modal
 * When triggering this action it will automatically fetch where the item were saved, and
 * automatically select the selected collections.
 */
const collectionSelectionModalRef = ref(null)
const showCollectionSelectionModal = () => {
  useModal().openModal('collection-selection-modal')

  collectionSelectionModalRef.value.fetchCollection()
  collectionSelectionModalRef.value.fetchCurrentSaved()
}

/**
 * This method will be triggered via event handling called `@save` on component `ManageSave` 
 * once the user selects a collection and clicks the save button, and it will automatically close 
 * the modal and update the collection selection.
 */
const save = (unsaved) => {
  if (unsaved) {
    saved.value = false
  } else {
    saved.value = true
  }

  // animate
  useBounceAnimation().animate('save-to-collection-button')
}

/** 
 * ====================================================================================================================
 * ALBUMS
 * ====================================================================================================================
*/

/**
 * Show album selection modal
 * When triggering this action it will automatically fetch where the item were saved and 
 * automatically select the selected albums.
 */
const albumSelectionModalRef = ref(null)
const showAlbumSelectionModal = () => {
  useModal().openModal('album-selection-modal')

  albumSelectionModalRef.value.fetchTop()
  albumSelectionModalRef.value.fetchCurrentSaved()
}

/**
 * This method will be triggered via event handling called `@addedToAlbum` on component `ManageAlbum` 
 * once the user selects an album and clicks the save button, and it will automatically close 
 * the modal and update the album selection.
 */
const addedToAlbum = (unsaved) => {
  if (unsaved) {
    inAlbum.value = false
  } else {
    inAlbum.value = true
  }

  // animate
  useBounceAnimation().animate('save-to-album-button')
}

/**
 * =
 * SHARE TO FEED
 * =
 */
const showShareToFeedModal = () => {
  useModal().openModal('share-to-feed-modal')
}

/**
 * ====================================================================================================================
 * MISC
 * ====================================================================================================================
 */
// Copy current work url to clipboard
const copied = ref(false)
let splashInterval
const copyLink = (link) => {
  const source = ref(runtimeConfig.public.appUrl + link)
  const { copy } = useClipboard({ source })
  copy()

  // show splash notification
  useSplash().splash(splashInterval, copied, 'copy-alert')
}

/**
 * @reportModal
 * Show report modal
 */
const reportModalRef = ref(null)
const showReportModal = () => {
  useModal().openModal('report-modal')
}

const closeArtworkModals = () => {
  useModal().closeModal(`${props.section}-modal`)
}

defineExpose({
  view
})
</script>

<style lang="scss" scoped>
@import "~/assets/css/artworks/view.scss";
@import '~/assets/css/artworks/list.scss';

.slider-example-opacity-and-size {
  --default-handle-width: 100px;
}

.slider-example-opacity-and-size:focus {
  --default-handle-opacity: 0;
}
</style>
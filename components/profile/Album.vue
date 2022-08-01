<template>
  <div>
    <!-- top buttons -->
    <div class="mb-4 w-full">
      <div v-if="!selectedAlbum" class="flex flex-row justify-between">
        <div class="flex flex-row">
          <div 
            class="ml-0 primary-button theme-color-secondary"
            :class="{ 'button-color text-white': activeCategory === 'artwork' }"
            @click="activeCategory = 'artwork'" 
          >
            {{ $t('artworks.artwork') }}
            <span class="px-1 ml-2 font-normal rounded" :class="activeCategory === 'artwork' ? 'theme-color' : 'button-color text-white'">{{ counter.artwork }}</span>
          </div>
          <!-- <div 
            class="primary-button theme-color-secondary"
            :class="{ 'button-color text-white': activeCategory === 'comic' }"
            @click="activeCategory = 'comic'" 
          >
            Comic
          </div> -->
          <!-- <div 
            class="primary-button theme-color-secondary"
            :class="{ 'button-color text-white': activeCategory === 'tutorial' }"
            @click="activeCategory = 'tutorial'" 
          >
            Tutorial
          </div> -->
        </div>

        <div v-if="$auth.loggedIn && $auth.user.id === userId">
          <div class="icon-button" @click="openModal('album-form-modal')">
            <Icon :name="'add-outline'" />
          </div>
        </div>
      </div>

      <!-- back button from album list view -->
      <div v-if="selectedAlbum" class="flex flex-row justify-between">
        <!-- left side -->
        <div>
          <div 
            class="ml-0 icon-button" 
            @click="back()"
          >
            <Icon :name="'arrow-back-outline'" />
          </div>
        </div>

        <!-- right side -->
        <div class="flex flex-row">
          <!-- manage items -->
          <div v-show="$auth.loggedIn && ($auth.user.id === userId) && config.showManageButton" class="flex flex-row gap-2">
            <button class="action-button secondary-button" @click="config.manageMode = !config.manageMode">
              <Icon :name="config.manageMode ? 'close-outline' : 'checkbox-outline'" />
              {{ config.manageMode ? $t('quit') : $t('manage') }}
            </button>
            <button 
              v-show="config.manageMode"
              class="flex flex-row"
              :class="selectedItems.length > 0 ? 'danger-button' : 'disabled-button cursor-not-allowed'"
              @click="selectedItems.length > 0 ? openModal('item-deletion-confirm-modal') : null"
            >
              <Icon :name="'trash-outline'" />
              {{ $t('albums.removeSelected') }}
            </button>
          </div>

          <div v-show="$auth.loggedIn && ($auth.user.id === userId) && !config.manageMode" class="flex flex-row gap-2">
            <button class="icon-button" @click="editAlbum()">
              <Icon :name="'settings-outline'" />
            </button>
            <button class="danger-button-color b-button" @click="openModal('album-deletion-confirm-modal')">
              <Icon :name="'trash-bin-outline'" />
            </button>
          </div>
        </div>
      </div>

      <!-- manage mode message -->
      <div v-show="config.manageMode" class="p-2 mt-4 text-black bg-yellow-200 rounded-md">
        {{ $t('albums.manageModeActiveMessage') }}
      </div>
    </div>

    <!-- content -->
    <div v-if="!selectedAlbum" class="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <div
        v-for="album in albums"
        :key="album.id"
        class="p-3 rounded-md cursor-pointer"
        :class="album.is_public ? 'theme-color-secondary' : 'theme-color-secondary border-red-300 border-2'"
        @click="selectedAlbum = album.id"
      >
        <!-- if selected album type is an artwork -->
        <ArtworkThumbnail
          v-if="album.type === 'artwork'"
          :album="album"
        />
        
        <div class="flex flex-row pb-1 mt-4 font-bold">
          <Icon v-if="!album.is_public" :name="'lock-closed'" class="mr-2 cursor-default" />
          <span class="text-xs font-normal">{{ album.name }}</span>
        </div>
      </div>
    </div>

    <div v-if="config.showLoadMore && !selectedAlbum" class="mt-4 w-full primary-button" @click="loadMore">
      {{ $t('loadMore') }}
    </div>

    <ErrorMessages 
      :loading="loading"
      :empty="isEmpty"
      :error="isError"
      :fetch="fetch"
    />

    <!-- Create new album -->
    <AlbumFormModal 
      v-if="!loading && !selectedAlbum"
      id="album-form-modal"
      :modal-id="'album-form-modal'"
      :category="activeCategory"
      class="modal"
      @created="created"
    />
    <SplashAlert 
      v-show="isCreated"
      id="created-alert"
      :text="$t('albums.created')"
    />
    
    <!-- Edit album form -->
    <EditForm 
      v-if="!loading && selectedAlbum"
      id="album-edit-form-modal"
      ref="albumEditFormModalRef"
      :modal-id="'album-edit-form-modal'"
      :album-id="selectedAlbum"
      class="modal"
      @updated="updated"
    />

    <!-- Album deletion confirmation dialog -->
    <ConfirmationDialog
      id="album-deletion-confirm-modal"
      :modal-id="'album-deletion-confirm-modal'"
      :message="'All saved items in this album will be deleted. Do you still want to delete this album?'"
      class="modal"
      @onAccept="deleteAlbum"
    />

    <!-- Confirmation dialog for removing item(s) from album -->
    <ConfirmationDialog
      id="item-deletion-confirm-modal"
      :modal-id="'item-deletion-confirm-modal'"
      :message="'Selected item(s) will be removed from this album. Do you still want to remove them?'"
      class="modal"
      @onAccept="removeItemsFromAlbum"
    />

    <!-- List of album items -->
    <List 
      v-if="selectedAlbum && !loading"
      :id="selectedAlbum"
      ref="albumDetailRef"
      :manage-mode="config.manageMode"
      @onAlbumEmpty="hideManageButton"
      @feedManageList="feedManageList"
    />
  </div>
</template>

<script setup>
// components
import Icon from '~/components/globals/Icon.vue'
import AlbumFormModal from '~/components/albums/AlbumFormModal.vue'
import List from '~/components/albums/List.vue'
import ConfirmationDialog from '~/components/globals/ConfirmationDialog.vue'
import SplashAlert from '~/components/globals/SplashAlert.vue'
import EditForm from '~/components/albums/EditForm.vue'
import ArtworkThumbnail from '~/components/albums/thumbnails/ArtworkThumbnail.vue'
import ErrorMessages from '~/components/globals/ErrorMessages.vue'

// composables
import useApiFetch from '~/composables/useApiFetch'
import useAlbum from '~/composables/users/useAlbum'
import useSplash from '~/composables/useSplash'
import useModal from '~/composables/useModal'

const props = defineProps({
  userId: {
    type: Number,
    default: 0
  }
})

onMounted(() => {
  fetch()
})

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const album = useAlbum(oApiConfiguration, fetchOptions())

const loading = ref(false)
const activeCategory = ref('artwork')
const selectedAlbum = ref(0)

const albums = ref([])
const config = ref({
  pagination: {
    page: 0,
    perPage: 4,
    firstLoad: 8
  },
  showLoadMore: false,
  manageMode: false,
  showManageButton: true
})
const counter = ref({
  artwork: 0
})
const fetch = async () => {
  loading.value = true

  const [data, showLoadMore, error] = await album.fetchAlbums(
    props.userId, 
    activeCategory.value,
    config.value.pagination.page === 0 ? config.value.pagination.firstLoad : config.value.pagination.perPage, 
    config.value.pagination.page
  )

  if (error) {
    showError()
  } else {
    if (!data.length) {
      config.value.manageMode = false
      showEmpty()
    }

    data.forEach((album) => {
      albums.value.push(album)
    })

    config.value.pagination.page += 1
    config.value.showLoadMore = showLoadMore

    // count artwork albums
    const [artworkAlbumTotal] = await album.countArtworkAlbums(props.userId)
    counter.value.artwork = artworkAlbumTotal
  }

  loading.value = false
}

const loadMore = async () => await fetch()

/** Show empty if there's no album to show */
const isEmpty = ref(false)
const showEmpty = () => {
  isEmpty.value = true
  config.value.showLoadMore = false
}

/** Show error message when error occured while trying to fetch album list */
const isError = ref(false)
const showError = () => {
  loading.value = false
  isError.value = true
  config.value.showLoadMore = false
}

// reset reactivity and refetch the list
const reset = async () => {
  loading.value = false
  isEmpty.value = false
  isError.value = false

  config.value.pagination.page = 0
  albums.value = []

  await fetch()
}

// on album created
const isCreated = ref(false)
let splashInterval
const created = async () => {
  useSplash().splash(splashInterval, isCreated, 'created-alert')
  await reset()
}

const albumEditFormModalRef = ref(null)
const editAlbum = () => {
  albumEditFormModalRef.value.fetch(selectedAlbum.value)

  useModal().openModal('album-edit-form-modal')
}

// on album updated
const albumDetailRef = ref(null)
const updated = (updatedData) => {
  albumDetailRef.value.fetchInfo()

  albums.value.forEach((album) => {
    if (album.id === updatedData.id) {
      album.name = updatedData.name
      album.description = updatedData.description
      album.is_public = updatedData.is_public
    }
  })
}

// remove selected items from album
const removeItemsFromAlbum = () => {
  albumDetailRef.value.removeItems()
}

const selectedItems = ref([])
const feedManageList = (selectedList) => {
  selectedItems.value = selectedList
}

// on delete confirmation dialog accepted, process to delete the album
const deleteAlbum = async () => {
  if (selectedAlbum.value !== 0) {
    const [success, error] = await album.deleteAlbum(selectedAlbum.value)
    
    if (success) {
      selectedAlbum.value = 0
      reset()
    }
  }
}

const hideManageButton = (isEmpty) => {
  config.value.showManageButton = !isEmpty
  config.value.manageMode = false
}

const back = () => {
  selectedAlbum.value = 0
  config.value.showManageButton = false
  config.value.manageMode = false
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/tailwind.scss';
</style>

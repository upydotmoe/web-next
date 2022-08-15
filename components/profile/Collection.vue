<template>
  <div>
    <!-- top buttons -->
    <div class="mb-4 w-full">
      <div v-if="!selectedCollection" class="flex flex-row justify-between">
        <div class="flex flex-row">
          <div 
            class="ml-0 primary-button theme-color-secondary"
            :class="{ 'button-color text-white': activeType === 'artwork' }"
            @click="activeType = 'artwork'" 
          >
            {{ $t('artworks.artwork') }}
            <span class="px-1 ml-2 font-normal rounded" :class="activeType === 'artwork' ? 'theme-color' : 'button-color text-white'">{{ counter.artwork }}</span>
          </div>
          <!-- <div 
            class="primary-button theme-color-secondary"
            :class="{ 'button-color text-white': activeType === 'comic' }"
            @click="activeType = 'comic'" 
          >
            Comic
          </div> -->
          <!-- <div 
            class="primary-button theme-color-secondary"
            :class="{ 'button-color text-white': activeType === 'tutorial' }"
            @click="activeType = 'tutorial'" 
          >
            Tutorial
          </div> -->
        </div>

        <div v-if="auth.loggedIn && auth.user.id === userId">
          <div class="icon-button" @click="openModal('collection-form-modal')">
            <Icon :name="'add-outline'" />
          </div>
        </div>
      </div>

      <!-- back button from collection list view -->
      <div v-if="selectedCollection" class="flex flex-row justify-between">
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
          <div v-show="auth.loggedIn && (auth.user.id === userId) && config.showManageButton" class="flex flex-row gap-2">
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
              {{ $t('collections.removeSelected') }}
            </button>
          </div>

          <div v-show="auth.loggedIn && (auth.user.id === userId) && !config.manageMode" class="flex flex-row gap-2">
            <button class="icon-button" @click="editCollection()">
              <Icon :name="'settings-outline'" />
            </button>
            <button class="danger-button-color b-button" @click="openModal('collection-deletion-confirm-modal')">
              <Icon :name="'trash-bin-outline'" />
            </button>
          </div>
        </div>
      </div>

      <!-- manage mode message -->
      <div v-show="config.manageMode" class="p-2 mt-4 text-black bg-yellow-200 rounded-md">
        {{ $t('collections.manageModeActiveMessage') }}
      </div>
    </div>

    <!-- content -->
    <div v-if="!selectedCollection" class="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <div
        v-for="collection in collections"
        :key="collection.id"
        class="p-3 rounded-md cursor-pointer"
        :class="collection.is_public ? 'theme-color-secondary' : 'theme-color-secondary border-red-300 border-2'"
        @click="selectedCollection = collection.id"
      >
        <!-- if selected collection type is an artwork -->
        <ArtworkThumbnail
          v-if="collection.type === 'artwork'"
          :collection="collection"
        />
        
        <div class="flex flex-row pb-1 mt-4 font-bold">
          <Icon v-if="!collection.is_public" :name="'lock-closed'" class="mr-2 cursor-default" />
          <span class="text-xs font-normal">{{ collection.name }}</span>
        </div>
      </div>
    </div>

    <div v-if="config.showLoadMore && !selectedCollection" class="mt-4 w-full primary-button" @click="loadMore">
      {{ $t('loadMore') }}
    </div>

    <ErrorMessages 
      :loading="loading"
      :empty="isEmpty"
      :error="isError"
      :fetch="fetch"
    />

    <!-- Create new collection -->
    <CollectionFormModal 
      v-if="!loading && !selectedCollection"
      id="collection-form-modal"
      :modal-id="'collection-form-modal'"
      :category="activeType"
      class="modal"
      @created="created"
    />
    <SplashAlert 
      v-show="isCreated"
      id="created-alert"
      :text="$t('collections.created')"
    />
    
    <!-- Edit collection form -->
    <EditForm 
      v-if="!loading && selectedCollection"
      id="collection-edit-form-modal"
      ref="collectionEditFormModalRef"
      :modal-id="'collection-edit-form-modal'"
      :collection-id="selectedCollection"
      class="modal"
      @updated="updated"
    />

    <!-- Collection deletion confirmation dialog -->
    <ConfirmationDialog
      id="collection-deletion-confirm-modal"
      :modal-id="'collection-deletion-confirm-modal'"
      :message="'All saved items in this collection will be deleted. Do you still want to delete this collection?'"
      class="modal"
      @onAccept="deleteCollection"
    />

    <!-- Confirmation dialog for removing item(s) from collection -->
    <ConfirmationDialog
      id="item-deletion-confirm-modal"
      :modal-id="'item-deletion-confirm-modal'"
      :message="'Selected item(s) will be removed from this collection. Do you still want to remove them?'"
      class="modal"
      @onAccept="removeItemsFromCollection"
    />

    <!-- List of collection items -->
    <List 
      v-if="selectedCollection && !loading"
      :id="selectedCollection"
      ref="collectionDetailRef"
      :manage-mode="config.manageMode"
      :type="activeType"
      @onCollectionEmpty="hideManageButton"
      @feedManageList="feedManageList"
    />
  </div>
</template>

<script setup>
// components
import Icon from '~/components/globals/Icon.vue'
import CollectionFormModal from '~/components/collections/CollectionFormModal.vue'
import List from '~/components/collections/List.vue'
import ConfirmationDialog from '~/components/globals/ConfirmationDialog.vue'
import SplashAlert from '~/components/globals/SplashAlert.vue'
import EditForm from '~/components/collections/EditForm.vue'
import ArtworkThumbnail from '~/components/collections/thumbnails/ArtworkThumbnail.vue'
import ErrorMessages from '~/components/globals/ErrorMessages.vue'

// composables
import useCollection from '~/composables/users/useCollection'

const props = defineProps ({
  userId: {
    type: Number,
    default: 0
  }
})

onMounted (() => {
  fetch()
})

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const collectionApi = useCollection(oApiConfiguration, fetchOptions())

const loading = ref(false)
const activeType = ref('artwork')
const selectedCollection = ref(0)

const collections = ref([])
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

  const [data, showLoadMore, error] = await collectionApi.fetchCollections(
    props.userId, 
    activeType.value,
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
    data.forEach((collection) => {
      collections.value.push(collection)
    })

    config.value.pagination.page += 1
    config.value.showLoadMore = showLoadMore

    // count artwork collections
    const [artworkCollectionTotal] = await collectionApi.countArtworkCollections(props.userId)
    counter.value.artwork = artworkCollectionTotal
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
  collections.value = []

  await fetch()
}

const hideManageButton = (isEmpty) => {
  config.value.showManageButton = true

  if (isEmpty) {
    config.value.showManageButton = false
  }
}

// on collection created
const isCreated = ref(false)
let splashInterval
const created = async () => {
  useSplash().splash(splashInterval, isCreated, 'created-alert')
  await reset()
}

const collectionEditFormModalRef = ref(null)
const editCollection = () => {
  collectionEditFormModalRef.value.fetch(selectedCollection.value)

  useModal().openModal('collection-edit-form-modal')
}

// on collection updated
const collectionDetailRef = ref(null)
const updated = (updatedData) => {
  collectionDetailRef.value.fetchInfo()

  collections.value.forEach((collection) => {
    if (collection.id === updatedData.id) {
      collection.name = updatedData.name
      collection.description = updatedData.description
      collection.is_public = updatedData.is_public
    }
  })
}

const selectedItems = ref([])
const feedManageList = (selectedList) => {
  selectedItems.value = selectedList
}

// remove selected items from collection
const removeItemsFromCollection = () => {
  collectionDetailRef.value.removeItem()
}

// on delete confirmation dialog accepted, process to delete the collection
const deleteCollection = async () => {
  if (selectedCollection.value !== 0) {
    const [success, error] = await collectionApi.deleteCollection(selectedCollection.value)
    
    if (success) {
      selectedCollection.value = 0
      reset()
    }
  }
}

const back = () => {
  selectedCollection.value = 0
  config.value.showManageButton = false
  config.value.manageMode = false
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/tailwind.scss';
</style>

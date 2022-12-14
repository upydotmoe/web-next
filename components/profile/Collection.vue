<template>
  <div>
    <!-- top buttons -->
    <div class="mb-2 w-full">
      <div v-if="!selectedCollection" class="flex flex-row justify-between">
        <div class="flex flex-row">
          <div 
            class="ml-0 primary-button theme-color-secondary"
            :class="{ 'button-color text-white': activeType === 'artwork' }"
            @click="activeType = 'artwork'" 
          >
            {{ $t('artworks.artwork') }}
            <span class="px-1 ml-2 font-normal rounded" :class="activeType === 'artwork' ? 'theme-color' : 'button-color text-white'">{{ thousand(counter.artwork) }}</span>
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
          <div class="flex flex-row icon-button" @click="isCanCreateCollection ? openModal('collection-form-modal') : null">
            <Icon :name="'i-ion-add-outline'" />
            <ProBadge v-if="!isCanCreateCollection" class="ml-1" />
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
            <Icon :name="'i-ic-baseline-keyboard-arrow-left'" />
          </div>
        </div>

        <!-- right side -->
        <div class="flex flex-row">
          <!-- manage items -->
          <div v-show="auth.loggedIn && (auth.user.id === userId) && config.showManageButton" class="flex flex-row gap-2">
            <button
              :class="[
                'action-button',
                config.manageMode ? 'danger-button' : 'secondary-button'
              ]"
              @click="config.manageMode = !config.manageMode"
            >
              <Icon
                :name="config.manageMode ?
                  'i-ion-close-outline' :
                  'i-material-symbols-library-add-check-outline-rounded'"
              />
              {{ config.manageMode ? $t('quit') : $t('manage') }}
            </button>
            <button 
              v-show="config.manageMode"
              @click="selectedItems.length > 0 ? openModal('item-deletion-confirm-modal') : null"
              :class="[
                'flex flex-row',
                selectedItems.length > 0 ? 'danger-button' : 'disabled-button cursor-not-allowed'
              ]"
            >
              <Icon :name="'i-akar-icons-trash-bin'" />
              {{ $t('collections.removeSelected') }}
            </button>
          </div>

          <div v-show="auth.loggedIn && (auth.user.id === userId) && !config.manageMode" class="flex flex-row gap-2">
            <button class="icon-button" @click="editCollection()">
              <Icon :name="'i-ph-gear-six'" />
            </button>
            <button class="danger-button-color b-button" @click="openModal('collection-deletion-confirm-modal')">
              <Icon :name="'i-akar-icons-trash-bin'" />
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
          <Icon v-if="!collection.is_public" :name="'i-radix-icons-lock-closed'" class="mr-2 cursor-default" />
          <span class="text-xs font-normal">{{ collection.name }}</span>
        </div>
      </div>
    </div>

    <div v-if="config.showLoadMore && !selectedCollection" class="mt-4 w-full primary-button" @click="loadMore">
      {{ $t('loadMore') }}
    </div>

    <LoadingEmptyErrorMessage 
      :loading="loading"
      :empty="isEmpty"
      :error="isError"
      :fetch="fetch"
      :background-color="'theme-color-secondary'"
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
// stores
import useAuthStore from '@/stores/auth.store'

// components
import Icon from '~/components/globals/Icon.vue'
import CollectionFormModal from '~/components/collections/CollectionFormModal.vue'
import List from '~/components/collections/List.vue'
import ConfirmationDialog from '~/components/globals/ConfirmationDialog.vue'
import SplashAlert from '~/components/globals/SplashAlert.vue'
import EditForm from '~/components/collections/EditForm.vue'
import ArtworkThumbnail from '~/components/collections/thumbnails/ArtworkThumbnail.vue'
import LoadingEmptyErrorMessage from '~/components/globals/LoadingEmptyErrorMessage.vue'
import ProBadge from '~/components/globals/ProBadge.vue'

// composables
import useCollection from '~/composables/users/useCollection'

const auth = useAuthStore()

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

onBeforeMount (() => {
  isUserCanCreateCollection()
})

const loading = ref(true)
const activeType = ref('artwork')
const selectedCollection = ref(0)

// free user collection creation limitation
const isCanCreateCollection = ref(false)
const isUserCanCreateCollection = async () => {
  if (auth.i502p00r0) {
    isCanCreateCollection.value = true
  } else {
    const [isCanCreate, error] = await collectionApi.proCanCreateCollection({
      type: activeType.value
    })

    if (error) {
      isCanCreateCollection.value = false
      // TODO: handle error
    } else {
      isCanCreateCollection.value = isCanCreate
    }
  }
}

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

  const [data, showLoadMore, error] = await collectionApi.fetchCollections({
    userId: props.userId, 
    type: activeType.value,
    pagination: {
      page: config.value.pagination.page,
      perPage: config.value.pagination.page === 0 ? config.value.pagination.firstLoad : config.value.pagination.perPage
    }
  })

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

    config.value.pagination.page += (config.value.pagination.firstLoad / config.value.pagination.perPage)
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
  await isUserCanCreateCollection()

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
      collection.is_public = updatedData.isPublic
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
      await isUserCanCreateCollection()
      
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
// @import '~/assets/css/tailwind.scss';
</style>

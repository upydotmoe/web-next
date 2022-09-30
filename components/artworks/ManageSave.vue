<template>
  <div>
    <div class="w-full modal-layer xl:w-3/12 lg:w-2/5">
      <div>
        <div class="flex flex-row justify-between w-full">
          <span class="title">{{ $t('collections.addItem.form.title') }}</span>
          
          <div class="flex float-right flex-row gap-2 mb-2 cursor-pointer">
            <div class="modal-close" @click="cancel()">
              <Icon :name="'close'" class="text-2xl" />
            </div>
          </div>
        </div>
        <div v-show="!config.loading && !isError && !isEmpty" class="list">
          <div class="overflow-y-scroll pr-2 max-h-60">
            <div 
              v-for="(collection, index) in collections"
              :key="collection.id"
              class="item"
              :class="[{ 'mt-2': index !== 0 }, selectedCollections.includes(collection.id) ? 'button-color text-white' : 'theme-color-secondary']"
              @click="selectUnselect(collection.id)" 
            >
              <div class="flex flex-row justify-between">
                <span>{{ collection.name }}</span>
                <span class="ml-2 font-bold" :class="selectedCollections.includes(collection.id) ? 'text-white' : 'text-colored'">{{ collection._count.collection_has_artworks }}</span>
              </div>
            </div>
          </div>
          <div v-show="showLoadMoreButton" class="mt-2 primary-button" @click="loadMore()">
            <Icon :name="'chevron-down-outline'" class="mr-2" />
            {{ $t('loadMore') }}
          </div>

          <div class="flex float-right flex-row gap-2 mt-4">
            <button class="cancel-button" @click="cancel()">
              {{ $t('cancel') }}
            </button>
            <button class="primary-button" @click="save()">
              {{ $t('save') }}
            </button>
          </div>
        </div>

        <!-- new collection -->
        <div v-show="!config.loading && !isError && !isEmpty">
          <input 
            v-model="newCollectionInput" 
            type="text" 
            class="mt-4 mb-0 form-input theme-color-secondary" 
            :class="{ 'border border-red-400': createCollectionFailureAlert }"
            :placeholder="$t('collections.createNewCollection')"
          >

          <div class="flex flex-row justify-between mt-2">
            <div>
              <span 
                v-show="collectionCreatedAlert"
                class="font-bold text-green-400 transition-all duration-200 ease-in-out"
              >
                {{ $t('collections.collectionCreated') }}
              </span>
              <span 
                v-show="createCollectionFailureAlert"
                class="font-bold text-red-400 transition-all duration-200 ease-in-out"
              >
                {{ $t('collections.failedToCreateCollection') }}
              </span>
            </div>
            <button v-show="newCollectionInput && newCollectionInput.length > 0" class="primary-button" @click="create()">
              {{ $t('create') }}
            </button>
          </div>
        </div>
      </div>

      <!-- On loading, empty or error occured -->
      <LoadingEmptyErrorMessage
        :loading="config.loading"
        :empty="isEmpty"
        :error="isError"
        :fetch="fetchCollection"
      />
    </div>
  </div>
</template>

<script setup>
// API
import {
  CollectionsApi
} from '~/api/openapi/api'

// stores
import useAuthStore from '@/stores/auth.store'

// components
import Icon from '~/components/globals/Icon.vue'
import LoadingEmptyErrorMessage from '~/components/globals/LoadingEmptyErrorMessage.vue'

// composables
import useCollection from '~/composables/users/useCollection'

/**
 * @stores
 */
const auth = useAuthStore()

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const collectionApi = useCollection(oApiConfiguration, fetchOptions())

const emits = defineEmits (['save'])
const props = defineProps ({
  modalId: {
    type: String,
    default: 'collection-selection-modal'
  },
  workId: {
    type: Number,
    default: 0
  }
})

onMounted (() => {
  fetchCollection()
  fetchCurrentSaved()
})

/**
 * @methods
 */
const config = ref({
  pagination: {
    page: 0,
    perPage: 10
  },
  loading: false
})
const isError = ref(false)
const isEmpty = ref(false)
const collections = ref([])
const fetchCollection = async (isLoadMore = false) => {
  if (!isLoadMore) {
    config.value.loading = true
  }

  const [data, showLoadMore, error] = await collectionApi.fetchCollections({
    userId: auth.user.id,
    type: 'artwork',
    pagination: {
      page: config.value.pagination.page,
      perPage: config.value.pagination.perPage
    }
  })
  
  config.value.loading = false

  if (error) {
    isError.value = true
  }

  if (!error) {
    if (data && data.length > 0) {
      if (!showLoadMore) {
        showLoadMoreButton.value = false
      } else {
        config.value.pagination.page += 1
        showLoadMoreButton.value = true
      }

      data.forEach((collection) => {
        collections.value.push(collection)
      })
    } else {
      isEmpty.value = true
    }
  }
}

const currentSaved = ref([])
const fetchCurrentSaved = async () => {
  isError.value = false

  currentSaved.value = []
  selectedCollections.value = []
  unselectedCollections.value = []

  await setTimeout(async () => {
    const [data, error] = await collectionApi.getCurrentSaveInfo(
      'artwork',
      props.workId
    )

    if (error) {
      isError.value = true
    } else {
      for (const collection of data) {
        selectedCollections.value.push(collection.collection_id)
        currentSaved.value.push(collection.collection_id)
      }
    }
  }, 300)
}

/** LOAD MORE FUNCTION */
const showLoadMoreButton = ref(true)
const loadMore = async () => {
  await fetchCollection({
    isLoadMore: true
  })
  await fetchCurrentSaved()
}

const selectedCollections = ref([])
const unselectedCollections = ref([])
const selectUnselect = (collectionId) => {
  if (selectedCollections.value.includes(collectionId)) {
    unselectedCollections.value.push(collectionId)
    
    // remove from selected collection list
    const indexOfId = selectedCollections.value.indexOf(collectionId)
    selectedCollections.value.splice(indexOfId, 1)
  } else {
    selectedCollections.value.push(collectionId)

    // remove from unselected collection list
    if (unselectedCollections.value.includes(collectionId)) {
      const indexOfId = unselectedCollections.value.indexOf(collectionId)
      unselectedCollections.value.splice(indexOfId, 1)
    }
  }
}

const save = async () => {
  try {
    // save to collection(s)
    for (const collectionId of selectedCollections.value) {
      await collectionApi.addItem({
        collectionId,
        type: 'artwork',
        workId: props.workId
      })
    }

    // remove from collection(s)
    if (unselectedCollections.value.length) {
      for (const collectionId of unselectedCollections.value) {
        await collectionApi.removeItem({
          collectionId,
          type: 'artwork',
          workId: props.workId
        })
      }
    }

    let unsaved = false
    if (selectedCollections.value.length === 0 && currentSaved.value.length === unselectedCollections.value.length) {
      unsaved = true
    }

    await fetchCurrentSaved()
    useModal().closeModal(props.modalId)
    emits('save', unsaved)
  } catch (error) {
    // todo: handle error when failed to save
  }
}

const newCollectionInput = ref('')
const createCollectionFailureAlert = ref(false)
const create = async () => {
  createCollectionFailureAlert.value = false

  const [success, data, error] = await collectionApi.createCollection(
    'artwork',
    {
      title: newCollectionInput.value,
      isPublic: 1,
      description: ''
    }
  )

  if (success) {
    collections.value = []
    clear()

    config.value.pagination.page = 0
    await fetchCollection()
    await fetchCurrentSaved()
    
    newCollectionInput.value = ''

    showCollectionCreatedAlert()
  } else {
    // show error alert when failed to create collection
    createCollectionFailureAlert.value = true
  }
}

const collectionCreatedAlert = ref(false)
const showCollectionCreatedAlert = () => {
  collectionCreatedAlert.value = true

  setInterval(() => {
    collectionCreatedAlert.value = false
  }, 5000)
}

const clear = () => {
  selectedCollections.value = []
}

const cancel = () => {
  useModal().closeModal(props.modalId)
  clear()
}

/**
 * @expose
 */
defineExpose ({
  fetchCurrentSaved
})
</script>

<style lang="scss" scoped>
@import '~/assets/css/tailwind.scss';

.list {
  @apply my-4;

  .item {
    @apply p-3 rounded cursor-pointer align-middle;

    label {
      @apply inline-flex items-center w-full;
    }
  }
}
</style>

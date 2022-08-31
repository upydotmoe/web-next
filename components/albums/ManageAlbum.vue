<template>
  <div>
    <div class="w-full modal-layer xl:w-3/12 lg:w-2/5">
      <div>
        <div class="flex flex-row justify-between w-full">
          <span class="title">{{ $t('albums.selectAlbums') }}</span>
          
          <div class="flex float-right flex-row gap-2 mb-2 cursor-pointer">
            <div class="modal-close" @click="cancel()">
              <Icon :name="'close'" class="text-2xl" />
            </div>
          </div>
        </div>
        <div class="list">
          <div v-show="!loading && !isEmpty && !isError">
            <div class="overflow-y-scroll pr-2 max-h-60">
              <div 
                v-for="(album, index) in albums"
                :key="album.id"
                class="item"
                :class="[{ 'mt-2': index !== 0 }, selectedAlbums.includes(album.id) ? 'button-color text-white' : 'theme-color-secondary']"
                @click="selectUnselect(album.id)" 
              >
                <span>{{ album.name }}</span>
                <span
                  :class="[
                    'ml-2 font-bold',
                    selectedAlbums.includes(album.id) ? 'text-white' : 'text-colored'
                  ]"
                >
                  {{ album._count.album_has_artworks }}
                </span>
              </div>
            </div>
            <div v-show="config.showLoadMore" class="mt-2 primary-button" @click="loadMore()">
              Load More
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
        </div>
      </div>

      <!-- On loading, empty or error occured -->
      <ErrorMessages
        :loading="loading"
        :empty="isEmpty"
        :error="isError"
        :fetch="fetchTop"
      />
    </div>
  </div>
</template>

<script setup>
// stores
import authStore from '@/stores/auth.store'

// components
import ErrorMessages from '~/components/globals/ErrorMessages.vue'
import Icon from '~/components/globals/Icon.vue'

// composables
import useAlbum from '~/composables/users/useAlbum'

const emits = defineEmits (['addedToAlbum'])
const props = defineProps ({
  modalId: {
    type: String,
    default: 'album-selection-modal'
  },
  workId: {
    type: Number,
    default: 0
  },
  workIds: {
    type: Array,
    default: () => []
  }
})

onMounted (() => {
  fetchAlbums()
  if (!props.workIds.length) {
    fetchCurrentSaved()
  }
})

const auth = authStore()

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const album = useAlbum(oApiConfiguration, fetchOptions())

const fetchTop = async () => {
  albums.value = []
  config.value.pagination.page = 0
  resetErrorMessages()

  await fetchAlbums()
}

const albums = ref([])
const config = ref({
  pagination: {
    perPage: 10,
    page: 0,
    firstLoad: 10
  },
  showLoadMore: true
})
const loading = ref(false)
const isError = ref(false)
const isEmpty = ref(false)
const fetchAlbums = async () => {
  resetErrorMessages()
  loading.value = true

  const [data, showLoadMore, error] = await album.fetchAlbums(
    auth.user.id,
    'artwork',
    config.value.pagination.page === 0 ? config.value.pagination.firstLoad : config.value.pagination.perPage,
    config.value.pagination.page
  )
  
  if (error) {
    isError.value = true
  }

  if (!data.length) {
    isEmpty.value = true
  } else {
    if (!showLoadMore) {
      config.value.showLoadMore = false
    } else {
      config.value.pagination.page += 1
      config.value.showLoadMore = true
    }

    data.forEach((album) => {
      albums.value.push(album)
    })
  }

  loading.value = false
}

const resetErrorMessages = () => {
  isEmpty.value = false
  isError.value = false
}

const currentSaved = ref([])
const fetchCurrentSaved = async () => {
  currentSaved.value = []
  selectedAlbums.value = []
  unselectedAlbums.value = []

  const [data, error] = await album.getCurrentSaveInfo(
    'artwork',
    props.workId
  )
  
  for (const album of data) {
    selectedAlbums.value.push(album.album_id)
    currentSaved.value.push(album.album_id)
  }
}

/** LOAD MORE FUNCTION */
const loadMore = async () => {
  await fetchAlbums()
  await fetchCurrentSaved()
}

const selectedAlbums = ref([])
const unselectedAlbums = ref([])
const selectUnselect = (albumId) => {
  if (selectedAlbums.value.includes(albumId)) {
    unselectedAlbums.value.push(albumId)
    
    // remove from selected album list
    const indexOfId = selectedAlbums.value.indexOf(albumId)
    selectedAlbums.value.splice(indexOfId, 1)
  } else {
    selectedAlbums.value.push(albumId)

    // remove from unselected album list
    if (unselectedAlbums.value.includes(albumId)) {
      const indexOfId = unselectedAlbums.value.indexOf(albumId)
      unselectedAlbums.value.splice(indexOfId, 1)
    }
  }
}

const save = async () => {
  const [success, error] = await album.addItems(
    selectedAlbums.value,
    props.workIds.length ? props.workIds : [props.workId]
  )

  // if it's a single item, any albums that previously were selected and are now unselected will remove the item from those albums
  if (!props.workIds.length) {
    if (unselectedAlbums.value.length) {
      for (const albumId of unselectedAlbums.value) {
        await album.removeItems(
          albumId,
          [props.workId]
        )
      }
    }
  }

  if (success) {
    let unsaved = false
    if (!props.workIds.length) {
      if (selectedAlbums.value.length === 0 && (currentSaved.value.length === unselectedAlbums.value.length)) {
        unsaved = true
      }
    }
    
    clear()
    useModal().closeModal(props.modalId)
    emits('addedToAlbum', props.workIds.length ? true : unsaved)
  } else {
    // todo: handle error
  }
}

const clear = () => {
  selectedAlbums.value = []
}

const cancel = () => {
  useModal().closeModal(props.modalId)
  clear()
}

defineExpose ({
  fetchCurrentSaved,
  fetchAlbums
})
</script>

<style lang="scss" scoped>
@import '~/assets/css/tailwind.scss';

.list {
  @apply my-4;

  .item {
    @apply p-3 rounded flex flex-row cursor-pointer justify-between align-middle;

    label {
      @apply inline-flex items-center w-full;
    }
  }
}
</style>

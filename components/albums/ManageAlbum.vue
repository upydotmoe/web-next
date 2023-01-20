<template>
  <div>
    <div class="w-full modal-layer xl:w-3/12 lg:w-2/5">
      <div>
        <div class="flex flex-row justify-between w-full">
          <span class="title">{{ $t('albums.selectAlbums') }}</span>
          
          <div class="flex float-right flex-row gap-2 mb-2 cursor-pointer">
            <div
              class="modal-close"
              @click="cancel()"
            >
              <Icon
                :name="'i-ion-close-outline'"
                class="text-2xl"
              />
            </div>
          </div>
        </div>
        <div class="list">
          <div v-show="!loading && !isEmpty && !isError">
            <div class="overflow-y-scroll pr-2 max-h-60">
              <div 
                v-for="(album, index) in albums"
                :key="album.id"
                :class="[
                  'item',
                  { 'mt-2': index !== 0 }, selectedAlbums.includes(album.id) ? 'button-color text-white' : 'theme-color-secondary',
                  album.is_can_add_more ? 'cursor-pointer' : 'cursor-not-allowed'
                ]"
                @click="album.is_can_add_more ? selectUnselect(album.id) : null"
              >
                <div class="flex flex-row justify-between">
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

                <div
                  v-if="!auth.i502p00r0 && !album.is_can_add_more || (!auth.i502p00r0 && album._count.album_has_artworks > maxAlbumItems)"
                  class="flex flex-row mt-2 w-full"
                >
                  <ProBadge class="mr-1" />
                  <p class="leading-6">
                    {{ $t('albums.maxItemLimitReached') }}
                  </p>
                </div>
              </div>
            </div>
            <div
              v-show="config.showLoadMore"
              class="mt-2 text-center href"
              @click="loadMore()"
            >
              {{ $t('loadMore').toLowerCase() }}
            </div>

            <div class="flex float-right flex-row gap-2 mt-4">
              <button
                class="cancel-button w-full"
                @click="cancel()"
              >
                {{ $t('cancel') }}
              </button>
              <button
                class="primary-button w-full"
                @click="save()"
              >
                {{ $t('save') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- On loading, empty or error-->
      <LoadingEmptyErrorMessage
        :loading="loading"
        :empty="isEmpty"
        :empty-message="$t('albums.empty')"
        :error="isError"
        :fetch="fetchTop"
      />
    </div>
  </div>
</template>

<script setup>
import { POST_TYPES } from '~/utils/constants'

// stores
import authStore from '@/stores/auth.store'

// components
import LoadingEmptyErrorMessage from '~/components/globals/LoadingEmptyErrorMessage.vue'
import Icon from '~/components/globals/Icon.vue'
import ProBadge from '~/components/globals/ProBadge.vue'

// composables
import useAlbum from '~/composables/users/useAlbum'
import useSetting from '~/composables/useSetting'

// stores
const auth = authStore()

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const albumApi = useAlbum(oApiConfiguration, fetchOptions())
const settingApi = useSetting(oApiConfiguration, fetchOptions())

const emit = defineEmits(['addedToAlbum'])
const props = defineProps({
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

onBeforeMount (async () => {
  await getMaxAlbumItemLimit()
})

// onMounted (() => {
//   fetchAlbums()
//   if (!props.workIds.length) {
//     fetchCurrentSaved()
//   }
// })

const maxAlbumItems = ref(999)
const getMaxAlbumItemLimit = async () => {
  const [maxAlbumItemLimit, error] = await settingApi.getSetting('max_free_album_items')
  maxAlbumItems.value = maxAlbumItemLimit
}

const fetchTop = async () => {
  albums.value = []
  config.value.pagination.page = 0
  resetLoadingEmptyErrorMessage()

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
const loading = ref(true)
const isError = ref(false)
const isEmpty = ref(false)
const fetchAlbums = async () => {
  resetLoadingEmptyErrorMessage()
  loading.value = true

  const [data, showLoadMore, error] = await albumApi.fetchAlbums(
    auth.user.id,
    POST_TYPES.ARTWORK,
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

const resetLoadingEmptyErrorMessage = () => {
  isEmpty.value = false
  isError.value = false
}

const currentSaved = ref([])
const fetchCurrentSaved = async () => {
  currentSaved.value = []
  selectedAlbums.value = []
  unselectedAlbums.value = []

  const [data, error] = await albumApi.getCurrentSaveInfo(
    POST_TYPES.ARTWORK,
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
  const [success, error] = await albumApi.addItems({
    albumIds: selectedAlbums.value,
    type: POST_TYPES.ARTWORK,
    workIds: props.workIds.length ? props.workIds : [props.workId]
  })

  // if it's a single item, any albums that previously were selected and are now unselected will remove the item from those albums
  if (!props.workIds.length) {
    if (unselectedAlbums.value.length) {
      for (const albumId of unselectedAlbums.value) {
        await albumApi.removeItems(
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
    emit('addedToAlbum', props.workIds.length ? true : unsaved)
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

defineExpose({
  fetchTop,
  fetchCurrentSaved
})
</script>

<style lang="scss" scoped>
@import '~/assets/css/tailwind.scss';

.list {
  @apply my-4;

  .item {
    @apply p-3 rounded justify-between align-middle;

    label {
      @apply inline-flex items-center w-full;
    }
  }
}
</style>

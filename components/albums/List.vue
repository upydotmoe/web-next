<template>
  <div id="lists">
    <div class="p-4 mb-2 w-full rounded-md theme-color-secondary">
      <div class="mb-2 text-base font-bold">{{ albumData.info.name }}</div>
      <div class="mb-2">{{ albumData.info.description }}</div>
      <div><b>{{ $t('private') }}:</b> <span class="italic">{{ albumData.info.is_public ? $t('no') : $t('yes') }}</span></div>
      <div><b>{{ $t('createdAt') }}</b> {{ formatDate(albumData.info.created_at) }}</div>
    </div>

    <div v-show="!loading">
      <WorkList
        v-show="!albumData.empty"
        :section-class="'work-grid'"
        :works="albumData.list"
        :view="view"
        :manage-mode="manageMode"
        @feedManageList="feedManageList"
      />

      <div 
        v-show="albumData.loadMore" 
        class="primary-button"
        @click="fetchItems()"
      >
        {{ $t('loadMore') }}
      </div>
    </div>

    <LoadingEmptyErrorMessage 
      :loading="loading"
      :empty="albumData.empty"
      :error="false"
      :fetch="fetch"
      :background-color="'theme-color-secondary'"
    />

    <!-- Artwork modal view -->
    <div 
      v-if="!loading"
      :id="modalName+'-modal'"
      class="modal work-view" 
    >
      <ModalView 
        ref="albumModalViewRef"
        :section="modalName"
      />
    </div>

    <!-- on success remove items -->
    <SplashAlert 
      v-show="isItemsRemoved"
      id="item-removed-alert"
      :text="$t('albums.itemRemoved')"
    />
  </div>
</template>

<script setup>
// import { onClickOutside } from '@vueuse/core'

// components
import WorkList from '~/components/artworks/WorkList.vue'
import ModalView from '~/components/artworks/views/ModalView.vue'
import LoadingEmptyErrorMessage from '~/components/globals/LoadingEmptyErrorMessage.vue'
import SplashAlert from '~/components/globals/SplashAlert.vue'

// composables
import useAlbum from '~/composables/users/useAlbum'

const emits = defineEmits (['onAlbumEmpty', 'feedManageList'])
const props = defineProps ({
  id: {
    type: Number,
    default: 0
  },
  manageMode: {
    type: Boolean,
    default: false
  }
})

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const album = useAlbum(oApiConfiguration, fetchOptions())

const albumId = ref(props.id)
watch (() => props.id, (newId, _) => {
  albumId.value = newId
})

onMounted(async () => {
  await fetch()
})

const loading = ref(true)
const albumData = ref({
  id: 0,
  info: {},
  loadMore: true,
  pagination: {
    page: 0,
    perPage: 12,
    firstLoad: 24
  },
  list: [],
  empty: false
})
const fetch = async () => {
  loading.value = true

  await fetchInfo()
  await fetchItems()

  loading.value = false
}

const fetchInfo = async () => {
  const [info, error] = await album.getInfo(albumId.value)
  albumData.value.info = info.data
}

const fetchItems = async () => {
  const [list, showLoadMoreAlbumItems, error] = await album.listAlbumItems({
    albumId: albumId.value,
    pagination: {
      page: albumData.value.pagination.page,
      perPage: albumData.value.pagination.page === 0 ? albumData.value.pagination.firstLoad : albumData.value.pagination.perPage
    }
  })

  if (showLoadMoreAlbumItems) {
    if (albumData.value.pagination.page === 0) {
      albumData.value.pagination.page = (albumData.value.pagination.firstLoad / albumData.value.pagination.perPage)
    } else {
      albumData.value.pagination.page += albumData.value.pagination.page !== 0 ? 1 : 2
    }
  } else {
    albumData.value.loadMore = false
  }

  if (list !== null && list.length) {
    list.forEach((item) => {
      albumData.value.list.push(item.artworks)
    })

    emits('onAlbumEmpty', false)
  } else {
    albumData.value.empty = true
    emits('onAlbumEmpty', true)
  }
}

const reset = () => {
  albumData.value.loadMore = true
  albumData.value.pagination.page = 0
  albumData.value.list = []
}

/** Listen to manage list changes */
const selectedItems = ref([])
const feedManageList = (workList) => {
  selectedItems.value = workList

  emits('feedManageList', workList)
}

const isItemsRemoved = ref(false)
let splashRemoveInterval
const removeItems = async () => {
  const [success, error] = await album.removeItems(props.id, selectedItems.value)

  if (success) {
    useSplash().splash(splashRemoveInterval, isItemsRemoved, 'item-removed-alert')
    reset()
    await fetch()
  }
}

const modalName = ref('album')
const albumModalViewRef = ref(null)
// onClickOutside(albumModalViewRef, () => useModal().closeModal(modalName.value + '-modal'))
const view = (workId, keepArtistPageNumber = false) => {
  albumModalViewRef.value.view(workId, keepArtistPageNumber)
  useModal().openModal(modalName.value + '-modal')
}

/**
 * @expose
 */
defineExpose ({
  fetchInfo,
  removeItems
})
</script>

<style lang="scss" scoped>
// @import '~/assets/css/tailwind.scss';
@import '~/assets/css/artworks/list-6.scss';
</style>

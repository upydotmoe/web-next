<template>
  <div id="lists">
    <div class="hidden" @click="fetchInfo()" />
    <div class="hidden" @click="removeItem()" />
    
    <div class="p-4 mb-4 w-full rounded-md theme-color-secondary">
      <div class="text-base font-bold mb-2">{{ collection.info.name }}</div>
      <div class="mb-2">{{ collection.info.description }}</div>
      <div><b>{{ $t('private') }}:</b> <span class="italic">{{ collection.info.is_public ? $t('no') : $t('yes') }}</span></div>
      <div><b>{{ $t('createdAt') }}</b> {{ formatDate(collection.info.created_at) }}</div>
    </div>

    <div v-show="!loading">
      <keep-alive>
        <WorkList
          v-show="!collection.empty"
          :section-class="'work-grid'"
          :works="collection.list"
          :view="view"
          :manage-mode="manageMode"
          @feedManageList="feedManageList"
        />
      </keep-alive>

      <div 
        v-show="collection.loadMore" 
        class="primary-button"
        @click="fetchItems()"
      >
        {{ $t('loadMore') }}
      </div>
    </div>

    <ErrorMessages 
      :loading="loading"
      :empty="collection.empty"
      :error="false"
      :fetch="fetch"
    />

    <!-- Modal view (artwork detail) -->
    <div 
      v-if="!loading"
      :id="modalName+'-modal'"
      class="modal work-view" 
    >
      <ModalView 
        ref="collectionModalViewRef"
        :section="modalName"
      />
    </div>

    <!-- on success remove items -->
    <SplashAlert 
      v-show="isItemsRemoved"
      id="item-removed-alert"
      :text="$t('collections.itemRemoved')"
    />
  </div>
</template>

<script setup>
// import { onClickOutside } from '@vueuse/core'

// components
import WorkList from '~/components/artworks/WorkList.vue'
import ModalView from '~/components/artworks/views/ModalView.vue'
import ErrorMessages from '~/components/globals/ErrorMessages.vue'
import SplashAlert from '~/components/globals/SplashAlert.vue'

// composables
import useCollection from '~/composables/users/useCollection'

const emits = defineEmits (['onCollectionEmpty', 'feedManageList'])
const props = defineProps ({
  id: {
    type: Number,
    default: 0
  },
  manageMode: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: ''
  }
})

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const collectionApi = useCollection(oApiConfiguration, fetchOptions())

const collectionId = ref(props.id)
watch (() => props.id, (newId, _) => {
  collectionId.value = newId
})

onMounted(async () => {
  await fetch()
})

const loading = ref(false)
const collection = ref({
  id: 0,
  info: {},
  loadMore: true,
  pagination: {
    page: 0,
    perPage: 12,
    firstLoad: 12
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
  const [info, error] = await collectionApi.getInfo(collectionId.value)
  collection.value.info = info.data
}

const fetchItems = async () => {
  const [list, showLoadMoreCollectionItems, error] = await collectionApi.listCollectionItems({
    collectionId: collectionId.value,
    pagination: {
      page: collection.value.pagination.page,
      perPage: collection.value.pagination.page === 0 ? collection.value.pagination.firstLoad : collection.value.pagination.perPage
    }
  })

  if (showLoadMoreCollectionItems) {
    if (collection.value.pagination.page === 0) {
      collection.value.pagination.page = (collection.value.pagination.firstLoad / collection.value.pagination.perPage)
    } else {
      collection.value.pagination.page += collection.value.pagination.page !== 0 ? 1 : 2
    }
  } else {
    collection.value.loadMore = false
  }

  if (list !== null && list.length) {
    list.forEach((item) => {
      collection.value.list.push(item.artworks)
    })

    emits('onCollectionEmpty', false)
  } else {
    collection.value.empty = true
    emits('onCollectionEmpty', true)
  }
}

const reset = () => {
  collection.value.loadMore = true
  collection.value.pagination.page = 0
  collection.value.list = []
}

/** Listen to manage list changes */
const selectedItems = ref([])
const feedManageList = (workList) => {
  selectedItems.value = workList

  emits('feedManageList', workList)
}

const isItemsRemoved = ref(false)
let splashRemoveInterval
const removeItem = async () => {
  const [success, error] = await collectionApi.removeItem({
    collectionId: props.id,
    type: props.type,
    workId: selectedItems.value
  })

  if (error) {
    // todo: handle error
  } else {
    useSplash().splash(splashRemoveInterval, isItemsRemoved, 'item-removed-alert')
    reset()
    await fetch()
    
    emits('feedManageList', [])
  }
}

const modalName = ref('collection')
const collectionModalViewRef = ref(null)
// onClickOutside(collectionModalViewRef, () => useModal().closeModal(modalName.value + '-modal'))
const view = (workId, keepArtistPageNumber = false) => {
  collectionModalViewRef.value.view(workId, keepArtistPageNumber)
  useModal().openModal(modalName.value + '-modal')
}

/**
 * @expose
 */
defineExpose ({
  fetchInfo,
  removeItem
})
</script>

<style lang="scss" scoped>
@import '~/assets/css/tailwind.scss';
@import '~/assets/css/artworks/list.scss';
</style>

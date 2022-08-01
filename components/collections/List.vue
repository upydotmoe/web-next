<template>
  <div id="lists">
    <div class="hidden" @click="fetchInfo()" />
    <div class="hidden" @click="removeItem()" />
    
    <div class="p-4 mb-4 w-full rounded-md theme-color-secondary">
      <div class="text-base font-bold mb-2">{{ collectionData.info.name }}</div>
      <div class="mb-2">{{ collectionData.info.description }}</div>
      <div><b>{{ $t('private') }}:</b> <span class="italic">{{ collectionData.info.is_public ? $t('no') : $t('yes') }}</span></div>
      <div><b>{{ $t('createdAt') }}</b> {{ formatDate(collectionData.info.created_at) }}</div>
    </div>

    <div v-show="!loading">
      <keep-alive>
        <WorkList
          v-show="!collectionData.empty"
          :section-class="'work-grid'"
          :works="collectionData.list"
          :view="view"
          :manage-mode="manageMode"
          @feedManageList="feedManageList"
        />
      </keep-alive>

      <div 
        v-show="collectionData.loadMore" 
        class="primary-button"
        @click="fetchItems()"
      >
        {{ $t('loadMore') }}
      </div>
    </div>

    <ErrorMessages 
      :loading="loading"
      :empty="collectionData.empty"
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
import useApiFetch from '~/composables/useApiFetch'
import useCollection from '~/composables/users/useCollection'
import useModal from '~/composables/useModal'
import useSplash from '~/composables/useSplash'

const emit = defineEmits(['onCollectionEmpty', 'feedManageList'])
const props = defineProps({
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
watch(() => props.id, (newId, _) => {
  collectionId.value = newId
})

onMounted(async () => {
  await fetch()
})

const loading = ref(false)
const collectionData = ref({
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
  collectionData.value.info = info.data
}

const fetchItems = async () => {
  const [list, showLoadMoreCollectionItems, error] = await collectionApi.listCollectionItems({
    collectionId: collectionId.value,
    pagination: {
      page: collectionData.value.pagination.page,
      perPage: collectionData.value.pagination.page === 0 ? collectionData.value.pagination.firstLoad : collectionData.value.pagination.perPage
    }
  })

  if (showLoadMoreCollectionItems) {
    if (collectionData.value.pagination.page === 0) {
      collectionData.value.pagination.page = (collectionData.value.pagination.firstLoad / collectionData.value.pagination.perPage)
    } else {
      collectionData.value.pagination.page += collectionData.value.pagination.page !== 0 ? 1 : 2
    }
  } else {
    collectionData.value.loadMore = false
  }

  if (list !== null && list.length) {
    list.forEach((item) => {
      collectionData.value.list.push(item.artworks)
    })

    emit('onCollectionEmpty', false)
  } else {
    collectionData.value.empty = true
    emit('onCollectionEmpty', true)
  }
}

const reset = () => {
  collectionData.value.loadMore = true
  collectionData.value.pagination.page = 0
  collectionData.value.list = []
}

/** Listen to manage list changes */
const selectedItems = ref([])
const feedManageList = (workList) => {
  selectedItems.value = workList

  emit('feedManageList', workList)
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
    
    emit('feedManageList', [])
  }
}

const modalName = ref('collection')
const collectionModalViewRef = ref(null)
// onClickOutside(collectionModalViewRef, () => useModal().closeModal(modalName.value + '-modal'))
const view = (workId, keepArtistPageNumber = false) => {
  collectionModalViewRef.value.view(workId, keepArtistPageNumber)
  useModal().openModal(modalName.value + '-modal')
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/tailwind.scss';
@import '~/assets/css/artworks/list.scss';
</style>

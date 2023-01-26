<template>
  <div class="mt-4">
    <LoadingEmptyErrorMessage
      :loading="options.loading"
      :empty="options.isEmpty"
      :empty-message="'No art trade yet, be the first one to host your art trade.'"
      :error="options.isError"
      :fetch="fetchTop"
    />

    <div class="grid grid-cols-1 gap-2 mb-4 md:grid-cols-2 md:gap-4 lg:grid-cols-4">
      <nuxt-link
        v-for="trade in data"
        :key="trade.id"
        :to="'/art-trade/view/'+trade.id"
        class="grid grid-cols-11 gap-2 p-2 rounded-md theme-color hover:shadow-lg trade-item"
      >
        <div class="overflow-hidden relative col-span-5 rounded-md">
          <span
            v-if="applyExplicitFilter(auth, trade.host.submission.is_explicit, trade.host.submission.is_gore)"
            class="absolute top-1/2 left-1/2 z-10 text-base font-semibold text-white transform -translate-x-1/2 -translate-y-1/2 md:text-lg"
          >
            {{ trade.host.submission.is_gore ? $t('goreContent') : $t('explicitContent') }}
          </span>
          
          <nuxt-img
            preload
            loading="lazy"
            :src="artworkThumb(trade.host.submission.bucket, trade.host.submission.filename, 'thumbnail', false)"
            :class="[
              'object-cover unselectable rounded-md w-full h-full',
              { 'blur-3xl brightness-50 unclickable': applyExplicitFilter(auth, trade.host.submission.is_explicit, trade.host.submission.is_gore) }
            ]"
            @error="imageLoadError"
          />
        </div>

        <Icon
          :name="'i-ant-design-swap-outlined'"
          class="my-auto mx-auto"
        />

        <div class="overflow-hidden relative col-span-5 rounded-md">
          <span
            v-if="applyExplicitFilter(auth, trade.participant.submission.is_explicit, trade.participant.submission.is_gore)"
            class="absolute top-1/2 left-1/2 z-10 text-base font-semibold text-white transform -translate-x-1/2 -translate-y-1/2 md:text-lg"
          >
            {{ trade.participant.submission.is_gore ? $t('goreContent') : $t('explicitContent') }}
          </span>
          
          <nuxt-img
            preload
            loading="lazy"
            :src="artworkThumb(trade.participant.submission.bucket, trade.participant.submission.filename, 'thumbnail', false)"
            :class="[
              'object-cover unselectable rounded-md w-full h-full',
              { 'blur-3xl brightness-50 unclickable': applyExplicitFilter(auth, trade.participant.submission.is_explicit, trade.participant.submission.is_gore) }
            ]"
            @error="imageLoadError"
          />
        </div>
      </nuxt-link>
    </div>
  
    <!-- load more button -->
    <div 
      v-show="showLoadMoreButton" 
      class="w-full primary-button"
      :class="loadMoreLoading ? 'animate-pulse' : ''" 
      @click="loadMore"
    >
      {{ $t('loadMore') }}
    </div>
  </div>
</template>

<script setup>
// stores
import useAuthStore from '@/stores/auth.store'

// components
import Icon from '~/components/globals/Icon.vue';
import LoadingEmptyErrorMessage from '~/components/globals/LoadingEmptyErrorMessage.vue'

// stores
const auth = useAuthStore()

// compositions
const { oApiConfiguration, fetchOptions } = useApiFetch()
const artTradeApi = useArtTrade(oApiConfiguration, fetchOptions())

onMounted(() => {
  fetchTop()
})

const data = ref([])
const options = ref({
  loading: true,
  isError: false,
  isEmpty: false,
  pagination: {
    page: 0,
    perPage: 16
  }
})

const fetchTop = async () => {
  await fetch(true)
}

const fetch = async (firstLoad = false) => {
  options.value.loading = true
  options.value.isEmpty = false
  options.value.isError = false

  if (firstLoad) {
    options.value.pagination.page = 0
  }

  const [latestTrades, paginationData, error] = await artTradeApi.getLatestTrades({
    pagination: {
      page: options.value.pagination.page,
      perPage: options.value.pagination.perPage
    }
  })

  if (error) {
    options.value.isError = true
  } else {
    if (!paginationData.record_total) {
      options.value.isEmpty = true
    }

    for (let tradeIdx = 0; tradeIdx < latestTrades.length; tradeIdx++) {
      data.value.push(latestTrades[tradeIdx])
    }

    showLoadMoreButton.value = paginationData.next_previous.next_page !== null
  }

  options.value.loading = false
}

// load more
const loadMoreLoading = ref(false)
const showLoadMoreButton = ref(true)
const loadMore = () => {
  options.value.pagination.page += 1

  fetch()
}
</script>

<style lang="scss">
.trade-item {
  img {
    aspect-ratio: 1/1;
  }
}
</style>
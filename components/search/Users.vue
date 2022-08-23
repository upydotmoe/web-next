<template>
  <div>
    <div class="navigations">
      <div class="title">
        {{ $t('users.users') }}
      </div>

      <!-- Options -->
      <!-- Filter popularity range by Daily/Weekly/Monthly or All-time -->
      <div class="buttons">
        <!-- todo -->
      </div>
    </div>

    <!-- On loading, empty or error occured -->
    <ErrorMessages
      :loading="loading"
      :empty="isEmpty"
      :error="isError"
      :fetch="fetchTop"
    />

    <!-- List area -->
    <div v-show="!loading">
      <UserList 
        v-show="!isEmpty"
        :users="users"
      />
    </div>

    <!-- Paging control -->
    <div v-if="!loading && !isEmpty && !isError" class="flex flex-row gap-2 justify-between w-full md:justify-end md:w-auto">
      <button 
        class="w-full md:w-auto"
        :class="[config.pagination.enablePrev ? 'primary-button' : 'disabled-button']"
        @click="config.pagination.enablePrev ? movePage('prev') : null"
      >
        <Icon :name="'i-ion-chevron-back-outline'" />
        {{ $t('pagination.previous') }}
      </button>
      
      <button 
        class="w-full md:w-auto"
        :class="config.pagination.enableNext ? 'primary-button' : 'disabled-button'"
        @click="config.pagination.enableNext ? movePage('next') : null"
      >
        {{ $t('pagination.next') }}
        <Icon 
          :name="'i-ion-chevron-forward-outline'" 
          class="ml-2"
          style="margin-right: 0 !important" 
        />
      </button>
    </div>
  </div>
</template>

<script setup>
// components
import Icon from '~/components/globals/Icon.vue'
import UserList from '~/components/users/UserList.vue'
import ErrorMessages from '~/components/globals/ErrorMessages.vue'

// composables
import useUser from '~/composables/users/useUser'

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const userApi = useUser(oApiConfiguration, fetchOptions())

const route = useRoute()
const { q } = route.query

const emits = defineEmits (['countUsers'])

// watch for search query/keyword change
watch (() => route.query.q, (newKeyword, oldKeyword) => {
  if (newKeyword !== oldKeyword) {
    keyword.value = newKeyword
    fetchTop()
  }
})

/** Before mount, fetch first row */
const keyword = ref(q)
onBeforeMount (() => {
  fetchTop()
})

/** Fetch first row */
const users = ref([])
const config = ref({
  pagination: {
    enablePrev: true,
    enableNext: true
  }
})
const fetchTop = async () => {
  const data = await fetch()

  const dataUsers = data.users
  const dataPagination = data.pagination

  // handle empty data
  if (!dataUsers.length && dataPagination.record_total === 0) {
    showEmpty()
  } else {
    users.value = dataUsers
  
    if (dataPagination.next_previous.next_page === null) {
      config.value.pagination.enableNext = false
    } else {
      config.value.pagination.enableNext = true
    }

    if (dataPagination.next_previous.prev_page === null) {
      config.value.pagination.enablePrev = false
    } else {
      config.value.pagination.enablePrev = true
    }

    // counter
    emits('countUsers', dataPagination.record_total)
  }
}

/** Fetch */
const loading = ref(true)
const pagination = ref({
  perPage: 5,
  page: ref(0)
})
const fetch = async () => {
  if (pagination.value.page === 0) {
    loading.value = true
    isEmpty.value = false
  }

  const [data, error] = await userApi.searchUsers({
    keyword: keyword.value ?? '',
    pagination: {
      page: pagination.value.page,
      perPage: pagination.value.perPage
    }
  })

  if (error) {
    showError()
  } else {
    reset()
    return data
  }
}

// Control pagination and fetch
const movePage = async (mode) => {
  if (mode === 'prev') {
    pagination.value.page -= 1
  } else {
    pagination.value.page += 1
  }

  await fetchTop()
}

/** Show empty if there's no artwork to show */
const isEmpty = ref(false)
const showEmpty = () => {
  isEmpty.value = true

  emits('countUsers', 0)
}

/** Show error message when error occured while trying to fetch artworks */
const isError = ref(false)
const showError = () => {
  loading.value = false
  isError.value = true
}

/** Reset refs */
const reset = () => {
  loading.value = false
  isEmpty.value = false
  isError.value = false
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/tailwind.scss';
@import '~/assets/css/artworks/list.scss';
</style>

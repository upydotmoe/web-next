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

    <!-- On loading, empty or error-->
    <LoadingEmptyErrorMessage
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

      <!-- Load more button -->
      <div 
        v-show="showLoadMoreButton" 
        class="w-full primary-button"
        :class="loadMoreOptions.delay ? 'animate-pulse' : ''" 
        @click="loadMore"
      >
        {{ $t('loadMore') }}
      </div>
    </div>
  </div>
</template>

<script setup>
// components
import UserList from '~/components/users/UserList.vue'
import LoadingEmptyErrorMessage from '~/components/globals/LoadingEmptyErrorMessage.vue'

// composables
import useUser from '~/composables/users/useUser'

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const userApi = useUser(oApiConfiguration, fetchOptions())

const emits = defineEmits (['countUsers'])

const route = useRoute()
const { q } = route.query

// watch for search query/keyword change
watch (() => route.query.q, (newKeyword, oldKeyword) => {
  if (newKeyword !== oldKeyword) {
    keyword.value = newKeyword
    fetchTop()
  }
})

/** Before mount, fetch first row */
const keyword = ref(q)
onMounted (() => {
  setTimeout(() => {
    fetchTop()
  }, 1000);
})

/** Fetch first row */
const users = ref([])
const fetchTop = async () => {
  resetBeforeFetch()

  const { users: dataUsers, pagination: dataPagination } = await fetch()
  
  if (dataUsers.length && dataPagination.record_total) {
    users.value = dataUsers
  }

  emits('countUsers', dataPagination.record_total)
}

/** Fetch */
const loading = ref(true)
const isError = ref(false)
const isEmpty = computed(() => !isError.value && !users.value.length)
const showLoadMoreButton = ref(true)
const pagination = ref({
  perPage: 16,
  page: ref(0)
})
const fetch = async () => {
  const [data, error] = await userApi.searchUsers({
    keyword: keyword.value ?? '',
    pagination: {
      page: pagination.value.page,
      perPage: pagination.value.perPage
    }
  })

  loading.value = false
  
  // hide load more button if there is no more artwork to load
  if (!data.pagination.next_previous.next_page) {
    showLoadMoreButton.value = false
  }

  if (error) {
    isError.value = true
  } else {
    pagination.value.page += 1
    return data
  }
}

// Load more function
const loadMoreOptions = ref({
  delay: false,
  showDiscoveryButton: false
})
const loadMore = async () => {
  loadMoreOptions.value.delay = true
  const data = await fetch()

  data.users.forEach((work) => {
    users.value.push(work)
  })

  loadMoreOptions.value.delay = false
}

const resetBeforeFetch = () => {
  users.value = []
  showLoadMoreButton.value = true
  pagination.value.page = 0
  loading.value = true
  isError.value = false
}
</script>

<style lang="scss" scoped>
// @import '~/assets/css/tailwind.scss';
@import '~/assets/css/artworks/list.scss';
</style>

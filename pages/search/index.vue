<template>
  <Layout
    :with-footer="true"
    :hide-side="true"
    :no-right-side="true"
  >
    <LoginMessage v-if="!auth.loggedIn" />

    <div
      v-else
      id="lists"
    >
      <!-- search box -->
      <span class="search">
        <input
          v-model="searchKeyword"
          type="text"
          name="search"
          :placeholder="$t('search.search')"
          @keyup.enter="search()"
        >
        <span
          class="search-button"
          @click="search()"
        >
          <Icon :name="'i-ion-search'" />
        </span>
      </span>

      <div class="flex flex-row gap-2 mb-6 w-full">
        <div
          :class="[
            'px-2 rounded-lg',
            activeSection === POST_TYPES.ARTWORK ? 'primary-button' : 'light-bordered-button'
          ]"
          @click="activeSection = POST_TYPES.ARTWORK"
        >
          <Icon
            :name="'i-majesticons-image'"
            :class="[
              'mr-2',
              { 'text-white': activeSection === POST_TYPES.ARTWORK }
            ]"
          />
          {{ $t('artworks.artworks') }}
          <span
            class="px-1 ml-2 rounded"
            :class="activeSection === POST_TYPES.ARTWORK ? 'theme-color' : 'bg-gray-600 text-white'"
          >
            {{ artworkFound }}
          </span>
        </div>

        <div
          :class="[
            'px-2 rounded-lg',
            activeSection === 'users' ? 'primary-button' : 'light-bordered-button'
          ]"
          @click="activeSection = 'users'"
        >
          <Icon
            :name="'i-fluent-person-32-regular'"
            :class="[
              'mr-2',
              { 'text-white': activeSection === 'users' }
            ]"
          />
          {{ $t('users.users') }}
          <span
            class="px-1 ml-2 rounded"
            :class="activeSection === 'users' ? 'theme-color' : 'bg-gray-600 text-white'"
          >
            {{ userFound }}
          </span>
        </div>
      </div>

      <!-- Top navigations -->
      <div v-show="activeSection === POST_TYPES.ARTWORK">
        <Artworks
          @countArtworks="countArtworks"
        />
      </div>

      <div v-show="activeSection === 'users'">
        <Users
          @countUsers="countUsers"
        />
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

import { POST_TYPES } from '~/utils/constants'

// stores
import useAuthStore from '@/stores/auth.store'

// components
import Layout from '~/components/layouts/Layout.vue'
import Icon from '~/components/globals/Icon.vue'
import Artworks from '~/components/search/Artworks.vue'
import Users from '~/components/search/Users.vue'
import LoginMessage from '~/components/globals/LoginMessage.vue'

// stores
const auth = useAuthStore()

const { t } = useI18n()

const router = useRouter()
const route = useRoute()

/**
 * @meta
 */
useHead({
  title: t('search.search') + (route.query.q ? ` "${route.query.q}"` : '')
})

const searchKeyword = ref('')
onMounted(() => {
  searchKeyword.value = route.query.q
})

const activeSection = ref(route.query.t ?? POST_TYPES.ARTWORK)

const artworkFound = ref(0)
const countArtworks = (foundRows) => {
  artworkFound.value = foundRows
}

const userFound = ref(0)
const countUsers = (foundRows) => {
  userFound.value = foundRows
}

/**
 * @search
 */
/**
 * SEARCH
 */
watch(() => route.query, ({ q }) => {
  searchKeyword.value = q

  useHead({
    title: t('search.search') + (searchKeyword.value ? ` "${searchKeyword.value}"` : route.query.q)
  })
})

const search = () => {
  router.push({
    path: '/search',
    query: {
      q: searchKeyword.value
    },
    replace: true,
    force: true
  })
}
</script>

<style lang="scss" scoped>
// @import '~/assets/css/tailwind.scss';
@import '~/assets/css/artworks/list-6.scss';

.search {
  @apply justify-center mx-0 w-full h-10 text-xs rounded cursor-pointer theme-color flex flex-row mb-4;

  input {
    @apply flex-grow px-4 text-xs rounded border-none focus:outline-none theme-color;
  }

  .search-button {
    @apply flex relative justify-center items-center w-10 h-10 rounded-full;

    .icon {
      @apply text-base;
    }
  }
}
</style>

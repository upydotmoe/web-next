<template>
  <Layout 
    :with-footer="true" 
    :hide-side="true"
    :no-right-side="true"
  >
    <div id="lists">
      <!-- search box -->
      <span class="search">
        <input v-model="searchKeyword" type="text" name="search" :placeholder="$t('search')" @keyup.enter="search()">
        <span class="search-button" @click="search()">
          <Icon :name="'i-ion-search'" />
        </span>
      </span>

      <div class="flex flex-row mb-6 w-full">
        <div 
          class="rounded-lg profile-category-button left-menu-link theme-color-secondary"
          :class="{ 'button-color text-white': activeSection === 'artworks' }"
          @click="activeSection = 'artworks'" 
        >
          {{ $t('artworks.artworks') }}
          <span 
            class="px-1 ml-2 rounded"
            :class="activeSection === 'artworks' ? 'theme-color' : 'bg-gray-600 text-white'"
          >
            {{ artworkFound }}
          </span>
        </div>
        
        <div 
          class="rounded-lg profile-category-button left-menu-link theme-color-secondary"
          :class="{ 'button-color text-white': activeSection === 'users' }"
          @click="activeSection = 'users'" 
        >
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
      <div v-show="activeSection === 'artworks'">
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
// import { onClickOutside } from '@vueuse/core'
import { useI18n } from 'vue-i18n'

// components
import Layout from '~/components/layouts/Layout.vue'
import Icon from '~/components/globals/Icon.vue'
import Artworks from '~/components/search/Artworks.vue'
import Users from '~/components/search/Users.vue'

const { t } = useI18n()

const router = useRouter()
const route = useRoute()

/**
 * @meta
 */
useHead ({
  title: t('search') + (route.query.q ? ` "${route.query.q}"` : '')
})

const searchKeyword = ref('')
onMounted (() => {
  searchKeyword.value = route.query.q
})

const activeSection = ref('artworks')

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
watch (() => route.query, ({ q }) => {
  searchKeyword.value = q

  useHead ({
    title: t('search') + (searchKeyword.value ? ` "${searchKeyword.value}"` : route.query.q)
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

// const closeModal = (modalId) => {
//   useModal().closeModal(modalId)
// }
// onClickOutside(popularModalViewRef, () => closeModal('popular-modal'))
</script>

<style lang="scss" scoped>
@import '~/assets/css/tailwind.scss';
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

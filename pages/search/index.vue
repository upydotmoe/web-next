<template>
  <Layout 
    :with-footer="true" 
    :hide-side="true"
    :no-right-side="true"
  >
    <div id="lists">
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

// components
import Layout from '~/components/layouts/Layout.vue'
import Artworks from '~/components/search/Artworks.vue'
import Users from '~/components/search/Users.vue'

const activeSection = ref('artworks')

const artworkFound = ref(0)
const countArtworks = (foundRows) => {
  artworkFound.value = foundRows
}

const userFound = ref(0)
const countUsers = (foundRows) => {
  userFound.value = foundRows
}

// const closeModal = (modalId) => {
//   useModal().closeModal(modalId)
// }
// onClickOutside(popularModalViewRef, () => closeModal('popular-modal'))
</script>

<style lang="scss" scoped>
@import '~/assets/css/tailwind.scss';
@import '~/assets/css/artworks/list.scss';
</style>

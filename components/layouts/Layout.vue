<template>
  <div class="layout">
    <LayoutsNavbar />

    <div
      :class="[
        'flex mx-auto w-full md:px-4',
        { 'p-2': route.name != 'feed' },
        { '2xl:w-8/12': !fullscreen }
      ]"
    >
      <div v-if="!hideSide" class="hidden lg:w-1/5 md:block md:mr-6">
        <!-- <div class="sticky top-36">
          <nuxt-link v-if="auth.loggedIn" :to="'/feed'" class="flex flex-row py-3 px-4 mb-2 font-medium leading-5 rounded ring-offset-2 transition-all duration-200 cursor-pointer left-menu-link parent-icon theme-color hover:button hover:text-white">
            <Icon :name="'home-outline'" class="text-lg hover:text-white" />
            <span class="hidden ml-3 lg:block">{{ $t('feed') }}</span>
          </nuxt-link>
          <nuxt-link :to="'/explore'" class="flex flex-row py-3 px-4 font-medium leading-5 rounded ring-offset-2 transition-all duration-200 cursor-pointer left-menu-link parent-icon theme-color hover:button hover:text-white">
            <Icon :name="'planet-outline'" class="text-lg hover:text-white" />
            <span class="hidden ml-3 lg:block">{{ $t('explore') }}</span>
          </nuxt-link>
          <div 
            v-if="auth.loggedIn" 
            class="flex flex-row py-3 px-4 mt-2 font-medium leading-5 rounded ring-offset-2 transition-all duration-200 cursor-pointer left-menu-link parent-icon theme-color hover:button hover:text-white"
            @click="random()" 
          >
            <Icon :name="'dice-outline'" class="text-lg hover:text-white" />
            <span class="hidden ml-3 lg:block">{{ $t('random') }}</span>
          </div>
          <div class="custom-divider" />
          <nuxt-link :to="'/comics'" class="flex flex-row py-3 px-4 mb-2 font-medium leading-5 rounded ring-offset-2 transition-all duration-200 cursor-pointer left-menu-link parent-icon theme-color hover:button hover:text-white">
            <Icon :name="'book-outline'" class="text-lg hover:text-white" />
            <span class="hidden ml-3 lg:block">{{ $t('comics.comics') }}</span>
          </nuxt-link>
          <nuxt-link :to="'/tutorials'" class="flex flex-row py-3 px-4 font-medium leading-5 rounded ring-offset-2 transition-all duration-200 cursor-pointer left-menu-link parent-icon theme-color hover:button hover:text-white">
            <Icon :name="'pencil-outline'" class="text-lg hover:text-white" />
            <span class="hidden ml-3 lg:block">{{ $t('tutorials.tutorials') }}</span>
          </nuxt-link>
          <div class="custom-divider" />
          <nuxt-link :to="'/saved'" class="flex flex-row py-3 px-4 font-medium leading-5 rounded ring-offset-2 transition-all duration-200 cursor-pointer left-menu-link parent-icon theme-color hover:button hover:text-white">
            <Icon :name="'i-majesticons-bookmark-line'" class="text-lg hover:text-white" />
            <span class="hidden ml-3 lg:block">{{ $t('saved') }}</span>
          </nuxt-link>
          <div class="custom-divider" />
          <nuxt-link :to="'/communities'" class="flex flex-row py-3 px-4 font-medium leading-5 rounded ring-offset-2 transition-all duration-200 cursor-pointer left-menu-link parent-icon theme-color hover:button hover:text-white">
            <Icon :name="'i-fluent-people-checkmark-24-regular'" class="text-lg hover:text-white" />
            <span class="hidden ml-3 lg:block">{{ $t('communities') }}</span>
          </nuxt-link>
        </div> -->
      </div>

      <div 
        class="mt-2"
        :class="[
          hideSide || noRightSide ? 'w-full' : 'w-full lg:w-7/12',
          { 'h-screen': hScreen },
          // { 'md:mt-36': !unfixedNavbarRoutes().includes(currentRoute) }
        ]"
      >
        <slot />
      </div>

      <div v-if="!noRightSide" class="hidden w-1/5 lg:block md:ml-6">
        <div class="sticky top-36 w-full">
          <slot name="right-side" />
        </div>
      </div>
    </div>

    <!-- <BottomNavigation /> -->

    <LayoutsFooter 
      v-if="withFooter" 
      :with-footer="withFooter" 
    />
  </div>
</template>

<script setup>
defineProps ({
  withFooter: {
    type: Boolean,
    default: false
  },
  classProp: {
    type: String,
    default: ''
  },
  hideSide: {
    type: Boolean,
    default: false
  },
  noRightSide: {
    type: Boolean,
    default: false
  },
  hScreen: {
    type: Boolean,
    default: false
  },
  fullscreen: {
    type: Boolean,
    default: false
  }
})

const route = useRoute()

// todo: future feature, custom color theme configured by user
// document.documentElement.style.setProperty('--button', '#FF0000')
</script>

<style lang="scss" scoped>
// @import '~/assets/css/wavy-bg.scss';
@import '~/assets/css/layout.scss';

.left-menu-link.router-link-active {
  @apply button;

  .icon {
    @apply text-white;
  }
}
</style>

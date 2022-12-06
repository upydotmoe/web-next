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
      <div v-if="!hideSide" class="hidden lg:w-1/5 md:block md:mr-4">
        <div class="sticky top-36 w-full">
          <slot name="left-side" />
        </div>
      </div>

      <div 
        class="mt-2"
        :class="[
          hideSide || noRightSide ? 'w-full' : 'w-full lg:w-7/12',
          { 'h-screen': hScreen },
          // { 'md:mt-36': !unfixedNavbarRoutes().includes(currentRoute) },
          { 'md:mt-36': fixedNavbarRoutes().includes(currentRoute) && !isMobile() },
        ]"
      >
        <slot />
      </div>

      <div v-if="!noRightSide" class="hidden w-1/5 lg:block md:ml-4">
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
const currentRoute = route.name

// todo: future feature, custom color theme configured by user
// document.documentElement.style.setProperty('--button', '#FF0000')
</script>

<style lang="scss" scoped>
// @import '~/assets/css/wavy-bg.scss';
@import '~/assets/css/layout.scss';
</style>

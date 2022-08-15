<template>
  <Layout 
    :hide-side="true"
    :with-footer="true"
    :no-right-side="true"
  >
    <div class="flex flex-row w-full">
      <!-- tabs -->
      <div class="mr-4 md:mr-6 lg:w-1/5">
        <div 
          class="flex flex-row py-3 px-4 mb-2 font-medium leading-5 rounded ring-offset-2 transition-all duration-200 cursor-pointer left-menu-link parent-icon theme-color hover:button hover:text-white"
          :class="{ 'button-color text-white': config.currentState === 'profile' }"
          @click="changeCurrentState('profile')"
        >
          <Icon v-show="config.currentState === 'profile'" :name="'i-fluent-person-32-regular'" class="text-lg text-white lg:mr-2 hover:text-white" />
          <Icon v-show="config.currentState !== 'profile'" :name="'i-fluent-person-32-regular'" class="text-lg lg:mr-2 hover:text-white" />

          <span class="hidden-lg-flex">Profile</span>
        </div>
        
        <div 
          class="flex flex-row py-3 px-4 mb-2 font-medium leading-5 rounded ring-offset-2 transition-all duration-200 cursor-pointer left-menu-link parent-icon theme-color hover:button hover:text-white"
          :class="{ 'button-color text-white': config.currentState === 'social' }"
          @click="changeCurrentState('social')"
        >
          <Icon v-show="config.currentState === 'social'" :name="'i-ion-share-social-outline'" class="text-lg text-white lg:mr-2 hover:text-white" />
          <Icon v-show="config.currentState !== 'social'" :name="'i-ion-share-social-outline'" class="text-lg lg:mr-2 hover:text-white" />

          <span class="hidden-lg-flex">Social</span>
        </div>
        
        <div 
          class="flex flex-row py-3 px-4 mb-2 font-medium leading-5 rounded ring-offset-2 transition-all duration-200 cursor-pointer left-menu-link parent-icon theme-color hover:button hover:text-white"
          :class="{ 'button-color text-white': config.currentState === 'settings' }"
          @click="changeCurrentState('settings')"
        >
          <Icon v-show="config.currentState === 'settings'" :name="'i-ph-gear-six'" class="text-lg text-white lg:mr-2 hover:text-white" />
          <Icon v-show="config.currentState !== 'settings'" :name="'i-ph-gear-six'" class="text-lg lg:mr-2 hover:text-white" />

          <span class="hidden-lg-flex">Settings</span>
        </div>
      </div>

      <!-- content -->
      <div class="w-full">
        <Information 
          v-if="config.currentState === 'profile'"
        />

        <Social 
          v-if="config.currentState === 'social'"
        />

        <Settings 
          v-if="config.currentState === 'settings'"
        />
      </div>
    </div>
  </Layout>
</template>

<script setup>
// components
import Layout from '~/components/layouts/Layout.vue'
import Icon from '~/components/globals/Icon.vue'
import Information from '~/components/profile/settings/Information.vue'
import Social from '~/components/profile/settings/Social.vue'
import Settings from '~/components/profile/settings/Settings.vue'

const config = ref({
  currentState: 'profile'
})

const changeCurrentState = (state) => {
  config.value.currentState = state
}
</script>

<style>

</style>

<template>
  <Layout 
    :hide-side="true"
    :with-footer="true"
    :no-right-side="true"
  >
    <div class="flex flex-row w-full">
      <!-- tabs -->
      <div class="mr-2 md:mr-4 lg:w-1/5">
        <nuxt-link
          :to="'/profile'" 
          class="flex flex-row py-3 px-4 mb-4 font-medium leading-5 text-white rounded ring-offset-2 transition-all duration-200 cursor-pointer left-menu-link parent-icon theme-color hover:button hover:text-white button-color"
        >
          <Icon :name="'i-typcn-arrow-back'" class="text-lg text-white lg:mr-2 hover:text-white" />

          <span class="hidden-lg-flex">{{ $t('settings.backToProfile') }}</span>
        </nuxt-link>

        <div 
          class="flex flex-row py-3 px-4 mb-2 font-medium leading-5 rounded ring-offset-2 transition-all duration-200 cursor-pointer left-menu-link parent-icon theme-color hover:button hover:text-white"
          :class="{ 'button-color text-white': config.currentState === 'profile' }"
          @click="changeCurrentState('profile')"
        >
          <Icon v-show="config.currentState === 'profile'" :name="'i-fluent-person-32-regular'" class="text-lg text-white lg:mr-2 hover:text-white" />
          <Icon v-show="config.currentState !== 'profile'" :name="'i-fluent-person-32-regular'" class="text-lg lg:mr-2 hover:text-white" />

          <span class="hidden-lg-flex">{{ $t('settings.profile') }}</span>
        </div>
        
        <div 
          class="flex flex-row py-3 px-4 mb-2 font-medium leading-5 rounded ring-offset-2 transition-all duration-200 cursor-pointer left-menu-link parent-icon theme-color hover:button hover:text-white"
          :class="{ 'button-color text-white': config.currentState === 'social' }"
          @click="changeCurrentState('social')"
        >
          <Icon v-show="config.currentState === 'social'" :name="'i-ion-share-social-outline'" class="text-lg text-white lg:mr-2 hover:text-white" />
          <Icon v-show="config.currentState !== 'social'" :name="'i-ion-share-social-outline'" class="text-lg lg:mr-2 hover:text-white" />

          <span class="hidden-lg-flex">{{ $t('settings.social') }}</span>
        </div>
        
        <div 
          class="flex flex-row py-3 px-4 mb-2 font-medium leading-5 rounded ring-offset-2 transition-all duration-200 cursor-pointer left-menu-link parent-icon theme-color hover:button hover:text-white"
          :class="{ 'button-color text-white': config.currentState === 'password' }"
          @click="changeCurrentState('password')"
        >
          <Icon v-show="config.currentState === 'password'" :name="'i-material-symbols-key-outline-rounded'" class="text-lg text-white lg:mr-2 hover:text-white" />
          <Icon v-show="config.currentState !== 'password'" :name="'i-material-symbols-key-outline-rounded'" class="text-lg lg:mr-2 hover:text-white" />

          <span class="hidden-lg-flex">{{ $t('settings.password') }}</span>
        </div>
        
        <div 
          class="flex flex-row py-3 px-4 mb-2 font-medium leading-5 rounded ring-offset-2 transition-all duration-200 cursor-pointer left-menu-link parent-icon theme-color hover:button hover:text-white"
          :class="{ 'button-color text-white': config.currentState === 'settings' }"
          @click="changeCurrentState('settings')"
        >
          <Icon v-show="config.currentState === 'settings'" :name="'i-ph-gear-six'" class="text-lg text-white lg:mr-2 hover:text-white" />
          <Icon v-show="config.currentState !== 'settings'" :name="'i-ph-gear-six'" class="text-lg lg:mr-2 hover:text-white" />

          <span class="hidden-lg-flex">{{ $t('settings.settings') }}</span>
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

        <Password 
          v-if="config.currentState === 'password'"
        />
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

// components
import Layout from '~/components/layouts/Layout.vue'
import Icon from '~/components/globals/Icon.vue'
import Information from '~/components/profile/settings/Information.vue'
import Social from '~/components/profile/settings/Social.vue'
import Settings from '~/components/profile/settings/Settings.vue'
import Password from '~/components/profile/settings/Password.vue'

const { t } = useI18n()

/**
 * @meta
 */
const metaTitle = ref(t('meta.title.profile.profile'))
useHead ({
  title: computed(() => metaTitle.value)
})

const config = ref({
  currentState: 'profile'
})

watch(() => config.value.currentState, (current) => {
  if (current === 'profile') {
    metaTitle.value = t('meta.title.profile.profile')
  } else if (current === 'social') {
    metaTitle.value = t('meta.title.profile.social')
  } else if (current === 'password') {
    metaTitle.value = t('meta.title.profile.password')
  } else {
    metaTitle.value = t('meta.title.profile.settings')
  }
})

const changeCurrentState = (state) => {
  config.value.currentState = state
}
</script>

<style>

</style>

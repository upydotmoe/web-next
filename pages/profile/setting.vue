<template>
  <Layout
    :hide-side="true"
    :with-footer="true"
    :no-right-side="true"
  >
    <div class="flex flex-row gap-4 w-full md:gap-6">
      <!-- tabs -->
      <div class="lg:w-1/5">
        <nuxt-link
          :to="'/profile'"
          class="mb-6 w-full light-bordered-button"
        >
          <Icon
            :name="'i-typcn-arrow-back'"
            class="text-lg text-white lg:mr-2 hover:text-white"
          />

          <span class="hidden-lg-flex">{{ $t('settings.backToProfile') }}</span>
        </nuxt-link>

        <div
          class="flex flex-row py-3 px-4 mb-2 font-medium leading-5 rounded ring-offset-2 transition-all duration-200 cursor-pointer left-menu-link parent-icon theme-color hover:button hover:text-white"
          :class="{ 'button-color text-white': config.currentState === 'profile' }"
          @click="changeCurrentState('profile')"
        >
          <Icon
            v-show="config.currentState === 'profile'"
            :name="'i-fluent-person-32-regular'"
            class="text-lg text-white lg:mr-2 hover:text-white"
          />
          <Icon
            v-show="config.currentState !== 'profile'"
            :name="'i-fluent-person-32-regular'"
            class="text-lg lg:mr-2 hover:text-white"
          />

          <span class="hidden-lg-flex">{{ $t('settings.profile') }}</span>
        </div>

        <div
          class="flex flex-row py-3 px-4 mb-2 font-medium leading-5 rounded ring-offset-2 transition-all duration-200 cursor-pointer left-menu-link parent-icon theme-color hover:button hover:text-white"
          :class="{ 'button-color text-white': config.currentState === 'social' }"
          @click="changeCurrentState('social')"
        >
          <Icon
            v-show="config.currentState === 'social'"
            :name="'i-ion-share-social-outline'"
            class="text-lg text-white lg:mr-2 hover:text-white"
          />
          <Icon
            v-show="config.currentState !== 'social'"
            :name="'i-ion-share-social-outline'"
            class="text-lg lg:mr-2 hover:text-white"
          />

          <span class="hidden-lg-flex">{{ $t('settings.social') }}</span>
        </div>

        <div
          class="flex flex-row py-3 px-4 mb-2 font-medium leading-5 rounded ring-offset-2 transition-all duration-200 cursor-pointer left-menu-link parent-icon theme-color hover:button hover:text-white"
          :class="{ 'button-color text-white': config.currentState === 'password' }"
          @click="changeCurrentState('password')"
        >
          <Icon
            v-show="config.currentState === 'password'"
            :name="'i-material-symbols-key-outline-rounded'"
            class="text-lg text-white lg:mr-2 hover:text-white"
          />
          <Icon
            v-show="config.currentState !== 'password'"
            :name="'i-material-symbols-key-outline-rounded'"
            class="text-lg lg:mr-2 hover:text-white"
          />

          <span class="hidden-lg-flex">{{ $t('settings.security') }}</span>
        </div>

        <div
          class="flex flex-row py-3 px-4 mb-2 font-medium leading-5 rounded ring-offset-2 transition-all duration-200 cursor-pointer left-menu-link parent-icon theme-color hover:button hover:text-white"
          :class="{ 'button-color text-white': config.currentState === 'settings' }"
          @click="changeCurrentState('settings')"
        >
          <Icon
            v-show="config.currentState === 'settings'"
            :name="'i-ph-gear-six'"
            class="text-lg text-white lg:mr-2 hover:text-white"
          />
          <Icon
            v-show="config.currentState !== 'settings'"
            :name="'i-ph-gear-six'"
            class="text-lg lg:mr-2 hover:text-white"
          />

          <span class="hidden-lg-flex">{{ $t('settings.settings') }}</span>
        </div>
      </div>

      <!-- content -->
      <section
        id="setting-content"
        class="w-full"
      >
        <ProfileInformationSetting
          v-if="config.currentState === 'profile'"
        />

        <ProfileSocialSetting
          v-if="config.currentState === 'social'"
        />

        <ProfileSettings
          v-if="config.currentState === 'settings'"
        />

        <ProfileSecuritySetting
          v-if="config.currentState === 'password'"
        />
      </section>
    </div>
  </Layout>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

// components
import Layout from '~/components/layouts/Layout.vue'
import Icon from '~/components/globals/Icon.vue'
import ProfileInformationSetting from '~/components/profile/settings/ProfileInformationSetting.vue'
import ProfileSocialSetting from '~/components/profile/settings/ProfileSocialSetting.vue'
import ProfileSettings from '~/components/profile/settings/ProfileSettings.vue'
import ProfileSecuritySetting from '~/components/profile/settings/ProfileSecuritySetting.vue'

const { t } = useI18n()

// define page meta
const metaTitle = ref(t('meta.title.profile.profile'))
useHead({
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

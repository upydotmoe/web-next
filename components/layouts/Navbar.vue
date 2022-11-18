<template>
  <div
    class="z-20 w-full theme-color"
    :class="[
      { 'md:fixed': fixedNavbarRoutes().includes(currentRoute) && !isMobile() }
    ]"
  >
    <div 
      id="nav"
      @blur="languageSelection = false"
    >
      <!-- mobile navigation bars -->
      <nuxt-link
        :to="auth.loggedIn ? '/feed' : '/explore'" 
        class="w-8 h-8 rounded-md flex-md-hidden"
      >
        <img :src="$colorMode.preference == 'dark' ? logoWhite : logo" class="logo">
      </nuxt-link>

      <!-- left menus -->
      <div class="menus">
        <nuxt-link :to="auth.loggedIn ? '/feed' : '/explore'">
          <img :src="$colorMode.preference == 'dark' ? logoWhite : logo" class="logo">
        </nuxt-link>
      </div>

      <!-- search box -->
      <span class="search">
        <input v-model="searchKeyword" type="text" name="search" :placeholder="$t('search')" @keyup.enter="search()">
        <span class="search-button" @click="search()">
          <Icon :name="'i-ion-search'" />
        </span>
      </span>

      <!-- right menus -->
      <div class="mt-1 right-menus">
        <!-- desktop nav icons -->
        <div class="nav-icon-group">
          <div class="hidden-md-flex">
            <div v-if="auth.loggedIn" class="nav-icon">
              <a href="/post">
                <Icon :name="'i-ion-add'" />
              </a>
            </div>
          </div>

          <div class="flex-md-hidden">
            <div class="nav-icon">
              <nuxt-link :to="'/search?q='">
                <Icon :name="'i-ion-search'" />
              </nuxt-link>
            </div>
          </div>

          <div class="nav-icon">
            <Icon 
              :name="$colorMode.value == 'light' ? 'i-fluent-weather-moon-16-regular' : 'i-line-md-sunny-outline-loop'" 
              @click.native="$colorMode.preference == 'dark' ? $colorMode.preference='light' : $colorMode.preference='dark'" 
            />
          </div>

          <!-- language selection -->
          <div class="profile dropdown nav-icon">
            <button 
              class="thumbnail" 
              aria-haspopup="true" 
              aria-expanded="true" 
              aria-controls="language-group"
              @click="languageSelection = !languageSelection"
            >
              <Icon :name="'i-fa-language'" />
            </button>

            <div class="profile-dropdown dropdown-menu">
              <div 
                id="language-group"
                class="px-2 w-52 toggler"
                aria-labelledby="language-selection-buttons" 
                role="menu"
              >
                <div v-for="locale in availableLanguages" @click="switchLocale(locale.iso)">
                  <div class="item" :class="selectedLocale == locale.iso ? 'button-color text-white' : 'theme-color-secondary'">
                    <Icon :name="locale.icon" :with-padding="true" /> {{ locale.name }}
                  </div>
                </div>
                
                <!-- <div class="custom-divider" /> 

                <nuxt-link :to="'/'" class="rounded-md">
                  <div class="px-2 item">
                    <span class="mx-auto">{{ $t('language.request') }}</span>
                  </div>
                </nuxt-link> -->
              </div>
            </div>
          </div>

          <!-- notification icon: show in desktop -->
          <div class="hidden-md-flex">
            <div 
              v-if="auth.loggedIn" 
              class="inline-block relative profile dropdown nav-icon"
              @click="clearNotificationCounter()"
            >
              <button
                aria-haspopup="true" 
                aria-expanded="true" 
                aria-controls="notification-group"
              >
                <Icon :name="'i-ri-notification-3-line'" />
                <span
                  v-show="notificationTotal > 0"
                  class="inline-flex absolute top-0 right-0 justify-center items-center py-1 -mt-1 w-6 font-bold text-white bg-red-400 rounded-md text-xxs"
                  :class="[notificationTotal < 10 ? 'mr-1' : '-mr-1']"
                >
                  {{ notificationTotal > 99 ? '99+' : notificationTotal }}
                </span>
              </button>

              <div class="text-xs profile-dropdown dropdown-menu">
                <div 
                  id="notification-group"
                  class="toggler"
                  style="width: 500px;"
                >
                  <Notifications :is-navbar="true" />
                </div>
              </div>
            </div>
          </div>
          
          <!-- notification icon: show in mobile or smaller device -->
          <div v-if="auth.loggedIn" class="flex-md-hidden">
            <div class="nav-icon">
              <nuxt-link :to="'/notifications'">
                <Icon :name="'i-ri-notification-3-line'" />
              </nuxt-link>
            </div>
          </div>

          <!-- login button for mobile or smaller device -->
          <div class="flex md:hidden">
            <div v-if="!auth.loggedIn" class="flex nav-icon md:hidden" @click="openModal('auth-modal')">
              <Icon :name="'i-fe-login'" />
            </div>
          </div>

          <!-- user logged in -->
          <div v-if="auth.loggedIn" class="ml-4 profile dropdown">
            <button 
              class="thumbnail"
              aria-haspopup="true" 
              aria-expanded="true" 
              aria-controls="profile-dropdown-items"
            >
              <img :src="avatarCoverUrl(auth.user.avatar_bucket, auth.user.avatar_filename)" @error="imageLoadError">
            </button>

            <div class="profile-dropdown dropdown-menu">
              <div 
                id="profile-dropdown-items" 
                class="w-52 toggler"
                aria-labelledby="profile-dropdown-buttons" 
                role="menu"
              >
                <div class="menu-wrapper">
                  <div class="mini-profile-info">
                    <img :src="avatarCoverUrl(auth.user.avatar_bucket, auth.user.avatar_filename)" @error="imageLoadError">

                    <div class="mt-4 font-semibold">{{ auth.user.name }}</div>
                    <div class="text-xs">@{{ auth.user.username }}</div>
                  </div>

                  <div class="custom-divider" />

                  <nuxt-link :to="'/profile'">
                    <div class="menu parent-icon">
                      <Icon :name="'i-fluent-person-32-regular'" />
                      {{ $t('profile.profile') }}
                    </div>
                  </nuxt-link>
                  <nuxt-link :to="'/profile?o=albums'">
                    <div class="menu parent-icon">
                      <Icon :name="'i-bx-photo-album'" />
                      {{ $t('albums.album') }}
                    </div>
                  </nuxt-link>
                  <nuxt-link :to="'/profile?o=collections'">
                    <div class="menu parent-icon">
                      <Icon :name="'i-majesticons-bookmark-line'" />
                      {{ $t('collections.collection') }}
                    </div>
                  </nuxt-link>

                  <div class="custom-divider" />

                  <nuxt-link v-if="auth.loggedIn" :to="'/profile/setting'">
                    <div class="menu parent-icon">
                      <Icon :name="'i-ph-gear-six'" />
                      {{ $t('settings.settings') }}
                    </div>
                  </nuxt-link>

                  <nuxt-link :to="'/reports'">
                    <div class="menu parent-icon">
                      <Icon :name="'i-akar-icons-flag'" />
                      {{ auth.user.is_admin || auth.user.is_moderator ? $t('reports.reports') : $t('reports.yourReports') }}
                    </div>
                  </nuxt-link>

                  <div class="custom-divider" />

                  <nuxt-link :to="'/pro'">
                    <div class="menu parent-icon">
                      <Icon :name="'i-fluent-star-emphasis-24-regular'" />
                      {{ $t('pro') }}
                    </div>
                  </nuxt-link>
                  <nuxt-link :to="'/support-us'">
                    <div class="menu parent-icon">
                      <Icon :name="'i-ri-heart-3-line'" />
                      {{ $t('supportUs') }}
                    </div>
                  </nuxt-link>

                  <div class="custom-divider" />

                  <div class="menu parent-icon" @click="userLogout()">
                    <Icon :name="'i-majesticons-logout-line'" />
                    {{ $t('logout') }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button v-if="!auth.loggedIn" class="hidden ml-2 primary-button md:flex" @click="openModal('auth-modal')">
          {{ $t('logins.login').toUpperCase() }}
        </button>
      </div>

      <!-- login/register/reset forms -->
      <LoginModal />
    </div>

    <div class="theme-colored">
      <MiniNavbar />
    </div>
  </div>
</template>

<script setup>
// assets
import logo from '~/static/logo/logo.png'
import logoWhite from '~/static/logo/logo-white.png'

// components
import MiniNavbar from '~/components/layouts/MiniNavbar.vue'
import Icon from '~/components/globals/Icon.vue'
import LoginModal from '~/components/auth/forms/Modal.vue'
import Notifications from '~/components/notifications/Notifications.vue'

// stores
import authStore from '@/stores/auth.store'
import useLocaleStore from '@/stores/locale.store'

// misc
import { availableLanguages } from '@/utils/locale/available-languages'

// stores
const auth = authStore()

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const notificationApi = useNotification(oApiConfiguration, fetchOptions())

const router = useRouter()
const route = useRoute()
const currentRoute = route.name

onMounted(async () => {
  if (auth.loggedIn) {
    await countNotifications()
  }

  if (route.query && route.query.q) {
    searchKeyword.value = route.query.q
  }
})

const userLogout = async () => {
  await auth.logout()

  // redirect to explore page 
  router.go('/')
}

/**
 * @search
 */
/**
 * SEARCH
 */
const searchKeyword = ref('')
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
/**
 * @search
 */

/**
 * @notifications
 */
/**
 * Count notifications
 */
const notificationTotal = ref(0)
const countNotifications = async () => {
  const [data, error] = await notificationApi.countAllNotifications()

  if (error) {
    // todo: handle error
  } else {
    notificationTotal.value = data.count
  }
}

const clearNotificationCounter = async () => {
  const [success, error] = await notificationApi.clearNotificationCounter()

  if (success) {
    notificationTotal.value = 0
  } else {
    // todo: handle error
  }
}

/**
 * Change language/app locale
 */
const localeStore = useLocaleStore()
const selectedLocale = computed (() => localeStore.locale)
const switchLocale = (localePrefix) => {
  localeStore.changeLocale(localePrefix)
}
/**
 * @notifications
 */
</script>

<style lang="scss" scoped>
@import '~/assets/css/navbar.scss';
</style>

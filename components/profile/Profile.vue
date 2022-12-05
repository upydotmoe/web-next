<template>
  <Layout 
    :hide-side="true"
    :with-footer="true"
    :no-right-side="true"
  >
    <!-- cover -->
    <div>
      <!-- test --> <img 
        preload
        loading="lazy"
        :src="avatarCoverUrl(userInfo.cover_bucket, userInfo.cover_filename)" 
        class="object-cover object-top w-full h-32 rounded-t md:h-52 lg:h-72 xl:h-96 unselectable" 
        @error="defaultCoverImage"
      />
      <nuxt-link
        v-if="auth.loggedIn && auth.user.id === userInfo.id"
        :to="'/profile/setting'"
        class="float-right absolute right-4 mt-2 shadow-md icon-button-primary-color flex-md-hidden"
      >
        <Icon :name="'i-ph-gear-six'" />
      </nuxt-link>
    </div>
    
    <div class="px-2 pb-4 w-full rounded md:px-6 md:pb-6 theme-color">
      <div class="flex-row justify-between hidden-md-flex">
        <!-- for desktop: left side -->
        <div class="mr-6 w-1/5">
          <!-- avatar -->
          <!-- test --> <img
            preload
            loading="lazy"
            class="hidden -mt-2 w-full md:-mt-16 avatar md:flex"
            :src="avatarCoverUrl(userInfo.avatar_bucket, userInfo.avatar_filename)"
            @error="defaultCoverImage"
          />

          <!-- follow & unfollow -->
          <div class="mt-2">
            <!-- followers and followings -->
            <div 
              :class="[
                'flex-row justify-center border hidden-md-flex',
                userInfo.id == auth.user.id ? 'rounded-md' : 'rounded-t-md'
              ]"
            >
              <div class="py-2 w-1/2 text-center cursor-pointer hover:text-colored" @click="currentState = 'followerList'">
                <b>{{ thousand(counter.followers) }}</b>&nbsp;
                <i>{{ $t('followers.followers').toLowerCase() }}</i>
              </div>
              <div class="py-2 w-1/2 text-center cursor-pointer hover:text-colored" @click="currentState = 'followingList'">
                <b>{{ thousand(counter.followings) }}</b>&nbsp;
                <i>{{ $t('followings.followings').toLowerCase() }}</i>
              </div>
            </div>

            <div 
              v-if="auth.loggedIn && userInfo.id !== auth.user.id"
              :class="[
                'primary-button rounded-t-none hover:rounded-t-none',
                { 'hover:danger-button': followingData.isFollowing }
              ]"
              @click="followingData.isFollowing ? unfollow(userInfo.id) : follow(userInfo.id)"
              @mouseover="unfollowHoverLeave('i-ri-user-unfollow-fill', $t('unfollow'))"
              @mouseleave="unfollowHoverLeave('i-ri-user-follow-fill', $t('followings.followings'))"
            >
              <!-- if not following -->
              <div v-show="!followingData.isFollowing" class="flex flex-row">
                <Icon :name="'i-ri-user-add-fill'" :text-size="'text-base'" />
                {{ $t('follow') }}
              </div>

              <!-- if following -->
              <div 
                v-show="followingData.isFollowing" 
                class="flex flex-row"
              >
                <Icon :name="unfollowIcon" :text-size="'text-base'" />
                {{ unfollowText === null ? $t('followings.followings') : unfollowText }}
              </div>
            </div>
            
            <!-- follow privately toggler -->
            <div
              v-show="followingData.isFollowing"
              class="flex flex-row text-center"
            >
              <div class="w-full">
                <label 
                  @click="auth.i502p00r0 ? (followingData.isPrivate ? follow(userInfo.id, false) : follow(userInfo.id, true)) : null"
                  for="small-toggle"
                  class="inline-flex relative flex-row justify-center items-center mt-2 cursor-pointer"
                >
                  <input 
                    id="small-toggle" 
                    type="checkbox" 
                    class="sr-only peer" 
                    :checked="followingData.isPrivate" 
                    :disabled="!auth.i502p00r0"
                  >
                  <div 
                    :class="[
                      'w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[\'\'] after:absolute after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600',
                      { 'unclickable': !auth.i502p00r0 },
                      auth.i502p00r0 ? ' after:top-[2px]' : ' after:top-[4px]'
                    ]"
                  />
                  <span class="ml-2">Follow Privately</span>
                  
                  <ProBadge v-if="!auth.i502p00r0" class="ml-1" />
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- user information -->
        <div class="hidden flex-row justify-between w-full md:flex md:mt-6">
          <div class="flex flex-col w-full">
            <div class="flex flex-row w-full">
              <!-- user info such as name, pen name, etc. -->
              <div class="w-9/12">
                <div>
                  <span class="text-base font-semibold">{{ userInfo.name }}</span>&nbsp;
                  <span class="mr-2 italic">{{ userInfo.username }}</span>

                  <ProBadge v-if="userInfo.is_pro" />
                </div>

                <div class="flex flex-row mt-2">
                  <div v-if="userInfo.pen_name && userInfo.pen_name !== ''" class="mr-1">
                    <span class="flex flex-row">
                      <Icon :name="'i-ion-pencil-outline'" class="mr-1 text-base font-bold" /> 
                      {{ userInfo.pen_name }}
                    </span>
                  </div>

                  <div class="mr-1">
                    <span v-if="userInfo.gender === 'm'" class="flex flex-row">
                      <Icon :name="'i-ion-male-outline'" class="mr-1 ml-2 text-base font-bold" /> he/his
                    </span>
                    <span v-if="userInfo.gender === 'f'" class="flex flex-row">
                      <Icon :name="'i-ion-female-outline'" class="mr-1 ml-2 text-base font-bold" /> she/her
                    </span>
                  </div>
                </div>
              </div>

              <div class="float-right w-3/12 text-right">
                <!-- setting/update profile button -->
                <nuxt-link 
                  v-if="auth.loggedIn && auth.user.id === userInfo.id"
                  :to="'/profile/setting'" 
                  class="float-right -mt-20 shadow-md"
                >
                  <button class="flex flex-row shadow-md primary-button">
                    <Icon :name="'i-ph-gear-six'" class="mr-2" />
                    <span class="leading-4">{{ $t('profile.setting') }}</span>
                  </button>
                </nuxt-link>
              </div>
            </div>

            <!-- social links -->
            <div v-if="userInfo.user_socials" class="flex flex-row gap-3 mt-4 w-full">
              <a 
                v-if="userInfo.user_socials.facebook" 
                :href="'https://facebook.com/' + userInfo.user_socials.facebook" 
                target="blank" 
                class="cursor-pointer"
              >
                <Icon :name="'i-ion-logo-facebook'" :text-size="'text-xl'" />
              </a>
              
              <a 
                v-if="userInfo.user_socials.instagram" 
                :href="'https://instagram.com/' + userInfo.user_socials.instagram + '/'"
                target="blank" 
                class="cursor-pointer"
              >
                <Icon :name="'i-ion-logo-instagram'" :text-size="'text-xl'" />
              </a>

              <a 
                v-if="userInfo.user_socials.twitter" 
                :href="'https://twitter.com/' + userInfo.user_socials.twitter" 
                target="blank" 
                class="cursor-pointer"
              >
                <Icon :name="'i-ion-logo-twitter'" :text-size="'text-xl'" />
              </a>
              
              <a 
                v-if="userInfo.user_socials.youtube" 
                :href="'https://youtube.com/channel/' + userInfo.user_socials.youtube"
                target="blank" 
                class="cursor-pointer"
              >
                <Icon :name="'i-ion-logo-youtube'" :text-size="'text-xl'" />
              </a>
              
              <a 
                v-if="userInfo.user_socials.patreon" 
                :href="'https://patreon.com/' + userInfo.user_socials.patreon + '/'"
                target="blank" 
                class="cursor-pointer"
              >
                <Icon :name="'i-gg-patreon'" :text-size="'text-xl'" />
              </a>
              
              <a 
                v-if="userInfo.user_socials.twitch" 
                :href="'https://twitch.com/' + userInfo.user_socials.twitch + '/'"
                target="blank" 
                class="cursor-pointer"
              >
                <Icon :name="'i-ph-twitch-logo-fill'" :text-size="'text-xl'" />
              </a>
              
              <!-- Discord app: copy Discord ID -->
              <a 
                v-if="userInfo.user_socials.discord" 
                :href="'https://discord.com/' + userInfo.user_socials.discord + '/'"
                target="blank" 
                class="cursor-pointer"
              >
                <Icon :name="'i-ic-twotone-discord'" :text-size="'text-xl'" />
              </a>
              
              <a 
                v-if="userInfo.user_socials.picarto"
                :href="'https://picarto.tv/' + userInfo.user_socials.picarto + '/'"
                target="blank" 
                class="cursor-pointer"
              >
                <Icon :name="'i-cib-picarto-tv'" :text-size="'text-xl'" />
              </a>
              
              <a 
                v-if="userInfo.user_socials.gumroad" 
                :href="'https://' + userInfo.user_socials.gumroad + '.gumroad.com'"
                target="blank" 
                class="cursor-pointer"
              >
                <Icon :name="'i-cib-gumroad'" :text-size="'text-xl'" />
              </a>
              
              <a 
                v-if="userInfo.user_socials.personal_website" 
                :href="'https://' + userInfo.user_socials.personal_website + '/'"
                target="blank" 
                class="cursor-pointer"
              >
                <Icon :name="'i-ph-link-simple-break-bold'" :text-size="'text-xl'" />
              </a>
            </div>

            <div>
              <p v-if="userInfo.bio" class="mt-4">
                <div
                  :id="'user-bio-'+userInfo.id"
                  v-html="userInfo.bio.length > 300 ? `${userInfo.bio.slice(0, 300)}...` : userInfo.bio"
                />

                <a 
                  v-if="userInfo.bio.length > 300" 
                  :id="'user-bio-read-more-'+userInfo.id" 
                  class="href" 
                  @click.prevent="readMore(userInfo.bio, userInfo.id, 'user-bio-read-more-', 'user-bio-')"
                >
                  {{ $t('readMore') }}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- user info: for mobile or smaller device -->
      <div class="flex flex-col text-center md:hidden">
        <!-- avatar -->
        <!-- test --> <img
          preload
          loading="lazy"
          class="flex mx-auto -mt-14 w-2/6 sm:-mt-16 sm:w-1/5 avatar md:hidden"
          :src="avatarCoverUrl(userInfo.avatar_bucket, userInfo.avatar_filename)" 
          @error="imageLoadError"
        />

        <!-- user info -->
        <div class="mt-4 text-base font-semibold">
          {{ userInfo.name }}
        </div>
        <div>
          {{ userInfo.username }}
        </div>

        <div class="flex flex-row justify-center mt-4">
          <span v-if="userInfo.pen_name" class="flex flex-row mr-1">
            <Icon :name="'i-ion-pencil-outline'" class="mr-1 text-base font-bold" /> 
            {{ userInfo.pen_name && userInfo.pen_name !== '' ? userInfo.pen_name : '-' }}
          </span>

          <div class="mr-1">
            <span v-if="userInfo.gender === 'm'" class="flex flex-row">
              <Icon :name="'i-ion-male-outline'" class="mr-1 ml-2 text-base font-bold" /> he/him/his
            </span>
            <span v-if="userInfo.gender === 'f'" class="flex flex-row">
              <Icon :name="'i-ion-female-outline'" class="mr-1 ml-2 text-base font-bold" /> she/her
            </span>
          </div>
        </div>

        <div v-if="userInfo.bio" class="mx-2 mt-4 text-center">
          <div
            :id="'mobile__user-bio-'+userInfo.id"
            v-html="userInfo.bio.length > 150 ? `${userInfo.bio.slice(0, 300)}...` : userInfo.bio"
          />

          <a 
            v-if="userInfo.bio.length > 150"
            :id="'mobile__user-bio-read-more-'+userInfo.id" 
            class="href" 
            @click.prevent="readMore(userInfo.bio, userInfo.id, 'mobile__user-bio-read-more-', 'mobile__user-bio-')"
          >
            {{ $t('readMore') }}
          </a>
        </div>

        <!-- social links -->
        <div v-if="userInfo.user_socials" class="flex flex-row justify-center mt-4">
          <a 
            v-if="userInfo.user_socials.facebook" 
            :href="'https://facebook.com/' + userInfo.user_socials.facebook" 
            target="blank" 
            class="cursor-pointer"
          >
            <Icon :name="'i-ion-logo-facebook'" class="text-xl" />
          </a>
          
          <a 
            v-if="userInfo.user_socials.instagram" 
            :href="'https://instagram.com/' + userInfo.user_socials.instagram + '/'"
            target="blank" 
            class="cursor-pointer"
          >
            <Icon :name="'i-ion-logo-instagram'" class="text-xl" />
          </a>

          <a 
            v-if="userInfo.user_socials.twitter" 
            :href="'https://twitter.com/' + userInfo.user_socials.twitter" 
            target="blank" 
            class="cursor-pointer"
          >
            <Icon :name="'i-ion-logo-twitter'" class="text-xl" />
          </a>
          
          <a 
            v-if="userInfo.user_socials.youtube" 
            :href="'https://youtube.com/channel/' + userInfo.user_socials.youtube"
            target="blank" 
            class="cursor-pointer"
          >
            <Icon :name="'i-ion-logo-youtube'" class="text-xl" />
          </a>
          
          <a 
            v-if="userInfo.user_socials.patreon" 
            :href="'https://patreon.com/' + userInfo.user_socials.patreon + '/'"
            target="blank" 
            class="cursor-pointer"
          >
            <Icon :name="'i-ion-heart'" class="text-xl" />
          </a>
        </div>

        <!-- mobile: following & followers count -->
        <div class="flex flex-row justify-center w-full md:hidden">
          <div class="p-2 cursor-pointer hover:text-colored" @click="currentState = 'followerList'">
            <b>{{ thousand(counter.followers) }}</b>&nbsp;
            <i>{{ $t('followers.followers') }}</i>
          </div>
          <div class="p-2 cursor-pointer hover:text-colored" @click="currentState = 'followingList'">
            <b>{{ thousand(counter.followings) }}</b>&nbsp;
            <i>{{ $t('followings.followings') }}</i>
          </div>
        </div>

        <!-- mobile: follow & unfollow -->
        <div 
          v-if="auth.loggedIn && userInfo.id !== auth.user.id"
          :class="[
            'mt-2 w-auto',
            followingData.isFollowing ? 'danger-button' : 'primary-button'
          ]"
          @click="followingData.isFollowing ? unfollow(userInfo.id) : follow(userInfo.id)"
        >
          <!-- if not following -->
          <div v-show="!followingData.isFollowing" class="flex flex-row">
            <Icon :name="'i-ri-user-add-fill'" :text-size="'text-base'" />
            {{ $t('follow') }}
          </div>

          <!-- if following -->
          <div 
            v-show="followingData.isFollowing" 
            class="flex flex-row"
          >
            <Icon :name="unfollowIcon" :text-size="'text-base'" />
            {{ unfollowText === null ? $t('followings.followings') : unfollowText }}
          </div>
        </div>
            
        <!-- follow privately toggler -->
        <div
          v-show="followingData.isFollowing"
          class="flex flex-row text-center"
        >
          <div class="w-full">
            <label 
              @click="auth.i502p00r0 ? (followingData.isPrivate ? follow(userInfo.id, false) : follow(userInfo.id, true)) : null"
              for="small-toggle"
              class="inline-flex relative flex-row justify-center items-center mt-2 cursor-pointer"
            >
              <input 
                id="small-toggle" 
                type="checkbox" 
                class="sr-only peer" 
                :checked="followingData.isPrivate" 
                :disabled="!auth.i502p00r0"
              >
              <div 
                :class="[
                  'w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[\'\'] after:absolute after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600',
                  { 'unclickable': !auth.i502p00r0 },
                  auth.i502p00r0 ? ' after:top-[2px]' : ' after:top-[4px]'
                ]"
              />
              <span class="ml-2">Follow Privately</span>
              
              <ProBadge v-if="!auth.i502p00r0" class="ml-1" />
            </label>
          </div>
        </div>
      </div>

      <div class="mt-2">
        <!-- mobile or smaller device navigation -->
        <div class="flex flex-row gap-x-2 justify-center md:hidden">
          <!-- dashboard -->
          <div 
            class="profile-navigation__mobile theme-color-secondary"
            :class="{ 'button-color text-white': currentState == 'dashboard' }"
            @click="changeCurrentState('dashboard')"
          >
            <div>
              <Icon v-show="currentState == 'dashboard'" :name="'i-ion-home-outline'" class="text-white" />
              <Icon v-show="currentState != 'dashboard'" :name="'i-ion-home-outline'" class="hover:text-white" />
            </div>
            <span>{{ $t('dashboard') }}</span>
          </div>

          <!-- album -->
          <div 
            class="profile-navigation__mobile theme-color-secondary"
            :class="{ 'button-color text-white': currentState == 'albums' }"
            @click="changeCurrentState('albums')"
          >
            <div>
              <Icon v-show="currentState == 'albums'" :name="'i-ion-folder-outline'" class="text-white" />
              <Icon v-show="currentState != 'albums'" :name="'i-ion-folder-outline'" class="hover:text-white" />
            </div>
            <span>{{ $t('albums.album') }}</span>
          </div>

          <!-- collection -->
          <div 
            class="profile-navigation__mobile theme-color-secondary"
            :class="{ 'button-color text-white': currentState == 'collections' }"
            @click="changeCurrentState('collections')"
          >
            <div>
              <Icon v-show="currentState == 'collections'" :name="'i-majesticons-bookmark-line'" class="text-white" />
              <Icon v-show="currentState != 'collections'" :name="'i-majesticons-bookmark-line'" class="hover:text-white" />
            </div>
            <span>{{ $t('collections.collection') }}</span>
          </div>

          <!-- liked -->
          <div 
            v-if="auth.loggedIn && auth.user.id === userInfo.id"
            class="profile-navigation__mobile theme-color-secondary"
            :class="{ 'button-color text-white': currentState == 'liked' }"
            @click="changeCurrentState('liked')"
          >
            <div>
              <Icon v-show="currentState == 'liked'" :name="'i-ri-heart-3-line'" class="text-white" />
              <Icon v-show="currentState != 'liked'" :name="'i-ri-heart-3-line'" class="hover:text-white" />
            </div>
            <span>{{ $t('artworks.liked') }}</span>
          </div>
        </div>

        <div class="flex flex-row justify-between mt-2 md:mt-6">
          <!-- left side -->
          <div class="hidden flex-col lg:w-1/5 md:flex">
            <div 
              class="profile-navigation left-menu-link theme-color-secondary"
              :class="{ 'button-color text-white': currentState === 'dashboard' }"
              @click="changeCurrentState('dashboard')"
            >
              <div class="profile-navigation_wrapper">
                <Icon v-show="currentState === 'dashboard'" :name="'i-humbleicons-dashboard'" class="text-white" />
                <Icon v-show="currentState !== 'dashboard'" :name="'i-humbleicons-dashboard'" />
                <label class="hidden-lg-flex">
                  {{ $t('dashboard') }}
                </label>
              </div>
              <span class="hidden-lg-flex" />
            </div>
            
            <div 
              class="profile-navigation left-menu-link theme-color-secondary"
              :class="{ 'button-color text-white': currentState === 'albums' }"
              @click="changeCurrentState('albums')"
            >
              <div class="profile-navigation_wrapper">
                <Icon v-show="currentState === 'albums'" :name="'i-bx-photo-album'" class="text-white" />
                <Icon v-show="currentState !== 'albums'" :name="'i-bx-photo-album'" />
                <label class="hidden-lg-flex">
                  {{ $t('albums.album') }}
                </label>
              </div>
              <span class="hidden-lg-flex">{{ thousand(counter.album) }}</span>
            </div>

            <div 
              class="profile-navigation left-menu-link theme-color-secondary"
              :class="{ 'button-color text-white': currentState === 'collections' }"
              @click="changeCurrentState('collections')"
            >
              <div class="profile-navigation_wrapper">
                <Icon v-show="currentState === 'collections'" :name="'i-majesticons-bookmark-line'" class="text-white" />
                <Icon v-show="currentState !== 'collections'" :name="'i-majesticons-bookmark-line'" />
                <label class="hidden-lg-flex">
                  {{ $t('collections.collection') }}
                </label>
              </div>
              <span class="hidden-lg-flex">{{ thousand(counter.collection) }}</span>
            </div>

            <div v-if="auth.loggedIn && auth.user.id === userInfo.id" class="custom-divider" />

            <div 
              v-if="auth.loggedIn && auth.user.id === userInfo.id"
              class="profile-navigation left-menu-link theme-color-secondary"
              :class="{ 'button-color text-white': currentState === 'liked' }"
              @click="changeCurrentState('liked')"
            >
              <div class="profile-navigation_wrapper">
                <Icon v-show="currentState === 'liked'" :name="'i-ri-heart-3-line'" class="text-white" />
                <Icon v-show="currentState !== 'liked'" :name="'i-ri-heart-3-line'" />
                <label class="hidden-lg-flex">
                  {{ $t('artworks.liked') }}
                </label>
              </div>
              <span class="hidden-lg-flex">{{ thousand(counter.liked) }}</span>
            </div>
          </div>

          <!-- right side -->
          <div class="w-full md:ml-6">
            <!-- dashboard -->
            <div v-if="currentState === 'dashboard'">
              <!-- navigation buttons -->
              <div class="flex flex-row w-full">
                <div 
                  class="flex flex-row justify-between w-full md:justify-center profile-category-button left-menu-link theme-color-secondary md:w-auto"
                  :class="{ 'button-color text-white': activeDashboard === 'feed' }"
                  @click="activeDashboard = 'feed'" 
                >
                  {{ $t('feed') }}
                  <span 
                    class="px-1 ml-2 rounded" 
                    :class="activeDashboard === 'feed' ? 'theme-color' : 'button-color text-white'"
                  >
                    {{ thousand(counter.feed) }}
                  </span>
                </div>

                <div 
                  class="flex flex-row justify-between mr-0 w-full md:justify-center profile-category-button left-menu-link theme-color-secondary md:w-auto"
                  :class="{ 'button-color text-white': activeDashboard === 'artwork' }"
                  @click="activeDashboard = 'artwork'" 
                >
                  {{ $t('artworks.artwork') }}
                  <span 
                    class="px-1 ml-2 rounded" 
                    :class="activeDashboard === 'artwork' ? 'theme-color' : 'button-color text-white'"
                  >
                    {{ thousand(counter.artwork) }}
                  </span>
                </div>
                <!-- <div 
                  class="profile-category-button left-menu-link theme-color-secondary"
                  :class="{ 'button-color text-white': activeDashboard === 'comic' }"
                  @click="activeDashboard = 'comic'" 
                >
                  Comic
                </div> -->
                <!-- <div 
                  class="profile-category-button left-menu-link theme-color-secondary"
                  :class="{ 'button-color text-white': activeDashboard === 'tutorial' }"
                  @click="activeDashboard = 'tutorial'" 
                >
                  Tutorial
                </div> -->
              </div>

              <!-- manage mode: action button -->
              <div 
                v-show="!loading && auth.loggedIn && (auth.user.id === userInfo.id) && activeDashboard === 'artwork' && config.showManageMode" 
                class="flex flex-row gap-2 justify-between w-full md:justify-end"
              >
                <button class="w-full action-button secondary-button md:w-auto" @click="config.manageMode = !config.manageMode">
                  <Icon :name="config.manageMode ? 'i-ion-close-outline' : 'i-material-symbols-library-add-check-outline-rounded'" />
                  {{ config.manageMode ? $t('quit') : $t('manage') }}
                </button>

                <button v-show="config.manageMode" class="w-full primary-button md:w-auto" @click="openAlbumSelectionModal()">
                  <Icon :name="'i-ion-add-outline'" />
                  {{ $t('albums.addToAlbum') }}
                </button>
              </div>

              <LoadingEmptyErrorMessage
                :loading="loading"
                :background-color="'theme-color-secondary'"
              />
              
              <!-- manage mode message -->
              <div v-show="config.manageMode" class="p-2 mt-2 text-black bg-yellow-200 rounded-md">
                {{ $t('profile.manageModeActiveMessage') }}
              </div>
              
              <!-- CONTENTS -->
              <div>
                <!-- feeds -->
                <Feeds
                  v-if="activeDashboard === 'feed'"
                  ref="feedListRef"
                  :user-id="userInfo.id"
                />

                <!-- artworks -->
                <Artworks
                  v-if="!loading && activeDashboard === 'artwork'"
                  ref="artworkListRef"
                  :class="[
                    { '-mt-2': auth.user.id !== userInfo.id }
                  ]"
                  :user-id="userInfo.id"
                  :manage-mode="config.manageMode"
                  @feedSelectedItems="feedSelectedItems"
                  @onEmpty="onEmpty"
                />
              </div>
            </div>

            <!-- albums -->
            <div v-if="currentState === 'albums'">
              <Album
                v-if="!loading"
                :user-id="userInfo.id"
              />
            </div>

            <!-- collections -->
            <div v-if="currentState === 'collections'">
              <Collection
                v-if="!loading"
                :user-id="userInfo.id"
              />
            </div>

            <!-- liked -->
            <div v-if="auth.loggedIn && auth.user.id === userInfo.id && currentState === 'liked'">
              <Liked
                v-if="!loading"
                :user-id="userInfo.id"
                @onEmpty="onEmpty"
              />
            </div>

            <div v-if="currentState === 'followerList'">
              <FollowerList
                v-if="!loading"
                :user-id="userInfo.id"
                :hide="auth.loggedIn ? (userInfo.id !== auth.user.id) : userInfo.is_pro && !!userInfo.user_settings.hide_follower_list"
                :user-hide-follower-list-status="!!userInfo.user_settings.hide_follower_list"
              />
            </div>

            <div v-if="currentState === 'followingList'">
              <FollowingList
                v-if="!loading"
                :user-id="userInfo.id"
                :hide="auth.loggedIn ? (userInfo.id !== auth.user.id) : userInfo.is_pro && !!userInfo.user_settings.hide_following_list"
                :user-hide-following-list-status="!!userInfo.user_settings.hide_following_list"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Miscellaneous -->
    <!-- [Add selected item(s) to albums] Select album where the items will be stored. -->
    <ManageAlbum
      v-if="!loading"
      id="album-selection-modal"
      ref="albumSelectionModalRef"
      class="modal"
      :work-ids="selectedItems"
      @addedToAlbum="addedToAlbum"
    />
    <SplashAlert
      v-show="isSelectedItemsAddedToSelectedAlbums"
      id="item-added-to-album-alert"
      :text="$t('albums.itemAdded')"
    />
  </Layout>
</template>

<script setup>
// stores
import useAuthStore from '@/stores/auth.store'

// components
import Layout from '~/components/layouts/Layout.vue'
import Icon from '~/components/globals/Icon.vue'
import SplashAlert from '~/components/globals/SplashAlert.vue'
import ManageAlbum from '~/components/albums/ManageAlbum.vue'
import Feeds from '~/components/profile/Feeds.vue'
import Artworks from '~/components/profile/Artworks.vue'
import Album from '~/components/profile/Album.vue'
import Collection from '~/components/profile/Collection.vue'
import Liked from '~/components/profile/artworks/Liked.vue'
import FollowerList from '~/components/profile/FollowerList.vue'
import FollowingList from '~/components/profile/FollowingList.vue'
import LoadingEmptyErrorMessage from '~/components/globals/LoadingEmptyErrorMessage.vue'
import ProBadge from '~/components/globals/ProBadge.vue'

// composables
import useUser from '~/composables/users/useUser'
import useAlbum from '~/composables/users/useAlbum'
import useCollection from '~/composables/users/useCollection'

// stores
const auth = useAuthStore()

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const userApi = useUser(oApiConfiguration, fetchOptions())
const album = useAlbum(oApiConfiguration, fetchOptions())
const collectionApi = useCollection(oApiConfiguration, fetchOptions())
const artworkApi = useArtwork(oApiConfiguration, fetchOptions())

const emit = defineEmits (['setMeta'])
const props = defineProps ({
  id: {
    type: Number,
    default: 0
  },
  userLogon: {
    type: Boolean,
    default: false
  }
})

const route = useRoute()
const router = useRouter()

const { o } = route.query

const loading = ref(true)
const currentState = o != null ? ref(o) : ref('dashboard')
const activeDashboard = ref('artwork')
const userId = computed(() => {
  return props.userLogon && auth.loggedIn ? auth.user.id : props.id
})
const config = ref({
  manageMode: false,
  showManageMode: true
})

onMounted(async () => {
  await fetchUserInfo()
})

const changeCurrentState = (state) => {
  currentState.value = state
  config.value.manageMode = false
  if (o != null) {
    router.push('/profile')
  }
}

const userInfo = ref({})
const counter = ref({
  feed: 0,
  artwork: 0,
  comic: 0,
  tutorial: 0,
  album: 0,
  collection: 0,
  liked: 0,
  followers: 0,
  followings: 0,
})
const fetchUserInfo = async () => {
  loading.value = true

  try {
    const [userData] = await userApi.getInfo(userId.value)
    userInfo.value = userData

    // is user followed or not
    if (auth.loggedIn && (auth.user.id !== userId.value)) {
      const [followData] = await userApi.isFollowing(userId.value)

      followingData.value = {
        isFollowing: followData.is_following,
        isPrivate: followData.is_private,
        followingSince: followData.following_since
      }
    }

    // count feed total
    const [feedTotal] = await userApi.countFeeds(userId.value)
    counter.value.feed = feedTotal

    // count artwork total
    const [artworkTotal] = await userApi.countArtworks(userId.value)
    counter.value.artwork = artworkTotal

    // count followers
    const [followersTotal] = await userApi.countFollowers(userId.value)
    counter.value.followers = followersTotal

    // count followings
    const [followingsTotal] = await userApi.countFollowings(userId.value)
    counter.value.followings = followingsTotal

    // count album total
    const [albumTotal] = await album.countAlbums(userId.value)
    counter.value.album = albumTotal

    // count collection total
    const [collectionTotal] = await collectionApi.countCollections(userId.value)
    counter.value.collection = collectionTotal

    // count liked artwork total
    if (auth.loggedIn && auth.user.id === userInfo.value.id) {
      const [likedArtworkTotal] = await artworkApi.countUserLikedArtworks({
        userId: userId.value
      })
      counter.value.liked = likedArtworkTotal
    }

    emit('setMeta', {
      title: `(${userInfo.value.username}) ${userInfo.value.name}`
    })
  } catch (error) {
    // 
  }

  loading.value = false
}

/**
 * Get a feedback of the selected items that being selected on work list component and 
 * send it to the manage album component to be added to selected albums.
 */
const artworkListRef = ref(null)
const selectedItems = ref([])
const feedSelectedItems = (items) => {
  selectedItems.value = items
}

const onEmpty = () => {
  config.value.showManageMode = false
}

const albumSelectionModalRef = ref(null)
const openAlbumSelectionModal = () => {
  useModal().openModal('album-selection-modal')
  // albumSelectionModalRef.value.fetchAlbums()
}

/**
 * On selected items added to the selected albums show a splash notification to the user 
 * that tells them that the items have been added to the selected albums.
 */
const isSelectedItemsAddedToSelectedAlbums = ref(false)
let selectedItemAddedInterval
const addedToAlbum = () => {
  useSplash().splash(selectedItemAddedInterval, isSelectedItemsAddedToSelectedAlbums, 'item-added-to-album-alert')
}

/**
 * FOLLOW AND UNFOLLOW =======================================================================================================================
 */
const followingData = ref({
  isFollowing: false,
  isPrivate: false,
  followingSince: ''
})

const unfollowText = ref(null)
const unfollowIcon = ref('i-ri-user-follow-fill')
const unfollowHoverLeave = (iconName, text) => {
  unfollowIcon.value = iconName
  unfollowText.value = text
}

const follow = async (userToFollow, isPrivate) => {
  let [success, error] = [null, false]
  if (isPrivate) {
    [success, error] = await userApi.followPrivately(userToFollow)
  } else {
    [success, error] = await userApi.follow(userToFollow)
  }

  if (error) {
    // todo: handle error
  } else {
    // user followed
    followingData.value = {
      isFollowing: true,
      isPrivate: isPrivate ?? false,
      followingSince: ''
    }
  }
}

const unfollow = async (userToUnfollow) => {
  const [success, error] = await userApi.unfollow(userToUnfollow)

  if (error) {
    // todo: handle error
  } else {
    // user unfollowed
    followingData.value = {
      isFollowing: false,
      isPrivate: false,
      followingSince: ''
    }
  }
}

const sliceBio = ref(true)
const readMore = (bio, userId, selectorElId, bioElId) => {
  sliceBio.value = false
  useReadMore().readMore(bio, userId, selectorElId, bioElId)
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/tailwind.scss';

.avatar {
  @apply object-cover rounded-md shadow-lg;
  aspect-ratio: 1/1;
}

.profile-navigation {
  @apply flex flex-row py-3 px-4 lg:mr-2 mb-2 font-medium leading-5 rounded ring-offset-2 transition-all duration-200 cursor-pointer parent-icon hover:button hover:text-white justify-between;

  .profile-navigation_wrapper {
    @apply flex flex-row ml-2 lg:ml-0;

    label {
      @apply hidden lg:block cursor-pointer;
    }

    .icon {
      @apply mr-3 text-lg hover:text-white;
    }
  }
}

.profile-navigation__mobile {
  @apply flex flex-col py-2 px-3 w-full text-center rounded md:hidden hover:button hover:text-white;

  .icon {
    @apply mb-1 mt-1 w-full text-lg text-center hover:text-white;
  }
}
</style>

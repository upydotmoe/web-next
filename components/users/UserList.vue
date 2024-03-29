<template>
  <div
    :class="[
      'grid grid-cols-1 gap-4 mb-4 w-full sm:grid-cols-2',
      columnType == 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4',
      { 'lg:grid-cols-2': columnType == 2 },
      { 'lg:grid-cols-1': columnType == 1 },
    ]"
  >
    <div
      v-for="(user, index) in compUsers"
      :key="user.id"
      class="flex flex-col w-full"
    >
      <nuxt-link
        :to="'/u/' + user.username"
        class=""
        :class="[
          'flex object-cover flex-row rounded-md shadow-lg cursor-pointer theme-color-secondary hover:shadow-xl',
          { 'rounded-br-none': user.artworks.length },
        ]"
        :style="user.cover_bucket && user.cover_filename ? 'background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('+avatarCoverUrl(user.cover_bucket, user.cover_filename)+');background-size:cover;' : 'background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('+abstractImgUrl+');background-size:cover;'"
      >
        <div
          :class="[
            'flex flex-row w-full'
          ]"
        >
          <nuxt-img
            preload
            loading="lazy"
            :class="[
              'avatar',
              user.artworks.length ? 'rounded-bl-none' : 'rounded-bl-md',
            ]"
            :src="avatarCoverUrl(user.avatar_bucket, user.avatar_filename)" 
            @error="defaultCoverImage"
          />

          <div class="flex flex-col justify-between p-3 w-full text-white">
            <div class="flex flex-col gap-1">
              <span class="font-bold">{{ user.name.length > 20 ? `${user.name.slice(0, 20)}..` : user.name }}</span>
              <span class="text-xxs">@{{ user.username }}</span>
            </div>

            <div class="flex flex-row justify-between">
              <div class="flex flex-row w-full">
                <!-- user follow status, not appeared if the user is current login user -->
                <div
                  v-if="auth.loggedIn && user.id !== auth.user.id"
                  class="flex flex-row"
                >
                  <!-- follow -->
                  <div 
                    v-show="!user.is_following"
                    class="flex flex-row"
                    @click.prevent="followUser(index, user.id)"
                  >
                    <Icon
                      :name="'i-ri-user-add-fill'"
                      class="text-gray-300 hover:text-white"
                    />
                  </div>
                  
                  <div 
                    v-show="user.is_following"
                    class="flex flex-row" 
                    @mouseover="showUnfollow = user.id" 
                    @mouseout="showUnfollow = 0"
                    @click.prevent="unfollowUser(index, user.id)"
                  >
                    <!-- following -->
                    <Icon
                      v-show="showUnfollow !== user.id"
                      :name="'i-ri-user-follow-fill'"
                      class="text-green-400"
                    />

                    <!-- unfollow -->
                    <Icon
                      v-show="showUnfollow && showUnfollow === user.id"
                      :name="'i-ri-user-unfollow-fill'"
                      class="text-red-400 hover:text-red-400"
                    />
                  </div>
                </div>
              </div>
              <ProBadge v-if="user.is_pro" />
            </div>
          </div>
        </div>
      </nuxt-link>

      <!-- latest 3 artworks -->
      <div 
        v-if="user.artworks"
        class="user-latest-artworks"
      >
        <div
          v-for="(latestArtwork, workIndex) in user.artworks"
          :key="latestArtwork.id"
          :class="[
            'work-thumbnail-user-list bg-transparent rounded-md',
            latestArtwork._count.artwork_assets > 1 && currentWorkId != latestArtwork.id ? 'work-multiple' : ''
          ]"
        >
          <nuxt-link
            :to="'/a/'+latestArtwork.id"
            target="_blank"
            class="w-full h-full theme-color-bg"
          >
            <div 
              :class="[
                'overflow-hidden relative text-center',
                { 'rounded-bl-md': workIndex == 0 },
                { 'rounded-br-md': workIndex == 2 }
              ]"
            >
              <span
                v-if="applyExplicitFilter(auth, latestArtwork.is_explicit, latestArtwork.is_gore)"
                class="absolute top-1/2 left-1/2 z-10 text-sm font-semibold text-white transform -translate-x-1/2 -translate-y-1/2"
              >
                {{ $t('explicitContent') }}
              </span>
              
              <a 
                :href="'/a/'+latestArtwork.id"
                :class="[
                  { 'animate-wigglefast': manageMode }
                ]"
              >
                <nuxt-img
                  preload
                  loading="lazy"
                  :class="[
                    'w-full h-full unselectable',
                    { 'object-cover': !isUncropped },
                    isUncropped ? 'object-contain object-center h-44' : 'object-cover',
                    { 'blur-3xl brightness-50 unclickable': applyExplicitFilter(auth, latestArtwork.is_explicit, latestArtwork.is_gore) }
                  ]"
                  :src="artworkThumb(latestArtwork.artwork_assets[0].bucket, latestArtwork.artwork_assets[0].filename, 'thumbnail', false)"
                  @error="imageLoadError"
                />
              </a>
            </div>
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// assets
import abstractImgUrl from '~/static/bg-abstract.png'

// stores
import useAuthStore from '@/stores/auth.store'

// composables
import useUser from '~/composables/users/useUser'

// components
import Icon from '~/components/globals/Icon.vue'
import ProBadge from '~/components/globals/ProBadge.vue'

// stores
const auth = useAuthStore()

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const userApi = useUser(oApiConfiguration, fetchOptions())

const props = defineProps({
  users: {
    type: Array,
    default: () => {}
  },
  columnType: {
    type: Number,
    default: 4
  }
})

const compUsers = computed(() => props.users)

const { $router } = useNuxtApp()

const showUnfollow = ref(0)

/** USER FOLLOWS */
const followUser = async (index, userToFollow) => {
  const [success, error] = await userApi.follow(userToFollow)

  if (error) {
    // todo: handle error
  } else {
    compUsers.value[index].is_following = true
  }
}

const unfollowUser = async (index, userToUnfollow) => {
  const [success, error] = await userApi.unfollow(userToUnfollow)

  if (error) {
    // todo: handle error
  } else {
    compUsers.value[index].is_following = false
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/tailwind.scss';

.avatar {
  @apply object-cover h-24 rounded-tl-md;
  aspect-ratio: 1/1;
}

.user-latest-artworks {
  @apply grid z-0 grid-cols-3 theme-color-secondary w-full rounded-b-md;

  .work-thumbnail-user-list {
    @apply object-cover cursor-pointer;
  
    a {
      img {
        @apply w-full theme-color;
        aspect-ratio: 1/1;
      }
    }
  }
}
</style>

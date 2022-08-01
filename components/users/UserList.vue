<template>
  <div class="grid grid-cols-1 gap-4 mb-4 w-full md:grid-cols-2 lg:grid-cols-4">
    <nuxt-link
      v-for="(user, index) in compUsers"
      :key="user.id"
      :to="localePath('/profile/u/' + user.username)"
      class="flex object-cover flex-row rounded-md shadow-lg cursor-pointer theme-color-secondary hover:shadow-xl"
      :style="user.cover_bucket && user.cover_filename ? 'background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('+avatarCoverUrl(user.cover_bucket, user.cover_filename)+');background-size:cover;' : 'background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('+abstractImgUrl+');background-size:cover;'"
    >
      <div class="flex flex-row w-full">
        <img :src="avatarCoverUrl(user.avatar_bucket, user.avatar_filename)" class="avatar" @error="imageLoadError">

        <div class="flex flex-col justify-between p-3 w-full text-white">
          <div class="flex flex-col">
            <span class="font-bold">{{ user.name }}</span>
            <span class="text-xxs">{{ user.pen_name }}</span>
          </div>

          <div class="flex flex-row w-full">
            <!-- user follow status, not appeared if the user is current login user -->
            <div v-if="$auth.loggedIn && user.id !== $auth.user.id" class="flex flex-row">
              <div 
                v-show="!user.is_following"
                class="flex flex-row"
                @click.prevent="followUser(index, user.id)"
              >
                <Icon :name="'person-add'" class="text-gray-300 hover:text-white" />
              </div>
              
              <div 
                v-show="user.is_following"
                class="flex flex-row" 
                @mouseover="showUnfollow = user.id" 
                @mouseout="showUnfollow = 0"
                @click.prevent="unfollowUser(index, user.id)"
              >
                <Icon v-show="showUnfollow !== user.id" :name="'person'" class="text-green-400" />
                <Icon v-show="showUnfollow && showUnfollow === user.id" :name="'person-remove'" class="text-red-400 hover:text-red-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nuxt-link>
  </div>
</template>

<script setup>
// assets
import abstractImgUrl from '~/static/bg-abstract.png'

// components
import Icon from '~/components/globals/Icon.vue'

// composables
import useApiFetch from '~/composables/useApiFetch'
import useUser from '~/composables/users/useUser'

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const userApi = useUser(oApiConfiguration, fetchOptions())

const props = defineProps({
  users: {
    type: Array,
    default: () => {}
  }
})

const compUsers = computed(() => props.users)

const { redirect, app } = useContext()

const viewProfile = async (username) => {
  redirect(app.localePath('/profile/u/' + username))
}

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
  @apply object-cover h-24 rounded-md;
  aspect-ratio: 1/1;
}
</style>

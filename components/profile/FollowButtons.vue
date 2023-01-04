<template>
  <div class="follow-buttons">
    <!-- following & followers counter -->
    <div 
      :class="[
        'follow-buttons__counter',
        userInfo.id == auth.user.id ? 'rounded-md' : 'rounded-t-md'
      ]"
    >
      <div class="flex flex-row justify-center">
        <div
          class="follow-buttons__counter-partial"
          @click="changeCurrentState('followerList')"
        >
          <b>{{ thousand(followersCount) }}</b>&nbsp;
          <i>{{ $t('followers.followers').toLowerCase() }}</i>
        </div>
        <div
          class="follow-buttons__counter-partial"
          @click="changeCurrentState('followingList')"
        >
          <b>{{ thousand(followingsCount) }}</b>&nbsp;
          <i>{{ $t('followings.followings').toLowerCase() }}</i>
        </div>
      </div>
    </div>

    <!-- follow button -->
    <div 
      v-if="auth.loggedIn && userInfo.id !== auth.user.id"
      :class="[
        'follow-buttons__buttons',
        { 'hover:danger-button': followingData.isFollowing }
      ]"
      @click="followingData.isFollowing ? unfollow(userInfo.id) : follow(userInfo.id)"
      @mouseover="unfollowHoverLeave('i-ri-user-unfollow-fill', $t('unfollow'))"
      @mouseleave="unfollowHoverLeave('i-ri-user-follow-fill', $t('followings.following'))"
    >
      <!-- if not following -->
      <button v-show="!followingData.isFollowing">
        <Icon
          :name="'i-ri-user-add-fill'"
          :text-size="'text-base'"
        />
        {{ $t('follow') }}
      </button>

      <!-- if following -->
      <button v-show="followingData.isFollowing">
        <Icon
          :name="unfollowIcon"
          :text-size="'text-base'"
        />
        {{ unfollowText === null ? $t('followings.following') : unfollowText }}
      </button>
    </div>
    
    <!-- follow privately toggler -->
    <div
      v-show="followingData.isFollowing"
      class="follow-buttons__private-toggler"
    >
      <label
        for="follow-privately"
        @click="auth.i502p00r0 ? (followingData.isPrivate ? follow(userInfo.id, false) : follow(userInfo.id, true)) : null"
      >
        <Icon
          v-if="!followingData.isPrivate"
          :name="'i-fluent-checkbox-unchecked-20-regular'"
        />
        <Icon
          v-else
          :name="'i-ic-outline-check'"
          class="text-green-500"
        />

        <span>{{ $t('followings.followPrivately') }}</span>
        
        <ProBadge v-if="!auth.i502p00r0" />
      </label>
    </div>
  </div>
</template>

<script setup>
// stores
import useAuthStore from '@/stores/auth.store'

// composables
import useUser from '~/composables/users/useUser'
import ProBadge from '~/components/globals/ProBadge.vue'

// components
import Icon from '~/components/globals/Icon.vue'

// stores
const auth = useAuthStore()

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const userApi = useUser(oApiConfiguration, fetchOptions())

const props = defineProps({
  userInfo: {
    type: Object,
    default: () => {}
  },
  followersCount: {
    type: Number,
    default: 0
  },
  followingsCount: {
    type: Number,
    default: 0
  },
  isFollowing: {
    type: Boolean,
    default: false
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  followingSince: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['changeCurrentState'])

onMounted(() => {
  followingData.value.isFollowing = props.isFollowing
  followingData.value.isPrivate = props.isPrivate
  followingData.value.followingSince = props.followingSince
})

const changeCurrentState = (state) => {
  emit('changeCurrentState', state)
}

const followingData = ref({
  isFollowing: props.isFollowing,
  isPrivate: props.isPrivate,
  followingSince: props.followingSince,
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
</script>

<style lang="scss" scoped>
@import '~/assets/css/tailwind.scss';

.follow-buttons {
  @apply flex flex-col;

  &__counter {
    @apply flex-row justify-center border;

    &-partial {
      @apply py-2 w-1/2 text-center cursor-pointer hover:text-colored;
    }
  }

  &__buttons {
    @apply primary-button rounded-t-none hover:rounded-t-none;

    button {
      @apply flex flex-row;
    }
  }

  &__private-toggler {
    @apply flex flex-row text-center w-full;

    label {
      @apply inline-flex relative flex-row justify-center items-center mt-2 cursor-pointer gap-2 w-full;
    }
  }
}
</style>
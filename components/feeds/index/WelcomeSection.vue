<template>
  <section
    id="welcome"
    class="middle__welcome"
  >
    <div>
      <h1 class="middle__welcome__title">
        {{ $t('feeds.newUser.welcome') }}
      </h1>

      <div class="middle__welcome__menus">
        <nuxt-link
          v-for="menu in newUserWelcomeMenus"
          :key="menu.href"
          :to="menu.href"
        >
          <Icon
            :name="menu.icon"
            :text-size="'text-2xl'"
          />
          {{ $t(menu.title) }}
        </nuxt-link>
      </div>
    </div>

    <div
      v-if="suggestedUsersToFollow && suggestedUsersToFollow.length"
      class="middle__welcome__follow-suggestions"
    >
      <div class="title">
        {{ $t('feeds.newUser.suggestedUsers') }}
      </div>

      <UserList
        :users="suggestedUsersToFollow"
        :column-type="2"
        class="mt-6"
      />
    </div>
  </section>
</template>

<script setup>
// constants
import { newUserWelcomeMenus } from '~/utils/constants/feed'

// components
import Icon from '~/components/globals/Icon.vue'
import UserList from '~/components/users/UserList.vue'

defineProps({
  suggestedUsersToFollow: {
    type: Array,
    default: () => []
  }
})
</script>

<style lang="scss" scoped>
@import '~/assets/css/tailwind.scss';

.middle__welcome {
  @apply h-screen;

  &__title {
    @apply title;
  }
  
  &__menus {
    @apply grid grid-cols-4 gap-4 mx-auto mt-6 text-center;

    a {
      @apply flex flex-col gap-3 p-4 w-full text-center rounded-md theme-color hover:shadow-md hover:theme-colored;

      .icon {
        @apply mx-auto;
      }
    }
  }

  &__follow-suggestions {
    @apply mt-14;
  }
}
</style>
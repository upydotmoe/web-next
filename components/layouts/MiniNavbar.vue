<template>
  <div
    id="as"
    class="flex overflow-hidden flex-row justify-center items-center py-2 px-4 mx-auto mt-0 w-full text-white rounded-none border-none md:justify-between md:px-6 2xl:w-8/12"
  >
    <div class="menus">
      <nuxt-link
        v-if="auth.loggedIn"
        :to="'/feed'"
        class="uppercase"
      >
        {{ $t('feed') }}
      </nuxt-link>
      <nuxt-link
        :to="'/explore'"
        class="uppercase"
      >
        {{ $t('explore') }}
      </nuxt-link>
      <nuxt-link
        :to="'/artworks/browse'"
        class="uppercase"
      >
        {{ $t('browse') }}
      </nuxt-link>
      <a
        v-if="artworkAvailabity > 1 && auth.loggedIn"
        href="#"
        class="uppercase"
        @click="random()"
      >
        {{ $t('random') }}
      </a>
      <nuxt-link
        v-if="auth.loggedIn"
        :to="'/tags'"
        class="uppercase"
      >
        {{ $t('tags.tags') }}
      </nuxt-link>
      <a
        href="https://github.com/upyapp/issues"
        target="_blank"
        class="uppercase"
      >
        {{ $t('reportIssue') }}
      </a>
    </div>
  </div>
</template>

<script setup>
// stores
import useAuthStore from '@/stores/auth.store'

// stores
const auth = useAuthStore()

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const miscApi = useMisc(oApiConfiguration, fetchOptions())
const artworkApi = useArtwork(oApiConfiguration, fetchOptions())

const router = useRouter()

onMounted(async () => {
  await countAvailableArtwork()
})

/**
 * Check if there is artwork that can be displayed to the currently visiting user.
 *
 * This needs to be done because there are some explicit artworks,
 * and they cannot be displayed to visitor/guest or users who don't enable explicit mode.
 */
const artworkAvailabity = ref(0)
const countAvailableArtwork = async () => {
  const [artworkCount, error] = await artworkApi.checkArtworkAvailability()

  if (error) {
    artworkAvailabity.value = 0
  } else {
    artworkAvailabity.value = artworkCount
  }
}

const random = async () => {
  // get random artwork ID
  const [randomWorkId, error] = await miscApi.getRandomArtwork()

  if (error) {
    // todo: handle error
  } else {
    // navigate user to randomly selected artwork ID
    router.push({
      path: '/a/' + randomWorkId,
      replace: true,
      force: true
    })
  }
}
</script>

<style lang="scss" scoped>
// @import '~/assets/css/tailwind.scss';

.menus {
  @apply flex flex-row md:justify-between overflow-x-scroll whitespace-nowrap md:overflow-x-hidden px-2 pb-1 md:pb-0 -ml-2;

  a {
    @apply mr-3 text-gray-200 font-bold text-xxs px-2 py-1 -ml-2;

    &:hover {
      @apply rounded bg-gray-100 text-gray-800;
    }
  }

  a.router-link-active {
    @apply text-gray-800 bg-gray-100 rounded;
  }
}

.menus::-webkit-scrollbar {
  height: 4px;
}
.menus::-webkit-scrollbar-track {
  background: var(--button);
}
.menus::-webkit-scrollbar-thumb {
  background: var(--theme-color-secondary);
}

// .menus::-webkit-scrollbar {
//   display: none;
// }
</style>

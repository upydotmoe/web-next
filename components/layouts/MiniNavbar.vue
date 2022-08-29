<template>
  <div class="flex flex-row justify-center items-center py-2 px-4 mx-auto mt-0 w-full text-white rounded-none border-none md:justify-between md:px-6 2xl:w-8/12">
    <div class="menus">
      <nuxt-link v-if="auth.loggedIn" :to="'/feed'">
        {{ $t('feed').toUpperCase() }}
      </nuxt-link>
      <nuxt-link :to="'/explore'">
        {{ $t('explore').toUpperCase() }}
      </nuxt-link>
      <nuxt-link :to="'/works/browse'">
        {{ $t('browse').toUpperCase() }}
      </nuxt-link>
      <a v-show="artworkAvailabity > 1" href="#" @click="random()">
        {{ $t('random').toUpperCase() }}
      </a>
      <!-- <nuxt-link :to="'/comics'">
        &nbsp;{{ $t('comics.comics').toUpperCase() }}
      </nuxt-link>
      <nuxt-link :to="'/tutorials'">
        &nbsp;{{ $t('tutorials.tutorials').toUpperCase() }}&nbsp;
      </nuxt-link> -->
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
      path: '/a/'+randomWorkId,
      replace: true,
      force: true
    })
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/tailwind.scss';

.menus {
  @apply flex flex-row md:justify-between;

  a {
    @apply mr-3 text-gray-200 font-bold text-xxs px-2 py-1 -ml-2;

    &:hover {
      @apply rounded bg-gray-100 text-gray-800;
    }
  }

  a.nuxt-link-active {
    @apply text-gray-800 bg-gray-100 rounded;
  }
}
</style>

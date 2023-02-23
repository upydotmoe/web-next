<template>
  <Layout
    :with-footer="true"
    :hide-side="false"
  >
    <div class="mb-20">
      <!-- post category -->
      <div class="categories">
        <div
          class="category"
          :class="[mode === 'feed' ? 'button' : 'theme-color']"
          @click="mode = 'feed'"
        >
          <Icon
            v-show="mode != 'feed'"
            :name="'i-ion-text-outline'"
            :text-size="'texl-xl'"
            class="mr-3 text-2xl"
          />
          <Icon
            v-show="mode == 'feed'"
            :name="'i-ion-text-outline'"
            :text-size="'texl-xl'"
            class="mr-3 text-2xl text-white"
          />
          <span class="text-sm leading-6">{{ $t('feed') }}</span>
        </div>
        <div
          class="category"
          :class="[mode === POST_TYPES.ARTWORK ? 'button' : 'theme-color']"
          @click="mode = POST_TYPES.ARTWORK"
        >
          <Icon
            v-show="mode != POST_TYPES.ARTWORK"
            :name="'i-ion-images-outline'"
            :text-size="'texl-xl'"
            class="mr-3 text-2xl"
          />
          <Icon
            v-show="mode == POST_TYPES.ARTWORK"
            :name="'i-ion-images-outline'"
            :text-size="'texl-xl'"
            class="mr-3 text-2xl text-white"
          />
          <span class="text-sm leading-6">{{ $t('artworks.artwork') }}</span>
        </div>
        <!-- <div
          class="category"
          :class="{ 'button-active': mode === 'comic' }"
          @click="mode = 'comic'"
        >
          Comic
        </div>
        <div
          class="category"
          :class="{ 'button-active': mode === 'tutorial' }"
          @click="mode = 'tutorial'"
        >
          Tutorial
        </div> -->
      </div>

      <div class="forms">
        <!-- feed -->
        <FeedForm v-show="mode === 'feed'" />

        <!-- artwork -->
        <ArtworkForm
          v-show="mode === POST_TYPES.ARTWORK"
          class="artwork"
        />
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

// stores
import useAuthStore from '@/stores/auth.store'

// components
import Layout from '~/components/layouts/Layout.vue'
import Icon from '~/components/globals/Icon.vue'
import ArtworkForm from '~/components/artworks/forms/ArtworkForm.vue'
import FeedForm from '~/components/feeds/forms/FeedForm.vue'
import { POST_TYPES } from '~/utils/constants'

// stores
const auth = useAuthStore()

const { t } = useI18n()
const router = useRouter()

const mode = ref(POST_TYPES.ARTWORK)

definePageMeta({
  keepalive: false
})

useHead({
  title: mode.value === POST_TYPES.ARTWORK ? t('meta.title.artwork.post') : t('meta.title.feed.post')
})

watch(() => mode.value, () => {
  useHead({
    title: mode.value === POST_TYPES.ARTWORK ? t('meta.title.artwork.post') : t('meta.title.feed.post')
  })
})

onBeforeMount(() => {
  if (!auth.loggedIn) {
    router.push('/explore')
  }
})
</script>

<style lang="scss" scoped>
// @import '~/assets/css/tailwind.scss';

.categories {
  @apply grid grid-cols-2 md:grid-cols-3 gap-2 mb-2;

  .category {
    @apply p-4 rounded-md shadow-sm text-center align-middle cursor-pointer hover:shadow-lg mb-6 flex flex-row justify-center;
  }
}

.forms {

}
</style>

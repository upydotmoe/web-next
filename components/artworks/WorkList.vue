<template>
  <section :class="sectionClass">
    <span 
      v-for="work in works" 
      :key="work.id" 
      :class="[
        'work-thumbnail theme-color-bg rounded-lg',
        work._count.artwork_assets > 1 && currentWorkId != work.id ? 'work-multiple' : '',
        { 'border-4 border-yellow-400': manageList.includes(work.id) || currentWorkId == work.id }
      ]"
    >
      <!-- Desktop -->
      <a
        v-if="!isHref && !isMiniList"
        :href="'/a/'+work.id"
        class="w-full h-full theme-color-bg"
        @click.prevent="manageMode ? addToManageList(work.id) : view(work.id)"
      >
        <div class="overflow-hidden relative text-center rounded-md">
          <div class="mini-icon">
            <!-- image count -->
            <p
              v-if="work._count.artwork_assets > 1 && !applyExplicitFilter(auth, work.is_explicit, work.is_gore)"
              class="regular"
            >
              {{ work._count.artwork_assets }}
            </p>

            <!-- is an original character -->
            <p
              v-if="work.is_original_character"
              class="original-character"
            >
              <Icon
                :name="'i-clarity-cursor-hand-click-line'"
                class="text-white"
              />
            </p>

            <!-- is a redraw -->
            <p
              v-if="work.redraw_of && !hideRedrawIcon"
              class="redraw"
            >
              <Icon
                :name="'i-fluent-draw-image-20-regular'"
                class="text-white"
              />
            </p>

            <!-- is a gore content -->
            <p
              v-if="work.is_gore"
              class="gore"
            >
              G
            </p>
          </div>

          <!-- explicit content filter -->
          <span
            v-if="applyExplicitFilter(auth, work.is_explicit, work.is_gore)"
            class="absolute top-1/2 left-1/2 z-10 text-base font-semibold text-white transform -translate-x-1/2 -translate-y-1/2 md:text-lg"
          >
            {{ work.is_gore ? $t('goreContent') : $t('explicitContent') }}
          </span>
          
          <a 
            :href="'/a/'+work.id"
            :class="[
              { 'animate-wigglefast': manageMode }
            ]"
          >
            <nuxt-img
              preload
              loading="lazy"
              :src="
                ((!auth.loggedIn || (auth.loggedIn && auth.user.user_settings && !auth.user.user_settings.show_explicit)) && work.is_explicit)
                  || ((!auth.loggedIn || (auth.loggedIn && auth.user.user_settings && !auth.user.user_settings.show_gore)) && work.is_gore) 
                  ? 'https://via.placeholder.com/150'
                  : artworkThumb(work.artwork_assets[0].bucket, work.artwork_assets[0].filename, 'thumbnail', isUncropped)"
              :class="[
                'w-full h-full unselectable',
                { 'object-cover': !isUncropped },
                isUncropped ? 'object-contain object-center h-44' : 'object-cover',
                { 'blur-3xl brightness-50 unclickable': applyExplicitFilter(auth, work.is_explicit, work.is_gore) }
              ]"
              @error="imageLoadError"
            />
          </a>
        </div>
      </a>
      
      <!-- Mobile or smaller device -->
      <nuxt-link
        v-else
        @click="manageMode ? addToManageList(work.id) : open(work.id)"
      >
        <div class="overflow-hidden relative text-center rounded-md">
          <div class="mini-icon">
            <!-- image count -->
            <p
              v-if="work._count.artwork_assets > 1 && !applyExplicitFilter(auth, work.is_explicit, work.is_gore)"
              class="regular"
            >
              {{ work._count.artwork_assets }}
            </p>

            <!-- is an original character -->
            <p
              v-if="work.is_original_character"
              class="original-character"
            >
              <Icon
                :name="'i-clarity-cursor-hand-click-line'"
                class="text-white"
              />
            </p>

            <!-- is a redraw -->
            <p
              v-if="work.redraw_of && !hideRedrawIcon"
              class="redraw"
            >
              <Icon
                :name="'i-fluent-draw-image-20-regular'"
                class="text-white"
              />
            </p>

            <!-- is a gore content -->
            <p
              v-if="work.is_gore"
              class="gore"
            >
              G
            </p>
          </div>

          <!-- explicit content filter -->
          <span
            v-if="applyExplicitFilter(auth, work.is_explicit, work.is_gore)"
            class="absolute top-1/2 left-1/2 z-10 text-base font-semibold text-white transform -translate-x-1/2 -translate-y-1/2 md:text-lg"
          >
            {{ work.is_gore ? $t('goreContent') : $t('explicitContent') }}
          </span>
          
          <a 
            :href="'/a/'+work.id"
            :class="[
              { 'animate-wigglefast': manageMode }
            ]"
            @click.prevent="null"
          >
            <nuxt-img
              preload
              loading="lazy"
              :src="
                ((!auth.loggedIn || (auth.loggedIn && auth.user.user_settings && !auth.user.user_settings.show_explicit)) && work.is_explicit)
                  || ((!auth.loggedIn || (auth.loggedIn && auth.user.user_settings && !auth.user.user_settings.show_gore)) && work.is_gore) 
                  ? 'https://via.placeholder.com/150'
                  : artworkThumb(work.artwork_assets[0].bucket, work.artwork_assets[0].filename, 'thumbnail', isUncropped)"
              :class="[
                'object-cover w-full h-full unselectable',
                { 'blur-3xl brightness-50 unclickable': applyExplicitFilter(auth, work.is_explicit, work.is_gore) }
              ]"
              @error="imageLoadError"
            />
          </a>
        </div>
      </nuxt-link>
    </span>
  </section>
</template>

<script setup>
import { useMediaQuery } from '@vueuse/core'

// stores
import authStore from '@/stores/auth.store'

// components
import Icon from '~/components/globals/Icon.vue'

// stores
const auth = authStore()

const emits = defineEmits('feedManageList')
const props = defineProps({
  works: {
    type: Array,
    default: () => []
  },
  view: {
    type: Function,
    default: () => {}
  },
  sectionClass: {
    type: String,
    default: ''
  },
  isHref: {
    type: Boolean,
    default: false
  },
  manageMode: {
    type: Boolean,
    default: false
  },
  isMiniList: {
    type: Boolean,
    default: false
  },
  currentWorkId: {
    type: Number,
    default: 0
  },
  hideRedrawIcon: {
    type: Boolean,
    default: false
  },
  directOpen: {
    type: Boolean,
    default: false
  }
})

watch (() => props.currentWorkId, (newWorkId) => {
  currentWorkId.value = newWorkId
})

const router = useRouter()

// switch between crop or full view mode
const isUncropped = ref(false)

const currentWorkId = ref(props.currentWorkId)
const isLargeScreen = useMediaQuery('(min-width: 1024px)')
const open = (workId) => {
  if (props.directOpen) {
    router.push({
      path: '/a/'+workId
    })
  } else {
    if (isLargeScreen.value && !props.isMiniList) {
      currentWorkId.value = workId
      props.view(workId)
    } else {
      if (props.isMiniList) {
        currentWorkId.value = workId
        props.view(workId)
      } else {
        router.replace({
          path: '/a/'+workId
        })
      }
    }
  }
}

const manageList = ref([])
const addToManageList = (workId) => {
  if (manageList.value.includes(workId)) {
    const indexOfId = manageList.value.indexOf(workId)
    manageList.value.splice(indexOfId, 1)
  } else {
    manageList.value.push(workId)
  }

  emits('feedManageList', manageList.value)
}

watch (() => props.manageMode, (currentState) => {
  if (currentState === false) {
    manageList.value = []
  }
})
</script>

<style lang="scss" scoped>
@import "~/assets/css/artworks/view.scss";
@import "~/assets/css/artworks/list.scss";
</style>

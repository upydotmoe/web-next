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
        v-if="!isMobile() && !isHref && !isMiniList"
        :href="'/a/'+work.id"
        @click.prevent="manageMode ? addToManageList(work.id) : view(work.id)"
        class="w-full h-full theme-color-bg"
      >
        <div class="overflow-hidden relative text-center rounded-md">
          <p v-if="work._count.artwork_assets > 1 && !applyExplicitFilter(auth, work.is_explicit)">{{ work._count.artwork_assets }}</p>
          <span v-if="applyExplicitFilter(auth, work.is_explicit)" class="absolute top-1/2 left-1/2 z-10 text-xl font-semibold text-white transform -translate-x-1/2 -translate-y-1/2">{{ $t('explicitContent') }}</span>
          
          <a 
            :href="'/a/'+work.id"
            :class="[
              { 'animate-wigglefast': manageMode }
            ]"
          >
            <img 
              class="object-cover w-full h-full unselectable"
              :class="{ 'blur-3xl brightness-50 unclickable': applyExplicitFilter(auth, work.is_explicit) }"
              :src="artworkThumb(work.artwork_assets[0].bucket, work.artwork_assets[0].filename, 'thumbnail')"
              @error="imageLoadError"
            >
          </a>
        </div>
      </a>
      
      <!-- Mobile or smaller device -->
      <nuxt-link
        v-else
        @click="manageMode ? addToManageList(work.id) : open(work.id)"
      >
        <div class="overflow-hidden relative text-center rounded-md">
          <p v-if="work._count.artwork_assets > 1 && !applyExplicitFilter(auth, work.is_explicit)">{{ work._count.artwork_assets }}</p>
          <span v-if="applyExplicitFilter(auth, work.is_explicit)" class="absolute top-1/2 left-1/2 z-10 text-xl font-semibold text-white transform -translate-x-1/2 -translate-y-1/2">{{ $t('explicitContent') }}</span>
          
          <a 
            :href="'/a/'+work.id"
            @click.prevent="void"
            :class="[
              { 'animate-wigglefast': manageMode }
            ]"
          >
            <img 
              class="object-cover w-full h-full unselectable"
              :class="{ 'blur-3xl brightness-50 unclickable': applyExplicitFilter(auth, work.is_explicit) }"
              :src="artworkThumb(work.artwork_assets[0].bucket, work.artwork_assets[0].filename, 'thumbnail')"
              @error="imageLoadError"
            >
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

// stores
const auth = authStore()

const emits = defineEmits ('feedManageList')
const props = defineProps ({
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
  }
})

watch (() => props.currentWorkId, (newWorkId) => {
  currentWorkId.value = newWorkId
})

const router = useRouter()

const currentWorkId = ref(props.currentWorkId)
const isLargeScreen = useMediaQuery('(min-width: 1024px)')
const open = (workId) => {
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

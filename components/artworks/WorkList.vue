<template>
  <section :class="sectionClass">
    <span 
      v-for="work in works" 
      :key="work.id" 
      class="work-thumbnail" 
      :class="[ work._count.artwork_assets > 1 ? 'work-multiple' : '', { 'p-2 bg-yellow-300 rounded-md': manageList.includes(work.id) } ]"
    >
      <!-- Desktop -->
      <a v-if="!isMobile() && !isHref" :href="'/work/'+work.id" @click.prevent="manageMode ? addToManageList(work.id) : view(work.id, true)">
        <div class="relative text-center">
          <p v-if="work._count.artwork_assets > 1 && !applyExplicitFilter(auth, work.is_explicit)">{{ work._count.artwork_assets }}</p>
          <span v-if="applyExplicitFilter(auth, work.is_explicit)" class="absolute top-1/2 left-1/2 z-10 text-xl font-semibold text-white transform -translate-x-1/2 -translate-y-1/2">{{ $t('explicitContent') }}</span>
          
          <div class="overflow-hidden rounded-md" :class="{ 'animate-wigglefast': manageMode }">
            <img 
              class="object-cover w-full h-full unselectable"
              :class="{ 'blur-sm brightness-50 unclickable': applyExplicitFilter(auth, work.is_explicit) }"
              :src="artworkThumb(work.artwork_assets[0].bucket, work.artwork_assets[0].filename, 'thumbnail')"
              @error="imageLoadError"
            >
          </div>
        </div>
      </a>
      
      <!-- Mobile or smaller device -->
      <a v-else @click="manageMode ? addToManageList(work.id) : open(work.id)">
        <div class="relative text-center">
          <p v-if="work._count.artwork_assets > 1 && !applyExplicitFilter(auth, work.is_explicit)">{{ work._count.artwork_assets }}</p>
          <span v-if="applyExplicitFilter(auth, work.is_explicit)" class="absolute top-1/2 left-1/2 z-10 text-xl font-semibold text-white transform -translate-x-1/2 -translate-y-1/2">{{ $t('explicitContent') }}</span>
          
          <div class="overflow-hidden rounded-md" :class="{ 'animate-wigglefast': manageMode }">
            <img 
              class="object-cover w-full h-full unselectable"
              :class="{ 'blur-sm brightness-50 unclickable': applyExplicitFilter(auth, work.is_explicit) }"
              :src="artworkThumb(work.artwork_assets[0].bucket, work.artwork_assets[0].filename, 'thumbnail')"
              @error="imageLoadError"
            >
          </div>
        </div>
      </a>
    </span>
  </section>
</template>

<script setup>
import { useMediaQuery } from '@vueuse/core'

// stores
import authStore from '@/stores/auth.store'

const emit = defineEmits('feedManageList')

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
  }
})

const auth = authStore()
const { $router } = useNuxtApp()

const isLargeScreen = useMediaQuery('(min-width: 1024px)')
const open = (workId) => {
  if (isLargeScreen.value) {
    props.view(workId, true)
  } else {
    $router.push('/work/' + workId)
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

  emit('feedManageList', manageList.value)
}

watch(() => props.manageMode, (currentState) => {
  if (currentState === false) {
    manageList.value = []
  }
})
</script>

<style lang="scss" scoped>
@import "~/assets/css/artworks/view.scss";
@import "~/assets/css/artworks/list.scss";
</style>

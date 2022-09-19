<template>
  <div class="mb-2">
    <div v-if="!album.album_has_artworks || album._count.album_has_artworks === 0">
      <img src="/static/folder.png" class="rounded">
    </div>

    <!-- 1 image -->
    <div v-if="album.album_has_artworks && album._count.album_has_artworks === 1">
      <div class="relative text-center">
        <span v-if="applyExplicitFilter(auth, album.album_has_artworks[0].artworks.is_explicit)" class="absolute top-1/2 left-1/2 z-10 text-xl font-semibold text-white transform -translate-x-1/2 -translate-y-1/2">{{ $t('explicitContent') }}</span>
        
        <div class="overflow-hidden rounded-md">
          <img 
            v-if="album.album_has_artworks && album._count.album_has_artworks === 1"
            :src="artworkThumb(album.album_has_artworks[0].artworks.artwork_assets[0].bucket, album.album_has_artworks[0].artworks.artwork_assets[0].filename, 'thumbnail')"
            class="object-cover object-top rounded"
            :class="{ 'blur-sm brightness-50': applyExplicitFilter(auth, album.album_has_artworks[0].artworks.is_explicit) }"
            style="aspect-ratio: 1/1;"
            @error="imageLoadError"
          >
        </div>
      </div>
    </div>

    <!-- 2 images -->
    <div 
      v-if="album.album_has_artworks && album._count.album_has_artworks === 2"
      class="imgrid"
    >
      <div 
        v-for="(image, index) in album.album_has_artworks" 
        :key="index" 
        :class="imGridClass[2][index]"
      >
        <div class="relative text-center">
          <span v-if="applyExplicitFilter(auth, image.artworks.is_explicit)" class="absolute top-1/2 left-1/2 z-10 text-base font-semibold text-white transform -translate-x-1/2 -translate-y-1/2">{{ $t('explicitContent') }}</span>
          
          <div class="overflow-hidden rounded-md">
            <img 
              class="theme-color"
              :class="{ 'blur-sm brightness-50': applyExplicitFilter(auth, image.artworks.is_explicit) }"
              :src="artworkThumb(image.artworks.artwork_assets[0].bucket, image.artworks.artwork_assets[0].filename, 'thumbnail')" 
              @error="imageLoadError"
            >
          </div>
        </div>
      </div>
      
      <img class="bg-gray-300 border-none">
      <img class="bg-gray-300 border-none">
    </div>

    <!-- 3 images -->
    <div 
      v-if="album.album_has_artworks && album._count.album_has_artworks === 3"
      class="imgrid"
    >
      <div 
        v-for="(image, index) in album.album_has_artworks" 
        :key="index" 
        :class="imGridClass[3][index]"
      >
        <div class="relative text-center">
          <span v-if="applyExplicitFilter(auth, image.artworks.is_explicit)" class="absolute top-1/2 left-1/2 z-10 text-base font-semibold text-white transform -translate-x-1/2 -translate-y-1/2">{{ $t('explicitContent') }}</span>

          <div class="overflow-hidden rounded-md">
            <img 
              class="theme-color"
              :class="{ 'blur-sm brightness-50': applyExplicitFilter(auth, image.artworks.is_explicit) }"
              :src="artworkThumb(image.artworks.artwork_assets[0].bucket, image.artworks.artwork_assets[0].filename, 'thumbnail')" 
              @error="imageLoadError"
            >
          </div>
        </div>
      </div>
    </div>

    <!-- 4 images -->
    <div 
      v-if="album.album_has_artworks && album._count.album_has_artworks === 4"
      class="imgrid"
    >
      <div 
        v-for="(image, index) in album.album_has_artworks" 
        :key="index"
      >
        <div class="relative text-center">
          <span v-if="applyExplicitFilter(auth, image.artworks.is_explicit)" class="absolute top-1/2 left-1/2 z-10 text-tiny font-semibold text-white transform -translate-x-1/2 -translate-y-1/2">{{ $t('explicitContent') }}</span>
          
          <div class="overflow-hidden rounded-md">
            <img 
              class="theme-color"
              :class="{ 'blur-sm brightness-50': applyExplicitFilter(auth, image.artworks.is_explicit) }"
              :src="artworkThumb(image.artworks.artwork_assets[0].bucket, image.artworks.artwork_assets[0].filename, 'thumbnail')" 
              @error="imageLoadError"
            >
          </div>
        </div>
      </div>
    </div>

    <!-- more than 4 images -->
    <div 
      v-if="album.album_has_artworks && album._count.album_has_artworks > 4"
      class="imgrid"
    >
      <div 
        v-for="(image, index) in album.album_has_artworks"
        :key="index"
      >
        <div v-if="index < 3" class="relative text-center">
          <span v-if="applyExplicitFilter(auth, image.artworks.is_explicit)" class="absolute top-1/2 left-1/2 z-10 text-tiny font-semibold text-white transform -translate-x-1/2 -translate-y-1/2">{{ $t('explicitContent') }}</span>
          
          <div class="overflow-hidden rounded-md">
            <img 
              class="theme-color"
              :class="{ 'blur-sm brightness-50': applyExplicitFilter(auth, image.artworks.is_explicit) }"
              :src="artworkThumb(image.artworks.artwork_assets[0].bucket, image.artworks.artwork_assets[0].filename, 'thumbnail')" 
              @error="imageLoadError"
            >
          </div>
        </div>

        <div
          v-else
          class="relative text-center"
        >
          <span class="absolute top-1/2 left-1/2 z-10 text-3xl font-semibold text-white transform -translate-x-1/2 -translate-y-1/2">+{{ album._count.album_has_artworks-4 }}</span>
          
          <div class="overflow-hidden rounded-md">
            <img 
              :src="artworkThumb(image.artworks.artwork_assets[0].bucket, image.artworks.artwork_assets[0].filename, 'thumbnail')" 
              class="z-0 brightness-50"
              :class="{ 'blur-sm brightness-50': applyExplicitFilter(auth, image.artworks.is_explicit) }"
              @error="imageLoadError"
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// stores
import authStore from '@/stores/auth.store'

defineProps ({
  album: {
    type: Object,
    default: () => {}
  }  
})

const auth = authStore()

const imGridClass = {
  1: 'col-start-1 row-start-1 col-span-4 row-span-4',
  2: [
    'col-start-1 row-start-1 col-span-1 row-span-2',
    'col-start-2 row-start-1 col-span-1 row-span-2'
  ],
  3: [
    'col-start-1 row-start-1 col-span-1 row-span-2',
    'col-start-2 row-start-1 col-span-1 row-span-2'
  ]
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/tailwind.scss';

.imgrid {
  @apply w-full grid grid-cols-2 grid-rows-2 gap-2;
  
  img {
    @apply h-full w-full object-cover object-top rounded;
    aspect-ratio: 1/1;
  }
}
</style>

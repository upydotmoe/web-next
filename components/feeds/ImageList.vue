<template>
  <div>
    <!-- 1 images -->
    <div
      v-if="work.artwork_assets.length === 1"
      :images="[
        artworkThumb(work.artwork_assets[0].bucket, work.artwork_assets[0].filename, 'feed')
      ]"
    >
      <img 
        v-lazy="artworkThumb(work.artwork_assets[0].bucket, work.artwork_assets[0].filename, 'feed')"
        :src="artworkThumb(work.artwork_assets[0].bucket, work.artwork_assets[0].filename, 'feed')"
        class="object-contain w-full rounded"
        style="max-height: 1000px;"
        loading="lazy"
        @error="imageLoadError"
      />
    </div>
    <!-- <div
      v-if="work.artwork_assets.length === 1"
      class="imgrid"
    >
      <div
        :class="imGridClass[1]"
      >
        <img :src="work.images[0]">
      </div>
    </div> -->

    <!-- 2 images -->
    <div 
      v-if="work.artwork_assets.length === 2"
      :images="work.images"
      class="imgrid"
    >
      <img 
        v-for="(src, index) in work.images"
        :key="src" 
        v-lazy="src"
        :class="imGridClass[2][index]"
        :src="src" 
        loading="lazy"
        @error="imageLoadError"
      />
    </div>

    <!-- 3 images -->
    <div 
      v-if="work.artwork_assets.length === 3"
      :images="work.images"
      class="imgrid"
    >
      <img 
        v-for="(src, index) in work.images"
        :key="src" 
        v-lazy="src"
        :class="imGridClass[3][index]"
        :src="src" 
        loading="lazy"
        @error="imageLoadError"
      />
    </div>

    <!-- 4 images -->
    <div 
      v-if="work.artwork_assets.length === 4"
      :images="work.images"
      class="imgrid"
    >
      <img 
        v-for="src in work.images"
        :key="src" 
        v-lazy="src"
        :src="src" 
        loading="lazy"
        @error="imageLoadError"
      />
    </div>

    <!-- more than 4 images -->
    <div 
      v-if="work.artwork_assets.length > 4"
      class="imgrid"
    >
      <div 
        v-for="(image, index) in work.images" 
        :key="index"
      >
        <!-- first 3 images -->
        <img 
          v-if="index < 3"
          v-lazy="image"
          :src="image" 
          loading="lazy"
          @error="imageLoadError"
        />

        <!-- add filter on 4th image -->
        <div
          v-else
          class="relative text-center"
        >
          <span class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-3xl font-semibold text-white">+{{ work.artwork_assets.length-4 }}</span>
          <img 
            v-lazy="image"
            :src="image" 
            class="z-0 brightness-50"
            loading="lazy"
            @error="imageLoadError"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps ({
  work: {
    type: Object,
    default: () => {}
  }
})

const imGridClass = {
  1: 'col-start-1 row-start-1 col-span-4 row-span-4',
  2: [
    'col-start-1 row-start-1 col-span-1 row-span-2',
    'col-start-2 row-start-1 col-span-1 row-span-2'
  ],
  3: [
    'col-start-1 row-start-1 col-span-1 row-span-4',
    'col-start-2 row-start-1 col-span-1 row-span-2',
    'col-start-2 row-start-3 col-span-1 row-span-2'
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

<template>
  <section
    id="artwork-data-section"
    class="image-list"
  >
    <section
      v-if="artwork.redraw_of"
      id="redraw-info-section"
      class="flex flex-row mb-2"
    >
      <!-- original -->
      <nuxt-link
        :to="'/a/'+originalArtwork.id"
        class="inline-block z-10 flex-row gap-2 p-1 pr-6 rounded-l-md rounded-r-lg theme-colored hover:cursor-pointer"
      >
        <nuxt-img
          preload
          loading="lazy"
          class="inline-block mr-2 w-8 rounded-md redraw-mini-preview"
          :src="artworkThumb(originalArtwork.artwork_assets[0].bucket, originalArtwork.artwork_assets[0].filename, 'thumbnail', false)"
          @error="imageLoadError"
        />
        <span class="font-bold">
          {{ originalArtwork.title.length > redrawBreadcrumbTitleMaxLength ? originalArtwork.title.slice(0, redrawBreadcrumbTitleMaxLength) + '..' : originalArtwork.title }}
        </span>
      </nuxt-link>

      <!-- redraw version (current) -->
      <div
        :class="[
          'inline-block flex-row gap-2 p-1 pr-2 pl-6 -ml-4 rounded-lg',
          isModal ? 'theme-color-secondary' : 'theme-color'
        ]"
      >
        <nuxt-img
          preload
          loading="lazy"
          class="inline-block mr-2 w-8 rounded-md redraw-mini-preview"
          :src="artworkThumb(artwork.artwork_assets[0].bucket, artwork.artwork_assets[0].filename, 'thumbnail', false)"
          @error="imageLoadError"
        />
        <span class="font-bold">
          {{ artwork.title.length > redrawBreadcrumbTitleMaxLength ? artwork.title.slice(0, redrawBreadcrumbTitleMaxLength) + '..' : artwork.title }}
        </span>
      </div>
    </section>
    
    <!-- artwork image section -->
    <section
      id="artwork-image-section"
      class="flex flex-row gap-2"
    >
      <!-- mini thumbnail/preview -->
      <section
        v-if="!isModal && !showExplicitAlert"
        id="mini-thumbnail-section"
        class="sticky top-0 flex-col gap-2 w-1/6 hidden-md-flex"
      >
        <div class="sticky top-0">
          <a
            v-for="(src, index) in images"
            :key="index"
            :href="'#image_' + index"
            class="cursor-pointer"
          >
            <img
              preload
              loading="lazy"
              :src="src.thumbnail"
              class="mb-2 rounded-md hover:shadow-md"
              @error="imageLoadError"
            >
          </a>
        </div>
      </section>

      <!-- artwork image list -->
      <viewer
        :options="{
          url: 'data-source'
        }"
        :images="images"
        class="overflow-hidden w-full rounded-md"
      >
        <template 
          v-for="(src, index) in images"
          :key="src.thumbnail"
          @click.prevent="null"
        >
          <!-- v-lazy="src.thumbnail" -->
          <nuxt-img
            :id="'image_' + index"
            preload
            loading="lazy"
            :src="src.thumbnail"
            :data-source="src.source"
            :class="[
              'overflow-hidden mb-2 rounded cursor-pointer image image-layer unselectable w-full',
              { 'blur-lg unclickable': showExplicitAlert }, 
              showExplicitAlert ? 'brightness-50' : 'brightness-100'
            ]"
            @error="imageLoadError"
          />
        </template>
      </viewer>
    </section>
  </section>
</template>

<script setup>
// composables
const { generateSemiCompressedArtworkUrl } = useUpyImage()

const props = defineProps({
  isModal: {
    type: Boolean,
    default: true
  },
  artwork: {
    type: Object,
    default: () => {}
  },
  showExplicitAlert: {
    type: Boolean,
    default: false
  },
  images: {
    type: Array,
    default: () => []
  },
  originalArtwork: {
    type: Object,
    default: () => {}
  }
})

onMounted(() => {
  transformImages()
})

// transform images
const images = ref([])
const transformImages = () => {
  images.value = []

  console.log(props.artwork.artwork_assets)
  if (props.artwork.artwork_assets) {
    props.artwork.artwork_assets.forEach((asset) => {
      images.value.push({
        thumbnail: generateSemiCompressedArtworkUrl(asset.bucket, asset.filename, true),
        source: generateSemiCompressedArtworkUrl(asset.bucket, asset.filename, false)
      })
    })
  }
}

/**
 * @redraw
 */
const redrawBreadcrumbTitleMaxLength = useDevice().isMobile() ? 19 : 25
</script>
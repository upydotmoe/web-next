<template>
  <section
    id="artwork-data-section"
    class="image-list"
  > 
    <!-- artwork image section -->
    <section
      id="artwork-image-section"
      class="flex flex-row gap-2"
    >
      <!-- mini thumbnail/preview -->
      <section
        v-if="!isModal && !showExplicitAlert && images.length"
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
        v-if="images.length"
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
  }
})

onMounted(() => {
  transformImages()
})

// transform images
const images = ref([])
const transformImages = () => {
  images.value = []

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
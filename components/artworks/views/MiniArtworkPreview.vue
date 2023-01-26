<template>
  <!-- original artwork image, title and description -->
  <a
    :href="'/a/'+(workId ?? data.id)"
    target="_blank"
    class="flex flex-col gap-2 w-full md:flex-row"
  >
    <div v-if="data.artwork_assets">
      <nuxt-img
        preload
        loading="lazy"
        class="w-full rounded-md md:w-40"
        :src="artworkThumb(data.artwork_assets[0].bucket, data.artwork_assets[0].filename, 'thumbnail', false)"
        @error="imageLoadError"
      />
    </div>

    <div
      v-if="data.title"
      class="w-full md:w-2/3"
    >
      <h2 class="title-tiny">
        {{ data.title }}
      </h2>
      
      <p v-html="data.description.length > 200 ? data.description.slice(0, 200) + '..' : data.description" />
    </div>
  </a>
</template>

<script setup>
defineProps({
  data: {
    type: Object,
    default: () => {}
  },
  workId: {
    type: Number,
    default: 0
  }
})
</script>
<template>
  <div>
    <div class="w-full modal-layer xl:w-1/4 lg:w-2/5">
      share to feed?

      <button @click.prevent="shareToFeed()" class="primary-button">Share to Feed</button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps ({
  postId: {
    type: Number,
    default: 0
  }
})

const shareToFeed = () => {
  console.log(`sharing artwork ${props.postId} to feed..`)
}
</script>
<template>
  <section
    v-if="isPreview && !deleteSuccess"
    id="preview-scheduled-artwork-section"
    class="p-4 w-full text-center text-black bg-yellow-200 rounded-md"
  >
    <div class="flex flex-row justify-center mb-2">
      <Icon :name="'i-ion-alert-outline'" />
      <div>{{ $t('artworks.previewModeMessage') }}</div>
    </div>
          
    <div class="font-bold cursor-pointer">
      <span
        class="text-red-500 hover:underline"
        @click="deleteConfirmationDialog = true"
      >
        {{ $t('artworks.deleteArtwork') }}
      </span>

      <!-- Delete confirmation -->
      <div
        v-show="deleteConfirmationDialog"
        class="mt-2"
      >
        <span class="mr-2 font-normal">
          {{ $t('alert.areYouSure') }} <span class="italic">({{ $t('alert.youCannotUndoThisAction') }})</span>
        </span>

        <span
          class="mr-2 text-red-500 hover:underline"
          @click="$emit('deleteWork', artworkId)"
        >
          {{ $t('yes') }}
        </span>
        <span
          class="hover:underline"
          @click="deleteConfirmationDialog = false"
        >
          {{ $t('no') }}
        </span>
      </div>
    </div>
  </section>
</template>

<script setup>
defineEmits(['deleteWork'])
defineProps({
  isPreview: {
    type: Boolean,
    default: false
  },
  artworkId: {
    type: Number,
    default: 0
  }
})

const deleteConfirmationDialog = ref(false)
</script>
<template>
  <div>
    <div class="w-full modal-layer xl:w-1/4 lg:w-2/5">
      <p class="mb-4">{{ message }}</p>
      
      <div class="flex flex-row justify-end gap-2">
        <button class="cancel-button" @click="close(false)">
          {{ $t('no') }}
        </button>
        <button class="danger-button" @click="close(true)">
          {{ $t('yes') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const emits = defineEmits ('onAccept')
const props = defineProps ({
  modalId: {
    type: String,
    default: 'confirmation-dialog-modal'
  },
  message: {
    type: String,
    default: 'Are you sure?'
  },
  onAccept: {
    type: Function,
    default: () => {}
  }
})

const close = (accept) => {
  if (accept) {
    emits('onAccept', true)
  }

  useModal().closeModal(props.modalId)
}
</script>
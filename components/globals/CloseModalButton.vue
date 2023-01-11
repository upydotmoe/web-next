<template>
  <div class="flex float-right flex-row gap-2 mb-2 cursor-pointer">
    <div
      class="modal-close"
      @click="close()"
    >
      <Icon
        :name="'i-ion-close'"
        class="text-2xl"
      />
    </div>
  </div>
</template>

<script setup>
// components
import Icon from '~/components/globals/Icon.vue'

const emit = defineEmits(['close'])

const close = () => {
  emit('close')
}
</script>

<template>
  <div>
    <div class="w-full modal-layer xl:w-3/12 lg:w-2/5">
      <div class="flex flex-col justify-center w-full text-center">
        <div class="mb-6">
          <div class="flex flex-row justify-center mb-4 w-full text-base font-bold text-green-600">
            <Icon
              class="mr-2 font-bold text-green-600" 
              :name="'i-mdi-check-all'"
              :text-size="'text-xl'"
            />

            {{ $t('success') }}
          </div>

          <p>
            {{ message }}
          </p>
        </div>

        <button
          class="success-button-close"
          @click="close()"
        >
          {{ $t('close').toUpperCase() }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// components
import Icon from '~/components/globals/Icon.vue'

const props = defineProps({
  modalId: {
    type: String,
    default: 'success-modal'
  },
  message: {
    type: String,
    default: 'Success'
  }
})

const close = () => {
  useModal().closeModal(props.modalId)
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/tailwind.scss';

.success-button-close {
  @apply font-bold border-2 border-green-600 b-button theme-color hover:bg-green-600 hover:text-white;
}
</style>
<template>
  <div>
    <div class="modal-layer xl:w-3/12 lg:w-2/5">
      <div class="flex flex-col justify-center w-full text-center">
        <div class="mb-6">
          <div class="flex flex-row justify-center mb-4 w-full text-base font-bold text-green-500">
            <Icon
              class="mr-2 font-bold text-green-400" 
              :name="'i-mdi-check-all'"
              :text-size="'text-xl'"
            />

            {{ $t('success') }}
          </div>

          <p>
            {{ message }}
          </p>
        </div>

        <button @click="close()" class="success-button-close">{{ $t('close').toUpperCase() }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
// components
import Icon from '~/components/globals/Icon.vue'

defineProps ({
  message: {
    type: String,
    default: 'Success'
  },
  autoCloseAfterMs: {
    type: Number,
    default: 2000
  }
})

const close = () => {
  useModal().closeModal('success-modal')
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/tailwind.scss';

</style>
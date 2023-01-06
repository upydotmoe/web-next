<template>
  <div
    v-if="isLoading | isError | isSuccess"
    :class="[
      'flex flex-row p-2 text-white rounded-md',
      messageClass
    ]"
  >
    <Spinner
      v-if="isLoading"
      class="mr-2"
    />

    {{ message }}
  </div>
</template>

<script lang="ts" setup>
import Spinner from '~/components/globals/Spinner.vue'

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false
  },
  loadingMessage: {
    type: String,
    default: null
  },
  isError: {
    type: Boolean,
    default: false
  },
  errorMessage: {
    type: String,
    default: null
  },
  isSuccess: {
    type: Boolean,
    default: false
  },
  successMessage: {
    type: String,
    default: null
  }
})

const messageClass = computed(() => {
  if (props.isLoading) {
    return 'button-color'
  } else if (props.isSuccess) {
    return 'bg-green-600'
  } else {
    return 'bg-red-600'
  }
})

const message = computed(() => {
  if (props.isLoading) {
    return props.loadingMessage
  } else if (props.isSuccess) {
    return props.successMessage
  } else {
    return props.errorMessage
  }
})
</script>
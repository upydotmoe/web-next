<template>
  <div>
    <div class="hidden" @click="fetch(0)" />
    <div class="w-full modal-layer xl:w-1/4 lg:w-2/5">
      <div>
        <span class="title">{{ $t('collections.edit.form.title') }}</span>

        <div v-if="!loading" class="mt-4">
          <!-- VV -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// composables
import useApiFetch from '~/composables/useApiFetch'
import useModal from '~/composables/useModal'
import useCollection from '~/composables/users/useCollection'

const emit = defineEmits('updated')

const props = defineProps({
  collectionId: {
    type: Number,
    default: 0
  },
  modalId: {
    type: String,
    default: ''
  }
})

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const collectionApi = useCollection(oApiConfiguration, fetchOptions())

const loading = ref(true)

const inputData = ref({
  id: 0,
  name: '',
  description: '',
  isPublic: false
})
const fetch = async (collectionId) => {
  if (collectionId) {
    reset()
    loading.value = true

    const [info, error] = await collectionApi.getInfo(collectionId)

    if (error) {
      // todo: handle error
    } else {
      const collectionInfo = info.data

      inputData.value.id = collectionId
      inputData.value.name = collectionInfo.name
      inputData.value.description = collectionInfo.description
      inputData.value.isPublic = !!collectionInfo.is_public

      loading.value = false
    }
  }
}

const save = async () => {
  try {
    // transform isPublic from boolean to 0 1
    inputData.value.isPublic = inputData.value.isPublic ? 1 : 0

    const [success, error] = await collectionApi.update(inputData.value)

    if (error) {
      // todo: handle error
    } else {
      useModal().closeModal(props.modalId)
      emit('updated', inputData.value)

      reset()
    }
  } catch (error) {
    // 
  }
}

const reset = () => {
  inputData.value = {
    id: 0,
    name: '',
    description: '',
    isPublic: 0
  }
}
</script>

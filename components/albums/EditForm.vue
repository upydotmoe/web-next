<template>
  <div>
    <div class="hidden" @click="fetch(0)" />
    <div class="w-full modal-layer xl:w-1/4 lg:w-2/5">
      <div>
        <span class="title">{{ $t('albums.edit.form.title') }}</span>

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
import useAlbum from '~/composables/users/useAlbum'

const emit = defineEmits('updated')

const props = defineProps({
  albumId: {
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
const album = useAlbum(oApiConfiguration, fetchOptions())

const loading = ref(true)

const inputData = ref({
  id: 0,
  name: '',
  description: '',
  isPublic: false
})
const fetch = async (albumId) => {
  if (albumId) {
    reset()
    loading.value = true

    const [info, error] = await album.getInfo(albumId)

    const albumInfo = info.data

    inputData.value.id = albumId
    inputData.value.name = albumInfo.name
    inputData.value.description = albumInfo.description
    inputData.value.isPublic = !!albumInfo.is_public

    loading.value = false
  }
}

const save = async () => {
  try {
    // transform isPublic from boolean to 0 1
    inputData.value.isPublic = inputData.value.isPublic ? 1 : 0

    const [success, error] = await album.update(inputData.value)

    if (success) {
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

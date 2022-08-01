<template>
  <div>
    <div class="w-full modal-layer xl:w-1/4 lg:w-2/5">
      <div>
        <span class="title">{{ $t('albums.create.form.title') }}</span>

        <div class="mt-4">
          <!-- VV -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// API
import {
  AlbumsApi
} from '~/api/openapi/api'

// composables
import useApiFetch from '~/composables/useApiFetch'
import useModal from '~/composables/useModal'
import useAlbum from '~/composables/users/useAlbum'

const emit = defineEmits('created')
const props = defineProps({
  category: {
    type: String,
    default: 'artwork'
  },
  modalId: {
    type: String,
    default: ''
  }
})

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const album = useAlbum(oApiConfiguration, fetchOptions())

const inputData = ref({
  title: '',
  description: '',
  isPublic: 1,
  category: 'artwork'
})

/** Save new album */
const save = async () => {
  try {
    let created = false
    let newAlbumData = {}

    // call API to create new album
    if (props.category) {
      const [success, data, error] = await album.createAlbum(props.category, inputData.value)

      created = success
      newAlbumData = data
    }

    if (created) {
      useModal().closeModal(props.modalId)
      emit('created', newAlbumData)
    }
  } catch (error) {
    // 
  }
}
</script>

<style lang="scss">
@import '~/assets/css/tailwind.scss';

</style>

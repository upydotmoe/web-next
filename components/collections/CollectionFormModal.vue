<template>
  <div>
    <div class="w-full modal-layer xl:w-1/4 lg:w-2/5">
      <div>
        <span class="title">{{ $t('collections.create.form.title') }}</span>

        <div class="mt-4">
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
const collectionApi = useCollection(oApiConfiguration, fetchOptions())

const inputData = ref({
  title: '',
  description: '',
  isPublic: 1,
  category: 'artwork'
})
const save = async () => {
  try {
    let created = false
    let newCollectionData = {}

    // call API to create new collection
    if (props.category) {
      const [success, data, error] = await collectionApi.createCollection(props.category, inputData.value)

      if (error) {
        // todo: handle error
      } else {
        created = success
        newCollectionData = data
      }
    }

    if (created) {
      useModal().closeModal(props.modalId)
      emit('created', newCollectionData)
    }
  } catch (error) {
    // todo: handle error
  }
}
</script>

<style lang="scss">
@import '~/assets/css/tailwind.scss';

</style>

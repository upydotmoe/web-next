<template>
  <div>
    <div class="w-full modal-layer xl:w-1/4 lg:w-2/5">
      <div>
        <span class="title">{{ $t('albums.edit.form.title') }}</span>

        <form 
          v-if="!loading"
          :id="formId"
          class="mt-2"
          @submit.prevent="save(formId)"
        >
          <!-- title input -->
          <n-validate 
            for="title" 
            :name="$t('title')"
          >
            <input 
              v-model="inputData.name"
              type="text"
              class="form-input theme-color-secondary"
              rules="required"
              :placeholder="$t('title')"
            >
          </n-validate>

          <!-- description input -->
          <textarea
            v-model="inputData.description"
            class="form-input theme-color-secondary"
            :placeholder="$t('description')"
            data-gramm="false"
          />

          <!-- is public radio button -->
          <label :for="inputData.isPublic ? 'checked' : 'unchecked'" class="inline-flex items-center">
            <span class="relative cursor-pointer" @click="inputData.isPublic = !inputData.isPublic">
              <span class="block w-10 h-6 bg-gray-300 rounded-full shadow-inner" />
              <span v-if="inputData.isPublic" class="block absolute inset-y-0 left-0 mt-1 ml-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ease-in-out focus-within:shadow-outline">
                <input id="unchecked" type="checkbox" class="absolute w-0 h-0 opacity-0">
              </span>
              
              <span v-if="!inputData.isPublic" class="block absolute inset-y-0 left-0 mt-1 ml-1 w-4 h-4 rounded-full shadow transition-transform duration-300 ease-in-out transform translate-x-full focus-within:shadow-outline button-color">
                <input id="checked" type="checkbox" class="absolute w-0 h-0 opacity-0">
              </span>
            </span>
            <span class="ml-2">{{ $t('private') }}</span>
          </label>

          <div class="flex flex-row gap-2 justify-end mt-2">
            <button class="cancel-button" @click.prevent="closeModal(modalId)">
              {{ $t('cancel') }}
            </button>
            <button type="submit" class="primary-button">
              {{ $t('save') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

// composables
import useAlbum from '~/composables/users/useAlbum'

const emits = defineEmits ('updated')
const props = defineProps ({
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
const albumApi = useAlbum(oApiConfiguration, fetchOptions())

const { t } = useI18n()

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

    const [data, error] = await albumApi.getInfo(albumId)

    const albumInfo = data.data

    inputData.value.id = albumId
    inputData.value.name = albumInfo.name
    inputData.value.description = albumInfo.description
    inputData.value.isPublic = !!albumInfo.is_public

    loading.value = false
  }
}

const formId = 'update-album-form'
const save = async () => {
  // validate input before going to the next step
  validateForm()

  try {
    // transform isPublic from boolean to 0 1
    inputData.value.isPublic = inputData.value.isPublic ? 1 : 0

    const [success, error] = await albumApi.update(inputData.value)

    if (success) {
      useModal().closeModal(props.modalId)
      emits('updated', inputData.value)

      reset()
    }
  } catch (error) {
    // 
  }
}
const validateForm = () => {
  const formEl = document.getElementById(formId)
  useValidator().validate(formEl, t)
}

const reset = () => {
  inputData.value = {
    id: 0,
    name: '',
    description: '',
    isPublic: 0
  }
}

/**
 * @expose
 */
defineExpose({
  fetch
})
</script>
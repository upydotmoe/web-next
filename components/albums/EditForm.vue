<template>
  <div>
    <div class="w-full modal-layer xl:w-1/4 lg:w-2/5">
      <section id="update-album-form">
        <h2 class="title">
          {{ $t('albums.edit.form.title') }}
        </h2>

        <form
          v-if="!loading"
          :id="formId"
          @submit.prevent="save()"
        >
          <ErrorMessage
            :is-error="error.isError"
            :error-message="error.message"
          />

          <n-validate 
            for="title" 
            :name="$t('title')"
          >
            <input 
              v-model="inputData.name"
              type="text"
              rules="required"
              class="input-color-secondary"
              :placeholder="$t('title')"
            >
          </n-validate>

          <n-validate
            for="description"
            :name="$t('description')"
          >
            <textarea
              v-model="inputData.description"
              rules=""
              data-gramm="false"
              class="input-color-secondary"
              :placeholder="$t('description')"
            />
          </n-validate>

          <!-- album privacy -->
          <label
            :for="inputData.isPublic ? 'checked' : 'unchecked'"
            class="inline-flex items-center"
          >
            <span
              class="relative cursor-pointer"
              @click="auth.i502p00r0 ? inputData.isPublic = !inputData.isPublic : inputData.isPublic = true"
            >
              <span class="block w-10 h-6 bg-gray-300 rounded-full shadow-inner" />
              <span
                v-if="inputData.isPublic"
                class="block absolute inset-y-0 left-0 mt-1 ml-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ease-in-out focus-within:shadow-outline"
              >
                <input
                  id="unchecked"
                  type="checkbox"
                  class="absolute w-0 h-0 opacity-0"
                >
              </span>
              
              <span
                v-if="!inputData.isPublic"
                class="block absolute inset-y-0 left-0 mt-1 ml-1 w-4 h-4 rounded-full shadow transition-transform duration-300 ease-in-out transform translate-x-full focus-within:shadow-outline button-color"
              >
                <input
                  id="checked"
                  type="checkbox"
                  class="absolute w-0 h-0 opacity-0"
                >
              </span>
            </span>
            
            <div class="flex flex-row gap-x-2">
              <span
                :class="[
                  'ml-2',
                  { 'leading-6': !auth.i502p00r0 }
                ]"
              >
                {{ $t('private') }}
              </span>
              
              <ProBadge v-if="!auth.i502p00r0" />
            </div>
          </label>

          <div class="buttons">
            <button
              class="cancel"
              @click.prevent="closeModal(modalId)"
            >
              {{ $t('cancel') }}
            </button>
            <button
              type="submit"
              class="submit"
            >
              {{ $t('save') }}
            </button>
          </div>
        </form>
      </section>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'

// stores
import useAuthStore from '~/stores/auth.store'

// composables
import useAlbum from '~/composables/users/useAlbum'

// components
import ProBadge from '~/components/globals/ProBadge.vue'
import ErrorMessage from '~/components/auth/forms/ErrorMessage.vue'

// stores
const auth = useAuthStore()

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const albumApi = useAlbum(oApiConfiguration, fetchOptions())

const { t } = useI18n()

const emit = defineEmits(['updated'])
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

const loading = ref(true)

const fetch = async (albumId: number) => {
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
const inputData = ref({
  id: 0,
  name: '',
  description: '',
  isPublic: true
})

const save = async () => {
  hideError()
  useValidator().validate(formId, t)

  const [success, apiError] = await albumApi.update({
    id: inputData.value.id,
    name: inputData.value.name,
    description: inputData.value.description,
    isPublic: inputData.value.isPublic
  })

  if (apiError) {
    error.value = {
      isError: true,
      message: apiError
    }
  } else {
    useModal().closeModal(props.modalId)
    emit('updated', inputData.value)

    reset()
  }
}

const error = ref({
  isError: false,
  message: ''
})
const hideError = () => {
  error.value = {
    isError: false,
    message: ''
  }
}

const reset = () => {
  inputData.value = {
    id: 0,
    name: '',
    description: '',
    isPublic: true
  }
}

// expose functions
defineExpose({
  fetch
})
</script>
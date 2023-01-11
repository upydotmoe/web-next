<template>
  <div>
    <div class="w-full modal-layer xl:w-1/4 lg:w-2/5">
      <section id="crate-album-form">
        <h2 class="title">
          {{ $t('albums.create.form.title') }}
        </h2>

        <form
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
              v-model="inputData.title"
              type="text"
              rules="required"
              :placeholder="$t('title')"
            >
          </n-validate>

          <n-validate
            for="description"
            :name="$t('description')"
          >
            <textarea
              v-model="inputData.description"
              :placeholder="$t('description')"
              rules=""
              data-gramm="false"
            />
          </n-validate>

          <!-- privacy -->
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
                  'ml-2 inline-block',
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
              {{ $t('create') }}
            </button>
          </div>
        </form>
      </section>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'

import { POST_TYPES } from '~/utils/constants'

// stores
import useAuthStore from '~/stores/auth.store'

// composables
import useAlbum from '~/composables/users/useAlbum'

// components
import ProBadge from '~/components/globals/ProBadge.vue'
import ErrorMessage from '../auth/forms/ErrorMessage.vue'

// stores
const auth = useAuthStore()

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const albumApi = useAlbum(oApiConfiguration, fetchOptions())

const emit = defineEmits(['created'])
const props = defineProps({
  category: {
    type: String,
    default: POST_TYPES.ARTWORK
  },
  modalId: {
    type: String,
    default: 'create-album-form-modal'
  }
})

const { t } = useI18n()

const formId = 'create-album-form'
const inputData = ref({
  title: '',
  description: '',
  isPublic: true,
})
const error = ref({
  isError: false,
  message: ''
})

const save = async () => {
  hideError()
  useValidator().validate(formId, t)

  let newAlbumData = {}
  const [success, data, apiError] = await albumApi.createAlbum(
    props.category,
    inputData.value
  )

  if (apiError) {
    error.value = {
      isError: true,
      message: apiError
    }
  } else {
    useModal().closeModal(props.modalId)
    emit('created', data)
  }
}

const hideError = () => {
  error.value = {
    isError: false,
    message: ''
  }
}
</script>

<style lang="scss" scoped>
input, textarea {
  @apply theme-color-secondary;
}
</style>

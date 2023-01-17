<template>
  <div>
    <div
      class="hidden"
      @click="fetch(0)"
    />
    <div class="w-full modal-layer xl:w-1/4 lg:w-2/5">
      <section id="update-collection-form">
        <span class="title">{{ $t('collections.edit.form.title') }}</span>

        <form
          v-if="!loading"
          :id="formId"
          @submit.prevent="save(formId)"
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

<script setup>
import { useI18n } from 'vue-i18n'

// stores
import useAuthStore from '~/stores/auth.store'

// composables
import useCollection from '~/composables/users/useCollection'
import ProBadge from '~/components/globals/ProBadge.vue'

// components
import ErrorMessage from '~/components/auth/forms/ErrorMessage.vue'

// stores
const auth = useAuthStore()

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const collectionApi = useCollection(oApiConfiguration, fetchOptions())

const { t } = useI18n()

const emit = defineEmits(['updated'])
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

const loading = ref(true)

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

const formId = 'edit-collection-form'
const inputData = ref({
  id: 0,
  name: '',
  description: '',
  isPublic: true
})
const save = async () => {
  hideError()
  useValidator().validate(formId, t)

  const [success, apiError] = await collectionApi.update({
    id: inputData.value.id,
    name: inputData.value.name,
    description: inputData.value.description,
    isPublic: inputData.value.isPublic ? 1 : 0
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

<style lang="scss" scoped>
input, textarea {
  @apply theme-color-secondary;
}
</style>

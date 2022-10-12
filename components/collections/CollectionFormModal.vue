<template>
  <div>
    <div class="w-full modal-layer xl:w-1/4 lg:w-2/5">
      <div>
        <span class="title">{{ $t('collections.create.form.title') }}</span>

        <form
          :id="formId"
          class="mt-2"
          @submit.prevent="save(formId)"
        >
          <!-- title input -->
          <n-validate>
            <input 
              v-model="inputData.title"
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
            <span class="relative cursor-pointer" @click="auth.i502p00r0 ? inputData.isPublic = !inputData.isPublic : inputData.isPublic = true">
              <span class="block w-10 h-6 bg-gray-300 rounded-full shadow-inner" />
              <span v-if="inputData.isPublic" class="block absolute inset-y-0 left-0 mt-1 ml-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ease-in-out focus-within:shadow-outline">
                <input id="unchecked" type="checkbox" class="absolute w-0 h-0 opacity-0">
              </span>
              
              <span v-if="!inputData.isPublic" class="block absolute inset-y-0 left-0 mt-1 ml-1 w-4 h-4 rounded-full shadow transition-transform duration-300 ease-in-out transform translate-x-full focus-within:shadow-outline button-color">
                <input id="checked" type="checkbox" class="absolute w-0 h-0 opacity-0">
              </span>
            </span>
            
            <div class="flex flex-row gap-x-1">
              <span class="ml-2">{{ $t('private') }}</span>
              <ProBadge />
            </div>
          </label>

          <div class="flex flex-row gap-2 justify-end mt-2">
            <button class="cancel-button" @click.prevent="closeModal(modalId)">
              {{ $t('cancel') }}
            </button>
            <button type="submit" class="primary-button">
              {{ $t('create') }}
            </button>
          </div>
        </form>
      </div>
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

// stores
const auth = useAuthStore()

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const collectionApi = useCollection(oApiConfiguration, fetchOptions())

const emits = defineEmits ('created')
const props = defineProps ({
  category: {
    type: String,
    default: 'artwork'
  },
  modalId: {
    type: String,
    default: ''
  }
})

const { t } = useI18n()

const formId = 'create-collection-form'
const inputData = ref({
  title: '',
  description: '',
  isPublic: 1,
  category: 'artwork'
})
const save = async () => {
  useValidator().validate(formId, t)

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
      emits('created', newCollectionData)
    }
  } catch (error) {
    // todo: handle error
  }
}
</script>

<style lang="scss">
@import '~/assets/css/tailwind.scss';

</style>

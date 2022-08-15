<template>
  <div>
    <div class="mb-4 text-base font-bold">
      {{ $t('artworks.update.form.title') }} 
      <span class="text-xs italic font-bold href">
        <nuxt-link :to="'/work/'+id">
          (ID: {{ id }})
        </nuxt-link>
      </span>
    </div>

    <div v-show="isErrorFetching" class="alert-danger">
      {{ $t('artworks.update.form.fetchFailure') }}
    </div>
    
    <div v-show="updated" class="alert-success">
      {{ $t('artworks.update.form.updated') }}
      <span class="italic">{{ $t('artworks.update.form.successRedirect') }}</span>
    </div>

    <div v-show="saving" class="flex flex-row p-2 mb-6 text-white rounded-md button-color">
      <Spinner class="mr-1" />
      {{ $t('saving') }}
    </div>

    <div v-show="isError" class="alert-danger">
      {{ $t('artworks.add.form.uploadFailure') }}
    </div>

    <form v-show="!isErrorFetching" enctype="multipart/form-data" @submit.prevent="update">
      <div class="input-block">
        <input 
          v-model="inputData.title" 
          type="text" 
          class="form-input input" 
          :class="{ 'pointer-events-none cursor-not-allowed': saving || updated }"
          :placeholder="$t('title')"
        >
      </div>

      <div class="input-block">
        <textarea 
          v-model="inputData.description" 
          class="form-input input" 
          :class="{ 'pointer-events-none cursor-not-allowed': saving || updated }"
          rows="8"
          cols="0"
          :placeholder="$t('description')"
          data-gramm="false"
        />
      </div>

      <div class="input-block">
        <tags-input 
          v-model="tags"
          :placeholder="$t('tags')"
          :typeahead="true"
          :typeahead-style="'dropdown'"
          :typeahead-activation-threshold="2"
          :typeahead-show-on-focus="true"
          :typeahead-hide-discard="true"
          :typeahead-url="apiUrl+'/artworks/tags/search?keyword=:search'"
          :add-tags-on-comma="true"
        />
      </div>

      <div class="input-block">
        <div class="mb-3">
          <label :for="!inputData.isExplicit ? 'checked' : 'unchecked'" class="inline-flex items-center mt-2">
            <span class="relative cursor-pointer" @click="inputData.isExplicit = !inputData.isExplicit">
              <span class="block w-10 h-6 bg-gray-300 rounded-full shadow-inner" />
              <span v-if="!inputData.isExplicit" class="block absolute inset-y-0 left-0 mt-1 ml-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ease-in-out focus-within:shadow-outline">
                <input id="unchecked" type="checkbox" class="absolute w-0 h-0 opacity-0">
              </span>
              
              <span v-if="inputData.isExplicit" class="block absolute inset-y-0 left-0 mt-1 ml-1 w-4 h-4 rounded-full shadow transition-transform duration-300 ease-in-out transform translate-x-full focus-within:shadow-outline button-color">
                <input id="checked" type="checkbox" class="absolute w-0 h-0 opacity-0">
              </span>
            </span>
            <span class="ml-2">{{ $t('explicitContent') }}</span>
          </label>

          <div v-show="inputData.isExplicit" class="flex flex-row p-2 mt-2 text-white bg-red-400 rounded">
            <Icon :name="'alert-outline'" class="mr-1 text-white" /> 
            <span>{{ $t('artworks.add.form.prohibitChildExplicitContent') }}</span>
          </div>
        </div>
      </div>

      <button class="float-right primary-button" :class="{ 'pointer-events-none cursor-not-allowed': saving || updated }">
        <div class="flex flex-row">
          <Spinner v-if="saving" class="mr-1" />
          {{ !saving ? $t('save') : $t('saving') }}
        </div>
      </button>
    </form>
  </div>
</template>

<script setup>
// stores
import useAuthStore from '@/stores/auth.store';

// components
import Spinner from '~/components/globals/Spinner.vue'
import Icon from '~/components/globals/Icon.vue'


const props = defineProps ({
  id: {
    type: String,
    default: ''
  }
})

const auth = useAuthStore()
const { $router } = useNuxtApp()

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const artworkApi = useArtwork(oApiConfiguration, fetchOptions())

const apiUrl = process.env.API_URL

onMounted (() => {
  if (!auth.loggedIn) {
    $router.push('/')
  }

  fetchWorkInfo()
})

/**
 * Retrieve current work info
 */
const isErrorFetching = ref(false)
const fetchWorkInfo = async () => {
  const [data, error] = await artworkApi.getWorkById(props.id)

  if (error) {
    isErrorFetching.value = true
  } else {
    inputData.value.title = data.title
    inputData.value.description = data.description
    data.artwork_has_tags.forEach((tag) => {
      tags.value.push({
        key: tag.artwork_tags.id,
        value: tag.artwork_tags.tag
      })
    })
    inputData.value.isExplicit = !!data.is_explicit
  }
}

// 
const inputData = ref({
  title: '',
  description: '',
  tags: '',
  isExplicit: false
})
const tags = ref([])

const saving = ref(false)
const updated = ref(false)
const isError = ref(false)
const update = async () => {
  // collect picked tags and convert to acceptable API format
  const tagValues = []
  tags.value.forEach((tag) => {
    tagValues.push(tag.value)
  })

  // proceed to send data to API
  saving.value = true
  updated.value = false

  try {
    // remove tag keys and collect tag values
    const tagValues = []
    tags.value.forEach((tag) => {
      tagValues.push(tag.value)
    })

    const [success, error] = await artworkApi.updateInfo(props.id, inputData.value, tagValues.toString())

    if (error) {
      isError.value = true
    } else {
      updated.value = true
      setTimeout(() => {
        $router.push(`/work/${props.id}`)
      }, 1000)
    }
  } catch (error) {
    isError.value = true
  }

  saving.value = false
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/tailwind.scss';

form {
  .input-block {
    @apply mb-1;
  }
}
</style>

<template>
  <div>
    <div class="mb-4 text-base font-bold">
      {{ $t('artworks.update.form.title') }} 
      <span class="text-xs italic font-bold href">
        <nuxt-link :to="'/a/'+id">
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

      <div class="-mt-2 input-block">
        <VueEditor
          v-model="inputData.description"
          :editorToolbar="[
            [{ 'size': ['normal', 'large'] }],
            ['bold', 'italic', 'underline', 'strike'],
            ['link'],
            [{ 'color': [] }, { 'background': [] }],
            ['clean']
          ]"
          :class="[
            { 'pointer-events-none cursor-not-allowed': saving || updated }
          ]"
          :placeholder="$t('description')"
        />
        <!-- <textarea 
          v-model="inputData.description" 
          class="form-input input" 
          :class="{ 'pointer-events-none cursor-not-allowed': saving || updated }"
          rows="8"
          cols="0"
          :placeholder="$t('description')"
          data-gramm="false"
        /> -->
      </div>

      <div class="input-block">
        <tags-input 
          v-model="tags"
          :placeholder="$t('tagsInputPlaceholder')"
          :typeahead="true"
          :typeahead-style="'dropdown'"
          :typeahead-activation-threshold="2"
          :typeahead-show-on-focus="true"
          :typeahead-hide-discard="true"
          :typeahead-url="apiUrl+'/artworks/tags/search?keyword=:search'"
          :add-tags-on-comma="true"
        />
      </div>

      <!-- original character toggler -->
      <div v-if="!currentInfo.redraw_of" class="input-block">
        <label 
          for="is-original-character-toggle"
          class="inline-flex relative items-center cursor-pointer"
        >
          <input 
            @click="inputData.isOriginalCharacter = !inputData.isOriginalCharacter"
            id="is-original-character-toggle"
            type="checkbox" 
            class="sr-only peer" 
            :checked="inputData.isOriginalCharacter"
          >
          <div class="toggle peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 peer-checked:bg-blue-600 " />

          <span class="ml-2">{{ $t('artworks.originalCharacter') }}</span>
        </label>
      </div>

      <!-- allow redraw toggler -->
      <div v-if="!currentInfo.redraw_of" class="input-block">
        <label 
          for="is-allow-redraw-toggle"
          class="inline-flex relative items-center cursor-pointer"
        >
          <input 
            @click="inputData.isAllowRedraw = !inputData.isAllowRedraw"
            id="is-allow-redraw-toggle" 
            type="checkbox" 
            class="sr-only peer" 
            :checked="inputData.isAllowRedraw"
          >
          <div class="toggle peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 peer-checked:bg-blue-600 " />

          <span class="ml-2">{{ $t('artworks.add.form.allowRedraw') }}</span>
        </label>
      </div>

      <!-- redraw in your style toggler -->
      <div v-if="currentInfo.redraw_of" class="input-block">
        <label 
          for="is-redraw-in-your-style-toggle"
          class="inline-flex relative items-center cursor-pointer"
        >
          <input 
            @click="inputData.isRedrawInMyStyle = !inputData.isRedrawInMyStyle"
            id="is-redraw-in-your-style-toggle" 
            type="checkbox" 
            class="sr-only peer" 
            :checked="inputData.isRedrawInMyStyle"
          >
          <div class="toggle peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 peer-checked:bg-blue-600 " />

          <span class="ml-2">{{ $t('artworks.add.form.redrawInMyStyle') }}</span>
        </label>
      </div>

      <!-- explicit content toggler -->
      <div class="input-block">
        <label
          for="explicit-mode-toggle"
          class="inline-flex relative items-center cursor-pointer"
        >
          <input 
            @click="inputData.isExplicit = !inputData.isExplicit"
            id="explicit-mode-toggle" 
            type="checkbox" 
            class="sr-only peer" 
            :checked="inputData.isExplicit"
          >
          <div class="toggle peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 peer-checked:bg-blue-600 " />

          <span class="ml-2">{{ $t('explicitContent') }}</span>
        </label>
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
// vue3-editor
import { VueEditor } from 'vue3-editor'

// stores
import useAuthStore from '@/stores/auth.store';

// components
import Spinner from '~/components/globals/Spinner.vue'

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

const runtimeConfig = useRuntimeConfig()
const apiUrl = runtimeConfig.public.apiUrl

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
const currentInfo = ref({})
const fetchWorkInfo = async () => {
  const [data, error] = await artworkApi.getWorkById(props.id)

  if (error) {
    isErrorFetching.value = true
  } else {
    currentInfo.value = data

    inputData.value.title = data.title
    inputData.value.description = data.description.split('<br><br>').join(' \n').split('<br>').join('')
    inputData.value.isExplicit = !!data.is_explicit
    inputData.value.isOriginalCharacter = !!data.is_original_character
    inputData.value.isAllowRedraw = !!data.allow_redraw
    inputData.value.isRedrawInMyStyle = !!data.redraw_in_your_style

    data.artwork_has_tags.forEach((tag) => {
      tags.value.push({
        key: tag.artwork_tags.id,
        value: tag.artwork_tags.tag
      })
    })
  }
}

// 
const inputData = ref({
  title: '',
  description: '',
  tags: '',
  isExplicit: false,
  isOriginalCharacter: false,
  isAllowRedraw: false,
  isRedrawInMyStyle: false,
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

    const [success, error] = await artworkApi.updateInfo({
      id: props.id,
      title: inputData.value.title,
      description: inputData.value.description,
      isExplicit: inputData.value.isExplicit,
      tags: tagValues.toString(),
      isOriginalCharacter: inputData.value.isOriginalCharacter,
      allowRedraw: inputData.value.allowRedraw,
      redrawInYourStyle: inputData.value.isRedrawInMyStyle,
    })

    if (error) {
      isError.value = true
    } else {
      updated.value = true
      setTimeout(() => {
        $router.push(`/a/${props.id}`)
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
    @apply mb-4;
  }
}
</style>

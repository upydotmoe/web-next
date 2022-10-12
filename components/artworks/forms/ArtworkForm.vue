<template>
  <div>
    <!-- messages -->
    <div v-if="uploadError" class="p-2 mb-2 w-full text-white bg-red-500 rounded-md">
      {{ uploadErrorMessage }}
    </div>

    <!-- form title -->
    <div class="mb-4 text-base font-medium">
      {{ $t('artworks.add.form.title') }}
    </div>
    
    <!-- success message -->
    <div v-show="uploadSuccess" class="alert-success">
      {{ $t('artworks.add.form.uploadSuccess') }}
      <span class="italic">{{ $t('artworks.add.form.successRedirect') }}</span>
    </div>

    <!-- loading status -->
    <div v-show="uploading" class="flex flex-row p-2 mb-2 text-white rounded-md button-color">
      <Spinner class="mr-1" />
      {{ $t('artworks.add.form.uploading') }}
    </div>

    <!-- error message -->
    <div v-show="isError" class="alert-danger">
      {{ $t('artworks.add.form.uploadFailure') }}
    </div>

    <!-- form -->
    <form
      :id="formId"
      enctype="multipart/form-data"
      @submit.prevent="storeArtwork(formId)"
    >
      <!-- title -->
      <div class="input-block">
        <n-validate 
          for="title"
          :name="$t('title')" 
          class="input-block"
        >
          <input 
            v-model="inputData.title"
            type="text"
            :class="[
              'form-input input',
              { 'pointer-events-none cursor-not-allowed': uploading || uploadSuccess }
            ]"
            :placeholder="$t('title')"
          >
        </n-validate>
      </div>

      <!-- description -->
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
            { 'pointer-events-none cursor-not-allowed': uploading || uploadSuccess }
          ]"
          :placeholder="$t('description')"
        />
        <!-- <textarea
          v-model="inputData.description"
          class="form-input input"
          :class="[{ 'pointer-events-none cursor-not-allowed': uploading || uploadSuccess }]"
          rows="5" 
          cols="0"
          :placeholder="$t('description')"
          data-gramm="false"
        /> -->
      </div>

      <div class="input-block">
        <div v-show="alert.showFileTooBig" class="p-2 mb-2 text-xs text-white bg-red-400 rounded-md shadow-md">
          {{ $t('artworks.add.form.fileTooBig') }} {{ maxFileSize }}MB.
        </div>
        <client-only>
          <file-pond
            ref="pond"
            name="files[]"
            :label-idle="labelIdleText"
            accepted-file-types="image/jpeg, image/png"
            allow-multiple="true"
            allow-drop="true"
            allow-reorder="true"
            allow-process="true"
            credits="false"
            :max-files="maxFileCount"
            instant-upload="false"
            class="bg-transparent rounded-sm"
            :class="{ 'pointer-events-none cursor-not-allowed': uploading || uploadSuccess }"
            @updatefiles="handleFilePondUpdateFile"
          />
        </client-only>
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
          :class="{ 'pointer-events-none cursor-not-allowed': uploading || uploadSuccess }"
        />
      </div>

      <div class="input-block">
        <div class="mb-3">
          <label :for="!inputData.isExplicit ? 'checked' : 'unchecked'" class="inline-flex items-center mt-2">
            <span class="relative cursor-pointer" @click="inputData.isExplicit = !inputData.isExplicit">
              <span class="block w-10 h-6 bg-gray-300 rounded-full shadow-inner" />
              <span v-if="!inputData.isExplicit" class="block absolute inset-y-0 left-0 mt-1 ml-1 w-4 h-4 bg-gray-100 rounded-full shadow transition-transform duration-300 ease-in-out focus-within:shadow-outline">
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

      <div class="flex flex-row gap-x-2 input-block">
        <!-- <ClientOnly>
          <div
            x-data
            x-init="flatpickr($refs.datetimewidget, {wrap: true, enableTime: true, dateFormat: 'M j, Y h:i K'});"
            x-ref="datetimewidget"
            class="mb-2 flatpickr"
          >
            <div class="flex align-middle align-content-center">
              <input
                id="datetime"
                v-model="inputData.publishDate"
                x-ref="datetime"
                type="text"
                data-input
                :placeholder="$t('artworks.add.form.publishDate')"
                class="form-input input"
                :class="{ 'pointer-events-none cursor-not-allowed': uploading || uploadSuccess }"
              >
            </div>
          </div>
        </ClientOnly> -->
        <div class="relative w-full">
          <div class="flex absolute left-1 top-3.5 items-center pl-2 pointer-events-none">
            <!-- <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path></svg> -->
            <Icon :name="'i-bi-calendar3-event'" />
          </div>
          <input 
            id="publishDate" 
            type="text"
            class="block pl-10 w-full form-input input"
            :placeholder="$t('artworks.add.form.publishDate')"
            autocomplete="off"
          >
        </div>
        
        <!-- publish time -->
        <input v-model="inputData.publishTime" type="time" class="form-input input">
      </div>

      <div class="flex flex-row justify-between md:justify-end">
        <button class="mr-2 w-full reset-form-button md:w-auto" type="reset" @click="resetForm()">Reset</button>
        <button
          type="submit"
          :class="[
            'float-right w-full md:w-auto',
            { 'pointer-events-none cursor-not-allowed': uploading || uploadSuccess }, 
            artworkFiles.length > 0 ? 'primary-button' : 'disabled-button'
          ]"
        >
          <div class="flex flex-row">
            <Spinner v-if="uploading" class="mr-2" />
            {{ !uploading ? $t('artworks.add.form.post').toUpperCase() : $t('artworks.add.form.uploadingButton') }}
          </div>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import axios from 'axios'
import { useI18n } from 'vue-i18n'
import 'flowbite'
import Datepicker from '@themesberg/tailwind-datepicker/Datepicker'
import moment from 'moment'

// vue3-editor
import { VueEditor } from 'vue3-editor'

import vueFilePond from 'vue-filepond'

// filepond configuration
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'

import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'

// stores
import authStore from '@/stores/auth.store'

// components
import Spinner from '~/components/globals/Spinner.vue'
import Icon from '~/components/globals/Icon.vue'

/**
 * Vue FilePond
 */
const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview
)

const runtimeConfig = useRuntimeConfig()
const { t } = useI18n()
const auth = authStore()
const { $router } = useNuxtApp()
const apiUrl = runtimeConfig.public.apiUrl

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()

watch (() => $router.query, () => {
  resetForm()
})

onMounted (() => {
  if (!auth.loggedIn) {
    $router.push('/')
  }

  fetchSetting()

  /**
   * Init datepicker for artwork scheduled post purpose
   */
  const today = moment().add(1, 'day').format('DD/MM/yyyy')

  const datepickerEl = document.getElementById('publishDate')
  new Datepicker(datepickerEl, {
    autohide: true,
    todayHighlight: true,
    format: 'dd/mm/yyyy',
    minDate: today
  })
})

const resetForm = () => {
  artworkFiles.value = []
  tags.value = []
  inputData.value.isExplicit = false
}

// Fetch setting relate to artwork upload
const setting = useSetting(oApiConfiguration, fetchOptions())
const fetchSetting = async () => {
  const settingMaxFileCount = await setting.getSetting('artwork_max_uploads')
  maxFileCount.value = settingMaxFileCount

  const settingMaxFileSize = await setting.getSetting('artwork_max_file_size')
  maxFileSize.value = settingMaxFileSize

  labelIdleText.value = '<div class=\'text-xxs\'><div>Pick or drop up to ' + maxFileCount.value + ' files here</div><div>PNG, JPG up to ' + maxFileSize.value + 'MB</div></div>'
}

// 
const labelIdleText = ref('')
const artworkFiles = ref([])

const handleFilePondUpdateFile = (files) => {
  artworkFiles.value = files.map(files => files.file)
}

const formId = 'artwork-form'
const inputData = ref({
  title: '',
  description: '',
  tags: '',
  isExplicit: false,
  publishDate: null,
  publishTime: null
})

const tags = ref([])

const alert = ref({
  showFileTooBig: false
})

const maxFileSize = ref(5)
const maxFileCount = ref(1)
const uploading = ref(false)
const uploadSuccess = ref(false)
const uploadError = ref(false)
const uploadErrorMessage = ref('')
const storeArtwork = async () => {
  useValidator().validate(formId, t)

  alert.value.showFileTooBig = false

  // change publish date format
  const publishDateEl = document.getElementById('publishDate')
  let publishDate = null
  if (publishDateEl.value) {
    const newDateSplitted = publishDateEl.value.split('/')
    const formattedPublishDate = `${newDateSplitted[2]}-${newDateSplitted[1]}-${newDateSplitted[0]}`
    
    // publish time
    let publishTime = '00:00:00'
    if (inputData.value.publishTime) {
      publishTime = `${inputData.value.publishTime}:00`
    }

    publishDate = `${formattedPublishDate} ${publishTime}`
  }

  // collect picked tags and convert to acceptable API format
  const tagValues = []
  tags.value.forEach((tag) => {
    tagValues.push(tag.value)
  })

  // 
  const formData = new FormData()
  formData.append('title', inputData.value.title)
  formData.append('description', inputData.value.description)
  formData.append('tags', tagValues.toString())
  formData.append('is_explicit', inputData.value.isExplicit ? 1 : 0)
  formData.append('scheduled_post', 
    !['', null].includes(publishDate) ?? useDate().formatDateToApi(publishDate) !== 'Invalid Date' ? useDate().formatDateToApi(publishDate) : null
  )

  // check if size is exceeded max file size restriction
  for (let i = 0; i < artworkFiles.value.length; i++) {
    if (artworkFiles.value[i].size > (maxFileSize.value * 1000000)) {
      alert.value.showFileTooBig = true
    }

    if (!alert.value.showFileTooBig) {
      const file = artworkFiles.value[i]
      formData.append('files[]', file)

      // collect file orders, count start from 1
      formData.append('file_order[]', i)
    }
  }

  if (!alert.value.showFileTooBig) {
    // proceed to send data to API
    uploading.value = true
    uploadSuccess.value = false

    await axios.post(
      apiUrl + '/artworks/post',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${auth.a4ht0jen}`
        }
      }
    ).then(({ data }) => {
      if (data.success) {
        const workId = data.data.id

        uploadSuccess.value = true
        setTimeout(() => {
          $router.push('/a/'+workId)
        }, 1000)
      } else {
        showError()
      }
    }).catch((_) => {
      showError()
    })
  }

  uploading.value = false
}

const isError = ref(false)
const showError = () => {
  isError.value = true
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

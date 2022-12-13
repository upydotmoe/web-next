<template>
  <div>
    <!-- form title -->
    <div class="mb-4 section-title">
      {{ !redrawWorkId ? $t('artworks.add.form.title') : $t('artworks.add.form.titleRedraw') }}
    </div>

    <!-- redrawed artwork detail -->
    <div v-if="redrawWorkId" class="p-2 mb-4 rounded-md theme-color hover:theme-colored">
      <div>
        <div class="mb-2 section-title">{{ $t('artworks.originalArtwork') }}</div>

        <!-- Loading -->
        <div v-if="redrawedArtworkLoading" class="flex flex-row gap-2">
          <Spinner /> {{ $t('artworks.redrawOriginalLoading') }}
        </div>

        <!-- Redrawed artwork info -->
        <a
          v-else
          :href="'/a/'+redrawWorkId"
          target="_blank"
          class="flex flex-row gap-2"
        >
          <div
            v-if="redrawedArtwork.artwork_assets"
            class="w-1/4"
          >
            <!-- test --> <img
              preload
              loading="lazy"
              class="w-full rounded-md"
              :src="artworkThumb(redrawedArtwork.artwork_assets[0].bucket, redrawedArtwork.artwork_assets[0].filename, 'thumbnail', false)"
              @error="imageLoadError"
            />
          </div>

          <div class="flex flex-col gap-2 w-3/4">
            <span class="title">{{ redrawedArtwork.title }}</span>
            <p v-html="redrawedArtwork.description.length > 300 ? redrawedArtwork.description.slice(0, 300) + '..' : redrawedArtwork.description"/>
          </div>
        </a>
      </div>
    </div>

    <!-- error and alert message -->
    <div>
      <!-- messages -->
      <div v-if="uploadError" class="p-2 mb-2 w-full text-white bg-red-500 rounded-md">
        {{ uploadErrorMessage }}
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
            rules="required|max:100"
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
            @updatefiles="handleFilePondUpdateFile"
            :label-idle="labelIdleText"
            :max-files="redrawWorkId ? 1 : maxFileCount"
            :max-file-size="maxFileSize*1000000"
            :class="[
              'bg-transparent rounded-sm',
              { 'pointer-events-none cursor-not-allowed': uploading || uploadSuccess },
            ]"
            accepted-file-types="image/jpeg, image/png"
            allow-multiple="true"
            allow-drop="true"
            allow-reorder="true"
            allow-process="true"
            credits="false"
            name="files[]"
            instant-upload="false"
          />
        </client-only>
      </div>

      <div class="input-block">
        <client-only>
          <tags-input
            v-if="!initTagsLoading"
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
            :initial-value="!redrawWorkId && !initTagsLoading ? [] : initTags"
          />
        </client-only>
      </div>

      <!-- planned publish date -->
      <div
        v-show="!redrawWorkId"
        class="flex flex-row gap-x-2 input-block"
      >
        <div class="relative w-full">
          <div class="flex absolute left-1 top-3.5 items-center pl-2 pointer-events-none">
            <Icon :name="'i-ion-ios-calendar'" />
          </div>
          <input 
            id="publishDate" 
            type="text"
            class="block pl-10 mb-0 w-full form-input input"
            :placeholder="$t('artworks.add.form.publishDate')"
            autocomplete="off"
          >
        </div>
        
        <!-- publish time -->
        <input v-model="inputData.publishTime" type="time" class="mb-0 form-input input">
      </div>
      
      <!-- explicit toggler -->
      <div :class="[
        'grid gap-2 grid-cols-1 input-block md:grid-cols-3',
      ]">
        <!-- explicit toggler -->
        <div
          @click.prevent="toggleExplicit()"
          :class="[
            'toggler-box',
            { 'toggler-box__active': inputData.isExplicit }
          ]"
        >
          <div class="toggler-box__icons">
            <Icon v-if="!inputData.isExplicit" :name="'i-fluent-checkbox-unchecked-20-regular'" />
            <Icon v-else :name="'i-ic-outline-check'" class="text-green-500" />
          </div>

          <div class="toggler-box__description">
            <b>{{ $t('explicitContent') }}</b>
            <span>
              Check this if your work contain explicit content (explicit art wihout explicit mark will be forcibly taken down)
            </span>
          </div>
        </div>

        <!-- explicit+gore toggler -->
        <div
          v-if="inputData.isExplicit"
          @click.prevent="inputData.isGore = !inputData.isGore"
          :class="[
            'toggler-box',
            { 'toggler-box__active': inputData.isGore }
          ]"
        >
          <div class="toggler-box__icons">
            <Icon v-if="!inputData.isGore" :name="'i-fluent-checkbox-unchecked-20-regular'" />
            <Icon v-else :name="'i-ic-outline-check'" class="text-green-500" />
          </div>

          <div class="toggler-box__description">
            <b>Contain Gore</b>
            <span>
              Check this if your work contain blood, etc.
            </span>
          </div>
        </div>
      </div>

      <!-- additional option toggler -->
      <div class="grid grid-cols-1 gap-2 md:grid-cols-3 input-block">
        <!-- original character toggler -->
        <div
          v-if="!redrawWorkId"
          @click.prevent="inputData.isOriginalCharacter = !inputData.isOriginalCharacter"
          :class="[
            'toggler-box',
            { 'toggler-box__active': inputData.isOriginalCharacter }
          ]"
        >
          <div class="toggler-box__icons">
            <Icon v-if="!inputData.isOriginalCharacter" :name="'i-fluent-checkbox-unchecked-20-regular'" />
            <Icon v-else :name="'i-ic-outline-check'" class="text-green-500" />
          </div>

          <div class="toggler-box__description">
            <b>{{ $t('artworks.originalCharacter') }}</b>
            <span>
              Check this if the character in your work is your original character made by you (don't check this if the character is someone else's or a character from animation series)
            </span>
          </div>
        </div>

        <!-- original character toggler -->
        <div
          v-if="!redrawWorkId"
          @click.prevent="inputData.isAllowRedraw = !inputData.isAllowRedraw"
          :class="[
            'toggler-box',
            { 'toggler-box__active': inputData.isAllowRedraw }
          ]"
        >
          <div class="toggler-box__icons">
            <Icon v-if="!inputData.isAllowRedraw" :name="'i-fluent-checkbox-unchecked-20-regular'" />
            <Icon v-else :name="'i-ic-outline-check'" class="text-green-500" />
          </div>

          <div class="toggler-box__description">
            <b>{{ $t('artworks.add.form.allowRedraw') }}</b>
            <span>
              Check this if you allow other artist to redraw your artwork
            </span>
          </div>
        </div>

        <!-- redraw in my style toggler -->
        <div
          v-if="redrawWorkId"
          @click.prevent="inputData.isredrawInMyStyle = !inputData.isredrawInMyStyle"
          :class="[
            'toggler-box',
            { 'toggler-box__active': inputData.isredrawInMyStyle }
          ]"
        >
          <div class="toggler-box__icons">
            <Icon v-if="!inputData.isredrawInMyStyle" :name="'i-fluent-checkbox-unchecked-20-regular'" />
            <Icon v-else :name="'i-ic-outline-check'" class="text-green-500" />
          </div>

          <div class="toggler-box__description">
            <b>{{ $t('artworks.add.form.redrawInMyStyle') }}</b>
            <span>
              Check this if you redraw the art with your own drawing style.
            </span>
          </div>
        </div>
      </div>

      <div class="flex flex-row justify-between md:justify-end">
        <button class="mr-2 w-full reset-form-button md:w-auto" type="reset" @click="resetForm()">Reset</button>
        <button
          type="submit"
          :class="[
            'float-right w-full md:w-auto',
            { 'pointer-events-none cursor-not-allowed': uploading || uploadSuccess }, 
            inputData.title && artworkFiles.length > 0 ? 'primary-button' : 'disabled-button'
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
import 'flowbite'
import Datepicker from '@themesberg/tailwind-datepicker/Datepicker'
import moment from 'moment'
import { useI18n } from 'vue-i18n'

// vue3-editor
import { VueEditor } from 'vue3-editor'

import vueFilePond from 'vue-filepond'

// filepond configuration
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'

import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'

// stores
import useAuthStore from '@/stores/auth.store'

// components
import Icon from '~/components/globals/Icon.vue'
import Spinner from '~/components/globals/Spinner.vue'

/**
 * Vue FilePond
 */
const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginFileValidateSize,
  FilePondPluginImagePreview
)

// stores
const auth = useAuthStore()

const { t } = useI18n()
const runtimeConfig = useRuntimeConfig()
const apiUrl = runtimeConfig.public.apiUrl

const route = useRoute()
const { $router } = useNuxtApp()

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const artworkApi = useArtwork(oApiConfiguration, fetchOptions())

watch (() => $router.query, () => {
  resetForm()
})

const redrawWorkId = computed(() => route.query.redrawWorkId)

onMounted (() => {
  if (!auth.loggedIn) {
    $router.push('/')
  }

  fetchSetting()

  if (redrawWorkId.value) {
    fetchRedrawedArtworkInfo()
  } else {
    initTagsLoading.value = false
  }

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
const settingApi = useSetting(oApiConfiguration, fetchOptions())
const fetchSetting = async () => {
  // get allowed max file count to upload
  if (!redrawWorkId.value) {
    let settingMaxFileCount = 1
    
    if (auth.i502p00r0) {
      settingMaxFileCount = await settingApi.getSetting('artwork_max_uploads_pro')
    } else {
      settingMaxFileCount = await settingApi.getSetting('artwork_max_uploads')
    }
    
    maxFileCount.value = settingMaxFileCount
  }

  const settingMaxFileSize = await settingApi.getSetting('artwork_max_file_size')
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
  isGore: false,
  isOriginalCharacter: false,
  isAllowRedraw: false,
  isredrawInMyStyle: false,
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

  // reset related state before re/attemping to upload the artwork
  reset()

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
  formData.append('is_gore', inputData.value.isGore ? 1 : 0)
  formData.append('is_original_character', inputData.value.isOriginalCharacter ? 1 : 0)
  formData.append('allow_redraw', inputData.value.isAllowRedraw ? 1 : 0)
  formData.append('redraw_in_your_style', inputData.value.isredrawInMyStyle ? 1 : 0)
  if (redrawWorkId.value) {
    formData.append('redraw_of', redrawWorkId.value)
  }
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

const toggleExplicit = () => {
  inputData.value.isExplicit = !inputData.value.isExplicit
  inputData.value.isGore = false
}

const reset = () => {
  isError.value = false
  uploading.value = false
  uploadSuccess.value = false
  uploadError.value = false
  uploadErrorMessage.value = ''
}

const redrawedArtwork = ref({})
const redrawedArtworkLoading = ref(true)

const initTagsLoading = ref(true)
const initTags = ref([])

const fetchRedrawedArtworkInfo = async () => {
  redrawedArtworkLoading.value = true
  initTagsLoading.value = true

  const [data, error] = await artworkApi.getWorkById(redrawWorkId.value)
  
  if (error) {
    // todo: handle error
  } else {
    redrawedArtwork.value = data

    // apply tag filter if artwork has tags
    if (data.artwork_has_tags.length) {
      const originalArtworkTags = data.artwork_has_tags

      originalArtworkTags.forEach(({ artwork_tags: tag }) => {
        initTags.value.push({
          key: tag.id,
          value: tag.tag
        })
      })

      tags.value = initTags.value
    }
  }

  redrawedArtworkLoading.value = false
  initTagsLoading.value = false
}
</script>

<style lang="scss" scoped>
.toggler-box {
  @apply flex flex-row gap-4 md:gap-2 p-4 rounded-md cursor-pointer theme-color;

  &__active {
    @apply border-2 border-green-400;
  }

  &__icons {
    @apply w-1/12;
  }

  &__description {
    @apply flex flex-col gap-1 w-full;

    span {
      @apply text-color-secondary;
    }
  }
}
</style>
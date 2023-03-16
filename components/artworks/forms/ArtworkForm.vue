<template>
  <div>
    <section
      v-if="!isArtTrade"
      id="guidelines"
      class="p-4 mb-6 w-full rounded-md theme-color"
    >
      <div
        class="flex flex-row justify-between w-full cursor-pointer"
        @click="showContentGuidelines = !showContentGuidelines"
      >
        <h2 class="title-tiny">
          {{ $t('guidelines.title') }}
        </h2>

        <Icon :name="'i-material-symbols-keyboard-arrow-down'" />
      </div>

      <div
        v-if="showContentGuidelines"
        class="guidelines"
        v-html="$t('guidelines.content')"
      />
    </section>

    <!--  -->
    <section id="artwork-form">
      <h2
        v-if="!isArtTrade && !isUpdate"
        class="title"
      >
        {{ !redrawWorkId ? $t('artworks.add.form.title') : $t('artworks.add.form.titleRedraw') }}
      </h2>

      <div
        v-if="isUpdate"
        class="mb-4 text-base font-bold"
      >
        {{ $t('artworks.update.form.title') }} 
        <span class="text-xs italic font-bold href">
          <nuxt-link :to="'/a/'+id">
            (ID: {{ id }})
          </nuxt-link>
        </span>
      </div>

      <!-- redrawed artwork detail -->
      <section 
        v-if="!isUpdate && redrawWorkId"
        id="redrawed-artwork-info"
        class="p-2 mb-4 rounded-md theme-color hover:theme-colored"
      >
        <div>
          <div class="mb-2 title-tiny">
            {{ $t('artworks.originalArtwork') }}
          </div>

          <!-- Loading -->
          <div
            v-if="redrawedArtworkLoading"
            class="flex flex-row gap-2"
          >
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
              class="w-1/5"
            >
              <nuxt-img
                preload
                loading="lazy"
                class="w-full rounded-md"
                :src="artworkThumb(redrawedArtwork.artwork_assets[0].bucket, redrawedArtwork.artwork_assets[0].filename, 'thumbnail', false)"
                @error="imageLoadError"
              />
            </div>

            <div class="flex flex-col gap-2 w-3/4">
              <span class="title-tiny">{{ redrawedArtwork.title }}</span>
              <p v-html="redrawedArtwork.description.length > 300 ? redrawedArtwork.description.slice(0, 300) + '..' : redrawedArtwork.description" />
            </div>
          </a>
        </div>
      </section>

      <form
        v-if="isUpdate ? !isErrorFetching : true"
        :id="formId"
        enctype="multipart/form-data"
        @submit.prevent="!isUpdate ? storeArtwork() : update()"
      >
        <ErrorMessage
          :is-loading="saving"
          :loading-message="$t('artworks.add.form.uploading')"
          :is-error="uploadError"
          :error-message="uploadErrorMessage"
          :is-success="saved"
          :success-message="
            isArtTrade ?
              `${$t('artTrades.form.artwork.uploaded')}` :
              !isUpdate ?
                `${$t('artworks.add.form.uploadSuccess')} ${$t('artworks.add.form.successRedirect')}` :
                `${$t('artworks.update.form.updated')} ${$t('artworks.update.form.successRedirect')}`
          "
        />
        
        <n-validate 
          for="title"
          :name="$t('title')" 
        >
          <input 
            v-model="inputData.title"
            type="text"
            rules="required|max:100"
            :class="[
              { 'pointer-events-none cursor-not-allowed': saving || saved }
            ]"
            :placeholder="$t('title')"
          >
        </n-validate>

        <!-- description -->
        <n-validate>
          <VueEditor
            v-model="inputData.description"
            :editor-toolbar="quillOptions"
            :class="[
              { 'pointer-events-none cursor-not-allowed': saving || saved }
            ]"
            :placeholder="$t('description')"
          />
        </n-validate>

        <n-validate v-if="!isUpdate">
          <div
            v-show="alert.showFileTooBig"
            class="p-2 text-xs text-white bg-red-400 rounded-md shadow-md"
          >
            {{ $t('artworks.add.form.fileTooBig', { maxFileSize: `${maxFileSize}MB` }) }}
          </div>

          <client-only>
            <file-pond
              ref="pond"
              :label-idle="labelIdleText"
              :max-files="isArtTrade && redrawWorkId ? 1 : maxFileCount"
              :max-file-size="maxFileSize*1000000"
              :class="[
                'bg-transparent rounded-sm',
                { 'pointer-events-none cursor-not-allowed': saving || saved },
              ]"
              accepted-file-types="image/jpeg, image/jpg, image/png"
              allow-multiple="true"
              allow-drop="true"
              allow-reorder="true"
              allow-process="true"
              credits="false"
              name="files[]"
              instant-upload="false"
              @updatefiles="handleFilePondUpdateFile"
            />
          </client-only>
        </n-validate>

        <n-validate>
          <tags-input
            v-if="!isUpdate ? !initTagsLoading : true"
            v-model="tags"
            :placeholder="$t('tagsInputPlaceholder')"
            :typeahead="true"
            :typeahead-style="'dropdown'"
            :typeahead-activation-threshold="2"
            :typeahead-show-on-focus="true"
            :typeahead-hide-discard="true"
            :typeahead-url="apiUrl+'/artworks/tags/search?keyword=:search'"
            :add-tags-on-comma="true"
            :class="{ 'pointer-events-none cursor-not-allowed': saving || saved }"
            :initial-value="!redrawWorkId && !initTagsLoading ? [] : initTags"
          />
        </n-validate>

        <!-- planned publish date -->
        <n-validate
          v-if="!isUpdate && !isArtTrade && !redrawWorkId"
          class="flex flex-row gap-x-2"
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
          <input
            v-model="inputData.publishTime"
            type="time"
            class="mb-0 form-input input"
          >
        </n-validate>
      
        <!-- explicit toggler -->
        <section
          id="explicit-properties"
          class="grid grid-cols-1 gap-2 md:grid-cols-2"
        >
          <!-- explicit toggler -->
          <div
            :class="[
              'toggler-box',
              { 'toggler-box__active': inputData.isExplicit }
            ]"
            @click.prevent="toggleExplicit()"
          >
            <div class="toggler-box__icons">
              <Icon
                v-if="!inputData.isExplicit"
                :name="'i-fluent-checkbox-unchecked-20-regular'"
              />
              <Icon
                v-else
                :name="'i-ic-outline-check'"
                class="text-green-500"
              />
            </div>

            <div class="toggler-box__description">
              <b>{{ $t('containExplicit') }}</b>
              <span>
                {{ $t('artworks.form.options.explicitMark') }}
              </span>
            </div>
          </div>

          <!-- explicit+gore toggler -->
          <div
            v-if="inputData.isExplicit"
            :class="[
              'toggler-box',
              { 'toggler-box__active': inputData.isGore }
            ]"
            @click.prevent="inputData.isGore = !inputData.isGore"
          >
            <div class="toggler-box__icons">
              <Icon
                v-if="!inputData.isGore"
                :name="'i-fluent-checkbox-unchecked-20-regular'"
              />
              <Icon
                v-else
                :name="'i-ic-outline-check'"
                class="text-green-500"
              />
            </div>

            <div class="toggler-box__description">
              <b>{{ $t('containGore') }}</b>
              <span>
                {{ $t('artworks.form.options.goreMark') }}
              </span>
            </div>
          </div>
        </section>

        <!-- additional option toggler -->
        <section
          id="additional-properties"
          :class="[
            'grid grid-cols-1 gap-2',
            redrawWorkId ? 'md:grid-cols-1' : 'md:grid-cols-2'
          ]"
        >
          <!-- original character toggler -->
          <div
            v-if="!redrawWorkId && !isArtTrade && !isARedraw"
            :class="[
              'toggler-box',
              { 'toggler-box__active': inputData.isOriginalCharacter }
            ]"
            @click.prevent="inputData.isOriginalCharacter = !inputData.isOriginalCharacter"
          >
            <div class="toggler-box__icons">
              <Icon
                v-if="!inputData.isOriginalCharacter"
                :name="'i-fluent-checkbox-unchecked-20-regular'"
              />
              <Icon
                v-else
                :name="'i-ic-outline-check'"
                class="text-green-500"
              />
            </div>

            <div class="toggler-box__description">
              <b>{{ $t('artworks.originalCharacter') }}</b>
              <span>
                {{ $t('artworks.form.options.originalCharacterMark') }}
              </span>
            </div>
          </div>

          <!-- original character toggler -->
          <div
            v-if="!redrawWorkId && !isARedraw"
            :class="[
              'toggler-box',
              { 'toggler-box__active': inputData.isAllowRedraw }
            ]"
            @click.prevent="inputData.isAllowRedraw = !inputData.isAllowRedraw"
          >
            <div class="toggler-box__icons">
              <Icon
                v-if="!inputData.isAllowRedraw"
                :name="'i-fluent-checkbox-unchecked-20-regular'"
              />
              <Icon
                v-else
                :name="'i-ic-outline-check'"
                class="text-green-500"
              />
            </div>

            <div class="toggler-box__description">
              <b>{{ $t('artworks.add.form.allowRedraw') }}</b>
              <span>
                {{ $t('artworks.form.options.allowRedrawMark') }}
              </span>
            </div>
          </div>

          <!-- redraw in my style toggler -->
          <div
            v-if="redrawWorkId || isARedraw"
            :class="[
              'toggler-box',
              { 'toggler-box__active': inputData.isRedrawInMyStyle }
            ]"
            @click.prevent="inputData.isRedrawInMyStyle = !inputData.isRedrawInMyStyle"
          >
            <div class="toggler-box__icons">
              <Icon
                v-if="!inputData.isRedrawInMyStyle"
                :name="'i-fluent-checkbox-unchecked-20-regular'"
              />
              <Icon
                v-else
                :name="'i-ic-outline-check'"
                class="text-green-500"
              />
            </div>

            <div class="toggler-box__description">
              <b>{{ $t('artworks.add.form.redrawInMyStyle') }}</b>
              <span>
                {{ $t('artworks.form.options.allowRedrawMark') }}
              </span>
            </div>
          </div>
        </section>

        <div
          v-if="!isUpdate"
          class="mt-4 mb-2"
        >
          <label class="flex flex-row gap-2">
            <input
              v-model="aggreementAccepted"
              type="checkbox"
            > 
            <span>
              I have read the <a
                href="/tos"
                class="href"
                target="_blank"
              >{{ $t('terms') }}</a>, <a
                href="/community-guidelines"
                class="href"
                target="_blank"
              >{{ $t('guidelines.title') }}</a> and this is not AI-generated image.
            </span>
          </label>
        </div>

        <div class="buttons">
          <button
            type="reset"
            class="reset"
            @click="resetForm()"
          >
            {{ $t('reset') }}
          </button>
          <button
            :class="[
              'submit',
              { 'pointer-events-none cursor-not-allowed': saving || saved },
              { '!disabled-button': !inputData.title.length },
              { '!disabled-button': !isUpdate && !aggreementAccepted },
              { '!disabled-button': !isUpdate && !artworkFiles.length },
            ]"
          >
            <div class="flex flex-row">
              <Spinner
                v-if="saving"
                class="mr-2"
              />
              {{ 
                !saving ? 
                  (!isUpdate ? $t('artworks.add.form.post').toUpperCase() : $t('save')) :
                  (!isUpdate ? $t('artworks.add.form.uploadingButton') : $t('saving'))
              }}
            </div>
          </button>
        </div>
      </form>
    </section>
  </div>
</template>

<script setup>
import axios from 'axios'
import 'flowbite'
import moment from 'moment'
import { useI18n } from 'vue-i18n'
import { VueEditor } from 'vue3-editor'
import vueFilePond from 'vue-filepond'
import { quillOptions } from '~/utils/constants/text-editor'
import Datepicker from '@themesberg/tailwind-datepicker/Datepicker'

// filepond
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
import ErrorMessage from '~/components/auth/forms/ErrorMessage.vue'

// vue filepond (file picker)
let FilePond = null
if (!props.isUpdate) {
  FilePond = vueFilePond(
    FilePondPluginFileValidateType,
    FilePondPluginFileValidateSize,
    FilePondPluginImagePreview
  )
}

// stores
const auth = useAuthStore()

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const artworkApi = useArtwork(oApiConfiguration, fetchOptions())

definePageMeta ({
  keepalive: false
})

const emit = defineEmits(['sendUploadedWorkId'])
const props = defineProps({
  id: {
    type: String,
    default: ''
  },
  isArtTrade: {
    type: Boolean,
    default: false
  },
  isUpdate: {
    type: Boolean,
    default: false
  }
})

const { t } = useI18n()
const runtimeConfig = useRuntimeConfig()
const apiUrl = runtimeConfig.public.apiUrl

const route = useRoute()
const router = useRouter()

const showContentGuidelines = ref(false)

const redrawWorkId = computed(() => route.query.redrawWorkId)

onMounted (() => {
  if (!auth.loggedIn) {
    router.push('/')
  }

  if (!props.isUpdate) {
    fetchSetting()
    initTagsLoading.value = false

    if (redrawWorkId.value) {
      fetchRedrawedArtworkInfo()
    }

    if (!redrawWorkId.value && !props.isArtTrade) {
      // datepicker plugin
      const today = moment().add(1, 'day').format('DD/MM/yyyy')

      const datepickerEl = document.getElementById('publishDate')
      new Datepicker(datepickerEl, {
        autohide: true,
        todayHighlight: true,
        format: 'dd/mm/yyyy',
        minDate: today
      })
    }
  } else {
    fetchWorkInfo()
  }
})

watch (() => router.query, () => {
  resetForm()
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
  if (!props.isArtTrade && !redrawWorkId.value) {
    let settingMaxFileCount = 1
    
    if (auth.i502p00r0) {
      const [maxFileCount, error] = await settingApi.getSetting('artwork_max_uploads_pro')
      settingMaxFileCount = maxFileCount
    } else {
      const [maxFileCount, error] = await settingApi.getSetting('artwork_max_uploads')
      settingMaxFileCount = maxFileCount
    }
    
    maxFileCount.value = settingMaxFileCount
  }

  if (auth.i502p00r0) {
    const [settingMaxFileSize, getSettingMaxFileSizeError] = await settingApi.getSetting('artwork_max_file_size_pro')
    maxFileSize.value = settingMaxFileSize
  } else {
    const [settingMaxFileSize, getSettingMaxFileSizeError] = await settingApi.getSetting('artwork_max_file_size')
    maxFileSize.value = settingMaxFileSize
  }

  labelIdleText.value = '<div class=\'text-xxs\'><div>Pick or drop up to ' + maxFileCount.value + ' files here</div><div>PNG, JPEG/JPG format up to ' + maxFileSize.value + 'MB</div></div>'
}

// if it's update form, fetch current artwork detail
const isARedraw = ref(false)
const fetchWorkInfo = async () => {
  const [data, error] = await artworkApi.getWorkById(props.id)

  if (error) {
    isErrorFetching.value = true
  } else {
    isARedraw.value = data.redraw_of

    inputData.value = {
      title: data.title,
      description: data.description.split('<br><br>').join(' \n').split('<br>').join(''),
      isExplicit: !!data.is_explicit,
      isGore: !!data.is_gore,
      isOriginalCharacter: !!data.is_original_character,
      isAllowRedraw: !!data.allow_redraw,
      isRedrawInMyStyle: !!data.redraw_in_your_style
    }

    data.artwork_has_tags.forEach((tag) => {
      tags.value.push({
        key: tag.artwork_tags.id,
        value: tag.artwork_tags.tag
      })
    })
  }
}

// 
const labelIdleText = ref('')
const artworkFiles = ref([])

const handleFilePondUpdateFile = (files) => {
  artworkFiles.value = files.map(files => files.file)
  console.log(artworkFiles.value)
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
  isRedrawInMyStyle: false,
  publishDate: null,
  publishTime: null
})

const aggreementAccepted = ref(false)

const tags = ref([])

const alert = ref({
  showFileTooBig: false
})

const maxFileSize = ref(5)
const maxFileCount = ref(1)
const saving = ref(false)
const saved = ref(false)
const uploadError = ref(false)
const uploadErrorMessage = ref('')
const storeArtwork = async () => {
  useValidator().validate(formId, t)

  // reset related state before re/attemping to upload the artwork
  reset()

  // init publish date only if it's a new artwork (not a redraw)
  let publishDate = null
  if (!redrawWorkId.value && !props.isArtTrade) {
    // change publish date format
    const publishDateEl = document.getElementById('publishDate')
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
  formData.append('redraw_in_your_style', inputData.value.isRedrawInMyStyle ? 1 : 0)
  formData.append('is_before_after', 0)
  if (redrawWorkId.value) {
    formData.append('redraw_of', redrawWorkId.value)
  }
  if (!redrawWorkId.value) {
    formData.append('scheduled_post', 
      !['', null].includes(publishDate) ?? 
        useDate().formatDateToApi(publishDate) !== 'Invalid Date' ? 
          useDate().formatDateToApi(publishDate) : 
          null
    )
  }

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
    saving.value = true
    saved.value = false

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

        saved.value = true

        if (props.isArtTrade) {
          emit('sendUploadedWorkId', workId)
        } else {
          setTimeout(() => {
            router.push('/a/'+workId)
          }, 1000)
        }
      } else {
        showError()
      }
    }).catch((_) => {
      showError()
    })
  }

  saving.value = false
}

const update = async () => {
  useValidator().validate(formId, t)

  reset()

  // collect picked tags and convert to acceptable API format
  const tagValues = []
  tags.value.forEach((tag) => {
    tagValues.push(tag.value)
  })

  const [success, error] = await artworkApi.updateInfo({
    id: props.id,
    title: inputData.value.title,
    description: inputData.value.description,
    isExplicit: inputData.value.isExplicit,
    isGore: inputData.value.isGore,
    tags: tagValues.toString(),
    isOriginalCharacter: inputData.value.isOriginalCharacter,
    allowRedraw: inputData.value.isAllowRedraw,
    redrawInYourStyle: inputData.value.isRedrawInMyStyle,
  })

  if (error) {
    showError()
  } else {
    saved.value = true
    setTimeout(() => {
      router.push({
        path: `/a/${props.id}`,
        replace: true
      })
    }, 1000)
  }

  saving.value = false
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
  saving.value = false
  saved.value = false
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
@import '~/assets/css/tailwind.scss';
@import 'https://unpkg.com/flowbite@1.4.5/dist/flowbite.min.css';
@import '~/assets/css/artworks/form.scss';
</style>
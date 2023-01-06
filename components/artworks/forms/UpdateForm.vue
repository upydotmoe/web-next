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

    <div
      v-show="isErrorFetching"
      class="alert-danger"
    >
      {{ $t('artworks.update.form.fetchFailure') }}
    </div>
    
    <div
      v-show="updated"
      class="alert-success"
    >
      {{ $t('artworks.update.form.updated') }}
      <span class="italic">{{ $t('artworks.update.form.successRedirect') }}</span>
    </div>

    <div
      v-show="saving"
      class="flex flex-row p-2 mb-6 text-white rounded-md button-color"
    >
      <Spinner class="mr-1" />
      {{ $t('saving') }}
    </div>

    <div
      v-show="isError"
      class="alert-danger"
    >
      {{ $t('artworks.add.form.uploadFailure') }}
    </div>

    <form
      v-show="!isErrorFetching"
      enctype="multipart/form-data"
      @submit.prevent="update"
    >
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
          :editor-toolbar="quillOptions"
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

      <!-- explicit toggler -->
      <div class="grid grid-cols-1 gap-2 input-block md:grid-cols-3">
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
            <b>{{ $t('explicitContent') }}</b>
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
            <b>Contain Gore</b>
            <span>
              {{ $t('artworks.form.options.goreMark') }}
            </span>
          </div>
        </div>
      </div><!-- additional option toggler -->
      <div class="grid grid-cols-1 gap-2 md:grid-cols-3 input-block">
        <!-- original character toggler -->
        <div
          v-if="!currentInfo.redraw_of"
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
          v-if="!currentInfo.redraw_of"
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
          v-if="currentInfo.redraw_of"
          :class="[
            'toggler-box',
            { 'toggler-box__active': inputData.isredrawInMyStyle }
          ]"
          @click.prevent="inputData.isredrawInMyStyle = !inputData.isredrawInMyStyle"
        >
          <div class="toggler-box__icons">
            <Icon
              v-if="!inputData.isredrawInMyStyle"
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
              {{ $t('artworks.form.options.redrawOwnStyleMark') }}
            </span>
          </div>
        </div>
      </div>

      <button
        class="float-right primary-button"
        :class="{ 'pointer-events-none cursor-not-allowed': saving || updated }"
      >
        <div class="flex flex-row">
          <Spinner
            v-if="saving"
            class="mr-1"
          />
          {{ !saving ? $t('save') : $t('saving') }}
        </div>
      </button>
    </form>
  </div>
</template>

<script setup>
import { VueEditor } from 'vue3-editor'
import { quillOptions } from '~/utils/constants/text-editor'

// stores
import useAuthStore from '@/stores/auth.store'

// components
import Spinner from '~/components/globals/Spinner.vue'
import Icon from '~/components/globals/Icon.vue'

// stores
const auth = useAuthStore()

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const artworkApi = useArtwork(oApiConfiguration, fetchOptions())

const props = defineProps({
  id: {
    type: String,
    default: ''
  }
})

const { $router } = useNuxtApp()
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
    inputData.value.isGore = !!data.is_gore
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
  isGore: false,
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
      isGore: inputData.value.isGore,
      tags: tagValues.toString(),
      isOriginalCharacter: inputData.value.isOriginalCharacter,
      allowRedraw: inputData.value.isAllowRedraw,
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

const toggleExplicit = () => {
  inputData.value.isExplicit = !inputData.value.isExplicit
  inputData.value.isGore = false
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/tailwind.scss';
@import '~/assets/css/artworks/form.scss';
</style>
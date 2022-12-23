<template>
  <div>
    <div class="mb-4 section-title">
      {{ $t('feeds.form.title') }}
    </div>
    
    <div v-show="posted" class="alert-success">
      {{ $t('feeds.form.posted') }}
      <span class="italic">{{ $t('feeds.form.successRedirect') }}</span>
    </div>

    <div v-show="posting" class="flex flex-row p-2 mb-2 text-white rounded-md button-color">
      <Spinner class="mr-2" />
      {{ $t('feeds.form.postingYourUpdate') }}
    </div>

    <div v-show="isError" class="alert-danger">
      {{ $t('feeds.form.postFailure') }}
    </div>

    <!-- feed text input -->
    <VueEditor
      v-model="feedInput"
      :editorToolbar="quillOptions"
      :class="[
        'mb-4'
      ]"
      :placeholder="$t('typeSomething')"
    />

    <!-- <textarea
      v-model="feedInput"
      class="input form-input"
      :placeholder="$t('typeSomething')"
      cols="30"
      rows="5"
      data-gramm="false"
      maxlength="2000"
    /> -->

    <div class="flex flex-row justify-between md:justify-end">
      <button class="mr-2 w-full reset-form-button md:w-auto" type="reset" @click="feedInput = ''">Reset</button>
      <button 
        class="flex flex-row w-full md:w-auto" 
        :class="[feedInput !== '' ? 'primary-button' : 'disabled-button']"
        @click.prevent="feedInput !== '' ? postFeed() : null"
      >
        <Spinner v-show="posting" class="mr-2" />
        <span>{{ posting ? $t('posting') : $t('post').toUpperCase() }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { VueEditor } from 'vue3-editor'
import { quillOptions } from '~/utils/constants/text-editor'

// components
import Spinner from '~/components/globals/Spinner.vue'

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const feedApi = useFeed(oApiConfiguration, fetchOptions())

const { $router } = useNuxtApp()

const feedInput = ref('')
const posting = ref(false)
const posted = ref(false)
const isError = ref(false)
const postFeed = async () => {
  posting.value = true

  const [success, data, error] = await feedApi.postFeed({
    text: feedInput.value
  })

  if (success) {
    posting.value = false
    posted.value = true
    
    const feedId = data.id
    setTimeout(() => {
      $router.push(`/feed/${feedId}`)
    }, 1000)
  } else {
    isError.value = true
    posting.value = false
  }

  posting.value = false
}
</script>

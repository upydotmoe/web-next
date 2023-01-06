<template>
  <section
    id="cover"
    class="mb-4"
  >
    <label class="title-tiny">
      {{ $t('profile.forms.update.cover') }}
    </label>

    <form>
      <img 
        v-if="!previewNewCover"
        :src="avatarCoverUrl(auth.user.cover_bucket, auth.user.cover_filename)" 
        class="object-cover object-top w-full h-28 rounded-md md:h-48 lg:h-64 xl:h-72 unselectable"
        @error="defaultCoverImage"
      >
        
      <!-- display selected file everytime the user selected new file -->
      <img 
        v-if="previewNewCover"
        :src="previewNewCover"
        class="object-cover object-top w-full h-28 rounded-md md:h-48 lg:h-64 xl:h-72 unselectable"
        :class="coverFileTooLargeAlert || updateCoverError ? 'border-2 border-red-400' : 'border-none'"
      >
        
      <!-- cover file input -->
      <input
        id="inputCoverFile"
        ref="selectedNewCoverRef"
        type="file"
        accept="image/png, image/gif, image/jpeg"
        class="hidden"
        @change="previewCover"
      >

      <div class="!flex-col buttons">
        <button
          id="selectNewCoverButton" 
          class="w-full light-bordered-button"
          @click.prevent="selectNewCoverButton()" 
        >
          {{ $t('profile.forms.update.chooseNewCover') }}
        </button>
        
        <button 
          class="submit"
          :class="[
            { '!disabled-button !cursor-not-allowed': !selectedNewCoverFile },
            { '!disabled-button !cursor-not-allowed': changingCoverLoading },
          ]"
          @click.prevent="selectNewCoverButton && !changingCoverLoading ? updateCover() : null"
        >
          <Spinner v-if="changingCoverLoading" />
          {{ changingCoverLoading ? $t('updating') : $t('update') }}
        </button>
      </div>

      <!-- if selected file size is larger than accepted size -->
      <div
        v-if="coverFileTooLargeAlert"
        class="mt-2 w-full text-center text-failure"
      >
        {{ $t('profile.forms.update.fileTooLarge') }}
        <br>
        {{ $t('profile.forms.update.coverMaxAllowedFileSize') }}
      </div>

      <div
        v-if="updateCoverError != ''"
        class="mt-2 w-full text-center text-failure"
      >
        {{ updateCoverError }}
      </div>
    </form>
    
    <SuccessMessageModal
      id="change-cover-success-modal"
      :modal-id="'change-cover-success-modal'"
      class="modal"
      :message="$t('profile.forms.update.coverChanged')"
    />
  </section>
</template>

<script setup>
import axios from 'axios'

// stores
import useAuthStore from '@/stores/auth.store'

// components
import Spinner from '~/components/globals/Spinner.vue'
import SuccessMessageModal from '~/components/globals/SuccessMessageModal.vue'

// stores
const auth = useAuthStore()

const { apiUrl } = useRuntimeConfig()

const selectNewCoverButton = () => {
  const inputCoverFileEl = document.getElementById('inputCoverFile')
  inputCoverFileEl.click()
}

// preview selected cover
const selectedNewCoverFile = ref('')
const previewNewCover = ref('')
const previewCover = (e) => {
  const file = e.target.files[0]
  previewNewCover.value = URL.createObjectURL(file)
  selectedNewCoverFile.value = file
}

const changingCoverLoading = ref(false)
const coverChanged = ref(false)
const coverFileTooLargeAlert = ref(false)
const selectedNewCoverRef = ref(null)
const updateCoverError = ref('')
const updateCover = async () => {
  if (selectedNewCoverFile.value) {
    coverChanged.value = false
    changingCoverLoading.value = true
    coverFileTooLargeAlert.value = false
    updateCoverError.value = ''

    // get file
    const file = selectedNewCoverFile.value

    // prepare to upload
    const coverFormData = new FormData()
    coverFormData.append('cover', file)

    try {
      const response = await axios.post(
        apiUrl + '/user/update/cover',
        coverFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${auth.a4ht0jen}`
          }
        }
      )

      coverChanged.value = true
      useModal().openModal('change-cover-success-modal')
    } catch (error) {
      const errorResponse = error.response

      if (errorResponse.data.error === 'File too large') {
        coverFileTooLargeAlert.value = true
      } else {
        updateCoverError.value = errorResponse.data.message
      }
    }

    changingCoverLoading.value = false
  } else {
    // todo
  }
}
</script>
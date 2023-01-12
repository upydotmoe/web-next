<template>
  <section
    id="avatar"
    class="mb-4 w-full md:w-44"
  >
    <label class="title-tiny">
      {{ $t('profile.forms.update.avatar') }}
    </label>

    <form>
      <!-- show current avatar when user doesn't pick new avatar file yet -->
      <img
        v-if="!previewNewAvatar"
        :src="avatarCoverUrl(auth.user.avatar_bucket, auth.user.avatar_filename)"
        class="avatar"
        @error="defaultCoverImage"
      >

      <!-- display selected file everytime the user selected new file -->
      <img
        v-if="previewNewAvatar"
        :src="previewNewAvatar"
        class="avatar"
        :class="avatarFileTooLargeAlert || updateAvatarError ? 'border-2 border-red-400' : 'border-none'"
      >
      
      <!-- avatar file input -->
      <input
        id="inputAvatarFile"
        ref="selectedNewAvatarRef"
        type="file"
        accept="image/jpeg"
        class="hidden"
        @change="previewAvatar"
      >

      <div class="!flex-col buttons">
        <button
          id="selectNewAvatarButton"
          class="flex flex-col w-full text-center light-bordered-button"
          @click.prevent="selectNewAvatarButton()"
        >
          <div class="w-full">
            {{ $t('profile.forms.update.chooseNewAvatar') }}
          </div>
          <div class="w-full">
            .jpg/.jpeg
          </div>
        </button>

        <button
          class="submit"
          :class="[
            { '!disabled-button !cursor-not-allowed': !selectedNewAvatarFile },
            { '!disabled-button !cursor-not-allowed': changingAvatarLoading },
          ]"
          @click.prevent="selectNewAvatarButton && !changingAvatarLoading ? updateAvatar() : null"
        >
          <Spinner v-if="changingAvatarLoading" />
          {{ changingAvatarLoading ? $t('updating') : $t('update') }}
        </button>
      </div>

      <!-- if selected file size is larger than accepted size -->
      <div
        v-if="avatarFileTooLargeAlert"
        class="mt-2 w-full text-center text-failure"
      >
        {{ $t('profile.forms.update.fileTooLarge') }}
        <br>
        {{ $t('profile.forms.update.avatarMaxAllowedFileSize') }}
      </div>

      <div
        v-if="updateAvatarError != ''"
        class="mt-2 w-full text-center text-failure"
      >
        {{ updateAvatarError }}
      </div>
    </form>

    <SuccessMessageModal
      id="change-avatar-success-modal"
      :modal-id="'change-avatar-success-modal'"
      class="modal"
      :message="$t('profile.forms.update.avatarChanged')"
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

const selectNewAvatarButton = () => {
  const inputAvatarFileEl = document.getElementById('inputAvatarFile')
  inputAvatarFileEl.click()
}

const selectedNewAvatarFile = ref('')
const previewNewAvatar = ref('')
const previewAvatar = (e) => {
  const file = e.target.files[0]
  previewNewAvatar.value = URL.createObjectURL(file)
  selectedNewAvatarFile.value = file
}

const changingAvatarLoading = ref(false)
const avatarChanged = ref(false)
const avatarFileTooLargeAlert = ref(false)
const selectedNewAvatarRef = ref(null)
const updateAvatarError = ref('')
const updateAvatar = async () => {
  if (selectedNewAvatarFile.value) {
    avatarChanged.value = false
    changingAvatarLoading.value = true
    avatarFileTooLargeAlert.value = false
    updateAvatarError.value = ''

    // get file
    const file = selectedNewAvatarFile.value

    // prepare to upload
    const avatarFormData = new FormData()
    avatarFormData.append('avatar', file)

    try {
      const response = await axios.post(
        apiUrl + '/user/update/avatar',
        avatarFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${auth.a4ht0jen}`
          }
        }
      )

      avatarChanged.value = true
      useModal().openModal('change-avatar-success-modal')
    } catch (error) {
      const errorResponse = error.response

      if (errorResponse.data.error === 'File too large') {
        avatarFileTooLargeAlert.value = true
      } else {
        updateAvatarError.value = errorResponse.data.message
      }
    }

    changingAvatarLoading.value = false
  } else {
    // todo
  }
}
</script>
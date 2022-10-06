<template>
  <div class="flex flex-col w-full">
    <!-- AVATAR FORM -->
    <div class="mb-4 w-44">
      <label class="font-semibold">{{ $t('profile.forms.update.avatar') }}</label>

      <div class="mt-2">
        <!-- show current avatar when user doesn't pick new avatar file yet -->
        <img v-show="!previewNewAvatar" :src="avatarCoverUrl(auth.user.avatar_bucket, auth.user.avatar_filename)" class="avatar" @error="imageLoadError">

        <!-- display selected file everytime the user selected new file -->
        <img v-show="previewNewAvatar" :src="previewNewAvatar" class="avatar" :class="avatarFileTooLargeAlert || updateAvatarError ? 'border-2 border-red-400' : 'border-none'">
        
        <!-- avatar file input -->
        <input 
          id="inputAvatarFile"
          ref="selectedNewAvatarRef"
          type="file"
          accept="image/png, image/gif, image/jpeg"
          class="hidden"
          @change="previewAvatar"
        >
        <button
          id="selectNewAvatarButton"
          class="mt-2 w-full primary-button"
          @click="selectNewAvatarButton()"
        >
          {{ $t('profile.forms.update.chooseNewAvatar') }}
        </button>

        <!-- submit button -->
        <button 
          class="flex flex-row mt-2 w-full"
          :class="[selectedNewAvatarFile ? 'primary-button cursor-pointer' : 'disabled-button cursor-not-allowed', !changingAvatarLoading ? 'primary-button cursor-pointer' : 'disabled-button cursor-not-allowed']"
          @click="selectNewAvatarButton && !changingAvatarLoading ? updateAvatar() : null"
        >
          <Spinner v-show="changingAvatarLoading" class="mr-2" />
          {{ changingAvatarLoading ? $t('updating') : $t('update') }}
        </button>

        <!-- if selected file size is larger than accepted size -->
        <div v-show="avatarFileTooLargeAlert" class="mt-2 w-full text-center text-failure">
          {{ $t('profile.forms.update.fileTooLarge') }}
          <br>
          {{ $t('profile.forms.update.avatarMaxAllowedFileSize') }}
        </div>

        <div v-show="updateAvatarError != ''" class="mt-2 w-full text-center text-failure">
          {{ updateAvatarError }}
        </div>

        <!-- on avatar successfully changed -->
        <div v-show="avatarChanged" class="mt-2 w-full text-center text-success">
          {{ $t('updated') }}
        </div>
      </div>
    </div>

    <div class="mb-4 custom-divider" />

    <!-- COVER FORM -->
    <div class="mb-4">
      <label class="font-semibold">{{ $t('profile.forms.update.cover') }}</label>

      <div class="mt-2">
        <img 
          v-show="!previewNewCover"
          :src="avatarCoverUrl(auth.user.cover_bucket, auth.user.cover_filename)" 
          class="object-cover object-top w-full h-28 rounded-md md:h-48 lg:h-64 xl:h-72 unselectable"
          @error="defaultCoverImage"
        >
        
        <!-- display selected file everytime the user selected new file -->
        <img 
          v-show="previewNewCover"
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
        <button
          id="selectNewCoverButton" 
          class="mt-2 w-full primary-button"
          @click="selectNewCoverButton()" 
        >
          {{ $t('profile.forms.update.chooseNewCover') }}
        </button>

        <!-- submit button -->
        <div class="flex flex-row justify-end w-full">
          <button 
            class="flex flex-row mt-2 w-full md:w-auto"
            :class="[selectedNewCoverFile ? 'primary-button cursor-pointer' : 'disabled-button cursor-not-allowed', !changingCoverLoading ? 'primary-button cursor-pointer' : 'disabled-button cursor-not-allowed']"
            @click="selectNewCoverButton && !changingCoverLoading ? updateCover() : null"
          >
            <Spinner v-show="changingCoverLoading" class="mr-2" />
            {{ changingCoverLoading ? $t('updating') : $t('update') }}
          </button>
        </div>

        <!-- if selected file size is larger than accepted size -->
        <div v-show="coverFileTooLargeAlert" class="mt-2 w-full text-center text-failure">
          {{ $t('profile.forms.update.fileTooLarge') }}
          <br>
          {{ $t('profile.forms.update.coverMaxAllowedFileSize') }}
        </div>

        <div v-show="updateCoverError != ''" class="mt-2 w-full text-center text-failure">
          {{ updateCoverError }}
        </div>

        <!-- on cover successfully changed -->
        <div v-show="coverChanged" class="mt-2 w-full text-center text-success">
          {{ $t('updated') }}
        </div>
      </div>
    </div>

    <div class="mb-4 custom-divider" />

    <!-- Part 1: Update profile basic information -->
    <form
      :id="basicInformationFormId"
      class="mb-4"
      @submit.prevent="update(basicInformationFormId)"
    >
      <div class="input-block">
        <n-validate>
          <label class="font-semibold">{{ $t('profile.forms.update.name') }}</label>
          <div class="field">
            <input 
              v-model="inputData.name"
              type="text" 
              class="form-input input"
              :class="[{ 'pointer-events-none cursor-not-allowed': saving.basic.loading }]"
            >
          </div>
        </n-validate>
      </div>

      <div class="input-block">
        <n-validate>
          <label class="font-semibold">{{ $t('profile.forms.update.penName') }}</label>
          <div class="field">
            <input 
              v-model="inputData.penName"
              type="text" 
              maxlength="12"
              class="form-input input"
              :class="{ 'pointer-events-none cursor-not-allowed': saving.username.loading }"
              @input="checkPenNameAvailability()"
              @keydown.space.prevent
            >
            <div v-show="penNameUsedAlert" class="input-error">
              {{ $t('profile.forms.update.penNameTaken') }}
            </div>
          </div>
        </n-validate>
      </div>

      <div class="input-block">
        <label class="font-semibold">{{ $t('profile.forms.update.gender') }}</label>
        <div class="mb-4 field">
          <div class="flex flex-row p-1 w-full rounded-md cursor-pointer md:w-min theme-color">
            <div 
              class="flex flex-row justify-center py-2 px-3 w-full rounded-md parent-icon"
              :class="{ 'button-color text-white': inputData.gender === 'm' }"
              @click="inputData.gender = 'm'"
            >
              {{ $t('male') }}
            </div>
            <div 
              class="flex flex-row justify-center py-2 px-3 w-full rounded-md parent-icon"
              :class="{ 'button-color text-white': inputData.gender === 'f' }"
              @click="inputData.gender = 'f'"
            >
              {{ $t('female') }}
            </div>
          </div>
        </div>
      </div>

      <div class="input-block">
        <n-validate>
          <label class="font-semibold">{{ $t('profile.forms.update.bio') }}</label>
          <div class="mb-4 field">
            <client-only>
              <VueEditor
                v-model="inputData.bio"
                :editorToolbar="[
                  [{ 'size': ['normal', 'large'] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  ['link'],
                  [{ 'color': [] }, { 'background': [] }],
                  ['clean']
                ]"
              />
            </client-only>
            <!-- <textarea 
              v-model="inputData.bio" 
              class="mb-1 form-input input"
              :class="{ 'pointer-events-none cursor-not-allowed': saving.basic.loading }"
              rows="8"
              cols="0"
              data-gramm="false"
            /> -->
          </div>
        </n-validate>
      </div>

      <div class="input-block">
        <n-validate>
          <label class="font-semibold">{{ $t('profile.forms.update.location') }}</label>
          <div class="field">
            <input 
              v-model="inputData.location"
              type="text" 
              class="form-input input"
              :class="{ 'pointer-events-none cursor-not-allowed': saving.basic.loading }"
            >
          </div>
        </n-validate>
      </div>

      <!-- submit button -->
      <div class="flex flex-row justify-between w-full">
        <div>
          <span 
            v-show="saving.basic.loading || saving.basic.success" 
            class="flex flex-row text-success"
          >
            <Spinner v-show="saving.basic.loading" class="mr-2" />
            {{ saving.basic.loading ? $t('updating') : $t('updated') }}
          </span>
        </div>
        <button 
          type="submit"
          :class="[
            'flex flex-row w-full md:w-auto',
            saving.basic.buttonDisabled ? 'disabled-button' : 'primary-button'
          ]"
        >
          <Spinner v-show="saving.basic.loading" class="mr-2" />
          {{ saving.basic.loading ? $t('updating') : $t('update') }}
        </button>
      </div>
    </form>
      
    <div class="mb-4 custom-divider" />

    <!-- Part 2: Update profile username -->
    <form 
      :id="changeUsernameFormId"
      @submit.prevent="changeUsername(changeUsernameFormId)"
    >
      <div class="input-block">
        <n-validate
          for="=username"
          :name="$t('profile.forms.update.username')"
        >
          <label class="font-semibold">{{ $t('profile.forms.update.username') }}</label>
          <div class="field">
            <input 
              v-model="inputData.username"
              type="text" 
              maxlength="12"
              :class="[
                'form-input input',
                { 'pointer-events-none cursor-not-allowed': saving.username.loading }
              ]"
              rules="required|min:5"
              @input="checkUsernameAvailability()"
              @keydown.space.prevent
            >
            <!-- <div v-show="usernameUsedAlert" class="pt-4 input-error">
              {{ $t('profile.forms.update.usernameTaken') }}
            </div> -->
          </div>
        </n-validate>
      </div>

      <!-- submit button -->
      <div class="flex flex-row justify-between w-full" :class="{ 'cursor-not-allowed': usernameUsedAlert }">
        <div>
          <span v-show="saving.username.loading || saving.username.success" class="text-success">
            {{ saving.username.loading ? $t('profile.forms.update.changingYourUsername') : $t('profile.forms.update.usernameChanged') }}
          </span>
        </div>
        
        <button 
          type="submit"
          :class="[
            'w-full md:w-auto',
            saving.username.buttonDisabled ? 'disabled-button' : 'primary-button'
          ]"
        >
          <Spinner v-show="saving.username.loading || saving.username.checkingValidity" class="mr-2" />
          
          <span v-show="!saving.username.checkingValidity">{{ saving.username.loading ? $t('profile.forms.update.changingYourUsername') : $t('profile.forms.update.changeUsername') }}</span>
          <span v-show="saving.username.checkingValidity">Checking..</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import axios from 'axios'
import { debounce } from 'vue-debounce'
import { useI18n } from 'vue-i18n'

// vue3-editor
import { VueEditor } from 'vue3-editor'

// stores
import useAuthStore from '@/stores/auth.store'

// components
import Spinner from '~/components/globals/Spinner.vue'

// composables
import useUser from '~/composables/users/useUser'

// stores
const runtimeConfig = useRuntimeConfig()
const auth = useAuthStore()

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const userApi = useUser(oApiConfiguration, fetchOptions())

const { $router } = useNuxtApp()
const { t } = useI18n()

onBeforeMount (() => {
  if (!auth.loggedIn) {
    $router.push('/')
  }
})

onMounted (() => {
  fetchUserInfo()
})

// 
const inputData = ref({
  name: '',
  username: '',
  penName: '',
  bio: '',
  gender: 'm',
  location: ''
})
const current = ref({
  username: '',
  penName: ''
})
const fetchUserInfo = async () => {
  if (auth.loggedIn) {
    const [data, error] = await userApi.getInfo(auth.user.id)

    if (error) {
      // todo: handle error
    } else {
      inputData.value.name = data.name

      inputData.value.username = data.username
      current.value.username = data.username

      inputData.value.penName = data.pen_name
      current.value.penName = data.pen_name

      inputData.value.bio = data.bio
      inputData.value.gender = data.gender
      inputData.value.location = data.location
    }
  } else {
    // todo: handle unauthenticated user
  }
}

const saving = ref({
  basic: {
    loading: false,
    success: false,
    buttonDisabled: false,
    checkingValidity: false
  },
  username: {
    loading: false,
    success: false,
    buttonDisabled: true,
    checkingValidity: false
  }
})

const penNameUsedAlert = ref(false)
const checkPenNameAvailability = async () => {
  if (inputData.value.penName === '') {
    penNameUsedAlert.value = false
    saving.value.basic.buttonDisabled = true
    saving.value.basic.checkingValidity = false
  }

  if (inputData.value.penName.length >= 4 && inputData.value.penName.length <= 12) {
    saving.value.basic.buttonDisabled = true
    saving.value.basic.checkingValidity = true

    await debounce(async (_) => {
      if (inputData.value.penName === current.value.penName) {
        penNameUsedAlert.value = false
        saving.value.basic.buttonDisabled = false
        saving.value.basic.checkingValidity = false
      } else {
        const [result, error] = await userApi.checkPenNameAvailability(inputData.value.penName)

        if (!result && error && auth.user.pen_name !== inputData.value.penName) {
          penNameUsedAlert.value = true
          saving.value.basic.buttonDisabled = true
          saving.value.basic.checkingValidity = false
        } else {
          penNameUsedAlert.value = false
          saving.value.basic.buttonDisabled = false
          saving.value.basic.checkingValidity = false
        }
      }
    }, 700)()
  } else {
    penNameUsedAlert.value = false
  }
}

/** Save changes */
const basicInformationFormId = 'basic-information-form'
const update = async () => {
  useValidator().validate(basicInformationFormId, t)

  if (!penNameUsedAlert.value) {
    saving.value.basic.loading = true
  
    const [success, error] = await userApi.updateInfo({
      userId: auth.user.id,
      name: inputData.value.name,
      gender: inputData.value.gender,
      bio: inputData.value.bio,
      location: inputData.value.location,
      penName: inputData.value.penName
    })

    if (!success && error) {
      saving.value.basic.loading = false
      // todo: handle error
    } else {
      saving.value.basic.success = true
    }

    saving.value.basic.loading = false
  } else {
    // todo: handle error
  }
}

/** Form 2: Username */
const usernameUsedAlert = ref(false)
const checkUsernameAvailability = async () => {
  if (inputData.value.username === '') {
    usernameUsedAlert.value = false
    saving.value.username.buttonDisabled = true
    saving.value.username.checkingValidity = false
  }

  if (inputData.value.username.length >= 4 && inputData.value.username.length <= 12) {
    saving.value.username.buttonDisabled = true
    saving.value.username.checkingValidity = true

    await debounce(async (_) => {
      if (inputData.value.username === current.value.username) {
        usernameUsedAlert.value = false
        saving.value.username.buttonDisabled = false
        saving.value.username.checkingValidity = false
      } else {
        const [result, error] = await userApi.checkUsernameAvailability(inputData.value.username)

        if (!result && error) {
          usernameUsedAlert.value = true
          saving.value.username.buttonDisabled = true
          saving.value.username.checkingValidity = false
        } else {
          usernameUsedAlert.value = false
          saving.value.username.buttonDisabled = false
          saving.value.username.checkingValidity = false
        }
      }
    }, 500)()
  } else {
    usernameUsedAlert.value = false
  }
}

const changeUsernameFormId = 'change-username-form'
const changeUsername = async () => {
  const v = useValidator().validate(changeUsernameFormId, t)

  if (!usernameUsedAlert.value) {
    saving.value.username.loading = true
    
    const [success, error] = await userApi.changeUsername(inputData.value.username)

    if (!success && error) {
      saving.value.username.loading = false
      // todo: handle error
    } else {
      saving.value.username.success = true
    }

    saving.value.username.loading = false
  } else {
    // todo: handle error
  }
}

/**
 * UPDATE AVATAR
 */
// open file selector dialog by firing file input click
const selectNewAvatarButton = () => {
  const inputAvatarFileEl = document.getElementById('inputAvatarFile')
  inputAvatarFileEl.click()
}

// preview selected avatar
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
        runtimeConfig.public.apiUrl + '/user/update/avatar',
        avatarFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${auth.a4ht0jen}`
          }
        }
      )

      avatarChanged.value = true
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

/**
 * UPDATE Cover
 */
// open file selector dialog by firing file input click
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
        runtimeConfig.public.apiUrl + '/user/update/cover',
        coverFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${auth.a4ht0jen}`
          }
        }
      )

      coverChanged.value = true
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

<style lang="scss" scoped>
@import '~/assets/css/tailwind.scss';

form {
  .input-block {
    @apply mb-2;

    .field {
      @apply mt-2;
    }
  }
}
</style>

<style lang="scss">
@import '~/assets/css/tailwind.scss';

.avatar {
  @apply object-cover rounded-md;
  aspect-ratio: 1/1;
}

#profile-pic-demo .drop-help-text {
  display: none;
}
#profile-pic-demo .is-drag-over .drop-help-text {
  display: block;
}
#profile-pic-demo .profile-pic-upload-block {
  padding-top: 0;
}
#profile-pic-demo .vue-file-agent {
  @apply rounded-md text-center w-full;
  float: left;
  margin: 0 0 0 0;
  border: 0;
  box-shadow: none;
}
</style>

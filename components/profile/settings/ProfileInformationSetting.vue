<template>
  <div class="flex flex-col w-full">
    <ChangeAvatarForm />

    <div class="mb-4 custom-divider" />

    <ChangeCoverForm />

    <div class="mb-4 custom-divider" />

    <section id="basic-information">
      <form
        :id="basicInformationFormId"
        class="mb-4"
        @submit.prevent="update(basicInformationFormId)"
      >
        <n-validate
          for="name"
          :name="$t('profile.forms.update.name')"
        >
          <label>{{ $t('profile.forms.update.name') }}</label>
          
          <input 
            v-model="inputData.name"
            type="text" 
            rules="required|min:2"
            :class="[
              'form-input input',
              { 'pointer-events-none cursor-not-allowed': saving.basic.loading }
            ]"
          >
        </n-validate>

        <n-validate>
          <label>{{ $t('profile.forms.update.penName') }}</label>
          
          <input 
            v-model="inputData.penName"
            type="text" 
            maxlength="12"
            class="form-input input"
            :class="{ 'pointer-events-none cursor-not-allowed': saving.username.loading }"
            @input="checkPenNameAvailability()"
            @keydown.space.prevent
          >
          <div
            v-if="penNameUsedAlert"
            class="input-error"
          >
            {{ $t('profile.forms.update.penNameTaken') }}
          </div>
        </n-validate>

        <n-validate>
          <label>{{ $t('profile.forms.update.bio') }}</label>
          
          <VueEditor
            v-model="inputData.bio"
            :editor-toolbar="quillOptions"
          />
        </n-validate>

        <n-validate>
          <label>{{ $t('profile.forms.update.location') }}</label>
          
          <input 
            v-model="inputData.location"
            type="text" 
            class="form-input input"
            :class="{ 'pointer-events-none cursor-not-allowed': saving.basic.loading }"
          >
        </n-validate>

        <div class="buttons">
          <button 
            type="submit"
            :class="[
              'submit',
              { '!disabled-button': saving.basic.buttonDisabled }
            ]"
          >
            <Spinner v-if="saving.basic.loading || saving.basic.checkingValidity" />
            <span v-if="!saving.basic.checkingValidity">
              {{ saving.basic.loading ? $t('updating') : $t('update') }}
            </span>
          </button>
        </div>
      </form>

      <SuccessMessageModal
        id="update-user-info-success-modal"
        :modal-id="'update-user-info-success-modal'"
        class="modal"
        :message="$t('profile.forms.update.profileUpdated')"
      />
    </section>
      
    <div class="mb-4 custom-divider" />

    <section id="profile-username">
      <form 
        :id="changeUsernameFormId"
        @submit.prevent="changeUsername()"
      >
        <n-validate
          for="=username"
          :name="$t('profile.forms.update.username')"
        >
          <label>{{ $t('profile.forms.update.username') }}</label>
          
          <input 
            v-model="inputData.username"
            type="text" 
            maxlength="12"
            :class="[
              { '!pointer-events-none !cursor-not-allowed': saving.username.loading }
            ]"
            rules="required|min:5"
            :placeholder="$t('profile.forms.update.username')"
            @input="checkUsernameAvailability()"
            @keydown.space.prevent
          >

          <div
            v-if="usernameUsedAlert"
            class="input-error"
          >
            {{ $t('profile.forms.update.usernameTaken') }}
          </div>
        </n-validate>

        <div
          :class="[
            'buttons',
            { 'cursor-not-allowed': usernameUsedAlert }
          ]"
        > 
          <button 
            type="submit"
            :class="[
              'submit',
              { '!disabled-button': saving.username.buttonDisabled },
            ]"
          >
            <Spinner v-if="saving.username.loading || saving.username.checkingValidity" />
            <span v-if="!saving.username.checkingValidity">
              {{ saving.username.loading ? $t('profile.forms.update.changingYourUsername') : $t('profile.forms.update.changeUsername') }}
            </span>
          </button>
        </div>
      </form>

      <SuccessMessageModal
        id="update-username-success-modal"
        :modal-id="'update-username-success-modal'"
        class="modal"
        :message="$t('profile.forms.update.usernameChanged')"
      />
    </section>
  </div>
</template>

<script setup>
import axios from 'axios'
import { debounce } from 'vue-debounce'
import { useI18n } from 'vue-i18n'
import { VueEditor } from 'vue3-editor'
import { quillOptions } from '~/utils/constants/text-editor'

// stores
import useAuthStore from '@/stores/auth.store'

// composables
import useUser from '~/composables/users/useUser'

// components
import Spinner from '~/components/globals/Spinner.vue'
import ChangeAvatarForm from './ChangeAvatarForm.vue'
import ChangeCoverForm from './ChangeCoverForm.vue'
import SuccessMessageModal from '~/components/globals/SuccessMessageModal.vue'

// stores
const auth = useAuthStore()

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const userApi = useUser(oApiConfiguration, fetchOptions())

const router = useRouter()
const { t } = useI18n()

onBeforeMount (() => {
  if (!auth.loggedIn) {
    router.push('/')
  }
})

onMounted (() => {
  fetchUserInfo()
})

// basic information form
const inputData = ref({
  name: '',
  username: '',
  penName: '',
  bio: '',
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
    saving.value.basic.checkingValidity = false
    saving.value.basic.buttonDisabled = false
  }

  const lengthAccepted = inputData.value.penName.length >= 4 && inputData.value.penName.length <= 12
  if (lengthAccepted) {
    saving.value.basic.checkingValidity = true
    saving.value.basic.buttonDisabled = true

    await debounce(async (_) => {
      if (inputData.value.penName === current.value.penName) {
        penNameUsedAlert.value = false
        saving.value.basic.checkingValidity = false
      }

      if (lengthAccepted) {
        const [result, error] = await userApi.checkPenNameAvailability(inputData.value.penName)

        if (!result && error && auth.user.pen_name !== inputData.value.penName) {
          penNameUsedAlert.value = true
          saving.value.basic.checkingValidity = false
          saving.value.basic.buttonDisabled = true
        } else {
          penNameUsedAlert.value = false
          saving.value.basic.checkingValidity = false
          saving.value.basic.buttonDisabled = false
        }
      }
    }, 700)()
  } else {
    penNameUsedAlert.value = false
  }
}

const basicInformationFormId = ref('basic-information-form')
const update = async (formId) => {
  useValidator().validate(formId, t)

  if (!penNameUsedAlert.value) {
    saving.value.basic.loading = true
  
    const [success, error] = await userApi.updateInfo({
      userId: auth.user.id,
      name: inputData.value.name,
      bio: inputData.value.bio,
      location: inputData.value.location,
      penName: inputData.value.penName
    })

    if (!success && error) {
      saving.value.basic.loading = false
      // todo: handle error
    } else {
      saving.value.basic.success = true
      useModal().openModal('update-user-info-success-modal')
    }

    saving.value.basic.loading = false
  } else {
    // todo: handle error
  }
}

// username change form
const usernameUsedAlert = ref(false)
const checkUsernameAvailability = async () => {
  if (inputData.value.username === '') {
    usernameUsedAlert.value = false
    saving.value.username.buttonDisabled = true
    saving.value.username.checkingValidity = false
  }

  const lengthAccepted = inputData.value.username.length >= 4 && inputData.value.username.length <= 12
  if (lengthAccepted) {
    saving.value.username.buttonDisabled = true
    saving.value.username.checkingValidity = true

    await debounce(async (_) => {
      if (inputData.value.username == current.value.username) {
        usernameUsedAlert.value = false
        saving.value.username.buttonDisabled = true
        saving.value.username.checkingValidity = false
      } else {
        if (lengthAccepted) {
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
      }
    }, 700)()
  } else {
    usernameUsedAlert.value = false
  }
}

const changeUsernameFormId = 'change-username-form'
const changeUsername = async () => {
  useValidator().validate(changeUsernameFormId, t)

  if (!usernameUsedAlert.value) {
    saving.value.username.loading = true
    
    const [success, error] = await userApi.changeUsername(inputData.value.username)

    if (!success && error) {
      saving.value.username.loading = false
      // todo: handle error
    } else {
      saving.value.username.success = true
      useModal().openModal('update-username-success-modal')
    }

    saving.value.username.loading = false
  } else {
    // todo: handle error
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/tailwind.scss';
</style>
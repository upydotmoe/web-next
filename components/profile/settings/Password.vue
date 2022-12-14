<template>
  <div class="w-full">
    <!-- Part 1: verify that current user is the owner of the account -->
    <form
      @submit.prevent="verifyCurrentPassword()"
    >
      <div class="input-block">
        <label class="font-semibold">{{ $t('profile.forms.update.password.currentPasswordLabel') }}</label>
        <div class="field">
          <input 
            v-model="verifyPassword"
            type="password" 
            rules="required|min:6|containNumber|containSymbol"
            :class="[
              'form-input input',
              { 'cursor-not-allowed pointer-events-none': isVerified }
            ]"
            :readonly="isVerified"
            :placeholder="$t('profile.forms.update.password.currentPassword')"
          >
          <div v-show="verifyError !== ''" class="error-message">
            {{ verifyError }}
          </div>
        </div>
      </div>

      <div v-show="!isVerified" class="flex flex-row justify-end">
        <button
          :class="[
            verifyPassword === '' ? 'disabled-button pointer-events-none cursor-not-allowed' : 'primary-button cursor-pointer'
          ]"
        >
          {{ $t('next') }}
        </button>
      </div>
    </form>

    <!-- Part 2: Update user account password -->
    <form
      v-show="isVerified"
      :id="formId"
      @submit.prevent="update(formId)"
    >
      <div class="input-block">
        <label class="font-semibold">{{ $t('profile.forms.update.password.newPassword') }}</label>
        <div class="field">
          <input 
            v-model="newPassword"
            type="password" 
            rules="required|min:6|containNumber|containSymbol"
            :class="[
              'form-input input',
              { 'cursor-not-allowed pointer-events-none': saving.settings.loading }
            ]"
            :readonly="saving.settings.loading"
            :placeholder="$t('profile.forms.update.password.newPassword')"
          >
          <div v-show="savingError !== ''" class="error-message">
            {{ savingError }}
          </div>
        </div>
      </div>

      <!-- submit button -->
      <div class="flex flex-row justify-between w-full">
        <div>
          <span v-show="saving.settings.loading || saving.settings.success" class="text-success">
            {{ saving.settings.loading ? $t('updating') : '' }}
          </span>
        </div>

        <button
          type="submit"
          :class="[
            'w-full md:w-auto',
            saving.settings.buttonDisabled ? 'secondary-button pointer-events-none cursor-not-allowed' : 'primary-button cursor-pointer'
          ]"
        >
          {{ saving.settings.loading ? $t('updating') : $t('update') }}
        </button>
      </div>
    </form>

    <SuccessMessageModal
      id="success-modal"
      class="modal"
      :message="$t('profile.forms.update.password.success')"
      :auto-close-after-ms="1000"
    />
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

// stores
import useAuthStore from '@/stores/auth.store'

// composables
import useUser from '~/composables/users/useUser'

// components
import SuccessMessageModal from '~/components/globals/SuccessMessageModal.vue'

// stores
const auth = useAuthStore()

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const userApi = useUser(oApiConfiguration, fetchOptions())

const { t } = useI18n()

const { $router } = useNuxtApp()

onBeforeMount (() => {
  if (!auth.loggedIn) {
    $router.push('/')
  }
})

const verifyPassword = ref('')
const verifyError = ref('')
const isVerified = ref(false)

const resetCurrentPassword = () => {
  verifyPassword.value = ''
  verifyError.value = ''
  isVerified.value = false
}

const verifyCurrentPassword = async () => {
  // reset state
  isVerified.value = false
  verifyError.value = ''
  newPassword.value = ''

  //
  const [data, error] = await userApi.checkCurrentPassword({
    userId: auth.user.id,
    currentPassword: verifyPassword.value
  })

  if (error) {
    verifyError.value = error
  } else {
    isVerified.value = true
  }
}

const saving = ref({
  settings: {
    loading: false,
    success: false,
    buttonDisabled: false
  }
})

/** Save changes */
const formId = 'update-setting-form'
const newPassword = ref('')
const savingError = ref('')

const resetNewPassword = () => {
  newPassword.value = ''
  savingError.value = ''
}

const update = async () => {
  saving.value.settings.loading = true
  useValidator().validate(formId, t)
  
  const [success, error] = await userApi.updateCurrentPassword({
    userId: auth.user.id,
    currentPassword: verifyPassword.value,
    newPassword: newPassword.value
  })

  if (error) {
    saving.value.settings.success = false
    savingError.value = error
  } else {
    saving.value.settings.success = true
    resetNewPassword()
    resetCurrentPassword()

    useModal().openModal('success-modal')
  }

  saving.value.settings.loading = false
}
</script>

<style lang="scss" scoped>
// @import '~/assets/css/tailwind.scss';

form {
  .input-block {

    .field {
      @apply mt-2 mb-2;

      .icon {
        @apply ml-3 h-10 relative text-lg text-color-secondary -mb-2 rounded-l-md;
      }
    }
  }
}
</style>

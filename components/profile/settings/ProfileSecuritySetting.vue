<template>
  <div>
    <!-- step 1: verify that current user is the owner of the account -->
    <form
      @submit.prevent="verifyCurrentPassword()"
    >
      <n-validate>
        <label>{{ $t('profile.forms.update.password.currentPasswordLabel') }}</label>

        <input 
          v-model="verifyPassword"
          type="password" 
          rules="required|min:6|containNumber|containSymbol"
          :class="[
            { 'cursor-not-allowed pointer-events-none': isVerified }
          ]"
          :readonly="isVerified"
          :placeholder="$t('profile.forms.update.password.currentPassword')"
        >

        <div
          v-if="verifyError"
          class="input-error"
        >
          {{ verifyError }}
        </div>
      </n-validate>

      <div
        v-if="!isVerified"
        class="buttons"
      >
        <button
          type="submit"
          :class="[
            'submit',
            { '!disabled-button pointer-events-none cursor-not-allowed': verifyPassword === '' }
          ]"
        >
          {{ $t('next') }}
        </button>
      </div>
    </form>

    <!-- step 2: Update user account password -->
    <form
      v-if="isVerified"
      :id="formId"
      class="mt-2"
      @submit.prevent="update(formId)"
    >
      <ErrorMessage
        :is-error="savingError !== ''"
        :error-message="savingError"
      />

      <n-validate>
        <label>{{ $t('profile.forms.update.password.newPassword') }}</label>

        <input 
          v-model="newPassword"
          type="password" 
          rules="required|min:6|containNumber|containSymbol"
          :class="[
            { 'cursor-not-allowed pointer-events-none': saving.settings.loading }
          ]"
          :readonly="saving.settings.loading"
          :placeholder="$t('profile.forms.update.password.newPassword')"
        >
      </n-validate>

      <div class="buttons">
        <button
          type="submit"
          :class="[
            'submit',
            { '!secondary-button !pointer-events-none !cursor-not-allowed': saving.settings.buttonDisabled }
          ]"
        >
          {{ saving.settings.loading ? $t('updating') : $t('update') }}
        </button>
      </div>
    </form>

    <div
      v-if="isVerified"
      class="custom-divider"
    />

    <section
      v-if="isVerified"
      id="passphrase"
      class="mt-4"
    >
      <label class="title-tiny">Your Passphrase</label>
      <div class="p-4 text-base tracking-widest rounded-md theme-color w-fit">
        AWDWAA
      </div>
    </section>

    <SuccessMessageModal
      id="password-change-success-modal"
      :modal-id="'password-change-success-modal'"
      class="modal"
      :message="$t('profile.forms.update.password.success')"
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
import ErrorMessage from '~~/components/auth/forms/ErrorMessage.vue'

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

    useModal().openModal('password-change-success-modal')
  }

  saving.value.settings.loading = false
}
</script>
<template>
  <div
    v-if="showForm || directMode"
    class="w-full"
  >
    <section id="passphrase-and-password-recovery">
      <h2
        v-if="!isVerified"
        class="title-tiny"
      >
        {{ $t('accountRecovery.form.pleaseInputRecoveryPassphrase') }}
      </h2>

      <!-- step 1: verify account passphrase -->
      <section id="passphrase-verification">
        <form
          v-if="!isVerified"
          :id="formId"
          @submit.prevent="verify(formId)"
        >
          <ErrorMessage
            :is-error="error.isError"
            :error-message="error.message"
          />

          <n-validate
            for="username"
            :name="$t('accountRecovery.form.username')"
          >
            <input 
              v-model="inputData.username" 
              type="text" 
              rules="required|min:4|max:12"
              class="input-color-secondary"
              :placeholder="$t('accountRecovery.form.username')"
            >
          </n-validate>

          <n-validate
            for="email"
            :name="$t('accountRecovery.form.email')"
          >
            <input 
              v-model="inputData.email" 
              type="email" 
              rules="required|email"
              class="input-color-secondary"
              :placeholder="$t('accountRecovery.form.email')"
            >
          </n-validate>

          <n-validate
            for="passphrase"
            :name="$t('accountRecovery.form.passphrase')"
          >
            <input 
              v-model="inputData.passphrase" 
              type="text" 
              rules="required|min:6|max:6"
              minLength="6"
              maxlength="6"
              class="input-color-secondary"
              :placeholder="$t('accountRecovery.form.passphrase')"
            >
          </n-validate>

          <input
            type="submit"
            :value="$t('next')"
          >
        </form>
      </section>

      <!-- step 2: if passphrase verified, change the password -->
      <section id="password-change">
        <form
          v-if="isVerified && !accountRecovered"
          :id="accountRecoveryFormId"
          @submit.prevent="changeAccountPassword(formId)"
        >
          <ErrorMessage
            :is-error="error.isError"
            :error-message="error.message"
          />
          
          <n-validate
            for="new-password"
            :name="$t('accountRecovery.form.passphrase')"
          >
            <input 
              v-model="newPasswordInput.new" 
              type="password"
              rules="required|min:6|containNumber|containSymbol"
              class="input-color-secondary"
              :placeholder="$t('accountRecovery.form.newPassword')"
            >
          </n-validate>
          
          <n-validate
            for="verify-new-password"
            :name="$t('accountRecovery.form.passphrase')"
          >
            <input 
              v-model="newPasswordInput.verify" 
              type="password"
              rules="required|min:6|containNumber|containSymbol"
              class="input-color-secondary"
              :placeholder="$t('accountRecovery.form.retypeNewPassword')"
            >
          </n-validate>

          <input
            type="submit"
            :value="$t('accountRecovery.resetPassword')"
          >
        </form>
      </section>
    </section>

    <!-- Account Recovered Message -->
    <section id="success">
      <div
        v-if="isVerified && accountRecovered"
        class="w-full text-center"
      >
        <p>{{ $t('accountRecovery.accountRecovered') }}</p>
        
        <button
          class="mt-4 href"
          @click="authFormStore.reset()"
        >
          {{ $t('logins.login').toUpperCase() }}
        </button>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'

// utils
import { IVerifyAccountPassphrase, IVerifyAccountPassphraseNewPassword } from '~/utils/auth'

// stores
import useAuthFormStore from '@/stores/auth-form.store'

// components
import ErrorMessage from './ErrorMessage.vue'

// stores
const authFormStore = useAuthFormStore()

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const authApi = useAuth(oApiConfiguration, fetchOptions())

const { t } = useI18n()

const props = defineProps({
  directMode: {
    type: Boolean,
    default: false
  }
})

const isVerified = ref<boolean>(false)
const showForm = computed(() => authFormStore.showAccountRecovery)

const inputData = ref<IVerifyAccountPassphrase>({
  username: '',
  email: '',
  passphrase: ''
})

const formId = 'account-recovery-form' + (props.directMode ?? '-direct')
const verifiedUserId = ref<number>(0)
const verify = async () => {
  resetErrorMessage()
  useValidator().validate(formId, t)

  const [success, data, error] = await authApi.verifyAccountRecoveryPassphrase(inputData.value)

  if (error) {
    triggerErrorMessage(error)
  } else {
    isVerified.value = true
    verifiedUserId.value = data.user_id
    resetErrorMessage()
  }
}

/**
 * Verified section, change password
 */
const accountRecoveryFormId = 'account-recovery-with-passphrase-form'
const newPasswordInput = ref<IVerifyAccountPassphraseNewPassword>({
  new: '',
  verify: ''
})
const accountRecovered = ref<boolean>(false)
const changeAccountPassword = async () => {
  resetErrorMessage()

  useValidator().validate(accountRecoveryFormId, t)

  if (newPasswordInput.value.new !== newPasswordInput.value.verify) {
    triggerErrorMessage(t('accountRecovery.form.retypeNewPasswordError'))
    return
  }

  const [success, error] = await authApi.changePassword({
    userId: verifiedUserId.value,
    passphrase: inputData.value.passphrase,
    newPassword: newPasswordInput.value.new
  })

  if (error) {
    triggerErrorMessage(error)
  } else {
    accountRecovered.value = true
    resetErrorMessage()
  }
}

const error = ref({
  isError: false,
  message: ''
})
const triggerErrorMessage = async (message: string) => {
  error.value = {
    isError: true,
    message
  }
}
const resetErrorMessage = () => {
  error.value = {
    isError: false,
    message: ''
  }
}
</script>
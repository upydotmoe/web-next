<template>
  <div id="auth-modal" class="modal animated faster fadeIn">
    <div class="modal-container theme-color w-full md:w-1/2 lg:w-2/5 xl:2/6 2xl:w-1/4 mx-auto rounded-md shadow-lg z-50 overflow-y-auto">
      <div class="modal-content py-4 px-6 md:py-10 md:px-12 text-left">
        <div class="flex justify-between items-center mb-6">
          <!-- back button -->
          <div v-if="!showLogin" @click="resetVisibility">
            <NavIcon :name="'chevron-back-outline'" class="text-base icon-color cursor-pointer align-middle" />
          </div>

          <!-- title -->
          <p v-show="!showAccountRecovery && !showRegistrationSuccessDialog && !showRecoveryLinkSentDialog" class="back-button">
            {{ showLogin ? $t('loginHead') : $t('registerHead') }}
          </p>

          <p v-show="showAccountRecovery && !showRegistrationSuccessDialog && !showRecoveryLinkSentDialog" class="back-button">
            {{ $t('resetPassword') }}
          </p>

          <!-- notification on account successfully created -->
          <p v-show="showRegistrationSuccessDialog" class="back-button">
            {{ $t('accountCreated') }}
          </p>

          <!-- notification on account recovery link successfully sent -->
          <p v-show="showRecoveryLinkSentDialog" class="back-button">
            {{ $t('forms.accountRecovery.recoveryLinkSent') }}
          </p>

          <!-- close button -->
          <div class="modal-close cursor-pointer z-50 icon-color" @click="closeModal('auth-modal')">
            <svg
              class="fill-current"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
            >
              <path
                d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"
              />
            </svg>
          </div>
        </div>

        <!-- main content -->
        <div class="flex justify-center">
          <LoginForm />
          <RegistrationForm />
          <!-- <AccountRecoveryForm /> -->
        </div>

        <div v-if="showLogin" class="w-full text-center mt-4">
          {{ $t('dontHaveAnAccount') }} <span class="font-medium cursor-pointer icon-color" @click="toggleLoginRegister">{{ $t('registration.register') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// components
import LoginForm from './Login.vue'
import RegistrationForm from './Registration.vue'
// import AccountRecoveryForm from './AccountRecovery.vue'

import NavIcon from '~/components/NavbarIcon.vue'

// stores
import useAuthFormStore from '@/stores/auth-form.store'

const authFormStore = useAuthFormStore()

// visibility
const showLogin = computed(() => authFormStore.showLogin)
const showAccountRecovery = computed(() => authFormStore.showAccountRecovery)
const showRegistrationSuccessDialog = computed(() => authFormStore.showRegistrationSuccessDialog)
const showRecoveryLinkSentDialog = computed(() => authFormStore.showRecoveryLinkSentDialog)

const toggleLoginRegister = async () => {
  await authFormStore.toggleLoginRegister()
}

const resetVisibility = async () => {
  authFormStore.reset()
  authFormStore.resetErr()
}
</script>

<style scoped>
.back-button {
  @apply text-lg font-medium mx-auto w-full text-center;
}
</style>

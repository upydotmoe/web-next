import { defineStore } from "pinia";

export default defineStore('auth-form', () => {
  const showLogin = ref(true)
  const showRegistration = ref(false)
  const showAccountRecovery = ref(false)

  const loginErr = ref(false)
  const registerAlert = ref(false)
  const accountRecoveryErr = ref(false)

  const showRegistrationSuccessDialog = ref(false)

  const showRecoveryLinkSentDialog = ref(false)

  // show/hide
  const toggleLoginRegister = (state) => {
    showRegistration.value = !showRegistration.value
    showLogin.value = !showLogin.value
  }
  const toggleRegistrationForm = (state, value) => {
    showRegistration.value = value
  }
  const toggleAccountRecovery = (state) => {
    showLogin.value = !showLogin.value
    showAccountRecovery.value = !showAccountRecovery.value
  }
  const reset = (state) => {
    showLogin.value = true
    showRegistration.value = false
    showAccountRecovery.value = false
    loginErr.value = false
    registerAlert.value = false
    accountRecoveryErr.value = false
    showRegistrationSuccessDialog.value = false
    showRecoveryLinkSentDialog.value = false
  }

  // errors
  const triggerLoginErr = (state) => {
    loginErr.value = true
  }
  const triggerRegisterAlert = (state) => {
    registerAlert.value = true
  }
  const resetErr = (state) => {
    loginErr.value = false
    registerAlert.value = false
    accountRecoveryErr.value = false
    showRegistrationSuccessDialog.value = false
  }

  // registration
  const toggleSuccessDialog = (state, value) => {
    showRegistrationSuccessDialog.value = value
  }

  // account recovery
  const toggleAccountRecoveryForm = (state, value) => {
    showAccountRecovery.value = value
  }
  const triggerAccountRecoveryAlert = (state) => {
    accountRecoveryErr.value = true
  }
  const toggleShowRecoveryLinkSentDialog = (state, value) => {
    showRecoveryLinkSentDialog.value = value
  }

  return {
    showLogin,
    showRegistration,
    showAccountRecovery,
    loginErr,
    registerAlert,
    accountRecoveryErr,
    showRegistrationSuccessDialog,
    showRecoveryLinkSentDialog,

    toggleLoginRegister,
    toggleRegistrationForm,
    toggleAccountRecovery,
    reset,
    triggerLoginErr,
    triggerRegisterAlert,
    resetErr,
    toggleSuccessDialog,
    toggleAccountRecoveryForm,
    triggerAccountRecoveryAlert,
    toggleShowRecoveryLinkSentDialog,
  }
})
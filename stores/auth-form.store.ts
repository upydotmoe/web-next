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
  const toggleLoginRegister = () => {
    showRegistration.value = !showRegistration.value
    showLogin.value = !showLogin.value
  }
  const toggleRegistrationForm = (value) => {
    showRegistration.value = value
  }
  const toggleAccountRecovery = () => {
    showLogin.value = !showLogin.value
    showAccountRecovery.value = !showAccountRecovery.value

    console.log([showLogin.value, showAccountRecovery.value])
  }
  const reset = () => {
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
  const triggerLoginErr = () => {
    loginErr.value = true
  }
  const triggerRegisterAlert = () => {
    registerAlert.value = true
  }
  const resetErr = () => {
    loginErr.value = false
    registerAlert.value = false
    accountRecoveryErr.value = false
    showRegistrationSuccessDialog.value = false
  }

  // registration
  const toggleSuccessDialog = (value) => {
    showRegistrationSuccessDialog.value = value
  }

  // account recovery
  const toggleAccountRecoveryForm = (value) => {
    showAccountRecovery.value = value
  }
  const triggerAccountRecoveryAlert = () => {
    accountRecoveryErr.value = true
  }
  const toggleShowRecoveryLinkSentDialog = (value) => {
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
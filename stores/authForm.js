const state = () => ({
  showLogin: true,
  showRegistration: false,
  showAccountRecovery: false,

  loginErr: false,
  registerAlert: false,
  accountRecoveryErr: false,

  showRegistrationSuccessDialog: false,

  showRecoveryLinkSentDialog: false
})

const mutations = {
  // show/hide
  toggleLoginRegister (state) {
    state.showRegistration = !state.showRegistration
    state.showLogin = !state.showLogin
  },
  toggleRegistrationForm (state, value) {
    state.showRegistration = value
  },
  toggleAccountRecovery (state) {
    state.showLogin = !state.showLogin
    state.showAccountRecovery = !state.showAccountRecovery
  },
  reset (state) {
    state.showLogin = true
    state.showRegistration = false
    state.showAccountRecovery = false
    state.loginErr = false
    state.registerAlert = false
    state.accountRecoveryErr = false
    state.showRegistrationSuccessDialog = false
    state.showRecoveryLinkSentDialog = false
  },

  // errors
  triggerLoginErr (state) {
    state.loginErr = true
  },
  triggerRegisterAlert (state) {
    state.registerAlert = true
  },
  resetErr (state) {
    state.loginErr = false
    state.registerAlert = false
    state.accountRecoveryErr = false
    state.showRegistrationSuccessDialog = false
  },

  // registration
  toggleSuccessDialog (state, value) {
    state.showRegistrationSuccessDialog = value
  },

  // account recovery
  toggleAccountRecoveryForm (state, value) {
    state.showAccountRecovery = value
  },
  triggerAccountRecoveryAlert (state) {
    state.accountRecoveryErr = true
  },
  toggleShowRecoveryLinkSentDialog (state, value) {
    state.showRecoveryLinkSentDialog = value
  }
}

export default {
  state,
  mutations
}

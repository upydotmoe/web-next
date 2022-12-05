import shortNum from 'number-shortener'

// composables
import useDate from '~/composables/useDate'
import useDevice from '~/composables/useDevice'

export default {
  methods: {
    isMobile () {
      return useDevice().isMobile()
    },

    isMobileDevice () {
      return useDevice().isMobileDevice()
    },

    isLgScreen () {
      return useDevice().isLgScreen()
    },

    formatDate (date, timeAgo, withTime) {
      return useDate().formatDate(date, timeAgo, withTime)
    },

    shortNumber (number = 0) {
      const shortenedNumber = shortNum(number)
      return shortenedNumber
    },

    thousand (number = 0) {
      const separatedNumber = number.toLocaleString()
      return separatedNumber
    },

    applyExplicitFilter (auth, isExplicit) {
      return (!auth.loggedIn && isExplicit) || (auth.loggedIn && auth.user.user_settings && !auth.user.user_settings.show_explicit && isExplicit)
    },

    unfixedNavbarRoutes () {
      return ['work', 'profile']
    },

    fixedNavbarRoutes () {
      return ['feed']
    }
  }
}

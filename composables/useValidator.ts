export default function () {
  /**
   * Validate user input before submitting form data. This hook is used to validate user input before submitting form data.
   * @param form - The form to validate.
   * @param t - The translation function, from 'vue-i18n.useI18n.t', because we cannot use $t directly in non-setup components, 
   *            so we need to pass it from the component to here.
   */
  const validate = (form, t) => {
    // remove all current exisiting error message (.input-error class)
    document.querySelectorAll('.input-error').forEach(el => el.remove())

    // rule alerts
    let ruleAlerts = []

    // add error message to each input that has a validation error to var 'ruleAlerts'
    const addAlert = (fieldName, ruleName) => {
      ruleAlerts.push({
        [fieldName]: {
          [ruleName]: false
        }
      })
    }

    const formInputs = form.getElementsByTagName('n-validate')

    for (let i = 0; i < formInputs.length; i++) {
      const nValidate = document.getElementsByTagName('n-validate')[i]

      const fieldName = nValidate.getAttribute('for')
      
      const input = nValidate.getElementsByTagName('input')[0]

      const rules = input.getAttribute('rules').split('|')

      for (let iRules = 0; iRules < rules.length; iRules++) {
        // rule config for 'required'
        if (rules[iRules] === 'required') {
          const passRequired = validateRequired(input.value)
          
          if (!passRequired) {
            addAlert(fieldName, rules[iRules])
            const alertEl = `<div class='input-error'>${t('validation.required', { fieldName: nValidate.getAttribute('name') })}</div>`
            nValidate.insertAdjacentHTML('beforeend', alertEl)
            return
          }
        }

        // rule config for 'email'
        if (rules[iRules] === 'email') {
          const passEmail = validateEmail(input.value)

          if (!passEmail) {
            addAlert(fieldName, rules[iRules])
            const alertEl = `<div class='input-error'>${t('validation.email')}</div>`
            nValidate.insertAdjacentHTML('beforeend', alertEl)
            return
          }
        }

        // rule config for 'min:[number]'
        if (rules[iRules].startsWith('min:')) {
          const passMin = validateMin(input.value, rules[iRules].split(':')[1])

          if (!passMin) {
            addAlert(fieldName, rules[iRules])
            const alertEl = `<div class='input-error'>${t('validation.min', { fieldName: nValidate.getAttribute('name'), min: rules[iRules].split(':')[1] })}</div>`
            nValidate.insertAdjacentHTML('beforeend', alertEl)
            return
          }
        }

        // rule config for 'max:[number]
        if (rules[iRules].startsWith('max:')) {
          const passMax = validateMax(input.value, rules[iRules].split(':')[1])

          if (!passMax) {
            addAlert(fieldName, rules[iRules])
            const alertEl = `<div class='input-error'>${t('validation.max', { fieldName: nValidate.getAttribute('name'), min: rules[iRules].split(':')[1] })}</div>`
            nValidate.insertAdjacentHTML('beforeend', alertEl)
            return
          }
        }
      }
    }
  }

  /**
   * Validate rule 'required'
   * @param value - input value
   * @returns - true if value is not empty, false if value is empty
   */
  const validateRequired = (value) => value ? true : false

  /**
   * Validate rule 'email'
   * @param value - input value (string, in email format)
   * @returns - true if email format is valid, false if not
   */
  const validateEmail = (value) => {
    const emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    
    // check if email format is valid
    if (emailRegExp.test(String(value).toLowerCase())) {
      // check if domain format is correct
      return value.split('@')[1].includes('.')
    } else {
      return false
    }
  }

  /**
   * Validate rule 'min:', value of input field (min:[number])
   * @param value - input value
   * @param min - min value of input field (number)
   * @returns - true if value is greater than min value
   */
  const validateMin = (value, min) => value.length >= min ? true : false

  /**
   * Validate rule 'max:', value of input field (max:[number])
   * @param value - input value
   * @param max - max value of input field (number)
   * @returns - true if value is less than max value
   */
  const validateMax = (value, max) => value.length <= max ? true : false

  return {
    validate
  }
}
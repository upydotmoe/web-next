export default function() {
  const clear = () => {
    document.querySelectorAll('.input-error').forEach(el => el.remove())
  }

  /**
   * This hook is used to validate user input before submitting form data.
   * @param form - The form to validate.
   * @param t - The translation function, from 'vue-i18n.useI18n.t', because we cannot use $t directly in non-setup components, 
   *            so we need to pass it from the component to here.
   */
  const validate = (formId: string, t: any) => {
    const form = document.getElementById(formId)

    // remove all current exisiting error message (.input-error class)
    clear()

    // rule alerts
    let ruleAlerts = []

    // add error message to each input that has a validation error to var 'ruleAlerts'
    const addAlert = (fieldName: string, ruleName: string) => {
      ruleAlerts.push({
        [fieldName]: {
          [ruleName]: false
        }
      })
    }

    const formInputs = form!.getElementsByTagName('n-validate')

    /**
     * Loop through all inputs in the form and validate them.
     * If there is an error, add an error message to the input.
     */
    for (let i = 0; i < formInputs.length; i++) {
      const nValidate = form!.getElementsByTagName('n-validate')[i]
      
      const fieldName = nValidate.getAttribute('for')
      
      const input = nValidate.getElementsByTagName('input')[0]

      const rulesAttribute = input.getAttribute('rules')

      if (rulesAttribute === null) {
        return
      }

      const rules = rulesAttribute.split('|')

      for (let iRules = 0; iRules < rules.length; iRules++) {
        // rule config for 'required'
        if (rules[iRules] === 'required') {
          const passRequired = validateRequired(input.value)
          
          if (!passRequired) {
            addAlert(fieldName!, rules[iRules])
            const alertEl = `<div class='input-error'>${t('validation.required', { fieldName: nValidate.getAttribute('name') })}</div>`
            nValidate.insertAdjacentHTML('beforeend', alertEl)
            break
          }
        }

        // rule config for 'email'
        if (rules[iRules] === 'email') {
          const passEmail = validateEmail(input.value)

          if (!passEmail) {
            addAlert(fieldName!, rules[iRules])
            const alertEl = `<div class='input-error'>${t('validation.email')}</div>`
            nValidate.insertAdjacentHTML('beforeend', alertEl)
            break
          }
        }

        // rule config for 'min:[number]'
        if (rules[iRules].startsWith('min:')) {
          const passMin = validateMin(input.value, Number(rules[iRules].split(':')[1]))

          if (!passMin) {
            addAlert(fieldName!, rules[iRules])
            const alertEl = `<div class='input-error'>${t('validation.min', { fieldName: nValidate.getAttribute('name'), min: rules[iRules].split(':')[1] })}</div>`
            nValidate.insertAdjacentHTML('beforeend', alertEl)
            break
          }
        }

        // rule config for 'max:[number]
        if (rules[iRules].startsWith('max:')) {
          const passMax = validateMax(input.value, Number(rules[iRules].split(':')[1]))

          if (!passMax) {
            addAlert(fieldName!, rules[iRules])
            const alertEl = `<div class='input-error'>${t('validation.max', { fieldName: nValidate.getAttribute('name'), max: rules[iRules].split(':')[1] })}</div>`
            nValidate.insertAdjacentHTML('beforeend', alertEl)
            break
          }
        }

        // rule config for 'containSymbol'
        if (rules[iRules] === 'containSymbol') {
          const passContainSymbol = validateContainSymbol(input.value)

          if (!passContainSymbol) {
            addAlert(fieldName!, rules[iRules])
            const alertEl = `<div class='input-error'>${t('validation.containSymbol', { fieldName: nValidate.getAttribute('name') })}</div>`
            nValidate.insertAdjacentHTML('beforeend', alertEl)
            break
          }
        }

        // rule config for 'containNumber'
        if (rules[iRules] === 'containNumber') {
          const passContainNumber = validateContainNumber(input.value)

          if (!passContainNumber) {
            addAlert(fieldName!, rules[iRules])
            const alertEl = `<div class='input-error'>${t('validation.containNumber', { fieldName: nValidate.getAttribute('name') })}</div>`
            nValidate.insertAdjacentHTML('beforeend', alertEl)
            break
          }
        }

        // rule config for 'equal-to'
        if (rules[iRules].startsWith('equalTo:')) {
          const [fieldNameSource, passEqual] = validateEqualTo(form!, input.value, rules[iRules].split(':')[1])

          if (!passEqual) {
            addAlert(fieldName!, rules[iRules])
            const alertEl = `<div class='input-error'>${t('validation.equalTo', { fieldName: nValidate.getAttribute('name'), fieldNameSource: fieldNameSource })}</div>`
            nValidate.insertAdjacentHTML('beforeend', alertEl)
            break
          }
        }
      }
    }

    if (ruleAlerts.length) {
      throw console.warn("Didn't pass validation check, please check your form again.")
    }
  }

  /**
   * Validate rule for 'required'
   * @param value - input value
   * @returns - true if value is not empty, false if value is empty
   */
  const validateRequired = (value: string) => value ? true : false

  /**
   * Validate rule for 'email'
   * @param value - input value (string, in email format)
   * @returns - true if email format is valid, false if not
   */
  const validateEmail = (value: string) => {
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
   * Validate rule for 'min:', value of input field (min:[number])
   * @param value - input value
   * @param min - min value of input field (number)
   * @returns - true if value is greater than min value
   */
  const validateMin = (value: string, min: number) => value.length >= min ? true : false

  /**
   * Validate rule for 'max:', value of input field (max:[number])
   * @param value - input value
   * @param max - max value of input field (number)
   * @returns - true if value is less than max value
   */
  const validateMax = (value: string, max: number) => value.length <= max ? true : false

  /**
   * Validate rule for 'containSymbol', value of input must contain a symbol character
   * @param value - input value
   * @returns - true if value contains a symbol character, false if not
   */
  const validateContainSymbol = (value: string) => {
    const symbolRegEx = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/
    return symbolRegEx.test(value)
  }

  /**
   * Validate rule for 'containNumber', value of input must contain numeric character
   * @param value - input value
   * @returns - true if value contains numeric character, false if not
   */
  const validateContainNumber = (value: string) => {
    const numberRegEx = /\d/
    return numberRegEx.test(value)
  }

  const validateEqualTo = (form: HTMLElement, value: string, sourceForAttr: string) => {
    const sourceNValidate = form.querySelectorAll('[for="'+sourceForAttr+'"]')[0]
    const sourceInput = sourceNValidate.getElementsByTagName('input')[0]

    return [sourceNValidate.getAttribute('name'), value === sourceInput.value]
  }

  return {
    validate,
    clear
  }
}
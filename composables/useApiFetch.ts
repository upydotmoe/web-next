import { Configuration } from '~/api/openapi/configuration'
import authStore from '@/stores/auth.store'

export default function () {
  const auth = authStore()
  const authToken = null 

  /** OAPI Configuration */
  const oApiConfiguration = new Configuration({})

  /** Set default fetch options */
  const defaultHeaders = {}

  const defaultOptions = {
    ...defaultHeaders
  }

  const fetchOptions = () => {
    let options = {
      ...defaultOptions
    }

    if (auth.loggedIn) {
      options = {
        ...options,
        headers: {
          Authorization: authToken
        }
      }
    }

    return options
  }

  return {
    fetchOptions,
    oApiConfiguration
  }
}

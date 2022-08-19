import { Configuration } from '~/api/openapi/configuration'
import useAuthStore from '@/stores/auth.store'

export default function () {
  const auth = useAuthStore()

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
          Authorization: 'Bearer ' + auth.a4ht0jen
        }
      }
    }
    
    return options
  }

  /**
   * Get ReadableStream error body, because fetch API returns Response object with error body 
   * and we can't use it directly so we need to await that until its process finished so we can consume the error,
   * and we need to convert it to JSON first by using .json() method.
   * @param error - fetch Error object (Response ReadableStream)
   * 
   * @returns - Return error body as JSON object.
   */
  const consumeReadableStreamError = (error) => {
    return error.response.data.message
  }

  return {
    fetchOptions,
    oApiConfiguration,
    consumeReadableStreamError
  }
}

// @ts-nocheck
import { AuthServiceAuthenticationApi, UserApi } from "~/api/openapi/api"

// stores
import useAuthStore from '@/stores/auth.store'

// @ts-nocheck
export default function (oApiConfiguration: any, fetchOptions: any) {
  const auth = useAuthStore()

  /**
   * Authenticate user with email or username and password with the AuthService API from Swagger Codegen generated code.
   * @param params emailUsername - Email or username of user.
   * @param params password - Password of user.
   * 
   * @returns - Return user data if authentication is successful. Otherwise, return error.
   */
  const authenticate = async (params: {
    emailUsername: string,
    password: string
  }) => {
    try {
      const { data } = await new AuthServiceAuthenticationApi(oApiConfiguration)
        .authenticate({
          email_username: params.emailUsername,
          password: params.password
        })

      /**
       * save authorization data such as auth token and refresh token 
       * to auth store once user successfully authenticated.
       */
      await auth.saveAuthorizationData(data.data)
      
      return [data.success, null]
    } catch (error) {
      return [null, error.response.data]
    }
  }
  
  /**
   * Check authorization token validity, if it's not valid then logout user.
   * 
   * @retunrs - void
   */
  const checkTokenValidity = async (): Promise<boolean> => {
    if (auth.a4ht0jen === '' && auth.r43f0rt3jen === '') {
      console.error('auth token is not defined')
      return false
    } else {
      try {
        const { data } = await new AuthServiceAuthenticationApi(oApiConfiguration)
          .tokenCheck(fetchOptions)
  
        if (!data.success) {
          return false
        } else {
          return true
        }
      } catch (error) {
        console.error('token validity check error:', error)
        return false
      }
    }
  }

  /**
   * Get login user data with authorization token and save it's data to auth user store.
   * If token is not valid anymore then logout user.
   * 
   * @returns - void
   */
  const getAuthenticatedUserData = async (): Promise<void> => {
    if (auth.a4ht0jen === '' && auth.r43f0rt3jen === '') {
      auth.logout()
    } else {
      try {
        /**
         * We need to check fetchOptions value, because the first time user authenticating to the app,
         * useApiFetch() composition doesn't record Authorization token and throw empty header object.
         * 
         * Check if fetchOptions has property headers and headers.Authorization.
         */
        if (!fetchOptions.hasOwnProperty('headers') && !fetchOptions.hasOwnProperty('headers.Authorization') && auth.a4ht0jen !== '') {
          fetchOptions = {
            headers: {
              // we use 'Bearer' here because we use typescript-axios mode when generating code for API via Swagger Codegen.
              Authorization: `Bearer ${auth.a4ht0jen}`
            }
          }
        }

        const { data } = await new UserApi(oApiConfiguration)
          .getCurrentUserInfo(fetchOptions)

        // save user data to auth user store
        auth.user = data.data
      } catch (error) {
        auth.logout()
      }
    }
  }

  return {
    authenticate,
    checkTokenValidity,
    getAuthenticatedUserData
  }
}
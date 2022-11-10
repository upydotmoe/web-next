// @ts-nocheck
import { AuthServiceAuthenticationApi, AuthServiceRegistrationApi, ProApi, UserApi, UserForgotPasswordApi } from "~/api/api"

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
      return [false, useApiFetch().consumeReadableStreamError(error)]
    }
  }
  
  /**
   * Check authorization token validity, if it's no longer a valid token then try to refresh the token with refresh token.
   * If the refresh token is also no longer a valid token, then logout the user.
   * 
   * @retunrs - void
   */
  const checkTokenValidity = async (): Promise<boolean> => {
    if (auth.a4ht0jen === '' && auth.r43f0rt3jen === '') {
      return false
    } else {
      try {
        const { data } = await new AuthServiceAuthenticationApi(oApiConfiguration)
          .tokenCheck(fetchOptions)
  
        if (!data.success) {
          return await refreshAuthToken()
        } else {
          return true
        }
      } catch (error) {
        return await refreshAuthToken()
      }
    }
  }

  /**
   * Refresh auth token with refresh token
   * 
   * @returns - Return refreshed auth token if refresh is successful. Otherwise, return error.
   */
  const refreshAuthToken = async (): Promise<[boolean, any, any]> => {
    try {
      // try to refresh auth token with refresh token
      const { data } = await new AuthServiceAuthenticationApi(oApiConfiguration)
        .refreshToken(
          {
            refresh_token: auth.r43f0rt3jen
          },
          fetchOptions
        )

      if (!data.success) {
        auth.logout()
      } else {
        await auth.saveAuthorizationData({
          ...data.data,
          tokenRefreshed: true
        })
        return true
      }
    } catch (error) {
      auth.logout()
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

      // try {
        const { data } = await new UserApi(oApiConfiguration)
          .getCurrentUserInfo(fetchOptions)

        if (!data.success) {
          // auth.logout()
        } else {
          // save user data to auth user store
          auth.user = data.data

          // refresh pro subscription status
          const proData = await new ProApi(oApiConfiguration)
            .getProStatus(fetchOptions)
          
          auth.i502p00r0 = proData.data.data.is_pro

          // token refresh message
          // if (params.tokenRefreshed && params.tokenRefreshed !== undefined) {
          //   console.error('Session refreshed, please refresh the page!')
          // }
        }
      // } catch (error) {
      //   auth.logout()
      // }
    }
  }

  /**
   * Register new user account
   * @params 
   * 
   * @returns - 
   */
  const registerNewAccount = async (params: {
    email: string,
    password: string,
    gender?: 'm' | 'f',
    name?: string,
    username: string
  }) => {
    try {
      const { data } = await new AuthServiceRegistrationApi(oApiConfiguration)
        .register(
          {
            email: params.email,
            password: params.password,
            gender: params.gender,
            name: params.name,
            username: params.username
          }
        )

      return [data.success, null]
    } catch (error) {
      return [false, useApiFetch().consumeReadableStreamError(error)]
    }
  }

  /**
   * Resend email verification link to user's email
   * @param email - Email of user.
   * 
   * @returns - Return success if email verification link is sent successfully. Otherwise, return error.
   */
  const resendVerificationLink = async (email: string) => {
    try {
      const { data } = await new AuthServiceRegistrationApi(oApiConfiguration)
        .resendVerificationMail(
          {
            email
          }
        )

      return [data.success, null]
    } catch (error) {
      return [false, error]
    }
  }

  /**
   * Verify registration email with verification token
   */
  const verifyEmailAddress = async (tokens: {
    iv: string,
    content: string
  }) => {
    try {
      const { data } = await new AuthServiceRegistrationApi(oApiConfiguration)
        .verifyEmail(
          tokens.iv,
          tokens.content
        )

      return [data.success, null]
    } catch (error) {
      return [false, error]
    }
  }

  /**
   * Send instruction email for recovering an account.
   * @params email - Email of account to recover.
   * 
   * @returns - void
   */
  const recoverAccount = async (email: string) => {
    try {
      const { data } = await new UserForgotPasswordApi(oApiConfiguration)
        .sendResetPasswordInstruction(
          {
            email
          }
        )

      return [data.success, null]
    } catch (error) {
      return [false, error]
    }
  }

  return {
    authenticate,
    checkTokenValidity,
    getAuthenticatedUserData,
    refreshAuthToken,
    
    registerNewAccount,
    resendVerificationLink,
    verifyEmailAddress,

    recoverAccount
  }
}
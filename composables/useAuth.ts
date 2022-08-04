// @ts-nocheck
import { AuthServiceAuthenticationApi, UserApi } from "~/api/openapi/api"

// stores
import useAuthStore from '@/stores/auth.store'

// @ts-nocheck
export default function (oApiConfiguration: any, fetchOptions: any) {
  const authStore = useAuthStore()

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
      const { success, data, message } = await new AuthServiceAuthenticationApi(oApiConfiguration)
        .authenticate(
          {
            email_username: params.emailUsername,
            password: params.password
          }
        )

      // save authorization data once user successfully authenticated.
      await authStore.saveAuthorizationData(data)
      
      return [success, null]
    } catch (error) {
      console.log(error)
      // if (error)
    }
  }

  /**
   * Get user detail by authorization token
   */
  const getAuthenticatedUserData = async () => {
    try {
      const { success, data } = await new UserApi(oApiConfiguration)
        .getCurrentUserInfo(fetchOptions)

      return [success, data, null]
    } catch (error) {
      return [null, null, error]
    }
  }

  const checkAuthentication = async () => {

  }

  const logout = async () => {

  }

  return {
    authenticate,
    checkAuthentication,
    getAuthenticatedUserData,
    logout
  }
}
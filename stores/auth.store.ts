import { defineStore } from "pinia"

export default defineStore('auth', () => {
  const { $router } = useNuxtApp()

  const { oApiConfiguration, fetchOptions } = useApiFetch()
  const authApi = useAuth(oApiConfiguration, fetchOptions())

  /**
   * Store states
   */
  const loggedIn = ref(false)
  const a4ht0jen = ref(null)
  const r43f0rt3jen = ref(null)
  const user = ref({})

  /**
   * @methods
   */
  /**
   * Record authorization data such as auth token and refresh auth token once user successfully authenticated.
   * And then fetch user data and save it to auth user store.
   * @param authorizationData token - Authentication token retrieved from authentication process
   * @param authorizationData refresh_token - Refresh token retrieved from authentication process
   * 
   * @returns - void
   */
  const saveAuthorizationData = async (authorizationData: {
    token: string,
    refresh_token: string,
    tokenRefreshed?: boolean
  }): Promise<void> => {
    if (authorizationData && authorizationData.token && authorizationData.refresh_token) {
      a4ht0jen.value = authorizationData.token
      r43f0rt3jen.value = authorizationData.refresh_token
      loggedIn.value = true

      // fetch logged in user data after authentication is successful and save to auth user store
      await authApi.getAuthenticatedUserData({
        tokenRefreshed: authorizationData.tokenRefreshed
      })
    }
  }

  /**
   * Revoke user authentication
   * @returns void
   */
  const logout = (): void => {
    loggedIn.value = false
    a4ht0jen.value = null
    r43f0rt3jen.value = null
    user.value = {}

    // redirect to explore page 
    $router.push('/explore')
  }
  /**
   * @methods
   */

  return {
    // states
    loggedIn,
    a4ht0jen,
    r43f0rt3jen,
    user,

    // methods
    saveAuthorizationData,
    logout
  }
}, {
  persist: true
})
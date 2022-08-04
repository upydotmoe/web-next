import { defineStore } from "pinia"

export default defineStore('auth', () => {
  const { oApiConfiguration, fetchOptions } = useApiFetch()
  const authApi = useAuth(oApiConfiguration, fetchOptions())

  const loggedIn = ref(false)
  const a4ht0jen = ref(null)
  const r43f0rt3jen = ref(null)
  const user = ref({})

  /**
   * Record authorization data such as auth token and refresh auth token once user successfully authenticated.
   * @param authorizationData 
   */
  const saveAuthorizationData = (authorizationData: {
    token: string,
    refresh_token: string
  }) => {
    if (authorizationData && authorizationData.token && authorizationData.refresh_token) {
      a4ht0jen.value = authorizationData.token
      r43f0rt3jen.value = authorizationData.refresh_token

      getAuthenticatedUserInfo()

      console.log('auth store: Auth data saved!', {
        a4ht0jen: a4ht0jen.value,
        r43f0rt3jen: r43f0rt3jen.value
      })
    }
  }

  /**
   * Get authenticated user info
   * @returns void
   */
  const getAuthenticatedUserInfo = async () => {
    try {
      const [success, data, error] = await authApi.getAuthenticatedUserData()

      if (success) {
        user.value = data
      } else {
        await logout()
      }
    } catch (error) {
      await logout()
    }
  }

  /**
   * Revoke user authentication
   * @returns void
   */
  const logout = async () => {
    loggedIn.value = false
    a4ht0jen.value = null
    r43f0rt3jen.value = null
    user.value = {}
  }

  return {
    loggedIn,
    a4ht0jen,
    r43f0rt3jen,
    user,
    getAuthenticatedUserInfo,
    saveAuthorizationData,
    logout
  }
}, {
  persist: true
})
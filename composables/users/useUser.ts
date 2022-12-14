// @ts-nocheck
import {
  UserApi,
  UserCountersApi,
  UserFollowingFollowersApi,
  UserUpdateUserInfoApi,
  AuthServiceRegistrationApi,
  UserChangeUserMediaApi,
  SearchApi,
  UserForgotPasswordApi,
  UserChangePasswordApi
} from '~/api/api'

export default function (oApiConfiguration: any, fetchOptions: any) {
  const checkUsernameAvailability = async (username: string) => {
    try {
      const { data } = await new AuthServiceRegistrationApi(oApiConfiguration)
        .checkUsername({
          username
        })

      if (data.success) {
        return [data.success, null]
      } else {
        return [null, 'Username is already taken']
      }
    } catch (error) {
      return [null, useApiFetch().consumeReadableStreamError(error)]
    }
  }

  const checkPenNameAvailability = async (penName: string) => {
    try {
      const { data } = await new UserApi(oApiConfiguration)
        .penNameCheck(penName, fetchOptions)

      if (data.success) {
        return [data.success, null]
      } else {
        return [null, 'Pen name is already taken']
      }
    } catch (error) {
      return [null, useApiFetch().consumeReadableStreamError(error)]
    }
  }

  const getInfo = async (userId: number) => {
    try {
      const { data } = await new UserApi(oApiConfiguration)
        .getUserInfoById(userId.toString(), fetchOptions)
      
      return [data.data, null]
    } catch (error) {
      return [null, useApiFetch().consumeReadableStreamError(error)]
    }
  }

  const getInfoByUsername = async (username: string) => {
    try {
      const { data } = await new UserApi(oApiConfiguration)
        .getUserInfoByUsername(
          username,
          fetchOptions
        )

      return [data.data, null]
    } catch (error) {
      return [null, useApiFetch().consumeReadableStreamError(error)]
    }
  }

  const searchUsers = async (params: {
    keyword: string,
    pagination: {
      page: number,
      perPage: number
    }
  }) => {
    try {
      const { data } = await new SearchApi(oApiConfiguration)
        .searchUsers(
          params.keyword,
          params.pagination.page,
          params.pagination.perPage,
          fetchOptions
        )
          
      return [data.data, null]
    } catch (error) {
      return [null, useApiFetch().consumeReadableStreamError(error)]
    }
  }

  const countFeeds = async (userId: number) => {
    try {
      const { data } = await new UserCountersApi(oApiConfiguration)
        .countUserFeeds(
          userId,
          fetchOptions
        )

      return [data.data.total, null]
    } catch (error) {
      return [null, useApiFetch().consumeReadableStreamError(error)]
    }
  }

  const countArtworks = async (userId: number) => {
    try {
      const { data } = await new UserCountersApi(oApiConfiguration)
        .countUserArtworks(
          userId,
          fetchOptions
        )

      return [data.data.total, null]
    } catch (error) {
      return [null, useApiFetch().consumeReadableStreamError(error)]
    }
  }

  /**
   * FOLLOWS ================================================================================================================================
   */
  const countFollowers = async (userId: number) => {
    try {
      const { data } = await new UserFollowingFollowersApi(oApiConfiguration)
        .countFollowers(userId)

      return [data.data.total, null]
    } catch (error) {
      return [null, useApiFetch().consumeReadableStreamError(error)]
    }
  }

  const countFollowings = async (userId: number) => {
    try {
      const { data } = await new UserFollowingFollowersApi(oApiConfiguration)
        .countFollowings(userId)

      return [data.data.total, null]
    } catch (error) {
      return [null, useApiFetch().consumeReadableStreamError(error)]
    }
  }

  const isFollowing = async (userIdToCheck: number) => {
    try {
      const { data } = await new UserFollowingFollowersApi(oApiConfiguration)
        .isFollowing(userIdToCheck, fetchOptions)

      return [data.data, null]
    } catch (error) {
      return [null, useApiFetch().consumeReadableStreamError(error)]
    }
  }

  const follow = async (userToFollow: number) => {
    try {
      const { data } = await new UserFollowingFollowersApi(oApiConfiguration)
        .followUser(userToFollow, fetchOptions)

      return [data.success, null]
    } catch (error) {
      return [null, useApiFetch().consumeReadableStreamError(error)]
    }
  }
  
  const followPrivately = async (userToFollow: number) => {
    try {
      const { data } = await new UserFollowingFollowersApi(oApiConfiguration)
        .followUserPrivately(
          userToFollow,
          true,
          fetchOptions
        )

      return [data.success, null]
    } catch (error) {
      return [null, useApiFetch().consumeReadableStreamError(error)]
    }
  }

  const unfollow = async (userToUnfollow: number) => {
    try {
      const { data } = await new UserFollowingFollowersApi(oApiConfiguration)
        .unfollowUser(userToUnfollow, fetchOptions)

      return [data.success, null]
    } catch (error) {
      return [null, useApiFetch().consumeReadableStreamError(error)]
    }
  }

  const getFollowerList = async (params: {
    userId: number,
    pagination: {
      page: number,
      perPage: number
    }
  }) => {
    try {
      const { data } = await new UserFollowingFollowersApi(oApiConfiguration)
        .followersList(
          params.userId,
          params.pagination.page,
          params.pagination.perPage,
          fetchOptions
        )

      return [data.data, null]
    } catch (error) {
      return [null, useApiFetch().consumeReadableStreamError(error)]
    }
  }

  const getFollowingList = async (params: {
    userId: number,
    isPrivateOnly: 0 | 1,
    pagination: {
      page: number,
      perPage: number
    }
  }) => {
    try {
      const { data } = await new UserFollowingFollowersApi(oApiConfiguration)
        .followingList(
          params.userId, 
          params.isPrivateOnly,
          params.pagination.page,
          params.pagination.perPage,
          fetchOptions
        )

      return [data.data, null]
    } catch (error) {
      return [null, useApiFetch().consumeReadableStreamError(error)]
    }
  }

  const toggleFollowerPrivacy = async () => {
    try {
      const { data } = await new UserFollowingFollowersApi(oApiConfiguration)
        .toggleFollowersVisibility(fetchOptions)
        
      return [data.success, null]
    } catch (error) {
      return [null, useApiFetch().consumeReadableStreamError(error)]
    }
  }

  const toggleFollowingPrivacy = async () => {
    try {
      const { data } = await new UserFollowingFollowersApi(oApiConfiguration)
        .toggleFollowingsVisibility(fetchOptions)

      return [data.success, null]
    } catch (error) {
      return [null, useApiFetch().consumeReadableStreamError(error)]
    }
  }

  /**
   * UPDATES =================================================================================================================================
  */
  const updateInfo = async (params: {
    userId: number,
    name: string,
    gender: 'm' | 'f',
    bio: string,
    location: string,
    penName: string
  }) => {
    try {
      const { data } = await new UserUpdateUserInfoApi(oApiConfiguration)
        .updateUserInfo({
          id: params.userId,
          name: params.name,
          // @ts-ignore: Swagger doesn't recognize given value as accepted enum value
          gender: params.gender,
          bio: params.bio,
          location: params.location,
          pen_name: params.penName
        }, fetchOptions)

      return [data.success, null]
    } catch (error) {
      return [null, useApiFetch().consumeReadableStreamError(error)]
    }
  }

  const updateSocials = async (params: {
    userId: number,
    facebook: string,
    twitter: string,
    instagram: string,
    patreon: string,
    youtube: string,
    twitch: string,
    discord: string,
    picarto: string,
    gumroad: string,
    site: string,
  }) => {
    try {
      const { data } = await new UserUpdateUserInfoApi(oApiConfiguration)
        .updateUserSocial({
          id: params.userId,
          facebook: params.facebook,
          twitter: params.twitter,
          instagram: params.instagram,
          patreon: params.patreon,
          youtube: params.youtube,
          twitch: params.twitch,
          discord: params.discord,
          picarto: params.picarto,
          gumroad: params.gumroad,
          personal_website: params.site,
        }, fetchOptions)

      return [data.success, null]
    } catch (error) {
      return [null, useApiFetch().consumeReadableStreamError(error)]
    }
  }

  const updateSettings = async (params: {
    userId: number,
    showExplicit: boolean,
    showGore: boolean
  }) => {
    try {
      const { data } = await new UserUpdateUserInfoApi(oApiConfiguration)
        .updateUserPreference({
          id: params.userId,
          // @ts-ignore: Swagger convert any underscores to camelCase style
          show_explicit: params.showExplicit ? 1 : 0,
          show_gore: params.showGore ? 1 : 0
        }, fetchOptions)

      return [data.success, null]
    } catch (error) {
      return [null, useApiFetch().consumeReadableStreamError(error)]
    }
  }

  const changeUsername = async (username: string) => {
    try {
      const { data } = await new UserUpdateUserInfoApi(oApiConfiguration)
        .changeUsername({
          // @ts-ignore: Swagger convert any underscores to camelCase style
          new_username: username
        }, fetchOptions)

      return [data.success, null]
    } catch (error) {
      return [null, useApiFetch().consumeReadableStreamError(error)]
    }
  }

  const updateAvatar = async (avatar: Blob) => {
    try {
      const { data } = await new UserChangeUserMediaApi(oApiConfiguration)
        .updateAvatarForm(avatar, fetchOptions)

      return [data.success, null]
    } catch (error) {
      return [null, useApiFetch().consumeReadableStreamError(error)]
    }
  }

  const checkCurrentPassword = async (params: {
    userId: number,
    currentPassword: string
  }) => {
    try {
      const { data } = await new UserChangePasswordApi(oApiConfiguration)
        .checkCurrentPassword(
          {
            user_id: params.userId,
            current_password: params.currentPassword
          },
          fetchOptions
        )

      return [data, null]
    } catch (error) {
      return [null, useApiFetch().consumeReadableStreamError(error)]
    }
  }

  const updateCurrentPassword = async (params: {
    userId: number
    currentPassword: string,
    newPassword: string
  }) => {
    try {
      const { data } = await new UserChangePasswordApi(oApiConfiguration)
        .changePassword(
          {
            user_id: params.userId,
            current_password: params.currentPassword,
            new_password: params.newPassword
          },
          fetchOptions
        )

      return [data, null]
    } catch (error) {
      return [null, useApiFetch().consumeReadableStreamError(error)]
    }
  }

  const checkResetPasswordTokenValidity = async (params: {
    iv: string,
    content: string
  }) => {
    try {
      const { data } = await new UserForgotPasswordApi(oApiConfiguration)
        .checkResetPasswordTokenValidity(params.iv, params.content)
        
      return [data.data, null]
    } catch (error) {
      return [null, useApiFetch().consumeReadableStreamError(error)]
    }
  }

  const resetPassword = async (params: {
    iv: string,
    content: string,
    newPassword: string
  }) => {
    try {
      const { data } = await new UserForgotPasswordApi(oApiConfiguration)
        .recoverChangePassword(
          {
            iv: params.iv,
            content: params.content,
            new_password: params.newPassword
          }
        )

      return [data, null]
    } catch (error) {
      return [null, useApiFetch().consumeReadableStreamError(error)]
    }
  }

  return {
    checkUsernameAvailability,
    checkPenNameAvailability,
    getInfo,
    getInfoByUsername,
    searchUsers,

    updateInfo,
    updateSocials,
    updateSettings,
    changeUsername,
    updateAvatar,

    countFeeds,
    countArtworks,

    countFollowers,
    countFollowings,
    isFollowing,
    follow,
    followPrivately,
    unfollow,
    getFollowerList,
    getFollowingList,
    toggleFollowerPrivacy,
    toggleFollowingPrivacy,

    checkCurrentPassword,
    updateCurrentPassword,
    checkResetPasswordTokenValidity,
    resetPassword
  }
}

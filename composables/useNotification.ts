import {
  NotificationsArtworksLikesApi,
  NotificationsArtworksCommentsApi,
  NotificationsUsersApi,
  NotificationsMarkersArtworksApi,
  NotificationsMarkersUsersApi,
  NotificationsMarkersApi,
  NotificationsFeedsApi,
  NotificationsMarkersFeedsApi
} from '~/api/api'

export default function (oApiConfiguration: any, fetchOptions: any) {
  /**
   * == ARTWORK LIKES NOTIFICATION MODULE ==
   */
  const getArtworkLikesNotification = async (params: {
    showLimit: number,
    pagination: {
      page: number,
      perPage: number
    }
  }) => {    
    try {
      const { data } = await new NotificationsArtworksLikesApi(oApiConfiguration)
        .getArtworkLikedNotifications(
          params.showLimit,
          params.pagination.page,
          params.pagination.perPage,
          fetchOptions
        )
      
      return [data.data, null]
    } catch (error) {
      return [null, error]
    }
  }

  const markArtworkLikeAsRead = async (params: {
    userLikerId: number,
    workId: number
  }) => {
    try {
      const { data } = await new NotificationsArtworksLikesApi(oApiConfiguration)
        .markArtworkLikeNotificationAsRead(
          params.workId,
          fetchOptions
        )

      return [data.success, null]
    } catch (error) {
      return [null, error]
    }
  }

  const markAllArtworkLikeAsRead = async () => {
    try {
      const { data } = await new NotificationsArtworksLikesApi(oApiConfiguration)
        .readAllArtworkLikeNotifications(fetchOptions)

      return [data.success, null]
    } catch (error) {
      return [null, error]
    }
  }

  const clearArtworkLikeNotifs = async () => {
    try {
      const { data } = await new NotificationsArtworksLikesApi(oApiConfiguration)
        .clearAllArtworkLikeNotifications(fetchOptions)

      return [data.success, null]
    } catch (error) {
      return [null, error]
    }
  }

  /**
   * == ARTWORK COMMENTS NOTIFICATION MODULE ==
   */
  const getArtworkCommentNotifications = async (params: {
    // showLimit: number,
    pagination: {
      page: number,
      perPage: number
    }
  }) => {
    try {
      const { data } = await new NotificationsArtworksCommentsApi(oApiConfiguration)
        .getArtworkCommentNotifications(
          params.pagination.page,
          params.pagination.perPage,
          fetchOptions
        )

      return [data.data, null]
    } catch (error) {
      return [null, error]
    }
  }

  const getArtworkCommentLikeNotifications = async (params: {
    showLimit: number,
    pagination: {
      page: number,
      perPage: number
    }
  }) => {
    try {
      const { data } = await new NotificationsArtworksCommentsApi(oApiConfiguration)
        .getArtworkCommentLikedNotifications(
          params.showLimit,
          params.pagination.page,
          params.pagination.perPage,
          fetchOptions
        )

      return [data.data, null]
    } catch (error) {
      return [null, error]
    }
  }

  const markArtworkCommentLikeNotificationAsRead = async (params: {
    commentId: number
  }) => {
    try {
      const { data } = await new NotificationsArtworksCommentsApi(oApiConfiguration)
        .markArtworkCommentLikeNotificationAsRead(
          params.commentId,
          fetchOptions
        )

      return [data.success, null]
    } catch (error) {
      return [null, error]
    }
  }

  const getArtworkCommentReplyNotifications = async (params: {
    showLimit: number,
    pagination: {
      page: number,
      perPage: number
    }
  }) => {
    try {
      const { data } = await new NotificationsArtworksCommentsApi(oApiConfiguration)
        .getArtworkCommentReplyNotifications(
          params.showLimit,
          params.pagination.page,
          params.pagination.perPage,
          fetchOptions
        )

      return [data.data, null]
    } catch (error) {
      return [null, error]
    }
  }

  const markArtworkCommentReplyNotificationAsRead = async (params: {
    commentId: number
  }) => {
    try {
      const { data } = await new NotificationsArtworksCommentsApi(oApiConfiguration)
        .markArtworkCommentReplyNotificationAsRead(
          params.commentId,
          fetchOptions
        )

      return [data.success, null]
    } catch (error) {
      return [null, error]
    }
  }

  const getArtworkCommentReplyLikeNotifications = async (params: {
    showLimit: number,
    pagination: {
      page: number,
      perPage: number
    }
  }) => {
    try {
      const { data } = await new NotificationsArtworksCommentsApi(oApiConfiguration)
        .getArtworkCommentReplyLikedNotifications(
          params.showLimit,
          params.pagination.page,
          params.pagination.perPage,
          fetchOptions
        )

      return [data.data, null]
    } catch (error) {
      return [null, error]
    }
  }

  const markCommentNotificationAsRead = async (params: {
    workId: number,
    commentId: number
  }) => {
    try {
      const { data } = await new NotificationsArtworksCommentsApi(oApiConfiguration, fetchOptions)
        .markArtworkCommentNotificationAsRead(
          params.workId,
          params.commentId,
          fetchOptions
        )

      return [data.success, null]
    } catch (error) {
      return [null, error]
    }
  }

  const markAllCommentAndReplyNotificationAsRead = async () => {
    try {
      const { data } = await new NotificationsArtworksCommentsApi(oApiConfiguration, fetchOptions)
        .readAllArtworkCommentAndReplyNotifications(fetchOptions)

      return [data.success, null]
    } catch (error) {
      return [null, error]
    }
  }

  const clearAllCommentAndReplyNotifications = async () => {
    try {
      const { data } = await new NotificationsArtworksCommentsApi(oApiConfiguration, fetchOptions)
        .clearAllArtworkCommentAndReplyNotifications(fetchOptions)

      return [data.success, null]
    } catch (error) {
      return [null, error]
    }
  }

  /**
   * USER RELATED NOTIFICATIONS
   */
  const getFollowNotifications = async (params: {
    pagination: {
      page: number,
      perPage: number
    }
  }) => {
    try {
      const { data } = await new NotificationsUsersApi(oApiConfiguration)
        .getUserFollowNotifications(
          params.pagination.page,
          params.pagination.perPage,
          fetchOptions
        )

      return [data.data, null]
    } catch (error) {
      return [null, error]
    }
  }

  const markUserFollowAsRead = async (params: {
    followerId: number
  }) => {
    try {
      const { data } = await new NotificationsUsersApi(oApiConfiguration)
        .markUserFollowNotificationAsRead(
          params.followerId,
          fetchOptions
        )

      return [data.success, null]
    } catch (error) {
      return [null, error]
    }
  }

  const markAllUserFollowAsRead = async () => {
    try {
      const { data } = await new NotificationsUsersApi(oApiConfiguration)
        .markAllUserFollowNotificationAsRead(
          fetchOptions
        )

      return [data.success, null]
    } catch (error) {
      return [null, error]
    }
  }

  const clearUserFollowNotifications = async () => {
    try {
      const { data } = await new NotificationsUsersApi(oApiConfiguration)
        .clearUserFollowNotifications(
          fetchOptions
        )

      return [data.success, null]
    } catch (error) {
      return [null, error]
    }
  }

  /**
   * ===============================================================================================================================================
   * MARKERS
   * ===============================================================================================================================================
   */
  const countAllNotifications = async () => {
    try {
      const { data } = await new NotificationsMarkersApi(oApiConfiguration)
        .getMarkers(fetchOptions)

      return [data.data, null]
    } catch (error) {
      return [null, error]
    }
  }

  const clearNotificationCounter = async () => {
    try {
      const { data } = await new NotificationsMarkersApi(oApiConfiguration)
        .clearMarkers(fetchOptions)

      return [data.success, null]
    } catch (error) {
      return [null, error]
    }
  }

  const countArtworkLikeNotifications = async () => {
    try {
      const { data } = await new NotificationsMarkersArtworksApi(oApiConfiguration)
        .getArtworkLikeMarker(fetchOptions)

      return [data.data, null]
    } catch (error) {
      return [null, error]
    }
  }

  const countArtworkCommentNotifications = async () => {
    try {
      const { data } = await new NotificationsMarkersArtworksApi(oApiConfiguration)
        .getArtworkCommentMarker(fetchOptions)

      return [data.data, null]
    } catch (error) {
      return [null, error]
    }
  }

  const countArtworkCommentLikeNotifications = async () => {
    try {
      const { data } = await new NotificationsMarkersArtworksApi(oApiConfiguration)
        .getArtworkCommentLikedMarker(fetchOptions)

      return [data.data, null]
    } catch (error) {
      return [null, error]
    }
  }

  const countArtworkCommentReplyNotifications = async () => {
    try {
      const { data } = await new NotificationsMarkersArtworksApi(oApiConfiguration)
        .getArtworkCommentRepliesMarker(fetchOptions)

      return [data.data, null]
    } catch (error) {
      return [null, error]
    }
  }

  const countArtworkCommentReplyLikeNotifications = async () => {
    try {
      const { data } = await new NotificationsMarkersArtworksApi(oApiConfiguration)
        .getArtworkCommentReplyLikesMarker(fetchOptions)

      return [data.data, null]
    } catch (error) {
      return [null, error]
    }
  }

  const countArtworkCommentRelatedNotifications = async () => {
    try {
      const { data } = await new NotificationsMarkersArtworksApi(oApiConfiguration)
        .getArtworkCommentsAndRepliesMarker(fetchOptions)

      return [data.data, null]
    } catch (error) {
      return [null, error]
    }
  }

  const countUserFollowNotifications = async () => {
    try {
      const { data } = await new NotificationsMarkersUsersApi(oApiConfiguration)
        .getUserFollowMarker(fetchOptions)

      return [data.data, null]
    } catch (error) {
      return [null, error]
    }
  }

  const getFeedNotifications = async (params: {
    showLimit: number,
    pagination: {
      page: number,
      perPage: number
    }
  }) => {
    try {
      const { data } = await new NotificationsFeedsApi(oApiConfiguration)
        .getFeedNotifications(
          params.showLimit,
          params.pagination.page,
          params.pagination.perPage,
          fetchOptions
        )

      return [data.data, null]
    } catch (error) {
      return [null, error]
    }
  }

  const markFeedNotificationAsRead = async (params: {
    type: 'like' | 'comment',
    feedId: number
  }) => {
    try {
      const { data } = await new NotificationsFeedsApi(oApiConfiguration)
        .markFeedNotificationAsRead(
          params.type,
          params.feedId,
          fetchOptions
        )

      return [data.success, null]
    } catch (error) {
      return [null, error]
    }
  }

  const markAllFeedNotificationAsRead = async () => {
    try {
      const { data } = await new NotificationsFeedsApi(oApiConfiguration)
        .markAllFeedNotificationsAsRead(fetchOptions)

      return [data.success, null]
    } catch (error) {
      return [null, error]
    }
  }

  const clearAllFeedNotifications = async () => {
    try {
      const { data } = await new NotificationsFeedsApi(oApiConfiguration)
        .clearAllFeedNotifications(fetchOptions)

      return [data.success, null]
    } catch (error) {
      return [null, error]
    }
  }

  const countFeedNotifications = async () => {
    try {
      const { data } = await new NotificationsMarkersFeedsApi(oApiConfiguration)
        .countFeedNotifications(fetchOptions)

      return [data.data, null]
    } catch (error) {
      return [null, error]
    }
  }

  return {
    getArtworkLikesNotification,
    markArtworkLikeAsRead,
    markAllArtworkLikeAsRead,
    clearArtworkLikeNotifs,

    getArtworkCommentNotifications,
    markCommentNotificationAsRead,

    getArtworkCommentLikeNotifications,
    markArtworkCommentLikeNotificationAsRead,

    getArtworkCommentReplyNotifications,
    markArtworkCommentReplyNotificationAsRead,

    getArtworkCommentReplyLikeNotifications,
    
    markAllCommentAndReplyNotificationAsRead,
    clearAllCommentAndReplyNotifications,

    getFollowNotifications,
    markUserFollowAsRead,
    markAllUserFollowAsRead,
    clearUserFollowNotifications,

    // markers
    countAllNotifications,
    clearNotificationCounter,

    countArtworkLikeNotifications,
    countArtworkCommentNotifications,
    countArtworkCommentLikeNotifications,
    countArtworkCommentReplyNotifications,
    countArtworkCommentReplyLikeNotifications,
    countArtworkCommentRelatedNotifications,

    countUserFollowNotifications,

    // feeds
    getFeedNotifications,
    markFeedNotificationAsRead,
    markAllFeedNotificationAsRead,
    clearAllFeedNotifications,
    countFeedNotifications
  }
}

// @ts-nocheck
import {
  FeedsApi
} from '~/api/openapi/api'

export default function (oApiConfiguration: any, fetchOptions: any) {
  const postFeed = async (params: {
    text: string,
    visibility: 'public' | 'followers',
    whoCanReply: 'public' | 'followers'
  }) => {
    try {
      const { success, data } = await new FeedsApi(oApiConfiguration)
        .createFeed(
          {
            text: params.content,
            visibility: params.visibility,
            who_can_reply: params.whoCanReply
          },
          fetchOptions
        )

      return [success, data, null]
    } catch (error) {
      return [null, null, error]
    }
  }

  const feedDetail = async (params: {
    id: number
  }) => {
    try {
      const { data } = await new FeedsApi(oApiConfiguration)
        .getFeedById(
          params.id,
          fetchOptions
        )

      return [data, null]
    } catch (error) {
      return [null, error]
    }
  }

  const getChronologicalFeeds = async (params: {
    explicitMode?: boolean,
    pagination: {
      page: number,
      perPage: number
    }
  }) => {
    try {
      const { data } = await new FeedsApi(oApiConfiguration)
        .getFeeds(
          params.pagination.perPage,
          params.pagination.page,
          params.explicitMode,
          fetchOptions
        )

      return [data, null]
    } catch (error) {
      return [null, error]
    }
  }

  const getFeedByUserId = async (params: {
    userId: number,
    pagination: {
      page: number,
      perPage: number
    }
  }) => {
    try {
      const { data } = await new FeedsApi(oApiConfiguration)
        .getFeedsByUserId(
          params.userId,
          params.pagination.page,
          params.pagination.perPage,
          fetchOptions
        )

      return [data, null]
    } catch (error) {
      return [null, error]
    }
  }

  const like = async (params: {
    feedId: number
  }) => {
    try {
      const { success } = await new FeedsApi(oApiConfiguration)
        .likeFeed(
          params.feedId,
          fetchOptions
        )

      return [success, null]
    } catch (error) {
      return [null, error]
    }
  }

  const unlike = async (params: {
    feedId: number
  }) => {
    try {
      const { success } = await new FeedsApi(oApiConfiguration)
        .unlikeFeed(
          params.feedId,
          fetchOptions
        )

      return [success, null]
    } catch (error) {
      return [null, error]
    }
  }
  
  // comments
  const fetchComments = async (params: {
    feedId: number,
    pagination: {
      page: number,
      perPage: number
    }
  }) => {
    try {
      const { data, error } = await new FeedsApi(oApiConfiguration)
        .getFeedComments(
          params.feedId,
          params.pagination.page,
          params.pagination.perPage,
          fetchOptions
        )

      return [data, error]
    } catch (error) {
      return [null, error]
    }
  }

  const comment = async (params: {
    feedId: number,
    comment: string
  }) => {
    try {
      const { success, data } = await new FeedsApi(oApiConfiguration)
        .commentFeed(
          {
            feed_id: params.feedId,
            comment: params.comment
          }, 
          fetchOptions
        )

      return [success, data, null]
    } catch (error) {
      return [null, null, error]
    }
  }

  return {
    postFeed,

    feedDetail,
    getChronologicalFeeds,
    getFeedByUserId,

    like,
    unlike,

    fetchComments,
    comment
  }
}

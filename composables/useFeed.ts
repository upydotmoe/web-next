// @ts-nocheck
import {
  FeedsApi
} from '~/api/api'

export default function (oApiConfiguration: any, fetchOptions: any) {
  const postFeed = async (params: {
    text: string,
    visibility: 'public' | 'followers',
    whoCanReply: 'public' | 'followers'
  }) => {
    try {
      const { data } = await new FeedsApi(oApiConfiguration)
        .createFeed(
          {
            text: params.text,
            visibility: params.visibility,
            who_can_reply: params.whoCanReply
          },
          fetchOptions
        )

      return [data.success, data.data, null]
    } catch (error) {
      return [null, null, useApiFetch().consumeReadableStreamError(error)]
    }
  }

  const shareArtworkToFeed = async (params: {
    text: string,
    visibility: 'public' | 'followers',
    whoCanreply: 'public' | 'followers',
    workId: number
  }) => {
    try {
      const { data } = await new FeedsApi(oApiConfiguration)
        .createFeed(
          {
            text: params.text,
            visibility: params.visibility,
            who_can_reply: params.whoCanReply,
            work_id: params.workId
          },
          fetchOptions
        )

      return [data.success, data.data, null]
    } catch (error) {
      return [null, null, useApiFetch().consumeReadableStreamError(error)]
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

      return [data.data, null]
    } catch (error) {
      return [null, useApiFetch().consumeReadableStreamError(error)]
    }
  }

  const getChronologicalFeeds = async (params: {
    fetchMode: 'feed' | 'text' | 'artwork',
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
          params.fetchMode,
          params.explicitMode,
          fetchOptions
        )

      return [data.data, null]
    } catch (error) {
      return [null, useApiFetch().consumeReadableStreamError(error)]
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

      return [data.data, null]
    } catch (error) {
      return [null, useApiFetch().consumeReadableStreamError(error)]
    }
  }

  const like = async (params: {
    feedId: number
  }) => {
    try {
      const { data } = await new FeedsApi(oApiConfiguration)
        .likeFeed(
          params.feedId,
          fetchOptions
        )

      return [data.success, null]
    } catch (error) {
      return [null, useApiFetch().consumeReadableStreamError(error)]
    }
  }

  const unlike = async (params: {
    feedId: number
  }) => {
    try {
      const { data } = await new FeedsApi(oApiConfiguration)
        .unlikeFeed(
          params.feedId,
          fetchOptions
        )

      return [data.success, null]
    } catch (error) {
      return [null, useApiFetch().consumeReadableStreamError(error)]
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

      return [data.data, useApiFetch().consumeReadableStreamError(error)]
    } catch (error) {
      return [null, useApiFetch().consumeReadableStreamError(error)]
    }
  }

  const comment = async (params: {
    feedId: number,
    comment: string
  }) => {
    try {
      const { data } = await new FeedsApi(oApiConfiguration)
        .commentFeed(
          {
            feed_id: params.feedId,
            comment: params.comment
          }, 
          fetchOptions
        )

      return [data.success, data.data, null]
    } catch (error) {
      return [null, null, useApiFetch().consumeReadableStreamError(error)]
    }
  }

  /**
   * Remove/delete a feed
   */
  const remove = async (feedId: number) => {
    try {
      const { data } = await new FeedsApi(oApiConfiguration)
        .deleteFeed(
          feedId,
          fetchOptions
        )
      
      return [data.success, null]
    } catch (error) {
      return [false, useApiFetch().consumeReadableStreamError(error)]
    }
  }

  return {
    postFeed,
    shareArtworkToFeed,

    feedDetail,
    getChronologicalFeeds,
    getFeedByUserId,

    like,
    unlike,

    fetchComments,
    comment,

    remove
  }
}

// @ts-nocheck
import {
  ArtworkCommentsApi,
  ArtworkCommentsLikesApi,
  ArtworkCommentsRepliesApi,
  ArtworkCRUDApi,
  ArtworkLikesApi,
  ArtworkListApi,
  ArtworksApi,
  ArtworkTagsApi,
  ArtworkViewsApi,
  SearchApi
} from '~/api/openapi/api'
import { Configuration } from '~/api/openapi'

export default function (oApiConfiguration: any, fetchOptions: any) {
  /**
   * @artworkListApi
   */
  /**
   * Get a list of most popular artworks
   * @param params pagination.perPage - The number of comments to get per page
   * @param params pagination.page - The page of comments to get
   * @param params range - The range of dates to get artworks for, there are 4 options: daily, weekly, monthly, and all, default is daily
   * @param params rangeMode - The range mode of the range, 
   *               there are 4 options: by likes, comments, views or none
   *               default is none (which means the combination of total of likes, comments, and views)
   * @param params explicitMode - The explicit mode of the range, if explicit mode is set to safe then only safe content will be returned
   *               default is safe, but if user is logged in, then the setting is determined by the user preference which can be safe or explicit
   *               if user set the preference to explicit, then both safe and explicit content will be returned by default
   * @param params tags - The tag filters to get artworks for (comma separated)
   * @param params followingOnly - If true, only get artworks that the user is following
   * 
   * @returns Returns a list of artworks sorted by popularity and given properties on the parameters
   */
  const getMostPopular = async (
    params: {
      pagination: {
        perPage: number,
        page: number
      },
      range: 'daily' | 'weekly' | 'monthly' | 'all',
      rangeMode: 'likes' | 'comments' | 'views' | 'none',
      explicitMode?: 'safe' | 'explicit',
      tags?: string,
      followingOnly?: boolean
    }
  ) => {
    try {
      const { data } = await new ArtworkListApi(oApiConfiguration, fetchOptions)
        .getMostPopular(
          params.pagination.perPage,
          params.pagination.page,
          params.range,
          params.rangeMode,
          params.explicitMode,
          params.tags,
          params.followingOnly,
          fetchOptions
        )

      return [data.data, null]
    } catch (error) {
      return [null, error]
    }
  }

  /**
   * Get a list of latest/recently uploaded artworks from anyone on the platform
   * @param params pagination.perPage - The number of comments to get per page
   * @param params pagination.page - The page of comments to get
   * @param params explicitMode - The explicit mode of the range, if explicit mode is set to safe then only safe content will be returned
   *               default is safe, but if user is logged in, then the setting is determined by the user preference which can be safe or explicit
   *               if user set the preference to explicit, then both safe and explicit content will be returned by default
   * @param params tags - The tag filters to get artworks for (comma separated)
   * @param params followingOnly - If true, only get artworks that the user is following
   * 
   * @returns Returns a list of latest/recently uploaded artworks to the platform with given properties on the parameters
   */
  const getLatest = async (
    params: {
      pagination: {
        perPage: number,
        page: number
      },
      explicitMode: 'safe' | 'explicit',
      tags?: string,
      followingOnly?: boolean
    }
  ) => {
    try {
      const { data } = await new ArtworkListApi(oApiConfiguration, fetchOptions)
        .getLatestWorks(
          params.pagination.perPage,
          params.pagination.page,
          params.explicitMode,
          params.tags,
          params.followingOnly,
          fetchOptions
        )
      
      // console.log('data:', data)
      return [data.data, null]   
    } catch (error) {
      return [null, error]
    }
  }

  /**
   * Get latest artworks from a followed users
   * @param params pagination.perPage - The number of comments to get per page
   * @param params pagination.page - The page of comments to get
   * @param params explicitMode - The explicit mode of the range, if explicit mode is set to safe then only safe content will be returned
   *               default is safe, but if user is logged in, then the setting is determined by the user preference which can be safe or explicit
   *               if user set the preference to explicit, then both safe and explicit content will be returned by default
   * 
   * @returns Returns a list of latest/recently uploaded artworks to the platform by followed users
   */
  const getFollowing = async (
    params: {
      pagination: {
        perPage: number,
        page: number
      },
      explicitMode: 'safe' | 'explicit'
    }
  ) => {
    try {
      const { data } = await new ArtworkListApi(oApiConfiguration, fetchOptions)
        .getFollowingArtworks(
          params.pagination.perPage,
          params.pagination.page,
          params.explicitMode,
          fetchOptions
        )

      return [data.data, null]
    } catch (error) {
      return [null, error]
    }
  }

  const getSearch = async (
    params: {
      recentMode: boolean,
      range: 'daily' | 'weekly' | 'monthly' | 'all',
      rangeMode: 'likes' | 'comments' | 'views' | 'none',
      explicitMode?: 'safe' | 'explicit',
      keyword: string,
      followingOnly?: boolean,
      pagination: {
        perPage: number,
        page: number
      },
    }
  ) => {
    try {
      const { data } = await new SearchApi(oApiConfiguration)
        .searchArtworks(
          params.keyword,
          params.range,
          params.rangeMode,
          params.pagination.page,
          params.pagination.perPage,
          params.explicitMode,
          params.followingOnly,
          params.recentMode,
          fetchOptions
        )

      return [data.data, null]
    } catch (error) {
      return [null, error]
    }
  }

  /**
   * List artwork by user ID
   */
  const getUserArtworks = async (params: {
    userId: number,
    pagination: {
      page: number,
      perPage: number
    }
  }) => {
    try {
      const { data } = await new ArtworkListApi(oApiConfiguration, fetchOptions)
        .getUserArtworks(
          params.userId,
          params.pagination.perPage,
          params.pagination.page,
          fetchOptions
        )

      return [data.data.works, data.data.pagination, null]
    } catch (error) {
      return [null, null, error]
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
      const { data } = await new ArtworkListApi(oApiConfiguration)
        .getFollowingArtworks(
          params.pagination.perPage,
          params.pagination.page,
          params.explicitMode,
          fetchOptions
        )

      return [data.data, null]
    } catch (error) {
      return [null, error]
    }
  }

  const getTagKeys = async (tags) => {
    try {
      const { data } = await new ArtworkTagsApi(oApiConfiguration)
        .getKeysByTags(
          tags,
          fetchOptions
        )

      return [data.data, null]
    } catch (error) {
      return [null, error]
    }
  }

  /**
   * @artworkApi
   */
  const getWorkById = async (id: number) => {
    try {
      const { data } = await new ArtworkCRUDApi(oApiConfiguration).view(id, fetchOptions)

      return [data.data, null]
    } catch (error) {
      return [null, error]
    }
  }

  /**
   * Increase the view count of the artwork
   * @param workId - The id of the artwork
   * 
   * @returns void
   */
  const incraseViewCount = async (workId: number) => {
    await new ArtworkViewsApi(oApiConfiguration).addViewCount(workId)
  }

  const updateInfo = async (id: number, data: any, tags: string) => {
    try {
      const { data } = await new ArtworkCRUDApi(oApiConfiguration)
        .updateWork({
          id: Number(id),
          title: data.title,
          description: data.description,
          is_explicit: data.isExplicit ? 1 : 0,
          tags
        }, fetchOptions)

      return [data.success, null]
    } catch (error) {
      return [null, error]
    }
  }

  /**
   * Delete an artwork
   * @param params workId - The id of the artwork to delete
   * 
   * @returns Returns an array of a boolean indicating if the artwork was deleted or not and an error if there was one
   */
  const deleteWork = async (params: {
    workId: number[]
  }) => {
    try {
      const { data } = await new ArtworkCRUDApi(oApiConfiguration)
        .deleteWork(
          params.workId,
          fetchOptions
        )

      return [data.success, null]
    } catch (error) {
      return [null, error]
    }
  }

  const like = async (params: {
    workId: number
  }) => {
    try {
      const { data } = await new ArtworkLikesApi(oApiConfiguration)
        .like(
          {
            id: params.workId
          },
          fetchOptions
        )

      return [data.success, null]
    } catch (error) {
      return [null, error]
    }
  }

  const unlike = async (params: {
    workId: number
  }) => {
    try {
      const { data } = await new ArtworkLikesApi(oApiConfiguration)
        .unlike(
          {
            id: params.workId
          },
          fetchOptions
        )

      return [data.success, null]
    } catch (error) {
      return [null, error]
    }
  }
  /**
   * @artworkApi
   */

  /**
   * @commentApi
   */
  /**
   * Get comments for a work
   * @param params workId - The id of the artwork to get comments for
   * @param params pagination.page - The page of comments to get
   * @param params pagination.perPage - The number of comments to get per page
   * 
   * @returns Returns an array of comments and an error if there is one
   */
  const getComments = async (params: {
    workId: number,
    pagination: {
      page: number,
      perPage: number
    }
  }) => {
    try {
      const { data } = await new ArtworkCommentsApi(oApiConfiguration)
        .getComments(
          params.workId,
          params.pagination.perPage,
          params.pagination.page,
          fetchOptions
        )
      
      return [data.data, null]
    } catch (error) {
      return [null, error]
    }
  }

  /**
   * Submit a new comment to a work
   * @param params workId - The id of the artwork to comment on
   * 
   * @returns Returns an array of comment status, new comment data and an error if there is one
   */
  const addComment = async (params: {
    workId: number,
    comment: string
  }) => {
    try {
      const { data } = await new ArtworkCommentsApi(oApiConfiguration)
        .addComment(
          {
            work_id: params.workId,
            comment: params.comment
          },
          fetchOptions
        )

      return [data.success, data.data, null]
    } catch (error) {
      return [null, null, error]
    }
  }
  
  /**
   * Delete a comment from a work
   * @param params commentId - The id of the comment to delete
   * 
   * @returns Returns an array of delete status and an error if there is one
   */
  const deleteComment = async (params: {
    commentId: number
  }) => {
    try {
      const { data } = await new ArtworkCommentsApi(oApiConfiguration)
        .removeComment(
          params.commentId,
          fetchOptions
        )

      return [data.success, null]
    } catch (error) {
      return [null, error]
    }
  }

  /**
   * Like a comment on a work
   * @param params commentId - The id of the comment to like
   * 
   * @returns Returns an array of like status and an error if there is one
   */
  const likeComment = async (params: {
    commentId: number
  }) => {
    try {
      const { data } = await new ArtworkCommentsLikesApi(oApiConfiguration)
        .likeAComment(
          params.commentId,
          fetchOptions
        )

      return [data.success, null]
    } catch (error) {
      return [null, error]
    }
  }

  /**
   * Unlike a comment on a work
   * @param params commentId - The id of the comment to unlike
   * 
   * @returns Returns an array of unlike status and an error if there is one
   */
  const unlikeComment = async (params: {
    commentId: number
  }) => {
    try {
      const { data } = await new ArtworkCommentsLikesApi(oApiConfiguration)
        .unlikeAComment(
          params.commentId,
          fetchOptions
        )
      
      return [data.success, null]
    } catch (error) {
      return [null, error]
    }
  }
  /**
   * @commentApi
   */

  /**
   * @commentReplyApi
   */
  /**
   * Get replies for a comment
   * @param params commentId - The id of the comment to get replies for
   * @param params pagination.page - The page of replies to get
   * @param params pagination.perPage - The number of replies to get per page
   * 
   * @returns Returns an array of replies, pagination data and an error if there is one
   */
  const getCommentReplies = async (params: {
    commentId: number,
    pagination: {
      page: number,
      perPage: number
    }
  }) => {
    try {
      const { data } = await new ArtworkCommentsRepliesApi(oApiConfiguration)
        .getReplies(
          params.commentId,
          params.pagination.perPage,
          params.pagination.page,
          fetchOptions
        )

      return [data.data.replies, data.data.pagination, null]
    } catch (error) {
      return [null, null, error]
    }
  }

  /**
   * Submit a new reply to a comment
   * @param params commentId - The id of the comment to reply to
   * @param params reply - The reply to submit
   * 
   * @returns Returns an array of reply status, new reply data and an error if there is one
   */
  const addReply = async (params: {
    commentId: number,
    reply: string
  }) => {
    try {
      const { data } = await new ArtworkCommentsRepliesApi(oApiConfiguration)
        .reply(
          {
            comment_id: params.commentId,
            reply: params.reply
          },
          fetchOptions
        )

      return [data.success, data.data, null]
    } catch (error) {
      return [null, null, error]
    }
  }

  /**
   * Delete a reply from a comment
   * @param params replyId - The id of the reply to delete
   * 
   * @returns Returns an array of delete status and an error if there is one
   */
  const deleteReply = async (params: {
    replyId: number
  }) => {
    try {
      const { data } = await new ArtworkCommentsRepliesApi(oApiConfiguration)
        .removeReply(
          params.replyId,
          fetchOptions
        )
      
      return [data.success, null]
    } catch (error) {
      return [null, error]
    }
  }

  /**
   * Like a reply on a comment
   * @param params replyId - The id of the reply to like
   * 
   * @returns Returns an array of like status and an error if there is one
   */
  const likeReply = async (params: {
    replyId: number
  }) => {
    try {
      const { data } = await new ArtworkCommentsRepliesApi(oApiConfiguration)
        .likeReply(
          params.replyId,
          fetchOptions
        )
      
      return [data.success, null]
    } catch (error) {
      return [null, error]
    }
  }

  /**
   * Unlike a reply on a comment
   * @param params replyId - The id of the reply to unlike
   * 
   * @returns Returns an array of unlike status and an error if there is one
   */
  const unlikeReply = async (params: {
    replyId: number
  }) => {
    try {
      const { data } = await new ArtworkCommentsRepliesApi(oApiConfiguration)
        .unlikeReply(
          params.replyId,
          fetchOptions
        )

      return [data.success, null]
    } catch (error) {
      return [null, error]
    }
  }
  /**
   * @commentReplyApi
   */

  const checkArtworkAvailability = async () => {
    try {
      const { data } = await new ArtworksApi(oApiConfiguration)
        .checkArtworkAvailability(fetchOptions)

      return [data.data.count && typeof data?.count !== 'undefined' ? data.count : 0, null]
    } catch (error) {
      return [null, error]
    }
  }

  return {
    getMostPopular,
    getLatest,
    getFollowing,
    getSearch,
    getUserArtworks,
    getChronologicalFeeds,
    
    getWorkById,
    incraseViewCount,
    updateInfo,
    deleteWork,
    
    like,
    unlike,

    getTagKeys,
    checkArtworkAvailability,

    getComments,
    addComment,
    deleteComment,
    likeComment,
    unlikeComment,

    getCommentReplies,
    addReply,
    deleteReply,
    likeReply,
    unlikeReply
  }
}
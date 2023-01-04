// @ts-nocheck
import { AlbumsApi, UserCountersApi } from '~/api/api'
import { workTypes } from '~/types/works'

export default function (oApiConfiguration: any, fetchOptions: any) {
  /**
   * Check whether the user can still create a new album or not, because free users can only create a maximum of 3 albums
   * @param params 
   * @returns 
   */
  const proCanCreateAlbum = async (params: {
    type: string
  }) => {
    try {
      const { data } = await new AlbumsApi(oApiConfiguration)
        .proLimitIsCanCreateAlbum(
          {
            type: params.type
          },
          fetchOptions
        )
      
      return [data.data.is_can_create, null]
    } catch (error) {
      return [null, useApiFetch().consumeReadableStreamError(error)]
    }
  }

  const createAlbum = async (
    type: workTypes, 
    inputData: {
      title: string,
      description: string,
      isPublic: boolean | 0 | 1
    }
  ) => {
    try {
      const { data } = await new AlbumsApi(oApiConfiguration)
        .createAlbum(
          {
            name: inputData.title,
            description: inputData.description,
            is_public: inputData.isPublic ? 1 : 0,
            type
          },
          fetchOptions
        )

      return [data.success, data.data, null]
    } catch (error) {
      return [null, null, useApiFetch().consumeReadableStreamError(error)]
    }
  }

  const getInfo = async (albumId: number) => {
    try {
      const data = await new AlbumsApi(oApiConfiguration)
        .getAlbumById(albumId, fetchOptions)

      return [data.data, null]
    } catch (error) {
      return [null, useApiFetch().consumeReadableStreamError(error)]
    }
  }

  const countAlbums = async (userId: number) => {
    try {
      const { data } = await new UserCountersApi(oApiConfiguration)
        .countUserAlbums(
          userId,
          fetchOptions
        )

      return [data.data.total, null]
    } catch (error) {
      return [null, useApiFetch().consumeReadableStreamError(error)]
    }
  }

  const countArtworkAlbums = async (userId: number) => {
    try {
      const { data } = await new UserCountersApi(oApiConfiguration)
        .countUserArtworkAlbums(
          userId,
          fetchOptions
        )

      return [data.data.total, null]
    } catch (error) {
      return [null, useApiFetch().consumeReadableStreamError(error)]
    }
  }

  const fetchAlbums = async (
    userId: number,
    type: string,
    perPage: number,
    page: number
  ) => {
    try {
      const { data } = await new AlbumsApi(oApiConfiguration)
        .listUserAlbums(
          userId,
          perPage,
          page,
          type,
          fetchOptions
        )

      const pagination: any = data.data.pagination

      let showLoadMore = true
      if (pagination.current_page === pagination.total_page) {
        showLoadMore = false
      }

      return [data.data.albums, showLoadMore, null]
    } catch (error) {
      return [null, false, useApiFetch().consumeReadableStreamError(error)]
    }
  }

  const listAlbumItems = async (params: {
    albumId: number,
    pagination: {
      page: number,
      perPage: number
    }
  }) => {
    try {
      const { data } = await new AlbumsApi(oApiConfiguration)
        .getAlbumItems(
          params.albumId,
          params.pagination.perPage,
          params.pagination.page,
          fetchOptions
        )

      const pagination: any = data.data.pagination
      
      let showLoadMore = true
      if (pagination.current_page === pagination.total_page) {
        showLoadMore = false
      }

      return [data.data.works, showLoadMore, null]
    } catch (error) {
      return [null, false, useApiFetch().consumeReadableStreamError(error)]
    }
  }

  const update = async (inputData: {
    id: number,
    name: string,
    description?: string,
    isPublic: 0 | 1
  }) => {
    try {
      const { data } = await new AlbumsApi(oApiConfiguration)
        .updateAlbum(
          {
            id: inputData.id,
            name: inputData.name,
            description: inputData.description,
            is_public: inputData.isPublic
          },
          fetchOptions
        )
    
      return [data.success, null]
    } catch (error) {
      return [null, useApiFetch().consumeReadableStreamError(error)]
    }
  }

  const getCurrentSaveInfo = async (type: workTypes, workId: number) => {
    try {
      const { data } = await new AlbumsApi(oApiConfiguration)
        .getCurrentAlbumSaveInfo(type, workId, fetchOptions)

      return [data.data, null]
    } catch (error) {
      return [null, useApiFetch().consumeReadableStreamError(error)]
    }
  }

  const addItems = async (params: {
    albumIds: number[],
    type: string,
    workIds: number[],
  }) => {
    try {
      for (const albumId of params.albumIds) {
        await new AlbumsApi(oApiConfiguration)
          .addWorkToAlbum(
            {
              album_id: albumId,
              type: params.type,
              work_ids: params.workIds
            }, 
            fetchOptions
          )
      }

      return [true, null]
    } catch (error) {
      return [null, useApiFetch().consumeReadableStreamError(error)]
    }
  }

  const removeItems = async (albumId: number, workList: number[]) => {
    try {
      const { data } = await new AlbumsApi(oApiConfiguration)
        .removeWorkFromAlbum({
          album_id: albumId,
          work_ids: workList
        }, fetchOptions)
      
      return [data.success, null]
    } catch (error) {
      return [null, useApiFetch().consumeReadableStreamError(error)]
    }
  }

  const deleteAlbum = async (albumId: number) => {
    try {
      const { data } = await new AlbumsApi(oApiConfiguration)
        .deleteAlbum(albumId, fetchOptions)

      return [data.success, null]
    } catch (error) {
      return [null, useApiFetch().consumeReadableStreamError(error)]
    }
  }

  return {
    proCanCreateAlbum,
    createAlbum,
    getInfo,
    countAlbums,
    countArtworkAlbums,
    fetchAlbums,
    listAlbumItems,
    getCurrentSaveInfo,
    addItems,
    removeItems,
    update,
    deleteAlbum
  }
}

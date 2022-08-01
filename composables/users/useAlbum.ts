// @ts-nocheck
import {
  AlbumsApi,
  UserCountersApi
} from '~/api/openapi/api'
import { workTypes } from '~/types/works'

export default function (oApiConfiguration: any, fetchOptions: any) {
  const createAlbum = async (
    type: workTypes, 
    inputData: {
      title: string,
      description: string,
      isPublic: boolean | 0 | 1
    }
  ) => {
    try {
      const { success, data } = await new AlbumsApi(oApiConfiguration)
        .createAlbum(
          {
            name: inputData.title,
            description: inputData.description,
            is_public: inputData.isPublic ? 1 : 0,
            type
          },
          fetchOptions
        )

      return [success, data, null]
    } catch (error) {
      return [null, null, error]
    }
  }

  const getInfo = async (albumId: number) => {
    try {
      const data = await new AlbumsApi(oApiConfiguration)
        .getAlbumById(albumId, fetchOptions)

      return [data, null]
    } catch (error) {
      return [null, error]
    }
  }

  const countAlbums = async (userId: number) => {
    try {
      const { data } = await new UserCountersApi(oApiConfiguration)
        .countUserAlbums(
          userId,
          fetchOptions
        )

      return [data?.total, null]
    } catch (error) {
      return [null, error]
    }
  }

  const countArtworkAlbums = async (userId: number) => {
    try {
      const { data } = await new UserCountersApi(oApiConfiguration)
        .countUserArtworkAlbums(
          userId,
          fetchOptions
        )

      return [data?.total, null]
    } catch (error) {
      return [null, error]
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

      const albums: any = data?.albums
      const pagination: any = data?.pagination

      let showLoadMore: boolean = true
      if (pagination.current_page === pagination.total_page) {
        showLoadMore = false
      }

      return [albums, showLoadMore, null]
    } catch (error) {
      return [null, false, error]
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

      const pagination: any = data?.pagination
      
      let showLoadMore: boolean = true
      if (pagination.current_page === pagination.total_page) {
        showLoadMore = false
      }

      return [data?.works, showLoadMore, null]
    } catch (error) {
      return [null, false, error]
    }
  }

  const update = async (data: any) => {
    try {
      data.is_public = data.isPublic
      delete data.isPublic

      const { success } = await new AlbumsApi(oApiConfiguration)
        .updateAlbum(
          data,
          fetchOptions
        )
    
      return [success, null]
    } catch (error) {
      return [null, error]
    }
  }

  const getCurrentSaveInfo = async (type: workTypes, workId: number) => {
    try {
      const { data } = await new AlbumsApi(oApiConfiguration)
        .getCurrentAlbumSaveInfo(type, workId, fetchOptions)

      return [data, null]
    } catch (error) {
      return [null, error]
    }
  }

  const addItems = async (albumIds: number[], workIds: number[]) => {
    try {
      for (const albumId of albumIds) {
        await new AlbumsApi(oApiConfiguration)
          .addWorkToAlbum({
            album_id: albumId,
            work_ids: workIds
          }, fetchOptions)
      }

      return [true, null]
    } catch (error) {
      return [null, error]
    }
  }

  const removeItems = async (albumId: number, workList: number[]) => {
    try {
      const { success } = await new AlbumsApi(oApiConfiguration)
        .removeWorkFromAlbum({
          album_id: albumId,
          work_ids: workList
        }, fetchOptions)
      
      return [success, null]
    } catch (error) {
      return [null, error]
    }
  }

  const deleteAlbum = async (albumId: number) => {
    try {
      const { success } = await new AlbumsApi(oApiConfiguration)
        .deleteAlbum(albumId, fetchOptions)

      return [success, null]
    } catch (error) {
      return [null, error]
    }
  }

  return {
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

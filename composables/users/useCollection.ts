// @ts-nocheck
import {
  CollectionsApi,
  UserCountersApi
} from '~/api/openapi/api'
import { workTypes } from '~/types/works'

export default function (oApiConfiguration: any, fetchOptions: any) {
  const createCollection = async (
    type: workTypes, 
    inputData: {
      title: string,
      description: string,
      isPublic: boolean | 0 | 1
    }
  ) => {
    try {
      const { success, data } = await new CollectionsApi(oApiConfiguration)
        .create(
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

  const getInfo = async (collectionId: number) => {
    try {
      const data = await new CollectionsApi(oApiConfiguration)
        .detail(collectionId, fetchOptions)

      return [data, null]
    } catch (error) {
      return [null, error]
    }
  }

  /**
   * Get all collections of a user
   * @param userId 
   * @param type 
   * @param perPage 
   * @param page 
   * @returns 
   */
  const fetchCollections = async (
    userId: number,
    type: string,
    page: number,
    perPage: number,
    name?: string
  ) => {
    try {
      const { data } = await new CollectionsApi(oApiConfiguration)
        .listUserCollections(
          userId,
          type,
          perPage,
          page,
          name,
          fetchOptions
        )

      const collections: any = data?.collections
      const pagination: any = data?.pagination

      let showLoadMore: boolean = true
      if (pagination.current_page === pagination.total_page) {
        showLoadMore = false
      }

      return [collections, showLoadMore, null]
    } catch (error) {
      return [null, false, error]
    }
  }

  /**
   * Get items of a collection
   * @param params 
   * @returns 
   */
  const listCollectionItems = async (params: {
    collectionId: number,
    pagination: {
      page: number,
      perPage: number
    }
  }) => {
    try {
      const { data } = await new CollectionsApi(oApiConfiguration)
        .listCollectionItems(
          params.collectionId,
          params.pagination.perPage,
          params.pagination.page,
          fetchOptions
        )

      const pagination: any = data?.pagination
      
      let showLoadMore: boolean = true
      if (pagination.current_page === pagination.total_page) {
        showLoadMore = false
      }

      return [data?.items, showLoadMore, null]
    } catch (error) {
      return [null, false, error]
    }
  }

  // todo
  const update = async (data: any) => {
    try {
      data.is_public = data.isPublic
      delete data.isPublic

      const { success } = await new CollectionsApi(oApiConfiguration)
        .updateCollection(
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
      const { data } = await new CollectionsApi(oApiConfiguration)
        .getCurrentSaveInfo(type, workId, fetchOptions)

      return [data, null]
    } catch (error) {
      return [null, error]
    }
  }

  const addItem = async (params: {
    collectionId: number,
    type: workTypes,
    workId: number
  }) => {
    try {
      await new CollectionsApi(oApiConfiguration)
        .addItemToCollection(
          params.collectionId,
          params.type,
          {
            id: params.workId
          },
          fetchOptions
        )

      return [true, null]
    } catch (error) {
      return [null, error]
    }
  }

  const removeItem = async (params: {
    collectionId: number,
    type: workTypes,
    workId: number
  }) => {
    try {
      const { success } = await new CollectionsApi(oApiConfiguration)
        .removeItemFromCollection(
          params.collectionId,
          params.type,
          {
            id: params.workId
          },
          fetchOptions
        )
      
      return [success, null]
    } catch (error) {
      return [null, error]
    }
  }

  const deleteCollection = async (collectionId: number) => {
    try {
      const { success } = await new CollectionsApi(oApiConfiguration)
        .collectionsIdDelete(collectionId, fetchOptions)

      return [success, null]
    } catch (error) {
      return [null, error]
    }
  }

  /**
   * Count how many collection do user have (all collection types)
   * @param userId 
   * @returns 
   */
  const countCollections = async (userId: number) => {
    try {
      const { data } = await new UserCountersApi(oApiConfiguration)
        .countUserCollections(
          userId,
          fetchOptions
        )

      return [data?.total, null]
    } catch (error) {
      return [null, error]
    }
  }

  /**
   * Count how many artwork collection do user have (only for artwork type)
   * @param userId 
   * @returns 
   */
  const countArtworkCollections = async (userId: number) => {
    try {
      const { data } = await new UserCountersApi(oApiConfiguration)
        .countUserArtworkCollections(
          userId,
          fetchOptions
        )

      return [data?.total, null]
    } catch (error) {
      return [null, error]
    }
  }

  return {
    createCollection,
    getInfo,
    countCollections,
    countArtworkCollections,
    fetchCollections,
    listCollectionItems,
    getCurrentSaveInfo,
    addItem,
    removeItem,
    update,
    deleteCollection
  }
}

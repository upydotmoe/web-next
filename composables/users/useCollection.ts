// @ts-nocheck
import {
  CollectionsApi,
  UserCountersApi
} from '~/api/api'
import { workTypes } from '~/types/works'

export default function (oApiConfiguration: any, fetchOptions: any) {
  /**
   * Check whether the user can still create a new collection or not, because free users can only create a maximum of 3 collections
   * @param params 
   * @returns 
   */
  const proCanCreateCollection = async (params: {
    type: string
  }) => {
    try {
      const { data } = await new CollectionsApi(oApiConfiguration)
        .proLimitIsCanCreateCollection(
          {
            type: params.type
          },
          fetchOptions
        )
      
      return [data.data.is_can_create, null]
    } catch (error) {
      return [null, error]
    }
  }

  const createCollection = async (
    type: workTypes, 
    inputData: {
      title: string,
      description: string,
      isPublic: boolean | 0 | 1
    }
  ) => {
    try {
      const { data } = await new CollectionsApi(oApiConfiguration)
        .create(
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
      return [null, null, error]
    }
  }

  const getInfo = async (collectionId: number) => {
    try {
      const data = await new CollectionsApi(oApiConfiguration)
        .detail(collectionId, fetchOptions)

      return [data.data, null]
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
  const fetchCollections = async (params: {
    userId: number,
    type: string,
    name?: string,
    pagination: {
      page: number,
      perPage: number,
    }
  }) => {
    try {
      const { data } = await new CollectionsApi(oApiConfiguration)
        .listUserCollections(
          params.userId,
          params.type,
          params.pagination.page,
          params.pagination.perPage,
          params.name,
          fetchOptions
        )

      const collections: any = data.data.collections
      const pagination: any = data.data.pagination

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

      const pagination: any = data.data.pagination
      
      let showLoadMore: boolean = true
      if (pagination.current_page === pagination.total_page) {
        showLoadMore = false
      }

      return [data.data.items, showLoadMore, null]
    } catch (error) {
      return [null, false, error]
    }
  }

  // todo
  const update = async (inputData: {
    id: number,
    name: string,
    description?: string,
    isPublic: 0 | 1
  }) => {
    try {
      const { data } = await new CollectionsApi(oApiConfiguration)
        .updateCollection(
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
      return [null, error]
    }
  }

  const getCurrentSaveInfo = async (type: workTypes, workId: number) => {
    try {
      const { data } = await new CollectionsApi(oApiConfiguration)
        .getCurrentSaveInfo(type, workId, fetchOptions)

      return [data.data, null]
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
          params.type,
          params.collectionId,
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
      const { data } = await new CollectionsApi(oApiConfiguration)
        .removeItemFromCollection(
          params.type,
          params.collectionId,
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

  const deleteCollection = async (collectionId: number) => {
    try {
      const { data } = await new CollectionsApi(oApiConfiguration)
        .collectionsIdDelete(collectionId, fetchOptions)

      return [data.success, null]
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

      return [data.data.total, null]
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

      return [data.data.total, null]
    } catch (error) {
      return [null, error]
    }
  }

  return {
    proCanCreateCollection,
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

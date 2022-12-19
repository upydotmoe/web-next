// @ts-nocheck
import { ArtworkTagsApi } from '~/api/api'

export default function (oApiConfiguration: any, fetchOptions: any) {
  const getAllTags = async (params: {
    orderBy?: 'count'
  }) => {
    try {
      const { data } = await new ArtworkTagsApi(oApiConfiguration)
        .getAllTags(
          typeof params.orderBy !== 'undefined' ? params.orderBy : undefined,
          fetchOptions
        )

      return [data.data?.count, data.data?.tags, null]
    } catch (error) {
      return [null, null, useApiFetch().consumeReadableStreamError(error)]
    }
  }

  return {
    getAllTags
  }
}
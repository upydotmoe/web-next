import { Configuration } from '~/api'
import { ArtworksArtTradesApi } from '~/api/api'

export default function (oApiConfiguration: Configuration, fetchOptions: any) {
  const getLatestTrades = async (params: {
    pagination: {
      page: number,
      perPage: number
    }
  }) => {
    try {
      const { data } = await new ArtworksArtTradesApi(oApiConfiguration)
        .getLatestArtTrades(
          params.pagination.page,
          params.pagination.perPage,
          fetchOptions
        )
        
      return [data.data?.latestTrades, data.data?.pagination, null]
    } catch (error) {
      return [null, null, useApiFetch().consumeReadableStreamError(error)]
    }
  }

  return {
    getLatestTrades
  }
}
import { Configuration } from '~/api'
import { ArtworksArtTradesApi } from '~/api/api'

export default function (oApiConfiguration: Configuration, fetchOptions: any) {
  const getTradeById = async (tradeId: number) => {
    try {
      const { data } = await new ArtworksArtTradesApi(oApiConfiguration)
        .getArtTradeById(
          tradeId,
          fetchOptions
        )

      return [data.success, data.data?.trade, null]
    } catch (error) {
      return [null, null, useApiFetch().consumeReadableStreamError(error)]
    }
  }

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

  const host = async (params: {
    title: string,
    workId: number
  }) => {
    try {
      const { data } = await new ArtworksArtTradesApi(oApiConfiguration)
        .hostNewTrade(
          {
            title: params.title,
            host_work_id: params.workId
          },
          fetchOptions
        )
      
      return [data.success, data.data?.trade, null]
    } catch (error) {
      return [null, null, useApiFetch().consumeReadableStreamError(error)]
    }
  }

  const participate = async (params: {
    roomId: number
    workId: number
  }) => {
    try {
      const { data } = await new ArtworksArtTradesApi(oApiConfiguration)
        .participateToTrade(
          {
            room_id: params.roomId,
            work_id: params.workId
          },
          fetchOptions
        )

      return [data.success, null]
    } catch (error) {
      return [null, useApiFetch().consumeReadableStreamError(error)]
    }
  }

  return {
    getTradeById,
    getLatestTrades,
    host,
    participate
  }
}
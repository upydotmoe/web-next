import { ArtworkRandomApi } from '~/api/api'

export default function (oApiConfiguration: any, fetchOptions: any) {
  const getRandomArtwork = async () => {
    try {
      const { data } = await new ArtworkRandomApi(oApiConfiguration)
        .getRandomArtwork(fetchOptions)

      return [data.data.id, null]
    } catch (error) {
      return [null, useApiFetch().consumeReadableStreamError(error)]
    }
  }

  return {
    getRandomArtwork
  }
}

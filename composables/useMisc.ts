import {
  ArtworkRandomApi
} from '~/api/openapi/api'

export default function (oApiConfiguration: any, fetchOptions: any) {
  const getRandomArtwork = async () => {
    try {
      const { data } = await new ArtworkRandomApi(oApiConfiguration)
        .getRandomArtwork(fetchOptions)

      return [data?.id, null]
    } catch (error) {
      return [null, error]
    }
  }

  return {
    getRandomArtwork
  }
}

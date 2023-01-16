import { Configuration } from '~/api'
import { SettingsApi } from '~/api/api'

export default function (oApiConfiguration: Configuration, fetchOptions: any) {
  const getSetting = async (key: string) => {
    try {
      const { data } = await new SettingsApi(oApiConfiguration)
        .getSetting(key)

      return [data.data?.value, null]
    } catch (error) {
      return [null, useApiFetch().consumeReadableStreamError(error)]
    }
  }

  return {
    getSetting
  }
}

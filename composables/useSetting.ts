import { Configuration } from '~/api'
import {
  SettingsApi
} from '~/api/api'

export default function (oApiConfiguration: Configuration, fetchOptions: any) {
  const getSetting = async (key: string) => {
    const { data } = await new SettingsApi(oApiConfiguration)
      .getSetting(key)

    return data.data.value
  }

  return {
    getSetting
  }
}

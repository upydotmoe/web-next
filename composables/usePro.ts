// @ts-nocheck
import { ProApi } from "~/api/api"

export default function (oApiConfiguration: any, fetchOptions: any) {
  const registerProVersion = async (params: {
    paymentType: 'paypal',
    amount: string,
    orderData: string
  }) => {
    try {
      const { data } = await new ProApi(oApiConfiguration)
        .registerProVersion(
          {
            payment_type: params.paymentType,
            amount: params.amount,
            order_data: params.orderData
          },
          fetchOptions
        )

      return [data.success, data.data, null]
    } catch (error) {
      return [null, null, useApiFetch().consumeReadableStreamError(error)]
    }
  }

  /**
   * Check current user login subscription of pro version status
   * @returns - Returns error if an error occured and subscription status
   */
  const checkSubscriptionStatus = async () => {
    try {
      const { data } = await new ProApi(oApiConfiguration)
        .getProStatus(fetchOptions)

      return [data.data, null]
    } catch (error) {
      return [null, useApiFetch().consumeReadableStreamError(error)]
    }
  }

  return {
    registerProVersion,
    checkSubscriptionStatus
  }
}
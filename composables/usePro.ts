// @ts-nocheck
import { ProApi } from "~/api/openapi/api"

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

      return [data.success, data]
    } catch (error) {
      return [null, error]
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
      return [null, error]
    }
  }

  return {
    registerProVersion,
    checkSubscriptionStatus
  }
}
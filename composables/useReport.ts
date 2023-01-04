// @ts-nocheck
import { ReportsApi } from '~/api/api'
import { TReportType } from '~~/utils/constants/report'

export default function (oApiConfiguration: any, fetchOptions: any) {
  /**
   * Get all report list
   * @param params status - Filter report by status
   * @param params createdAtFrom - Show only report that submitted after this date
   * @param params createdAtTo - Show only report that submitted before this date
   * @param params userId - Filter report by user ID who reported it
   * @param params reasons - Filter report by reason
   * @param params pagination.page - The page of replies to get
   * @param params pagination.perPage - The number of replies to get per page
   * 
   * @returns - Returns an array with the following elements:
   *            - success: boolean - Indicates if the request was successful
   *            - data: any - The data returned by the API
   *            - error: any - The error returned by the API
   */
  const getReports = async (params: {
    status?: 'all' | 'pending' | 'closed',
    createdAtFrom?: string,
    createdAtTo?: string,
    userId?: number,
    reasons?: string,
    pagination: {
      page: number,
      perPage: number
    }
  }) => {
    try {
      const { data } = await new ReportsApi(oApiConfiguration)
        .getReports(
          params.pagination.page,
          params.pagination.perPage,
          params.status,
          params.createdAtFrom,
          params.createdAtTo,
          params.userId,
          params.reasons,
          fetchOptions
        )

      return [data.data.reports, data.data.pagination, null]
    } catch (error) {
      return [null, null, useApiFetch().consumeReadableStreamError(error)]
    }
  }

  /**
   * Get report detail by report ID
   * @param params reportId - The ID of the report
   * 
   * @returns - Returns an array with the following elements:
   *            - data: any - The data returned by the API
   *            - error: any - The error returned by the API
   */
  const getReportById = async (params: {
    reportId: number
  }) => {
    try {
      const { data } = await new ReportsApi(oApiConfiguration)
        .getReportById(
          params.reportId,
          fetchOptions
        )

      return [data.data.report, null]
    } catch (error) {
      return [null, useApiFetch().consumeReadableStreamError(error)]
    }
  }

  /**
   * Create a new report and send it to the moderators of the community
   * @param params type: string - The type of the report
   * @param params postId: number - The ID of the post that is being reported
   * @param params reasons: string - The reason of the report
   * @param params description: string - The description of the report
   * 
   * @returns - Returns an array with the following elements:
   *            - success: boolean - Indicates if the request was successful
   *            - data: any - The data returned by the API
   *            - error: any - The error returned by the API
   */
  const createNewReport = async (params: {
    type: TReportType,
    postId: number,
    reasons: string,
    description: string
  }) => {
    try {
      const { data } = await new ReportsApi(oApiConfiguration)
        .createNewReport(
          {  
            type: params.type,
            post_id: params.postId,
            reasons: params.reasons,
            description: params.description
          },
          fetchOptions
        )

      return [data.success, data.data.report, null]
    } catch (error) {
      return [false, null, useApiFetch().consumeReadableStreamError(error)]
    }
  }

  /**
   * Review report and give feedback to the user who reported it
   * @param params reportId - The ID of the report
   * @param params response - The response to the report, either it's removed or doesn't agains community standar
   * @param params responseDescription - The description of the response
   * 
   * @returns - Returns an array with the following elements:
   *            - success: boolean - Indicates if the request was successful
   *            - data: any - The data returned by the API
   *            - error: any - The error returned by the API
   */
  const reviewReport = async (params: {
    reportId: number,
    response: 0 | 1,
    responseDescription: string
  }) => {
    try {
      const { data } = await new ReportsApi(oApiConfiguration)
        .reviewReport(
          {
            report_id: params.reportId,
            response: params.response ? 1 : 0,
            response_description: params.responseDescription
          },
          fetchOptions
        )

      return [data.success, null]
    } catch (error) {
      return [false, useApiFetch().consumeReadableStreamError(error)]
    }
  }

  /**
   * Get report status/progress by post type and post ID
   * @param params type - The type of the post
   * @param params postId - The ID of the post
   * 
   * @returns - Returns an array with the following elements:
   *            - data: any - The data returned by the API, if the post is not reported yet, return empty array, if the post is reported, return the report status
   *            - error: any - The error returned by the API
   */
  const getReportStatus = async (params: {
    type: TReportType,
    postId: number
  }) => {
    try {
      const { data } = await new ReportsApi(oApiConfiguration)
        .getReportStatus(
          params.type,
          params.postId,
          fetchOptions
        )

      return [data.data.report, null]
    } catch (error) {
      return [null, useApiFetch().consumeReadableStreamError(error)]
    }
  }

  return {
    getReports,
    getReportById,
    createNewReport,
    reviewReport,

    getReportStatus
  }
}

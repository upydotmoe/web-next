/* tslint:disable */
/* eslint-disable */
/**
 * Upy API Documentation
 * API documentation of Upy - a social community platform for Artists.
 *
 * OpenAPI spec version: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import globalAxios, { AxiosResponse, AxiosInstance, AxiosRequestConfig } from 'axios';
import { Configuration } from '../configuration';
// Some imports not used depending on template conditions
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, RequestArgs, BaseAPI, RequiredError } from '../base';
import { InlineResponse20041 } from '../models';
import { InlineResponse20042 } from '../models';
import { InlineResponse2017 } from '../models';
import { ReportsBody } from '../models';
import { ReportsReviewBody } from '../models';
import { SuccessMessageModel } from '../models';
/**
 * ReportsApi - axios parameter creator
 * @export
 */
export const ReportsApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Create a new report
         * @param {ReportsBody} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createNewReport: async (body?: ReportsBody, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/reports`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions :AxiosRequestConfig = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication bearerAuth required

            localVarHeaderParameter['Content-Type'] = 'application/json';

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.params) {
                query.set(key, options.params[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            const needsSerialization = (typeof body !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
            localVarRequestOptions.data =  needsSerialization ? JSON.stringify(body !== undefined ? body : {}) : (body || "");

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Get report detail by report ID
         * @param {number} reportId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getReportById: async (reportId: number, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'reportId' is not null or undefined
            if (reportId === null || reportId === undefined) {
                throw new RequiredError('reportId','Required parameter reportId was null or undefined when calling getReportById.');
            }
            const localVarPath = `/reports/{reportId}`
                .replace(`{${"reportId"}}`, encodeURIComponent(String(reportId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions :AxiosRequestConfig = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication bearerAuth required

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.params) {
                query.set(key, options.params[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Get report status/progress of post
         * @param {string} type 
         * @param {number} postId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getReportStatus: async (type: string, postId: number, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'type' is not null or undefined
            if (type === null || type === undefined) {
                throw new RequiredError('type','Required parameter type was null or undefined when calling getReportStatus.');
            }
            // verify required parameter 'postId' is not null or undefined
            if (postId === null || postId === undefined) {
                throw new RequiredError('postId','Required parameter postId was null or undefined when calling getReportStatus.');
            }
            const localVarPath = `/reports/status/{type}/{postId}`
                .replace(`{${"type"}}`, encodeURIComponent(String(type)))
                .replace(`{${"postId"}}`, encodeURIComponent(String(postId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions :AxiosRequestConfig = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication bearerAuth required

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.params) {
                query.set(key, options.params[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Get report list
         * @param {number} page Pagination index
         * @param {number} perPage How many record to show per page of pagination
         * @param {string} [status] 
         * @param {string} [createdAtFrom] 
         * @param {string} [createdAtTo] 
         * @param {number} [userId] 
         * @param {string} [reasons] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getReports: async (page: number, perPage: number, status?: string, createdAtFrom?: string, createdAtTo?: string, userId?: number, reasons?: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'page' is not null or undefined
            if (page === null || page === undefined) {
                throw new RequiredError('page','Required parameter page was null or undefined when calling getReports.');
            }
            // verify required parameter 'perPage' is not null or undefined
            if (perPage === null || perPage === undefined) {
                throw new RequiredError('perPage','Required parameter perPage was null or undefined when calling getReports.');
            }
            const localVarPath = `/reports`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions :AxiosRequestConfig = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication bearerAuth required

            if (status !== undefined) {
                localVarQueryParameter['status'] = status;
            }

            if (createdAtFrom !== undefined) {
                localVarQueryParameter['created_at_from'] = createdAtFrom;
            }

            if (createdAtTo !== undefined) {
                localVarQueryParameter['created_at_to'] = createdAtTo;
            }

            if (userId !== undefined) {
                localVarQueryParameter['user_id'] = userId;
            }

            if (reasons !== undefined) {
                localVarQueryParameter['reasons'] = reasons;
            }

            if (page !== undefined) {
                localVarQueryParameter['page'] = page;
            }

            if (perPage !== undefined) {
                localVarQueryParameter['per_page'] = perPage;
            }

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.params) {
                query.set(key, options.params[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Review report and give feedback to user who reported it
         * @param {ReportsReviewBody} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        reviewReport: async (body?: ReportsReviewBody, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/reports/review`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions :AxiosRequestConfig = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication bearerAuth required

            localVarHeaderParameter['Content-Type'] = 'application/json';

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.params) {
                query.set(key, options.params[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            const needsSerialization = (typeof body !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
            localVarRequestOptions.data =  needsSerialization ? JSON.stringify(body !== undefined ? body : {}) : (body || "");

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * ReportsApi - functional programming interface
 * @export
 */
export const ReportsApiFp = function(configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Create a new report
         * @param {ReportsBody} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async createNewReport(body?: ReportsBody, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<InlineResponse2017>>> {
            const localVarAxiosArgs = await ReportsApiAxiosParamCreator(configuration).createNewReport(body, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @summary Get report detail by report ID
         * @param {number} reportId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getReportById(reportId: number, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<InlineResponse2017>>> {
            const localVarAxiosArgs = await ReportsApiAxiosParamCreator(configuration).getReportById(reportId, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @summary Get report status/progress of post
         * @param {string} type 
         * @param {number} postId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getReportStatus(type: string, postId: number, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<InlineResponse20042>>> {
            const localVarAxiosArgs = await ReportsApiAxiosParamCreator(configuration).getReportStatus(type, postId, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @summary Get report list
         * @param {number} page Pagination index
         * @param {number} perPage How many record to show per page of pagination
         * @param {string} [status] 
         * @param {string} [createdAtFrom] 
         * @param {string} [createdAtTo] 
         * @param {number} [userId] 
         * @param {string} [reasons] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getReports(page: number, perPage: number, status?: string, createdAtFrom?: string, createdAtTo?: string, userId?: number, reasons?: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<InlineResponse20041>>> {
            const localVarAxiosArgs = await ReportsApiAxiosParamCreator(configuration).getReports(page, perPage, status, createdAtFrom, createdAtTo, userId, reasons, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @summary Review report and give feedback to user who reported it
         * @param {ReportsReviewBody} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async reviewReport(body?: ReportsReviewBody, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<SuccessMessageModel>>> {
            const localVarAxiosArgs = await ReportsApiAxiosParamCreator(configuration).reviewReport(body, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
    }
};

/**
 * ReportsApi - factory interface
 * @export
 */
export const ReportsApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    return {
        /**
         * 
         * @summary Create a new report
         * @param {ReportsBody} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async createNewReport(body?: ReportsBody, options?: AxiosRequestConfig): Promise<AxiosResponse<InlineResponse2017>> {
            return ReportsApiFp(configuration).createNewReport(body, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Get report detail by report ID
         * @param {number} reportId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getReportById(reportId: number, options?: AxiosRequestConfig): Promise<AxiosResponse<InlineResponse2017>> {
            return ReportsApiFp(configuration).getReportById(reportId, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Get report status/progress of post
         * @param {string} type 
         * @param {number} postId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getReportStatus(type: string, postId: number, options?: AxiosRequestConfig): Promise<AxiosResponse<InlineResponse20042>> {
            return ReportsApiFp(configuration).getReportStatus(type, postId, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Get report list
         * @param {number} page Pagination index
         * @param {number} perPage How many record to show per page of pagination
         * @param {string} [status] 
         * @param {string} [createdAtFrom] 
         * @param {string} [createdAtTo] 
         * @param {number} [userId] 
         * @param {string} [reasons] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getReports(page: number, perPage: number, status?: string, createdAtFrom?: string, createdAtTo?: string, userId?: number, reasons?: string, options?: AxiosRequestConfig): Promise<AxiosResponse<InlineResponse20041>> {
            return ReportsApiFp(configuration).getReports(page, perPage, status, createdAtFrom, createdAtTo, userId, reasons, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Review report and give feedback to user who reported it
         * @param {ReportsReviewBody} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async reviewReport(body?: ReportsReviewBody, options?: AxiosRequestConfig): Promise<AxiosResponse<SuccessMessageModel>> {
            return ReportsApiFp(configuration).reviewReport(body, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * ReportsApi - object-oriented interface
 * @export
 * @class ReportsApi
 * @extends {BaseAPI}
 */
export class ReportsApi extends BaseAPI {
    /**
     * 
     * @summary Create a new report
     * @param {ReportsBody} [body] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ReportsApi
     */
    public async createNewReport(body?: ReportsBody, options?: AxiosRequestConfig) : Promise<AxiosResponse<InlineResponse2017>> {
        return ReportsApiFp(this.configuration).createNewReport(body, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @summary Get report detail by report ID
     * @param {number} reportId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ReportsApi
     */
    public async getReportById(reportId: number, options?: AxiosRequestConfig) : Promise<AxiosResponse<InlineResponse2017>> {
        return ReportsApiFp(this.configuration).getReportById(reportId, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @summary Get report status/progress of post
     * @param {string} type 
     * @param {number} postId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ReportsApi
     */
    public async getReportStatus(type: string, postId: number, options?: AxiosRequestConfig) : Promise<AxiosResponse<InlineResponse20042>> {
        return ReportsApiFp(this.configuration).getReportStatus(type, postId, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @summary Get report list
     * @param {number} page Pagination index
     * @param {number} perPage How many record to show per page of pagination
     * @param {string} [status] 
     * @param {string} [createdAtFrom] 
     * @param {string} [createdAtTo] 
     * @param {number} [userId] 
     * @param {string} [reasons] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ReportsApi
     */
    public async getReports(page: number, perPage: number, status?: string, createdAtFrom?: string, createdAtTo?: string, userId?: number, reasons?: string, options?: AxiosRequestConfig) : Promise<AxiosResponse<InlineResponse20041>> {
        return ReportsApiFp(this.configuration).getReports(page, perPage, status, createdAtFrom, createdAtTo, userId, reasons, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @summary Review report and give feedback to user who reported it
     * @param {ReportsReviewBody} [body] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ReportsApi
     */
    public async reviewReport(body?: ReportsReviewBody, options?: AxiosRequestConfig) : Promise<AxiosResponse<SuccessMessageModel>> {
        return ReportsApiFp(this.configuration).reviewReport(body, options).then((request) => request(this.axios, this.basePath));
    }
}

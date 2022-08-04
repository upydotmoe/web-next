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
import { InlineResponse20035 } from '../models';
import { SuccessMessageModel } from '../models';
/**
 * NotificationsFeedsApi - axios parameter creator
 * @export
 */
export const NotificationsFeedsApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Clear all feed notifications
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        clearAllFeedNotifications: async (options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/notifications/feeds/clear`;
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
         * @summary Get notification for feed module
         * @param {number} showLimit Determine how many user to show on each notification, the rest user who liked the artwork will be displayed as &#x27;other X people liked your artwork&#x27;
         * @param {number} page Pagination index
         * @param {number} perPage How many record to show per page of pagination
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getFeedNotifications: async (showLimit: number, page: number, perPage: number, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'showLimit' is not null or undefined
            if (showLimit === null || showLimit === undefined) {
                throw new RequiredError('showLimit','Required parameter showLimit was null or undefined when calling getFeedNotifications.');
            }
            // verify required parameter 'page' is not null or undefined
            if (page === null || page === undefined) {
                throw new RequiredError('page','Required parameter page was null or undefined when calling getFeedNotifications.');
            }
            // verify required parameter 'perPage' is not null or undefined
            if (perPage === null || perPage === undefined) {
                throw new RequiredError('perPage','Required parameter perPage was null or undefined when calling getFeedNotifications.');
            }
            const localVarPath = `/notifications/feeds`;
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

            if (showLimit !== undefined) {
                localVarQueryParameter['show_limit'] = showLimit;
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
         * @summary Mark all feed notifications as read
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        markAllFeedNotificationsAsRead: async (options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/notifications/feeds/read/all`;
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
         * @summary Mark specific feed notification as read
         * @param {string} type 
         * @param {number} feedId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        markFeedNotificationAsRead: async (type: string, feedId: number, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'type' is not null or undefined
            if (type === null || type === undefined) {
                throw new RequiredError('type','Required parameter type was null or undefined when calling markFeedNotificationAsRead.');
            }
            // verify required parameter 'feedId' is not null or undefined
            if (feedId === null || feedId === undefined) {
                throw new RequiredError('feedId','Required parameter feedId was null or undefined when calling markFeedNotificationAsRead.');
            }
            const localVarPath = `/notifications/feeds/read/{type}/{feedId}`
                .replace(`{${"type"}}`, encodeURIComponent(String(type)))
                .replace(`{${"feedId"}}`, encodeURIComponent(String(feedId)));
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
    }
};

/**
 * NotificationsFeedsApi - functional programming interface
 * @export
 */
export const NotificationsFeedsApiFp = function(configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Clear all feed notifications
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async clearAllFeedNotifications(options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<SuccessMessageModel>>> {
            const localVarAxiosArgs = await NotificationsFeedsApiAxiosParamCreator(configuration).clearAllFeedNotifications(options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @summary Get notification for feed module
         * @param {number} showLimit Determine how many user to show on each notification, the rest user who liked the artwork will be displayed as &#x27;other X people liked your artwork&#x27;
         * @param {number} page Pagination index
         * @param {number} perPage How many record to show per page of pagination
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getFeedNotifications(showLimit: number, page: number, perPage: number, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<InlineResponse20035>>> {
            const localVarAxiosArgs = await NotificationsFeedsApiAxiosParamCreator(configuration).getFeedNotifications(showLimit, page, perPage, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @summary Mark all feed notifications as read
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async markAllFeedNotificationsAsRead(options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<SuccessMessageModel>>> {
            const localVarAxiosArgs = await NotificationsFeedsApiAxiosParamCreator(configuration).markAllFeedNotificationsAsRead(options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @summary Mark specific feed notification as read
         * @param {string} type 
         * @param {number} feedId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async markFeedNotificationAsRead(type: string, feedId: number, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<SuccessMessageModel>>> {
            const localVarAxiosArgs = await NotificationsFeedsApiAxiosParamCreator(configuration).markFeedNotificationAsRead(type, feedId, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
    }
};

/**
 * NotificationsFeedsApi - factory interface
 * @export
 */
export const NotificationsFeedsApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    return {
        /**
         * 
         * @summary Clear all feed notifications
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async clearAllFeedNotifications(options?: AxiosRequestConfig): Promise<AxiosResponse<SuccessMessageModel>> {
            return NotificationsFeedsApiFp(configuration).clearAllFeedNotifications(options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Get notification for feed module
         * @param {number} showLimit Determine how many user to show on each notification, the rest user who liked the artwork will be displayed as &#x27;other X people liked your artwork&#x27;
         * @param {number} page Pagination index
         * @param {number} perPage How many record to show per page of pagination
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getFeedNotifications(showLimit: number, page: number, perPage: number, options?: AxiosRequestConfig): Promise<AxiosResponse<InlineResponse20035>> {
            return NotificationsFeedsApiFp(configuration).getFeedNotifications(showLimit, page, perPage, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Mark all feed notifications as read
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async markAllFeedNotificationsAsRead(options?: AxiosRequestConfig): Promise<AxiosResponse<SuccessMessageModel>> {
            return NotificationsFeedsApiFp(configuration).markAllFeedNotificationsAsRead(options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Mark specific feed notification as read
         * @param {string} type 
         * @param {number} feedId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async markFeedNotificationAsRead(type: string, feedId: number, options?: AxiosRequestConfig): Promise<AxiosResponse<SuccessMessageModel>> {
            return NotificationsFeedsApiFp(configuration).markFeedNotificationAsRead(type, feedId, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * NotificationsFeedsApi - object-oriented interface
 * @export
 * @class NotificationsFeedsApi
 * @extends {BaseAPI}
 */
export class NotificationsFeedsApi extends BaseAPI {
    /**
     * 
     * @summary Clear all feed notifications
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof NotificationsFeedsApi
     */
    public async clearAllFeedNotifications(options?: AxiosRequestConfig) : Promise<AxiosResponse<SuccessMessageModel>> {
        return NotificationsFeedsApiFp(this.configuration).clearAllFeedNotifications(options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @summary Get notification for feed module
     * @param {number} showLimit Determine how many user to show on each notification, the rest user who liked the artwork will be displayed as &#x27;other X people liked your artwork&#x27;
     * @param {number} page Pagination index
     * @param {number} perPage How many record to show per page of pagination
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof NotificationsFeedsApi
     */
    public async getFeedNotifications(showLimit: number, page: number, perPage: number, options?: AxiosRequestConfig) : Promise<AxiosResponse<InlineResponse20035>> {
        return NotificationsFeedsApiFp(this.configuration).getFeedNotifications(showLimit, page, perPage, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @summary Mark all feed notifications as read
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof NotificationsFeedsApi
     */
    public async markAllFeedNotificationsAsRead(options?: AxiosRequestConfig) : Promise<AxiosResponse<SuccessMessageModel>> {
        return NotificationsFeedsApiFp(this.configuration).markAllFeedNotificationsAsRead(options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @summary Mark specific feed notification as read
     * @param {string} type 
     * @param {number} feedId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof NotificationsFeedsApi
     */
    public async markFeedNotificationAsRead(type: string, feedId: number, options?: AxiosRequestConfig) : Promise<AxiosResponse<SuccessMessageModel>> {
        return NotificationsFeedsApiFp(this.configuration).markFeedNotificationAsRead(type, feedId, options).then((request) => request(this.axios, this.basePath));
    }
}

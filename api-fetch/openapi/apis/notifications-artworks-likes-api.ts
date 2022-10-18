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
import { InlineResponse20029 } from '../models';
import { InlineResponse20030 } from '../models';
/**
 * NotificationsArtworksLikesApi - axios parameter creator
 * @export
 */
export const NotificationsArtworksLikesApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Clear/delete all artwork like notifications
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        clearAllArtworkLikeNotifications: async (options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/notifications/artworks/liked/clear`;
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
         * Get notification when artwork liked by other users, auth token required.
         * @summary Get artwork liked notifications
         * @param {number} showLimit Determine how many user to show on each notification, the rest user who liked the artwork will be displayed as &#x27;other X people liked your artwork&#x27;
         * @param {number} page Pagination index
         * @param {number} perPage How many record to show per page of pagination
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getArtworkLikedNotifications: async (showLimit: number, page: number, perPage: number, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'showLimit' is not null or undefined
            if (showLimit === null || showLimit === undefined) {
                throw new RequiredError('showLimit','Required parameter showLimit was null or undefined when calling getArtworkLikedNotifications.');
            }
            // verify required parameter 'page' is not null or undefined
            if (page === null || page === undefined) {
                throw new RequiredError('page','Required parameter page was null or undefined when calling getArtworkLikedNotifications.');
            }
            // verify required parameter 'perPage' is not null or undefined
            if (perPage === null || perPage === undefined) {
                throw new RequiredError('perPage','Required parameter perPage was null or undefined when calling getArtworkLikedNotifications.');
            }
            const localVarPath = `/notifications/artworks/liked`;
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
         * @summary Mark specific artwork like notification as read
         * @param {number} workId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        markArtworkLikeNotificationAsRead: async (workId: number, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'workId' is not null or undefined
            if (workId === null || workId === undefined) {
                throw new RequiredError('workId','Required parameter workId was null or undefined when calling markArtworkLikeNotificationAsRead.');
            }
            const localVarPath = `/notifications/artworks/liked/read/{workId}`
                .replace(`{${"workId"}}`, encodeURIComponent(String(workId)));
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
         * @summary Read all artwork like notifications
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        readAllArtworkLikeNotifications: async (options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/notifications/artworks/liked/read/all`;
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
 * NotificationsArtworksLikesApi - functional programming interface
 * @export
 */
export const NotificationsArtworksLikesApiFp = function(configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Clear/delete all artwork like notifications
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async clearAllArtworkLikeNotifications(options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<InlineResponse20030>>> {
            const localVarAxiosArgs = await NotificationsArtworksLikesApiAxiosParamCreator(configuration).clearAllArtworkLikeNotifications(options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * Get notification when artwork liked by other users, auth token required.
         * @summary Get artwork liked notifications
         * @param {number} showLimit Determine how many user to show on each notification, the rest user who liked the artwork will be displayed as &#x27;other X people liked your artwork&#x27;
         * @param {number} page Pagination index
         * @param {number} perPage How many record to show per page of pagination
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getArtworkLikedNotifications(showLimit: number, page: number, perPage: number, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<InlineResponse20029>>> {
            const localVarAxiosArgs = await NotificationsArtworksLikesApiAxiosParamCreator(configuration).getArtworkLikedNotifications(showLimit, page, perPage, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @summary Mark specific artwork like notification as read
         * @param {number} workId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async markArtworkLikeNotificationAsRead(workId: number, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<InlineResponse20030>>> {
            const localVarAxiosArgs = await NotificationsArtworksLikesApiAxiosParamCreator(configuration).markArtworkLikeNotificationAsRead(workId, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @summary Read all artwork like notifications
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async readAllArtworkLikeNotifications(options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<InlineResponse20030>>> {
            const localVarAxiosArgs = await NotificationsArtworksLikesApiAxiosParamCreator(configuration).readAllArtworkLikeNotifications(options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
    }
};

/**
 * NotificationsArtworksLikesApi - factory interface
 * @export
 */
export const NotificationsArtworksLikesApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    return {
        /**
         * 
         * @summary Clear/delete all artwork like notifications
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async clearAllArtworkLikeNotifications(options?: AxiosRequestConfig): Promise<AxiosResponse<InlineResponse20030>> {
            return NotificationsArtworksLikesApiFp(configuration).clearAllArtworkLikeNotifications(options).then((request) => request(axios, basePath));
        },
        /**
         * Get notification when artwork liked by other users, auth token required.
         * @summary Get artwork liked notifications
         * @param {number} showLimit Determine how many user to show on each notification, the rest user who liked the artwork will be displayed as &#x27;other X people liked your artwork&#x27;
         * @param {number} page Pagination index
         * @param {number} perPage How many record to show per page of pagination
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getArtworkLikedNotifications(showLimit: number, page: number, perPage: number, options?: AxiosRequestConfig): Promise<AxiosResponse<InlineResponse20029>> {
            return NotificationsArtworksLikesApiFp(configuration).getArtworkLikedNotifications(showLimit, page, perPage, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Mark specific artwork like notification as read
         * @param {number} workId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async markArtworkLikeNotificationAsRead(workId: number, options?: AxiosRequestConfig): Promise<AxiosResponse<InlineResponse20030>> {
            return NotificationsArtworksLikesApiFp(configuration).markArtworkLikeNotificationAsRead(workId, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Read all artwork like notifications
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async readAllArtworkLikeNotifications(options?: AxiosRequestConfig): Promise<AxiosResponse<InlineResponse20030>> {
            return NotificationsArtworksLikesApiFp(configuration).readAllArtworkLikeNotifications(options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * NotificationsArtworksLikesApi - object-oriented interface
 * @export
 * @class NotificationsArtworksLikesApi
 * @extends {BaseAPI}
 */
export class NotificationsArtworksLikesApi extends BaseAPI {
    /**
     * 
     * @summary Clear/delete all artwork like notifications
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof NotificationsArtworksLikesApi
     */
    public async clearAllArtworkLikeNotifications(options?: AxiosRequestConfig) : Promise<AxiosResponse<InlineResponse20030>> {
        return NotificationsArtworksLikesApiFp(this.configuration).clearAllArtworkLikeNotifications(options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * Get notification when artwork liked by other users, auth token required.
     * @summary Get artwork liked notifications
     * @param {number} showLimit Determine how many user to show on each notification, the rest user who liked the artwork will be displayed as &#x27;other X people liked your artwork&#x27;
     * @param {number} page Pagination index
     * @param {number} perPage How many record to show per page of pagination
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof NotificationsArtworksLikesApi
     */
    public async getArtworkLikedNotifications(showLimit: number, page: number, perPage: number, options?: AxiosRequestConfig) : Promise<AxiosResponse<InlineResponse20029>> {
        return NotificationsArtworksLikesApiFp(this.configuration).getArtworkLikedNotifications(showLimit, page, perPage, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @summary Mark specific artwork like notification as read
     * @param {number} workId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof NotificationsArtworksLikesApi
     */
    public async markArtworkLikeNotificationAsRead(workId: number, options?: AxiosRequestConfig) : Promise<AxiosResponse<InlineResponse20030>> {
        return NotificationsArtworksLikesApiFp(this.configuration).markArtworkLikeNotificationAsRead(workId, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @summary Read all artwork like notifications
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof NotificationsArtworksLikesApi
     */
    public async readAllArtworkLikeNotifications(options?: AxiosRequestConfig) : Promise<AxiosResponse<InlineResponse20030>> {
        return NotificationsArtworksLikesApiFp(this.configuration).readAllArtworkLikeNotifications(options).then((request) => request(this.axios, this.basePath));
    }
}

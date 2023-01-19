/* tslint:disable */
/* eslint-disable */
/**
 * API Documentation
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
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
import { InlineResponse20046 } from '../models';
/**
 * NotificationsUsersApi - axios parameter creator
 * @export
 */
export const NotificationsUsersApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Clear all user follow notifications
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        clearUserFollowNotifications: async (options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/notifications/users/follow/clear`;
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
         * @summary Get user follow notifications
         * @param {number} page Pagination index
         * @param {number} perPage How many record to show per page of pagination
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getUserFollowNotifications: async (page: number, perPage: number, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'page' is not null or undefined
            if (page === null || page === undefined) {
                throw new RequiredError('page','Required parameter page was null or undefined when calling getUserFollowNotifications.');
            }
            // verify required parameter 'perPage' is not null or undefined
            if (perPage === null || perPage === undefined) {
                throw new RequiredError('perPage','Required parameter perPage was null or undefined when calling getUserFollowNotifications.');
            }
            const localVarPath = `/notifications/users/follow`;
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
         * @summary Mark all user follow notification as read
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        markAllUserFollowNotificationAsRead: async (options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/notifications/users/follow/read/all`;
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
         * @summary Mark specific user follow notification as read
         * @param {number} followerId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        markUserFollowNotificationAsRead: async (followerId: number, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'followerId' is not null or undefined
            if (followerId === null || followerId === undefined) {
                throw new RequiredError('followerId','Required parameter followerId was null or undefined when calling markUserFollowNotificationAsRead.');
            }
            const localVarPath = `/notifications/users/follow/read/{followerId}`
                .replace(`{${"followerId"}}`, encodeURIComponent(String(followerId)));
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
 * NotificationsUsersApi - functional programming interface
 * @export
 */
export const NotificationsUsersApiFp = function(configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Clear all user follow notifications
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async clearUserFollowNotifications(options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<InlineResponse20041>>> {
            const localVarAxiosArgs = await NotificationsUsersApiAxiosParamCreator(configuration).clearUserFollowNotifications(options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @summary Get user follow notifications
         * @param {number} page Pagination index
         * @param {number} perPage How many record to show per page of pagination
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getUserFollowNotifications(page: number, perPage: number, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<InlineResponse20046>>> {
            const localVarAxiosArgs = await NotificationsUsersApiAxiosParamCreator(configuration).getUserFollowNotifications(page, perPage, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @summary Mark all user follow notification as read
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async markAllUserFollowNotificationAsRead(options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<InlineResponse20041>>> {
            const localVarAxiosArgs = await NotificationsUsersApiAxiosParamCreator(configuration).markAllUserFollowNotificationAsRead(options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @summary Mark specific user follow notification as read
         * @param {number} followerId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async markUserFollowNotificationAsRead(followerId: number, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<InlineResponse20041>>> {
            const localVarAxiosArgs = await NotificationsUsersApiAxiosParamCreator(configuration).markUserFollowNotificationAsRead(followerId, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
    }
};

/**
 * NotificationsUsersApi - factory interface
 * @export
 */
export const NotificationsUsersApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    return {
        /**
         * 
         * @summary Clear all user follow notifications
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async clearUserFollowNotifications(options?: AxiosRequestConfig): Promise<AxiosResponse<InlineResponse20041>> {
            return NotificationsUsersApiFp(configuration).clearUserFollowNotifications(options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Get user follow notifications
         * @param {number} page Pagination index
         * @param {number} perPage How many record to show per page of pagination
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getUserFollowNotifications(page: number, perPage: number, options?: AxiosRequestConfig): Promise<AxiosResponse<InlineResponse20046>> {
            return NotificationsUsersApiFp(configuration).getUserFollowNotifications(page, perPage, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Mark all user follow notification as read
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async markAllUserFollowNotificationAsRead(options?: AxiosRequestConfig): Promise<AxiosResponse<InlineResponse20041>> {
            return NotificationsUsersApiFp(configuration).markAllUserFollowNotificationAsRead(options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Mark specific user follow notification as read
         * @param {number} followerId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async markUserFollowNotificationAsRead(followerId: number, options?: AxiosRequestConfig): Promise<AxiosResponse<InlineResponse20041>> {
            return NotificationsUsersApiFp(configuration).markUserFollowNotificationAsRead(followerId, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * NotificationsUsersApi - object-oriented interface
 * @export
 * @class NotificationsUsersApi
 * @extends {BaseAPI}
 */
export class NotificationsUsersApi extends BaseAPI {
    /**
     * 
     * @summary Clear all user follow notifications
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof NotificationsUsersApi
     */
    public async clearUserFollowNotifications(options?: AxiosRequestConfig) : Promise<AxiosResponse<InlineResponse20041>> {
        return NotificationsUsersApiFp(this.configuration).clearUserFollowNotifications(options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @summary Get user follow notifications
     * @param {number} page Pagination index
     * @param {number} perPage How many record to show per page of pagination
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof NotificationsUsersApi
     */
    public async getUserFollowNotifications(page: number, perPage: number, options?: AxiosRequestConfig) : Promise<AxiosResponse<InlineResponse20046>> {
        return NotificationsUsersApiFp(this.configuration).getUserFollowNotifications(page, perPage, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @summary Mark all user follow notification as read
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof NotificationsUsersApi
     */
    public async markAllUserFollowNotificationAsRead(options?: AxiosRequestConfig) : Promise<AxiosResponse<InlineResponse20041>> {
        return NotificationsUsersApiFp(this.configuration).markAllUserFollowNotificationAsRead(options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @summary Mark specific user follow notification as read
     * @param {number} followerId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof NotificationsUsersApi
     */
    public async markUserFollowNotificationAsRead(followerId: number, options?: AxiosRequestConfig) : Promise<AxiosResponse<InlineResponse20041>> {
        return NotificationsUsersApiFp(this.configuration).markUserFollowNotificationAsRead(followerId, options).then((request) => request(this.axios, this.basePath));
    }
}

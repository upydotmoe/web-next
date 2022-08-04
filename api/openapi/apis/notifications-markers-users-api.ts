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
import { InlineResponse20015 } from '../models';
/**
 * NotificationsMarkersUsersApi - axios parameter creator
 * @export
 */
export const NotificationsMarkersUsersApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Return how many unexpanded user follow notifications
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getUserFollowMarker: async (options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/notifications/users/follow/marker`;
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
    }
};

/**
 * NotificationsMarkersUsersApi - functional programming interface
 * @export
 */
export const NotificationsMarkersUsersApiFp = function(configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Return how many unexpanded user follow notifications
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getUserFollowMarker(options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<InlineResponse20015>>> {
            const localVarAxiosArgs = await NotificationsMarkersUsersApiAxiosParamCreator(configuration).getUserFollowMarker(options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
    }
};

/**
 * NotificationsMarkersUsersApi - factory interface
 * @export
 */
export const NotificationsMarkersUsersApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    return {
        /**
         * 
         * @summary Return how many unexpanded user follow notifications
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getUserFollowMarker(options?: AxiosRequestConfig): Promise<AxiosResponse<InlineResponse20015>> {
            return NotificationsMarkersUsersApiFp(configuration).getUserFollowMarker(options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * NotificationsMarkersUsersApi - object-oriented interface
 * @export
 * @class NotificationsMarkersUsersApi
 * @extends {BaseAPI}
 */
export class NotificationsMarkersUsersApi extends BaseAPI {
    /**
     * 
     * @summary Return how many unexpanded user follow notifications
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof NotificationsMarkersUsersApi
     */
    public async getUserFollowMarker(options?: AxiosRequestConfig) : Promise<AxiosResponse<InlineResponse20015>> {
        return NotificationsMarkersUsersApiFp(this.configuration).getUserFollowMarker(options).then((request) => request(this.axios, this.basePath));
    }
}

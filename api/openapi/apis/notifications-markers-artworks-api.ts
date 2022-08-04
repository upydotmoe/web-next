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
 * NotificationsMarkersArtworksApi - axios parameter creator
 * @export
 */
export const NotificationsMarkersArtworksApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Return how many unexpanded artwork comment liked notifications
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getArtworkCommentLikedMarker: async (options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/notifications/artworks/comments/liked/marker`;
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
         * @summary Return how many unexpanded artwork comment notifications
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getArtworkCommentMarker: async (options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/notifications/artworks/comments/marker`;
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
         * @summary Return how many unexpanded artwork comment reply notifications
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getArtworkCommentRepliesMarker: async (options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/notifications/artworks/comments/replies/marker`;
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
         * @summary Return how many unexpanded artwork comment reply like notifications
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getArtworkCommentReplyLikesMarker: async (options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/notifications/artworks/comments/replies/liked/marker`;
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
         * @summary Return how many unexpanded all artwork comment related notifications
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getArtworkCommentsAndRepliesMarker: async (options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/notifications/artworks/comments-and-replies/marker`;
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
         * @summary Return how many unexpanded artwork like notifications
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getArtworkLikeMarker: async (options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/notifications/artworks/liked/marker`;
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
 * NotificationsMarkersArtworksApi - functional programming interface
 * @export
 */
export const NotificationsMarkersArtworksApiFp = function(configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Return how many unexpanded artwork comment liked notifications
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getArtworkCommentLikedMarker(options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<InlineResponse20015>>> {
            const localVarAxiosArgs = await NotificationsMarkersArtworksApiAxiosParamCreator(configuration).getArtworkCommentLikedMarker(options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @summary Return how many unexpanded artwork comment notifications
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getArtworkCommentMarker(options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<InlineResponse20015>>> {
            const localVarAxiosArgs = await NotificationsMarkersArtworksApiAxiosParamCreator(configuration).getArtworkCommentMarker(options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @summary Return how many unexpanded artwork comment reply notifications
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getArtworkCommentRepliesMarker(options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<InlineResponse20015>>> {
            const localVarAxiosArgs = await NotificationsMarkersArtworksApiAxiosParamCreator(configuration).getArtworkCommentRepliesMarker(options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @summary Return how many unexpanded artwork comment reply like notifications
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getArtworkCommentReplyLikesMarker(options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<InlineResponse20015>>> {
            const localVarAxiosArgs = await NotificationsMarkersArtworksApiAxiosParamCreator(configuration).getArtworkCommentReplyLikesMarker(options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @summary Return how many unexpanded all artwork comment related notifications
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getArtworkCommentsAndRepliesMarker(options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<InlineResponse20015>>> {
            const localVarAxiosArgs = await NotificationsMarkersArtworksApiAxiosParamCreator(configuration).getArtworkCommentsAndRepliesMarker(options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @summary Return how many unexpanded artwork like notifications
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getArtworkLikeMarker(options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<InlineResponse20015>>> {
            const localVarAxiosArgs = await NotificationsMarkersArtworksApiAxiosParamCreator(configuration).getArtworkLikeMarker(options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
    }
};

/**
 * NotificationsMarkersArtworksApi - factory interface
 * @export
 */
export const NotificationsMarkersArtworksApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    return {
        /**
         * 
         * @summary Return how many unexpanded artwork comment liked notifications
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getArtworkCommentLikedMarker(options?: AxiosRequestConfig): Promise<AxiosResponse<InlineResponse20015>> {
            return NotificationsMarkersArtworksApiFp(configuration).getArtworkCommentLikedMarker(options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Return how many unexpanded artwork comment notifications
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getArtworkCommentMarker(options?: AxiosRequestConfig): Promise<AxiosResponse<InlineResponse20015>> {
            return NotificationsMarkersArtworksApiFp(configuration).getArtworkCommentMarker(options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Return how many unexpanded artwork comment reply notifications
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getArtworkCommentRepliesMarker(options?: AxiosRequestConfig): Promise<AxiosResponse<InlineResponse20015>> {
            return NotificationsMarkersArtworksApiFp(configuration).getArtworkCommentRepliesMarker(options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Return how many unexpanded artwork comment reply like notifications
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getArtworkCommentReplyLikesMarker(options?: AxiosRequestConfig): Promise<AxiosResponse<InlineResponse20015>> {
            return NotificationsMarkersArtworksApiFp(configuration).getArtworkCommentReplyLikesMarker(options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Return how many unexpanded all artwork comment related notifications
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getArtworkCommentsAndRepliesMarker(options?: AxiosRequestConfig): Promise<AxiosResponse<InlineResponse20015>> {
            return NotificationsMarkersArtworksApiFp(configuration).getArtworkCommentsAndRepliesMarker(options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Return how many unexpanded artwork like notifications
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getArtworkLikeMarker(options?: AxiosRequestConfig): Promise<AxiosResponse<InlineResponse20015>> {
            return NotificationsMarkersArtworksApiFp(configuration).getArtworkLikeMarker(options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * NotificationsMarkersArtworksApi - object-oriented interface
 * @export
 * @class NotificationsMarkersArtworksApi
 * @extends {BaseAPI}
 */
export class NotificationsMarkersArtworksApi extends BaseAPI {
    /**
     * 
     * @summary Return how many unexpanded artwork comment liked notifications
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof NotificationsMarkersArtworksApi
     */
    public async getArtworkCommentLikedMarker(options?: AxiosRequestConfig) : Promise<AxiosResponse<InlineResponse20015>> {
        return NotificationsMarkersArtworksApiFp(this.configuration).getArtworkCommentLikedMarker(options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @summary Return how many unexpanded artwork comment notifications
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof NotificationsMarkersArtworksApi
     */
    public async getArtworkCommentMarker(options?: AxiosRequestConfig) : Promise<AxiosResponse<InlineResponse20015>> {
        return NotificationsMarkersArtworksApiFp(this.configuration).getArtworkCommentMarker(options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @summary Return how many unexpanded artwork comment reply notifications
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof NotificationsMarkersArtworksApi
     */
    public async getArtworkCommentRepliesMarker(options?: AxiosRequestConfig) : Promise<AxiosResponse<InlineResponse20015>> {
        return NotificationsMarkersArtworksApiFp(this.configuration).getArtworkCommentRepliesMarker(options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @summary Return how many unexpanded artwork comment reply like notifications
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof NotificationsMarkersArtworksApi
     */
    public async getArtworkCommentReplyLikesMarker(options?: AxiosRequestConfig) : Promise<AxiosResponse<InlineResponse20015>> {
        return NotificationsMarkersArtworksApiFp(this.configuration).getArtworkCommentReplyLikesMarker(options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @summary Return how many unexpanded all artwork comment related notifications
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof NotificationsMarkersArtworksApi
     */
    public async getArtworkCommentsAndRepliesMarker(options?: AxiosRequestConfig) : Promise<AxiosResponse<InlineResponse20015>> {
        return NotificationsMarkersArtworksApiFp(this.configuration).getArtworkCommentsAndRepliesMarker(options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @summary Return how many unexpanded artwork like notifications
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof NotificationsMarkersArtworksApi
     */
    public async getArtworkLikeMarker(options?: AxiosRequestConfig) : Promise<AxiosResponse<InlineResponse20015>> {
        return NotificationsMarkersArtworksApiFp(this.configuration).getArtworkLikeMarker(options).then((request) => request(this.axios, this.basePath));
    }
}

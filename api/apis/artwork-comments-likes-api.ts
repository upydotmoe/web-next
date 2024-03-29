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
import { InlineResponse20026 } from '../models';
import { SuccessMessageModel } from '../models';
/**
 * ArtworkCommentsLikesApi - axios parameter creator
 * @export
 */
export const ArtworkCommentsLikesApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Like a comment
         * @param {number} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        likeAComment: async (id: number, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            if (id === null || id === undefined) {
                throw new RequiredError('id','Required parameter id was null or undefined when calling likeAComment.');
            }
            const localVarPath = `/artworks/comments/like/{id}`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
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
         * @summary Unlike a comment
         * @param {number} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        unlikeAComment: async (id: number, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            if (id === null || id === undefined) {
                throw new RequiredError('id','Required parameter id was null or undefined when calling unlikeAComment.');
            }
            const localVarPath = `/artworks/comments/unlike/{id}`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions :AxiosRequestConfig = { method: 'DELETE', ...baseOptions, ...options};
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
 * ArtworkCommentsLikesApi - functional programming interface
 * @export
 */
export const ArtworkCommentsLikesApiFp = function(configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Like a comment
         * @param {number} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async likeAComment(id: number, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<InlineResponse20026>>> {
            const localVarAxiosArgs = await ArtworkCommentsLikesApiAxiosParamCreator(configuration).likeAComment(id, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @summary Unlike a comment
         * @param {number} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async unlikeAComment(id: number, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<SuccessMessageModel>>> {
            const localVarAxiosArgs = await ArtworkCommentsLikesApiAxiosParamCreator(configuration).unlikeAComment(id, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
    }
};

/**
 * ArtworkCommentsLikesApi - factory interface
 * @export
 */
export const ArtworkCommentsLikesApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    return {
        /**
         * 
         * @summary Like a comment
         * @param {number} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async likeAComment(id: number, options?: AxiosRequestConfig): Promise<AxiosResponse<InlineResponse20026>> {
            return ArtworkCommentsLikesApiFp(configuration).likeAComment(id, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Unlike a comment
         * @param {number} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async unlikeAComment(id: number, options?: AxiosRequestConfig): Promise<AxiosResponse<SuccessMessageModel>> {
            return ArtworkCommentsLikesApiFp(configuration).unlikeAComment(id, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * ArtworkCommentsLikesApi - object-oriented interface
 * @export
 * @class ArtworkCommentsLikesApi
 * @extends {BaseAPI}
 */
export class ArtworkCommentsLikesApi extends BaseAPI {
    /**
     * 
     * @summary Like a comment
     * @param {number} id 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ArtworkCommentsLikesApi
     */
    public async likeAComment(id: number, options?: AxiosRequestConfig) : Promise<AxiosResponse<InlineResponse20026>> {
        return ArtworkCommentsLikesApiFp(this.configuration).likeAComment(id, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @summary Unlike a comment
     * @param {number} id 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ArtworkCommentsLikesApi
     */
    public async unlikeAComment(id: number, options?: AxiosRequestConfig) : Promise<AxiosResponse<SuccessMessageModel>> {
        return ArtworkCommentsLikesApiFp(this.configuration).unlikeAComment(id, options).then((request) => request(this.axios, this.basePath));
    }
}

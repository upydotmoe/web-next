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
import { InlineResponse20027 } from '../models';
import { SuccessMessageModel } from '../models';
/**
 * ArtworkViewsApi - axios parameter creator
 * @export
 */
export const ArtworkViewsApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Increase view count of artwork
         * @param {number} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        addViewCount: async (id: number, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            if (id === null || id === undefined) {
                throw new RequiredError('id','Required parameter id was null or undefined when calling addViewCount.');
            }
            const localVarPath = `/artworks/add-view/{id}`
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
         * @param {number} id 
         * @param {string} mode 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        countViews: async (id: number, mode: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            if (id === null || id === undefined) {
                throw new RequiredError('id','Required parameter id was null or undefined when calling countViews.');
            }
            // verify required parameter 'mode' is not null or undefined
            if (mode === null || mode === undefined) {
                throw new RequiredError('mode','Required parameter mode was null or undefined when calling countViews.');
            }
            const localVarPath = `/artworks/count-views/{id}`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
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

            if (mode !== undefined) {
                localVarQueryParameter['mode'] = mode;
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
    }
};

/**
 * ArtworkViewsApi - functional programming interface
 * @export
 */
export const ArtworkViewsApiFp = function(configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Increase view count of artwork
         * @param {number} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async addViewCount(id: number, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<SuccessMessageModel>>> {
            const localVarAxiosArgs = await ArtworkViewsApiAxiosParamCreator(configuration).addViewCount(id, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @param {number} id 
         * @param {string} mode 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async countViews(id: number, mode: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<InlineResponse20027>>> {
            const localVarAxiosArgs = await ArtworkViewsApiAxiosParamCreator(configuration).countViews(id, mode, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
    }
};

/**
 * ArtworkViewsApi - factory interface
 * @export
 */
export const ArtworkViewsApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    return {
        /**
         * 
         * @summary Increase view count of artwork
         * @param {number} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async addViewCount(id: number, options?: AxiosRequestConfig): Promise<AxiosResponse<SuccessMessageModel>> {
            return ArtworkViewsApiFp(configuration).addViewCount(id, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {number} id 
         * @param {string} mode 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async countViews(id: number, mode: string, options?: AxiosRequestConfig): Promise<AxiosResponse<InlineResponse20027>> {
            return ArtworkViewsApiFp(configuration).countViews(id, mode, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * ArtworkViewsApi - object-oriented interface
 * @export
 * @class ArtworkViewsApi
 * @extends {BaseAPI}
 */
export class ArtworkViewsApi extends BaseAPI {
    /**
     * 
     * @summary Increase view count of artwork
     * @param {number} id 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ArtworkViewsApi
     */
    public async addViewCount(id: number, options?: AxiosRequestConfig) : Promise<AxiosResponse<SuccessMessageModel>> {
        return ArtworkViewsApiFp(this.configuration).addViewCount(id, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @param {number} id 
     * @param {string} mode 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ArtworkViewsApi
     */
    public async countViews(id: number, mode: string, options?: AxiosRequestConfig) : Promise<AxiosResponse<InlineResponse20027>> {
        return ArtworkViewsApiFp(this.configuration).countViews(id, mode, options).then((request) => request(this.axios, this.basePath));
    }
}

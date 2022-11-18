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
import { InlineResponse20017 } from '../models';
/**
 * ArtworksApi - axios parameter creator
 * @export
 */
export const ArtworksApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Check if there is an artwork to show to the user/visitor
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        checkArtworkAvailability: async (options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/artworks/check-availability`;
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

            // authentication none required

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
 * ArtworksApi - functional programming interface
 * @export
 */
export const ArtworksApiFp = function(configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Check if there is an artwork to show to the user/visitor
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async checkArtworkAvailability(options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<InlineResponse20017>>> {
            const localVarAxiosArgs = await ArtworksApiAxiosParamCreator(configuration).checkArtworkAvailability(options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
    }
};

/**
 * ArtworksApi - factory interface
 * @export
 */
export const ArtworksApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    return {
        /**
         * 
         * @summary Check if there is an artwork to show to the user/visitor
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async checkArtworkAvailability(options?: AxiosRequestConfig): Promise<AxiosResponse<InlineResponse20017>> {
            return ArtworksApiFp(configuration).checkArtworkAvailability(options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * ArtworksApi - object-oriented interface
 * @export
 * @class ArtworksApi
 * @extends {BaseAPI}
 */
export class ArtworksApi extends BaseAPI {
    /**
     * 
     * @summary Check if there is an artwork to show to the user/visitor
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ArtworksApi
     */
    public async checkArtworkAvailability(options?: AxiosRequestConfig) : Promise<AxiosResponse<InlineResponse20017>> {
        return ArtworksApiFp(this.configuration).checkArtworkAvailability(options).then((request) => request(this.axios, this.basePath));
    }
}

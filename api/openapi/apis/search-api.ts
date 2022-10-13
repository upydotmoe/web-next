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
import { InlineResponse20028 } from '../models';
/**
 * SearchApi - axios parameter creator
 * @export
 */
export const SearchApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * Find artworks by keyword, the search method will find on title, description or tags that contain provided keyword. <br><br>Auth token is optional, but if it's present, it will return an additional keys that only appears in authenticated access only.
         * @summary Search artworks (O)
         * @param {string} keyword 
         * @param {string} range 
         * @param {string} by 
         * @param {number} page Pagination index
         * @param {number} perPage How many record to show per page of pagination
         * @param {string} [mode] 
         * @param {boolean} [following] 
         * @param {boolean} [recent] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        searchArtworks: async (keyword: string, range: string, by: string, page: number, perPage: number, mode?: string, following?: boolean, recent?: boolean, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'keyword' is not null or undefined
            if (keyword === null || keyword === undefined) {
                throw new RequiredError('keyword','Required parameter keyword was null or undefined when calling searchArtworks.');
            }
            // verify required parameter 'range' is not null or undefined
            if (range === null || range === undefined) {
                throw new RequiredError('range','Required parameter range was null or undefined when calling searchArtworks.');
            }
            // verify required parameter 'by' is not null or undefined
            if (by === null || by === undefined) {
                throw new RequiredError('by','Required parameter by was null or undefined when calling searchArtworks.');
            }
            // verify required parameter 'page' is not null or undefined
            if (page === null || page === undefined) {
                throw new RequiredError('page','Required parameter page was null or undefined when calling searchArtworks.');
            }
            // verify required parameter 'perPage' is not null or undefined
            if (perPage === null || perPage === undefined) {
                throw new RequiredError('perPage','Required parameter perPage was null or undefined when calling searchArtworks.');
            }
            const localVarPath = `/search/artworks`;
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

            if (keyword !== undefined) {
                localVarQueryParameter['keyword'] = keyword;
            }

            if (range !== undefined) {
                localVarQueryParameter['range'] = range;
            }

            if (by !== undefined) {
                localVarQueryParameter['by'] = by;
            }

            if (mode !== undefined) {
                localVarQueryParameter['mode'] = mode;
            }

            if (following !== undefined) {
                localVarQueryParameter['following'] = following;
            }

            if (recent !== undefined) {
                localVarQueryParameter['recent'] = recent;
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
         * Find users by keyword, the search method will find on username, name or pen name that contain provided keyword. <br><br>Auth token is optional, but if token is present it will return an additional keys that only available on authenticated access.
         * @summary Search users (O)
         * @param {string} keyword 
         * @param {number} page Pagination index
         * @param {number} perPage How many record to show per page of pagination
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        searchUsers: async (keyword: string, page: number, perPage: number, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'keyword' is not null or undefined
            if (keyword === null || keyword === undefined) {
                throw new RequiredError('keyword','Required parameter keyword was null or undefined when calling searchUsers.');
            }
            // verify required parameter 'page' is not null or undefined
            if (page === null || page === undefined) {
                throw new RequiredError('page','Required parameter page was null or undefined when calling searchUsers.');
            }
            // verify required parameter 'perPage' is not null or undefined
            if (perPage === null || perPage === undefined) {
                throw new RequiredError('perPage','Required parameter perPage was null or undefined when calling searchUsers.');
            }
            const localVarPath = `/search/user`;
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

            if (keyword !== undefined) {
                localVarQueryParameter['keyword'] = keyword;
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
    }
};

/**
 * SearchApi - functional programming interface
 * @export
 */
export const SearchApiFp = function(configuration?: Configuration) {
    return {
        /**
         * Find artworks by keyword, the search method will find on title, description or tags that contain provided keyword. <br><br>Auth token is optional, but if it's present, it will return an additional keys that only appears in authenticated access only.
         * @summary Search artworks (O)
         * @param {string} keyword 
         * @param {string} range 
         * @param {string} by 
         * @param {number} page Pagination index
         * @param {number} perPage How many record to show per page of pagination
         * @param {string} [mode] 
         * @param {boolean} [following] 
         * @param {boolean} [recent] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async searchArtworks(keyword: string, range: string, by: string, page: number, perPage: number, mode?: string, following?: boolean, recent?: boolean, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<InlineResponse20015>>> {
            const localVarAxiosArgs = await SearchApiAxiosParamCreator(configuration).searchArtworks(keyword, range, by, page, perPage, mode, following, recent, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * Find users by keyword, the search method will find on username, name or pen name that contain provided keyword. <br><br>Auth token is optional, but if token is present it will return an additional keys that only available on authenticated access.
         * @summary Search users (O)
         * @param {string} keyword 
         * @param {number} page Pagination index
         * @param {number} perPage How many record to show per page of pagination
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async searchUsers(keyword: string, page: number, perPage: number, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<InlineResponse20028>>> {
            const localVarAxiosArgs = await SearchApiAxiosParamCreator(configuration).searchUsers(keyword, page, perPage, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
    }
};

/**
 * SearchApi - factory interface
 * @export
 */
export const SearchApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    return {
        /**
         * Find artworks by keyword, the search method will find on title, description or tags that contain provided keyword. <br><br>Auth token is optional, but if it's present, it will return an additional keys that only appears in authenticated access only.
         * @summary Search artworks (O)
         * @param {string} keyword 
         * @param {string} range 
         * @param {string} by 
         * @param {number} page Pagination index
         * @param {number} perPage How many record to show per page of pagination
         * @param {string} [mode] 
         * @param {boolean} [following] 
         * @param {boolean} [recent] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async searchArtworks(keyword: string, range: string, by: string, page: number, perPage: number, mode?: string, following?: boolean, recent?: boolean, options?: AxiosRequestConfig): Promise<AxiosResponse<InlineResponse20015>> {
            return SearchApiFp(configuration).searchArtworks(keyword, range, by, page, perPage, mode, following, recent, options).then((request) => request(axios, basePath));
        },
        /**
         * Find users by keyword, the search method will find on username, name or pen name that contain provided keyword. <br><br>Auth token is optional, but if token is present it will return an additional keys that only available on authenticated access.
         * @summary Search users (O)
         * @param {string} keyword 
         * @param {number} page Pagination index
         * @param {number} perPage How many record to show per page of pagination
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async searchUsers(keyword: string, page: number, perPage: number, options?: AxiosRequestConfig): Promise<AxiosResponse<InlineResponse20028>> {
            return SearchApiFp(configuration).searchUsers(keyword, page, perPage, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * SearchApi - object-oriented interface
 * @export
 * @class SearchApi
 * @extends {BaseAPI}
 */
export class SearchApi extends BaseAPI {
    /**
     * Find artworks by keyword, the search method will find on title, description or tags that contain provided keyword. <br><br>Auth token is optional, but if it's present, it will return an additional keys that only appears in authenticated access only.
     * @summary Search artworks (O)
     * @param {string} keyword 
     * @param {string} range 
     * @param {string} by 
     * @param {number} page Pagination index
     * @param {number} perPage How many record to show per page of pagination
     * @param {string} [mode] 
     * @param {boolean} [following] 
     * @param {boolean} [recent] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SearchApi
     */
    public async searchArtworks(keyword: string, range: string, by: string, page: number, perPage: number, mode?: string, following?: boolean, recent?: boolean, options?: AxiosRequestConfig) : Promise<AxiosResponse<InlineResponse20015>> {
        return SearchApiFp(this.configuration).searchArtworks(keyword, range, by, page, perPage, mode, following, recent, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * Find users by keyword, the search method will find on username, name or pen name that contain provided keyword. <br><br>Auth token is optional, but if token is present it will return an additional keys that only available on authenticated access.
     * @summary Search users (O)
     * @param {string} keyword 
     * @param {number} page Pagination index
     * @param {number} perPage How many record to show per page of pagination
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SearchApi
     */
    public async searchUsers(keyword: string, page: number, perPage: number, options?: AxiosRequestConfig) : Promise<AxiosResponse<InlineResponse20028>> {
        return SearchApiFp(this.configuration).searchUsers(keyword, page, perPage, options).then((request) => request(this.axios, this.basePath));
    }
}

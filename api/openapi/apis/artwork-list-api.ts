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
import { InlineResponse20014 } from '../models';
import { InlineResponse20022 } from '../models';
/**
 * ArtworkListApi - axios parameter creator
 * @export
 */
export const ArtworkListApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Get latest uploaded artworks from followed users
         * @param {number} perPage How many record to show per page of pagination
         * @param {number} page Pagination index
         * @param {string} [mode] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getFollowingArtworks: async (perPage: number, page: number, mode?: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'perPage' is not null or undefined
            if (perPage === null || perPage === undefined) {
                throw new RequiredError('perPage','Required parameter perPage was null or undefined when calling getFollowingArtworks.');
            }
            // verify required parameter 'page' is not null or undefined
            if (page === null || page === undefined) {
                throw new RequiredError('page','Required parameter page was null or undefined when calling getFollowingArtworks.');
            }
            const localVarPath = `/artworks/following`;
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

            if (perPage !== undefined) {
                localVarQueryParameter['per_page'] = perPage;
            }

            if (page !== undefined) {
                localVarQueryParameter['page'] = page;
            }

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
        /**
         * 
         * @summary List latest uploaded artworks
         * @param {number} perPage How many record to show per page of pagination
         * @param {number} page Pagination index
         * @param {string} [mode] 
         * @param {string} [tags] 
         * @param {boolean} [following] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getLatestWorks: async (perPage: number, page: number, mode?: string, tags?: string, following?: boolean, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'perPage' is not null or undefined
            if (perPage === null || perPage === undefined) {
                throw new RequiredError('perPage','Required parameter perPage was null or undefined when calling getLatestWorks.');
            }
            // verify required parameter 'page' is not null or undefined
            if (page === null || page === undefined) {
                throw new RequiredError('page','Required parameter page was null or undefined when calling getLatestWorks.');
            }
            const localVarPath = `/artworks/latest`;
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

            if (perPage !== undefined) {
                localVarQueryParameter['per_page'] = perPage;
            }

            if (page !== undefined) {
                localVarQueryParameter['page'] = page;
            }

            if (mode !== undefined) {
                localVarQueryParameter['mode'] = mode;
            }

            if (tags !== undefined) {
                localVarQueryParameter['tags'] = tags;
            }

            if (following !== undefined) {
                localVarQueryParameter['following'] = following;
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
         * @summary List most popular artworks (with advanced sort and filter features)
         * @param {number} perPage How many record to show per page of pagination
         * @param {number} page Pagination index
         * @param {string} range 
         * @param {string} by 
         * @param {string} [mode] 
         * @param {string} [tags] 
         * @param {boolean} [following] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getMostPopular: async (perPage: number, page: number, range: string, by: string, mode?: string, tags?: string, following?: boolean, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'perPage' is not null or undefined
            if (perPage === null || perPage === undefined) {
                throw new RequiredError('perPage','Required parameter perPage was null or undefined when calling getMostPopular.');
            }
            // verify required parameter 'page' is not null or undefined
            if (page === null || page === undefined) {
                throw new RequiredError('page','Required parameter page was null or undefined when calling getMostPopular.');
            }
            // verify required parameter 'range' is not null or undefined
            if (range === null || range === undefined) {
                throw new RequiredError('range','Required parameter range was null or undefined when calling getMostPopular.');
            }
            // verify required parameter 'by' is not null or undefined
            if (by === null || by === undefined) {
                throw new RequiredError('by','Required parameter by was null or undefined when calling getMostPopular.');
            }
            const localVarPath = `/artworks/most`;
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

            if (perPage !== undefined) {
                localVarQueryParameter['per_page'] = perPage;
            }

            if (page !== undefined) {
                localVarQueryParameter['page'] = page;
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

            if (tags !== undefined) {
                localVarQueryParameter['tags'] = tags;
            }

            if (following !== undefined) {
                localVarQueryParameter['following'] = following;
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
         * @summary Get artworks that related to currently viewed artwork
         * @param {number} workId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getRelatedArtworks: async (workId: number, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'workId' is not null or undefined
            if (workId === null || workId === undefined) {
                throw new RequiredError('workId','Required parameter workId was null or undefined when calling getRelatedArtworks.');
            }
            const localVarPath = `/artworks/related/{workId}`
                .replace(`{${"workId"}}`, encodeURIComponent(String(workId)));
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
        /**
         * 
         * @summary List user's artworks
         * @param {number} userId 
         * @param {number} perPage How many record to show per page of pagination
         * @param {number} page Pagination index
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getUserArtworks: async (userId: number, perPage: number, page: number, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'userId' is not null or undefined
            if (userId === null || userId === undefined) {
                throw new RequiredError('userId','Required parameter userId was null or undefined when calling getUserArtworks.');
            }
            // verify required parameter 'perPage' is not null or undefined
            if (perPage === null || perPage === undefined) {
                throw new RequiredError('perPage','Required parameter perPage was null or undefined when calling getUserArtworks.');
            }
            // verify required parameter 'page' is not null or undefined
            if (page === null || page === undefined) {
                throw new RequiredError('page','Required parameter page was null or undefined when calling getUserArtworks.');
            }
            const localVarPath = `/artworks/user/{userId}`
                .replace(`{${"userId"}}`, encodeURIComponent(String(userId)));
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

            if (perPage !== undefined) {
                localVarQueryParameter['per_page'] = perPage;
            }

            if (page !== undefined) {
                localVarQueryParameter['page'] = page;
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
 * ArtworkListApi - functional programming interface
 * @export
 */
export const ArtworkListApiFp = function(configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Get latest uploaded artworks from followed users
         * @param {number} perPage How many record to show per page of pagination
         * @param {number} page Pagination index
         * @param {string} [mode] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getFollowingArtworks(perPage: number, page: number, mode?: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<InlineResponse20022>>> {
            const localVarAxiosArgs = await ArtworkListApiAxiosParamCreator(configuration).getFollowingArtworks(perPage, page, mode, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @summary List latest uploaded artworks
         * @param {number} perPage How many record to show per page of pagination
         * @param {number} page Pagination index
         * @param {string} [mode] 
         * @param {string} [tags] 
         * @param {boolean} [following] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getLatestWorks(perPage: number, page: number, mode?: string, tags?: string, following?: boolean, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<InlineResponse20014>>> {
            const localVarAxiosArgs = await ArtworkListApiAxiosParamCreator(configuration).getLatestWorks(perPage, page, mode, tags, following, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @summary List most popular artworks (with advanced sort and filter features)
         * @param {number} perPage How many record to show per page of pagination
         * @param {number} page Pagination index
         * @param {string} range 
         * @param {string} by 
         * @param {string} [mode] 
         * @param {string} [tags] 
         * @param {boolean} [following] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getMostPopular(perPage: number, page: number, range: string, by: string, mode?: string, tags?: string, following?: boolean, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<InlineResponse20014>>> {
            const localVarAxiosArgs = await ArtworkListApiAxiosParamCreator(configuration).getMostPopular(perPage, page, range, by, mode, tags, following, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @summary Get artworks that related to currently viewed artwork
         * @param {number} workId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getRelatedArtworks(workId: number, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<InlineResponse20014>>> {
            const localVarAxiosArgs = await ArtworkListApiAxiosParamCreator(configuration).getRelatedArtworks(workId, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @summary List user's artworks
         * @param {number} userId 
         * @param {number} perPage How many record to show per page of pagination
         * @param {number} page Pagination index
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getUserArtworks(userId: number, perPage: number, page: number, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<InlineResponse20014>>> {
            const localVarAxiosArgs = await ArtworkListApiAxiosParamCreator(configuration).getUserArtworks(userId, perPage, page, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
    }
};

/**
 * ArtworkListApi - factory interface
 * @export
 */
export const ArtworkListApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    return {
        /**
         * 
         * @summary Get latest uploaded artworks from followed users
         * @param {number} perPage How many record to show per page of pagination
         * @param {number} page Pagination index
         * @param {string} [mode] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getFollowingArtworks(perPage: number, page: number, mode?: string, options?: AxiosRequestConfig): Promise<AxiosResponse<InlineResponse20022>> {
            return ArtworkListApiFp(configuration).getFollowingArtworks(perPage, page, mode, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary List latest uploaded artworks
         * @param {number} perPage How many record to show per page of pagination
         * @param {number} page Pagination index
         * @param {string} [mode] 
         * @param {string} [tags] 
         * @param {boolean} [following] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getLatestWorks(perPage: number, page: number, mode?: string, tags?: string, following?: boolean, options?: AxiosRequestConfig): Promise<AxiosResponse<InlineResponse20014>> {
            return ArtworkListApiFp(configuration).getLatestWorks(perPage, page, mode, tags, following, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary List most popular artworks (with advanced sort and filter features)
         * @param {number} perPage How many record to show per page of pagination
         * @param {number} page Pagination index
         * @param {string} range 
         * @param {string} by 
         * @param {string} [mode] 
         * @param {string} [tags] 
         * @param {boolean} [following] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getMostPopular(perPage: number, page: number, range: string, by: string, mode?: string, tags?: string, following?: boolean, options?: AxiosRequestConfig): Promise<AxiosResponse<InlineResponse20014>> {
            return ArtworkListApiFp(configuration).getMostPopular(perPage, page, range, by, mode, tags, following, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Get artworks that related to currently viewed artwork
         * @param {number} workId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getRelatedArtworks(workId: number, options?: AxiosRequestConfig): Promise<AxiosResponse<InlineResponse20014>> {
            return ArtworkListApiFp(configuration).getRelatedArtworks(workId, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary List user's artworks
         * @param {number} userId 
         * @param {number} perPage How many record to show per page of pagination
         * @param {number} page Pagination index
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getUserArtworks(userId: number, perPage: number, page: number, options?: AxiosRequestConfig): Promise<AxiosResponse<InlineResponse20014>> {
            return ArtworkListApiFp(configuration).getUserArtworks(userId, perPage, page, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * ArtworkListApi - object-oriented interface
 * @export
 * @class ArtworkListApi
 * @extends {BaseAPI}
 */
export class ArtworkListApi extends BaseAPI {
    /**
     * 
     * @summary Get latest uploaded artworks from followed users
     * @param {number} perPage How many record to show per page of pagination
     * @param {number} page Pagination index
     * @param {string} [mode] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ArtworkListApi
     */
    public async getFollowingArtworks(perPage: number, page: number, mode?: string, options?: AxiosRequestConfig) : Promise<AxiosResponse<InlineResponse20022>> {
        return ArtworkListApiFp(this.configuration).getFollowingArtworks(perPage, page, mode, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @summary List latest uploaded artworks
     * @param {number} perPage How many record to show per page of pagination
     * @param {number} page Pagination index
     * @param {string} [mode] 
     * @param {string} [tags] 
     * @param {boolean} [following] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ArtworkListApi
     */
    public async getLatestWorks(perPage: number, page: number, mode?: string, tags?: string, following?: boolean, options?: AxiosRequestConfig) : Promise<AxiosResponse<InlineResponse20014>> {
        return ArtworkListApiFp(this.configuration).getLatestWorks(perPage, page, mode, tags, following, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @summary List most popular artworks (with advanced sort and filter features)
     * @param {number} perPage How many record to show per page of pagination
     * @param {number} page Pagination index
     * @param {string} range 
     * @param {string} by 
     * @param {string} [mode] 
     * @param {string} [tags] 
     * @param {boolean} [following] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ArtworkListApi
     */
    public async getMostPopular(perPage: number, page: number, range: string, by: string, mode?: string, tags?: string, following?: boolean, options?: AxiosRequestConfig) : Promise<AxiosResponse<InlineResponse20014>> {
        return ArtworkListApiFp(this.configuration).getMostPopular(perPage, page, range, by, mode, tags, following, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @summary Get artworks that related to currently viewed artwork
     * @param {number} workId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ArtworkListApi
     */
    public async getRelatedArtworks(workId: number, options?: AxiosRequestConfig) : Promise<AxiosResponse<InlineResponse20014>> {
        return ArtworkListApiFp(this.configuration).getRelatedArtworks(workId, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @summary List user's artworks
     * @param {number} userId 
     * @param {number} perPage How many record to show per page of pagination
     * @param {number} page Pagination index
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ArtworkListApi
     */
    public async getUserArtworks(userId: number, perPage: number, page: number, options?: AxiosRequestConfig) : Promise<AxiosResponse<InlineResponse20014>> {
        return ArtworkListApiFp(this.configuration).getUserArtworks(userId, perPage, page, options).then((request) => request(this.axios, this.basePath));
    }
}

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
import { InlineResponse20037 } from '../models';
import { InlineResponse20038 } from '../models';
import { InlineResponse2016 } from '../models';
import { SuccessMessageModel } from '../models';
import { TradesHostBody } from '../models';
import { TradesParticipateBody } from '../models';
import { TradesRemoveBody } from '../models';
/**
 * ArtworksArtTradesApi - axios parameter creator
 * @export
 */
export const ArtworksArtTradesApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Cancel a trade, only host can make a request to this endpoint
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        cancelTrade: async (options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/artworks/trades/{roomId}/cancel`;
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
        /**
         * 
         * @summary Get trade detail by ID
         * @param {number} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getArtTradeById: async (id: number, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            if (id === null || id === undefined) {
                throw new RequiredError('id','Required parameter id was null or undefined when calling getArtTradeById.');
            }
            const localVarPath = `/artworks/trades/view/{id}`
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
         * @summary Get latest submitted Art Trades
         * @param {number} page Pagination index
         * @param {number} perPage How many record to show per page of pagination
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getLatestArtTrades: async (page: number, perPage: number, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'page' is not null or undefined
            if (page === null || page === undefined) {
                throw new RequiredError('page','Required parameter page was null or undefined when calling getLatestArtTrades.');
            }
            // verify required parameter 'perPage' is not null or undefined
            if (perPage === null || perPage === undefined) {
                throw new RequiredError('perPage','Required parameter perPage was null or undefined when calling getLatestArtTrades.');
            }
            const localVarPath = `/artworks/trades/latest`;
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
         * @summary Host a new trade / create a new trade room
         * @param {TradesHostBody} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        hostNewTrade: async (body?: TradesHostBody, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/artworks/trades/host`;
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

            localVarHeaderParameter['Content-Type'] = 'application/json';

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
            const needsSerialization = (typeof body !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
            localVarRequestOptions.data =  needsSerialization ? JSON.stringify(body !== undefined ? body : {}) : (body || "");

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Participate to trade room
         * @param {TradesParticipateBody} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        participateToTrade: async (body?: TradesParticipateBody, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/artworks/trades/participate`;
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

            localVarHeaderParameter['Content-Type'] = 'application/json';

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
            const needsSerialization = (typeof body !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
            localVarRequestOptions.data =  needsSerialization ? JSON.stringify(body !== undefined ? body : {}) : (body || "");

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Request to remove trade room, if both participant has requested to remove the room then delete the data
         * @param {TradesRemoveBody} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        requestRemoveTrade: async (body?: TradesRemoveBody, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/artworks/trades/remove`;
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

            localVarHeaderParameter['Content-Type'] = 'application/json';

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
            const needsSerialization = (typeof body !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
            localVarRequestOptions.data =  needsSerialization ? JSON.stringify(body !== undefined ? body : {}) : (body || "");

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * ArtworksArtTradesApi - functional programming interface
 * @export
 */
export const ArtworksArtTradesApiFp = function(configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Cancel a trade, only host can make a request to this endpoint
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async cancelTrade(options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<SuccessMessageModel>>> {
            const localVarAxiosArgs = await ArtworksArtTradesApiAxiosParamCreator(configuration).cancelTrade(options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @summary Get trade detail by ID
         * @param {number} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getArtTradeById(id: number, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<InlineResponse20038>>> {
            const localVarAxiosArgs = await ArtworksArtTradesApiAxiosParamCreator(configuration).getArtTradeById(id, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @summary Get latest submitted Art Trades
         * @param {number} page Pagination index
         * @param {number} perPage How many record to show per page of pagination
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getLatestArtTrades(page: number, perPage: number, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<InlineResponse20037>>> {
            const localVarAxiosArgs = await ArtworksArtTradesApiAxiosParamCreator(configuration).getLatestArtTrades(page, perPage, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @summary Host a new trade / create a new trade room
         * @param {TradesHostBody} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async hostNewTrade(body?: TradesHostBody, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<InlineResponse2016>>> {
            const localVarAxiosArgs = await ArtworksArtTradesApiAxiosParamCreator(configuration).hostNewTrade(body, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @summary Participate to trade room
         * @param {TradesParticipateBody} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async participateToTrade(body?: TradesParticipateBody, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<SuccessMessageModel>>> {
            const localVarAxiosArgs = await ArtworksArtTradesApiAxiosParamCreator(configuration).participateToTrade(body, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @summary Request to remove trade room, if both participant has requested to remove the room then delete the data
         * @param {TradesRemoveBody} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async requestRemoveTrade(body?: TradesRemoveBody, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<SuccessMessageModel>>> {
            const localVarAxiosArgs = await ArtworksArtTradesApiAxiosParamCreator(configuration).requestRemoveTrade(body, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
    }
};

/**
 * ArtworksArtTradesApi - factory interface
 * @export
 */
export const ArtworksArtTradesApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    return {
        /**
         * 
         * @summary Cancel a trade, only host can make a request to this endpoint
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async cancelTrade(options?: AxiosRequestConfig): Promise<AxiosResponse<SuccessMessageModel>> {
            return ArtworksArtTradesApiFp(configuration).cancelTrade(options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Get trade detail by ID
         * @param {number} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getArtTradeById(id: number, options?: AxiosRequestConfig): Promise<AxiosResponse<InlineResponse20038>> {
            return ArtworksArtTradesApiFp(configuration).getArtTradeById(id, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Get latest submitted Art Trades
         * @param {number} page Pagination index
         * @param {number} perPage How many record to show per page of pagination
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getLatestArtTrades(page: number, perPage: number, options?: AxiosRequestConfig): Promise<AxiosResponse<InlineResponse20037>> {
            return ArtworksArtTradesApiFp(configuration).getLatestArtTrades(page, perPage, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Host a new trade / create a new trade room
         * @param {TradesHostBody} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async hostNewTrade(body?: TradesHostBody, options?: AxiosRequestConfig): Promise<AxiosResponse<InlineResponse2016>> {
            return ArtworksArtTradesApiFp(configuration).hostNewTrade(body, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Participate to trade room
         * @param {TradesParticipateBody} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async participateToTrade(body?: TradesParticipateBody, options?: AxiosRequestConfig): Promise<AxiosResponse<SuccessMessageModel>> {
            return ArtworksArtTradesApiFp(configuration).participateToTrade(body, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Request to remove trade room, if both participant has requested to remove the room then delete the data
         * @param {TradesRemoveBody} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async requestRemoveTrade(body?: TradesRemoveBody, options?: AxiosRequestConfig): Promise<AxiosResponse<SuccessMessageModel>> {
            return ArtworksArtTradesApiFp(configuration).requestRemoveTrade(body, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * ArtworksArtTradesApi - object-oriented interface
 * @export
 * @class ArtworksArtTradesApi
 * @extends {BaseAPI}
 */
export class ArtworksArtTradesApi extends BaseAPI {
    /**
     * 
     * @summary Cancel a trade, only host can make a request to this endpoint
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ArtworksArtTradesApi
     */
    public async cancelTrade(options?: AxiosRequestConfig) : Promise<AxiosResponse<SuccessMessageModel>> {
        return ArtworksArtTradesApiFp(this.configuration).cancelTrade(options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @summary Get trade detail by ID
     * @param {number} id 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ArtworksArtTradesApi
     */
    public async getArtTradeById(id: number, options?: AxiosRequestConfig) : Promise<AxiosResponse<InlineResponse20038>> {
        return ArtworksArtTradesApiFp(this.configuration).getArtTradeById(id, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @summary Get latest submitted Art Trades
     * @param {number} page Pagination index
     * @param {number} perPage How many record to show per page of pagination
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ArtworksArtTradesApi
     */
    public async getLatestArtTrades(page: number, perPage: number, options?: AxiosRequestConfig) : Promise<AxiosResponse<InlineResponse20037>> {
        return ArtworksArtTradesApiFp(this.configuration).getLatestArtTrades(page, perPage, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @summary Host a new trade / create a new trade room
     * @param {TradesHostBody} [body] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ArtworksArtTradesApi
     */
    public async hostNewTrade(body?: TradesHostBody, options?: AxiosRequestConfig) : Promise<AxiosResponse<InlineResponse2016>> {
        return ArtworksArtTradesApiFp(this.configuration).hostNewTrade(body, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @summary Participate to trade room
     * @param {TradesParticipateBody} [body] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ArtworksArtTradesApi
     */
    public async participateToTrade(body?: TradesParticipateBody, options?: AxiosRequestConfig) : Promise<AxiosResponse<SuccessMessageModel>> {
        return ArtworksArtTradesApiFp(this.configuration).participateToTrade(body, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @summary Request to remove trade room, if both participant has requested to remove the room then delete the data
     * @param {TradesRemoveBody} [body] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ArtworksArtTradesApi
     */
    public async requestRemoveTrade(body?: TradesRemoveBody, options?: AxiosRequestConfig) : Promise<AxiosResponse<SuccessMessageModel>> {
        return ArtworksArtTradesApiFp(this.configuration).requestRemoveTrade(body, options).then((request) => request(this.axios, this.basePath));
    }
}

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
import { AuthAuthenticateBody } from '../models';
import { AuthRefreshBody } from '../models';
import { InlineResponse200 } from '../models';
import { InlineResponse2001 } from '../models';
/**
 * AuthServiceAuthenticationApi - axios parameter creator
 * @export
 */
export const AuthServiceAuthenticationApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Authenticate user
         * @param {AuthAuthenticateBody} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        authenticate: async (body?: AuthAuthenticateBody, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/auth/authenticate`;
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
         * @summary Refresh current token
         * @param {AuthRefreshBody} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        refreshToken: async (body?: AuthRefreshBody, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/auth/refresh`;
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
         * @summary Check if auth token is valid
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        tokenCheck: async (options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/auth/check`;
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
 * AuthServiceAuthenticationApi - functional programming interface
 * @export
 */
export const AuthServiceAuthenticationApiFp = function(configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Authenticate user
         * @param {AuthAuthenticateBody} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async authenticate(body?: AuthAuthenticateBody, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<InlineResponse200>>> {
            const localVarAxiosArgs = await AuthServiceAuthenticationApiAxiosParamCreator(configuration).authenticate(body, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @summary Refresh current token
         * @param {AuthRefreshBody} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async refreshToken(body?: AuthRefreshBody, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<InlineResponse200>>> {
            const localVarAxiosArgs = await AuthServiceAuthenticationApiAxiosParamCreator(configuration).refreshToken(body, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @summary Check if auth token is valid
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async tokenCheck(options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<InlineResponse2001>>> {
            const localVarAxiosArgs = await AuthServiceAuthenticationApiAxiosParamCreator(configuration).tokenCheck(options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
    }
};

/**
 * AuthServiceAuthenticationApi - factory interface
 * @export
 */
export const AuthServiceAuthenticationApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    return {
        /**
         * 
         * @summary Authenticate user
         * @param {AuthAuthenticateBody} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async authenticate(body?: AuthAuthenticateBody, options?: AxiosRequestConfig): Promise<AxiosResponse<InlineResponse200>> {
            return AuthServiceAuthenticationApiFp(configuration).authenticate(body, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Refresh current token
         * @param {AuthRefreshBody} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async refreshToken(body?: AuthRefreshBody, options?: AxiosRequestConfig): Promise<AxiosResponse<InlineResponse200>> {
            return AuthServiceAuthenticationApiFp(configuration).refreshToken(body, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Check if auth token is valid
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async tokenCheck(options?: AxiosRequestConfig): Promise<AxiosResponse<InlineResponse2001>> {
            return AuthServiceAuthenticationApiFp(configuration).tokenCheck(options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * AuthServiceAuthenticationApi - object-oriented interface
 * @export
 * @class AuthServiceAuthenticationApi
 * @extends {BaseAPI}
 */
export class AuthServiceAuthenticationApi extends BaseAPI {
    /**
     * 
     * @summary Authenticate user
     * @param {AuthAuthenticateBody} [body] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AuthServiceAuthenticationApi
     */
    public async authenticate(body?: AuthAuthenticateBody, options?: AxiosRequestConfig) : Promise<AxiosResponse<InlineResponse200>> {
        return AuthServiceAuthenticationApiFp(this.configuration).authenticate(body, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @summary Refresh current token
     * @param {AuthRefreshBody} [body] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AuthServiceAuthenticationApi
     */
    public async refreshToken(body?: AuthRefreshBody, options?: AxiosRequestConfig) : Promise<AxiosResponse<InlineResponse200>> {
        return AuthServiceAuthenticationApiFp(this.configuration).refreshToken(body, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @summary Check if auth token is valid
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AuthServiceAuthenticationApi
     */
    public async tokenCheck(options?: AxiosRequestConfig) : Promise<AxiosResponse<InlineResponse2001>> {
        return AuthServiceAuthenticationApiFp(this.configuration).tokenCheck(options).then((request) => request(this.axios, this.basePath));
    }
}

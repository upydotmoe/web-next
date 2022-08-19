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
import { InlineResponse2003 } from '../models';
import { SuccessMessageModel } from '../models';
import { UserAllModel } from '../models';
/**
 * UserApi - axios parameter creator
 * @export
 */
export const UserApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * Get current authenticated user information based on token given on header
         * @summary Get current authenticated user info
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getCurrentUserInfo: async (options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/user/info`;
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
         * @summary Get user info by ID
         * @param {string} userId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getUserInfoById: async (userId: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'userId' is not null or undefined
            if (userId === null || userId === undefined) {
                throw new RequiredError('userId','Required parameter userId was null or undefined when calling getUserInfoById.');
            }
            const localVarPath = `/user/info/id/{userId}`
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
         * @summary Get user info by Pen Name
         * @param {string} penName 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getUserInfoByPenName: async (penName: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'penName' is not null or undefined
            if (penName === null || penName === undefined) {
                throw new RequiredError('penName','Required parameter penName was null or undefined when calling getUserInfoByPenName.');
            }
            const localVarPath = `/user/info/pen/{penName}`
                .replace(`{${"penName"}}`, encodeURIComponent(String(penName)));
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
         * @summary Get user info by username
         * @param {string} username 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getUserInfoByUsername: async (username: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'username' is not null or undefined
            if (username === null || username === undefined) {
                throw new RequiredError('username','Required parameter username was null or undefined when calling getUserInfoByUsername.');
            }
            const localVarPath = `/user/info/username/{username}`
                .replace(`{${"username"}}`, encodeURIComponent(String(username)));
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
         * @summary Check is pen name taken or not
         * @param {string} penName 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        penNameCheck: async (penName: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'penName' is not null or undefined
            if (penName === null || penName === undefined) {
                throw new RequiredError('penName','Required parameter penName was null or undefined when calling penNameCheck.');
            }
            const localVarPath = `/user/pen/check/{penName}`
                .replace(`{${"penName"}}`, encodeURIComponent(String(penName)));
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
 * UserApi - functional programming interface
 * @export
 */
export const UserApiFp = function(configuration?: Configuration) {
    return {
        /**
         * Get current authenticated user information based on token given on header
         * @summary Get current authenticated user info
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getCurrentUserInfo(options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<InlineResponse2003>>> {
            const localVarAxiosArgs = await UserApiAxiosParamCreator(configuration).getCurrentUserInfo(options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @summary Get user info by ID
         * @param {string} userId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getUserInfoById(userId: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<InlineResponse2003>>> {
            const localVarAxiosArgs = await UserApiAxiosParamCreator(configuration).getUserInfoById(userId, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @summary Get user info by Pen Name
         * @param {string} penName 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getUserInfoByPenName(penName: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<UserAllModel>>> {
            const localVarAxiosArgs = await UserApiAxiosParamCreator(configuration).getUserInfoByPenName(penName, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @summary Get user info by username
         * @param {string} username 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getUserInfoByUsername(username: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<InlineResponse2003>>> {
            const localVarAxiosArgs = await UserApiAxiosParamCreator(configuration).getUserInfoByUsername(username, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @summary Check is pen name taken or not
         * @param {string} penName 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async penNameCheck(penName: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<SuccessMessageModel>>> {
            const localVarAxiosArgs = await UserApiAxiosParamCreator(configuration).penNameCheck(penName, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
    }
};

/**
 * UserApi - factory interface
 * @export
 */
export const UserApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    return {
        /**
         * Get current authenticated user information based on token given on header
         * @summary Get current authenticated user info
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getCurrentUserInfo(options?: AxiosRequestConfig): Promise<AxiosResponse<InlineResponse2003>> {
            return UserApiFp(configuration).getCurrentUserInfo(options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Get user info by ID
         * @param {string} userId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getUserInfoById(userId: string, options?: AxiosRequestConfig): Promise<AxiosResponse<InlineResponse2003>> {
            return UserApiFp(configuration).getUserInfoById(userId, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Get user info by Pen Name
         * @param {string} penName 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getUserInfoByPenName(penName: string, options?: AxiosRequestConfig): Promise<AxiosResponse<UserAllModel>> {
            return UserApiFp(configuration).getUserInfoByPenName(penName, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Get user info by username
         * @param {string} username 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getUserInfoByUsername(username: string, options?: AxiosRequestConfig): Promise<AxiosResponse<InlineResponse2003>> {
            return UserApiFp(configuration).getUserInfoByUsername(username, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Check is pen name taken or not
         * @param {string} penName 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async penNameCheck(penName: string, options?: AxiosRequestConfig): Promise<AxiosResponse<SuccessMessageModel>> {
            return UserApiFp(configuration).penNameCheck(penName, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * UserApi - object-oriented interface
 * @export
 * @class UserApi
 * @extends {BaseAPI}
 */
export class UserApi extends BaseAPI {
    /**
     * Get current authenticated user information based on token given on header
     * @summary Get current authenticated user info
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    public async getCurrentUserInfo(options?: AxiosRequestConfig) : Promise<AxiosResponse<InlineResponse2003>> {
        return UserApiFp(this.configuration).getCurrentUserInfo(options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @summary Get user info by ID
     * @param {string} userId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    public async getUserInfoById(userId: string, options?: AxiosRequestConfig) : Promise<AxiosResponse<InlineResponse2003>> {
        return UserApiFp(this.configuration).getUserInfoById(userId, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @summary Get user info by Pen Name
     * @param {string} penName 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    public async getUserInfoByPenName(penName: string, options?: AxiosRequestConfig) : Promise<AxiosResponse<UserAllModel>> {
        return UserApiFp(this.configuration).getUserInfoByPenName(penName, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @summary Get user info by username
     * @param {string} username 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    public async getUserInfoByUsername(username: string, options?: AxiosRequestConfig) : Promise<AxiosResponse<InlineResponse2003>> {
        return UserApiFp(this.configuration).getUserInfoByUsername(username, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @summary Check is pen name taken or not
     * @param {string} penName 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    public async penNameCheck(penName: string, options?: AxiosRequestConfig) : Promise<AxiosResponse<SuccessMessageModel>> {
        return UserApiFp(this.configuration).penNameCheck(penName, options).then((request) => request(this.axios, this.basePath));
    }
}

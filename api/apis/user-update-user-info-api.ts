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
import { SuccessMessageModel } from '../models';
import { UpdateInfoBody } from '../models';
import { UpdatePreferenceBody } from '../models';
import { UpdateSocialBody } from '../models';
import { UpdateUsernameBody } from '../models';
/**
 * UserUpdateUserInfoApi - axios parameter creator
 * @export
 */
export const UserUpdateUserInfoApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Change username
         * @param {UpdateUsernameBody} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        changeUsername: async (body?: UpdateUsernameBody, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/user/update/username`;
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
         * @summary Update user information
         * @param {UpdateInfoBody} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        updateUserInfo: async (body?: UpdateInfoBody, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/user/update/info`;
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
         * @summary Update user settings
         * @param {UpdatePreferenceBody} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        updateUserPreference: async (body?: UpdatePreferenceBody, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/user/update/preference`;
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
         * @summary Update user social links
         * @param {UpdateSocialBody} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        updateUserSocial: async (body?: UpdateSocialBody, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/user/update/social`;
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
 * UserUpdateUserInfoApi - functional programming interface
 * @export
 */
export const UserUpdateUserInfoApiFp = function(configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Change username
         * @param {UpdateUsernameBody} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async changeUsername(body?: UpdateUsernameBody, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<SuccessMessageModel>>> {
            const localVarAxiosArgs = await UserUpdateUserInfoApiAxiosParamCreator(configuration).changeUsername(body, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @summary Update user information
         * @param {UpdateInfoBody} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async updateUserInfo(body?: UpdateInfoBody, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<SuccessMessageModel>>> {
            const localVarAxiosArgs = await UserUpdateUserInfoApiAxiosParamCreator(configuration).updateUserInfo(body, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @summary Update user settings
         * @param {UpdatePreferenceBody} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async updateUserPreference(body?: UpdatePreferenceBody, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<SuccessMessageModel>>> {
            const localVarAxiosArgs = await UserUpdateUserInfoApiAxiosParamCreator(configuration).updateUserPreference(body, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @summary Update user social links
         * @param {UpdateSocialBody} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async updateUserSocial(body?: UpdateSocialBody, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<SuccessMessageModel>>> {
            const localVarAxiosArgs = await UserUpdateUserInfoApiAxiosParamCreator(configuration).updateUserSocial(body, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
    }
};

/**
 * UserUpdateUserInfoApi - factory interface
 * @export
 */
export const UserUpdateUserInfoApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    return {
        /**
         * 
         * @summary Change username
         * @param {UpdateUsernameBody} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async changeUsername(body?: UpdateUsernameBody, options?: AxiosRequestConfig): Promise<AxiosResponse<SuccessMessageModel>> {
            return UserUpdateUserInfoApiFp(configuration).changeUsername(body, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Update user information
         * @param {UpdateInfoBody} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async updateUserInfo(body?: UpdateInfoBody, options?: AxiosRequestConfig): Promise<AxiosResponse<SuccessMessageModel>> {
            return UserUpdateUserInfoApiFp(configuration).updateUserInfo(body, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Update user settings
         * @param {UpdatePreferenceBody} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async updateUserPreference(body?: UpdatePreferenceBody, options?: AxiosRequestConfig): Promise<AxiosResponse<SuccessMessageModel>> {
            return UserUpdateUserInfoApiFp(configuration).updateUserPreference(body, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Update user social links
         * @param {UpdateSocialBody} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async updateUserSocial(body?: UpdateSocialBody, options?: AxiosRequestConfig): Promise<AxiosResponse<SuccessMessageModel>> {
            return UserUpdateUserInfoApiFp(configuration).updateUserSocial(body, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * UserUpdateUserInfoApi - object-oriented interface
 * @export
 * @class UserUpdateUserInfoApi
 * @extends {BaseAPI}
 */
export class UserUpdateUserInfoApi extends BaseAPI {
    /**
     * 
     * @summary Change username
     * @param {UpdateUsernameBody} [body] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserUpdateUserInfoApi
     */
    public async changeUsername(body?: UpdateUsernameBody, options?: AxiosRequestConfig) : Promise<AxiosResponse<SuccessMessageModel>> {
        return UserUpdateUserInfoApiFp(this.configuration).changeUsername(body, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @summary Update user information
     * @param {UpdateInfoBody} [body] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserUpdateUserInfoApi
     */
    public async updateUserInfo(body?: UpdateInfoBody, options?: AxiosRequestConfig) : Promise<AxiosResponse<SuccessMessageModel>> {
        return UserUpdateUserInfoApiFp(this.configuration).updateUserInfo(body, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @summary Update user settings
     * @param {UpdatePreferenceBody} [body] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserUpdateUserInfoApi
     */
    public async updateUserPreference(body?: UpdatePreferenceBody, options?: AxiosRequestConfig) : Promise<AxiosResponse<SuccessMessageModel>> {
        return UserUpdateUserInfoApiFp(this.configuration).updateUserPreference(body, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @summary Update user social links
     * @param {UpdateSocialBody} [body] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserUpdateUserInfoApi
     */
    public async updateUserSocial(body?: UpdateSocialBody, options?: AxiosRequestConfig) : Promise<AxiosResponse<SuccessMessageModel>> {
        return UserUpdateUserInfoApiFp(this.configuration).updateUserSocial(body, options).then((request) => request(this.axios, this.basePath));
    }
}

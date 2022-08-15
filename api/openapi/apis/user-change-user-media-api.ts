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
import { InlineResponse2004 } from '../models';
import { InlineResponse2005 } from '../models';
import { SuccessMessageModel } from '../models';
/**
 * UserChangeUserMediaApi - axios parameter creator
 * @export
 */
export const UserChangeUserMediaApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Change current user avatar
         * @param {Blob} [avatar] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        updateAvatarForm: async (avatar?: Blob, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/user/update/avatar`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions :AxiosRequestConfig = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;
            const localVarFormParams = new FormData();

            // authentication bearerAuth required


            if (avatar !== undefined) { 
                localVarFormParams.append('avatar', avatar as any);
            }

            localVarHeaderParameter['Content-Type'] = 'multipart/form-data';
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
            localVarRequestOptions.data = localVarFormParams;

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Change current user cover
         * @param {Blob} [cover] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        updateCoverForm: async (cover?: Blob, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/user/update/cover`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions :AxiosRequestConfig = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;
            const localVarFormParams = new FormData();

            // authentication bearerAuth required


            if (cover !== undefined) { 
                localVarFormParams.append('cover', cover as any);
            }

            localVarHeaderParameter['Content-Type'] = 'multipart/form-data';
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
            localVarRequestOptions.data = localVarFormParams;

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * UserChangeUserMediaApi - functional programming interface
 * @export
 */
export const UserChangeUserMediaApiFp = function(configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Change current user avatar
         * @param {Blob} [avatar] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async updateAvatarForm(avatar?: Blob, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<InlineResponse2004>>> {
            const localVarAxiosArgs = await UserChangeUserMediaApiAxiosParamCreator(configuration).updateAvatarForm(avatar, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @summary Change current user cover
         * @param {Blob} [cover] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async updateCoverForm(cover?: Blob, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<InlineResponse2005>>> {
            const localVarAxiosArgs = await UserChangeUserMediaApiAxiosParamCreator(configuration).updateCoverForm(cover, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
    }
};

/**
 * UserChangeUserMediaApi - factory interface
 * @export
 */
export const UserChangeUserMediaApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    return {
        /**
         * 
         * @summary Change current user avatar
         * @param {Blob} [avatar] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async updateAvatarForm(avatar?: Blob, options?: AxiosRequestConfig): Promise<AxiosResponse<InlineResponse2004>> {
            return UserChangeUserMediaApiFp(configuration).updateAvatarForm(avatar, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Change current user cover
         * @param {Blob} [cover] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async updateCoverForm(cover?: Blob, options?: AxiosRequestConfig): Promise<AxiosResponse<InlineResponse2005>> {
            return UserChangeUserMediaApiFp(configuration).updateCoverForm(cover, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * UserChangeUserMediaApi - object-oriented interface
 * @export
 * @class UserChangeUserMediaApi
 * @extends {BaseAPI}
 */
export class UserChangeUserMediaApi extends BaseAPI {
    /**
     * 
     * @summary Change current user avatar
     * @param {Blob} [avatar] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserChangeUserMediaApi
     */
    public async updateAvatarForm(avatar?: Blob, options?: AxiosRequestConfig) : Promise<AxiosResponse<InlineResponse2004>> {
        return UserChangeUserMediaApiFp(this.configuration).updateAvatarForm(avatar, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @summary Change current user cover
     * @param {Blob} [cover] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserChangeUserMediaApi
     */
    public async updateCoverForm(cover?: Blob, options?: AxiosRequestConfig) : Promise<AxiosResponse<InlineResponse2005>> {
        return UserChangeUserMediaApiFp(this.configuration).updateCoverForm(cover, options).then((request) => request(this.axios, this.basePath));
    }
}
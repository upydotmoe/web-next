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
import { InlineResponse20039 } from '../models';
/**
 * SettingsApi - axios parameter creator
 * @export
 */
export const SettingsApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Get setting value
         * @param {string} key 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getSetting: async (key: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'key' is not null or undefined
            if (key === null || key === undefined) {
                throw new RequiredError('key','Required parameter key was null or undefined when calling getSetting.');
            }
            const localVarPath = `/settings`;
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

            if (key !== undefined) {
                localVarQueryParameter['key'] = key;
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
 * SettingsApi - functional programming interface
 * @export
 */
export const SettingsApiFp = function(configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Get setting value
         * @param {string} key 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getSetting(key: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<InlineResponse20039>>> {
            const localVarAxiosArgs = await SettingsApiAxiosParamCreator(configuration).getSetting(key, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
    }
};

/**
 * SettingsApi - factory interface
 * @export
 */
export const SettingsApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    return {
        /**
         * 
         * @summary Get setting value
         * @param {string} key 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getSetting(key: string, options?: AxiosRequestConfig): Promise<AxiosResponse<InlineResponse20039>> {
            return SettingsApiFp(configuration).getSetting(key, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * SettingsApi - object-oriented interface
 * @export
 * @class SettingsApi
 * @extends {BaseAPI}
 */
export class SettingsApi extends BaseAPI {
    /**
     * 
     * @summary Get setting value
     * @param {string} key 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SettingsApi
     */
    public async getSetting(key: string, options?: AxiosRequestConfig) : Promise<AxiosResponse<InlineResponse20039>> {
        return SettingsApiFp(this.configuration).getSetting(key, options).then((request) => request(this.axios, this.basePath));
    }
}

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
import { ArtworkModel } from '../models';
import { ArtworksBody } from '../models';
import { InlineResponse2012 } from '../models';
import { SuccessMessageModel } from '../models';
/**
 * ArtworkCRUDApi - axios parameter creator
 * @export
 */
export const ArtworkCRUDApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Remove an artwork
         * @param {Array<number>} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteWork: async (body?: Array<number>, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/artworks`;
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
         * @summary Create/upload new artworks
         * @param {string} [title] 
         * @param {string} [description] 
         * @param {string} [tags] 
         * @param {number} [isExplicit] 
         * @param {string} [scheduledPost] 
         * @param {Array<Blob>} [files] 
         * @param {Array<number>} [fileOrder] 
         * @param {number} [allowRedraw] 
         * @param {number} [redrawOf] 
         * @param {number} [redrawInYourStyle] 
         * @param {number} [isOriginalCharacter] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        postForm: async (title?: string, description?: string, tags?: string, isExplicit?: number, scheduledPost?: string, files?: Array<Blob>, fileOrder?: Array<number>, allowRedraw?: number, redrawOf?: number, redrawInYourStyle?: number, isOriginalCharacter?: number, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/artworks/post`;
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


            if (title !== undefined) { 
                localVarFormParams.append('title', title as any);
            }

            if (description !== undefined) { 
                localVarFormParams.append('description', description as any);
            }

            if (tags !== undefined) { 
                localVarFormParams.append('tags', tags as any);
            }

            if (isExplicit !== undefined) { 
                localVarFormParams.append('is_explicit', isExplicit as any);
            }

            if (scheduledPost !== undefined) { 
                localVarFormParams.append('scheduled_post', scheduledPost as any);
            }
            if (files) {
                files.forEach((element) => {
                    localVarFormParams.append('files[]', element as any);
                })
            }
            if (fileOrder) {
                fileOrder.forEach((element) => {
                    localVarFormParams.append('file_order[]', element as any);
                })
            }

            if (allowRedraw !== undefined) { 
                localVarFormParams.append('allow_redraw', allowRedraw as any);
            }

            if (redrawOf !== undefined) { 
                localVarFormParams.append('redraw_of', redrawOf as any);
            }

            if (redrawInYourStyle !== undefined) { 
                localVarFormParams.append('redraw_in_your_style', redrawInYourStyle as any);
            }

            if (isOriginalCharacter !== undefined) { 
                localVarFormParams.append('is_original_character', isOriginalCharacter as any);
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
         * @summary Update existing artwork information
         * @param {ArtworksBody} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        updateWork: async (body?: ArtworksBody, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/artworks`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions :AxiosRequestConfig = { method: 'PATCH', ...baseOptions, ...options};
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
         * @summary View detail information of artwork
         * @param {number} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        view: async (id: number, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            if (id === null || id === undefined) {
                throw new RequiredError('id','Required parameter id was null or undefined when calling view.');
            }
            const localVarPath = `/artworks/view/{id}`
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
    }
};

/**
 * ArtworkCRUDApi - functional programming interface
 * @export
 */
export const ArtworkCRUDApiFp = function(configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Remove an artwork
         * @param {Array<number>} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async deleteWork(body?: Array<number>, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<SuccessMessageModel>>> {
            const localVarAxiosArgs = await ArtworkCRUDApiAxiosParamCreator(configuration).deleteWork(body, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @summary Create/upload new artworks
         * @param {string} [title] 
         * @param {string} [description] 
         * @param {string} [tags] 
         * @param {number} [isExplicit] 
         * @param {string} [scheduledPost] 
         * @param {Array<Blob>} [files] 
         * @param {Array<number>} [fileOrder] 
         * @param {number} [allowRedraw] 
         * @param {number} [redrawOf] 
         * @param {number} [redrawInYourStyle] 
         * @param {number} [isOriginalCharacter] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async postForm(title?: string, description?: string, tags?: string, isExplicit?: number, scheduledPost?: string, files?: Array<Blob>, fileOrder?: Array<number>, allowRedraw?: number, redrawOf?: number, redrawInYourStyle?: number, isOriginalCharacter?: number, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<InlineResponse2012>>> {
            const localVarAxiosArgs = await ArtworkCRUDApiAxiosParamCreator(configuration).postForm(title, description, tags, isExplicit, scheduledPost, files, fileOrder, allowRedraw, redrawOf, redrawInYourStyle, isOriginalCharacter, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @summary Update existing artwork information
         * @param {ArtworksBody} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async updateWork(body?: ArtworksBody, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<SuccessMessageModel>>> {
            const localVarAxiosArgs = await ArtworkCRUDApiAxiosParamCreator(configuration).updateWork(body, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @summary View detail information of artwork
         * @param {number} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async view(id: number, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<ArtworkModel>>> {
            const localVarAxiosArgs = await ArtworkCRUDApiAxiosParamCreator(configuration).view(id, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
    }
};

/**
 * ArtworkCRUDApi - factory interface
 * @export
 */
export const ArtworkCRUDApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    return {
        /**
         * 
         * @summary Remove an artwork
         * @param {Array<number>} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async deleteWork(body?: Array<number>, options?: AxiosRequestConfig): Promise<AxiosResponse<SuccessMessageModel>> {
            return ArtworkCRUDApiFp(configuration).deleteWork(body, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Create/upload new artworks
         * @param {string} [title] 
         * @param {string} [description] 
         * @param {string} [tags] 
         * @param {number} [isExplicit] 
         * @param {string} [scheduledPost] 
         * @param {Array<Blob>} [files] 
         * @param {Array<number>} [fileOrder] 
         * @param {number} [allowRedraw] 
         * @param {number} [redrawOf] 
         * @param {number} [redrawInYourStyle] 
         * @param {number} [isOriginalCharacter] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async postForm(title?: string, description?: string, tags?: string, isExplicit?: number, scheduledPost?: string, files?: Array<Blob>, fileOrder?: Array<number>, allowRedraw?: number, redrawOf?: number, redrawInYourStyle?: number, isOriginalCharacter?: number, options?: AxiosRequestConfig): Promise<AxiosResponse<InlineResponse2012>> {
            return ArtworkCRUDApiFp(configuration).postForm(title, description, tags, isExplicit, scheduledPost, files, fileOrder, allowRedraw, redrawOf, redrawInYourStyle, isOriginalCharacter, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Update existing artwork information
         * @param {ArtworksBody} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async updateWork(body?: ArtworksBody, options?: AxiosRequestConfig): Promise<AxiosResponse<SuccessMessageModel>> {
            return ArtworkCRUDApiFp(configuration).updateWork(body, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary View detail information of artwork
         * @param {number} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async view(id: number, options?: AxiosRequestConfig): Promise<AxiosResponse<ArtworkModel>> {
            return ArtworkCRUDApiFp(configuration).view(id, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * ArtworkCRUDApi - object-oriented interface
 * @export
 * @class ArtworkCRUDApi
 * @extends {BaseAPI}
 */
export class ArtworkCRUDApi extends BaseAPI {
    /**
     * 
     * @summary Remove an artwork
     * @param {Array<number>} [body] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ArtworkCRUDApi
     */
    public async deleteWork(body?: Array<number>, options?: AxiosRequestConfig) : Promise<AxiosResponse<SuccessMessageModel>> {
        return ArtworkCRUDApiFp(this.configuration).deleteWork(body, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @summary Create/upload new artworks
     * @param {string} [title] 
     * @param {string} [description] 
     * @param {string} [tags] 
     * @param {number} [isExplicit] 
     * @param {string} [scheduledPost] 
     * @param {Array<Blob>} [files] 
     * @param {Array<number>} [fileOrder] 
     * @param {number} [allowRedraw] 
     * @param {number} [redrawOf] 
     * @param {number} [redrawInYourStyle] 
     * @param {number} [isOriginalCharacter] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ArtworkCRUDApi
     */
    public async postForm(title?: string, description?: string, tags?: string, isExplicit?: number, scheduledPost?: string, files?: Array<Blob>, fileOrder?: Array<number>, allowRedraw?: number, redrawOf?: number, redrawInYourStyle?: number, isOriginalCharacter?: number, options?: AxiosRequestConfig) : Promise<AxiosResponse<InlineResponse2012>> {
        return ArtworkCRUDApiFp(this.configuration).postForm(title, description, tags, isExplicit, scheduledPost, files, fileOrder, allowRedraw, redrawOf, redrawInYourStyle, isOriginalCharacter, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @summary Update existing artwork information
     * @param {ArtworksBody} [body] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ArtworkCRUDApi
     */
    public async updateWork(body?: ArtworksBody, options?: AxiosRequestConfig) : Promise<AxiosResponse<SuccessMessageModel>> {
        return ArtworkCRUDApiFp(this.configuration).updateWork(body, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @summary View detail information of artwork
     * @param {number} id 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ArtworkCRUDApi
     */
    public async view(id: number, options?: AxiosRequestConfig) : Promise<AxiosResponse<ArtworkModel>> {
        return ArtworkCRUDApiFp(this.configuration).view(id, options).then((request) => request(this.axios, this.basePath));
    }
}

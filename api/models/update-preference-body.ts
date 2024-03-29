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
/**
 * 
 * @export
 * @interface UpdatePreferenceBody
 */
export interface UpdatePreferenceBody {
    /**
     * 
     * @type {number}
     * @memberof UpdatePreferenceBody
     */
    id: number;
    /**
     * 
     * @type {string}
     * @memberof UpdatePreferenceBody
     */
    language?: UpdatePreferenceBodyLanguageEnum;
    /**
     * 
     * @type {number}
     * @memberof UpdatePreferenceBody
     */
    showExplicit?: UpdatePreferenceBodyShowExplicitEnum;
    /**
     * 
     * @type {number}
     * @memberof UpdatePreferenceBody
     */
    showGore?: UpdatePreferenceBodyShowGoreEnum;
}

/**
    * @export
    * @enum {string}
    */
export enum UpdatePreferenceBodyLanguageEnum {
    EnUS = 'en-US',
    JaJP = 'ja-JP',
    IdID = 'id-ID'
}
/**
    * @export
    * @enum {string}
    */
export enum UpdatePreferenceBodyShowExplicitEnum {
    NUMBER_0 = 0,
    NUMBER_1 = 1
}
/**
    * @export
    * @enum {string}
    */
export enum UpdatePreferenceBodyShowGoreEnum {
    NUMBER_0 = 0,
    NUMBER_1 = 1
}


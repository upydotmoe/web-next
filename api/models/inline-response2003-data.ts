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
import { InlineResponse2003DataUserSettings } from './inline-response2003-data-user-settings';
/**
 * 
 * @export
 * @interface InlineResponse2003Data
 */
export interface InlineResponse2003Data {
    /**
     * 
     * @type {number}
     * @memberof InlineResponse2003Data
     */
    id?: number;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse2003Data
     */
    avatarDriver?: string;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse2003Data
     */
    avatarBucket?: string;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse2003Data
     */
    avatarFilename?: string;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse2003Data
     */
    username?: string;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse2003Data
     */
    name?: string;
    /**
     * 
     * @type {boolean}
     * @memberof InlineResponse2003Data
     */
    isModerator?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof InlineResponse2003Data
     */
    isAdmin?: boolean;
    /**
     * 
     * @type {number}
     * @memberof InlineResponse2003Data
     */
    isPro?: number;
    /**
     * 
     * @type {InlineResponse2003DataUserSettings}
     * @memberof InlineResponse2003Data
     */
    userSettings?: InlineResponse2003DataUserSettings;
}

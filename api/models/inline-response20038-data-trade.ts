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
import { MinimalArtworkInfo } from './minimal-artwork-info';
import { MinimalUserInfo } from './minimal-user-info';
/**
 * 
 * @export
 * @interface InlineResponse20038DataTrade
 */
export interface InlineResponse20038DataTrade {
    /**
     * 
     * @type {number}
     * @memberof InlineResponse20038DataTrade
     */
    id?: number;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse20038DataTrade
     */
    title?: string;
    /**
     * 
     * @type {MinimalUserInfo}
     * @memberof InlineResponse20038DataTrade
     */
    host?: MinimalUserInfo;
    /**
     * 
     * @type {MinimalArtworkInfo}
     * @memberof InlineResponse20038DataTrade
     */
    hostSubmission?: MinimalArtworkInfo;
    /**
     * 
     * @type {MinimalUserInfo}
     * @memberof InlineResponse20038DataTrade
     */
    participant?: MinimalUserInfo;
    /**
     * 
     * @type {MinimalArtworkInfo}
     * @memberof InlineResponse20038DataTrade
     */
    participantWorkId?: MinimalArtworkInfo;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse20038DataTrade
     */
    createdAt?: string;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse20038DataTrade
     */
    updatedAt?: string;
}

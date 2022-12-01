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
import { InlineResponse20039DataFollowerDetail } from './inline-response20039-data-follower-detail';
/**
 * 
 * @export
 * @interface InlineResponse20040DataNotifications
 */
export interface InlineResponse20040DataNotifications {
    /**
     * 
     * @type {number}
     * @memberof InlineResponse20040DataNotifications
     */
    id?: number;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse20040DataNotifications
     */
    text?: string;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse20040DataNotifications
     */
    comment?: string;
    /**
     * 
     * @type {boolean}
     * @memberof InlineResponse20040DataNotifications
     */
    isRead?: boolean;
    /**
     * 
     * @type {Array<InlineResponse20039DataFollowerDetail>}
     * @memberof InlineResponse20040DataNotifications
     */
    users?: Array<InlineResponse20039DataFollowerDetail>;
    /**
     * 
     * @type {number}
     * @memberof InlineResponse20040DataNotifications
     */
    total?: number;
    /**
     * 
     * @type {number}
     * @memberof InlineResponse20040DataNotifications
     */
    restTotal?: number;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse20040DataNotifications
     */
    createdAt?: string;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse20040DataNotifications
     */
    type?: InlineResponse20040DataNotificationsTypeEnum;
}

/**
    * @export
    * @enum {string}
    */
export enum InlineResponse20040DataNotificationsTypeEnum {
    Like = 'like',
    Comment = 'comment'
}

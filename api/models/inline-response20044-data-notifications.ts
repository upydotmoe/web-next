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
import { InlineResponse20044DataFollowerDetail } from './inline-response20044-data-follower-detail';
/**
 * 
 * @export
 * @interface InlineResponse20044DataNotifications
 */
export interface InlineResponse20044DataNotifications {
    /**
     * 
     * @type {number}
     * @memberof InlineResponse20044DataNotifications
     */
    isRead?: number;
    /**
     * 
     * @type {Array<InlineResponse20044DataFollowerDetail>}
     * @memberof InlineResponse20044DataNotifications
     */
    followerDetail?: Array<InlineResponse20044DataFollowerDetail>;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse20044DataNotifications
     */
    createdAt?: string;
}
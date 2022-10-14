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
import { InlineResponse20029DataUserLiked } from './inline-response20029-data-user-liked';
/**
 * 
 * @export
 * @interface InlineResponse20029DataNotifications
 */
export interface InlineResponse20029DataNotifications {
    /**
     * 
     * @type {number}
     * @memberof InlineResponse20029DataNotifications
     */
    workId?: number;
    /**
     * 
     * @type {number}
     * @memberof InlineResponse20029DataNotifications
     */
    isRead?: number;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse20029DataNotifications
     */
    driver?: string;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse20029DataNotifications
     */
    bucket?: string;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse20029DataNotifications
     */
    b2FileId?: string;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse20029DataNotifications
     */
    filename?: string;
    /**
     * 
     * @type {Array<InlineResponse20029DataUserLiked>}
     * @memberof InlineResponse20029DataNotifications
     */
    userLiked?: Array<InlineResponse20029DataUserLiked>;
    /**
     * 
     * @type {number}
     * @memberof InlineResponse20029DataNotifications
     */
    totalLiked?: number;
    /**
     * 
     * @type {number}
     * @memberof InlineResponse20029DataNotifications
     */
    restTotalLiked?: number;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse20029DataNotifications
     */
    createdAt?: string;
}
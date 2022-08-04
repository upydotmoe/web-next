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
import { InlineResponse20031DataArtworks } from './inline-response20031-data-artworks';
import { InlineResponse20031DataUserLiked } from './inline-response20031-data-user-liked';
/**
 * 
 * @export
 * @interface InlineResponse20031DataNotifications
 */
export interface InlineResponse20031DataNotifications {
    /**
     * 
     * @type {number}
     * @memberof InlineResponse20031DataNotifications
     */
    commentId?: number;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse20031DataNotifications
     */
    comment?: string;
    /**
     * 
     * @type {number}
     * @memberof InlineResponse20031DataNotifications
     */
    isRead?: number;
    /**
     * 
     * @type {Array<InlineResponse20031DataUserLiked>}
     * @memberof InlineResponse20031DataNotifications
     */
    userLiked?: Array<InlineResponse20031DataUserLiked>;
    /**
     * 
     * @type {InlineResponse20031DataArtworks}
     * @memberof InlineResponse20031DataNotifications
     */
    artworks?: InlineResponse20031DataArtworks;
    /**
     * 
     * @type {number}
     * @memberof InlineResponse20031DataNotifications
     */
    totalLiked?: number;
    /**
     * 
     * @type {number}
     * @memberof InlineResponse20031DataNotifications
     */
    restTotalLiked?: number;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse20031DataNotifications
     */
    createdAt?: string;
}

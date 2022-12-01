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
import { InlineResponse20042FeedCount } from './inline-response20042-feed-count';
import { UserLiteModel } from './user-lite-model';
/**
 * 
 * @export
 * @interface InlineResponse20042Feed
 */
export interface InlineResponse20042Feed {
    /**
     * 
     * @type {number}
     * @memberof InlineResponse20042Feed
     */
    id?: number;
    /**
     * 
     * @type {number}
     * @memberof InlineResponse20042Feed
     */
    userId?: number;
    /**
     * 
     * @type {number}
     * @memberof InlineResponse20042Feed
     */
    text?: number;
    /**
     * 
     * @type {number}
     * @memberof InlineResponse20042Feed
     */
    visibility?: number;
    /**
     * 
     * @type {number}
     * @memberof InlineResponse20042Feed
     */
    whoCanReply?: number;
    /**
     * 
     * @type {number}
     * @memberof InlineResponse20042Feed
     */
    workId?: number;
    /**
     * 
     * @type {number}
     * @memberof InlineResponse20042Feed
     */
    feedId?: number;
    /**
     * 
     * @type {number}
     * @memberof InlineResponse20042Feed
     */
    createdAt?: number;
    /**
     * 
     * @type {number}
     * @memberof InlineResponse20042Feed
     */
    updatedAt?: number;
    /**
     * 
     * @type {number}
     * @memberof InlineResponse20042Feed
     */
    feedHasFiles?: number;
    /**
     * 
     * @type {number}
     * @memberof InlineResponse20042Feed
     */
    artworks?: number;
    /**
     * 
     * @type {number}
     * @memberof InlineResponse20042Feed
     */
    feeds?: number;
    /**
     * 
     * @type {UserLiteModel}
     * @memberof InlineResponse20042Feed
     */
    users?: UserLiteModel;
    /**
     * 
     * @type {InlineResponse20042FeedCount}
     * @memberof InlineResponse20042Feed
     */
    count?: InlineResponse20042FeedCount;
    /**
     * 
     * @type {boolean}
     * @memberof InlineResponse20042Feed
     */
    liked?: boolean;
}
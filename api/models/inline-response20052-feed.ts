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
import { InlineResponse20052FeedCount } from './inline-response20052-feed-count';
import { UserLiteModel } from './user-lite-model';
/**
 * 
 * @export
 * @interface InlineResponse20052Feed
 */
export interface InlineResponse20052Feed {
    /**
     * 
     * @type {number}
     * @memberof InlineResponse20052Feed
     */
    id?: number;
    /**
     * 
     * @type {number}
     * @memberof InlineResponse20052Feed
     */
    userId?: number;
    /**
     * 
     * @type {number}
     * @memberof InlineResponse20052Feed
     */
    text?: number;
    /**
     * 
     * @type {number}
     * @memberof InlineResponse20052Feed
     */
    visibility?: number;
    /**
     * 
     * @type {number}
     * @memberof InlineResponse20052Feed
     */
    whoCanReply?: number;
    /**
     * 
     * @type {number}
     * @memberof InlineResponse20052Feed
     */
    workId?: number;
    /**
     * 
     * @type {number}
     * @memberof InlineResponse20052Feed
     */
    feedId?: number;
    /**
     * 
     * @type {number}
     * @memberof InlineResponse20052Feed
     */
    createdAt?: number;
    /**
     * 
     * @type {number}
     * @memberof InlineResponse20052Feed
     */
    updatedAt?: number;
    /**
     * 
     * @type {number}
     * @memberof InlineResponse20052Feed
     */
    feedHasFiles?: number;
    /**
     * 
     * @type {number}
     * @memberof InlineResponse20052Feed
     */
    artworks?: number;
    /**
     * 
     * @type {number}
     * @memberof InlineResponse20052Feed
     */
    feeds?: number;
    /**
     * 
     * @type {UserLiteModel}
     * @memberof InlineResponse20052Feed
     */
    users?: UserLiteModel;
    /**
     * 
     * @type {InlineResponse20052FeedCount}
     * @memberof InlineResponse20052Feed
     */
    count?: InlineResponse20052FeedCount;
    /**
     * 
     * @type {boolean}
     * @memberof InlineResponse20052Feed
     */
    liked?: boolean;
}

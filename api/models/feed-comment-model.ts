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
 * @interface FeedCommentModel
 */
export interface FeedCommentModel {
    /**
     * 
     * @type {number}
     * @memberof FeedCommentModel
     */
    id?: number;
    /**
     * 
     * @type {number}
     * @memberof FeedCommentModel
     */
    feedId?: number;
    /**
     * 
     * @type {number}
     * @memberof FeedCommentModel
     */
    userId?: number;
    /**
     * 
     * @type {string}
     * @memberof FeedCommentModel
     */
    comment?: string;
    /**
     * 
     * @type {number}
     * @memberof FeedCommentModel
     */
    isNotifExpanded?: number;
    /**
     * 
     * @type {number}
     * @memberof FeedCommentModel
     */
    isRead?: number;
    /**
     * 
     * @type {number}
     * @memberof FeedCommentModel
     */
    isCleared?: number;
    /**
     * 
     * @type {string}
     * @memberof FeedCommentModel
     */
    createdAt?: string;
    /**
     * 
     * @type {string}
     * @memberof FeedCommentModel
     */
    updatedAt?: string;
}
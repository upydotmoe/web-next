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
import { ArtworkAssetsModel } from './artwork-assets-model';
import { InlineResponse20042DataArtworkShareInfo } from './inline-response20042-data-artwork-share-info';
import { InlineResponse20042DataCount } from './inline-response20042-data-count';
import { UserLiteModel } from './user-lite-model';
/**
 * 
 * @export
 * @interface InlineResponse20042DataFeeds
 */
export interface InlineResponse20042DataFeeds {
    /**
     * 
     * @type {number}
     * @memberof InlineResponse20042DataFeeds
     */
    id?: number;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse20042DataFeeds
     */
    title?: string;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse20042DataFeeds
     */
    description?: string;
    /**
     * 
     * @type {number}
     * @memberof InlineResponse20042DataFeeds
     */
    userId?: number;
    /**
     * 
     * @type {number}
     * @memberof InlineResponse20042DataFeeds
     */
    isExplicit?: InlineResponse20042DataFeedsIsExplicitEnum;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse20042DataFeeds
     */
    scheduledPost?: string;
    /**
     * 
     * @type {UserLiteModel}
     * @memberof InlineResponse20042DataFeeds
     */
    users?: UserLiteModel;
    /**
     * 
     * @type {InlineResponse20042DataArtworkShareInfo}
     * @memberof InlineResponse20042DataFeeds
     */
    artworkShareInfo?: InlineResponse20042DataArtworkShareInfo;
    /**
     * 
     * @type {Array<ArtworkAssetsModel>}
     * @memberof InlineResponse20042DataFeeds
     */
    artworkAssets?: Array<ArtworkAssetsModel>;
    /**
     * 
     * @type {boolean}
     * @memberof InlineResponse20042DataFeeds
     */
    liked?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof InlineResponse20042DataFeeds
     */
    saved?: boolean;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse20042DataFeeds
     */
    visibility?: string;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse20042DataFeeds
     */
    whoCanReply?: string;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse20042DataFeeds
     */
    createdAt?: string;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse20042DataFeeds
     */
    updatedAt?: string;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse20042DataFeeds
     */
    type?: InlineResponse20042DataFeedsTypeEnum;
    /**
     * 
     * @type {InlineResponse20042DataCount}
     * @memberof InlineResponse20042DataFeeds
     */
    count?: InlineResponse20042DataCount;
}

/**
    * @export
    * @enum {string}
    */
export enum InlineResponse20042DataFeedsIsExplicitEnum {
    NUMBER_0 = 0,
    NUMBER_1 = 1
}
/**
    * @export
    * @enum {string}
    */
export enum InlineResponse20042DataFeedsTypeEnum {
    Artwork = 'artwork',
    Feed = 'feed'
}

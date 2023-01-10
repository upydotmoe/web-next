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
import { InlineResponse20046DataArtworkShareInfo } from './inline-response20046-data-artwork-share-info';
import { InlineResponse20046DataCount } from './inline-response20046-data-count';
import { InlineResponse20046DataRedrawedArtworkInfo } from './inline-response20046-data-redrawed-artwork-info';
import { UserLiteModel } from './user-lite-model';
/**
 * 
 * @export
 * @interface InlineResponse20046DataFeeds
 */
export interface InlineResponse20046DataFeeds {
    /**
     * 
     * @type {number}
     * @memberof InlineResponse20046DataFeeds
     */
    id?: number;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse20046DataFeeds
     */
    title?: string;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse20046DataFeeds
     */
    description?: string;
    /**
     * 
     * @type {number}
     * @memberof InlineResponse20046DataFeeds
     */
    userId?: number;
    /**
     * 
     * @type {number}
     * @memberof InlineResponse20046DataFeeds
     */
    isExplicit?: InlineResponse20046DataFeedsIsExplicitEnum;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse20046DataFeeds
     */
    scheduledPost?: string;
    /**
     * 
     * @type {number}
     * @memberof InlineResponse20046DataFeeds
     */
    redrawOf?: number;
    /**
     * 
     * @type {UserLiteModel}
     * @memberof InlineResponse20046DataFeeds
     */
    users?: UserLiteModel;
    /**
     * 
     * @type {InlineResponse20046DataArtworkShareInfo}
     * @memberof InlineResponse20046DataFeeds
     */
    artworkShareInfo?: InlineResponse20046DataArtworkShareInfo;
    /**
     * 
     * @type {InlineResponse20046DataRedrawedArtworkInfo}
     * @memberof InlineResponse20046DataFeeds
     */
    redrawedArtworkInfo?: InlineResponse20046DataRedrawedArtworkInfo;
    /**
     * 
     * @type {Array<ArtworkAssetsModel>}
     * @memberof InlineResponse20046DataFeeds
     */
    artworkAssets?: Array<ArtworkAssetsModel>;
    /**
     * 
     * @type {boolean}
     * @memberof InlineResponse20046DataFeeds
     */
    liked?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof InlineResponse20046DataFeeds
     */
    saved?: boolean;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse20046DataFeeds
     */
    visibility?: string;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse20046DataFeeds
     */
    whoCanReply?: string;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse20046DataFeeds
     */
    createdAt?: string;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse20046DataFeeds
     */
    updatedAt?: string;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse20046DataFeeds
     */
    type?: InlineResponse20046DataFeedsTypeEnum;
    /**
     * 
     * @type {InlineResponse20046DataCount}
     * @memberof InlineResponse20046DataFeeds
     */
    count?: InlineResponse20046DataCount;
}

/**
    * @export
    * @enum {string}
    */
export enum InlineResponse20046DataFeedsIsExplicitEnum {
    NUMBER_0 = 0,
    NUMBER_1 = 1
}
/**
    * @export
    * @enum {string}
    */
export enum InlineResponse20046DataFeedsTypeEnum {
    Artwork = 'artwork',
    Feed = 'feed'
}

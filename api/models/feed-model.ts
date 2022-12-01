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
import { FeedLiteModel } from './feed-lite-model';
import { FeedModelFeedHasFiles } from './feed-model-feed-has-files';
import { UserLiteModel } from './user-lite-model';
/**
 * 
 * @export
 * @interface FeedModel
 */
export interface FeedModel extends FeedLiteModel {
    /**
     * 
     * @type {UserLiteModel}
     * @memberof FeedModel
     */
    users?: UserLiteModel;
    /**
     * 
     * @type {Array<FeedModelFeedHasFiles>}
     * @memberof FeedModel
     */
    feedHasFiles?: Array<FeedModelFeedHasFiles>;
    /**
     * 
     * @type {any}
     * @memberof FeedModel
     */
    artworks?: any;
}


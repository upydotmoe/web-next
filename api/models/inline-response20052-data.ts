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
import { PaginationModel } from './pagination-model';
/**
 * 
 * @export
 * @interface InlineResponse20052Data
 */
export interface InlineResponse20052Data {
    /**
     * 
     * @type {Array<FeedLiteModel>}
     * @memberof InlineResponse20052Data
     */
    feeds?: Array<FeedLiteModel>;
    /**
     * 
     * @type {PaginationModel}
     * @memberof InlineResponse20052Data
     */
    pagination?: PaginationModel;
}

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
import { PaginationModel } from './pagination-model';
import { UserLiteModel } from './user-lite-model';
/**
 * 
 * @export
 * @interface InlineResponse2008DataData
 */
export interface InlineResponse2008DataData {
    /**
     * 
     * @type {Array<UserLiteModel & any>}
     * @memberof InlineResponse2008DataData
     */
    followings?: Array<UserLiteModel & any>;
    /**
     * 
     * @type {PaginationModel}
     * @memberof InlineResponse2008DataData
     */
    pagination?: PaginationModel;
}

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
import { ReplyModel } from './reply-model';
/**
 * 
 * @export
 * @interface InlineResponse20025Data
 */
export interface InlineResponse20025Data {
    /**
     * 
     * @type {Array<ReplyModel & any>}
     * @memberof InlineResponse20025Data
     */
    replies?: Array<ReplyModel & any>;
    /**
     * 
     * @type {PaginationModel}
     * @memberof InlineResponse20025Data
     */
    pagination?: PaginationModel;
}

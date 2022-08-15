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
import { CommentModel } from './comment-model';
import { PaginationModel } from './pagination-model';
/**
 * 
 * @export
 * @interface InlineResponse20018Data
 */
export interface InlineResponse20018Data {
    /**
     * 
     * @type {Array<CommentModel>}
     * @memberof InlineResponse20018Data
     */
    comments?: Array<CommentModel>;
    /**
     * 
     * @type {PaginationModel}
     * @memberof InlineResponse20018Data
     */
    pagination?: PaginationModel;
}
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
import { InlineResponse20014DataUsers } from './inline-response20014-data-users';
import { PaginationModel } from './pagination-model';
/**
 * 
 * @export
 * @interface InlineResponse20014Data
 */
export interface InlineResponse20014Data {
    /**
     * 
     * @type {Array<InlineResponse20014DataUsers>}
     * @memberof InlineResponse20014Data
     */
    users?: Array<InlineResponse20014DataUsers>;
    /**
     * 
     * @type {PaginationModel}
     * @memberof InlineResponse20014Data
     */
    pagination?: PaginationModel;
}

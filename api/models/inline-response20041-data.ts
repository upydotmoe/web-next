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
import { InlineResponse20041DataNotifications } from './inline-response20041-data-notifications';
import { PaginationModel } from './pagination-model';
/**
 * 
 * @export
 * @interface InlineResponse20041Data
 */
export interface InlineResponse20041Data {
    /**
     * 
     * @type {Array<InlineResponse20041DataNotifications>}
     * @memberof InlineResponse20041Data
     */
    notifications?: Array<InlineResponse20041DataNotifications>;
    /**
     * 
     * @type {PaginationModel}
     * @memberof InlineResponse20041Data
     */
    pagination?: PaginationModel;
}

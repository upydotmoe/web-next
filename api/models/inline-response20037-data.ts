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
import { InlineResponse20037DataNotifications } from './inline-response20037-data-notifications';
import { PaginationModel } from './pagination-model';
/**
 * 
 * @export
 * @interface InlineResponse20037Data
 */
export interface InlineResponse20037Data {
    /**
     * 
     * @type {Array<InlineResponse20037DataNotifications>}
     * @memberof InlineResponse20037Data
     */
    notifications?: Array<InlineResponse20037DataNotifications>;
    /**
     * 
     * @type {PaginationModel}
     * @memberof InlineResponse20037Data
     */
    pagination?: PaginationModel;
}
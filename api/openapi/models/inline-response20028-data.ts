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
import { InlineResponse20028DataNotifications } from './inline-response20028-data-notifications';
import { PaginationModel } from './pagination-model';
/**
 * 
 * @export
 * @interface InlineResponse20028Data
 */
export interface InlineResponse20028Data {
    /**
     * 
     * @type {Array<InlineResponse20028DataNotifications>}
     * @memberof InlineResponse20028Data
     */
    notifications?: Array<InlineResponse20028DataNotifications>;
    /**
     * 
     * @type {PaginationModel}
     * @memberof InlineResponse20028Data
     */
    pagination?: PaginationModel;
}

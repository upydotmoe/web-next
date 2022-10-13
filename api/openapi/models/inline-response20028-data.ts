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
import { PaginationModel } from './pagination-model';
import { UserModel } from './user-model';
/**
 * 
 * @export
 * @interface InlineResponse20028Data
 */
export interface InlineResponse20028Data {
    /**
     * 
     * @type {Array<UserModel & any>}
     * @memberof InlineResponse20028Data
     */
    users?: Array<UserModel & any>;
    /**
     * 
     * @type {PaginationModel}
     * @memberof InlineResponse20028Data
     */
    pagination?: PaginationModel;
}

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
import { UserLiteModel } from './user-lite-model';
/**
 * 
 * @export
 * @interface InlineResponse20012Data
 */
export interface InlineResponse20012Data {
    /**
     * 
     * @type {boolean}
     * @memberof InlineResponse20012Data
     */
    success?: boolean;
    /**
     * 
     * @type {Array<UserLiteModel & any>}
     * @memberof InlineResponse20012Data
     */
    suggestions?: Array<UserLiteModel & any>;
}

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
import { ReportModel } from './report-model';
/**
 * 
 * @export
 * @interface InlineResponse20044Data
 */
export interface InlineResponse20044Data {
    /**
     * 
     * @type {Array<ReportModel>}
     * @memberof InlineResponse20044Data
     */
    reports?: Array<ReportModel>;
    /**
     * 
     * @type {PaginationModel}
     * @memberof InlineResponse20044Data
     */
    pagination?: PaginationModel;
}
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
import { AlbumModel } from './album-model';
import { PaginationModel } from './pagination-model';
/**
 * 
 * @export
 * @interface InlineResponse20017Data
 */
export interface InlineResponse20017Data {
    /**
     * 
     * @type {Array<AlbumModel>}
     * @memberof InlineResponse20017Data
     */
    albums?: Array<AlbumModel>;
    /**
     * 
     * @type {PaginationModel}
     * @memberof InlineResponse20017Data
     */
    pagination?: PaginationModel;
}

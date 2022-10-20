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
import { CollectionHasArtworksModel } from './collection-has-artworks-model';
import { PaginationModel } from './pagination-model';
/**
 * 
 * @export
 * @interface InlineResponse20011Data
 */
export interface InlineResponse20011Data {
    /**
     * 
     * @type {Array<CollectionHasArtworksModel>}
     * @memberof InlineResponse20011Data
     */
    items?: Array<CollectionHasArtworksModel>;
    /**
     * 
     * @type {PaginationModel}
     * @memberof InlineResponse20011Data
     */
    pagination?: PaginationModel;
}
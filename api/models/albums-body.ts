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
/**
 * 
 * @export
 * @interface AlbumsBody
 */
export interface AlbumsBody {
    /**
     * 
     * @type {number}
     * @memberof AlbumsBody
     */
    id: number;
    /**
     * 
     * @type {string}
     * @memberof AlbumsBody
     */
    name?: string;
    /**
     * 
     * @type {string}
     * @memberof AlbumsBody
     */
    description?: string;
    /**
     * 
     * @type {number}
     * @memberof AlbumsBody
     */
    isPublic?: AlbumsBodyIsPublicEnum;
}

/**
    * @export
    * @enum {string}
    */
export enum AlbumsBodyIsPublicEnum {
    NUMBER_0 = 0,
    NUMBER_1 = 1
}


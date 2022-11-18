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
 * @interface ArtworksBody
 */
export interface ArtworksBody {
    /**
     * 
     * @type {number}
     * @memberof ArtworksBody
     */
    id: number;
    /**
     * 
     * @type {string}
     * @memberof ArtworksBody
     */
    title?: string;
    /**
     * 
     * @type {string}
     * @memberof ArtworksBody
     */
    description?: string;
    /**
     * 
     * @type {number}
     * @memberof ArtworksBody
     */
    isExplicit?: ArtworksBodyIsExplicitEnum;
    /**
     * 
     * @type {string}
     * @memberof ArtworksBody
     */
    scheduledPost?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ArtworksBody
     */
    tags?: string;
    /**
     * 
     * @type {number}
     * @memberof ArtworksBody
     */
    isOriginalCharacter?: ArtworksBodyIsOriginalCharacterEnum;
}

/**
    * @export
    * @enum {string}
    */
export enum ArtworksBodyIsExplicitEnum {
    NUMBER_0 = 0,
    NUMBER_1 = 1
}
/**
    * @export
    * @enum {string}
    */
export enum ArtworksBodyIsOriginalCharacterEnum {
    NUMBER_0 = 0,
    NUMBER_1 = 1
}


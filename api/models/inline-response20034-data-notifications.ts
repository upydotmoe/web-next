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
import { InlineResponse20034DataArtworks } from './inline-response20034-data-artworks';
import { InlineResponse20034DataUsers } from './inline-response20034-data-users';
/**
 * 
 * @export
 * @interface InlineResponse20034DataNotifications
 */
export interface InlineResponse20034DataNotifications {
    /**
     * 
     * @type {number}
     * @memberof InlineResponse20034DataNotifications
     */
    id?: number;
    /**
     * 
     * @type {number}
     * @memberof InlineResponse20034DataNotifications
     */
    workId?: number;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse20034DataNotifications
     */
    comment?: string;
    /**
     * 
     * @type {InlineResponse20034DataUsers}
     * @memberof InlineResponse20034DataNotifications
     */
    users?: InlineResponse20034DataUsers;
    /**
     * 
     * @type {InlineResponse20034DataArtworks}
     * @memberof InlineResponse20034DataNotifications
     */
    artworks?: InlineResponse20034DataArtworks;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse20034DataNotifications
     */
    createdAt?: string;
}
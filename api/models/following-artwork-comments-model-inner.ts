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
 * @interface FollowingArtworkCommentsModelInner
 */
export interface FollowingArtworkCommentsModelInner {
    /**
     * 
     * @type {number}
     * @memberof FollowingArtworkCommentsModelInner
     */
    id?: number;
    /**
     * 
     * @type {string}
     * @memberof FollowingArtworkCommentsModelInner
     */
    comment?: string;
    /**
     * 
     * @type {string}
     * @memberof FollowingArtworkCommentsModelInner
     */
    createdAt?: string;
    /**
     * 
     * @type {string}
     * @memberof FollowingArtworkCommentsModelInner
     */
    updatedAt?: string;
    /**
     * 
     * @type {UserLiteModel}
     * @memberof FollowingArtworkCommentsModelInner
     */
    users?: UserLiteModel;
}

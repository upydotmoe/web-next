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
import { UserLiteModel } from './user-lite-model';
/**
 * 
 * @export
 * @interface ReportModel
 */
export interface ReportModel {
    /**
     * 
     * @type {number}
     * @memberof ReportModel
     */
    id?: number;
    /**
     * 
     * @type {string}
     * @memberof ReportModel
     */
    type?: ReportModelTypeEnum;
    /**
     * 
     * @type {number}
     * @memberof ReportModel
     */
    postId?: number;
    /**
     * 
     * @type {string}
     * @memberof ReportModel
     */
    reasons?: string;
    /**
     * 
     * @type {string}
     * @memberof ReportModel
     */
    description?: string;
    /**
     * 
     * @type {string}
     * @memberof ReportModel
     */
    createdAt?: string;
    /**
     * 
     * @type {string}
     * @memberof ReportModel
     */
    response?: ReportModelResponseEnum;
    /**
     * 
     * @type {string}
     * @memberof ReportModel
     */
    status?: ReportModelStatusEnum;
    /**
     * 
     * @type {string}
     * @memberof ReportModel
     */
    responseDescription?: string;
    /**
     * 
     * @type {string}
     * @memberof ReportModel
     */
    respondedAt?: string;
    /**
     * 
     * @type {UserLiteModel}
     * @memberof ReportModel
     */
    userReported?: UserLiteModel;
    /**
     * 
     * @type {UserLiteModel}
     * @memberof ReportModel
     */
    userResponded?: UserLiteModel;
}

/**
    * @export
    * @enum {string}
    */
export enum ReportModelTypeEnum {
    Artwork = 'artwork',
    Feed = 'feed',
    Comment = 'comment',
    CommentReply = 'comment_reply'
}
/**
    * @export
    * @enum {string}
    */
export enum ReportModelResponseEnum {
    _0 = '0',
    _1 = '1'
}
/**
    * @export
    * @enum {string}
    */
export enum ReportModelStatusEnum {
    Pending = 'pending',
    Closed = 'closed'
}


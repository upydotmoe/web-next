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
import { ReplyModel } from './reply-model';
import { SuccessMessageModel } from './success-message-model';
/**
 * 
 * @export
 * @interface InlineResponse2014
 */
export interface InlineResponse2014 extends SuccessMessageModel {
    /**
     * 
     * @type {ReplyModel & any}
     * @memberof InlineResponse2014
     */
    data?: ReplyModel & any;
}
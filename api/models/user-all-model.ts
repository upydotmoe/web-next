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
import { UserModel } from './user-model';
import { UserSettingModel } from './user-setting-model';
import { UserSocialModel } from './user-social-model';
/**
 * 
 * @export
 * @interface UserAllModel
 */
export interface UserAllModel extends UserModel {
    /**
     * 
     * @type {UserSocialModel}
     * @memberof UserAllModel
     */
    userSocials?: UserSocialModel;
    /**
     * 
     * @type {UserSettingModel}
     * @memberof UserAllModel
     */
    userSettings?: UserSettingModel;
    /**
     * 
     * @type {boolean}
     * @memberof UserAllModel
     */
    isPro?: boolean;
}

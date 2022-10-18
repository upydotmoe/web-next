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
}



import { GeneralErrorDetails, UserSpecificPartOfAnError } from "../../api/dtos/errors/error_response";

export interface ApiError{
    details?:GeneralErrorDetails
    status:number;
    statusText:string;
    userInfo:UserSpecificPartOfAnError;
}
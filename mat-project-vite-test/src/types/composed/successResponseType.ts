import { ApplicationSuccessResponse } from "../../api/dtos/success_response";

export type SuccessResponseType<T extends ApplicationSuccessResponse['data']> = 
T extends undefined ? undefined
:{
    data:T
};
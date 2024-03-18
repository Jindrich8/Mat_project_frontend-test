import {ApplicationErrorInformation, ApplicationErrorResponse} from "../../api/dtos/errors/error_response";
import { OmitFromMappedType } from "../base";

export type ErrorResponseType<Details extends ApplicationErrorInformation['details'] = ApplicationErrorInformation['details']> = 
OmitFromMappedType<ApplicationErrorResponse,'error'>&{
    error:OmitFromMappedType<ApplicationErrorInformation,'details'> & {
        details:Details
    }
};
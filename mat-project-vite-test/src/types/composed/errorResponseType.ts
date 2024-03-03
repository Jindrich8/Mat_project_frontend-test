import {ApplicationErrorInformation, ApplicationErrorResponse} from "../../api/dtos/errors/error_response";

export type ErrorResponseType<Details extends ApplicationErrorInformation['details']> = 
ApplicationErrorResponse & {error:{details:Details}};
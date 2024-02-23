import {ApplicationErrorInformation} from "../../api/dtos/errors/error_response";

export type ErrorResponseType<Details extends ApplicationErrorInformation['details']> = 
ApplicationErrorInformation & {details:Details};
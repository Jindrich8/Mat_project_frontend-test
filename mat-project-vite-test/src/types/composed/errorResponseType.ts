import { ApplicationErrorResponse } from "../../api/dtos/errors/error_response";

export type ErrorResponseType<Details> = Details extends ApplicationErrorResponse['details']  ?
 ApplicationErrorResponse & {details:Details}
 : never;
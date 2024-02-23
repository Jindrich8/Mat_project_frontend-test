import { ApplicationErrorResponse } from "../../api/dtos/errors/error_response";
import { ApplicationSuccessResponse } from "../../api/dtos/success_response";

export type ErrorDetail = ApplicationErrorResponse['error']['details'];
export type EndpointResponse =ApplicationSuccessResponse['data'];
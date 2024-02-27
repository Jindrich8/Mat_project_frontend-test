import { Response } from "../composed/Response";
import { ErrorResponseType } from "../composed/errorResponseType";
import { Any, Lfunc } from "../types";


export type ResponseError<T extends Lfunc> = 
T extends (...args: Any) => Promise<Response<Any, ErrorResponseType<infer R>|undefined>> ? 
ErrorResponseType<R>['error']|undefined 
: never;
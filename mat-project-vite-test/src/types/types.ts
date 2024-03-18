import { Response } from "./composed/Response";
import { ErrorResponseType } from "./composed/errorResponseType";
import { ApiError, ResponseError } from "./errors/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Lfunc = (...args: any) => any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Any = any;

export type ErrorResponseState<T extends Lfunc = () => Promise<Response<Any, ErrorResponseType|undefined>>> = ApiError<ResponseError<T>>|undefined;
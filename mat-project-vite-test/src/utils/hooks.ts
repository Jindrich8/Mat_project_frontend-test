import React from "react";
import { ResponseError } from "../types/errors/ResponseError"
import { Lfunc } from "../types/types";

export const useErrorResponse = <T extends Lfunc>() => {
    type S = {
    status:number,
    statusText:string,
    error?:ResponseError<T>}|undefined;
return React.useState<S>(undefined);
};
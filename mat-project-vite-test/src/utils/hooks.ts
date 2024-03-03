import React from "react";
import { ApiError, ResponseError } from "../types/errors/types"
import { Lfunc } from "../types/types";

export const useErrorResponse = <T extends Lfunc>() => {
return React.useState<ApiError<ResponseError<T>>|undefined>(undefined);
};
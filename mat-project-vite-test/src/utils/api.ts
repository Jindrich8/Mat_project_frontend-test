import axios from "axios"
import qs from "qs"
import { ErrorResponseType } from "../types/composed/errorResponseType";
import { ApiError } from "../types/errors/ApiError";
import { ApplicationSuccessResponse } from "../api/dtos/success_response";
import { SuccessResponseType } from "../types/composed/successResponseType";
import { Response } from "../types/composed/Response";
import { ApplicationErrorResponse, GeneralErrorDetails } from "../api/dtos/errors/error_response";
import { EndpointResponse, ErrorDetail } from "../types/composed/apiTypes";
import { ApiController } from "../types/composed/apiController";
import { OldRequestError } from "../types/errors/OldRequestError";
import { AbortedError, RequestAbortError } from "../types/errors/RequestAbortError";

axios.defaults.withCredentials = true;
const apiAxios = (() => {
  const instance = axios.create({
    baseURL: 'http://localhost:8000/',
    // TODO: change this to true
    withCredentials: true,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    // TODO: uncomment this
    withXSRFToken: true
  });
  instance.interceptors.request.use(config => {
    window.console.log(config);
    config.paramsSerializer = {
      serialize: (params) => {

        const result = qs.stringify(params, {
          arrayFormat: "brackets",
          encode: false,
        });
        window.console.log(`paramsSerializer: '${JSON.stringify(params)}' -> '${JSON.stringify(result)}'`);
        return result;
      }
    };

    return config;
  });
  axios.defaults.withCredentials = true;
  axios.defaults.withXSRFToken = true;
  return instance;
})();

export const api = () => {
  console.log("Creating api...");
  // TODO: uncomment this

  console.log("Api created successfully...");
  return apiAxios;
}

const DuplicateRequest = Symbol("DuplicateRequest");
type ApiMethod = "GET" | "POST";
/** 
 * @throws {Error}
 */
const apiRequest = async <
R extends EndpointResponse, 
E extends ErrorDetail
>(method: ApiMethod, path: string, actualRequest: object|undefined,apiController:ApiController): 
Promise<Response<SuccessResponseType<R>,ErrorResponseType<E|GeneralErrorDetails>|undefined>> => {
  let response;
  let signal = undefined;
  try {
    let call;
    const apiObj = api();
    switch (method) {
      case 'GET':
        call = apiObj.get;
        break;
      case 'POST':
        call = apiObj.post;
        break;
      default:
        throw new Error(`Undefined method '${method}`);
    }
    apiController.abort(DuplicateRequest);
   signal = apiController.set();
    response = await call<SuccessResponseType<R>>(path,actualRequest,{
      signal:signal
    });
  }
  catch (error) {
    if(signal?.aborted && error instanceof DOMException &&
      (error.name === "AbortError" || error.name === "CanceledError")){
        const apiError = 
        signal.reason === DuplicateRequest ?
        new OldRequestError()
        : new RequestAbortError(signal.reason)
        return {
          success:false,
          error:apiError
        };
    }
    if (axios.isAxiosError<R>(error)) {
      // Access to config, request, and response
      response = error.response;
      if (response) {
        return {
          success: false,
          status: response.status,
          statusText: response.statusText,
          error: response.data as (ErrorResponseType<E> | undefined)
        };
      }
    }
    throw error;
  }

    return {
      success:true,
      body:response.data
    };
}

export const apiGet = async <
T,
R extends EndpointResponse, 
E extends ErrorDetail
>(path: string, request: T,apiController:ApiController) => {
  return apiRequest<R,E>('GET',path,request ?{
    params:{
      data:request
    }
  }:undefined,apiController);
};


export const apiPost = async <
T extends object,
R extends EndpointResponse, 
E extends ErrorDetail
>(path: string, request: T,apiController:ApiController) => {
  return apiRequest<R,E>('POST',path,{
    data:request
  },apiController);
};


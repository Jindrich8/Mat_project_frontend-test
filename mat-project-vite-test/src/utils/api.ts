import axios from "axios"
import qs from "qs"
import { ErrorResponseType } from "../types/composed/errorResponseType";
import { SuccessResponseType } from "../types/composed/successResponseType";
import { Response } from "../types/composed/Response";
import { CSRFTokenMismatchError, GeneralErrorDetails } from "../api/dtos/errors/error_response";
import { EndpointResponse, ErrorDetail } from "../types/composed/apiTypes";
import { ApiController } from "../types/composed/apiController";
import { OldRequestError } from "../types/errors/OldRequestError";
import { RequestAbortError } from "../types/errors/RequestAbortError";
import Cookies from "js-cookie"
import { csrf } from "./auth";
import { dump } from "./utils";
import { DuplicateRequestError } from "../types/errors/DuplicateRequestError";

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

export type RequestOptions = {
  needsCsrf?:boolean,
  version?:number
};

const RequestVersion = Symbol("RequestVersion");
const DuplicateRequest = Symbol("DuplicateRequest");
type ApiMethod = "GET" | "POST";
const XsrfTokenCookieName = 'XSRF-TOKEN';

const versionsAreSame = (controller: ApiController, version: number) => {
  const prevVersion = controller.getData(RequestVersion);
  return prevVersion.exists && prevVersion.value === version;
};

/** 
 * @throws {Error}
 */
export const apiRequest = async <
  R extends EndpointResponse,
  E extends ErrorDetail
>(method: ApiMethod, path: string, actualRequest: object | undefined, apiController: ApiController,options:RequestOptions|undefined = undefined):
  Promise<Response<SuccessResponseType<R>, ErrorResponseType<E | GeneralErrorDetails|CSRFTokenMismatchError> | undefined>> => {
    const needsCsrf = options?.needsCsrf ?? true;
    const version = options?.version ?? undefined;

  let response;
  let signal = undefined;
  if (version !== undefined && versionsAreSame(apiController, version)) {
    return Promise.resolve({
      success: false,
      isServerError: false,
      error: new DuplicateRequestError(version)
    });
  }
  try {
    if (needsCsrf) {
      const xsrfToken = Cookies.get(XsrfTokenCookieName);
      if (!xsrfToken) {
        await csrf();
      }
    }
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
    let beforeAbortSync: ApiController['beforeAbortSync'] = undefined;
    if (version !== undefined) {
      apiController.setData(RequestVersion, version);
      beforeAbortSync = (c: ApiController) => {
        if (versionsAreSame(c, version)) {
          c.setData(RequestVersion, undefined);
        }
      };
    }
    signal = apiController.set(beforeAbortSync);
    response = await call<SuccessResponseType<R>>(path, actualRequest, {
      signal: signal
    });
    apiController.call('success',response);
  }
  catch (error) {
    apiController.call('error', error);
    console.log("Error: " + (error && typeof error === "object" ? dump(error) : error));
    if (signal?.aborted && error instanceof DOMException &&
      (error.name === "AbortError" || error.name === "CanceledError")) {
      const apiError =
        signal.reason === DuplicateRequest ?
          new OldRequestError()
          : new RequestAbortError(signal.reason)
      return {
        isServerError: false,
        success: false,
        error: apiError
      };
    }
    if (axios.isAxiosError<R>(error)) {
      apiController.call('axiosError',error);
      if(error.status === 419){
        const xsrfHeaderName = error.config?.xsrfHeaderName ?? 'X-Xsrf-Token';
        const xsrfToken = error.config?.headers[xsrfHeaderName] ?? undefined;
        if (xsrfToken === undefined || Cookies.get(XsrfTokenCookieName) === xsrfToken) {
          Cookies.remove(XsrfTokenCookieName);
        }
        console.log("CSRF token mismatch");
      }
      console.log("Axios error");
      // Access to config, request, and response
      response = error.response;
      if (response) {
        apiController.call('serverError',response);
        console.log("response");
        return {
          isServerError: true,
          success: false,
          status: response.status,
          statusText: response.statusText,
          error: response.data as (ErrorResponseType<E> | undefined)
        };
      }
    }
    console.log("Throwing");
    throw error;
  }
  finally {
    if (version !== undefined && versionsAreSame(apiController, version)) {
      apiController.setData(RequestVersion, undefined);
    }
  }

  return {
    success: true,
    body: response.data
  };
}

export const apiGet = async <
  T,
  R extends EndpointResponse,
  E extends ErrorDetail
>(path: string, request: T, apiController: ApiController,options:RequestOptions|undefined = undefined) => {
  return apiRequest<R, E>('GET', path, request ? {
    params: {
      data: request
    }
  } : undefined,apiController,options);
};


export const apiPost = async <
  T extends object,
  R extends EndpointResponse,
  E extends ErrorDetail
>(path: string, request: T, apiController: ApiController,options:RequestOptions|undefined = undefined) => {
  return apiRequest<R, E>('POST', path, {
    data: request
  }, apiController,options);
};


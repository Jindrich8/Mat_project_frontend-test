import axios from "axios"
import qs from "qs"
import { Response } from "../types/composed/Response";
import { ErrorResponseType } from "../types/composed/errorResponseType";
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

const apiRequest = async <R, E>(method: 'GET' | 'POST', path: string, actualRequest: object): 
Promise<Response<R, ErrorResponseType<E>>> => {
  let response;

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
    response = await call(path,actualRequest);
  }
  catch (error) {
    if (axios.isAxiosError(error)) {
      // Access to config, request, and response
      response = error.response;
    } else {
      // Just a stock error
      throw error;
    }
  }
  if (!response) {
    throw new Error("Response is undefined this should not be possible!");
  }

  if (response.status === 200) {
    return {
      success: true,
      body: response.data.data as R
    };
  }
  else {
    return {
      status: response.status,
      statusText: response.statusText,
      success: false,
      error: response.data as ErrorResponseType<E>
    };
  }
  //  return FakeData[request.id];


}

export const apiGet = async <T extends object, R, E>(path: string, request: T | undefined) => {
  return apiRequest<R,E>('GET',path,{
    params:{
      data:request
    }
  });
};


export const apiPost = async <T extends object, R, E>(path: string, request: T) => {
  return apiRequest<R,E>('POST',path,{
    data:request
  });
}


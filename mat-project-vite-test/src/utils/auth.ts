import { AxiosResponse } from "axios";
import { api, apiRequest } from "./api";
import { LoginErrorResponseDetails, RegisterErrorDetails } from "../api/dtos/errors/error_response";
import { LogOutResponse, LoginResponse, RegisterResponse } from "../api/dtos/success_response";
import { ApiController } from "../types/composed/apiController";
import { LoginRequest, RegisterRequest } from "../api/dtos/request";

const registerControl = new ApiController();

const register = async (request:RegisterRequest) => {
    const registerResponse = await apiRequest<
    RegisterResponse,
    RegisterErrorDetails
    >
    ('POST','/api/register', request,registerControl);
    return registerResponse;
}

const loginControl = new ApiController();

const logIn = async (request:LoginRequest) => {
    console.log('logIn');
    const response = await apiRequest<
    LoginResponse,
    LoginErrorResponseDetails
    >
    ('POST','/api/login', request,loginControl);
    return response;
};

const csrf = async ():Promise<AxiosResponse | undefined> => {
    console.log('csrf token request');
    const response = await api().get('/sanctum/csrf-cookie');
    if (response.status !== 200 && response.status !== 204) {
        return response;
    }
    return undefined
};

const logoutControl = new ApiController();

const logOut = async () => {
const response = await apiRequest<
LogOutResponse,
undefined
>('POST','/api/logout',undefined,logoutControl);
return response;
};

export {logIn,logOut,register,csrf};
import { AxiosResponse } from "axios";
import { api, apiRequest } from "./api";
import { LoginErrorDetails, RegisterErrorDetails } from "../api/dtos/errors/error_response";
import { LoginResponse, RegisterResponse } from "../api/dtos/success_response";
import { ApiController } from "../types/composed/apiController";

const registerControl = new ApiController();

const register = async (username: string, email: string, password: string,passwordConfirm:string) => {
    const registerResponse = await apiRequest<
    RegisterResponse,
    RegisterErrorDetails
    >
    (
        'POST',
        '/api/register', 
    { 
        name: username, 
        email: email, 
        password: password,
        password_confirmation: passwordConfirm
    },registerControl);
    return registerResponse;
}

const loginControl = new ApiController();

const logIn = async (email: string, password: string) => {
    console.log('logIn');
    const response = await apiRequest<
    LoginResponse,
    LoginErrorDetails
    >
    ('POST','/api/login', { email, password },loginControl);
    return response;
};

const csrf = async ():Promise<AxiosResponse | undefined> => {
    const response = await api().get('/sanctum/csrf-cookie');
    if (response.status !== 200 && response.status !== 204) {
        return response;
    }
    return undefined
};

const logOut = async () => {
const response = await api().get('/api/logout');
if(response.status !== 200) {
    console.warn(
        'Logout failed\n' +
        `Status: ${response.status}\n` +
        `Status text: ${response.statusText}\n` +
        `Response: ${JSON.stringify(response)}\n`
    )
    return false;
}
else{
    return true;
}
};

export {logIn,logOut,register,csrf};
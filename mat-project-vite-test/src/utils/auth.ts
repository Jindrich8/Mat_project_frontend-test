import { AxiosResponse } from "axios";
import { User } from "../types/composed/user";
import { api } from "./api";
import { ApiError } from "../types/composed/apiError";

const register = async (username: string, email: string, password: string,passwordConfirm:string) => {
    let response;
    try{
    response = await csrf();
    }
    catch{ /* empty */ }
    if (response) {
        // TODO: error message
        console.warn(
            `CSRF failed\n` +
            `Status: ${response.status}\n` +
            `Status text: ${response.statusText}\n` +
            `Response: ${JSON.stringify(response)}\n`
        );
        return {status:response.status,
            statusText:response.statusText,
            message:'CSRF failed.',
            description:'Please try it again later.'
        } as ApiError;
    }
    const registerResponse = await api().post('/api/register', 
    { 
        name: username, 
        email: email, 
        password: password,
        password_confirmation: passwordConfirm
    });
    if(registerResponse.status === 200){
        console.log('Registration was succesfull');
        return undefined;
    }
    else{
        const myError = registerResponse.data.error;
        console.warn(
            'Registration failed\n' +
            `Status: ${registerResponse.status}\n` +
            `Status text: ${registerResponse.statusText}\n` +
            `Response: ${JSON.stringify(response)}\n`
        )
        return {
            status:registerResponse.status,
            statusText:registerResponse.statusText,
            message: myError?.message ?? "Registration failed.",
            description: myError?.description ?? "Please try it again later.",
            code:myError?.code ?? undefined
        } as ApiError;
    }
}

const logIn = async (email: string, password: string): Promise<User | false> => {
    const response = await csrf();
    if (response) {
        // TODO: error message
        console.warn(
            `CSRF failed\n` +
            `Status: ${response.status}\n` +
            `Status text: ${response.statusText}\n` +
            `Response: ${JSON.stringify(response)}\n`
        );
        return false;
    }
    const loggInResponse = await api().post('/api/login', { email, password });
    if (loggInResponse.status === 200) {
        console.log('Login was successful');
        return {
            name: loggInResponse.data.name,
            email: loggInResponse.data.email
        };
    }
    else {
        console.warn(
            'Login failed\n' +
            `Status: ${loggInResponse.status}\n` +
            `Status text: ${loggInResponse.statusText}\n` +
            `Response: ${JSON.stringify(response)}\n`
        )
        return false;
    }
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
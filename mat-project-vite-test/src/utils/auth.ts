import { AxiosResponse } from "axios";
import { User } from "../types/composed/user";
import { api } from "./api";

const register = async (username: string, email: string, password: string) => {
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
    const registerResponse = await api().post('/api/register', 
    { 
        username: username, 
        email: email, 
        password: password
    });
    if(registerResponse.status === 200){
        console.log('Registration was succesfull');
        return true;
    }
    else{
        console.warn(
            'Registration failed\n' +
            `Status: ${registerResponse.status}\n` +
            `Status text: ${registerResponse.statusText}\n` +
            `Response: ${JSON.stringify(response)}\n`
        )
        return false;
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

export {logIn,logOut,register};
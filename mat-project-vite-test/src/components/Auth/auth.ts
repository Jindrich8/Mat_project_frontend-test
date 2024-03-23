import { hookstate } from "@hookstate/core";
import { AlreadyAuthenticatedError, ApplicationErrorInformation, UnauthenticatedError } from "../../api/dtos/errors/error_response";
import { getProfile } from "../../api/user/profile/get";
import { ErrorResponseType } from "../../types/composed/errorResponseType";
import { User } from "../../types/composed/user";
import { ApiError, ResponseError } from "../../types/errors/types";
import { updateProfile as apiUpdateProfile } from '../../api/user/profile/send';
import { AxiosResponse, HttpStatusCode } from "axios";
import { ApiController } from "../../types/composed/apiController";
import { Any, Lfunc } from "../../types/types";
import Cookies from "js-cookie";
import { AuthContextType } from "./context";
import { RequestOptions } from "../../utils/api";
import { logIn, logOut } from "../../utils/auth";
import { LoginRequest } from "../../api/dtos/request";
import {ErrorDetail } from "../../types/composed/apiTypes";

type Error<D extends ApplicationErrorInformation['details']> = ApiError<ErrorResponseType<D>>;

export const authState = hookstate<AuthContextType>({
    signedIn: undefined,
    loading: true,
    user: undefined,
    error: undefined
});

export const isNotUnathenticatedError = <D extends ApplicationErrorInformation['details'],>(error: Error<D>):
    error is ErrorNoUnathenticated<D> => {
    return error.status !== HttpStatusCode.Unauthorized
        && error.error?.error?.details?.code !== -10 satisfies UnauthenticatedError['code']
};

export const removeAuthCookie = () => {
    Cookies.remove(authenticated);
};

export const setSignedOut = () => {
    removeAuthCookie();
    authState.set({
        signedIn: false,
        loading: false,
        user: null,
        error: undefined
    });
};


export const hasAuthCookie = () => {
    return Cookies.get(authenticated) !== undefined;
};

const setAuthCookie = () => {
    Cookies.set(authenticated, '');
}

const setSignedIn = (args: { user: User, error: undefined } | { user: null, error: Exclude<AuthContextType['error'], undefined> }) => {
    if (!hasAuthCookie()) {
        setAuthCookie();
    }
    if (args.user) {
        authState.set({
            signedIn: true,
            loading: false,
            user: args.user,
            error: args.error
        });
    }
    else if (!authState.signedIn.value) {
        authState.set((prev) => ({
            signedIn: true,
            loading: false,
            user: prev.user ?? null,
            error: args.error
        }));
    }
};

export const handleErrorResponse = (error: AxiosResponse<ErrorResponseType<ErrorDetail> | undefined, Any>) => {
    if (!isNotUnathenticatedError(error)) {
        setSignedOut();
    }
    
    if(error.data?.error?.details?.code === -12 satisfies AlreadyAuthenticatedError['code'] && !authState.signedIn.value){
        setSignedIn({
            user: null,
            error:{
                status:error.status,
                statusText:error.statusText,
                error:{
                    user_info:error.data.error.user_info,
                    details:error.data.error.details
                }
            }
        });
    }
};

const HandleErrorResponseCallback = Symbol('handleErrorResponseCallback');
//const HandleAxiosErrorResponseCallback = Symbol('handleAxiosErrorResponseCallback');

// const handleAxiosErrorResponseCallback:ApiControllerCallbacks['axiosError'] = (error) => {
//     if(error.status === 419 || error.status == null || error.code === "ERR_NETWORK"){
//         setSignedOut();
//     }
// };
export const createAuthApiController = () => {
    const c  = new ApiController();
     c.setCallback('serverError',HandleErrorResponseCallback,handleErrorResponse);
    // c.setCallback('axiosError',HandleAxiosErrorResponseCallback,handleAxiosErrorResponseCallback);
    return c;
}



const getProfileControl = createAuthApiController();
const updateProfileControl = createAuthApiController();


export type ErrorNoUnathenticated<D extends ApplicationErrorInformation['details'],>
    = Error<D> & {
        error?: {
            error: {
                details: Exclude<Exclude<Error<D>['error'], undefined>['error']['details'], UnauthenticatedError>
            }
        }
    };

export type RemoveUnathenticatedError<TFunc extends Lfunc> =
    ApiError<ResponseError<TFunc>> & {
        error?: {
            details: Exclude<Exclude<ApiError<ResponseError<TFunc>>['error'], undefined>['details'], UnauthenticatedError>
        }
    };



const authenticated = "authenticated";










const getProfileRequestOptions: RequestOptions = {
    version: 0
};

export const fetchUser = async () => {
    console.log('fetching user');
    const response = await getProfile(null, getProfileControl, getProfileRequestOptions);
    if (response.success) {
        setSignedIn({
            user: response.body.data,
            error: undefined
        });
    }
    else if (response.isServerError) {
        if (isNotUnathenticatedError(response)) {
            setSignedIn({
                user: null,
                error: {
                    status: response.status,
                    statusText: response.statusText,
                    error: response.error?.error
                }
            });
        }
        
    }
    return response;
};

export const updateProfile = async (user: User):ReturnType<typeof apiUpdateProfile> => {
    const response = await apiUpdateProfile({
        name: user.name,
        email: user.email
    }, updateProfileControl);
    if (response.success) {
        setSignedIn({
            user:user,
            error:undefined
        });
        return { success: true,body:undefined };
    }
    return response;
};

export const signIn: typeof logIn = async (request: LoginRequest) => {
    if (!hasAuthCookie() || !authState.signedIn) {
        const response = await logIn(request);
        if (response.success) {
            setSignedIn({
                user: {
                    ...response.body.data
                },
                error: undefined
            });
        }
        await fetchUser();
        return response;
    }
    else if (authState.user.value) {
        return Promise.resolve({
            success: true,
            isServerError: false,
            body: {
                data: {
                    email: authState.user.value.email,
                    name: authState.user.value.name
                }
            }
        });
    }
    else {
        const fetchUserResponse = await fetchUser();
        if (fetchUserResponse.success || !fetchUserResponse.isServerError || isNotUnathenticatedError(fetchUserResponse)) {
            return fetchUserResponse;
        }
        // fetch user handles unathenticated error for us
        const response = await logIn(request);
        if (response.success) {
            setSignedIn({
                user:response.body.data,
                error:undefined
            });
        }
        return response;
    }
};

export const signOut: typeof logOut = async () => {
    const response = await logOut();
    if (response.success) {
        setSignedOut();
    }
    else {
        const fetchUserResponse = await fetchUser();
        if (!fetchUserResponse.success && fetchUserResponse.isServerError) {
            if (!isNotUnathenticatedError(fetchUserResponse)) {
                return {
                    success: true,
                    body: {
                        data: null
                    }
                };
            }
        }
    }
    return response;
};

const refreshProfile = fetchUser;

const authMethods = {
    signIn,
    signOut,
    updateProfile,
    handleErrorResponse,
    refreshProfile
};

export const useAuthMethods = () => authMethods;
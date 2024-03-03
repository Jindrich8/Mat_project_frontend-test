import { User } from "../../types/composed/user";
import { RemoveUnathenticatedError, authState } from "./auth";
import { getProfile } from "../../api/user/profile/get";
import { useHookstate } from "@hookstate/core";
import { logIn } from "../../utils/auth";

export type AuthContextType =
({
    signedIn:true;
    loading:false;
} & ({
    user:null;
    error:RemoveUnathenticatedError<typeof getProfile>|RemoveUnathenticatedError<typeof logIn>; 
} |{
    user:User;
    error?:RemoveUnathenticatedError<typeof getProfile>|RemoveUnathenticatedError<typeof logIn>; 
}))
| {
    signedIn?:undefined;
    loading:true;
    user?: undefined; 
    error?: undefined; 
} |{
    signedIn:false;
    loading:false;
    user:null;
    error:undefined;
};


export const useAuthContext = () => useHookstate(authState);
import { FC, PropsWithChildren } from "react"
import { useAuthContext } from "./Auth/context";
import { Text } from "@mantine/core";
import { ErrorAlertCmp } from "./ErrorAlertCmp";
import { Link } from "react-router-dom";
import { User } from "../types/composed/user";
import { LoaderCmp } from "./LoaderCmp";

interface Props extends PropsWithChildren {
    allowedRole?: User['role']
}

const AuthProtectionCmp: FC<Props> = ({ children, allowedRole }) => {
    const authState = useAuthContext();
    console.log("Auth state");
    return (authState.loading.value !== true ?
        (
            authState.signedIn.value === true ?
                allowedRole === undefined || authState.user?.value?.role === allowedRole ?
                    <>
                        {children}
                    </>
                    : <ErrorAlertCmp>
                        <Text>You does not have permission to access this page!</Text>
                    </ErrorAlertCmp>
                : <ErrorAlertCmp >
                    <Text>You are not authenticated!</Text>
                    <Text>You need to authenticate yourself to access this page.</Text>
                    <Link to={'/login'}>Sign in</Link>
                </ErrorAlertCmp>
        ) :
        <>
            <LoaderCmp />
        </>)
};

export { AuthProtectionCmp, type Props as AuthProtectionCmpProps };

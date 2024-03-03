import { Box, Button } from "@mantine/core";
import React, { FC } from "react"
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthMethods } from "../components/Auth/auth";
import { useAuthContext } from "../components/Auth/context";

interface Props {

}

const Layout: FC<Props> = () => {
    const { signOut } = useAuthMethods();
    const navigate = useNavigate();
    const onLogOut = React.useCallback(() => {
        signOut();
        navigate('/login');
    },[signOut,navigate]);

    const authState = useAuthContext();

    return (
        <Box h={'100%'}>
            <Box mih={'10vh'} bg={'cyan'} flex={'row'} dir={'row'}>
                {authState.signedIn.value &&
                    <Button style={{ float: 'right' }}
                        onClick={onLogOut}
                    >
                        Log out
                    </Button>
                }
            </Box>
            <Box h={'100%'}>
                <Outlet />
            </Box>
        </Box>
    )
};

export { Layout, type Props as LayoutProps };

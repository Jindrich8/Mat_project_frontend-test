/* eslint-disable @typescript-eslint/no-unused-vars */
import { Avatar, AvatarGroup, Menu, Text } from "@mantine/core";
import React, { FC } from "react"
import { useNavigate } from "react-router-dom";
import { useAuthMethods } from "../Auth/auth";
import { useAuthContext } from "../Auth/context";

interface Props {

}

const UserMenuCmp: FC<Props> = React.memo(() => {

    const { signOut } = useAuthMethods();
    const navigate = useNavigate();
    const auth = useAuthContext();

    const onLogOut = React.useCallback(() => {
        signOut();
        navigate('/login');
    }, [signOut, navigate]);

    const onProfile = React.useCallback(() => {
        navigate('/profile/info');
    }, [navigate]);

    return (
        <Menu
            withArrow
            position="bottom"
            transitionProps={{ transition: 'pop' }}
            withinPortal
        >
            <Menu.Target aria-label="Uživatelské menu">
                <AvatarGroup display={'inline-flex'} style={{flexDirection:'column',alignItems:'center'}}>
                    <Avatar  />
                        {auth.user.value && <Text span size={'xs'}>{auth.user.value?.email}</Text>}
                </AvatarGroup>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Item onClick={onProfile}>
                    Profil
                </Menu.Item>
                <Menu.Item
                    onClick={onLogOut}
                >
                    Odhlásit se
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
});
UserMenuCmp.displayName = "UserMenuCmp";

export { UserMenuCmp, type Props as UserMenuCmpProps };

import { ActionIcon, AppShell, Avatar, Burger, Group, Menu, Stack, Text, UnstyledButton} from "@mantine/core";
import React, { FC } from "react"
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthMethods } from "../components/Auth/auth";
import { useDisclosure } from "@mantine/hooks";
import { useAuthContext } from "../components/Auth/context";

interface Props {

}

const Layout: FC<Props> = () => {
    const { signOut } = useAuthMethods();
    const navigate = useNavigate();
    const [opened, { toggle }] = useDisclosure();
    const auth = useAuthContext();

    const onLogOut = React.useCallback(() => {
        signOut();
        navigate('/login');
    }, [signOut, navigate]);

    const onProfile = React.useCallback(() => {
        navigate('/profile/info');
    },[navigate]);

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{ width: 300, breakpoint: 'sm', collapsed: { desktop: true, mobile: !opened } }}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md">
                    <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                    <Group justify="space-between" style={{ flex: 1 }}>
                        <Group ml="xl" gap={'md'} visibleFrom="sm" w={'100%'}>
                            <UnstyledButton>Home</UnstyledButton>
                            <UnstyledButton>Blog</UnstyledButton>
                            <UnstyledButton>Contacts</UnstyledButton>
                            <UnstyledButton>Support</UnstyledButton>
                            {auth.signedIn.value &&
                    <div style={{marginLeft:'auto'}}><Menu
                        withArrow
                        position="bottom"
                        transitionProps={{ transition: 'pop' }}
                        withinPortal
                    >
                        <Menu.Target>
                            <ActionIcon id={'actionIcon'} variant="default" ml={'auto'}>
                                <Group>
                                <Avatar />
                                {auth.user.value && <Text>{auth.user.value?.email}</Text>}
                                </Group>
                            </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Item onClick={onProfile}>
                                Profile
                            </Menu.Item>
                            <Menu.Item
                                onClick={onLogOut}
                            >
                                Logout
                            </Menu.Item>

                            <Menu.Divider />

                            <Menu.Label>Danger zone</Menu.Label>
                            <Menu.Item
                                color="red"
                            >
                                Delete account
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu></div>}
                        </Group>
                    </Group>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar py="md" px={4}>
                <Stack gap={'md'} ml={'md'}>
                    <UnstyledButton>Home</UnstyledButton>
                    <UnstyledButton>Blog</UnstyledButton>
                    <UnstyledButton>Contacts</UnstyledButton>
                    <UnstyledButton>Support</UnstyledButton>
                   

                </Stack>
            </AppShell.Navbar>

            <AppShell.Main mih={'100vh'} display={'flex'} style={{ flexDirection: 'column' }}>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    );

};

export { Layout, type Props as LayoutProps };

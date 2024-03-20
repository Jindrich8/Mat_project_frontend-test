import { Accordion, AccordionControl, AccordionItem, AccordionPanel, AppShell, Burger, Group, Stack, UnstyledButton } from "@mantine/core";
import { FC } from "react"
import { Outlet, useNavigate } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import { useAuthContext } from "../components/Auth/context";
import { UserMenuCmp } from "../components/UserMenu/UserMenuCmp";
import { BtnLinkCmp } from "../components/BtnLink/BtnLinkCmp";
import { AuthVisibleCmp } from "../components/AuthVisible/AuthVisibleCmp";
import React from "react";
import { useAuthMethods } from "../components/Auth/auth";

interface Props {

}

const Layout: FC<Props> = () => {
    const [opened, { toggle }] = useDisclosure();
    const auth = useAuthContext();
    const { signOut } = useAuthMethods();
    const navigate = useNavigate();

    const onLogOut = React.useCallback(() => {
        signOut();
        navigate('/login');
    }, [signOut, navigate]);

    return (
        <AppShell
        maw={'100vw'}
            header={{ height: 60 }}
            navbar={{ width: 300, breakpoint: 'sm', collapsed: { desktop: true, mobile: !opened } }}
        >
            <AppShell.Header>
                <Group h="100%" px="md">
                    <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                    <Group justify="space-between" style={{ flex: 1 }}>
                        <Group ml="xl" gap={'md'} visibleFrom="sm" w={'100%'}>
                        {!auth.signedIn.value && <BtnLinkCmp to='/login'>Login</BtnLinkCmp>}
                            <BtnLinkCmp to='/'>Tasks</BtnLinkCmp>
                            <AuthVisibleCmp>
                                    {auth.user.value?.role === 'teacher' &&
                                        (<><BtnLinkCmp to='/task/myList'>My tasks</BtnLinkCmp>
                                        <BtnLinkCmp to='/task/create'>Create task</BtnLinkCmp></>
                                        )
                                    }
                                    <BtnLinkCmp to="/task/review/list">Reviews</BtnLinkCmp>
                                    <div style={{ marginLeft: 'auto' }}>
                        <UserMenuCmp />
                    </div>
                            </AuthVisibleCmp>
                        </Group>
                    </Group>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar py="md" px={4}>
                <Stack gap={'md'} ml={'md'}>
                <BtnLinkCmp to='/'>Tasks</BtnLinkCmp>
                <AuthVisibleCmp><Stack>
                    {auth.user.value?.role === 'teacher' &&
                        <BtnLinkCmp to='/task/myList'>My tasks</BtnLinkCmp>
                    }
                    <BtnLinkCmp to="/task/review/list">Reviews</BtnLinkCmp>
                    <Accordion>
                    <AccordionItem value={'profile'}>
                            <AccordionControl fw={'normal'}>Profile</AccordionControl>
                            <AccordionPanel>
                            <Stack>
                                            <BtnLinkCmp to='/profile/info'>Profile</BtnLinkCmp>
                                            <UnstyledButton onClick={onLogOut}>Logout</UnstyledButton>
                                        </Stack>
                            </AccordionPanel>
                            </AccordionItem>
                    </Accordion>
                </Stack></AuthVisibleCmp>
                </Stack>
            </AppShell.Navbar>

            <AppShell.Main mih={'100vh'} display={'flex'} style={{ flexDirection: 'column', paddingBottom:0 }}>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    );

};

export { Layout, type Props as LayoutProps };

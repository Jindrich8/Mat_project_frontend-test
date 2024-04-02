import { AppShell, Burger, Group, Stack, UnstyledButton } from "@mantine/core";
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

const headerStyle ={ height: 60 };

const mainStyle = { flexDirection: 'column', paddingBottom:0 } as const;

const Layout: FC<Props> = () => {
    const [opened, { toggle,close }] = useDisclosure();
    const auth = useAuthContext();
    const { signOut } = useAuthMethods();
    const navigate = useNavigate();

    const closeMobileMenu = React.useCallback<React.MouseEventHandler<HTMLDivElement>>((e) => {
        if (e.target instanceof HTMLAnchorElement) {
            close();
        } 
    },[close]);
    

    const onLogOut = React.useCallback(() => {
        signOut();
        navigate('/login');
    }, [signOut, navigate]);

    const navbarProps = React.useMemo(() =>
    ({
        width: 300,
        breakpoint: 'sm',
        collapsed: { desktop: true, mobile: !opened }
    }),
        [opened]);

    return (
        <AppShell
        maw={'100vw'}
            header={headerStyle}
            navbar={navbarProps}
        >
            <AppShell.Header>
                <Group h="100%" px="md">
                    <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                    <Group justify="space-between" style={{ flex: 1 }}>
                        <Group ml="xl" gap={'md'} visibleFrom="sm" w={'100%'}>
                        {!auth.signedIn.value && <BtnLinkCmp to='/login'>Přihlásit se</BtnLinkCmp>}
                            <BtnLinkCmp to='/'>Úlohy</BtnLinkCmp>
                            <AuthVisibleCmp>
                                    {auth.user.value?.role === 'teacher' &&
                                        (<><BtnLinkCmp to='/task/myList'>Moje úlohy</BtnLinkCmp>
                                        <BtnLinkCmp to='/task/create'>Vytvořit úlohu</BtnLinkCmp></>
                                        )
                                    }
                                    <BtnLinkCmp to="/task/review/list">Vyhodnocení</BtnLinkCmp>
                                    <div style={{ marginLeft: 'auto' }}>
                        <UserMenuCmp />
                    </div>
                            </AuthVisibleCmp>
                        </Group>
                    </Group>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar py="md" px={4}>
                <Stack gap={'md'} ml={'md'} onClick={closeMobileMenu}>
                    {!auth.signedIn.value && <BtnLinkCmp to='/login'>Přihlásit se</BtnLinkCmp>}
                    <BtnLinkCmp to='/'>Úlohy</BtnLinkCmp>
                    <AuthVisibleCmp><Stack>
                        {auth.user.value?.role === 'teacher' &&
                            (<Stack><BtnLinkCmp to='/task/myList'>Moje úlohy</BtnLinkCmp>
                                <BtnLinkCmp to='/task/create'>Vytvořit úlohu</BtnLinkCmp></Stack>
                            )
                        }
                        <BtnLinkCmp to="/task/review/list">Vyhodnocení</BtnLinkCmp>
                        <BtnLinkCmp to='/profile/info'>Profil</BtnLinkCmp>
                        <UnstyledButton onClick={onLogOut}>Odhlásit se</UnstyledButton>
                        
                </Stack></AuthVisibleCmp>
                </Stack>
            </AppShell.Navbar>

            <AppShell.Main mih={'100vh'} display={'flex'} style={mainStyle}>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    );

};

export { Layout, type Props as LayoutProps };

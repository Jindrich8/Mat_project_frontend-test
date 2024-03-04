import { AppShell, Burger, Group, Stack, UnstyledButton } from "@mantine/core";
import React, { FC } from "react"
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthMethods } from "../components/Auth/auth";
import { useDisclosure } from "@mantine/hooks";

interface Props {

}

const Layout: FC<Props> = () => {
    const { signOut } = useAuthMethods();
    const navigate = useNavigate();
    const [opened, { toggle }] = useDisclosure();
    const onLogOut = React.useCallback(() => {
        signOut();
        navigate('/login');
    },[signOut,navigate]);

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
            <Group ml="xl" gap={'md'} visibleFrom="sm">
              <UnstyledButton>Home</UnstyledButton>
              <UnstyledButton>Blog</UnstyledButton>
              <UnstyledButton>Contacts</UnstyledButton>
              <UnstyledButton>Support</UnstyledButton>
              <UnstyledButton onClick={onLogOut}>Log out</UnstyledButton>
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
        <UnstyledButton onClick={onLogOut}>Log out</UnstyledButton>
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main mih={'100vh'}display={'flex'} style={{flexDirection:'column'}}>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );

};

export { Layout, type Props as LayoutProps };

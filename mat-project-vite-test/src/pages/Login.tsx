import { useHookstate } from '@hookstate/core';
import {
    TextInput,
    PasswordInput,
    Paper,
    Title,
    Text,
    Container,
  //  Group,
    Button
} from '@mantine/core';
//import axios from 'axios';
import React, { FC, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuthMethods } from '../components/Auth/auth';
import { LoginErrorDetails } from '../api/dtos/errors/error_response';
import { ApiErrorAlertCmp } from '../components/ApiErrorAlertCmp';
import { ErrorResponseState } from '../types/types';
import { useAuthContext } from '../components/Auth/context';
//import { logIn } from '../utils/auth';

interface Props {
}



const Login: FC<Props> = () => {

    const { signIn } = useAuthMethods();
    const state = useHookstate({
        email: "",
        password: "",
        rememberMe: false,
        validationError: undefined as string | undefined
    });
    const auth =useAuthContext();

    const [formError, setFormError] = useState<LoginErrorDetails | undefined>(undefined);
    const [error, setError] = React.useState<ErrorResponseState<typeof signIn>>();

    const clearError = React.useCallback(() => {
        setError(undefined);
    }, [setError]);
    const clearFormError = React.useCallback(() => {
        setFormError(undefined);
    }, []);


    const navigateTo = useNavigate();

    const submitLogin = React.useCallback<React.FormEventHandler<HTMLFormElement>>(async (e) => {
        e.preventDefault();
        console.log("Login submit\n");
        const email = state.email.get();
        const password = state.password.get();
        const response = await signIn({ email, password });
        if (response.success) {
            navigateTo('/');
        }
        else if (response.isServerError) {
            if (response.error?.error?.details?.code === 1 satisfies LoginErrorDetails['code']) {
                setFormError(response.error.error.details);
            }
            else {
                setError({
                    status: response.status,
                    statusText: response.statusText,
                    error: response.error?.error
                });
            }
        }
        if (!response.success) {
            state.password.set("");
        }
    },[navigateTo, setError, signIn, state.email, state.password]);

    return (auth.signedIn.value ? <Navigate to="/" /> :
        <Container size={420} my={40} >
            <Title ta="center">
                Welcome back!
            </Title>
            <Text c="dimmed" size="sm" ta="center" mt={5}>
                Do not have an account yet?{' \n'}
                <Link to={'/register'} >Create account</Link>
            </Text>
            {error && <ApiErrorAlertCmp
                error={error.error}
                status={error.status}
                statusText={error.statusText}
                onClose={clearError}
            />}
            <Paper
                withBorder
                shadow="md"
                p={30}
                mt={30}
                radius="md"
                component='form'
                onSubmit={submitLogin}
                onChange={clearFormError}>
                <TextInput
                    type={'email'}
                    onChange={(e) => state.email.set(e.target.value)}
                    value={state.email.get()}
                    label="Email"
                    error={formError?.errorData.email?.message}
                    placeholder="your@email.com"
                    mt={'md'}
                    required />
                <PasswordInput
                    label="Password"
                    placeholder="Your password"
                    value={state.password.get()}
                    onChange={(e) => state.password.set(e.target.value)}
                    error={formError?.errorData.password?.message}
                    required mt="md" />
                {/* <Group justify="space-between" mt="lg">
                    <Link to="/forgot-password">
                        Forgot password?
                    </Link>
                </Group> */}
                <Button fullWidth mt="xl" type={'submit'}>
                    Sign in
                </Button>
            </Paper>
        </Container>
    );
}

export { Login, type Props as LoginProps };

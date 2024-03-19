import { useHookstate } from '@hookstate/core';
import {
    TextInput,
    Paper,
    Container,
    Button
} from '@mantine/core';
//import axios from 'axios';
import React, { FC, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { ForgotPasswordErrorDetails } from '../api/dtos/errors/error_response';
import { ApiErrorAlertCmp } from '../components/ApiErrorAlertCmp';
import { ErrorResponseState } from '../types/types';
import { useAuthContext } from '../components/Auth/context';
import { forgotPassword } from '../api/forgotPassword/send';
import { ApiController } from '../types/composed/apiController';
import { SuccessAlertCmp } from '../components/SuccessAlert/SuccessAlertCmp';
//import { logIn } from '../utils/auth';

interface Props {
}


const forgotPasswordControl = new ApiController();
const ForgotPassword: FC<Props> = () => {

    const state = useHookstate({
        email: ""
    });
    const auth =useAuthContext();

    const [success,setSuccess] = React.useState(false as boolean);
    const [formError, setFormError] = useState<ForgotPasswordErrorDetails | undefined>(undefined);
    const [error, setError] = React.useState<ErrorResponseState<typeof forgotPassword>>();

    const clearError = React.useCallback(() => {
        setError(undefined);
    }, [setError]);
    const clearFormError = React.useCallback(() => {
        setFormError(undefined);
    }, []);


    const submitForgotPassword = React.useCallback<React.FormEventHandler<HTMLFormElement>>(async (e) => {
        e.preventDefault();
        console.log("ForgotPassword submit\n");
        const email = state.email.get();
        const response = await forgotPassword({ email },forgotPasswordControl);
        if (response.success) {
            setSuccess(true);
        }
        else if (response.isServerError) {
            setSuccess(false);
            if (response.error?.error?.details?.code === 1 satisfies ForgotPasswordErrorDetails['code']) {
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
    },[setError, state.email]);

    return (auth.signedIn.value ? <Navigate to="/" /> :
        <Container size={420} my={40} >
            {   success && <SuccessAlertCmp>
                Instructions to reset your password were successfully sent to {state.email.value}
            </SuccessAlertCmp>
            }
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
                onSubmit={submitForgotPassword}
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
                <Button fullWidth mt="xl" type={'submit'}>
                    Reset
                </Button>
            </Paper>
        </Container>
    );
}

export { ForgotPassword, type Props as ForgotPasswordProps };

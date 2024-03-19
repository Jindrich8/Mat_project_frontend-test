import { useHookstate } from '@hookstate/core';
import {
    TextInput,
    PasswordInput,
    Paper,
    Title,
    Text,
    Container,
    Button,
    Checkbox,
} from '@mantine/core';
//import axios from 'axios';
import React, { FC, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { register } from '../utils/auth';
import { ApiErrorAlertCmp } from '../components/ApiErrorAlertCmp';
import { ApplicationErrorInformation, RegisterErrorDetails } from '../api/dtos/errors/error_response';
import { dump } from '../utils/utils';
import { fetchUser } from '../components/Auth/auth';
import { useAuthContext } from '../components/Auth/context';

interface Props {
}

const Register: FC<Props> = () => {

    const [error,setError] = useState<{
        status: number,
        statusText: string,
        error?: ApplicationErrorInformation
    } | undefined>(undefined);

    const clearError = React.useCallback(() => {
        setError(undefined);
    },[setError]);

    const [formError,setFormError] = useState<RegisterErrorDetails['errorData']|undefined>(undefined);

    const onChange = React.useCallback(() => setFormError(undefined),[]);
    const auth =useAuthContext();
    
    const state = useHookstate({
        name:"",
        email:"",
        password:"",
        passwordConfirm:"",
        isTeacher:false
    });
 const navigateTo = useNavigate();
 // eslint-disable-next-line @typescript-eslint/no-unused-vars
 const navigate = () => navigateTo('/login');
console.log("refresh");
    const submitLogin:React.FormEventHandler<HTMLFormElement> = async (e)=>{
        e.preventDefault();
        if(state.password.value !== state.passwordConfirm.value){
            setFormError({
                password: {
                    message: 'Passwords do not match'
                }
            });
            state.password.set('');
            state.passwordConfirm.set('');
            return;
        }
       const response = await register({
            name:state.name.get(),
            email:state.email.get(),
            password:state.password.get(),
            password_confirmation:state.passwordConfirm.get(),
            role:state.isTeacher.get() ? 'teacher' : undefined
       });
            console.log("Response: "+dump(response));
            if(response.success){
                fetchUser();
                navigate();
            }
            else if(response.isServerError){
                if(response.error?.error?.details.code === 1){
                    setFormError(response.error.error.details.errorData);
                    console.log(dump(response.error.error.details));
                }
                else{
                setError({
                    status: response.status,
                    statusText: response.statusText,
                    error:response.error?.error
                });
            }
            }
           
            return false;
    };

    return (auth.signedIn.value ? <Navigate to="/" /> :
        <Container size={420} my={40}>
            <Title ta="center">
                Welcome back!
            </Title>
            <Text c="dimmed" size="sm" ta="center" mt={5}>
                ALready have an account?{' \n'}
                <Link to={"/login"}>Sign in</Link>
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
            w={'55vw'}
            miw={'max-content'}
            maw={'25rem'}
            onSubmit={submitLogin}
            onChange={onChange}
            >
            <TextInput 
                type={'name'}
                onChange={(e)=>state.name.set(e.target.value)}
                value={state.name.get()}
                label="Name" 
                placeholder="Your name" 
                mt={'md'}
                error={formError?.name?.message}
                required
                />
                <TextInput 
                type={'email'}
                onChange={(e)=>state.email.set(e.target.value)}
                value={state.email.get()}
                label="Email" 
                mt={'md'}
                placeholder="your@email.com"
                error={formError?.email?.message}
                required
                />
                <PasswordInput 
                label="Password" 
                placeholder="Your password"
                minLength={8}
                value={state.password.get()}
                onChange={(e)=>state.password.set(e.target.value)}
                error={formError?.password?.message}
                required 
                mt="md"
                 />
                    <PasswordInput 
                label="Password confirmation" 
                placeholder="Your password again"
                value={state.passwordConfirm.get()}
                onChange={(e)=>state.passwordConfirm.set(e.target.value)}
                required 
                mt="md" 
                />
                <Checkbox 
                label="Is teacher" 
                mt="md"
                checked={state.isTeacher.value} 
                onChange={(e)=>state.isTeacher.set(e.target.checked)} 
                />
                <Button fullWidth mt="xl" type={'submit'}>
                    Sign up
                </Button>
            </Paper>
        </Container>
    );
}

export { Register, type Props as RegisterProps };

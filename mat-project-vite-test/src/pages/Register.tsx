import { useHookstate } from '@hookstate/core';
import {
    TextInput,
    PasswordInput,
    Paper,
    Title,
    Text,
    Container,
    Button,
} from '@mantine/core';
//import axios from 'axios';
import { FC, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../utils/auth';
import { ApiErrorAlertCmp } from '../components/ApiErrorAlertCmp';
import { ApplicationErrorInformation, RegisterErrorDetails } from '../api/dtos/errors/error_response';

interface Props {
}

const Register: FC<Props> = () => {

    const [error,setError] = useState<{
        status: number,
        statusText: string,
        error?: ApplicationErrorInformation
    } | undefined>(undefined);

    const [formError,setFormError] = useState<RegisterErrorDetails|undefined>(undefined);
    
    const state = useHookstate({
        name:"",
        email:"",
        password:"",
        passwordConfirm:"",
        validationError:undefined
    });
 const navigateTo = useNavigate();
 // eslint-disable-next-line @typescript-eslint/no-unused-vars
 const navigate = () => navigateTo('/login');
console.log("refresh");
    const submitLogin:React.FormEventHandler<HTMLFormElement> = async (e)=>{
       const response = await register(
            state.name.get(),
            state.email.get(),
            state.password.get(),
            state.passwordConfirm.get()
            );
            if(response.success){
                //navigate();
            }
            else if(response.isServerError){
                if(response.error?.error.details.code === 1){
                    setFormError(response.error.error.details);
                }
                else{
                setError({
                    status: response.status,
                    statusText: response.statusText,
                    error:response.error?.error
                });
            }
            }
            e.preventDefault();
            e.stopPropagation();
            return false;
    };

    useEffect(() =>{
        const listener =(e:BeforeUnloadEvent)=>{
            alert("Unloading...");
            if(prompt("Unload[Y/N]?")?.toLowerCase() !== "y"){
                e.preventDefault();
                e.stopImmediatePropagation();
            }
        };
        window.addEventListener("beforeunload",listener);
       return () => {
        window.removeEventListener("beforeunload",listener);
       };
    },[]);

    return (
        <Container>
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
          />}
            <Paper 
            withBorder 
            shadow="md" 
            p={30} 
            mt={30} 
            radius="md" 
            ta={'center'}
            m={'auto'}
            style={{maxWidth:'30rem'}}
            component={'form'}
            onSubmit={submitLogin}
            onChange={() => setFormError(undefined)}
            >
            <TextInput 
                type={'name'}
                onChange={(e)=>state.name.set(e.target.value)}
                value={state.name.get()}
                label="Name" 
                placeholder="Your name" 
                mt={'md'}
                error={formError?.errorData.name?.message}
                required/>
                <TextInput 
                type={'email'}
                onChange={(e)=>state.email.set(e.target.value)}
                value={state.email.get()}
                label="Email" 
                mt={'md'}
                placeholder="your@email.com"
                //error={formError?.errorData.email?.message}
                required/>
                <PasswordInput 
                label="Password" 
                placeholder="Your password"
                minLength={8}
                value={state.password.get()}
                onChange={(e)=>state.password.set(e.target.value)}
                error={formError?.errorData.password?.message}
                required mt="md" />
                    <PasswordInput 
                label="Password confirmation" 
                placeholder="Your password again"
                value={state.passwordConfirm.get()}
                onChange={(e)=>state.passwordConfirm.set(e.target.value)}
                required mt="md" />
                <Button fullWidth mt="xl" type={'submit'}>
                    Sign up
                </Button>
            </Paper>
        </Container>
    );
}

export { Register, type Props as RegisterProps };

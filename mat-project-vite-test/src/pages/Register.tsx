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
import { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../utils/auth';
import { ApiErrorAlertCmp } from '../components/ApiErrorAlertCmp';
import { ApiError } from '../types/composed/apiError';

interface Props {
}

// type LoginState = {
//     email:string,
//     password:string,
//     rememberMe:boolean
// };



const Register: FC<Props> = () => {
    
    const state = useHookstate({
        name:"",
        email:"",
        password:"",
        passwordConfirm:"",
        validationError:undefined as ApiError|undefined
    });
 const navigateTo = useNavigate();
 const navigate = () => navigateTo('/login');

    const submitLogin = async ()=>{
       const error = await register(
            state.name.get(),
            state.email.get(),
            state.password.get(),
            state.passwordConfirm.get()
            );
            if(error){
                state.validationError.set(error);
            }
            else{
                navigate();
            }
    };

    return (
        <Container size={420} my={40}>
            <Title ta="center">
                Welcome back!
            </Title>
            <Text c="dimmed" size="sm" ta="center" mt={5}>
                ALready have an account?{' \n'}
                <Link to={"/login"}>Sign in</Link>
            </Text>
        {state.validationError.value && <ApiErrorAlertCmp error={state.validationError.value} />}
            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            <TextInput 
                type={'name'}
                onChange={(e)=>state.name.set(e.target.value)}
                value={state.name.get()}
                label="Name" 
                placeholder="Your name" 
                required/>
                <TextInput 
                type={'email'}
                pattern={'email'}
                onChange={(e)=>state.email.set(e.target.value)}
                value={state.email.get()}
                label="Email" 
                placeholder="your@email.com" 
                required/>
                <PasswordInput 
                label="Password" 
                placeholder="Your password"
                value={state.password.get()}
                onChange={(e)=>state.password.set(e.target.value)}
                required mt="md" />
                    <PasswordInput 
                label="Password confirmation" 
                placeholder="Your password again"
                value={state.passwordConfirm.get()}
                onChange={(e)=>state.passwordConfirm.set(e.target.value)}
                required mt="md" />
                <Button fullWidth mt="xl" onClick={submitLogin}>
                    Sign up
                </Button>
            </Paper>
        </Container>
    );
}

export { Register, type Props as RegisterProps };

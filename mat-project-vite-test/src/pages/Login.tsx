import { useHookstate } from '@hookstate/core';
import {
    TextInput,
    PasswordInput,
    Checkbox,
    Anchor,
    Paper,
    Title,
    Text,
    Container,
    Group,
    Button,
} from '@mantine/core';
//import axios from 'axios';
import { FC, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ErrorAlertCmp } from '../components/ErrorAlertCmp';
import { logIn } from '../utils/auth';
//import { logIn } from '../utils/auth';

interface Props {
}

// type LoginState = {
//     email:string,
//     password:string,
//     rememberMe:boolean
// };



const Login: FC<Props> = () => {
    
    //const { signIn } = useSanctum();
    const signIn = logIn;
    const state = useHookstate({
        email:"",
        password:"",
        rememberMe:false,
        validationError:undefined as string | undefined
    });

    
   const navigateTo = useNavigate();

   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   const navigate = () => navigateTo('/');

    const submitLogin:React.FormEventHandler<HTMLFormElement> = async (e)=>{
        e.preventDefault();
        console.log("Login submit\n");
        const email = state.email.get();
        const password = state.password.get();
        const signedIn = await signIn(email,password/*,rememberMe*/);
        if(signedIn){
            //navigate();
        }
        else{
            state.validationError.set("Incorrect email or password!");
        }
        e.preventDefault();
        e.stopPropagation();
        return false;
    }

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
        <Container size={420} my={40}>
            <Title ta="center">
                Welcome back!
            </Title>
            <Text c="dimmed" size="sm" ta="center" mt={5}>
                Do not have an account yet?{' \n'}
                <Link to={'/register'} >Create account</Link>
            </Text>
           {
           state.validationError.get() && 
           <ErrorAlertCmp>{state.validationError.get()}</ErrorAlertCmp>
           }
            <Paper withBorder shadow="md" p={30} mt={30} radius="md" component='form' onSubmit={submitLogin}>
                <TextInput 
                type={'email'}
                onChange={(e)=>state.email.set(e.target.value)}
                value={state.email.get()}
                label="Email" 
                placeholder="your@email.com" 
                mt={'md'}
                required/>
                <PasswordInput 
                label="Password" 
                placeholder="Your password"
                value={state.password.get()}
                onChange={(e)=>state.password.set(e.target.value)}
                required mt="md" />
                <Group justify="space-between" mt="lg">
                    <Checkbox 
                    checked={state.rememberMe.get()}
                    onChange={(e)=>state.rememberMe.set(e.target.checked)}
                    label="Remember me" />
                    <Anchor component="button" size="sm">
                        Forgot password?
                    </Anchor>
                </Group>
                <Button fullWidth mt="xl" type={'submit'}>
                    Sign in
                </Button>
            </Paper>
        </Container>
    );
}

export { Login, type Props as LoginProps };

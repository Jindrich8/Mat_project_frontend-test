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
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { logIn } from '../utils/auth';

interface Props {
}

// type LoginState = {
//     email:string,
//     password:string,
//     rememberMe:boolean
// };



const Login: FC<Props> = () => {
    
    const state = useHookstate<{email?:string,password?:string,rememberMe:boolean}>({
        email:"",
        password:"",
        rememberMe:false,
    });
   // const navigate = useNavigate();

    const submitLogin = async ()=>{
        console.log("Login submit\n");
        const email = state.email.get();
        const password = state.password.get();
        if(email && password){
       logIn(email,password);
        }
    }

    return (
        <Container size={420} my={40}>
            <Title ta="center">
                Welcome back!
            </Title>
            <Text c="dimmed" size="sm" ta="center" mt={5}>
                Do not have an account yet?{' \n'}
                <Link to={'/register'} >Create account</Link>
            </Text>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
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
                <Group justify="space-between" mt="lg">
                    <Checkbox 
                    checked={state.rememberMe.get()}
                    onChange={(e)=>state.rememberMe.set(e.target.checked)}
                    label="Remember me" />
                    <Anchor component="button" size="sm">
                        Forgot password?
                    </Anchor>
                </Group>
                <Button fullWidth mt="xl" onClick={submitLogin}>
                    Sign in
                </Button>
            </Paper>
        </Container>
    );
}

export { Login, type Props as LoginProps };

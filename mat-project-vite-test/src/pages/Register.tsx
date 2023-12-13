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
import { Link } from 'react-router-dom';
import { register } from '../utils/auth';

interface Props {
}

// type LoginState = {
//     email:string,
//     password:string,
//     rememberMe:boolean
// };



const Register: FC<Props> = () => {
    
    const state = useHookstate<{name:string,email:string,password:string}>({
        name:"",
        email:"",
        password:""
    });
 //   const navigate = useNavigate();

    const submitLogin = async ()=>{
        register(
            state.name.get(),
            state.email.get(),
            state.password.get()
            );
    }

    return (
        <Container size={420} my={40}>
            <Title ta="center">
                Welcome back!
            </Title>
            <Text c="dimmed" size="sm" ta="center" mt={5}>
                ALready have an account?{' \n'}
                <Link to={"/login"}>Sign in</Link>
            </Text>

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
                <Button fullWidth mt="xl" onClick={submitLogin}>
                    Sign up
                </Button>
            </Paper>
        </Container>
    );
}

export { Register, type Props as RegisterProps };

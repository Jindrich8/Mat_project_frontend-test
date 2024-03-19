import { useHookstate } from "@hookstate/core";
import { Alert, Button, PasswordInput } from "@mantine/core";
import React, { FC } from "react"
import { ResetPasswordErrorDetails } from "../api/dtos/errors/error_response";
import { ApiError, ResponseError } from "../types/errors/types";
import { ApiController } from "../types/composed/apiController";
import { resetPassword } from "../api/resetPassword/send";
import { ApiErrorAlertCmp } from "../components/ApiErrorAlertCmp";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

interface Props {

}

const resetPasswordControl = new ApiController();
const ResetPassword:FC<Props> = () => {
    const {token} = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();


    const state = useHookstate({
        password:'',
        confirmation_password:'',
    });


    const [alert,setAlert] = React.useState<undefined|{
        type:'formError',
        formError: ResetPasswordErrorDetails['errorData']
    }|{
        type:'error',
        error:ApiError<ResponseError<typeof resetPassword>>,
        formError?:undefined
    }|{
        type:'success',
        success:string,
        formError?:undefined
    }>(undefined);

    const clearAlert = React.useCallback(() => {
        setAlert(undefined)
    },[setAlert]);

    const onFormSubmit = React.useCallback<React.FormEventHandler<HTMLFormElement>>(async (e) => {
        e.preventDefault();

        let passwordError = undefined;
        if(state.password.value !== state.confirmation_password.value){
            passwordError = 'The password field confirmation does not match.';
        }
        if(passwordError){
            setAlert({
                type:'formError',
                formError:{
                    password:{
                        message:passwordError
                    }
                }
            });
            return;
        }
        const response = await resetPassword({
            token: token ?? '',
            email:searchParams.get('email') ?? '',
            password:state.password.value,
            password_confirmation:state.confirmation_password.value
        },resetPasswordControl);
        if(response.success){
            navigate("/login");
        }
        else if(response.isServerError){
            console.log("error");
            if(response.error?.error?.details?.code === 1 satisfies  ResetPasswordErrorDetails['code']){
                console.log("set formError");
                setAlert({
                    type:'formError',
                    formError:response.error.error.details.errorData
                });
            }
            else{
                console.log("set alert error");
                setAlert({
                    type:'error',
                    error:{
                        status:response.status,
                        statusText:response.statusText,
                        error:response.error?.error
                    }
                });
            }
        }
    
    },[navigate, searchParams, state.confirmation_password.value, state.password.value, token]);

  return (
    <>
        {
    alert 
    && alert?.type !== 'formError' 
    && (alert?.type === 'error' ? <ApiErrorAlertCmp 
    error={alert.error?.error}
    status={alert.error.status} 
    statusText={alert.error.statusText} 
    onClose={clearAlert}
     />
     : <Alert>
        {alert.success}
     </Alert>)
    }
          <form onSubmit={onFormSubmit} onChange={clearAlert}>
              <PasswordInput
                  type={'password'}
                  onChange={(e) => state.password.set(e.target.value)}
                  value={state.password.get()}
                  label="New password"
                  mt={'md'}
                 // error={alert?.formError?.password?.message}
                  required
              />
               <PasswordInput
                  type={'password'}
                  onChange={(e) => state.confirmation_password.set(e.target.value)}
                  value={state.confirmation_password.get()}
                  label="Confirm new password"
                  mt={'md'}
                  required
              />
              <Button mt={'lg'} type="submit">Submit</Button>
              
          </form>
    </>
  )
};

export { ResetPassword, type Props as ResetPasswordProps };

import { useHookstate } from "@hookstate/core";
import { Alert, Button, PasswordInput } from "@mantine/core";
import React, { FC } from "react"
import { UserPasswordErrorDetails } from "../api/dtos/errors/error_response";
import { ApiError, ResponseError } from "../types/errors/types";
import { ApiErrorAlertCmp } from "./ApiErrorAlertCmp";
import { createAuthApiController } from "./Auth/auth";
import { updatePassword } from "../api/user/password/send";

interface Props {

}

const updatePasswordControl = createAuthApiController();
const UpdatePasswordFormCmp:FC<Props> = () => {

    const state = useHookstate({
        current_password:'',
        password:'',
        confirmation_password:'',
    });


    const [alert,setAlert] = React.useState<undefined|{
        type:'formError',
        formError: UserPasswordErrorDetails['errorData']
    }|{
        type:'error',
        error:ApiError<ResponseError<typeof updatePassword>>,
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
        if(state.password.value === state.current_password.value){
            passwordError = "New password must be different than the current one.";
        }
        else if(state.password.value !== state.confirmation_password.value){
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
        const response = await updatePassword({
            current_password:state.current_password.value,
            password:state.password.value,
            password_confirmation:state.confirmation_password.value
        },updatePasswordControl);
        if(response.success){
            setAlert({
                type: 'success',
                success:'Password was updated successfully.'
            });
        }
        else if(response.isServerError){
            console.log("error");
            if(response.error?.error?.details?.code === 1 satisfies  UserPasswordErrorDetails['code']){
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
    
    },[state.confirmation_password.value, state.current_password.value, state.password.value]);

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
                  onChange={(e) => state.current_password.set(e.target.value)}
                  value={state.current_password.get()}
                  label="Current password"
                  mt={'md'}
                  error={alert?.formError?.current_password?.message}
                  required
              />
              <PasswordInput
                  type={'password'}
                  onChange={(e) => state.password.set(e.target.value)}
                  value={state.password.get()}
                  label="New password"
                  mt={'md'}
                  error={alert?.formError?.password?.message}
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

export { UpdatePasswordFormCmp, type Props as UpdatePasswordFormCmpProps };
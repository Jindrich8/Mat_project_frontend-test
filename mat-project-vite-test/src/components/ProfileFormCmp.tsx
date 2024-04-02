import { useHookstate } from "@hookstate/core";
import { Alert, Button, Stack, TextInput } from "@mantine/core";
import React, { FC, useEffect } from "react";
import { ApiError, ResponseError } from "../types/errors/types";
import { ApiErrorAlertCmp } from "./ApiErrorAlertCmp";
import { useAuthMethods } from "./Auth/auth";
import { useAuthContext } from "./Auth/context";
import { UserProfileInformationErrorDetails, UserProfileInformationErrorDetailsErrorData } from "../api/dtos/errors/error_response";

interface Props {

}

const ProfileFormCmp:FC<Props> = () => {
    const {updateProfile,refreshProfile} = useAuthMethods();
    const auth = useAuthContext();
    
    const state = useHookstate({
        name:auth.user.value?.name,
        email:auth.user.value?.email,
        isEditing:false as boolean
    });

    useEffect(() =>{
        refreshProfile();
    },[refreshProfile]);


    const [alert,setAlert] = React.useState<undefined|{
        type:'formError',
        formError:UserProfileInformationErrorDetailsErrorData
    }|{
        type:'error',
        error:ApiError<ResponseError<typeof updateProfile>>,
        formError?:undefined
    }|{
        type:'success',
        success:string,
        formError?:undefined
    }>(undefined);

    const toggleIsEditing = React.useCallback(() =>{
        state.set(prev => {
            if(prev.isEditing){
                return {
                    name:auth.user.value?.name,
                    email:auth.user.value?.email,
                    isEditing:false
                };
            }
            else{
                return {
                    name:prev.name,
                    email:prev.email,
                    isEditing:true
                };
            }
        })
    },[auth.user.value?.email, auth.user.value?.name, state]);

    const clearAlert = React.useCallback(() => {
        setAlert(undefined)
    },[setAlert]);

    const onFormSubmit = React.useCallback<React.FormEventHandler<HTMLFormElement>>(async (e) => {
        e.preventDefault();
        if(state.name.value && state.email.value){
        const response = await updateProfile({
            name:state.name.value,
            email:state.email.value
        });
        if(response.success){
            setAlert({
                type: 'success',
                success:'Profil byl úspěšně upraven.'
            });
        }
        else if(response.isServerError){
            console.log("error");
            if(response.error?.error?.details?.code === 1 satisfies UserProfileInformationErrorDetails['code']){
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
    }
    },[state.email.value, state.name.value, updateProfile]);

  return (
    <Stack justify={'flex-start'}>
    <Button ml={'auto'} onClick={toggleIsEditing}>{!state.isEditing.value ? 'Upravit' : 'Zobrazit'}</Button>
    {
    alert 
    && alert?.type !== 'formError' 
    && (alert?.type === 'error' ? <ApiErrorAlertCmp 
    error={alert.error?.error}
    status={alert.error.status} 
    statusText={alert.error.statusText} 
    onClose={clearAlert}
     />
     : <Alert withCloseButton onClose={clearAlert}>
        {alert.success}
     </Alert>)
    }
          <form onSubmit={onFormSubmit} onChange={clearAlert}>
              <TextInput
                  type={'name'}
                  onChange={(e) => state.name.set(e.target.value)}
                  value={state.name.get()}
                  label="Jméno"
                  placeholder="Vaše jméno"
                  mt={'md'}
                  error={alert?.formError?.name?.message}
                  readOnly={!state.isEditing.value}
                  required
              />
              <TextInput
                  type={'email'}
                  onChange={(e) => state.email.set(e.target.value)}
                  value={state.email.get()}
                  label="Email"
                  mt={'md'}
                  placeholder="Váš@email.cz"
                  error={alert?.formError?.email?.message}
                  readOnly={!state.isEditing.value}
                  required
              />
              {state.isEditing.value && <Button mt={'lg'} type="submit">Odeslat</Button>}
              
          </form>
    </Stack>
  )
};

export { ProfileFormCmp, type Props as ProfileFormCmpProps };

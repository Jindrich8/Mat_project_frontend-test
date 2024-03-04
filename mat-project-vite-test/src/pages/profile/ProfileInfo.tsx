import { useHookstate } from "@hookstate/core";
import { Alert, Button, Text, TextInput } from "@mantine/core";
import React, { FC } from "react"
import { useAuthContext } from "../../components/Auth/context";
import { useAuthMethods } from "../../components/Auth/auth";
import { UserProfileInformationErrorDetails } from "../../api/dtos/errors/error_response";
import { ApiErrorAlertCmp } from "../../components/ApiErrorAlertCmp";
import { ApiError, ResponseError } from "../../types/errors/types";
import { dump } from "../../utils/utils";

interface Props {

}

const ProfileInfo:FC<Props> = () => {
    const {updateProfile} = useAuthMethods();
    const auth = useAuthContext();

    const [isEditing,setIsEditing] = React.useState(false as boolean);
    
    const state = useHookstate({
        name:auth.user.value?.name,
        email:auth.user.value?.email
    });


    const [alert,setAlert] = React.useState<undefined|{
        type:'formError',
        formError:UserProfileInformationErrorDetails['errorData']
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
        setIsEditing(prev => !prev);
    },[]);

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
                success:'Profile was updated successfully.'
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
    <>
    <Button ml={'auto'} onClick={toggleIsEditing}>{!isEditing ? 'Edit' : 'View'}</Button>
    <Text>Alert {alert && dump(alert)}</Text>
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
              <TextInput
                  type={'name'}
                  onChange={(e) => state.name.set(e.target.value)}
                  value={state.name.get()}
                  label="Name"
                  placeholder="Your name"
                  mt={'md'}
                  error={alert?.formError?.name?.message}
                  readOnly={!isEditing}
                  required
              />
              <TextInput
                  type={'email'}
                  onChange={(e) => state.email.set(e.target.value)}
                  value={state.email.get()}
                  label="Email"
                  mt={'md'}
                  placeholder="your@email.com"
                  error={alert?.formError?.email?.message}
                  readOnly={!isEditing}
                  required
              />
              {isEditing && <Button type="submit">Submit</Button>}
              
          </form>
    </>
  )
};

export { ProfileInfo, type Props as ProfileInfoProps };

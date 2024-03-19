import React, { FC } from "react"
import { UpdateTaskPageCmp, UpdateTaskPageCmpProps } from "../../components/UpdateTaskPage/UpdateTaskPageCmp";
import { getTaskSource } from "../../api/task/source/get";
import { createAuthApiController } from "../../components/Auth/auth";
import { getMyTaskDetail } from "../../api/task/myDetail/get";
import { useNavigate, useParams } from "react-router-dom";
import { updateTask } from "../../api/task/update/send";
import { TaskUpdateErrorDetails } from "../../api/dtos/errors/error_response";

interface Props {

}

const getTaskSourceControl = createAuthApiController();
const getMyTaskDetailControl = createAuthApiController();
const updateTaskControl = createAuthApiController();

const Update:FC<Props> = () => {
    const {taskId} = useParams();
    const navigate = useNavigate();

    const getInitialFilters = React.useCallback<NonNullable<UpdateTaskPageCmpProps['getInitialFilters']>>(async()=>{
        const response = await getMyTaskDetail(taskId + '',getMyTaskDetailControl);
        if(response.success){
            const data =response.body.data.task;
            return {
                success: true,
                value: {
                    name: data.name,
                    difficulty: data.difficulty.orderedId,
                    classRange: {
                        min:data.class_range.min.orderedId,
                        max:data.class_range.max.orderedId
                    },
                    isPublic: data.is_public,
                    orientation: data.orientation,
                    tags:data.tags.map(tag => tag.id)
                }
            };
        }
        else if(response.isServerError){
            return {
                success:false,
                value:{
                    status:response.status,
                    statusText:response.statusText,
                    error:response.error?.error
                }
            };
        }
    },[taskId]);


    const getInitialSource = React.useCallback<NonNullable<UpdateTaskPageCmpProps['getInitialSource']>>(async() => {
       const response = await getTaskSource(null,taskId + '',getTaskSourceControl);
       if(response.success){
        return {
            success: true,
            value:response.body.data.source
        };
       }
       if(response.isServerError){
        return {
            success: false,
            value:{
                status:response.status,
                statusText:response.statusText,
                error:response.error?.error
            }
        };
       }
       return undefined;
    },[taskId]);

    const action = React.useCallback<NonNullable<UpdateTaskPageCmpProps['action']>>(async({
        name,
        difficulty,
        source,
        sourceChanged,
        tags,
        isPublic,
        classRange
    }) => {
       const response = await updateTask({
            task:{
                name:name,
                difficulty:difficulty,
                source:sourceChanged ? source : undefined,
                tags:tags as [string,...string[]],
                is_public:isPublic,
                class_range:classRange
            }
        },
        taskId + '',
        updateTaskControl
        );
        if(response.success){
            navigate("/task/myList");
        }
        else if(response.isServerError){
            if(response.error?.error?.details?.code === 1 satisfies TaskUpdateErrorDetails['code']){
                const formError = response.error.error.details.errorData;
                const classRangeError = {
                    error:undefined as (string|undefined),
                    minError:undefined as (string|undefined),
                    maxError:undefined as (string|undefined)
                };
                const apiClassRangeError = formError.class_range?.error;
                if(apiClassRangeError){
                if(apiClassRangeError === 'min_max_swapped'){
                    classRangeError.error = "Min should be less than or equal to max.";
                }
                else{
                    if(apiClassRangeError?.invalidMin){
                        classRangeError.minError = "Invalid class selected.";
                    }
                    if(apiClassRangeError?.invalidMax){
                        classRangeError.maxError = "Invalid class selected.";
                    }
                }
            }
                return {
                    generalError:false,
                    value:{
                        isFormError:true,
                        error:{
                            name:formError.name?.message,
                            tags:formError.tags?.message,
                            difficulty:formError.difficulty?.message,
                            classRange:classRangeError
                        }
                    }
                };
            }
            return {
                generalError:false,
                value:{
                    isFormError:false,
                    error:{
                    status:response.status,
                    statusText:response.statusText,
                    error:response.error?.error
                    }
                }
            };
        }
        return undefined;
    },[taskId]);

  return (
    <>
           <UpdateTaskPageCmp
        getInitialSource={getInitialSource}
        getInitialFilters={getInitialFilters}
        actionLabel={'Update'}
        action={action}
         />
    </>
  )
};

export { Update, type Props as UpdateProps };

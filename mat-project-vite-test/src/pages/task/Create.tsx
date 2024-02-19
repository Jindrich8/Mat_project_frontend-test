import React, { FC, useEffect, useState } from "react"
import { SearchableMultiSelect, SearchableMultiSelectProps } from "../../components/SearchableMultiSelect";
import { Editor} from "@monaco-editor/react";
import {  Box, Button,  Group,  Stack,  Text } from "@mantine/core";
import { createTask } from "../../api/task/create/create";
import { useHookstate } from "@hookstate/core";
import { csrf } from "../../utils/auth";
import { getAllTags } from "../../api/tags/get/get";
import { ApplicationErrorResponse } from "../../api/dtos/errors/error_response";

interface Props{

}

const Create:FC<Props> = () => {
   // const editor = useMonaco();
    console.log("Rerendering Create");
    const editorValue = React.useRef<string|undefined>();
    const taskErrors = useHookstate<({
        status:number,
        statusText:string,
        error:ApplicationErrorResponse
    }|{
        message:string,
        description?:string
    })[]>([]);
    const [taskTags,setTaskTags] = useState<SearchableMultiSelectProps['options']|undefined>(undefined);

    useEffect(() =>{
       const fetchTags = async () =>{
            const response = await getAllTags();
            if(response.success){
              setTaskTags(response.body.tags.map(tag => ({
                label:tag.name,
                value:tag.id.toString()
              })));
            }
            else{
               taskErrors.merge([
                {
                    error:response.error,
                    status:response.status,
                    statusText:response.statusText
                }
            ]);
            }
        };
        if(!taskTags){
          fetchTags();
        }
    },[taskErrors,taskTags]);

  return (
    <Stack style={{height:'100%'}}>
     <Button style={{maxWidth:'fit-content',minWidth:'fit-content',minHeight:'2.5rem',alignSelf:'flex-end',margin:'1rem'}} onClick={async ()=>{
        if(!editorValue.current){
            taskErrors.merge([{
                message:"Task source cannot be empty.",
                description:"To be able to create task, you need to write it's source first!"
            }]);
        }
        else if(!taskTags || taskTags.length < 1){
            taskErrors.merge([{
                message:"Task tags cannot be empty.",
                description:"Task needs to have at least one tag."
            }]);
        }
        else{
            if(prompt("REQUEST CSRF TOKEN?")?.toLowerCase() === "true"){
            csrf();
            return;
            }
               const response = await createTask({
                    task:{
                        tags:taskTags.map(tag => Number.parseInt(tag.value)),
                        source:editorValue.current
                    }
                });
                if(!response.success){
                    taskErrors.merge([
                        {
                            error:response.error,
                            status:response.status,
                            statusText:response.statusText
                        }
                    ]);
                }
                else{
                    alert(`Task successfully created - id: ${response.body.taskId}`);
                }
            }
            }}>
        
                Create
            </Button>
            <Group justify={'center'}>
          <SearchableMultiSelect
          options={taskTags ?? []}
          placeholder={'Tags'}
          />
          </Group>
          <Box style={{flexGrow:1}}>
      <Editor height={'100%'}   language={'xml'} onChange={(value)=>{
        editorValue.current = value;
      }} />
      </Box>
      {taskErrors.map((error,i)=>{
        // TODO: replace in with Object.hasOwn with type narrowing
        const errorValue = JSON.stringify(error.value);
     return <Text key={i} variant={'text'}>{errorValue}</Text>
      })}
      </Stack>
  )
};

export { Create, type Props as CreateProps };

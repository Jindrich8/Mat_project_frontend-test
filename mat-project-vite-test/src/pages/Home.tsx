import React, { FC, useEffect } from "react"
import { IntHelper } from "../types/primitives/Integer";
import { ExerciseCmp } from "../showTask/Exercise/ExerciseCmp";
import { ExerciseApi } from "../showTask/ExerciseBase";
import { Task,toTask } from "../showTask/Task";
import { DoplnovackaCmpProps } from "../showTask/Doplnovacka/DoplnovackaCmp";
import { Box, Button, Loader, Title } from "@mantine/core";
import { HledaniChybCmpProps } from "../showTask/HledaniChyb/HledaniChybCmp";
import taskStyles from "./TaskStyle.module.css"

type Props = {
data:string[],
};

//const emptyExerciseApi:ExerciseApi = {getFilledDataForServer:() => undefined};

const Home:FC<Props> = () => {

  const [task,setTask] = React.useState<Task|undefined>(undefined);
  const refApis = React.useRef<ExerciseApi[]>([]);

  useEffect(() => {
    setTimeout(() => {
    setTask( toTask({
      name:'Task',
      id:IntHelper.toInt(589),
      exercises: [
        {
          type:'Doplnovacka',
          instructions:{
            instructions:'Doplň hodnoty'
          },
          content: [
            'Hledal',
            {
            type: 'cmb',
            values:['i','y']
          },
          ' jsme to ',
          {
            type:'cmb',
            values:['mě','mně']
          },
          'sto strašně dlouho. Věděl ',{
            type: 'txtInput',
          },
          ' to?'
          
        ] as DoplnovackaCmpProps['data']
        },
        {
          type:'HledaniChyb',
          instructions:{
            instructions:'Doplň hodnoty'
          },
          content: `Kone skakly pres prekázesky.\n`+
          `Rybá oči sou dobrý, co romýšláš?\n`+
          `Pudeš se dnes kůkat na velků Pardubicků?` as HledaniChybCmpProps['data']
        }
      ]

    }));
  },1000);
  },[]);

    
  return (<Box style={{width:'100%'}}>
    {!task ? (<Loader />):
    (<Box style={{width:'100%'}}>
      <Title>{task?.name}</Title>
    <Box className={taskStyles.exercisesContainer}>
        {task.exercises.map((ex,i) => {
          const num = IntHelper.shouldBeInt(i,'index');
          if(!refApis.current[i]?.getFilledDataForServer){
            refApis.current[i] = {getFilledDataForServer:() => undefined};
          }
          const apiRef = refApis.current[i];
          return (<ExerciseCmp 
            num={num} 
            key={num}
            instructions={ex.instructions} 
            content={ex.content} 
            apiRef={apiRef} />);
        })}
        </Box>
        <Button className={taskStyles.submitBtn} onClick={() => {
          const arr = refApis.current.map(d => d?.getFilledDataForServer());
          console.log(`${JSON.stringify(arr,null,2)}`);
        }}>Submit</Button>
        </Box>)}</Box>);
};

export { Home, type Props as HomeProps };

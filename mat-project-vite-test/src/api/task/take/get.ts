/* eslint-disable @typescript-eslint/no-unused-vars */
import { apiGet } from "../../../utils/api";
import { ApplicationErrorResponse } from "../../dtos/errors/error_response";
import { TaskTakeErrorResponseDetails } from "../../dtos/task/take/error";
import { TakeTaskRequest } from "../../dtos/task/take/request";
import { TakeTaskResponse } from "../../dtos/task/take/response";


type ExType = string;

enum OutTaskEntryType{
    Group = 'group',
    Exercise = 'exercise'
}

enum OutShowTaskDisplay{
    Horizontal = 'horizontal',
    Vertical = 'vertical',
}


type ResourceText = string;

type InstructionText = string;

interface InShowTask {
    id:string;
}

interface OutTask{
    name:string;
    description:string;
    display:OutShowTaskDisplay,
    id:string;
    entries:(OutGroup|OutExercise)[];
}

interface OutExerInstr{
content:InstructionText;
}

interface OutExercise{
    type:OutTaskEntryType.Exercise
    exerType:ExType;
    instructions:OutExerInstr
    content:unknown;
}

interface OutGroup{
    type:'group',
    resources:OutResource[],
    entries:Array<OutGroup|OutExercise>
}

interface OutResource{
    content:ResourceText;
}
const exampleBase:TakeTaskResponse['task'] = {
    name:'Task',
    description:'Task description',
    display:'horizontal',
    entries: [
      {
        type:'exercise',
        instructions:{
          content:'Doplň hodnoty'
        },
        details:{
          exerType:'FillInBlanks',
          content:[
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
            type: 'txtI',
          },
          ' to?'
        ],
      }
        },
      {
        type:'exercise',
        instructions:{
          content:'Doplň hodnoty'
        },
        details:{
          exerType:'FixErrors',
          content:{
            defaultText: `Kone skakly pres prekázesky.\n`+
          `Rybá oči sou dobrý, co romýšláš?\n`+
          `Pudeš se dnes kůkat na velků Pardubicků?`}
        },
        },
      {
        type:'group',
        resources:[{
            content:`Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`
        },{
            content:`Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`
        }],
        entries:[  
          {
            type:'exercise',
            instructions:{
              content:'Doplň hodnoty'
            },
            details:{
              exerType:'FillInBlanks',
              content:[
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
                type: 'txtI',
              },
              ' to?'
            ],
          }
            },
            {
              type:'exercise',
              instructions:{
                content:'Doplň hodnoty'
              },
              details:{
                exerType:'FixErrors',
                content:{
                  defaultText: `Kone skakly pres prekázesky.\n`+
                `Rybá oči sou dobrý, co romýšláš?\n`+
                `Pudeš se dnes kůkat na velků Pardubicků?`}
              },
              }
    ]
}
  
  
    ]
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FakeData:Record<string,TakeTaskResponse> = {
['1']:{task:{...exampleBase,display:'vertical'}} as {task:typeof exampleBase&{display:'vertical'}},
['2']:{task:{...exampleBase,display:'horizontal'}} as {task:typeof exampleBase&{display:'horizontal'}},
}

const takeTask = async(request: TakeTaskRequest,id:string) =>{
  const response = await apiGet<
  TakeTaskRequest,
  TakeTaskResponse,
  TaskTakeErrorResponseDetails
  >
  (`/api/task/${id}/take`,request);
  return response;
}

export type{
    OutExercise as OutShowExercise,
    OutResource as OutShowResource,
    OutGroup as OutShowGroup,
    OutExercise as ExerciseResponse, 
    OutTask as TaskResponse, 
    InShowTask as TaskRequest,
    OutExerInstr as ExInstrResp};

    export { takeTask, OutTaskEntryType as OutShowTaskEntryType,OutShowTaskDisplay as OutShowTaskDisplay};
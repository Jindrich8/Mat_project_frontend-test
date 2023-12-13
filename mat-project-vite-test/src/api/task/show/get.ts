

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
const exampleBase:Omit<OutTask,'id'|'display'> = {
    name:'Task',
    description:'Task description',
    entries: [
      {
        type:OutTaskEntryType.Exercise,
        exerType:'Doplnovacka',
        instructions:{
          content:'Doplň hodnoty'
        },
        content:{
          uiData: [
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
        
      ],
    }
      },
      {
        type:OutTaskEntryType.Exercise,
        exerType:'HledaniChyb',
        instructions:{
          content:'Doplň hodnoty'
        },
        content:{data: `Kone skakly pres prekázesky.\n`+
        `Rybá oči sou dobrý, co romýšláš?\n`+
        `Pudeš se dnes kůkat na velků Pardubicků?`}
      },
      {
        type:OutTaskEntryType.Group,
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
            type:OutTaskEntryType.Exercise,
            exerType:'Doplnovacka',
            instructions:{
              content:'Doplň hodnoty'
            },
            content:{
              uiData: [
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
            
          ],
        }
          },
          {
            type:OutTaskEntryType.Exercise,
            exerType:'HledaniChyb',
            instructions:{
              content:'Doplň hodnoty'
            },
            content:{data: `Kone skakly pres prekázesky.\n`+
            `Rybá oči sou dobrý, co romýšláš?\n`+
            `Pudeš se dnes kůkat na velků Pardubicků?`}
          },
          {
            type:OutTaskEntryType.Group,
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
            entries:[  {
                type:OutTaskEntryType.Exercise,
                exerType:'Doplnovacka',
                instructions:{
                  content:'Doplň hodnoty'
                },
                content:{
                  uiData: [
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
                ' to?',
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
                
              ],
              filledData:[0,null,'ulozene jsi']
            }
              },
        ]

      },
      {
        type:OutTaskEntryType.Exercise,
        exerType:'Doplnovacka',
        instructions:{
          content:'Doplň hodnoty'
        },
        content:{
          uiData: [
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
        
      ],
    }
      },
      {
        type:OutTaskEntryType.Exercise,
        exerType:'HledaniChyb',
        instructions:{
          content:'Doplň hodnoty'
        },
        content:{data: `Kone skakly pres prekázesky.\n`+
        `Rybá oči sou dobrý, co romýšláš?\n`+
        `Pudeš se dnes kůkat na velků Pardubicků?`}
      },
      {
        type:OutTaskEntryType.Group,
        resources:[{
            content:'Resource1'
        },{
            content:'Resource2'
        }],
        entries:[  {
            type:OutTaskEntryType.Exercise,
            exerType:'Doplnovacka',
            instructions:{
              content:'Doplň hodnoty'
            },
            content:{
              uiData: [
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
            
          ],
        }
          },
          {
            type:OutTaskEntryType.Exercise,
            exerType:'HledaniChyb',
            instructions:{
              content:'Doplň hodnoty'
            },
            content:{data: `Kone skakly pres prekázesky.\n`+
            `Rybá oči sou dobrý, co romýšláš?\n`+
            `Pudeš se dnes kůkat na velků Pardubicků?`}
          },
          ]
      }
    ]
}
  
  
    ]
};
const FakeData:Record<string,OutTask> = {
['1']:{...exampleBase,id:'1',display:OutShowTaskDisplay.Vertical},
['2']:{...exampleBase,id:'2',display:OutShowTaskDisplay.Horizontal},
}

const getShowTask = (request: InShowTask) : OutTask => {
    return FakeData[request.id];
    
};


export type{
    OutExercise as OutShowExercise,
    OutResource as OutShowResource,
    OutGroup as OutShowGroup,
    OutExercise as ExerciseResponse, 
    OutTask as TaskResponse, 
    InShowTask as TaskRequest,
    OutExerInstr as ExInstrResp};

    export { getShowTask, OutTaskEntryType as OutShowTaskEntryType,OutShowTaskDisplay as OutShowTaskDisplay};
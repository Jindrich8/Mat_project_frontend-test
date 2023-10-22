import { Int } from "../../types/primitives/Integer";

type ExType = string;

interface InShowTask {
    id:Int;
}

interface OutShowTask{
    name:string;
    id:Int;
    timeLimit?:Date;
    exercises:OutShowExercise[];
}

interface OutShowExInstr{
instructions:string;
}

interface OutShowExercise{
    type:ExType;
    id:Int;
    instructions:OutShowExInstr
    content:unknown;
}

const getShowTask = (request: InShowTask) : OutShowTask => {

    
};

interface InFilledTaskData{
    id:Int;
    excercises:InFilledExerciseData[];
}

interface InFilledExerciseData{
    content:unknown;
}

interface OutFilledExerciseData

const sendFilledTaskData = (request:InFilledTaskData) => {

}

export {type OutShowExercise as ExerciseResponse, type OutShowTask as TaskResponse, type InShowTask as TaskRequest,type OutShowExInstr as ExInstrResp}
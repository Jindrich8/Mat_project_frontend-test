import { Exercise, ExerciseContent} from "./ExerciseBase";
import { createDoplnovacka } from "./Doplnovacka/Doplnovacka";
import { TaskResponse } from "../api/task/task";
import { createHledaniChyb } from "./HledaniChyb/HledaniChyb";
import { Int } from "../types/primitives/Integer";

type ExType = string;
type ExerciseContentFromDTO = (content:unknown,filledData?:unknown) => ExerciseContent;

interface Task{
    name:string;
    id:Int;
    exercises:Exercise[];
}

const ExerciseTypeToCreator = {
    ["HledaniChyb"]:createHledaniChyb,
    ["Doplnovacka"]: createDoplnovacka,
};

const ExerciseTypeToCreatorDict:Record<ExType,ExerciseContentFromDTO> = ExerciseTypeToCreator;
//type ExerciseTypes = keyof typeof ExerciseTypeToCreator;

const createTask = (data:TaskResponse) => {

const task = data;

const parsedTask:Task = {
    name:task.name,
    id:task.id,
    exercises: task.exercises.map(ex => {
        console.log(`ex.type: ${ex.type}`);
        return ({
        instructions:{instructions:ex.instructions.instructions}, 
        content:ExerciseTypeToCreatorDict[ex.type](ex.content)});
    })
};

return parsedTask;
};

export { createTask as toTask, type Task, type ExerciseContentFromDTO };





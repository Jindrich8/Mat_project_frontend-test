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

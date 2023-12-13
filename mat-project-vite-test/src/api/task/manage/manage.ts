interface InCreateTask{
    exercises:InCreateExercise[];
}

interface InCreateExercise{
data:unknown;
}

interface OutCreateTask{
    error?:string;
}

const saveFillingTask = (request:InSaveFillingTask):OutSaveFillingTask => {

}
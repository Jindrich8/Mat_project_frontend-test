
interface ExerciseApi {
    getFilledDataForServer():unknown|undefined;
}

interface ExerciseInstructions {
    instructions:string
  }
  
  interface ExerciseContentCmpProps {
      apiRef:ExerciseApi
  }
  
  interface ExerciseContent {
      renderCmp(props:ExerciseContentCmpProps):React.ReactNode;
  }

interface Exercise {
    instructions:ExerciseInstructions;
    content:ExerciseContent;
}

export {type Exercise,type ExerciseApi, type ExerciseInstructions, type ExerciseContent, type ExerciseContentCmpProps}





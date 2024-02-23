import { ActualExercise, ReviewExerciseDto, TakeExerciseDto } from "../../ExerciseTypes";
import { FillInBlanksReviewCmp } from "./review/FillInBlanksReviewCmp";
import { FillInBlanksTakeCmp} from "./take/FillInBlanksTakeCmp";


type TakeContent = (TakeExerciseDto['details']&{exerType:'FillInBlanks'})['content'];
type ReviewContent = (ReviewExerciseDto['details']&{exerType:'FillInBlanks'})['content'];

const FillInBlanksMethods:ActualExercise = {

    createTake:(content:TakeContent) => {
        const data = [];
        for(const part of content){
            if(typeof part !== 'string'){
               data.push(part.type === 'cmb' ?
                    part.selectedIndex
                    : part.text);
                
            }
        }
        const state = {data:data};
        return {
            renderCmp:() => 
            (<FillInBlanksTakeCmp 
                uiData={content} 
                state={state} 
                 />),
                getFilledDataForServer:() => state.data
            };
        },
    createReview:(content:ReviewContent) =>{
        return {
            renderCmp:() => 
            (<FillInBlanksReviewCmp 
                uiData={content}
                 />)
            };
        }
};

export {FillInBlanksMethods,type TakeContent,type ReviewContent}

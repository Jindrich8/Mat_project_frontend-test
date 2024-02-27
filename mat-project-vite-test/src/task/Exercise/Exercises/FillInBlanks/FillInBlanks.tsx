import { FillInBlanksEvaluateRequest } from "../../../../api/dtos/request";
import { ActualExercise, ReviewExerciseDto, TakeExerciseDto } from "../../ExerciseTypes";
import { FillInBlanksReviewCmp } from "./review/FillInBlanksReviewCmp";
import { FillInBlanksTakeCmp} from "./take/FillInBlanksTakeCmp";


type TakeContent = (TakeExerciseDto['details']&{exerType:'FillInBlanks'})['content'];
type ReviewContent = (ReviewExerciseDto['details']&{exerType:'FillInBlanks'})['content'];

const FillInBlanksMethods:ActualExercise = {

    createTake:(content:TakeContent) => {
        console.log("FillInBlanks createTake - content: ");
        console.log(JSON.stringify(content));
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
                getFilledDataForServer:() => {
                    const res = ({
                        content:state.data
                    }) as FillInBlanksEvaluateRequest;
                    return res;
                }
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

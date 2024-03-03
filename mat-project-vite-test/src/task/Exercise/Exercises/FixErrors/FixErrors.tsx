import { FixErrorsEvaluateRequest } from "../../../../api/dtos/request";
import { TakeExerciseDto, ReviewExerciseDto, ActualExercise } from "../../ExerciseTypes";
import { FixErrorsReviewCmp } from "./review/FixErrorsReviewCmp";
import { FixErrorsTakeCmp } from "./take/FixErrorsTakeCmp";


type TakeContent = (TakeExerciseDto['details'] & { exerType: 'FixErrors' })['content'];
type ReviewContent = (ReviewExerciseDto['details'] & { exerType: 'FixErrors' })['content'];

const FixErrorsMethods: ActualExercise = {

    createTake: (content: TakeContent) => {
        const state = { data: content.text };
        const defaultText = content.defaultText;
        const takeExercise = (<FixErrorsTakeCmp
            defaultText={defaultText}
            state={state}
        />);
        return {
            renderCmp: () =>takeExercise,
            getFilledDataForServer: () => {
                const res = ({
                    content:state.data ?? null
                }) as FixErrorsEvaluateRequest;
                return res;
            }
        };
    },
    createReview: (content: ReviewContent) => {
        const reviewExercise = (<FixErrorsReviewCmp
            data={content}
        />);
        return {
            renderCmp: () =>reviewExercise
            
        };
    }
};

export { FixErrorsMethods, type TakeContent, type ReviewContent }


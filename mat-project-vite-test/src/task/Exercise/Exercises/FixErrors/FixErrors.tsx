import { TakeExerciseDto, ReviewExerciseDto, ActualExercise } from "../../ExerciseTypes";
import { FixErrorsReviewCmp } from "./review/FixErrorsReviewCmp";
import { FixErrorsTakeCmp } from "./take/FixErrorsTakeCmp";


type TakeContent = (TakeExerciseDto['details'] & { exerType: 'FixErrors' })['content'];
type ReviewContent = (ReviewExerciseDto['details'] & { exerType: 'FixErrors' })['content'];

const FixErrorsMethods: ActualExercise = {

    createTake: (content: TakeContent) => {
        const state = { data: content.text };
        const defaultText = content.defaultText;
        return {
            renderCmp: () =>
            (<FixErrorsTakeCmp
                defaultText={defaultText}
                state={state}
            />),
            getFilledDataForServer: () => state.data
        };
    },
    createReview: (content: ReviewContent) => {
        return {
            renderCmp: () =>
            (<FixErrorsReviewCmp
                data={content}
            />)
        };
    }
};

export { FixErrorsMethods, type TakeContent, type ReviewContent }


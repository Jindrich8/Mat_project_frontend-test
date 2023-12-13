import { ExerciseContentFromDTO } from "../../ExerciseTypes";
import { HledaniChybCmp } from "./HledaniChybCmp";
import { HledaniChybContent } from "./HledaniChybTypes";


const createHledaniChyb:ExerciseContentFromDTO = (content) => {
// check content
const parsedContent = content as HledaniChybContent;
const state = parsedContent;
return {
    renderCmp:() => 
    (<HledaniChybCmp 
        state={state} />),
        getFilledDataForServer:() => state.data
    };
};

export {createHledaniChyb}

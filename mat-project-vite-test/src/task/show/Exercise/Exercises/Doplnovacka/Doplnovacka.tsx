import { ExerciseContentFromDTO } from "../../ExerciseTypes";
import { DoplnovackaCmp, DoplnovackaCmpProps } from "./DoplnovackaCmp";
import { DoplnovackaContent } from "./DoplnovackaTypes";




const createDoplnovacka:ExerciseContentFromDTO = (content) => {
// check exercise type
const parsedContent = content as DoplnovackaContent;

const state:DoplnovackaCmpProps['state'] = {data:parsedContent.filledData ?? []};
const parsedUIData = parsedContent.uiData;
return {
    renderCmp:() => 
    (<DoplnovackaCmp 
        uiData={parsedUIData} 
        state={state} 
         />),
        getFilledDataForServer:() => state.data
    };
};

export {createDoplnovacka}

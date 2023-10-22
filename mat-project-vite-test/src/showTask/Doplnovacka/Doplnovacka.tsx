import { ExerciseContentFromDTO } from "../Task";
import { DoplnovackaCmp, DoplnovackaCmpProps } from "./DoplnovackaCmp";


const createDoplnovacka:ExerciseContentFromDTO = (content,filledData) => {
// check exercise type
const parsedFilledData = filledData as DoplnovackaCmpProps['defaultFilledData'];
const parsedData = content as DoplnovackaCmpProps['data'];
return {renderCmp:(props) => 
    (<DoplnovackaCmp 
        data={parsedData} 
        defaultFilledData={parsedFilledData} 
        {...props} />)};
};

export {createDoplnovacka}

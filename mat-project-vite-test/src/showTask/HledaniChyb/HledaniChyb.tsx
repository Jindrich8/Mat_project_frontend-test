import { ExerciseContentFromDTO } from "../Task";
import { HledaniChybCmp, HledaniChybCmpProps } from "./HledaniChybCmp";


const createHledaniChyb:ExerciseContentFromDTO = (content,filledData) => {
// check content
const parsedFilledData = filledData as HledaniChybCmpProps['defaultFilledData'];
const parsedData = content as HledaniChybCmpProps['data'];
return {renderCmp:(props) => 
    (<HledaniChybCmp 
        data={parsedData} 
        defaultFilledData={parsedFilledData} 
        {...props} />)};
};

export {createHledaniChyb}

import { TakeTaskResponse } from "../../../../../api/dtos/task/take/response";
import { DoplnovackaCmp} from "./DoplnovackaCmp";


type Content = ((TakeTaskResponse['task']['entries'][0]&{type:'exercise'})['details']&{exerType:'FillInBlanks'})['content'];

const createDoplnovacka = (content:Content) => {
// check exercise type
const parsedContent = content;

const data = [];
for(const part of parsedContent){
    if(typeof part !== 'string'){
       data.push(part.type === 'cmb' ?
            part.selectedIndex
            : part.text);
        
    }
}
const state = {data:data};
const parsedUIData = parsedContent;
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

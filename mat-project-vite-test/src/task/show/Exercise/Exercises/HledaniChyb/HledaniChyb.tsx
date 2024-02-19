import { TakeTaskResponse } from "../../../../../api/dtos/task/take/response";
import { HledaniChybCmp } from "./HledaniChybCmp";

type Content = ((TakeTaskResponse['task']['entries'][0]&{type:'exercise'})['details']&{exerType:'FixErrors'})['content'];
const createHledaniChyb = (content:Content) => {
// check content
const parsedContent = content;
const state = {data:parsedContent.text};
return {
    renderCmp:() => 
    (<HledaniChybCmp 
        defaultText={parsedContent.defaultText}
        state={state} />),
        getFilledDataForServer:() => state.data
    };
};

export {createHledaniChyb}


import { TakeTaskResponse } from "../../../../../api/dtos/success_response";
import { FixErrorsCmp } from "./FixErrorsCmp";

type Content = ((TakeTaskResponse['task']['entries'][0]&{type:'exercise'})['details']&{exerType:'FixErrors'})['content'];
const createFixErrors = (content:Content) => {
const state = {data:content.text};
const defaultText = content.defaultText;
return {
        renderCmp:() => 
        (<FixErrorsCmp 
            defaultText={defaultText}
            state={state} 
        />),
        getFilledDataForServer:() => state.data
    };
};

export {createFixErrors}

import { OutShowResource } from "../../../api/task/take/get";
import { BasicProps } from "../../../types/props/props";
import { ResourceCmp } from "./ResourceCmp";
import { Resource } from "./ResourceTypes";


const createResource = (resource:OutShowResource):Resource =>{
   return {
    renderCmp: (props:BasicProps) => (<ResourceCmp {...props} content={resource.content} />)
   }
};

export {createResource};
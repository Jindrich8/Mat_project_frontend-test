import { BasicProps } from "../../../types/props/props";
import { ResourceCmp } from "./ResourceCmp";
import { Resource } from "./ResourceTypes";


const createResource = (resource:string):Resource =>{
   return {
    renderCmp: (props:BasicProps) => (<ResourceCmp {...props} content={resource} />)
   }
};

export {createResource};
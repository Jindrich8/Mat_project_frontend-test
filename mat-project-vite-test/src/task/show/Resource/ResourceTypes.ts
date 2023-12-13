import { BasicProps } from "../../../types/props/props";

interface Resource{
    renderCmp(props:BasicProps):React.ReactNode;
}

export {type Resource};
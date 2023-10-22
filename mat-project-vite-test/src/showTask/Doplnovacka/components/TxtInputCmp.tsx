import { FC } from "react"
import { AutoResizeTextInputCmp } from "../../../components/AutoresizeTxtInputCmp";
import React from "react";

interface Props{
onChange?:React.ChangeEventHandler<HTMLInputElement>
name?:string;
style?:React.CSSProperties;
defaultValue?:string;
}


const TxtInputCmp:FC<Props> = ({name,defaultValue,style,onChange}) => {

  
  return (
    <div style={{display:'inline-block'}}>
        <AutoResizeTextInputCmp 
        name={name} 
        defaultValue={defaultValue}
        onChange={onChange} 
        style={{width:'auto',display:'inline-flex',flexDirection:'row', textAlign:'center',justifyContent:'center'}} 
        inputStyle={{padding:'0 0.125rem',textAlign:'center',...style}}/>
    </div>
  )
};

export { TxtInputCmp, type Props as TxtInputCmpProps };

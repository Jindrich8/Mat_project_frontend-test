import { FC } from "react"
import React from "react";
import { AutoResizeTextInputCmp } from "../../../../../../components/AutoresizeTxtInputCmp";
import { PrefixedRecord } from "../../../../../../types/helpers/helpers";
import styles from "./TxtInputCmpStyle.module.css";

interface Props extends PrefixedRecord<'data-',string>{
onChange?:React.ChangeEventHandler<HTMLInputElement>
name?:string;
style?:React.CSSProperties;
defaultValue?:string;
className?:string;
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TxtInputCmp:FC<Props> = ({name,defaultValue,style,onChange,className,...d}) => {
  return (
    <div className={`${styles.container} ${className}`}>
        <AutoResizeTextInputCmp 
        name={name}
        defaultValue={defaultValue}
        minSize={' '}
        placeholder={'  '}
        onChange={onChange} 
        className={styles.autoResize} 
        inputClassName={styles.autoResizeInput}
        inputStyle={style}
        {...d}
        />
    </div>
  )
};

export { TxtInputCmp, type Props as TxtInputCmpProps };

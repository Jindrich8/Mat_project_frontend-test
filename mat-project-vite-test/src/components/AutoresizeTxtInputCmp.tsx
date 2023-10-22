import React, { useEffect } from 'react'
import { defaultHiddenSpanStyle } from '../types/props/props';
import { getResizerValue, resizeInput, resizeInput31 } from '../utils/utils';


type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & {
    minSize?: string,
    placeholderMinSize?: string,
    inputStyle?:React.InputHTMLAttributes<HTMLInputElement>['style']
};








const AutoResizeTextInputCmp = React.memo(React.forwardRef<HTMLInputElement, Props>((
        props,ref) => {
        const {onChange,
            style,
            inputStyle,
            placeholder,
            value,
            defaultValue,
            minSize,
            placeholderMinSize,
            ...rest} = props;
        const pRef = React.useRef<HTMLElement | null>(null);

        const onInputChange = React.useCallback<React.ChangeEventHandler<HTMLInputElement>>(e => {
            pRef.current && resizeInput31(
                e.currentTarget,
                pRef.current,
                minSize,
                placeholder,
                placeholderMinSize);
    
            onChange && onChange(e)},
            [minSize, placeholder, placeholderMinSize, onChange]);

            const currentInputStyle = React.useMemo(() => 
            ({padding:0,border:'1px solid gray', font: 'inherit',...inputStyle}) as React.CSSProperties,
            [inputStyle]
            );

            const hiddenSpanStyle = React.useMemo(() => ({
                ...currentInputStyle,
                ...defaultHiddenSpanStyle
            })  as React.CSSProperties,[currentInputStyle]);

        console.log(`AutoresizeTxtInput: rerendering`);

        

    useEffect(() => {
        //console.log("UseEffect");
        if(pRef.current){
            const input = pRef.current.previousElementSibling as HTMLInputElement;
         resizeInput(input,pRef.current,getResizerValue(input.value,minSize,placeholder,placeholderMinSize));
        }
    },[value,defaultValue,minSize,placeholder,placeholderMinSize]);

    

    return (
        <div style={style}>
            <input 
            role={'textbox'} 
            type={'text'} 
            size={1}
                ref={ref}
                value={value}
                defaultValue={defaultValue}
                placeholder={placeholder}
                style={currentInputStyle}
                {...rest}
                onChange={onInputChange} />
            <span ref={pRef} aria-hidden style={hiddenSpanStyle}></span>
        </div>)
}));
AutoResizeTextInputCmp.displayName = "AutoResizeTextInputCmp";
export { AutoResizeTextInputCmp, type Props as AutoResizeTextInputCmpProps };
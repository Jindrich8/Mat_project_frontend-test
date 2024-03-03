import React, { FC } from "react"

interface Props {
numerator:number;
denominator:number;
}

const FractionCmp:FC<Props> = ({numerator,denominator}) => {
    return (
        <span style={{display:'flex',flexDirection:'column'}}>
            <span style={{textDecoration:'underline'}}>{numerator}</span>
            <span>{denominator}</span>
        </span>
    );
};

export { FractionCmp, type Props as FractionCmpProps };

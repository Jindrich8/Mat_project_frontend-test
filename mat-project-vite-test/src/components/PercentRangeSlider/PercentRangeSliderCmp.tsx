import { RangeSlider, RangeSliderProps } from "@mantine/core";
import React, { FC } from "react"

interface Props extends Omit<RangeSliderProps,'min'|'max'|'marks'> {
    
}

const marks:RangeSliderProps['marks'] = [
    {
    label: '20%',
    value:20
},
{
    label: '50%',
    value:50
},
{
    label: '80%',
    value:80
}
];

const PercentRangeSliderCmp:FC<Props> = (props) => {
  return (
    <RangeSlider
    min={0}
    max={100}
    w={'100%'}
    marks={marks}
    {...props}
     />
  );
};

export { PercentRangeSliderCmp, type Props as PercentRangeSliderCmpProps };

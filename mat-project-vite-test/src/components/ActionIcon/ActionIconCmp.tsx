import { ActionIcon, BoxProps, MantineStyleProps, Tooltip } from "@mantine/core";
import React, { FC } from "react"

type Props = React.ComponentPropsWithoutRef<'button'> & {
title:string,
onClick?:React.MouseEventHandler<HTMLButtonElement>,
hiddenFrom?:BoxProps['hiddenFrom'],
visibleFrom?:BoxProps['visibleFrom']
} & MantineStyleProps;

const ActionIconCmp:FC<Props> = ({title,onClick,children,hiddenFrom,visibleFrom,...baseProps}) => {
  return (
    <Tooltip 
    label={title} 
    hiddenFrom={hiddenFrom} 
    visibleFrom={visibleFrom}>
        <ActionIcon 
        aria-label={title} 
        hiddenFrom={hiddenFrom} 
        visibleFrom={visibleFrom}  
        onClick={onClick} 
        {...baseProps}>
            {children}
            </ActionIcon>
    </Tooltip>
  );
};

export { ActionIconCmp, type Props as ActionIconCmpProps };

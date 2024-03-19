import { UnstyledButton } from "@mantine/core";
import React, { FC } from "react"
import { Link } from "react-router-dom";
import { BasicStyledWChildrenCmpProps } from "../../types/props/props";

interface Props extends BasicStyledWChildrenCmpProps {
    to: string;
}

const BtnLinkCmp: FC<Props> = React.memo(({ to,children,...others }) => {
    return (
        <UnstyledButton {...others} style={{padding:0}}>
            <Link style={{
                border:'inherit',
                background:'inherit',
                font:'inherit',
                textDecoration:'inherit',
                color:'inherit',
                display:'inline-block',
                height:'100%',
                width:'100%',
                boxSizing:'border-box'
                }} to={to}>{children}</Link>
        </UnstyledButton>
    );
});
BtnLinkCmp.displayName = "BtnLinkCmp";

export { BtnLinkCmp, type Props as BtnLinkCmpProps };

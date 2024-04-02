import { UnstyledButton } from "@mantine/core";
import React, { FC } from "react"
import { Link } from "react-router-dom";
import { BasicStyledWChildrenCmpProps } from "../../types/props/props";
import styles from "./BtnLinkCmpStyle.module.css";

interface Props extends BasicStyledWChildrenCmpProps {
    to: string;
}

const BtnLinkCmp: FC<Props> = React.memo(({ to,children,...others }) => {
    return (
        <UnstyledButton {...others} className={styles.btn}>
            <Link className={styles.link} to={to}>{children}</Link>
        </UnstyledButton>
    );
});
BtnLinkCmp.displayName = "BtnLinkCmp";

export { BtnLinkCmp, type Props as BtnLinkCmpProps };

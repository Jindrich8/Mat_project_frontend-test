import { Pill } from "@mantine/core";
import React, { FC } from "react";
import styles from "./TagsCmpStyle.module.css";

interface Props {
    tags: string[]
}

const TagsCmp: FC<Props> = ({ tags }) => {
    return (
        <>
            <div className={styles.container}>
                {tags.map((tag, i) => (<Pill key={i}>{tag}</Pill>))}
            </div>
        </>
    )
};

export { TagsCmp, type Props as TagsCmpProps };

import { FC, PropsWithChildren } from "react"
import styles from "./CollapseCmpStyle.module.css"
import { AccordionChevron } from "@mantine/core";

interface Props extends PropsWithChildren{

}

const SummaryCmp:FC<Props> = ({children}) => {
  return (
    <summary className={styles.summary}>
        {children} <AccordionChevron className={styles.chevron} />
    </summary>
  )
};

export { SummaryCmp, type Props as SummaryCmpProps };

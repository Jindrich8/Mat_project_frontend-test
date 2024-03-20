import { FC, PropsWithChildren } from "react"
import styles from "./CollapseCmpStyle.module.css"

interface Props extends PropsWithChildren {

}

const DetailsCmp:FC<Props> = ({children}) => {
  return (
    <details className={styles.details}>
        {children}
    </details>
  )
};

export { DetailsCmp, type Props as DetailsCmpProps };

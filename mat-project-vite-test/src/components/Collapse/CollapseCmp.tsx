import { FC, PropsWithChildren } from "react"
import styles from "./CollapseCmpStyle.module.css"
interface Props extends PropsWithChildren {

}

const CollapseCmp:FC<Props> = ({children}) => {
  return (
    <div className={styles.collapse}>
        {children}
    </div>
  )
};

export { CollapseCmp, type Props as CollapseCmpProps };

import { FC } from "react"
import { strStartAndEndWsToNbsp } from "../../utils/utils";
import styles from "./FormattedTextCmpStyle.module.css";

interface Props {
text:string
}

const FormattedTextCmp:FC<Props> = ({text}) => {
    const value = strStartAndEndWsToNbsp(text);
  return (
    <span className={styles.textCmp}>{value}</span>
  );
};

export { FormattedTextCmp, type Props as FormattedTextCmpProps };

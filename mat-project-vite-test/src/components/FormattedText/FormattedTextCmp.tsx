import { FC } from "react"
import { strStartAndEndSpacesToNbsp } from "../../utils/utils";
import styles from "./FormattedTextCmpStyle.module.css";

interface Props {
text:string
}

const FormattedTextCmp:FC<Props> = ({text}) => {
    const value = strStartAndEndSpacesToNbsp(text);
  return (
    <span className={styles.textCmp}>{value}</span>
  );
};

export { FormattedTextCmp, type Props as FormattedTextCmpProps };

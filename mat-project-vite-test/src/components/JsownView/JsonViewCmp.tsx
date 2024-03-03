import React, { FC } from "react"
import styles from "./JsonViewCmpStyle.module.css"
import { Any } from "../../types/types";

interface Props {
json?:Any;
}

const JsonViewCmp:FC<Props> = React.memo(({json}) => {
  return (
    <div>
        <pre className={styles.json}>{JSON.stringify(json,null,2)}</pre>
    </div>
  )
});
JsonViewCmp.displayName = "JsonViewCmp";

export { JsonViewCmp, type Props as JsonViewCmpProps };

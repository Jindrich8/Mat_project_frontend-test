import { FC } from "react"
import { FormattedTextCmp } from "../../../components/FormattedText/FormattedTextCmp";

type Props = {
content:string
};

const ResourceCmp:FC<Props> = ({content}) => {
  return (
    <FormattedTextCmp text={content} />
  )
};

export { ResourceCmp, type Props as ResourceCmpProps };

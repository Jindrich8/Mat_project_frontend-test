import React, { FC } from "react"

type Props = {
content:string
};

const ResourceCmp:FC<Props> = ({content}) => {
  return (
    <>
        <span>{content}</span>
    </>
  )
};

export { ResourceCmp, type Props as ResourceCmpProps };

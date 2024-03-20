import { Loader } from "@mantine/core";
import { FC } from "react"

interface Props {

}

const LoaderCmp:FC<Props> = () => {
  return (
    <Loader m={'auto'} />
  );
};

export { LoaderCmp, type Props as LoaderCmpProps };

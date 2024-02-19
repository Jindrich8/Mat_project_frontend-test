import { FC } from "react"
import { Button} from "@mantine/core";
import { csrf } from "../utils/auth";

interface Props {
}

const Csrf:FC<Props> = () => {

  return (<Button onClick={async ()=>{
    const response = await csrf();
    console.log(`csrf: ${JSON.stringify(response)}`);
  }}>Do</Button>);
};

export { Csrf, type Props as CsrfProps };

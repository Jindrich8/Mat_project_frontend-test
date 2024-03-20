import { Title } from "@mantine/core";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import styles from "./AppErrorElementStyle.module.css";


const AppErrorElement = () => {
    const error = useRouteError();

    if (isRouteErrorResponse(error)) {
      if (error.status === 404) {
        return <Title className={styles.Title}>This page doesn't exist!</Title>;
      }
  
      if (error.status === 401) {
        return <Title className={styles.Title}>You aren't authorized to see this</Title>;
      }
  
      if (error.status === 503) {
        return <Title className={styles.Title}>Looks like our API is down</Title>;
      }
  
      if (error.status === 418) {
        return <Title className={styles.Title}>🫖</Title>;
      }
    }
  
    return <Title className={styles.Title}>Something went wrong</Title>;
}

export { AppErrorElement };

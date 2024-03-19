import React, { FC } from "react"
import { useAuthContext } from "../Auth/context";

interface Props {
    children: React.ReactNode;
}

const AuthVisibleCmp:FC<Props> = React.memo(({children}) => {
    const auth = useAuthContext();
    
  return (auth.signedIn.value &&
  <>
        {children}
    </>
  );
});
AuthVisibleCmp.displayName = "AuthVisibleCmp";

export { AuthVisibleCmp, type Props as AuthVisibleCmpProps };

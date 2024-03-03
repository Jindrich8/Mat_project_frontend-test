import {
    FC,
    PropsWithChildren,
    useEffect,
} from 'react';
import { authState, fetchUser, hasAuthCookie, setSignedOut} from './auth';


type Props = PropsWithChildren;



export const AuthContextProvider: FC<Props> = ({ children }) => {

    console.log("AuthContextProvider - rendering...");
    useEffect(() => {
        if(hasAuthCookie()){
        fetchUser();
        }
        else if(authState.signedIn.value !== false){
            setSignedOut();
        }
    });

    return (<>
            {children}
            </>
    );
};



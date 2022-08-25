import { createContext, useContext, useState } from "react"
import { Navigate, useLocation } from 'react-router-dom'

let AuthCtx = createContext(null)

function AuthProviderCmp({ children }) {
    const [token, setToken] = useState(null)



    return (
        <AuthCtx.Provider value={{ token, setToken }}>{children}</AuthCtx.Provider>
    )
}
function useAuth() {
    return useContext(AuthCtx);
}

function RequireAuthCmp({ children }) {
    let auth = useAuth();
    let location = useLocation();

    if (!auth.token) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience
        // than dropping them off on the home page.
        return <Navigate to="/reg" state={{ from: location }} replace />;
    }

    return children;
}

export const AuthProvider = AuthProviderCmp
export const RequireAuth = RequireAuthCmp
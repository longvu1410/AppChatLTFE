import {useCallback, useEffect, useState} from "react";
import {SocketClient} from "../services/socketClient";

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    const logout = useCallback(() => {
        SocketClient.getInstance().logout();
        localStorage.removeItem("USER");
        localStorage.removeItem("RE_LOGIN_CODE");
        setIsAuthenticated(false);
    }, []);

    const loginSuccess = useCallback(() => {
        setIsAuthenticated(true);
    }, []);

    useEffect(() => {
        const checkSession = () => {
            console.log("Loading auth state from localStorage...");
            const user = localStorage.getItem("USER");
            const code = localStorage.getItem("RE_LOGIN_CODE");

            console.log("Loaded user:", {
                userName: user,
                reLoginCode: code
            });

            const socket = SocketClient.getInstance();

            if(!user || !code){
                setIsChecking(false);
                return;
            }



            const stopLoop = socket.startReLoginLoop(user, code, (data: any) => {
                if(data.event === "RE_LOGIN" && data.status === "success"){
                    console.log("Re-login successful");
                    if(data.data?.RE_LOGIN_CODE){
                        localStorage.setItem("RE_LOGIN_CODE",data.data.RE_LOGIN_CODE);
                    }
                    setIsAuthenticated(true);
                } else {
                    console.log("Re-login failed:", data.mes);
                    localStorage.removeItem("USER");
                    localStorage.removeItem("RE_LOGIN_CODE");
                    setIsAuthenticated(false);
                }
                setIsChecking(false);
            });
            return stopLoop;
        };
        checkSession();
    }, []);

    return {isAuthenticated, isChecking, logout, loginSuccess};
}
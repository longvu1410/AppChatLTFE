
import { useEffect, useState } from "react";

export function useCurrentUser() {
    const [currentUser, setCurrentUser] = useState("");

    useEffect(() => {
        const user = localStorage.getItem("USER");
        if (user) {
            setCurrentUser(user);
        }
    }, []);

    const logout = () => {
        localStorage.removeItem("USER");
        setCurrentUser("");
    };

    return {
        currentUser,
        isLoggedIn: !!currentUser,
        logout,
    };
}

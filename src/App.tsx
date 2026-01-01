import React, {useEffect, useState} from 'react';
import './App.css';
import {Route, BrowserRouter, Routes, Navigate} from "react-router-dom";
import Login from './pages/Login';
import Register from "./pages/Register";
import ChatPage from './pages/Chat';
import {socketClient} from "./services/socketClient";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkSession = () => {
            console.log("Loading auth state from localStorage...");
            const user = localStorage.getItem("USER");
            const code = localStorage.getItem("RE_LOGIN_CODE");

            if (!user || !code) {
                console.log("Không tìm thấy thông tin đăng nhập cũ.");
                setIsChecking(false);
                return;
            }

            console.log(`Tìm thấy user: ${user}. Đang kết nối...`);
            socketClient.connect();

            const stopLoop = socketClient.startReLoginLoop(user, code, (data: any) => {

                if (data.event === "RE_LOGIN" && data.status === "success") {
                    console.log("Re-login thành công!");

                    if (data.data?.RE_LOGIN_CODE) {
                        localStorage.setItem("RE_LOGIN_CODE", data.data.RE_LOGIN_CODE);
                    }
                    setIsAuthenticated(true);
                } else {
                    console.log("Re-login thất bại:", data.mes || data.data);

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

    if (isChecking) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-white">
                <span className="loading loading-spinner loading-lg text-lime-600"></span>
                <p className="mt-4 text-gray-500 font-medium">Đang khôi phục kết nối...</p>
            </div>
        );
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<Navigate to="/login" replace/>}
                />

                <Route
                    path="/login"
                    element={isAuthenticated ? <Navigate to="/chat" /> : <Login onLoginSuccess={() => setIsAuthenticated(true)} />}
                />

                <Route
                    path="/register"
                    element={<Register/>}
                />

                <Route
                    path="/chat"
                    element={isAuthenticated ? <ChatPage/> : <Navigate to="/login" />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
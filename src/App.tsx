import React, {useEffect, useState} from 'react';
import './App.css';
import {Route, BrowserRouter, Routes, Navigate} from "react-router-dom";
import Login from './pages/Login';
import Register from "./pages/Register";
import ChatPage from './pages/Chat';
import {useAuth} from "./hooks/useAuth";
import {useSocketConnection} from "./hooks/useSocketConnection";

function App() {
    const {isAuthenticated, isChecking, logout, loginSuccess} = useAuth();
    const isSocketConnected = useSocketConnection();

    if (isChecking || !isSocketConnected) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-white">
                <span className="loading loading-spinner loading-lg text-lime-600"></span>
                <p className="mt-4 text-gray-500 font-medium">{!isSocketConnected ? "Đang kết nối đến máy chủ..." : "Đang khôi phục phiên đăng nhập..."}</p>
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
                    element={isAuthenticated ? <Navigate to="/chat" /> : <Login onLoginSuccess={loginSuccess} />}
                />

                <Route
                    path="/register"
                    element={<Register/>}
                />

                <Route
                    path="/chat"
                    element={isAuthenticated ? (<ChatPage onLogout={logout} />) : (<Navigate to="/login" />)}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
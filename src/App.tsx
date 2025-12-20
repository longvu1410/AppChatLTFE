import React from 'react';
import './App.css';
import {Route, BrowserRouter, Routes, Navigate} from "react-router-dom";
import Login from './pages/Login';
import Register from "./pages/Register";
import ChatPage from './pages/Chat';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<Navigate to="/login" replace/>}
                />

                <Route
                    path="/login"
                    element={<Login/>}
                />

                <Route
                    path="/register"
                    element={<Register/>}
                />

                <Route
                    path="/chat"
                    element={<ChatPage/>}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

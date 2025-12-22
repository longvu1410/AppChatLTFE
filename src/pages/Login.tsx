import {MessageCircle} from "lucide-react";
import {Link, useNavigate} from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { socketClient } from '../services/socketClient';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState("");
    const [pass, setPass] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        socketClient.connect();

        const handleServerResponse = (data: any) => {
            if (data.event === "LOGIN_SUCCESS" || (data.event === "LOGIN" && data.status === "success")) {
                if (data.data?.code) {
                    localStorage.setItem("RE_LOGIN_CODE", data.data.code);
                }
                localStorage.setItem("USER", user);
                navigate('/chat');
            } else if (data.event === "LOGIN" && data.status === "error") {
                setError(data.mes);
            }
        };

        const unsubscribe = socketClient.onMessage(handleServerResponse);

        return () => {
            unsubscribe();
        };
    }, [user, navigate]);

    const handleTyping = (setter: any, value: string) => {
        setError("");
        setter(value);
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        socketClient.login(user, pass);
    };

    return (
        <div className="flex justify-center items-center h-screen bg-base-200">
            <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body">
                    <h1 className="text-2xl font-black text-lime-600 tracking-tighter flex items-center gap-2 justify-center">
                        <MessageCircle className="w-8 h-8 fill-lime-600 text-lime-600"/>
                        NLUChat
                    </h1>
                    <form onSubmit={handleLogin}>
                        {error && (
                            <div role="alert" className="alert alert-error mb-4 p-2 text-sm text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>{error}</span>
                            </div>
                        )}
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">Tên đăng nhập</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Nhập tên của bạn..."
                                value={user}
                                onChange={(e) => handleTyping(setUser, e.target.value)}
                                className={`input input-bordered w-full ${error ? "input-error" : ""}`}
                                autoFocus
                            />
                        </div>

                        <div className="form-control w-full mt-2">
                            <label className="label">
                                <span className="label-text">Mật khẩu</span>
                            </label>
                            <input
                                type="password"
                                placeholder="*****"
                                value={pass}
                                onChange={(e) => handleTyping(setPass, e.target.value)}
                                className={`input input-bordered w-full ${error ? "input-error" : ""}`}
                            />
                        </div>

                        <div className="card-actions justify-end mt-6">
                            <button className="btn hover:bg-lime-600 bg-lime-500 text-white w-full">Đăng nhập</button>
                        </div>
                    </form>
                    <div className="mt-1 mr-10 ml-10 text-sm flex">
                        <p className="text-gray-600">Bạn chưa có tài khoản?</p>
                        <Link to="/register" className="text-blue-600 hover:underline hover:text-blue-700">
                            Đăng ký ngay
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
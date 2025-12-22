import { MessageCircle } from "lucide-react";
import {Link, useNavigate} from 'react-router-dom';
import {useEffect, useState} from "react";
import {socketClient} from "../services/socketClient";

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState("");
    const [pass, setPass] = useState("");
    const [confirmPass, setConfirmPass] = useState("");

    const [error, setError] = useState("");

    useEffect(() => {
        socketClient.connect();

        const handleServerResponse = (data: any) => {

            if (data.event === "REGISTER" && data.status === "success") {
                alert("Đăng ký thành công! Bạn có thể đăng nhập ngay.");
                navigate('/login');
            }
            else if (data.event === "REGISTER" && data.status === "error") {
                setError(data.mes || "Đăng ký thất bại");
            }
        };

        const unsubscribe = socketClient.onMessage(handleServerResponse);

        return () => {
            unsubscribe();
        };
    }, [navigate]);

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();

        if (!user || !pass || !confirmPass) {
            setError("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        if (pass !== confirmPass) {
            setError("Mật khẩu nhập lại không khớp!");
            return;
        }

        setError("");
        socketClient.register(user, pass);
    };

    const handleTyping = (setter: any, value: string) => {
        setError("");
        setter(value);
    }

    return (
        <div className="flex justify-center items-center h-screen bg-base-200">
            <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body">
                    <h1 className="text-2xl font-black text-lime-600 tracking-tighter flex items-center gap-2 justify-center mb-4">
                        <MessageCircle className="w-8 h-8 fill-lime-600 text-lime-600"/>
                        NLUChat
                    </h1>

                    <h2 className="text-center text-xl font-bold mb-4 text-gray-700">Tạo Tài Khoản</h2>

                    <form onSubmit={handleRegister}>
                        {error && (
                            <div className="alert alert-error mb-4 p-2 text-sm text-white shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>{error}</span>
                            </div>
                        )}
                        <div className="form-control w-full">
                            <label className="label"><span className="label-text">Tên đăng nhập</span></label>
                            <input
                                type="text"
                                className="input input-bordered w-full"
                                autoFocus
                                value={user}
                                onChange={(e) => handleTyping(setUser, e.target.value)}
                            />
                        </div>

                        <div className="form-control w-full mt-2">
                            <label className="label"><span className="label-text">Mật khẩu</span></label>
                            <input
                                type="password"
                                className="input input-bordered w-full"
                                value={pass}
                                onChange={(e) => handleTyping(setPass, e.target.value)}
                            />
                        </div>

                        {/* 👇 Ô này chỉ Register mới có */}
                        <div className="form-control w-full mt-2">
                            <label className="label"><span className="label-text">Nhập lại mật khẩu</span></label>
                            <input
                                type="password"
                                className="input input-bordered w-full"
                                value={confirmPass}
                                onChange={(e) => handleTyping(setConfirmPass, e.target.value)}
                            />
                        </div>

                        <div className="card-actions justify-end mt-6">
                            <button className="btn hover:bg-lime-600 bg-lime-500 text-white w-full border-none">
                                Đăng Ký
                            </button>
                        </div>
                    </form>

                    {/* Link trỏ ngược về Login */}
                    <div className="mt-1 mr-10 ml-10 text-sm flex">
                        <p className="text-gray-600">Bạn đã có tài khoản?</p>
                        <Link to="/login" className="text-blue-600 font-medium hover:underline hover:text-blue-700">
                            Đăng nhập ngay
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
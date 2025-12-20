import { MessageCircle } from "lucide-react";
import { Link } from 'react-router-dom';

const Register: React.FC = () => {
    return (
        <div className="flex justify-center items-center h-screen bg-base-200">
            <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body">
                    <h1 className="text-2xl font-black text-lime-600 tracking-tighter flex items-center gap-2 justify-center mb-4">
                        <MessageCircle className="w-8 h-8 fill-lime-600 text-lime-600"/>
                        NLUChat
                    </h1>

                    <h2 className="text-center text-xl font-bold mb-4 text-gray-700">Tạo Tài Khoản</h2>

                    <form>
                        <div className="form-control w-full">
                            <label className="label"><span className="label-text">Tên đăng nhập</span></label>
                            <input
                                type="text"
                                className="input input-bordered w-full"
                                autoFocus
                            />
                        </div>

                        <div className="form-control w-full mt-2">
                            <label className="label"><span className="label-text">Mật khẩu</span></label>
                            <input
                                type="password"
                                className="input input-bordered w-full"
                            />
                        </div>

                        {/* 👇 Ô này chỉ Register mới có */}
                        <div className="form-control w-full mt-2">
                            <label className="label"><span className="label-text">Nhập lại mật khẩu</span></label>
                            <input
                                type="password"
                                className="input input-bordered w-full"
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
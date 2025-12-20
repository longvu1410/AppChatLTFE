import {MessageCircle} from "lucide-react";
import {Link, useNavigate} from 'react-router-dom';

const Login: React.FC = () => {
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Đăng nhập thành công!");
        navigate('/chat');
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
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">Tên đăng nhập</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Nhập tên của bạn..."
                                className="input input-bordered w-full"
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
                                className="input input-bordered w-full"
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
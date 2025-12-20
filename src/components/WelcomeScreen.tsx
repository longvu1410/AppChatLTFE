import React from 'react';
import Lottie from "lottie-react";
import robotAnimation from "../assets/Robot Says Hi.json";

export const WelcomeScreen = () => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center h-full bg-[#F8FAF5] text-center p-4">
            <div className="w-80 h-80 mb-4">
                <Lottie
                    animationData={robotAnimation}
                    loop={true}
                    autoplay={true}
                    style={{ width: '100%', height: '100%' }}
                />
            </div>

            <h2 className="text-3xl font-black text-base-content mb-2 tracking-tight">
                Chào mừng đến với NLUChat!
            </h2>

            <p className="text-gray-500 max-w-sm text-lg">
                Chọn một hội thoại từ danh sách bên trái để bắt đầu nhắn tin cùng bạn bè ngay.
            </p>
        </div>
    );
};
import React from 'react';
import { X, Users, Check } from 'lucide-react';

interface CreateGroupModalProps {
    onClose: () => void;
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({onClose}) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div onClick={onClose} className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
            {/* Hộp thoại */}
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md flex flex-col max-h-[85vh] overflow-hidden">

                {/* Header Modal */}
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-lime-50">
                    <h3 className="font-bold text-lg text-lime-700 flex items-center gap-2">
                        <Users className="w-5 h-5" /> Tạo nhóm mới
                    </h3>
                    <button className="btn btn-circle btn-ghost btn-sm" onClick={onClose}><X size={20} /></button>
                </div>

                {/* Body */}
                <div className="p-5 overflow-y-auto">
                    <div className="form-control w-full mb-5">
                        <label className="label font-bold text-gray-700">Tên nhóm</label>
                        <input type="text" placeholder="Ví dụ: Team Dev..." className="input input-bordered w-full rounded-xl bg-gray-50" />
                    </div>

                    <label className="label font-bold text-gray-700">Thành viên</label>
                    <div className="space-y-2">
                        {/* Item được chọn (Demo) */}
                        <div className="flex items-center gap-3 p-3 rounded-2xl border border-lime-500 bg-lime-50">
                            <div className="avatar"><div className="w-10 rounded-full"><img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" /></div></div>
                            <div className="flex-1 font-medium">Trần Thị B</div>
                            <div className="w-6 h-6 rounded-full bg-lime-500 flex items-center justify-center"><Check size={14} className="text-white"/></div>
                        </div>

                        {/* Item chưa chọn */}
                        <div className="flex items-center gap-3 p-3 rounded-2xl border border-gray-100 hover:bg-gray-50">
                            <div className="avatar"><div className="w-10 rounded-full"><img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" /></div></div>
                            <div className="flex-1 font-medium">Lê Văn C</div>
                            <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 flex justify-end gap-2">
                    <button className="btn btn-ghost" onClick={onClose}>Hủy</button>
                    <button className="btn bg-lime-500 text-white hover:bg-lime-600">Tạo nhóm</button>
                </div>
            </div>
        </div>
    );
};
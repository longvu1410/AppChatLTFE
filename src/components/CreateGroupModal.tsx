import React, { useState } from "react";
import { X, Users, Check } from "lucide-react";
import { createRoom } from "../services/roomService";   //  KẾT NỐI API

interface User {
  id: number;
  name: string;
  avatar: string;
}

interface CreateGroupModalProps {
  onClose: () => void;
  onCreateGroup?: (group: { name: string; members: number[] }) => void;
}

// Fake data — có thể thay bằng API
const mockUsers: User[] = [
  { id: 1, name: "Trần Thị B", avatar: "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" },
  { id: 2, name: "Lê Văn C", avatar: "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" },
  { id: 3, name: "Nguyễn Văn D", avatar: "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" },
];

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ onClose, onCreateGroup }) => {
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleUser = (userId: number) => {
    setSelectedUsers(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleCreateGroup = () => {
    if (!groupName.trim()) return;

    setLoading(true);

    //  Gửi CREATE_ROOM qua WebSocket
    createRoom(groupName);

    // callback cho parent nếu cần
    onCreateGroup?.({
      name: groupName,
      members: selectedUsers,
    });

    // reset UI
    setTimeout(() => {
      setLoading(false);
      setGroupName("");
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-lime-50">
          <h3 className="font-bold text-lg text-lime-700 flex items-center gap-2">
            <Users className="w-5 h-5" /> Tạo nhóm mới
          </h3>
          <button className="btn btn-circle btn-ghost btn-sm" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto">
          <div className="form-control w-full mb-5">
            <label className="label font-bold text-gray-700">Tên nhóm</label>
            <input
              type="text"
              placeholder="Ví dụ: Team Dev..."
              value={groupName}
              onChange={e => setGroupName(e.target.value)}
              className="input input-bordered w-full rounded-xl bg-gray-50"
            />
          </div>

          <label className="label font-bold text-gray-700 mb-2">Thành viên</label>

          <div className="space-y-2">
            {mockUsers.map(user => {
              const isSelected = selectedUsers.includes(user.id);

              return (
                <div
                  key={user.id}
                  onClick={() => toggleUser(user.id)}
                  className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer border ${
                    isSelected ? "border-lime-500 bg-lime-50" : "border-gray-100 hover:bg-gray-50"
                  }`}
                >
                  <div className="avatar">
                    <div className="w-10 rounded-full">
                      <img src={user.avatar} alt={user.name} />
                    </div>
                  </div>

                  <div className="flex-1 font-medium">{user.name}</div>

                  {isSelected ? (
                    <div className="w-6 h-6 rounded-full bg-lime-500 flex items-center justify-center">
                      <Check size={14} className="text-white" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex justify-end gap-2">
          <button className="btn btn-ghost" onClick={onClose}>Hủy</button>

          <button
            className="btn bg-lime-500 text-white hover:bg-lime-600"
            disabled={!groupName.trim() || loading}
            onClick={handleCreateGroup}
          >
            {loading ? "Đang tạo..." : "Tạo nhóm"}
          </button>
        </div>
      </div>
    </div>
  );
};

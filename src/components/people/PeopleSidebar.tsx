import React, { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { SocketClient } from "../../services/socketClient";

interface Props {
    currentUser: string;
    onSelectUser: (username: string) => void;
}

type OnlineMap = Record<string, boolean>;

// ✅ Chuẩn hoá username vì server có thể trả string hoặc object
const getUsername = (u: any): string => {
    if (typeof u === "string") return u;
    if (u && typeof u === "object") return u.user || u.name || u.username || "";
    return "";
};

// ✅ Chuẩn hoá response check online (server có thể đặt tên field khác nhau)
const parseOnlineResponse = (data: any): { user?: string; online?: boolean } => {
    const payload = data?.data ?? data;

    const user =
        payload?.user ||
        payload?.name ||
        payload?.username ||
        payload?.to ||
        payload?.target;

    const online =
        payload?.online ??
        payload?.isOnline ??
        payload?.status === "online";

    return { user, online: !!online };
};

const PeopleSidebar: React.FC<Props> = ({ currentUser, onSelectUser }) => {
    const [users, setUsers] = useState<string[]>([]);
    const [search, setSearch] = useState("");
    const [onlineMap, setOnlineMap] = useState<OnlineMap>({});

    // 1️⃣ lấy user list
    useEffect(() => {
        SocketClient.getInstance().getUserList?.();
        // nếu bạn chưa add helper getUserList thì dùng send raw:
        // SocketClient.getInstance().send({ action: "onchat", data: { event: "GET_USER_LIST" } });
    }, []);

    // 2️⃣ nhận message từ server
    useEffect(() => {
        const unsub = SocketClient.getInstance().subscribe((msg: any) => {
            // GET_USER_LIST
            if (msg?.event === "GET_USER_LIST" && msg?.status === "success") {
                const raw = Array.isArray(msg.data) ? msg.data : [];
                const list = raw
                    .map(getUsername)
                    .filter((u: string) => u && u !== currentUser)

                setUsers(list);

                // check online từng user
                list.forEach((u: string) => {
                    if (SocketClient.getInstance().checkUserOnline) SocketClient.getInstance().checkUserOnline(u);
                    else {
                        SocketClient.getInstance().send({
                            action: "onchat",
                            data: { event: "CHECK_USER_ONLINE", data: { user: u } }
                        });
                    }
                });
            }

            // CHECK_USER_ONLINE
            if (msg?.event === "CHECK_USER_ONLINE") {
                const { user, online } = parseOnlineResponse(msg);
                if (user) {
                    setOnlineMap((prev) => ({ ...prev, [user]: !!online }));
                }
            }
        });

        return () => unsub();
    }, [currentUser]);

    // 3️⃣ search
    const filteredUsers = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return users;
        return users.filter((u) => typeof u === "string" && u.toLowerCase().includes(q));
    }, [users, search]);

    return (
        <div className="h-full flex flex-col border-r bg-white">
            <div className="p-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        className="input input-bordered w-full pl-9"
                        placeholder="Tìm người dùng..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {filteredUsers.map((u) => (
                    <button
                        key={u}
                        onClick={() => onSelectUser(u)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left"
                    >
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-lime-200 flex items-center justify-center font-bold text-lime-700">
                                {u[0]?.toUpperCase()}
                            </div>
                            <span
                                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                                    onlineMap[u] ? "bg-green-500" : "bg-gray-400"
                                }`}
                            />
                        </div>

                        <div className="flex-1">
                            <div className="font-medium">{u}</div>
                            <div className="text-xs text-gray-500">{onlineMap[u] ? "Online" : "Offline"}</div>
                        </div>
                    </button>
                ))}

                {filteredUsers.length === 0 && (
                    <div className="text-center text-gray-400 text-sm mt-6">Không tìm thấy người dùng</div>
                )}
            </div>
        </div>
    );
};

export default PeopleSidebar;

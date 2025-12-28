import {SOCKET_URL} from "../api/socketConfig";

class SocketClient {
    private socket: WebSocket | null = null;
    private handlers: ((data: any) => void)[] = [];

    connect() {
        if (this.socket) return;
        console.log("Đang kết nối Socket...");
        this.socket = new WebSocket(SOCKET_URL);

        this.socket.onopen = () => {
            console.log("Socket đã kết nối!");
        };

        this.socket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            console.log(data);
            this.handlers.forEach(h => h(data));
        };

        this.socket.onclose = () => {
            this.socket = null;
        };
    }

    send(data: any) {
        if (this.socket?.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(data));
        }
    }

    onMessage(handler: (data: any) => void) {
        this.handlers.push(handler);

        return () => {
            this.handlers = this.handlers.filter(h => h !== handler);
        };
    }

    startReLoginLoop(user: string, code: string, callback: any) {
        let timer: any = null;

        const handleMsg = (data: any) => {
            if (data.event === "RE_LOGIN" || data.action === "error") {
                clearInterval(timer);
                callback(data);
            }
        };

        const unsubscribe = this.onMessage(handleMsg);

        const attemptLogin = () => {
            if (this.socket?.readyState === WebSocket.OPEN) {
                this.reLogin(user, code);
            } else {
                if (!this.socket || this.socket.readyState === WebSocket.CLOSED) {
                    this.connect();
                }
            }
        };

        attemptLogin();
        timer = setInterval(attemptLogin, 1000);
        return () => {
            clearInterval(timer);
            unsubscribe();
        };
    }

    joinRoom(roomName: string) {
        this.send({
            action: "onchat",
            data: {
                event: "JOIN_ROOM",
                data: {name: roomName}
            }
        });
    }

    sendMessage(roomName: string, message: string) {
        this.send({
            action: "onchat",
            data: {
                event: "SEND_MESSAGE",
                data: {
                    name: roomName,
                    message: message,
                },
            },
        });
    }

    getRoomHistory(roomName: string, page: number = 1) {
        this.send({
            action: "onchat",
            data: {
                event: "GET_ROOM_MESSAGES",
                data: {
                    name: roomName,
                    page: page
                }
            }
        });
    }


    login(user: string, pass: string) {
        this.send({
            action: "onchat",
            data: {
                event: "LOGIN",
                data: {
                    user: user,
                    pass: pass
                }
            }
        });
    }

    register(user: string, pass: string) {
        this.send({
            action: "onchat",
            data: {
                event: "REGISTER",
                data: {
                    user: user,
                    pass: pass
                }
            }
        });
    }

    reLogin(user: string, code: string) {
        this.send({
            action: "onchat",
            data: {
                event: "RE_LOGIN",
                data: {user, code}
            }
        });
    }
}

export const socketClient = new SocketClient();

import { SOCKET_URL } from "../api/socketConfig";

class SocketClient {
    private socket: WebSocket | null = null;
    private handlers: ((data: any) => void)[] = [];

    connect() {
        if (this.socket) return;

        this.socket = new WebSocket(SOCKET_URL);

        this.socket.onmessage = (e) => {
            const data = JSON.parse(e.data);
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
    }

    joinRoom(roomName: string) {
        this.send({
            action: "onchat",
            data: {
                event: "JOIN_ROOM",
                data: { name: roomName }
            }
        });
    }
}

export const socketClient = new SocketClient();

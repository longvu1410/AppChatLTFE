import { SOCKET_URL } from "../api/socketConfig";

class SocketClient {
    private socket: WebSocket | null = null;
    private handlers: ((data: any) => void)[] = [];

    connect() {
        if (this.socket) return;

        this.socket = new WebSocket(SOCKET_URL);

        this.socket.onopen = () => {
            console.log("socket connect");
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

    joinRoom(roomName: string) {
        this.send({
            action: "onchat",
            data: {
                event: "JOIN_ROOM",
                data: { name: roomName }
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


    getUserList(){
        this.send({
            action: "onchat",
            data:{
                event:"GET_USER_LIST"
            }
        });

    }
    checkUserOnline(user:string){
        this.send({
            action:"onchat",
            data:{
                event:"CHECK_USER_ONLINE",
                data:{
                    user

                }
            }
        });
    }
    checkUserExist(user:string){
        this.send({
            action:"onchat",
            data:{
                event:"CHECK_USER_EXIST",
                data:{user}
            }
        });
    }


    getPeopleChatMes(username:string,page :number =0){
        this.send({
            action:"onchat",
            data:{
                event:"GET_PEOPLE_CHAT_MES",
                data:{
                    name:username,
                    page
                }
            }
        });
    }
    sendChat(to:string,mes:string){
        this.send({
            action:"onchat",
            data:{
                event:"SEND_CHAT",
                data:{
                    type:"people",
                    to,mes
                }
            }
        });
    }

}

export const socketClient = new SocketClient();
import {SOCKET_URL} from "../api/socketConfig";

export class SocketClient {
    private static instance: SocketClient | null = null;
    private socket: WebSocket | null = null;
    private handlers: ((data: any) => void)[] = [];

    private constructor() {}

    public static getInstance(): SocketClient {
        if (!SocketClient.instance) {
            console.log("Getting SocketService instance");
            SocketClient.instance = new SocketClient();
            SocketClient.instance.connect();
        }
        return SocketClient.instance;
    }

    connect() {
        if (this.socket) return;
        this.socket = new WebSocket(SOCKET_URL);

        this.socket.onopen = () => {
            console.log("WebSocket connected!");
        };

        this.socket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            console.log(data);
            this.handlers.forEach(h => h(data));
        };

        this.socket.onerror = (error) => {
            console.error("Lỗi Socket:", error);
        };

        this.socket.onclose = () => {
            this.socket = null;
        };
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
            console.log("Đã ngắt kết nối Socket");
        }
    }

    send(data: any) {
        if (this.socket?.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(data));
        }
    }

    subscribe(handler: (data: any) => void) {
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

        const unsubscribe = this.subscribe(handleMsg);

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
create(roomName:string){
        this.send({
            action:"onchat",
            data: {
                event: "CREATE_ROOM",
                data: {name:roomName }
            }
        });

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
            event: "GET_ROOM_CHAT_MET",
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

    logout() {
        this.send({
            action: "onchat",
            data: {
                event: "LOGOUT"
            }
        });
        this.disconnect();
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

sendChat(type: "room" | "people", to:string,mes:string){
        this.send({
            action:"onchat",
            data:{
                event:"SEND_CHAT",
                data:{
                    type,
                    to,mes
                }
            }
        });
    }
}
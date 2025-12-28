// === websocket.ts ===

const WS_URL = "wss://chat.longapp.site/chat/chat";

let socket: WebSocket | null = null;
let messageQueue: string[] = [];
let listeners: ((msg: any) => void)[] = [];

/**
 * ĐĂNG KÝ LẮNG NGHE MESSAGE TỪ SERVER
 */
export function subscribe(cb: (msg: any) => void) {
  listeners.push(cb);

  return () => {
    listeners = listeners.filter(l => l !== cb);
  };
}

/**
 * KẾT NỐI WS (auto reconnect)
 */
function connect() {
  if (
    socket &&
    (socket.readyState === WebSocket.OPEN ||
      socket.readyState === WebSocket.CONNECTING)
  ) {
    return;
  }

  socket = new WebSocket(WS_URL);

  socket.onopen = () => {
    console.log("WS CONNECTED");

    // gửi các message đang chờ
    messageQueue.forEach(msg => socket?.send(msg));
    messageQueue = [];
  };

  socket.onclose = () => {
    console.log("WS CLOSED — reconnecting...");
    setTimeout(connect, 1000);
  };

  socket.onerror = (e) => {
    console.log("WS ERROR", e);
  };

  socket.onmessage = (msg) => {
    try {
      const data = JSON.parse(msg.data);
      console.log("WS MESSAGE:", data);

      listeners.forEach(l => l(data));
    } catch (e) {
      console.log("Parse message error", e);
    }
  };
}

connect();

/**
 * GỬI AN TOÀN (hàng đợi nếu chưa OPEN)
 */
function sendSafe(payload: object) {
  const json = JSON.stringify(payload);

  if (!socket) connect();

  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(json);
  } else {
    console.log("WS chưa mở — push vào queue");
    messageQueue.push(json);
  }
}

/**
 * ========== EVENTS ==========
 */

/** CREATE ROOM */
export function createRoom(name: string) {
  sendSafe({
    action: "onchat",
    data: {
      event: "CREATE_ROOM",
      data: { name },
    },
  });
}

/** JOIN ROOM */
export function joinRoom(roomId: string) {
  sendSafe({
    action: "onchat",
    data: {
      event: "JOIN_ROOM",
      data: { roomId },
    },
  });
}

/** LOAD HISTORY (tùy backend: GET_MESSAGES / LOAD_ROOM_HISTORY) */
export function loadHistory(roomId: string) {
  sendSafe({
    action: "onchat",
    data: {
      event: "GET_MESSAGES",
      data: { roomId },
    },
  });
}

/** SEND MESSAGE */
export function sendMessage(roomId: string, message: string) {
  sendSafe({
    action: "onchat",
    data: {
      event: "SEND_MESSAGE",
      data: { roomId, message },
    },
  });
}

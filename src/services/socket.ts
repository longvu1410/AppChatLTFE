let socket: WebSocket | null = null;

export function getSocket() {
  if (!socket || socket.readyState === WebSocket.CLOSED) {
    socket = new WebSocket("wss://chat.longapp.site/chat/chat");
  }
  return socket;
}

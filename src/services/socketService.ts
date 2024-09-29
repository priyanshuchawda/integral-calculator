import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'your_socket_url_here';

class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io(SOCKET_URL);
  }

  public connect() {
    this.socket.connect();
  }

  public disconnect() {
    this.socket.disconnect();
  }

  public emit(event: string, data: any) {
    this.socket.emit(event, data);
  }

  public on(event: string, callback: (data: any) => void) {
    this.socket.on(event, callback);
  }

  public off(event: string) {
    this.socket.off(event);
  }
}

export default new SocketService();
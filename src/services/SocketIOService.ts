import { io, Socket } from 'socket.io-client';

export default class SocketIOService {
  private readonly socket: Socket;

  constructor(url: string) {
    this.socket = io(url, { autoConnect: false });
  }

  getSocket() {
    return this.socket;
  }

  // Utility function to handle socket logic
  handleSocketConnection = (
    socket: SocketIOService,
    uuid: string,
    onComplete: (data: any) => Promise<void>,
    onError: (error: any) => void
  ) => {
    const socketInstance = socket.getSocket();

    // Ensure the socket is connected
    socketInstance.connect();

    // Subscribe to the UUID
    socketInstance.emit('subscribe', { uuid });

    console.log('subscribed to websocket with uuid: ' + uuid);

    // Listen for response with the specific UUID
    socketInstance.on(`response-${uuid}`, async (data) => {
      console.log(data.message);

      if (data.status === 'completed') {
        socketInstance.off(`response-${uuid}`);
        socketInstance.disconnect();
        await onComplete(data);
      }
    });

    // Error listener to handle backend errors
    socketInstance.on('error', (error) => {
      console.error('Socket Error:', error);
      this.closeSocket(socket, uuid);
      onError(error);
    });
  };

  closeSocket = (socket: SocketIOService, uuid: string) => {
    const socketInstance = socket.getSocket();
    socketInstance.off(`response-${uuid}`);
    socketInstance.disconnect();
  };
}

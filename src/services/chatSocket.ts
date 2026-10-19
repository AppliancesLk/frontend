import { io } from 'socket.io-client';
import apiClient from '../api/apiClient';
import type {
  ChatAck,
  ChatDelivery,
  ChatSession,
  SendMessagePayload,
  SupportSocket,
} from '../types/chat.types';
export function createChatSocket(): SupportSocket {
  const origin = new URL(
    apiClient.defaults.baseURL ?? window.location.origin,
    window.location.origin,
  ).origin;
  return io(`${origin}/chat`, {
    autoConnect: false,
    withCredentials: true,
    transports: ['websocket', 'polling'],
    tryAllTransports: true,
    reconnection: true,
  });
}
function acknowledgement<T>(
  emit: (done: (reply: ChatAck<T>) => void) => void,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(
      () => reject(new Error('Chat confirmation timed out. Please try again.')),
      10000,
    );
    emit((reply) => {
      clearTimeout(timeout);
      if (reply.ok) resolve(reply.data);
      else reject(new Error(reply.error.message));
    });
  });
}
export function joinChat(socket: SupportSocket, id: string) {
  return acknowledgement<ChatSession>((done) =>
    socket.emit('chat:join', { sessionId: id }, done),
  );
}
export function leaveChat(socket: SupportSocket, id: string) {
  if (socket.connected)
    socket.emit('chat:leave', { sessionId: id }, () => undefined);
}
export function readChat(socket: SupportSocket, id: string) {
  return acknowledgement<ChatSession>((done) =>
    socket.emit('chat:read', { sessionId: id }, done),
  );
}
export async function sendChatMessage(
  socket: SupportSocket,
  payload: SendMessagePayload,
) {
  if (!socket.connected)
    throw new Error('Live chat is disconnected. Reconnect and try again.');
  return acknowledgement<ChatDelivery>((done) =>
    socket.emit('chat:message', payload, done),
  );
}

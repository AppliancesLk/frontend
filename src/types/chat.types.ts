import type { Socket } from 'socket.io-client';
export type ChatRole = 'CUSTOMER' | 'ADMIN';
export type ChatStatus = 'OPEN' | 'CLOSED';
export interface ChatSession {
  id: string;
  customerId: string;
  status: ChatStatus;
  messageCount: number;
  customerUnreadCount: number;
  adminUnreadCount: number;
  lastMessagePreview: string;
  createdAt: string;
  updatedAt: string;
  lastMessageAt: string;
  closedAt: string | null;
  customer?: { id: string; username: string; email: string };
}
export interface ChatMessage {
  id: string;
  chatSessionId: string;
  senderUserId: string;
  senderRole: ChatRole;
  clientMessageId: string;
  sequence: number;
  content: string;
  createdAt: string;
}
export interface CreateChatResponse {
  session: ChatSession;
  removedSessionIds: string[];
}
export interface ChatListResponse {
  items: ChatSession[];
  total: number;
  page: number;
  totalPages: number;
}
export interface SendMessagePayload {
  sessionId: string;
  clientMessageId: string;
  content: string;
}
export interface ChatDelivery {
  session: ChatSession;
  message: ChatMessage;
}
export type ChatAck<T> =
  | { ok: true; data: T }
  | { ok: false; error: { statusCode: number; message: string } };
export interface ChatServerEvents {
  'chat:message:new': (data: ChatDelivery) => void;
  'chat:session:created': (data: { sessionId: string }) => void;
  'chat:session:updated': (data: { sessionId: string }) => void;
  'chat:session:closed': (data: ChatSession) => void;
  'chat:session:removed': (data: { sessionId: string }) => void;
  'chat:limit:reached': (data: ChatSession) => void;
  'chat:error': (data: { statusCode: number; message: string }) => void;
}
export interface ChatClientEvents {
  'chat:join': (
    data: { sessionId: string },
    ack: (result: ChatAck<ChatSession>) => void,
  ) => void;
  'chat:leave': (
    data: { sessionId: string },
    ack: (result: ChatAck<null>) => void,
  ) => void;
  'chat:read': (
    data: { sessionId: string },
    ack: (result: ChatAck<ChatSession>) => void,
  ) => void;
  'chat:message': (
    data: SendMessagePayload,
    ack: (result: ChatAck<ChatDelivery>) => void,
  ) => void;
}
export type SupportSocket = Socket<ChatServerEvents, ChatClientEvents>;

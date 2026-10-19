import apiClient from '../api/apiClient';
import type {
  ChatListResponse,
  ChatMessage,
  ChatRole,
  ChatSession,
  ChatStatus,
  CreateChatResponse,
} from '../types/chat.types';
const path = (role: ChatRole) => (role === 'ADMIN' ? '/admin/chats' : '/chats');
export async function getChatSessions(
  role: ChatRole,
  status?: ChatStatus,
  page = 1,
  signal?: AbortSignal,
) {
  return (
    await apiClient.get<ChatListResponse>(path(role), {
      params: { status, page },
      signal,
    })
  ).data;
}
export async function createChat() {
  return (await apiClient.post<CreateChatResponse>('/chats', {})).data;
}
export async function getChat(
  role: ChatRole,
  id: string,
  signal?: AbortSignal,
) {
  return (await apiClient.get<ChatSession>(`${path(role)}/${id}`, { signal }))
    .data;
}
export async function getChatMessages(
  role: ChatRole,
  id: string,
  signal?: AbortSignal,
) {
  return (
    await apiClient.get<ChatMessage[]>(`${path(role)}/${id}/messages`, {
      signal,
    })
  ).data;
}
export async function closeChat(id: string) {
  return (await apiClient.patch<ChatSession>(`/admin/chats/${id}/close`)).data;
}

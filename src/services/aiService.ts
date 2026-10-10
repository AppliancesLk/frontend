import apiClient from '../api/apiClient';
import type { AiChatRequest, AiChatResponse } from '../types/ai.types';

export async function sendProductQuestion(
  request: AiChatRequest,
  signal?: AbortSignal,
): Promise<AiChatResponse> {
  const { data } = await apiClient.post<AiChatResponse>('/ai/chat', request, {
    signal,
    timeout: 70000,
  });
  return data;
}

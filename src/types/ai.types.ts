export interface AiChatRequest {
  productId: string;
  message: string;
  conversationId?: string;
}
export interface AiChatResponse {
  conversationId: string;
  message: string;
}
export interface AiChatMessage {
  id: string;
  role: 'USER' | 'ASSISTANT';
  content: string;
}

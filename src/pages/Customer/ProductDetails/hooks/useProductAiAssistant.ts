import { useEffect, useRef, useState } from 'react';
import { sendProductQuestion } from '../../../../services/aiService';
import type { AiChatMessage } from '../../../../types/ai.types';
import { getApiError } from '../../../../utils/apiErrors';
import { aiText } from '../../../../utils/aiText';

export function useProductAiAssistant(productId: string) {
  const [messages, setMessages] = useState<AiChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const conversationId = useRef<string | undefined>(undefined);
  const pending = useRef<AbortController | null>(null);
  const failed = useRef<string | null>(null);
  useEffect(
    () => () => {
      pending.current?.abort();
      pending.current = null;
    },
    [],
  );

  async function send(value: string, retry = false) {
    const message = value.trim();
    if (!message || message.length > 2000 || pending.current) return;
    const controller = new AbortController();
    pending.current = controller;
    setSending(true);
    setError(null);
    if (!retry)
      setMessages((current) => [
        ...current,
        { id: crypto.randomUUID(), role: 'USER', content: message },
      ]);
    failed.current = message;
    try {
      const response = await sendProductQuestion(
        {
          productId,
          message,
          ...(conversationId.current
            ? { conversationId: conversationId.current }
            : {}),
        },
        controller.signal,
      );
      if (controller.signal.aborted) return;
      conversationId.current = response.conversationId;
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: 'ASSISTANT',
          content: response.message,
        },
      ]);
      failed.current = null;
    } catch (failure) {
      if (!controller.signal.aborted)
        setError(getApiError(failure, aiText.error));
    } finally {
      if (pending.current === controller) {
        pending.current = null;
        if (!controller.signal.aborted) setSending(false);
      }
    }
  }
  function reset() {
    pending.current?.abort();
    pending.current = null;
    conversationId.current = undefined;
    failed.current = null;
    setMessages([]);
    setSending(false);
    setError(null);
  }
  return {
    messages,
    sending,
    error,
    send,
    reset,
    retry: () => {
      if (failed.current) void send(failed.current, true);
    },
  };
}

import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from './useAuth';
import * as service from '../services/chatService';
import {
  createChatSocket,
  joinChat,
  leaveChat,
  readChat,
  sendChatMessage,
} from '../services/chatSocket';
import type {
  ChatDelivery,
  ChatListResponse,
  ChatMessage,
  ChatRole,
  ChatSession,
  ChatStatus,
  SendMessagePayload,
  SupportSocket,
} from '../types/chat.types';
import { getApiError } from '../utils/apiErrors';
import { chatText as t } from '../utils/chatText';

export function mergeChatMessages(left: ChatMessage[], right: ChatMessage[]) {
  return [
    ...new Map(
      [...left, ...right].map((message) => [message.id, message]),
    ).values(),
  ].sort((a, b) => a.sequence - b.sequence);
}
function mergeSession(
  current: ChatSession | undefined,
  next: ChatSession,
): ChatSession {
  if (!current || current.id !== next.id) return next;
  return {
    ...current,
    ...next,
    customer: next.customer ?? current.customer,
    status: current.status === 'CLOSED' ? 'CLOSED' : next.status,
    messageCount: Math.max(current.messageCount, next.messageCount),
  };
}
export function useSupportChat(role: ChatRole) {
  const { user, refresh: refreshAuth } = useAuth();
  const userId = user?.id;
  const [list, setList] = useState<ChatListResponse | null>(null);
  const [status, setStatus] = useState<ChatStatus | undefined>();
  const [page, setPage] = useState(1);
  const [listError, setListError] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<{ id: string | null; text: string }>({
    id: null,
    text: '',
  });
  const [conversation, setConversation] = useState<{
    session: ChatSession;
    messages: ChatMessage[];
  } | null>(null);
  const [historyError, setHistoryError] = useState('');
  const [connection, setConnection] = useState<
    'connecting' | 'connected' | 'disconnected' | 'error'
  >('connecting');
  const [creating, setCreating] = useState(false),
    [closing, setClosing] = useState(false),
    [sending, setSending] = useState(false);
  const [actionError, setActionError] = useState(''),
    [sendError, setSendError] = useState('');
  const socketRef = useRef<SupportSocket | null>(null);
  const selectedRef = useRef<string | null>(null);
  const listVersion = useRef(0),
    historyVersion = useRef(0);
  const listAbort = useRef<AbortController | null>(null),
    historyAbort = useRef<AbortController | null>(null);
  const pending = useRef<SendMessagePayload | null>(null);
  const active = useRef(true);
  const refreshRef = useRef<() => Promise<void>>(async () => undefined);
  const loadRef = useRef<(id: string) => Promise<void>>(async () => undefined);

  const refresh = useCallback(async () => {
    listAbort.current?.abort();
    const controller = new AbortController();
    listAbort.current = controller;
    const version = ++listVersion.current;
    try {
      const result = await service.getChatSessions(
        role,
        status,
        page,
        controller.signal,
      );
      if (
        !controller.signal.aborted &&
        active.current &&
        version === listVersion.current
      ) {
        setList(result);
        setListError('');
      }
    } catch (error) {
      if (!controller.signal.aborted && active.current)
        setListError(getApiError(error, t.loadError));
    }
  }, [role, status, page]);

  const load = useCallback(
    async (id: string) => {
      const version = ++historyVersion.current;
      historyAbort.current?.abort();
      const controller = new AbortController();
      historyAbort.current = controller;
      try {
        const socket = socketRef.current;
        // Join before the REST snapshot, then merge live events by persisted ID.
        if (socket?.connected) await joinChat(socket, id);
        if (
          version !== historyVersion.current ||
          selectedRef.current !== id ||
          !active.current
        ) {
          if (socket) leaveChat(socket, id);
          return;
        }
        const [session, messages] = await Promise.all([
          service.getChat(role, id, controller.signal),
          service.getChatMessages(role, id, controller.signal),
        ]);
        if (
          controller.signal.aborted ||
          selectedRef.current !== id ||
          !active.current ||
          version !== historyVersion.current
        )
          return;
        setConversation((current) => ({
          session: mergeSession(current?.session, session),
          messages: mergeChatMessages(
            current?.session.id === id ? current.messages : [],
            messages,
          ),
        }));
        setHistoryError('');
      } catch (error) {
        if (
          !controller.signal.aborted &&
          active.current &&
          selectedRef.current === id &&
          version === historyVersion.current
        )
          setHistoryError(getApiError(error, t.loadError));
      }
    },
    [role],
  );

  useEffect(() => {
    refreshRef.current = refresh;
    const initialLoad = window.setTimeout(() => void refresh(), 0);
    return () => {
      window.clearTimeout(initialLoad);
      listAbort.current?.abort();
    };
  }, [refresh]);
  useEffect(() => {
    loadRef.current = load;
  }, [load]);
  useEffect(() => {
    active.current = true;
    if (!userId) return;
    const socket = createChatSocket();
    socketRef.current = socket;
    const update = () => {
      void refreshRef.current();
    };
    const apply = (data: ChatDelivery) => {
      if (selectedRef.current === data.session.id) {
        setConversation((current) => ({
          session: mergeSession(current?.session, data.session),
          messages: mergeChatMessages(
            current?.session.id === data.session.id ? current.messages : [],
            [data.message],
          ),
        }));
        if (
          data.message.senderRole !== role &&
          document.visibilityState === 'visible'
        )
          void readChat(socket, data.session.id).catch(() => undefined);
      }
    };
    const sessionChanged = (session: ChatSession) => {
      if (selectedRef.current === session.id)
        setConversation((current) =>
          current?.session.id === session.id
            ? { ...current, session: mergeSession(current.session, session) }
            : current,
        );
      update();
    };
    socket.on('connect', () => {
      setConnection('connected');
      update();
      if (selectedRef.current) void loadRef.current(selectedRef.current);
    });
    socket.on('disconnect', () => setConnection('disconnected'));
    socket.on('connect_error', (error) => {
      setConnection('error');
      if (error.message.startsWith('Please sign in')) void refreshAuth();
    });
    socket.on('chat:message:new', apply);
    socket.on('chat:session:created', update);
    socket.on('chat:session:updated', update);
    socket.on('chat:session:closed', sessionChanged);
    socket.on('chat:limit:reached', sessionChanged);
    socket.on('chat:session:removed', ({ sessionId }) => {
      if (selectedRef.current === sessionId) {
        selectedRef.current = null;
        historyVersion.current++;
        setSelectedId(null);
        setConversation(null);
        setActionError(t.removed);
      }
      update();
    });
    socket.on('chat:error', (error) => {
      if (error.statusCode === 401) void refreshAuth();
    });
    const focused = () => {
      if (document.visibilityState === 'visible') {
        update();
        if (selectedRef.current) void loadRef.current(selectedRef.current);
      }
    };
    window.addEventListener('focus', focused);
    const offline = () => socket.disconnect();
    const online = () => socket.connect();
    window.addEventListener('offline', offline);
    window.addEventListener('online', online);
    socket.connect();
    return () => {
      active.current = false;
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
      listAbort.current?.abort();
      historyAbort.current?.abort();
      window.removeEventListener('focus', focused);
      window.removeEventListener('offline', offline);
      window.removeEventListener('online', online);
    };
  }, [role, userId, refreshAuth]);

  function select(id: string) {
    if (selectedRef.current !== id) setDraft({ id, text: '' });
    if (selectedRef.current && socketRef.current)
      leaveChat(socketRef.current, selectedRef.current);
    selectedRef.current = id;
    setSelectedId(id);
    setHistoryError('');
    setActionError('');
    setSendError('');
    void load(id);
  }
  function deselect() {
    setDraft({ id: null, text: '' });
    if (selectedRef.current && socketRef.current)
      leaveChat(socketRef.current, selectedRef.current);
    selectedRef.current = null;
    historyVersion.current++;
    historyAbort.current?.abort();
    pending.current = null;
    setSelectedId(null);
    setConversation(null);
    setHistoryError('');
    setSendError('');
  }
  async function create() {
    if (creating) return;
    setCreating(true);
    setActionError('');
    try {
      const result = await service.createChat();
      if (active.current) {
        setConversation({ session: result.session, messages: [] });
        select(result.session.id);
        await refresh();
      }
    } catch (error) {
      if (active.current) setActionError(getApiError(error, t.newChatError));
    } finally {
      if (active.current) setCreating(false);
    }
  }
  function applyDelivery(data: ChatDelivery) {
    if (selectedRef.current === data.session.id)
      setConversation((current) => ({
        session: mergeSession(current?.session, data.session),
        messages: mergeChatMessages(
          current?.session.id === data.session.id ? current.messages : [],
          [data.message],
        ),
      }));
  }
  async function submit(content: string, retry = false) {
    const socket = socketRef.current,
      id = selectedRef.current;
    if (
      !socket ||
      !id ||
      sending ||
      !content.trim() ||
      content.trim().length > 2000
    )
      return false;
    const payload =
      retry && pending.current?.sessionId === id
        ? pending.current
        : {
            sessionId: id,
            content: content.trim(),
            clientMessageId: crypto.randomUUID(),
          };
    pending.current = payload;
    setSending(true);
    setSendError('');
    try {
      const result = await sendChatMessage(socket, payload);
      if (active.current) {
        applyDelivery(result);
        pending.current = null;
        void refresh();
      }
      return true;
    } catch {
      if (active.current && selectedRef.current === id)
        setSendError(t.sendError);
      return false;
    } finally {
      if (active.current) setSending(false);
    }
  }
  async function close() {
    const id = selectedRef.current;
    if (!id || closing) return;
    setClosing(true);
    setActionError('');
    try {
      const session = await service.closeChat(id);
      if (active.current && selectedRef.current === id) {
        setConversation((current) =>
          current?.session.id === id
            ? { ...current, session: mergeSession(current.session, session) }
            : current,
        );
        void refresh();
      }
    } catch (error) {
      if (active.current) setActionError(getApiError(error, t.closeError));
    } finally {
      if (active.current) setClosing(false);
    }
  }
  return {
    role,
    userId: user?.id,
    list,
    listError,
    selectedId,
    draft: draft.id === selectedId ? draft.text : '',
    setDraft: (id: string, text: string) => {
      if (selectedRef.current === id) setDraft({ id, text });
    },
    conversation: conversation?.session.id === selectedId ? conversation : null,
    historyError,
    connection,
    creating,
    closing,
    sending,
    actionError,
    sendError,
    status,
    page,
    select,
    deselect,
    create,
    close,
    submit,
    refresh,
    retryHistory: () => {
      if (selectedRef.current) void load(selectedRef.current);
    },
    retrySend: () => {
      if (pending.current) void submit(pending.current.content, true);
    },
    reconnect: () => {
      socketRef.current?.connect();
    },
    filter: (value?: ChatStatus) => {
      setStatus(value);
      setPage(1);
    },
    setPage,
  };
}

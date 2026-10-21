import { useEffect, useRef, useState } from 'react';
import { aiAPI } from '../services/api';
import { Button, Badge } from '../components/ui';
import toast from 'react-hot-toast';
import { MessageSquare, Plus, Trash2, Send, Sparkles, Info, Bot, User } from 'lucide-react';

const STARTERS = [
  'Where is my money going this month?',
  'How can I save more money?',
  'Am I on track with my budgets?',
  'What is my biggest spending category?',
];

function formatWhen(value) {
  if (!value) return '';
  const date = new Date(value);
  const today = new Date();
  const sameDay = date.toDateString() === today.toDateString();
  return sameDay
    ? date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function AssistantPanel() {
  const [status, setStatus] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(true);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  const loadSessions = async () => {
    try {
      const { data } = await aiAPI.getChatSessions();
      setSessions(data);
      return data;
    } catch {
      return [];
    } finally {
      setLoadingSessions(false);
    }
  };

  const openSession = async (id) => {
    setActiveId(id);
    setMessages([]);
    try {
      const { data } = await aiAPI.getChatMessages(id);
      setMessages(data);
    } catch {
      toast.error('Could not open that conversation');
    }
  };

  useEffect(() => {
    aiAPI.getStatus().then(({ data }) => setStatus(data)).catch(() => {});
    loadSessions().then((list) => {
      if (list.length > 0) openSession(list[0].id);
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startSession = async () => {
    try {
      const { data } = await aiAPI.createChatSession({});
      setSessions((prev) => [data, ...prev]);
      setActiveId(data.id);
      setMessages([]);
      return data.id;
    } catch {
      toast.error('Could not start a conversation');
      return null;
    }
  };

  const send = async (text) => {
    const message = (text ?? draft).trim();
    if (!message || sending) return;

    setDraft('');
    setSending(true);

    try {
      let sessionId = activeId;
      if (!sessionId) {
        sessionId = await startSession();
        if (!sessionId) return;
      }

      // Show the user's message immediately; the server returns it too, and the
      // reply replaces the optimistic copy.
      const optimistic = {
        id: `pending-${Date.now()}`,
        role: 'user',
        content: message,
        createdAt: new Date().toISOString(),
        usedFallback: false,
      };
      setMessages((prev) => [...prev, optimistic]);

      const { data } = await aiAPI.sendChatMessage(sessionId, message);

      setMessages((prev) => [
        ...prev.filter((m) => m.id !== optimistic.id),
        data.userMessage,
        data.reply,
      ]);

      await loadSessions();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not send that message');
      setMessages((prev) => prev.filter((m) => !String(m.id).startsWith('pending-')));
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      send();
    }
  };

  const removeSession = async (id, event) => {
    event.stopPropagation();
    try {
      await aiAPI.deleteChatSession(id);
      const remaining = sessions.filter((s) => s.id !== id);
      setSessions(remaining);
      if (activeId === id) {
        setActiveId(null);
        setMessages([]);
        if (remaining.length > 0) openSession(remaining[0].id);
      }
      toast.success('Conversation deleted');
    } catch {
      toast.error('Could not delete that conversation');
    }
  };

  const aiUnavailable = status && !status.configured;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[16rem_1fr] gap-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 h-fit">
        <Button onClick={startSession} size="sm" className="w-full">
          <Plus size={14} className="inline mr-1.5" />
          New conversation
        </Button>

        <div className="mt-4 space-y-1">
          {loadingSessions ? (
            <p className="text-xs text-gray-400 dark:text-gray-500 px-1">Loading...</p>
          ) : sessions.length === 0 ? (
            <p className="text-xs text-gray-400 dark:text-gray-500 px-1">No conversations yet.</p>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => openSession(session.id)}
                className={`group flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer transition-colors ${
                  activeId === session.id
                    ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <MessageSquare size={14} className="shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm truncate">{session.title}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {formatWhen(session.lastMessageAt)}
                  </p>
                </div>
                <button
                  onClick={(e) => removeSession(session.id, e)}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 transition-opacity"
                  aria-label="Delete conversation"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col min-h-[32rem]">
        {aiUnavailable && (
          <div className="flex items-start gap-3 border-b border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-900/20 p-4">
            <Info size={18} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
            <p className="text-sm text-amber-800 dark:text-amber-200">
              The AI assistant is not configured on this server, so answers come from your
              recorded totals only. Set <span className="font-medium">Ai__ApiKey</span> to enable
              full answers.
            </p>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center py-10">
              <Sparkles size={32} className="text-green-600 dark:text-green-400 mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Ask Akanti about your money
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
                The assistant sees your aggregate totals and trends — never transaction names,
                descriptions or individual amounts.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {STARTERS.map((starter) => (
                  <button
                    key={starter}
                    onClick={() => send(starter)}
                    className="px-3 py-1.5 rounded-full text-sm border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/30 hover:border-green-300 dark:hover:border-green-700 transition-colors"
                  >
                    {starter}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => {
            const isUser = message.role === 'user';
            return (
              <div key={message.id} className={`flex gap-3 ${isUser ? 'justify-end' : ''}`}>
                {!isUser && (
                  <div className="shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <Bot size={16} className="text-green-700 dark:text-green-400" />
                  </div>
                )}
                <div className={`max-w-[85%] ${isUser ? 'order-first' : ''}`}>
                  <div
                    className={`rounded-2xl px-4 py-3 whitespace-pre-wrap text-sm ${
                      isUser
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    {message.content}
                  </div>
                  <div className="flex items-center gap-2 mt-1 px-1">
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {formatWhen(message.createdAt)}
                    </span>
                    {!isUser && message.usedFallback && (
                      <Badge tone="yellow">From your records</Badge>
                    )}
                  </div>
                </div>
                {isUser && (
                  <div className="shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                    <User size={16} className="text-gray-600 dark:text-gray-300" />
                  </div>
                )}
              </div>
            );
          })}

          {sending && (
            <div className="flex gap-3">
              <div className="shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <Bot size={16} className="text-green-700 dark:text-green-400" />
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.15s' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.3s' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your spending, savings or budgets..."
              maxLength={4000}
              className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Button onClick={() => send()} disabled={sending || !draft.trim()}>
              <Send size={14} className="inline mr-1.5" />
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

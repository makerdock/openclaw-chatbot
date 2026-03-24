'use client';

import { useState, useRef, useEffect, CSSProperties } from 'react';
import ChatMessage from '@/components/ChatMessage';
import SettingsPanel from '@/components/SettingsPanel';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const styles: Record<string, CSSProperties> = {
  root: { display: 'flex', flexDirection: 'column', height: '100vh', background: '#030712', color: '#f9fafb' },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '12px 16px', borderBottom: '1px solid #1f2937', background: '#111827',
    flexShrink: 0,
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: 12 },
  avatar: {
    width: 32, height: 32, borderRadius: '50%',
    background: 'linear-gradient(135deg, #f97316, #dc2626)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
  },
  headerTitle: { fontSize: 14, fontWeight: 600, color: '#fff' },
  headerSub: { fontSize: 12, color: '#9ca3af', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  headerRight: { display: 'flex', alignItems: 'center', gap: 8 },
  clearBtn: {
    fontSize: 12, color: '#9ca3af', padding: '4px 12px', borderRadius: 6,
    border: 'none', background: 'transparent', cursor: 'pointer',
  },
  settingsBtn: {
    fontSize: 12, fontWeight: 500, color: '#9ca3af', padding: '6px 12px',
    borderRadius: 6, border: '1px solid #374151', background: 'transparent', cursor: 'pointer',
  },
  body: { display: 'flex', flex: 1, overflow: 'hidden' },
  chatArea: { display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' },
  messages: { flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 16 },
  emptyState: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, textAlign: 'center' },
  emptyEmoji: { fontSize: 56 },
  emptyTitle: { fontSize: 20, fontWeight: 500, color: '#d1d5db' },
  emptySub: { fontSize: 14, color: '#6b7280', marginTop: 4 },
  emptyLink: { fontSize: 14, color: '#fb923c', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' },
  inputBar: { borderTop: '1px solid #1f2937', padding: '12px 16px', background: '#111827', flexShrink: 0 },
  inputWrap: { display: 'flex', alignItems: 'flex-end', gap: 8, maxWidth: 896, margin: '0 auto' },
  textarea: {
    flex: 1, resize: 'none', borderRadius: 12, background: '#1f2937',
    border: '1px solid #374151', color: '#f9fafb', padding: '12px 16px',
    fontSize: 14, outline: 'none', minHeight: 48, maxHeight: 144, overflowY: 'auto',
    fontFamily: 'inherit', lineHeight: 1.5,
  },
  sendBtn: {
    padding: '12px 16px', borderRadius: 12, background: '#f97316', border: 'none',
    color: '#fff', fontSize: 14, fontWeight: 500, cursor: 'pointer', flexShrink: 0,
  },
  sendBtnDisabled: {
    padding: '12px 16px', borderRadius: 12, background: '#f97316', border: 'none',
    color: '#fff', fontSize: 14, fontWeight: 500, cursor: 'not-allowed', flexShrink: 0, opacity: 0.4,
  },
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [gatewayUrl, setGatewayUrl] = useState('');
  const [token, setToken] = useState('');
  const [agentId, setAgentId] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('openclaw_settings');
      if (saved) {
        const p = JSON.parse(saved);
        setGatewayUrl(p.gatewayUrl || '');
        setToken(p.token || '');
        setAgentId(p.agentId || '');
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMessage: Message = { role: 'user', content: text };
    const updated = [...messages, userMessage];
    setMessages(updated);
    setInput('');
    setIsLoading(true);
    setMessages([...updated, { role: 'assistant', content: '' }]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated, gatewayUrl, token, agentId }),
      });
      if (!res.ok) throw new Error((await res.text()) || `HTTP ${res.status}`);

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let acc = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { role: 'assistant', content: acc };
          return next;
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = { role: 'assistant', content: `⚠️ Error: ${msg}\n\nCheck gateway URL and token in Settings.` };
        return next;
      });
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div style={styles.root}>
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.avatar}>🦀</div>
          <div>
            <div style={styles.headerTitle}>OpenClaw Chat</div>
            <div style={styles.headerSub}>{gatewayUrl || 'No gateway configured'}</div>
          </div>
        </div>
        <div style={styles.headerRight}>
          {messages.length > 0 && (
            <button style={styles.clearBtn} onClick={() => setMessages([])}>Clear</button>
          )}
          <button style={styles.settingsBtn} onClick={() => setShowSettings(!showSettings)}>
            ⚙ Settings
          </button>
        </div>
      </header>

      <div style={styles.body}>
        <div style={styles.chatArea}>
          <div style={styles.messages}>
            {messages.length === 0 ? (
              <div style={styles.emptyState}>
                <span style={styles.emptyEmoji}>🦀</span>
                <div>
                  <p style={styles.emptyTitle}>OpenClaw Chatbot</p>
                  <p style={styles.emptySub}>Connect to your self-hosted AI agent gateway</p>
                </div>
                {!gatewayUrl && (
                  <button style={styles.emptyLink} onClick={() => setShowSettings(true)}>
                    Configure gateway settings →
                  </button>
                )}
              </div>
            ) : (
              messages.map((msg, i) => (
                <ChatMessage
                  key={i}
                  role={msg.role}
                  content={msg.content}
                  isStreaming={isLoading && i === messages.length - 1 && msg.role === 'assistant'}
                />
              ))
            )}
            <div ref={bottomRef} />
          </div>

          <div style={styles.inputBar}>
            <div style={styles.inputWrap}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message… (Enter to send, Shift+Enter for newline)"
                rows={1}
                style={styles.textarea}
                onInput={(e) => {
                  const el = e.currentTarget;
                  el.style.height = 'auto';
                  el.style.height = `${Math.min(el.scrollHeight, 144)}px`;
                }}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                style={!input.trim() || isLoading ? styles.sendBtnDisabled : styles.sendBtn}
              >
                {isLoading ? '…' : 'Send'}
              </button>
            </div>
          </div>
        </div>

        {showSettings && (
          <SettingsPanel
            gatewayUrl={gatewayUrl} setGatewayUrl={setGatewayUrl}
            token={token} setToken={setToken}
            agentId={agentId} setAgentId={setAgentId}
            onClose={() => setShowSettings(false)}
          />
        )}
      </div>
    </div>
  );
}

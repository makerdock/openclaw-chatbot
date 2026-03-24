import { CSSProperties } from 'react';

type Props = {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
};

export default function ChatMessage({ role, content, isStreaming }: Props) {
  const isUser = role === 'user';

  const rowStyle: CSSProperties = {
    display: 'flex',
    justifyContent: isUser ? 'flex-end' : 'flex-start',
  };

  const innerStyle: CSSProperties = {
    display: 'flex',
    gap: 12,
    maxWidth: '85%',
    flexDirection: isUser ? 'row-reverse' : 'row',
    alignItems: 'flex-start',
  };

  const avatarStyle: CSSProperties = {
    width: 28, height: 28, borderRadius: '50%', flexShrink: 0, marginTop: 2,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 12, fontWeight: 600,
    background: isUser ? '#2563eb' : 'linear-gradient(135deg, #f97316, #dc2626)',
    color: '#fff',
  };

  const bubbleStyle: CSSProperties = {
    borderRadius: 16,
    borderTopRightRadius: isUser ? 4 : 16,
    borderTopLeftRadius: isUser ? 16 : 4,
    padding: '10px 14px',
    fontSize: 14,
    lineHeight: 1.6,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    background: isUser ? '#2563eb' : '#1f2937',
    color: isUser ? '#fff' : '#f3f4f6',
  };

  return (
    <div style={rowStyle}>
      <div style={innerStyle}>
        <div style={avatarStyle}>
          {isUser ? 'U' : '🦀'}
        </div>
        <div style={bubbleStyle}>
          {content}
          {isStreaming && !content && (
            <span style={{ display: 'inline-flex', gap: 4, padding: '2px 0' }}>
              <span className="dot-1" style={{ width: 6, height: 6, borderRadius: '50%', background: '#9ca3af', display: 'inline-block' }} />
              <span className="dot-2" style={{ width: 6, height: 6, borderRadius: '50%', background: '#9ca3af', display: 'inline-block' }} />
              <span className="dot-3" style={{ width: 6, height: 6, borderRadius: '50%', background: '#9ca3af', display: 'inline-block' }} />
            </span>
          )}
          {isStreaming && content && (
            <span className="cursor-blink" style={{ display: 'inline-block', width: 2, height: 14, background: '#fb923c', marginLeft: 2, verticalAlign: 'text-bottom' }} />
          )}
        </div>
      </div>
    </div>
  );
}

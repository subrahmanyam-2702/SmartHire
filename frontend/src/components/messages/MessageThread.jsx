import { useState } from 'react';
import { formatDateTime } from '../../utils/formatDate';

export default function MessageThread({ messages, currentUserId, onSend, sending }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text);
    setText('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m) => {
          const mine = m.sender === currentUserId || m.sender?._id === currentUserId;
          return (
            <div key={m._id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs px-3 py-2 rounded-xl2 text-sm ${
                  mine ? 'bg-brand-600 text-white' : 'bg-slate-100 text-ink'
                }`}
              >
                <p>{m.text}</p>
                <p
                  className={`text-[10px] mt-1 ${mine ? 'text-brand-100' : 'text-slate-400'}`}
                >
                  {formatDateTime(m.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="border-t border-slate-100 p-3 flex gap-2">
        <input
          className="input-field"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" disabled={sending} className="btn-primary shrink-0">
          Send
        </button>
      </form>
    </div>
  );
}

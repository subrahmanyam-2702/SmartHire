import { timeAgo } from '../../utils/formatDate';

export default function ConversationList({ conversations, activeId, onSelect, currentUserId }) {
  if (!conversations.length) {
    return <p className="text-sm text-slate-400 text-center py-10">No messages yet.</p>;
  }

  return (
    <div className="divide-y divide-slate-100">
      {conversations.map((c) => {
        const other = c.participants?.find((p) => p._id !== currentUserId);
        return (
          <button
            key={c._id}
            onClick={() => onSelect(c)}
            className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors ${
              activeId === c._id ? 'bg-brand-50' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="font-medium text-ink text-sm">{other?.name || 'Conversation'}</p>
              <span className="text-xs text-slate-400">{timeAgo(c.lastMessageAt)}</span>
            </div>
            <p className="text-sm text-slate-500 truncate">{c.lastMessage}</p>
            {c.job?.title && <p className="text-xs text-brand-600 mt-0.5">Re: {c.job.title}</p>}
          </button>
        );
      })}
    </div>
  );
}

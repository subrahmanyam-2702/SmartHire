import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getConversations, getMessages, sendMessage } from '../../api/message.api';
import ConversationList from '../../components/messages/ConversationList';
import MessageThread from '../../components/messages/MessageThread';
import { useAuth } from '../../hooks/useAuth';

export default function Messages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);

  const loadConversations = async () => {
    try {
      const { data } = await getConversations();
      setConversations(data.data);
    } catch {
      toast.error('Failed to load conversations');
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  const handleSelect = async (conversation) => {
    setActive(conversation);
    try {
      const { data } = await getMessages(conversation._id);
      setMessages(data.data);
    } catch {
      toast.error('Failed to load messages');
    }
  };

  const handleSend = async (text) => {
    setSending(true);
    try {
      const { data } = await sendMessage(active._id, text);
      setMessages((prev) => [...prev, data.data]);
    } catch {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display font-bold text-3xl text-ink">Messages</h1>
      <p className="text-slate-500 mt-1 mb-6">
        View recruiter invitations and reply to companies.
      </p>

      <div className="grid sm:grid-cols-[280px_1fr] gap-0 border border-slate-200 rounded-xl2 overflow-hidden bg-white h-[520px]">
        <div className="border-r border-slate-100 overflow-y-auto">
          <p className="px-4 py-3 text-sm font-semibold text-ink border-b border-slate-100">
            Conversations
          </p>
          <ConversationList
            conversations={conversations}
            activeId={active?._id}
            onSelect={handleSelect}
            currentUserId={user?.id}
          />
        </div>
        <div>
          {active ? (
            <MessageThread
              messages={messages}
              currentUserId={user?.id}
              onSend={handleSend}
              sending={sending}
            />
          ) : (
            <p className="text-sm text-slate-400 text-center py-24">
              Select a conversation to view messages.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

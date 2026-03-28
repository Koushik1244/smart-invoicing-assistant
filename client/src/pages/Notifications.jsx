import { useEffect, useState } from 'react';
import { getNotifications, markNotificationRead, markAllRead } from '../services/api';

const TYPE_META = {
  invoice_created:  { icon: '🧾', label: 'Invoice Created',   bg: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',  border: 'border-l-indigo-500' },
  reminder_sent:    { icon: '📨', label: 'Reminder Sent',     bg: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',     border: 'border-l-amber-500' },
  escalation:       { icon: '🚨', label: 'Escalation',        bg: 'bg-red-500/10 text-red-400 border border-red-500/20',           border: 'border-l-red-500' },
  payment_received: { icon: '✅', label: 'Payment Received',  bg: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20', border: 'border-l-emerald-500' },
};

const PRIORITY_BADGE = {
  high:   'bg-red-500/15 text-red-400 border border-red-500/25',
  medium: 'bg-amber-500/15 text-amber-400 border border-amber-500/25',
  low:    'bg-gray-500/15 text-gray-400 border border-gray-500/25',
};

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return 'just now';
  if (mins < 60) return `${mins} min${mins > 1 ? 's' : ''} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all | unread | high

  useEffect(() => {
    getNotifications()
      .then(({ data }) => setNotifications(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleMarkRead = async (id) => {
    await markNotificationRead(id).catch(() => {});
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
  };

  const handleMarkAll = async () => {
    await markAllRead().catch(() => {});
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const filtered = notifications.filter(n => {
    if (filter === 'unread')  return !n.read;
    if (filter === 'high')    return n.priority === 'high';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <main className="p-5 md:p-7 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
        <div>
          <h1 className="text-2xl font-bold text-white">Notifications</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAll}
            className="text-sm text-indigo-400 hover:text-indigo-300 font-medium border border-indigo-500/30 px-4 py-2 rounded-xl transition-all"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5">
        {[
          { key: 'all',    label: 'All' },
          { key: 'unread', label: `Unread${unreadCount > 0 ? ` (${unreadCount})` : ''}` },
          { key: 'high',   label: 'High Priority' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium border transition-all ${
              filter === key
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                : 'bg-[#161616] border-[#2a2a2a] text-gray-400 hover:text-white hover:border-[#444]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4].map(i => <div key={i} className="h-20 bg-[#161616] border border-[#232323] rounded-2xl animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#161616] border border-[#232323] rounded-2xl p-12 text-center">
          <p className="text-3xl mb-3">🔔</p>
          <p className="text-gray-400 text-sm font-medium">No notifications here.</p>
          <p className="text-gray-600 text-xs mt-1">
            {filter === 'unread' ? 'All notifications have been read.' : filter === 'high' ? 'No high priority notifications.' : 'Notifications will appear as actions happen.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(n => {
            const meta = TYPE_META[n.type] || TYPE_META.invoice_created;
            return (
              <button
                key={n._id}
                onClick={() => !n.read && handleMarkRead(n._id)}
                className={`w-full text-left bg-[#161616] border rounded-2xl px-5 py-4 transition-all hover:border-[#333] border-l-4 ${
                  n.read ? 'border-[#232323] opacity-70' : `border-[#232323] ${meta.border}`
                }`}
              >
                <div className="flex items-start gap-4">
                  <span className="text-2xl shrink-0 mt-0.5">{meta.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className={`text-sm font-semibold ${n.read ? 'text-gray-300' : 'text-white'}`}>{n.title}</p>
                      {!n.read && <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0" />}
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">{n.message}</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${meta.bg}`}>
                        {meta.label}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${PRIORITY_BADGE[n.priority] || PRIORITY_BADGE.low}`}>
                        {n.priority}
                      </span>
                      <span className="text-[11px] text-gray-600 ml-auto">{timeAgo(n.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </main>
  );
}

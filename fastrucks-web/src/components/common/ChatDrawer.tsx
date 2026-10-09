import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Job } from '../../types';
import { Send, X, MessageSquare, Phone, Truck, Building2, ShieldCheck, Clock } from 'lucide-react';

interface ChatDrawerProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({ job, isOpen, onClose }) => {
  const { chatMessages, sendChatMessage, currentUser, users } = useApp();
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const jobMessages = chatMessages.filter((m) => m.jobId === job.id);
  const otherParty =
    currentUser.role === 'supplier'
      ? users.find((u) => u.id === job.assignedTransporterId)
      : users.find((u) => u.id === job.supplierId);

  const quickReplies = [
    'Arrived at the loading bay, preparing vehicle.',
    'Rest / Meal break logged: taking 25 mins.',
    'Queue at KeNHA weighbridge is moving smoothly.',
    'Estimated arrival in 45 minutes.',
    'Consignee is on site ready for offloading.',
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;
    sendChatMessage(job.id, text.trim());
    if (!textToSend) setInputText('');
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col animate-slide-left">
      {/* Header */}
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            {currentUser.role === 'supplier' ? <Truck className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-bold truncate text-slate-100">
              {otherParty?.name || (currentUser.role === 'supplier' ? 'Transporter' : 'Supplier')}
            </h4>
            <p className="text-[11px] text-slate-400 truncate">
              {otherParty?.phone || job.supplierPhone} • {job.origin} ➔ {job.destination}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Shipment Reference Info Pill */}
      <div className="bg-amber-50 dark:bg-amber-950/30 px-4 py-2 border-b border-amber-200 dark:border-amber-900/40 flex items-center justify-between text-xs">
        <span className="text-amber-800 dark:text-amber-300 font-medium truncate">
          Job #{job.id.substring(4)}: {job.title}
        </span>
        <span className="font-bold text-amber-900 dark:text-amber-200 ml-2 shrink-0">
          KES {job.agreedPriceKes?.toLocaleString() || job.offeredPriceKes.toLocaleString()}
        </span>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {jobMessages.length === 0 ? (
          <div className="text-center py-12 text-slate-400 space-y-2">
            <MessageSquare className="w-8 h-8 mx-auto opacity-40" />
            <p className="text-xs">No direct messages yet on this shipment.</p>
            <p className="text-[11px]">Send a message to coordinate loading, route or gates.</p>
          </div>
        ) : (
          jobMessages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-1.5 mb-0.5 text-[10px] text-slate-400">
                  <span className="font-semibold text-slate-600 dark:text-slate-300">{msg.senderName}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                    isMe
                      ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-none'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Quick Replies Chips */}
      <div className="px-3 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 overflow-x-auto whitespace-nowrap space-x-1.5 scrollbar-thin">
        {quickReplies.map((reply, i) => (
          <button
            key={i}
            onClick={() => handleSend(reply)}
            className="inline-block text-[10px] font-medium px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-amber-400 hover:text-amber-500 transition"
          >
            {reply}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type message or update..."
          className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-slate-950 font-bold transition shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

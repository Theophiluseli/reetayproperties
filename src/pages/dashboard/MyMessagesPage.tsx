import React, { useEffect, useState } from 'react';
import { dataService } from '../../lib/supabase';
import { Conversation, Message } from '../../types';
import { Send, MessageSquare, ShieldCheck } from 'lucide-react';

export const MyMessagesPage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string>('conv-1');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    dataService.getConversations().then((convs) => {
      setConversations(convs);
      if (convs.length > 0) {
        setActiveConvId(convs[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (activeConvId) {
      dataService.getMessages(activeConvId).then(setMessages);
    }
  }, [activeConvId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const newMsg = await dataService.sendMessage(activeConvId, inputText);
    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
  };

  const activeConv = conversations.find((c) => c.id === activeConvId);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-black text-navy-950">My Messages & VIP Concierge Desk</h1>
        <p className="text-xs text-gray-500 font-medium">Real-time support and host communication</p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-3 h-[600px]">
        
        {/* Left: Threads */}
        <div className="border-r border-gray-100 bg-gray-50/50 p-4 space-y-3 overflow-y-auto">
          <span className="text-[10px] uppercase font-bold text-gray-400 block px-2">Conversations</span>
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setActiveConvId(conv.id)}
              className={`p-3 rounded-2xl cursor-pointer flex items-center gap-3 transition-all ${
                conv.id === activeConvId ? 'bg-white shadow-sm border border-gray-200 ring-2 ring-gold-500/20' : 'hover:bg-white/60'
              }`}
            >
              <img src={conv.avatar} alt={conv.title} className="w-10 h-10 rounded-full object-cover" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-navy-950 truncate">{conv.title}</p>
                <p className="text-[10px] text-gray-400 truncate">{conv.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Messages Box */}
        <div className="md:col-span-2 flex flex-col justify-between h-full bg-white">
          
          {/* Header */}
          {activeConv && (
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
              <div className="flex items-center gap-3">
                <img src={activeConv.avatar} alt={activeConv.title} className="w-9 h-9 rounded-full object-cover" />
                <div>
                  <h4 className="text-xs font-extrabold text-navy-950">{activeConv.title}</h4>
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Concierge Online
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Body */}
          <div className="p-4 space-y-4 overflow-y-auto flex-1 bg-[#FAFAFC]">
            {messages.map((msg) => {
              const isMe = !msg.is_admin;
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-[80%] ${isMe ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  <img src={msg.sender_avatar} alt={msg.sender_name} className="w-7 h-7 rounded-full object-cover" />
                  <div>
                    <div className={`p-3.5 rounded-2xl text-xs ${
                      isMe ? 'bg-navy-950 text-white rounded-tr-none' : 'bg-white text-navy-950 border border-gray-200 rounded-tl-none shadow-sm'
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-gray-400 mt-1 block">{msg.created_at}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Input */}
          <form onSubmit={handleSend} className="p-3 border-t border-gray-100 flex items-center gap-2 bg-white">
            <input
              type="text"
              placeholder="Write a message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-xs font-medium text-navy-950 outline-none"
            />
            <button
              type="submit"
              className="w-10 h-10 rounded-full bg-gold-500 hover:bg-gold-600 text-navy-950 flex items-center justify-center shadow-md active:scale-95 transition-all"
            >
              <Send className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};

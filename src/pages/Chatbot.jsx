import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Send, Mic, Paperclip, MoreVertical, 
  Search, Plus, Brain, User, Smile
} from 'lucide-react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { API_BASE } from '../config/api';

// Bug #7 fix: removed onKeyPress (deprecated), using onKeyDown instead
// Bug #8 fix: read user name from localStorage
// Bug #1 fix: chat messages are now sent/received via REST API and persisted in DB
// Bug #21 fix: typing indicator auto-clears after 10s timeout to prevent stuck state

const TYPING_TIMEOUT_MS = 10000;

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your AI Healthcare Assistant. How can I help you today?", sender: 'ai', timestamp: new Date() }
  ]);
  const [sessions, setSessions] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const typingTimerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const token = localStorage.getItem('token');
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userInitial = currentUser.name ? currentUser.name[0].toUpperCase() : 'U';
  const userName = currentUser.name || 'User';

  // Connect to Socket.io only for real-time reminder alerts (not chat)
  useEffect(() => {
    const newSocket = io(API_BASE, { auth: { token } });

    newSocket.on('reminder_alert', (data) => {
      // Show a system message in chat when a reminder fires
      setMessages(prev => [...prev, {
        text: `🔔 Reminder: ${data.message}`,
        sender: 'ai',
        timestamp: new Date()
      }]);
    });

    // Bug #21 fix: handle socket error so typing state doesn't get stuck
    newSocket.on('connect_error', () => {
      setTyping(false);
    });

    return () => newSocket.close();
  }, [token]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  // Bug #1 fix: fetch or create a chat session on mount
  const initSession = useCallback(async () => {
    try {
      const sessRes = await axios.get(`${API_BASE}/api/v1/chat`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const existingSessions = sessRes.data.data;
      setSessions(existingSessions);

      if (existingSessions.length > 0) {
        // Load the most recent session's messages
        const latest = existingSessions[0];
        const msgRes = await axios.get(`${API_BASE}/api/v1/chat/${latest._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const loadedMessages = msgRes.data.data.messages || [];
        if (loadedMessages.length > 0) {
          setMessages(loadedMessages.map(m => ({ ...m, timestamp: new Date(m.timestamp || Date.now()) })));
        }
        setSessionId(latest._id);
      } else {
        // Create a new session
        const newSess = await axios.post(`${API_BASE}/api/v1/chat`, { title: 'New Conversation' }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSessionId(newSess.data.data._id);
        setSessions([newSess.data.data]);
      }
    } catch (err) {
      console.error('Failed to init chat session:', err);
    }
  }, [token]);

  useEffect(() => {
    initSession();
  }, [initSession]);

  const startNewChat = async () => {
    try {
      const newSess = await axios.post(`${API_BASE}/api/v1/chat`, { title: 'New Conversation' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSessionId(newSess.data.data._id);
      setSessions(prev => [newSess.data.data, ...prev]);
      setMessages([{ text: "Hello! I'm your AI Healthcare Assistant. How can I help you today?", sender: 'ai', timestamp: new Date() }]);
    } catch (err) {
      console.error('Failed to create session:', err);
    }
  };

  const handleSend = async (textOverride) => {
    const text = textOverride || input;
    if (!text.trim()) return;

    // Immediately show user message
    const userMsg = { text, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    // Bug #21 fix: safety timeout to clear typing if no response arrives
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => setTyping(false), TYPING_TIMEOUT_MS);

    try {
      let currentSessionId = sessionId;

      // Create a session if we don't have one yet
      if (!currentSessionId) {
        const newSess = await axios.post(`${API_BASE}/api/v1/chat`, { title: text.slice(0, 30) }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        currentSessionId = newSess.data.data._id;
        setSessionId(currentSessionId);
        setSessions(prev => [newSess.data.data, ...prev]);
      }

      // Bug #1 fix: send via REST — persists both user message and AI response in DB
      const res = await axios.post(
        `${API_BASE}/api/v1/chat/${currentSessionId}/messages`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      clearTimeout(typingTimerRef.current);
      setTyping(false);

      const aiMsg = res.data.data;
      setMessages(prev => [...prev, { ...aiMsg, timestamp: new Date(aiMsg.timestamp || Date.now()) }]);
    } catch (err) {
      clearTimeout(typingTimerRef.current);
      setTyping(false);
      setMessages(prev => [...prev, {
        text: 'Sorry, I am having trouble connecting to the AI service right now. Please try again.',
        sender: 'ai',
        timestamp: new Date()
      }]);
    }
  };

  // Bug #7 fix: use onKeyDown instead of deprecated onKeyPress
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) handleSend();
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      
      {/* Sidebar - History */}
      <div className="hidden lg:flex flex-col w-80 border-r border-slate-200/30 dark:border-slate-700/30 flex-shrink-0">
        <div className="p-4 border-b border-slate-100 dark:border-slate-700">
          <button
            onClick={startNewChat}
            className="w-full flex items-center justify-center gap-2 p-3 bg-gradient-premium text-white rounded-xl font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-0.5"
          >
            <Plus size={18} /> New Chat
          </button>
        </div>

        <div className="p-4 border-b border-slate-100 dark:border-slate-700">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search chats..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm bg-slate-50 dark:bg-slate-800 dark:text-white"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-2 px-2">Recent Conversations</p>
          {sessions.map((sess) => (
            <div
              key={sess._id}
              onClick={async () => {
                try {
                  const msgRes = await axios.get(`${API_BASE}/api/v1/chat/${sess._id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                  });
                  const loadedMessages = msgRes.data.data.messages || [];
                  setMessages(loadedMessages.length > 0
                    ? loadedMessages.map(m => ({ ...m, timestamp: new Date(m.timestamp || Date.now()) }))
                    : [{ text: "Hello! I'm your AI Healthcare Assistant.", sender: 'ai', timestamp: new Date() }]
                  );
                  setSessionId(sess._id);
                } catch (err) { console.error(err); }
              }}
              className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors group ${
                sessionId === sess._id ? 'bg-primary/10 dark:bg-primary/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <MessageSquare size={16} />
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">{sess.title}</h4>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                    {new Date(sess.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {sessions.length === 0 && (
            <p className="text-xs text-slate-400 text-center py-4">No conversations yet</p>
          )}
        </div>

      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">

        {/* Chat Header */}
        <div className="glass dark:bg-slate-900/50 dark:border-slate-800 p-4 border-b border-slate-200/30 flex justify-between items-center relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-premium flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <Brain size={24} />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                AI Health Assistant 
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Always active • Secure & Private</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
              <Search size={20} />
            </button>
            <button className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
              <MoreVertical size={20} />
            </button>
          </div>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10">
          {messages.map((msg, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                  msg.sender === 'user' ? 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border dark:border-slate-700' : 'bg-gradient-premium text-white'
                }`}>
                  {msg.sender === 'user' ? <User size={16} /> : <Brain size={16} />}
                </div>
                
                <div>
                  <div className={`p-4 rounded-2xl ${
                    msg.sender === 'user' 
                      ? 'bg-gradient-premium text-white shadow-lg shadow-primary/10 rounded-tr-none' 
                      : 'glass dark:bg-slate-900/50 dark:border-slate-800 p-4 rounded-2xl border-white/60 shadow-sm rounded-tl-none'
                  }`}>
                    <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                  </div>
                  <p className={`text-xs text-slate-400 dark:text-slate-500 font-medium mt-1.5 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Typing Indicator */}
          <AnimatePresence>
            {typing && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex justify-start"
              >
                <div className="flex gap-3 max-w-[80%]">
                  <div className="w-8 h-8 rounded-full bg-gradient-premium flex items-center justify-center text-white shrink-0 shadow-sm">
                    <Brain size={16} />
                  </div>
                  <div className="glass dark:bg-slate-900/50 dark:border-slate-800 p-4 rounded-2xl border-white/60 shadow-sm rounded-tl-none flex items-center gap-1.5 h-11">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestions */}
        <div className="px-6 py-2 flex gap-2 overflow-x-auto relative z-10 no-scrollbar">
          {[
            "What medicines do I take today?",
            "Show my adherence report",
            "Next reminder time?",
            "How to take Amoxicillin?"
          ].map((suggestion, idx) => (
            <button 
              key={idx}
              onClick={() => handleSend(suggestion)}
              className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-200 dark:hover:border-slate-600 transition-all hover:-translate-y-0.5 shrink-0 shadow-sm rounded-full"
            >
              {suggestion}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-6 relative z-10">
          <div className="glass dark:bg-slate-900/50 dark:border-slate-800 p-2 rounded-2xl border-white/60 shadow-lg flex items-center gap-2">
            <button className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
              <Smile size={20} />
            </button>
            <button className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
              <Paperclip size={20} />
            </button>
            <input 
              type="text" 
              placeholder="Ask me anything about your health..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 px-2"
            />
            <button className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
              <Mic size={20} />
            </button>
            <button 
              onClick={() => handleSend()}
              disabled={typing}
              className="p-3 bg-gradient-premium text-white rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-0.5 flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;

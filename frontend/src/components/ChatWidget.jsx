import { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Trash2, Bot, User, Loader2 } from 'lucide-react';
import { chatAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function ChatWidget() {
  const { user } = useSelector((s) => s.auth);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [remaining, setRemaining] = useState(10);
  const [loaded, setLoaded] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Load chat history when opened
  useEffect(() => {
    if (open && !loaded) {
      chatAPI.getHistory()
        .then((res) => {
          setMessages(res.data.messages || []);
          setRemaining(res.data.remaining ?? 10);
          setLoaded(true);
        })
        .catch(() => setLoaded(true));
    }
  }, [open, loaded]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, sending]);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 200);
  }, [open]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || sending) return;
    if (remaining <= 0) {
      toast.error('Daily limit reached! Come back tomorrow.');
      return;
    }

    setInput('');
    setSending(true);

    // Optimistic: add user message
    const userMsg = { role: 'user', content: text, _id: Date.now().toString() };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await chatAPI.sendMessage(text);
      const assistantMsg = { role: 'assistant', content: res.data.reply, _id: (Date.now() + 1).toString() };
      setMessages((prev) => [...prev, assistantMsg]);
      setRemaining(res.data.remaining ?? remaining - 1);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to get response';
      if (err.response?.status === 429) {
        setRemaining(0);
      }
      toast.error(errMsg);
      // Remove optimistic user message on error
      setMessages((prev) => prev.filter((m) => m._id !== userMsg._id));
      setInput(text); // restore input
    } finally {
      setSending(false);
    }
  }, [input, sending, remaining]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = async () => {
    try {
      await chatAPI.clearHistory();
      setMessages([]);
      toast.success('Chat cleared');
    } catch {
      toast.error('Failed to clear chat');
    }
  };

  return (
    <>
      {/* Floating toggle */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-accent text-white rounded-full shadow-lg flex items-center justify-center md:bottom-8 md:right-8 hover:shadow-accent/30 hover:shadow-xl transition-shadow"
        title="AI Coach"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed bottom-24 right-6 z-50 w-[370px] max-h-[520px] bg-surface border border-surface-border rounded-2xl shadow-xl flex flex-col overflow-hidden md:bottom-28 md:right-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-surface-border bg-accent/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-accent/15 rounded-lg flex items-center justify-center">
                  <Bot className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="font-heading font-bold text-[var(--text-main)] text-sm tracking-wide uppercase">
                    AI Coach
                  </p>
                  <p className="text-[10px] text-muted">
                    {remaining > 0 ? `${remaining} message${remaining !== 1 ? 's' : ''} left today` : 'Daily limit reached'}
                  </p>
                </div>
              </div>
              {messages.length > 0 && (
                <button
                  onClick={handleClear}
                  className="p-1.5 rounded-lg text-dim hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Clear chat"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Messages area */}
            <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto min-h-[240px] max-h-[340px] space-y-3 scroll-smooth">
              {messages.length === 0 && !sending && (
                <div className="h-full flex flex-col items-center justify-center text-center gap-3 py-8">
                  <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center">
                    <Bot className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-main)]">Hey{user?.name ? `, ${user.name.split(' ')[0]}` : ''}! 👋</p>
                    <p className="text-xs text-muted mt-1 max-w-[240px]">
                      I'm your AI gym coach. Ask me about exercises, form tips, nutrition, or anything fitness related!
                    </p>
                  </div>
                </div>
              )}

              {messages.map((msg) => (
                <motion.div
                  key={msg._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                  className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    msg.role === 'user' ? 'bg-accent/15' : 'bg-surface-light'
                  }`}>
                    {msg.role === 'user' ? (
                      user?.avatar ? (
                        <img src={user.avatar} alt="" className="w-7 h-7 rounded-lg object-cover" />
                      ) : (
                        <User className="w-3.5 h-3.5 text-accent" />
                      )
                    ) : (
                      <Bot className="w-3.5 h-3.5 text-muted" />
                    )}
                  </div>

                  {/* Bubble */}
                  <div className={`max-w-[80%] px-3.5 py-2.5 rounded-xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-accent text-white rounded-tr-sm'
                      : 'bg-surface-light/60 text-[var(--text-main)] rounded-tl-sm border border-surface-border'
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {sending && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2.5"
                >
                  <div className="w-7 h-7 rounded-lg bg-surface-light flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3.5 h-3.5 text-muted" />
                  </div>
                  <div className="bg-surface-light/60 border border-surface-border rounded-xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-muted rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-2 h-2 bg-muted rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 bg-muted rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-surface-border flex gap-2">
              <input
                ref={inputRef}
                type="text"
                className="flex-1 bg-surface border border-surface-border rounded-xl px-4 py-2.5 text-sm text-[var(--text-main)] placeholder:text-dim focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/50 transition-all"
                placeholder={remaining > 0 ? 'Ask your coach...' : 'Daily limit reached'}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={sending || remaining <= 0}
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleSend}
                disabled={sending || !input.trim() || remaining <= 0}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  sending || !input.trim() || remaining <= 0
                    ? 'bg-surface-light text-dim cursor-not-allowed'
                    : 'bg-accent text-white hover:bg-accent-hover'
                }`}
              >
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

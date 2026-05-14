'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Sparkles, User, Bot, Loader2, Bookmark } from 'lucide-react';
import { ChatService } from '@/services/ai/ChatService';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatAssistantProps {
  sessionId: string;
}

export const ChatAssistant = ({ sessionId }: ChatAssistantProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      let assistantContent = '';
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      await ChatService.ask(sessionId, input, (chunk) => {
        assistantContent += chunk;
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last.role === 'assistant') {
            return [...prev.slice(0, -1), { ...last, content: assistantContent }];
          }
          return prev;
        });
      });
    } catch (err) {
      console.error('Chat failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-muted/5 border-l border-border">
      {/* Chat Header */}
      <div className="p-6 border-b border-border flex items-center justify-between">
        <h3 className="font-bold flex items-center space-x-2">
          <MessageSquare className="w-4 h-4 text-accent" />
          <span>AI Assistant</span>
        </h3>
        <Sparkles className="w-4 h-4 text-accent/40 animate-pulse" />
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-accent/10 flex items-center justify-center text-accent">
              <Bot className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-lg">Ask about this meeting</h4>
              <p className="text-sm text-muted-foreground max-w-[240px]">
                I can summarize decisions, find specific quotes, or explain context.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-2 w-full max-w-[280px]">
              {[
                "What were the key decisions?",
                "What are my action items?",
                "Summarize the main topics."
              ].map((q) => (
                <button 
                  key={q}
                  onClick={() => setInput(q)}
                  className="text-xs p-3 border border-border rounded-xl hover:bg-muted text-left transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] space-y-2 ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1 ${m.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {m.role === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3 text-accent" />}
                  <span>{m.role === 'user' ? 'You' : 'Riverr AI'}</span>
                </div>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user' ? 'bg-accent text-white shadow-lg shadow-accent/10' : 'bg-background border border-border prose prose-sm dark:prose-invert'
                }`}>
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))
        )}
        {loading && messages[messages.length - 1]?.role !== 'assistant' && (
          <div className="flex justify-start">
             <div className="bg-background border border-border p-4 rounded-2xl">
               <Loader2 className="w-4 h-4 animate-spin text-accent" />
             </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 border-t border-border bg-background">
        <div className="relative group">
          <textarea 
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            placeholder="Ask anything..."
            className="w-full pl-6 pr-14 py-4 bg-muted/50 border border-border rounded-2xl outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all resize-none overflow-hidden"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-accent text-white rounded-xl hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-accent/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-4 flex items-center justify-center space-x-1">
          <Bookmark className="w-3 h-3" />
          <span>AI answers are grounded in this transcript.</span>
        </p>
      </div>
    </div>
  );
};

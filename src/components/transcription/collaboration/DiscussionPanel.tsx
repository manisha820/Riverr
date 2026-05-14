'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Send, CheckCircle2, User, Clock, Reply } from 'lucide-react';
import { CommentService } from '@/services/collaboration/CommentService';
import { format } from 'date-fns';

interface DiscussionPanelProps {
  sessionId: string;
}

export const DiscussionPanel = ({ sessionId }: DiscussionPanelProps) => {
  const [comments, setComments] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadComments() {
      try {
        const data = await CommentService.getComments(sessionId);
        setComments(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadComments();
  }, [sessionId]);

  const handlePost = async () => {
    if (!input.trim()) return;
    try {
      const mockUserId = '00000000-0000-0000-0000-000000000000';
      const newComment = await CommentService.postComment(sessionId, input, mockUserId);
      setComments(prev => [...prev, newComment]);
      setInput('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="h-full flex flex-col bg-background border-l border-border">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <h3 className="font-bold flex items-center space-x-2">
          <MessageSquare className="w-4 h-4" />
          <span>Discussion</span>
        </h3>
        <span className="text-[10px] font-bold bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
          {comments.length} Comments
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {loading ? (
          <div className="text-center py-10 text-sm text-muted-foreground italic">Loading discussion...</div>
        ) : comments.length === 0 ? (
          <div className="text-center py-10 space-y-4">
            <MessageSquare className="w-8 h-8 text-muted-foreground/20 mx-auto" />
            <p className="text-sm text-muted-foreground italic">No comments yet. Start the conversation.</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold">Team Member</span>
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {format(new Date(comment.created_at), 'HH:mm')}
                </span>
              </div>
              <div className="pl-8 space-y-2">
                <p className="text-sm leading-relaxed text-foreground/80">
                  {comment.content}
                </p>
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-1 text-[10px] font-bold text-muted-foreground hover:text-accent transition-colors">
                    <Reply className="w-3 h-3" />
                    <span>Reply</span>
                  </button>
                  <button 
                    onClick={() => CommentService.resolveComment(comment.id)}
                    className={`flex items-center space-x-1 text-[10px] font-bold transition-colors ${
                      comment.is_resolved ? 'text-green-500' : 'text-muted-foreground hover:text-green-500'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{comment.is_resolved ? 'Resolved' : 'Resolve'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-6 border-t border-border bg-muted/5">
        <div className="relative">
          <textarea 
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add a comment..."
            className="w-full p-4 pr-12 bg-background border border-border rounded-2xl text-sm outline-none focus:border-accent transition-all resize-none"
          />
          <button 
            onClick={handlePost}
            className="absolute right-3 bottom-3 p-2 bg-accent text-white rounded-xl hover:opacity-90 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

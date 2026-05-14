'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Check, Loader2, History } from 'lucide-react';

interface EditableSegmentProps {
  id: string;
  initialText: string;
  timestamp?: string;
  onSave: (text: string) => Promise<void>;
}

export const EditableSegment = ({ id, initialText, timestamp, onSave }: EditableSegmentProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(initialText);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(text.length, text.length);
      // Auto-resize
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = async () => {
    if (hasChanges) {
      await commitSave();
    }
    setIsEditing(false);
  };

  const commitSave = async () => {
    if (text === initialText) return;
    setSaving(true);
    try {
      await onSave(text);
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to save segment:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      textareaRef.current?.blur();
    }
    if (e.key === 'Escape') {
      setText(initialText);
      setIsEditing(false);
      setHasChanges(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    setHasChanges(true);
    // Dynamic resize
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <div className="group relative py-2 px-4 rounded-xl hover:bg-muted/30 transition-all cursor-text" onDoubleClick={handleDoubleClick}>
      {/* Timestamp Sidebar */}
      <div className="absolute -left-12 top-3 text-[10px] font-mono text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
        <span>{timestamp || '--:--'}</span>
      </div>

      {/* Save Status */}
      <div className="absolute -right-8 top-3 opacity-0 group-hover:opacity-100 transition-opacity">
        {saving ? (
          <Loader2 className="w-3 h-3 text-accent animate-spin" />
        ) : hasChanges ? (
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        ) : (
          <History className="w-3 h-3 text-muted-foreground hover:text-accent cursor-pointer" />
        )}
      </div>

      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent font-serif leading-relaxed text-xl resize-none outline-none focus:ring-0 p-0 overflow-hidden"
          rows={1}
        />
      ) : (
        <p className={`font-serif leading-relaxed text-xl ${hasChanges ? 'text-accent/80' : ''}`}>
          {text}
        </p>
      )}
    </div>
  );
};

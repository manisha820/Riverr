'use client';

import { useState } from 'react';
import { Sparkles, Loader2, Copy, Check, RotateCcw, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { AIService } from '@/services/ai/AIService';

interface SummaryPanelProps {
  sessionId: string;
  transcript: string;
}

export const SummaryPanel = ({ sessionId, transcript }: SummaryPanelProps) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generateSummary = async () => {
    if (!transcript) return;
    setLoading(true);
    setError(null);
    try {
      const result = await AIService.summarize(sessionId, transcript);
      setSummary(result.content);
    } catch (err) {
      setError('Failed to generate summary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!summary) return;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-muted/5 border-l border-border">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <h3 className="font-bold flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-accent" />
          <span>AI Intelligence</span>
        </h3>
        {summary && (
          <div className="flex items-center space-x-2">
            <button 
              onClick={copyToClipboard}
              className="p-2 hover:bg-muted rounded-lg transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
            <button 
              onClick={generateSummary}
              className="p-2 hover:bg-muted rounded-lg transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center space-y-4 text-center">
            <Loader2 className="w-8 h-8 text-accent animate-spin" />
            <div className="space-y-1">
              <p className="font-bold">Distilling Insights...</p>
              <p className="text-xs text-muted-foreground max-w-[200px]">
                Our AI is analyzing your conversation for key takeaways.
              </p>
            </div>
          </div>
        ) : summary ? (
          <div className="prose prose-sm dark:prose-invert max-w-none animate-in fade-in slide-in-from-bottom-2">
            <ReactMarkdown>{summary}</ReactMarkdown>
          </div>
        ) : error ? (
          <div className="h-full flex flex-col items-center justify-center space-y-4 text-center text-red-500">
            <AlertCircle className="w-8 h-8" />
            <p className="text-sm font-medium">{error}</p>
            <button 
              onClick={generateSummary}
              className="px-4 py-2 bg-red-500/10 rounded-lg text-xs font-bold hover:bg-red-500/20 transition-all"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center space-y-6 text-center">
            <div className="w-16 h-16 rounded-3xl bg-accent/10 flex items-center justify-center text-accent">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-lg">No Summary Yet</h4>
              <p className="text-sm text-muted-foreground max-w-[240px]">
                Generate a smart summary and action items from your transcript.
              </p>
            </div>
            <button 
              onClick={generateSummary}
              disabled={!transcript}
              className="px-8 py-3 bg-accent text-white rounded-2xl font-bold shadow-lg shadow-accent/20 hover:opacity-90 disabled:opacity-50 transition-all"
            >
              Generate Summary
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

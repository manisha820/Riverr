'use client';

import { useState } from 'react';
import { Sparkles, ArrowRight, X, Info, Users, FileText, Zap, AlertTriangle } from 'lucide-react';

interface RecommendationCardProps {
  type: string;
  title: string;
  content: string;
  reasoning: string;
  onDismiss?: () => void;
  onAction?: () => void;
}

export const RecommendationCard = ({ type, title, content, reasoning, onDismiss, onAction }: RecommendationCardProps) => {
  const [showReasoning, setShowReasoning] = useState(false);

  const getIcon = () => {
    switch (type) {
      case 'people_collaboration': return <Users className="w-5 h-5" />;
      case 'related_knowledge': return <FileText className="w-5 h-5" />;
      case 'predictive_risk': return <AlertTriangle className="w-5 h-5" />;
      case 'workflow_action': return <Zap className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  const getColor = () => {
    switch (type) {
      case 'predictive_risk': return 'red-500';
      case 'people_collaboration': return 'green-500';
      default: return 'accent';
    }
  };

  return (
    <div className="p-8 rounded-[40px] border border-border bg-background shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden">
      <div className={`absolute top-0 left-0 w-1 h-full bg-${getColor()}`} />
      
      <div className="flex items-start justify-between mb-6">
        <div className={`w-12 h-12 rounded-2xl bg-${getColor()}/10 flex items-center justify-center text-${getColor()} group-hover:scale-110 transition-transform`}>
          {getIcon()}
        </div>
        <button onClick={onDismiss} className="p-2 hover:bg-muted rounded-full transition-colors">
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground">{type.replace(/_/g, ' ')}</h4>
          <h3 className="text-xl font-bold">{title}</h3>
        </div>
        
        <p className="text-sm leading-relaxed text-muted-foreground">
          {content}
        </p>

        {showReasoning && (
          <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
              <Info className="w-3 h-3" />
              <span>AI Reasoning</span>
            </div>
            <p className="text-xs italic leading-relaxed">
              {reasoning}
            </p>
          </div>
        )}

        <div className="pt-4 flex items-center space-x-3">
          <button 
            onClick={onAction}
            className="flex-1 py-3 bg-accent text-white rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center justify-center space-x-2 hover:opacity-90 transition-all shadow-lg shadow-accent/20"
          >
            <span>Take Action</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setShowReasoning(!showReasoning)}
            className="p-3 bg-muted rounded-2xl text-muted-foreground hover:bg-border transition-all"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

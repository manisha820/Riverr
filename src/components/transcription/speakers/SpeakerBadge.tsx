'use client';

import { User, CheckCircle2, ChevronDown } from 'lucide-react';

interface SpeakerBadgeProps {
  name: string;
  isConfirmed?: boolean;
  color?: string;
  onClick?: () => void;
}

export const SpeakerBadge = ({ name, isConfirmed, color = 'accent', onClick }: SpeakerBadgeProps) => {
  return (
    <button 
      onClick={onClick}
      className={`group flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-transparent hover:border-border hover:bg-muted/50 transition-all`}
    >
      <div className={`w-6 h-6 rounded-lg bg-${color}/10 border border-${color}/20 flex items-center justify-center text-${color}`}>
        <User className="w-3.5 h-3.5" />
      </div>
      <span className="text-xs font-bold tracking-tight text-foreground/80 group-hover:text-foreground transition-colors">
        {name}
      </span>
      {isConfirmed && (
        <CheckCircle2 className="w-3 h-3 text-green-500" />
      )}
      <ChevronDown className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
};

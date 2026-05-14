'use client';

import { ReactNode } from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface IntelligenceCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  icon: ReactNode;
}

export const IntelligenceCard = ({ title, value, subtitle, trend, trendValue, icon }: IntelligenceCardProps) => {
  return (
    <div className="p-8 rounded-[40px] border border-border bg-muted/10 glass hover:bg-muted/20 transition-all group">
      <div className="flex items-start justify-between mb-6">
        <div className="w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
            trend === 'up' ? 'bg-green-500/10 text-green-500' : 
            trend === 'down' ? 'bg-red-500/10 text-red-500' : 'bg-muted text-muted-foreground'
          }`}>
            {trend === 'up' && <ArrowUpRight className="w-3 h-3" />}
            {trend === 'down' && <ArrowDownRight className="w-3 h-3" />}
            {trend === 'stable' && <Minus className="w-3 h-3" />}
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{title}</h3>
        <div className="flex items-baseline space-x-2">
          <span className="text-4xl font-serif font-bold">{value}</span>
          {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
        </div>
      </div>
    </div>
  );
};

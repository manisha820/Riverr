'use client';

import { Users, PieChart, Clock } from 'lucide-react';

interface SpeakerStats {
  name: string;
  time: string;
  percentage: number;
  color: string;
}

export const SpeakerActivity = () => {
  const speakers: SpeakerStats[] = [
    { name: 'Manish (You)', time: '14:20', percentage: 65, color: 'accent' },
    { name: 'Speaker A', time: '08:15', percentage: 35, color: 'blue-500' },
  ];

  return (
    <div className="p-6 rounded-[32px] border border-border glass space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold flex items-center space-x-2">
          <Users className="w-4 h-4" />
          <span>Speaker Activity</span>
        </h3>
        <PieChart className="w-4 h-4 text-muted-foreground" />
      </div>

      <div className="space-y-4">
        {speakers.map((s) => (
          <div key={s.name} className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold">{s.name}</span>
              <span className="text-muted-foreground flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{s.time}</span>
              </span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-accent rounded-full" 
                style={{ width: `${s.percentage}%` }} 
              />
            </div>
          </div>
        ))}
      </div>

      <button className="w-full py-2 text-[10px] uppercase font-bold tracking-widest text-muted-foreground hover:text-accent transition-colors">
        Manage Identities
      </button>
    </div>
  );
};

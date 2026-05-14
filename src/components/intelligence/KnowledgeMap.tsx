'use client';

import { Share2, GitBranch, Target, Zap, Users, AlertCircle } from 'lucide-react';

export const KnowledgeMap = () => {
  // Mock Graph Data
  const nodes = [
    { id: 1, name: 'Marketing', type: 'project', color: 'accent' },
    { id: 2, name: 'Q3 Budget', type: 'topic', color: 'blue-500' },
    { id: 3, name: 'Deployment', type: 'risk', color: 'red-500' },
    { id: 4, name: 'Manish', type: 'person', color: 'green-500' },
  ];

  return (
    <div className="p-10 rounded-[48px] border border-border bg-muted/5 relative overflow-hidden min-h-[400px]">
      <div className="absolute top-10 left-10 space-y-2 z-10">
        <h3 className="text-3xl font-serif font-bold flex items-center space-x-3">
          <Share2 className="w-6 h-6 text-accent" />
          <span>Knowledge Graph</span>
        </h3>
        <p className="text-sm text-muted-foreground">Visualizing relationships across your workspace.</p>
      </div>

      <div className="absolute top-10 right-10 flex space-x-2 z-10">
        <div className="px-4 py-2 bg-background border border-border rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center space-x-2">
          <Zap className="w-3 h-3 text-accent" />
          <span>Real-time Mapping</span>
        </div>
      </div>

      {/* Mock Graph Visualization */}
      <div className="relative h-[300px] mt-20 flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--accent)_0%,transparent_70%)] opacity-[0.03]" />
        
        {/* Placeholder for a real D3.js or Force-Graph */}
        <div className="flex flex-wrap items-center justify-center gap-12">
          {nodes.map((node) => (
            <div key={node.id} className="relative group cursor-pointer">
               <div className={`w-24 h-24 rounded-full border border-border bg-background flex flex-col items-center justify-center space-y-2 shadow-xl transition-all group-hover:scale-110 group-hover:border-${node.color}`}>
                  {node.type === 'person' && <Users className={`w-6 h-6 text-${node.color}`} />}
                  {node.type === 'project' && <GitBranch className={`w-6 h-6 text-${node.color}`} />}
                  {node.type === 'topic' && <Target className={`w-6 h-6 text-${node.color}`} />}
                  {node.type === 'risk' && <AlertCircle className={`w-6 h-6 text-${node.color}`} />}
                  <span className="text-[10px] font-bold text-center px-2">{node.name}</span>
               </div>
               
               {/* Link Lines Placeholder */}
               <div className="absolute top-1/2 left-full w-12 h-[1px] bg-border -translate-y-1/2 hidden group-last:hidden group-hover:block" />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-10 left-10 right-10 flex items-center justify-between border-t border-border/50 pt-6">
        <div className="flex space-x-6">
           <div className="flex items-center space-x-2 text-[10px] text-muted-foreground uppercase font-bold">
             <div className="w-2 h-2 rounded-full bg-accent" />
             <span>Active Projects</span>
           </div>
           <div className="flex items-center space-x-2 text-[10px] text-muted-foreground uppercase font-bold">
             <div className="w-2 h-2 rounded-full bg-green-500" />
             <span>Team Network</span>
           </div>
        </div>
        <button className="text-xs font-bold text-accent hover:underline">Explore Full Graph</button>
      </div>
    </div>
  );
};

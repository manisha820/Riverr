'use client';

import { useState, useEffect } from 'react';
import { Zap, Play, Settings, History, AlertCircle, CheckCircle2, ChevronRight, Plus, ExternalLink } from 'lucide-react';

export const AutomationCenter = () => {
  const [activeTab, setActiveTab] = useState<'workflows' | 'history'>('workflows');

  const workflows = [
    { id: 1, name: 'Sync Tasks to Notion', trigger: 'action_item_detected', provider: 'notion', status: 'active' },
    { id: 2, name: 'Notify Slack on Summary', trigger: 'summary_generated', provider: 'slack', status: 'active' },
    { id: 3, name: 'Executive Alert (High Priority)', trigger: 'risk_identified', provider: 'slack', status: 'paused' },
  ];

  const history = [
    { id: 1, name: 'Sync Tasks to Notion', time: '12m ago', status: 'success' },
    { id: 2, name: 'Notify Slack on Summary', time: '1h ago', status: 'success' },
    { id: 3, name: 'Sync Tasks to Notion', time: '3h ago', status: 'failed', error: 'Notion API timeout' },
  ];

  return (
    <div className="p-10 rounded-[48px] border border-border bg-muted/5 space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
           <h3 className="text-3xl font-serif font-bold flex items-center space-x-3">
             <Zap className="w-6 h-6 text-accent" />
             <span>Automation Engine</span>
           </h3>
           <p className="text-sm text-muted-foreground">Manage active triggers and operational workflows.</p>
        </div>
        <button className="flex items-center space-x-2 px-6 py-3 bg-accent text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-accent/20">
          <Plus className="w-4 h-4" />
          <span>New Workflow</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-muted/20 p-1 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab('workflows')}
          className={`flex items-center space-x-2 px-6 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'workflows' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Workflows</span>
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex items-center space-x-2 px-6 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'history' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Activity Log</span>
        </button>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === 'workflows' ? (
          workflows.map((w) => (
            <div key={w.id} className="flex items-center justify-between p-6 rounded-[32px] border border-border bg-background hover:bg-muted/10 transition-all group">
               <div className="flex items-center space-x-6">
                  <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center group-hover:scale-110 transition-transform">
                     <Play className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                     <h4 className="font-bold text-sm">{w.name}</h4>
                     <div className="flex items-center space-x-3 mt-1">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{w.trigger.replace(/_/g, ' ')}</span>
                        <span className="w-1 h-1 bg-border rounded-full" />
                        <span className="text-[10px] text-accent uppercase font-bold tracking-widest">{w.provider}</span>
                     </div>
                  </div>
               </div>
               <div className="flex items-center space-x-6">
                  <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    w.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-muted text-muted-foreground'
                  }`}>
                    {w.status}
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
               </div>
            </div>
          ))
        ) : (
          history.map((h) => (
            <div key={h.id} className="flex items-center justify-between p-6 rounded-[32px] border border-border bg-background">
               <div className="flex items-center space-x-6">
                  {h.status === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                  <div>
                     <h4 className="font-bold text-sm">{h.name}</h4>
                     <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-1">
                       {h.status === 'failed' ? h.error : `Executed successfully • ${h.time}`}
                     </p>
                  </div>
               </div>
               <button className="p-2 hover:bg-muted rounded-lg transition-all">
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
               </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

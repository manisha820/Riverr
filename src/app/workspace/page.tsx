'use client';

import { useState } from 'react';
import { Navbar } from '@/components/shared/Navbar';
import { Mic, Square, Save, Download, Sparkles, Wand2, FileText } from 'lucide-react';
import { useTranscription } from '@/hooks/useTranscription';

export default function Workspace() {
  const { transcript, interimTranscript, isRecording, startTranscription, stopTranscription } = useTranscription();
  const [title, setTitle] = useState('New Recording Session');

  return (
    <div className="min-h-screen pt-20 bg-background flex flex-col">
      <Navbar />
      
      {/* Workspace Header */}
      <div className="border-b border-border p-4 glass">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-muted'}`} />
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-transparent border-none outline-none font-serif text-xl font-bold w-64 md:w-96"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 hover:bg-muted rounded-lg transition-all text-sm font-medium">
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-foreground text-background rounded-lg hover:opacity-90 transition-all text-sm font-medium">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Editor */}
        <div className="lg:col-span-3 flex flex-col space-y-6">
          <div className="flex-1 p-8 rounded-3xl border border-border bg-muted/10 min-h-[500px] relative">
            {!transcript && !isRecording && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                <Mic className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-lg">Press start to begin transcription</p>
              </div>
            )}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="font-serif leading-relaxed text-xl whitespace-pre-wrap">
                {transcript}
                {interimTranscript && (
                  <span className="text-muted-foreground ml-1">{interimTranscript}</span>
                )}
                {isRecording && <span className="inline-block w-1 h-6 bg-accent animate-pulse ml-1 align-middle" />}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center py-8">
            {!isRecording ? (
              <button 
                onClick={startTranscription}
                className="w-20 h-20 rounded-full bg-accent text-white flex items-center justify-center shadow-2xl shadow-accent/20 hover:scale-105 transition-all"
              >
                <Mic className="w-8 h-8" />
              </button>
            ) : (
              <button 
                onClick={stopTranscription}
                className="w-20 h-20 rounded-full bg-red-500 text-white flex items-center justify-center shadow-2xl shadow-red-500/20 hover:scale-105 transition-all"
              >
                <Square className="w-8 h-8" />
              </button>
            )}
          </div>
        </div>

        {/* Sidebar Panel */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl border border-border glass space-y-4">
            <h3 className="font-bold flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-accent" />
              <span>AI Refinement</span>
            </h3>
            <p className="text-sm text-muted-foreground">Smart formatting and summarization tools.</p>
            
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-muted text-sm transition-all">
                <div className="flex items-center space-x-3">
                  <Wand2 className="w-4 h-4" />
                  <span>Improve Punctuation</span>
                </div>
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-muted text-sm transition-all">
                <div className="flex items-center space-x-3">
                  <FileText className="w-4 h-4" />
                  <span>Generate Summary</span>
                </div>
              </button>
            </div>
          </div>

          <div className="p-6 rounded-3xl border border-border glass space-y-4">
            <h3 className="font-bold">Session Info</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Duration</span>
                <span>00:00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Words</span>
                <span>{transcript.split(' ').filter(Boolean).length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Confidence</span>
                <span>--%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

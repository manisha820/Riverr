import Link from 'next/link';
import { Mic, User, Settings, History, LayoutDashboard } from 'lucide-react';

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-20 border-b border-border glass z-50 px-6 flex items-center justify-between">
      <Link href="/" className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white">
          <Mic className="w-5 h-5" />
        </div>
        <span className="text-2xl font-serif font-bold tracking-tight">Riverr</span>
      </Link>

      <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-muted-foreground">
        <Link href="/dashboard" className="hover:text-foreground transition-colors flex items-center space-x-2">
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </Link>
        <Link href="/history" className="hover:text-foreground transition-colors flex items-center space-x-2">
          <History className="w-4 h-4" />
          <span>History</span>
        </Link>
        <Link href="/settings" className="hover:text-foreground transition-colors flex items-center space-x-2">
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <button className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-border transition-all">
          <User className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
};

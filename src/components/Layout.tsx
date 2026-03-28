import React from 'react';
import Sidebar from './Sidebar';
import { Menu, Navigation } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  user: any;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  onLogout: () => void;
}

export default function Layout({ children, user, isSidebarOpen, setIsSidebarOpen, onLogout }: LayoutProps) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        user={user}
        onLogout={onLogout}
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden lg:ml-64">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
              <Navigation className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-bold">Yathra</h1>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}

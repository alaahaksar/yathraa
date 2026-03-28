import React from 'react';
import { useTheme } from '../ThemeContext';
import { TRANSLATIONS } from '../constants';
import { Moon, Sun, Menu, X, LogOut, User, Globe, Check, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';
import { LANGUAGES } from '../constants';
import { Language } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user?: any;
  onLogout?: () => void;
}

export default function Sidebar({ isOpen, onClose, user, onLogout }: SidebarProps) {
  const { theme, toggleTheme, language, setLanguage } = useTheme();
  const t = TRANSLATIONS[language];

  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const [isUserOpen, setIsUserOpen] = React.useState(false);

  return (
    <>
      {/* Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 z-40 transition-opacity",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 z-50 transition-transform transform",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Yathra</h1>
            <button onClick={onClose} className="lg:hidden">
              <X className="w-6 h-6 text-zinc-500" />
            </button>
          </div>

          <nav className="flex-1 space-y-4">
            {/* Settings Section */}
            <div className="space-y-2">
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all",
                  isSettingsOpen 
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" 
                    : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                )}
              >
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5" />
                  <span className="font-semibold">Settings</span>
                </div>
                <ChevronDown className={cn("w-4 h-4 transition-transform", isSettingsOpen && "rotate-180")} />
              </button>

              {isSettingsOpen && (
                <div className="space-y-6 pl-4 pr-2 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* Language Selection */}
                  <div>
                    <div className="flex items-center gap-2 mb-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                      <Globe className="w-3 h-3" />
                      {t.language}
                    </div>
                    <div className="grid grid-cols-1 gap-1.5">
                      {LANGUAGES.map(lang => (
                        <button
                          key={lang.code}
                          onClick={() => setLanguage(lang.code as Language)}
                          className={cn(
                            "flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-xs",
                            language === lang.code 
                              ? "bg-blue-600 text-white font-semibold"
                              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700"
                          )}
                        >
                          <span>{lang.name}</span>
                          {language === lang.code && <Check className="w-3 h-3" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Theme Toggle */}
                  <div>
                    <div className="flex items-center gap-2 mb-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                      {theme === 'light' ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
                      {t.theme}
                    </div>
                    <button
                      onClick={toggleTheme}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs"
                    >
                      <span>{theme === 'light' ? t.light : t.dark}</span>
                      <div className={cn(
                        "w-8 h-4 rounded-full relative transition-colors",
                        theme === 'dark' ? "bg-blue-600" : "bg-zinc-300"
                      )}>
                        <div className={cn(
                          "absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all shadow-sm",
                          theme === 'dark' ? "left-[18px]" : "left-0.5"
                        )} />
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* User Section */}
          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
            {user ? (
              <div className="space-y-2">
                <button
                  onClick={() => setIsUserOpen(!isUserOpen)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all",
                    isUserOpen 
                      ? "bg-zinc-100 dark:bg-zinc-800" 
                      : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <User size={16} />
                    </div>
                    <span className="font-semibold text-sm truncate max-w-[120px]">{user.email}</span>
                  </div>
                  <ChevronDown className={cn("w-4 h-4 transition-transform", isUserOpen && "rotate-180")} />
                </button>

                {isUserOpen && (
                  <div className="px-4 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <button 
                      onClick={onLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors text-sm font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t.login === 'Login' ? 'Logout' : 'ലോഗൗട്ട്'}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-zinc-500 italic px-4">
                {t.welcome}
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

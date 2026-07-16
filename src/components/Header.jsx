import React from 'react';
import { Menu, Search, Sun, Moon, Type } from 'lucide-react';

const Header = ({ 
  greeting, 
  searchTerm, 
  setSearchTerm, 
  darkMode, 
  setDarkMode, 
  textSize,
  setTextSize,
  activeTab, 
  sidebarOpen, 
  setSidebarOpen 
}) => {
  return (
    <header className={`h-16 flex items-center justify-between px-4 md:px-8 border-b z-20 transition-all duration-300 ${
      darkMode 
        ? 'bg-surface/50 border-outline-variant/20 text-on-surface' 
        : 'bg-white/60 border-slate-200/80 text-slate-900'
    } backdrop-blur-md sticky top-0`}>
      
      {/* Right Side: Hamburger (Mobile) & Greeting */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)} 
          className="lg:hidden min-w-[40px] min-h-[40px] flex items-center justify-center p-2 text-slate-500 hover:text-slate-700 dark:hover:text-on-surface transition-colors"
          aria-label="תפריט ניווט"
        >
          <Menu size={20} />
        </button>
        <div className="hidden md:flex flex-col">
          <h2 className="text-xs font-black tracking-tight text-slate-900 dark:text-on-surface">
            {greeting}, חוקר פורנזי
          </h2>
          <p className="text-[9px] text-slate-400 dark:text-on-surface-variant/80 font-bold uppercase tracking-wider">מערכות מחקר ופיתוח מז"פ</p>
        </div>
      </div>

      {/* Left Side: Search, Mode, Logos */}
      <div className="flex items-center gap-3">
        {/* Search Input - Hidden on About Tab */}
        {activeTab !== 'about' && (
          <div className="relative hidden sm:block w-52 md:w-64 lg:w-80">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-on-surface-variant/60 w-3.5 h-3.5" />
            <input 
              type="text"
              placeholder="חיפוש כלים ומידע..."
              className={`w-full pr-9 pl-4 py-1.5 rounded-t-sm border-b-2 text-xs font-medium outline-none transition-all duration-300 ${
                darkMode 
                  ? 'bg-surface-variant/30 border-outline-variant text-on-surface placeholder:text-on-surface-variant/40 focus:border-primary focus:bg-surface-variant/50' 
                  : 'bg-slate-100 border-slate-300 focus:border-blue-500 focus:bg-white'
              }`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}

        {/* Font Size Adjuster Toggle */}
        <button 
          onClick={() => setTextSize(prev => prev === 'large' ? 'normal' : 'large')}
          className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-300 ${
            darkMode 
              ? 'bg-surface-variant/40 text-secondary border border-outline-variant/20 hover:bg-surface-bright' 
              : 'bg-slate-100 text-blue-600 border border-slate-200/50 hover:bg-slate-200'
          }`}
          aria-label="שינוי גודל גופן"
          title={textSize === 'large' ? "הקטן גופן" : "הגדל גופן"}
        >
          <Type size={16} />
        </button>

        {/* Dark Mode Toggle */}
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-300 ${
            darkMode 
              ? 'bg-surface-variant/40 text-amber-400 border border-outline-variant/20 hover:bg-surface-bright' 
              : 'bg-slate-100 text-slate-650 border border-slate-200/50 hover:bg-slate-200'
          }`}
          aria-label="שינוי מצב תצוגה"
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        
        {/* Institutional Logos */}
        <div className="flex items-center gap-1.5">
          <div className="h-7 w-auto flex items-center justify-center p-0.5 rounded-lg bg-white/5 dark:bg-white/5 border border-white/5">
            <img 
              src="/לוגו אחמ.png" 
              alt="לוגו אחמ" 
              className="h-full w-auto object-contain" 
              onError={(e) => { e.target.style.display='none'; }} 
            />
          </div>
          <div className="h-8 w-auto flex items-center justify-center p-0.5 rounded-lg bg-white/5 dark:bg-white/5 border border-white/5">
            <img 
              src="/logo.png" 
              alt="לוגו מזפ" 
              className="h-full w-auto object-contain" 
              onError={(e) => { e.target.style.display='none'; }} 
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

import React from 'react';
import { Menu, Search, Sun, Moon } from 'lucide-react';

const Header = ({ 
  greeting, 
  searchTerm, 
  setSearchTerm, 
  darkMode, 
  setDarkMode, 
  activeTab, 
  sidebarOpen, 
  setSidebarOpen 
}) => {
  return (
    <header className={`h-20 flex items-center justify-between px-8 border-b z-20 transition-all duration-350 ${
      darkMode 
        ? 'bg-[#0b0f17]/50 border-slate-900/40 text-white' 
        : 'bg-white/60 border-slate-200/80 text-slate-900'
    } backdrop-blur-md sticky top-0`}>
      
      {/* Right Side: Hamburger (Mobile) & Greeting */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)} 
          className="lg:hidden p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
          aria-label="תפריט ניווט"
        >
          <Menu size={24} />
        </button>
        <div className="hidden md:flex flex-col">
          <h2 className="text-sm font-black tracking-tight">
            {greeting}, חוקר פורנזי
          </h2>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">מערכות מחקר ופיתוח מז"פ</p>
        </div>
      </div>

      {/* Left Side: Search, Mode, Logos */}
      <div className="flex items-center gap-4">
        {/* Search Input - Hidden on About Tab */}
        {activeTab !== 'about' && (
          <div className="relative hidden md:block w-64 lg:w-96">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-450 text-slate-500 w-4 h-4" />
            <input 
              type="text"
              placeholder="חיפוש מהיר של כלים ומידע..."
              className={`w-full pr-10 pl-4 py-2 rounded-xl text-xs font-medium outline-none border transition-all duration-300 ${
                darkMode 
                  ? 'bg-slate-900/50 border-slate-800 focus:border-blue-500/50 focus:bg-slate-900 focus:shadow-[0_0_12px_rgba(59,130,246,0.1)]' 
                  : 'bg-slate-100/50 border-slate-200 focus:border-blue-500/50 focus:bg-white focus:shadow-[0_0_12px_rgba(59,130,246,0.05)]'
              }`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}

        {/* Dark Mode Toggle */}
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2.5 rounded-xl transition-all duration-300 ${
            darkMode 
              ? 'bg-slate-800/80 text-amber-400 border border-slate-700/50 hover:bg-slate-700' 
              : 'bg-slate-100 text-slate-600 border border-slate-200/50 hover:bg-slate-200'
          }`}
          aria-label="שינוי מצב תצוגה"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        
        {/* Institutional Logos */}
        <div className="flex items-center gap-1.5 md:gap-2.5">
          <div className="h-7 md:h-8 w-auto flex items-center justify-center p-0.5 rounded-lg bg-white/5 dark:bg-white/5 border border-white/5">
            <img 
              src="/לוגו אחמ.png" 
              alt="לוגו אחמ" 
              className="h-full w-auto object-contain" 
              onError={(e) => { e.target.style.display='none'; }} 
            />
          </div>
          <div className="h-8 md:h-9 w-auto flex items-center justify-center p-0.5 rounded-lg bg-white/5 dark:bg-white/5 border border-white/5">
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

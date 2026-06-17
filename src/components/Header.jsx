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
    <header className={`h-20 flex items-center justify-between px-8 border-b z-20 transition-all duration-300 ${
      darkMode 
        ? 'bg-[#0b0f17]/60 border-slate-800/80 text-white' 
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
          <h2 className="text-lg font-black tracking-tight">
            {greeting}, חוקר
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">ברוך הבא למרכז המידע והכלים</p>
        </div>
      </div>

      {/* Left Side: Search, Mode, Logos */}
      <div className="flex items-center gap-4">
        {/* Search Input - Hidden on About Tab */}
        {activeTab !== 'about' && (
          <div className="relative hidden md:block w-64 lg:w-96">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text"
              placeholder="חיפוש מהיר של כלים ומידע..."
              className={`w-full pr-10 pl-4 py-2.5 rounded-xl text-sm font-medium outline-none border transition-all duration-300 ${
                darkMode 
                  ? 'bg-slate-900/50 border-slate-800 focus:border-cyan-500/50 focus:bg-slate-900 focus:shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
                  : 'bg-slate-100/50 border-slate-200 focus:border-indigo-500/50 focus:bg-white focus:shadow-[0_0_15px_rgba(99,102,241,0.1)]'
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
        <div className="flex items-center gap-2 pr-2 border-r border-slate-200/20">
          <div className="h-12 w-auto flex items-center justify-center p-1 rounded-xl bg-white/5 dark:bg-white/5 border border-white/5">
            <img 
              src="/לוגו אחמ.png" 
              alt="לוגו אחמ" 
              className="h-full w-auto object-contain" 
              onError={(e) => { e.target.style.display='none'; }} 
            />
          </div>
          <div className="h-12 w-auto flex items-center justify-center p-1 rounded-xl bg-white/5 dark:bg-white/5 border border-white/5">
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

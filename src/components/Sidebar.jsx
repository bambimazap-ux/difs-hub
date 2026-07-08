import React from 'react';
import { 
  Home, Bot, Sparkles, GraduationCap, Megaphone, Lock, Layout, X, Settings,
  FileText, Link, HelpCircle, Shield, Award, BookOpen, MessageSquare, Wrench
} from 'lucide-react';

// Mapping string names from Firestore to Lucide components
export const iconMap = {
  Home,
  Bot,
  Sparkles,
  GraduationCap,
  Megaphone,
  FileText,
  Link,
  HelpCircle,
  Shield,
  Award,
  BookOpen,
  MessageSquare,
  Tool: Wrench
};

const Sidebar = ({ 
  activeTab, 
  setActiveTab, 
  darkMode, 
  sidebarOpen, 
  setSidebarOpen, 
  isAdmin, 
  setIsAdmin, 
  setIsLoginModalOpen,
  setIsAdminPanelOpen,
  categories = []
}) => {

  const SidebarItem = ({ id, label, subtitle, iconName, color }) => {
    const isActive = activeTab === id;
    const Icon = iconMap[iconName] || HelpCircle;
    
    // Notion/Linear Slate-Slate theme colors
    const activeColorClasses = darkMode ? {
      slate: 'bg-slate-800 text-white border-slate-700 shadow-sm font-bold',
      blue: 'bg-blue-600/30 text-blue-300 border-blue-500/40 shadow-sm font-bold',
      cyan: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30 font-bold',
      amber: 'bg-amber-500/20 text-amber-300 border-amber-400/30 font-bold',
      purple: 'bg-purple-600/30 text-purple-300 border-purple-500/40 font-bold'
    } : {
      slate: 'bg-slate-200 text-slate-800 border-slate-300 shadow-sm font-bold',
      blue: 'bg-blue-50 text-blue-700 border-blue-100 font-bold',
      cyan: 'bg-cyan-50 text-cyan-700 border-cyan-100 font-bold',
      amber: 'bg-amber-50 text-amber-800 border-amber-100 font-bold',
      purple: 'bg-purple-50 text-purple-700 border-purple-100 font-bold'
    };

    const defaultColor = color || 'slate';
    const activeClass = activeColorClasses[defaultColor] || activeColorClasses['slate'];

    return (
      <button 
        onClick={() => { setActiveTab(id); setSidebarOpen(false); }}
        className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl border transition-all duration-200 group ${
          isActive 
            ? activeClass
            : `${darkMode ? 'text-slate-400 bg-transparent border-transparent hover:bg-slate-800/40 hover:text-slate-200' : 'text-slate-500 bg-transparent border-transparent hover:bg-slate-100/60 hover:text-slate-800'}`
        }`}
      >
        <div className={`p-2 rounded-xl transition-all duration-200 ${
          isActive 
            ? 'bg-white/10 dark:bg-white/5' 
            : 'bg-slate-500/5 group-hover:bg-slate-500/10'
        }`}>
          <Icon size={18} />
        </div>
        <div className="text-right">
          <div className={`font-bold text-sm leading-tight transition-colors ${
            isActive ? '' : 'text-slate-700 dark:text-slate-200 group-hover:text-slate-950 dark:group-hover:text-white'
          }`}>{label}</div>
          <div className={`text-[10px] font-medium mt-0.5 ${
            isActive ? 'opacity-90' : 'text-slate-400 dark:text-slate-500'
          }`}>{subtitle}</div>
        </div>
      </button>
    );
  };

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 lg:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar Container */}
      <aside className={`fixed inset-y-0 right-0 w-72 z-50 transition-transform duration-300 ease-out lg:static lg:block transform will-change-transform glass-panel ${
        darkMode ? 'bg-[#0b0f17] border-l border-slate-900' : 'bg-white border-l border-slate-200'
      } ${sidebarOpen ? 'translate-x-0 shadow-xl visible opacity-100' : 'translate-x-full lg:translate-x-0 lg:visible lg:opacity-100'}`}>
        
        <div className="h-full flex flex-col p-6 relative">
          {/* Mobile Close Button */}
          <button 
            onClick={() => setSidebarOpen(false)}
            className={`absolute top-4 left-4 w-11 h-11 flex items-center justify-center rounded-xl lg:hidden transition-colors ${
              darkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-200' : 'hover:bg-slate-100 text-slate-500'
            }`}
            aria-label="סגור תפריט"
          >
            <X size={20} />
          </button>

          {/* Brand Logo Container */}
          <div className="flex flex-col items-center text-center mb-8 space-y-4 pt-6 lg:pt-2">
            <div className="relative w-28 h-28 mx-auto group cursor-pointer">
              {/* Outer decorative subtle boundary */}
              <div className="absolute -inset-1 bg-gradient-to-tr from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700 rounded-[2rem] opacity-60 transition-all duration-300"></div>
              
              {/* Main Container */}
              <div className="absolute inset-0 bg-white dark:bg-slate-950 rounded-[1.8rem] border border-slate-200 dark:border-slate-800 flex items-center justify-center p-3 shadow-sm">
                <div className="w-full h-full relative flex items-center justify-center overflow-hidden rounded-[1.4rem]">
                  <img 
                    src="/לוגו מדור מופ.png" 
                    alt="לוגו מדור מופ" 
                    className="w-full h-full object-contain" 
                    onError={(e) => { e.target.style.display='none'; }} 
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <h1 className="font-black text-xl tracking-tight text-slate-900 dark:text-white">
                מז"פ Tech Hub
              </h1>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                <span className="text-[9px] font-black text-slate-600 dark:text-slate-400 tracking-wider uppercase">מדור מחקר ופיתוח</span>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-grow space-y-2 overflow-y-auto min-h-0 custom-scrollbar px-1">
            <div className="px-2 mb-2 text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest">קטגוריות</div>
            
            {/* Home/About virtual tab */}
            <SidebarItem 
              id="about" 
              label="דף הבית" 
              subtitle="אודות המערכת" 
              iconName="Home" 
              color="slate" 
            />

            {/* Dynamic tabs from Firestore */}
            {categories.map(cat => (
              <SidebarItem 
                key={cat.id}
                id={cat.id}
                label={cat.label}
                subtitle={cat.subtitle}
                iconName={cat.iconName}
                color={cat.color}
              />
            ))}
          </nav>

          {/* Admin Toggle Panel */}
          <div className="mt-auto pt-4 border-t border-slate-200/10 dark:border-slate-800/60 shrink-0 space-y-2">
            {isAdmin && (
              <button 
                onClick={() => setIsAdminPanelOpen(true)}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-bold transition-all duration-300 border ${
                  darkMode ? 'bg-blue-600/20 text-blue-300 border-blue-500/30' : 'bg-blue-50 text-blue-700 border-blue-100'
                }`}
              >
                <Settings size={14} />
                <span>לוח בקרת מנהל</span>
              </button>
            )}
            <button 
              onClick={() => isAdmin ? setIsAdmin(false) : setIsLoginModalOpen(true)}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-bold transition-all duration-300 border ${
                isAdmin 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' 
                  : `${darkMode ? 'bg-slate-900/50 hover:bg-slate-800/80 text-slate-300 border-slate-800' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'}`
              }`}
            >
              {isAdmin ? <Layout size={14} /> : <Lock size={14} />}
              <span>{isAdmin ? 'יציאה מניהול' : 'כניסה לניהול'}</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

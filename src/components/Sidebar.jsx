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
    
    // Stitch inspired palette with category colors
    const activeColorClasses = darkMode ? {
      slate: 'bg-primary/10 text-primary border-primary/30 shadow-[0_0_12px_rgba(173,198,255,0.08)] font-bold',
      blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30 shadow-[0_0_12px_rgba(59,130,246,0.08)] font-bold',
      cyan: 'bg-secondary/20 text-secondary border-secondary/30 shadow-[0_0_12px_rgba(76,215,246,0.08)] font-bold',
      amber: 'bg-amber-500/20 text-amber-300 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.08)] font-bold',
      purple: 'bg-tertiary/20 text-tertiary border-tertiary/30 shadow-[0_0_12px_rgba(208,188,255,0.08)] font-bold'
    } : {
      slate: 'bg-slate-200 text-slate-800 border-slate-300 shadow-sm font-bold',
      blue: 'bg-blue-50 text-blue-700 border-blue-100 font-bold',
      cyan: 'bg-cyan-50 text-cyan-700 border-cyan-100 font-bold',
      amber: 'bg-amber-55 text-amber-800 border-amber-200 font-bold',
      purple: 'bg-purple-50 text-purple-700 border-purple-100 font-bold'
    };

    const defaultColor = color || 'slate';
    const activeClass = activeColorClasses[defaultColor] || activeColorClasses['slate'];

    return (
      <button 
        onClick={() => { setActiveTab(id); setSidebarOpen(false); }}
        className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl border transition-all duration-200 group active:scale-[0.98] ${
          isActive 
            ? activeClass
            : `${darkMode ? 'text-on-surface-variant bg-transparent border-transparent hover:bg-surface-variant/40 hover:text-on-surface' : 'text-slate-500 bg-transparent border-transparent hover:bg-slate-100/60 hover:text-slate-850'}`
        }`}
      >
        <div className={`p-2 rounded-xl transition-all duration-200 ${
          isActive 
            ? 'bg-white/10 dark:bg-white/5' 
            : 'bg-slate-500/5 group-hover:bg-slate-550/10'
        }`}>
          <Icon size={18} />
        </div>
        <div className="text-right">
          <div className={`font-bold text-sm leading-tight transition-colors ${
            isActive ? '' : 'text-slate-700 dark:text-slate-200 group-hover:text-slate-950 dark:group-hover:text-white'
          }`}>{label}</div>
          <div className={`text-[10px] font-medium mt-0.5 ${
            isActive ? 'opacity-90' : 'text-slate-450 dark:text-slate-500'
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
          className="fixed inset-0 z-40 bg-black/45 lg:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar Container */}
      <aside className={`fixed inset-y-0 right-0 w-72 z-50 transition-transform duration-300 ease-out lg:static lg:block transform lg:translate-x-0 glass-panel ${
        darkMode 
          ? 'bg-surface-container/70 border-l border-outline-variant/30' 
          : 'bg-white border-l border-slate-200'
      } ${sidebarOpen ? 'translate-x-0 shadow-2xl visible opacity-100' : 'translate-x-full lg:visible lg:opacity-100'}`}>
        
        <div className="h-full flex flex-col p-6 relative">
          {/* Mobile Close Button */}
          <button 
            onClick={() => setSidebarOpen(false)}
            className={`absolute top-4 left-4 w-11 h-11 flex items-center justify-center rounded-xl lg:hidden transition-colors ${
              darkMode ? 'hover:bg-surface-variant text-on-surface-variant hover:text-on-surface' : 'hover:bg-slate-100 text-slate-500'
            }`}
            aria-label="סגור תפריט"
          >
            <X size={20} />
          </button>

          {/* Brand Logo Container */}
          <div className="flex flex-col items-center text-center mb-8 space-y-4 pt-6 lg:pt-2">
            <div className="relative w-24 h-24 mx-auto group cursor-pointer">
              {/* Outer decorative subtle boundary */}
              <div className="absolute -inset-1 bg-gradient-to-tr from-primary to-secondary rounded-full opacity-40 group-hover:opacity-80 transition-all duration-300 blur-[2px]"></div>
              
              {/* Main Container */}
              <div className="absolute inset-0 bg-[#090e1a] rounded-full border border-outline-variant/40 flex items-center justify-center p-2.5 shadow-md">
                <div className="w-full h-full relative flex items-center justify-center overflow-hidden rounded-full bg-slate-900/50">
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
              <h1 className="font-black text-lg tracking-tight text-slate-900 dark:text-white">
                מז"פ Tech Hub
              </h1>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-100 dark:bg-surface-variant/40 border border-slate-200 dark:border-outline-variant/30">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                <span className="text-[9px] font-black text-slate-650 dark:text-on-surface-variant tracking-wider uppercase">מדור מחקר ופיתוח</span>
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
          <div className="mt-auto pt-4 border-t border-slate-200/10 dark:border-outline-variant/20 shrink-0 space-y-2">
            {isAdmin && (
              <button 
                onClick={() => setIsAdminPanelOpen(true)}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-bold transition-all duration-300 border ${
                  darkMode ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20' : 'bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100'
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
                  : `${darkMode ? 'bg-surface-variant/40 hover:bg-surface-variant/80 text-on-surface border-outline-variant/30' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'}`
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

import React, { useMemo } from 'react';
import { Sparkles, MessageSquare, Megaphone, ArrowLeft, ArrowUpRight, Star, Clock, HelpCircle } from 'lucide-react';
import { iconMap } from './Sidebar.jsx';

const About = ({ 
  setActiveTab, 
  items = [], 
  darkMode, 
  whatsappUrl = 'https://chat.whatsapp.com/default-placeholder-link', 
  announcement = '', 
  announcementActive = false, 
  categories = [], 
  feedbacks = {} 
}) => {

  // Calculate item count per category dynamically
  const getCount = (id) => {
    return items.filter(i => i.category === id).length;
  };

  const getCategoryTheme = (color) => {
    if (darkMode) {
      switch(color) {
        case 'blue': return { border: 'hover:border-primary/50', iconBg: 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-[#002e6a]', colorText: 'text-primary', shadow: 'hover:shadow-[0_0_15px_rgba(173,198,255,0.15)]' };
        case 'cyan': return { border: 'hover:border-secondary/50', iconBg: 'bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-[#003640]', colorText: 'text-secondary', shadow: 'hover:shadow-[0_0_15px_rgba(76,215,246,0.15)]' };
        case 'amber': return { border: 'hover:border-amber-500/50', iconBg: 'bg-amber-500/10 text-amber-400 group-hover:bg-amber-500 group-hover:text-black', colorText: 'text-amber-450', shadow: 'hover:shadow-[0_0_15px_rgba(245,158,11,0.15)]' };
        case 'purple': return { border: 'hover:border-tertiary/50', iconBg: 'bg-tertiary/10 text-tertiary group-hover:bg-tertiary group-hover:text-[#3c0091]', colorText: 'text-tertiary', shadow: 'hover:shadow-[0_0_15px_rgba(208,188,255,0.15)]' };
        default: return { border: 'hover:border-slate-500/50', iconBg: 'bg-slate-500/10 text-slate-400 group-hover:bg-slate-700 group-hover:text-white', colorText: 'text-slate-400', shadow: '' };
      }
    } else {
      switch(color) {
        case 'blue': return { border: 'hover:border-blue-500/30', iconBg: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white', colorText: 'text-blue-600', shadow: 'hover:shadow-blue-500/5' };
        case 'cyan': return { border: 'hover:border-cyan-500/30', iconBg: 'bg-cyan-50 text-cyan-700 group-hover:bg-cyan-600 group-hover:text-white', colorText: 'text-cyan-700', shadow: 'hover:shadow-cyan-500/5' };
        case 'amber': return { border: 'hover:border-amber-500/30', iconBg: 'bg-amber-50 text-amber-700 group-hover:bg-amber-600 group-hover:text-slate-950', colorText: 'text-amber-700', shadow: 'hover:shadow-amber-500/5' };
        case 'purple': return { border: 'hover:border-purple-500/30', iconBg: 'bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white', colorText: 'text-purple-600', shadow: 'hover:shadow-purple-500/5' };
        default: return { border: 'hover:border-slate-500/20', iconBg: 'bg-slate-100 text-slate-600 group-hover:bg-slate-600 group-hover:text-white', colorText: 'text-slate-600', shadow: '' };
      }
    }
  };

  // 3 Top Rated items
  const trendingTools = useMemo(() => {
    return items
      .map(item => {
        const feedback = feedbacks[item.id] || { totalRating: 0, count: 0 };
        const avgRating = feedback.count > 0 ? feedback.totalRating / feedback.count : 0;
        return { ...item, avgRating, feedbackCount: feedback.count };
      })
      .filter(item => item.category !== 'updates' && item.avgRating > 0)
      .sort((a, b) => b.avgRating - a.avgRating || b.feedbackCount - a.feedbackCount)
      .slice(0, 3);
  }, [items, feedbacks]);

  // 3 Most Recently Updated tools
  const recentTools = useMemo(() => {
    return items
      .filter(item => item.category !== 'updates')
      .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0))
      .slice(0, 3);
  }, [items]);

  return (
    <div className="animate-in fade-in duration-500 w-full flex flex-col justify-start max-w-5xl mx-auto space-y-6 md:space-y-8 pb-16 relative px-4 md:px-0">
      
      {/* Bento Grid Top: Hero & WhatsApp community */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Hero Banner (8 columns) */}
        <div className={`lg:col-span-8 relative overflow-hidden rounded-2xl p-6 md:p-10 border transition-all duration-300 flex flex-col justify-center min-h-[260px] ${
          darkMode 
            ? 'bg-surface-container/40 border-outline-variant/20 shadow-lg glass-panel-glow' 
            : 'bg-gradient-to-br from-slate-50 via-white to-slate-50 text-slate-900 border-slate-200 shadow-md shadow-slate-200/10'
        }`}>
          {/* Scan line effect inside hero in dark mode */}
          {darkMode && <div className="scan-line"></div>}
          
          {/* Subtle grid elements in hero background */}
          {darkMode && (
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(173,198,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(173,198,255,0.01)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40"></div>
          )}
          <div className="relative z-10 flex flex-col items-start text-right space-y-4 max-w-xl pr-1">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-wider border transition-all duration-300 ${
              darkMode 
                ? 'bg-secondary/10 text-secondary border-secondary/20' 
                : 'bg-blue-50 text-blue-700 border-blue-100 shadow-sm'
            }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
              <span>DIFS Innovation</span>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-tight text-slate-900 dark:text-on-surface">
              מרכז החדשנות והבינה המלאכותית
            </h2>
            <p className="text-xs md:text-sm font-medium leading-relaxed text-slate-550 dark:text-on-surface-variant">
              הפלטפורמה המרכזית של החטיבה לזיהוי פלילי המאגדת בוטים מתקדמים, כלי AI חיצוניים ומאגר הדרכות מקצועי.
            </p>
          </div>
        </div>

        {/* WhatsApp Forum Card Widget (4 columns) */}
        <div className={`lg:col-span-4 p-6 rounded-2xl border flex flex-col items-center justify-center text-center group hover:bg-surface-variant/35 transition-all ${
          darkMode 
            ? 'bg-surface-container/40 border-outline-variant/20 shadow-lg glass-panel-glow' 
            : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent pointer-events-none rounded-2xl"></div>
          <div className="w-14 h-14 rounded-2xl bg-surface-variant/50 border border-outline-variant/30 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(34,197,94,0.15)] text-green-400">
            <MessageSquare size={24} />
          </div>
          <h3 className="text-sm font-black text-slate-900 dark:text-on-surface mb-2">קהילת המומחים</h3>
          <p className="text-[11px] text-slate-500 dark:text-on-surface-variant mb-5 max-w-[240px] leading-relaxed">
            הצטרפו לדיונים מקצועיים, שיתוף ידע ועדכונים בזמן אמת בפורום הסגור של מז"פ בוואטסאפ.
          </p>
          <a 
            href={whatsappUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`w-full py-2.5 rounded-xl font-bold text-xs text-center transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-[0.98] ${
              darkMode 
                ? 'bg-secondary/20 hover:bg-secondary text-secondary hover:text-[#003640] border border-secondary/35 hover:shadow-[0_0_15px_rgba(76,215,246,0.15)]' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            <span>הצטרפות לפורום ב-WhatsApp</span>
            <ArrowUpRight size={13} />
          </a>
        </div>
      </div>

      {/* Announcement Banner (If Active) */}
      {announcementActive && announcement && (
        <div className={`p-4 rounded-xl md:rounded-2xl border flex items-center gap-3 ${
          darkMode ? 'bg-primary/10 border-primary/20 text-primary glass-panel-glow pulse-glow animate-pulse' : 'bg-blue-50 border-blue-200 text-blue-800'
        }`}>
          <Megaphone size={15} className="shrink-0 text-secondary" />
          <p className="text-xs font-bold text-right w-full leading-relaxed">{announcement}</p>
        </div>
      )}

      {/* Categories Grid (Interactive Navigation Cards) */}
      <div className="space-y-3">
        <h3 className="text-[10px] md:text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">קטגוריות ותוכן</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories
            .filter(cat => cat.id === 'internal' || cat.id === 'tool' || cat.id === 'training')
            .map((cat) => {
            const theme = getCategoryTheme(cat.color);
            const Icon = iconMap[cat.iconName] || HelpCircle;
            const count = getCount(cat.id);

            return (
              <div 
                key={cat.id}
                onClick={() => setActiveTab(cat.id)} 
                className={`cursor-pointer p-5 md:p-6 rounded-xl border dark:bg-surface-container/30 transition-all duration-300 group relative ${theme.border} ${theme.shadow} glass-card`}
              >
                <div className="flex justify-between items-start mb-5">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 shadow-sm ${theme.iconBg}`}>
                    <Icon size={16} />
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded transition-all ${
                    darkMode 
                      ? 'bg-surface-variant/40 text-on-surface-variant group-hover:bg-surface-bright group-hover:text-white' 
                      : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-800'
                  }`}>
                    {count} פריטים
                  </span>
                </div>
                
                <h3 className="text-xs md:text-sm font-black mb-1.5 text-slate-850 dark:text-on-surface">
                  {cat.label}
                </h3>
                <p className="text-slate-500 dark:text-on-surface-variant/70 leading-relaxed text-[10px] mb-4 h-8 line-clamp-2">
                  {cat.subtitle}
                </p>
                
                <span className={`text-[10px] font-black flex items-center gap-1 group-hover:gap-1.5 transition-all ${theme.colorText}`}>
                  <span>פתח מאגר</span>
                  <ArrowLeft size={11} className="transform group-hover:-translate-x-0.5 transition-transform" />
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dashboard Sub-widgets: Trending vs Recent */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Top-Rated / Featured */}
        <div className={`rounded-xl border flex flex-col h-[400px] overflow-hidden ${
          darkMode ? 'bg-surface-container-low/40 border-outline-variant/20 backdrop-blur-md shadow-sm' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className={`p-4 border-b flex justify-between items-center ${
            darkMode ? 'bg-surface-variant/20 border-outline-variant/30' : 'bg-slate-50 border-slate-100'
          }`}>
            <div className="flex items-center gap-2">
              <Star size={16} className="text-amber-500 animate-pulse" />
              <h3 className="text-xs font-black text-slate-800 dark:text-on-surface">כלים מובילים במעבדות</h3>
            </div>
          </div>
          
          <div className="p-2 flex-1 overflow-y-auto space-y-2 custom-scrollbar">
            {trendingTools.map((tool) => (
              <a 
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                key={tool.id} 
                className={`flex items-center gap-4 p-3 rounded-lg border border-transparent transition-all duration-200 active:scale-[0.99] ${
                  darkMode 
                    ? 'hover:bg-surface-variant/40 hover:border-outline-variant/30 text-on-surface' 
                    : 'hover:bg-slate-50 hover:border-slate-100'
                }`}
              >
                <div className={`w-10 h-10 rounded flex items-center justify-center shrink-0 ${
                  darkMode ? 'bg-primary/10 text-primary' : 'bg-blue-50 text-blue-700'
                }`}>
                  {(() => {
                    const Icon = iconMap[categories.find(c => c.id === tool.category)?.iconName || 'HelpCircle'];
                    return <Icon size={18} />;
                  })()}
                </div>
                <div className="flex-1 min-w-0 text-right">
                  <h4 className="text-xs font-bold text-slate-850 dark:text-on-surface truncate">{tool.title}</h4>
                  <p className="text-[10px] text-slate-400 dark:text-on-surface-variant/60 truncate">{categories.find(c => c.id === tool.category)?.label}</p>
                </div>
                <div className={`px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 shrink-0 ${
                  darkMode ? 'bg-surface-container-high text-on-surface-variant' : 'bg-slate-100 text-slate-600'
                }`}>
                  <Star size={10} className="text-amber-500" fill="currentColor" />
                  <span>{tool.avgRating.toFixed(1)}</span>
                </div>
              </a>
            ))}
            {trendingTools.length === 0 && (
              <div className="text-center text-slate-400 py-6 text-[10px] font-bold">טרם התקבלו דירוגים לכלים</div>
            )}
          </div>
        </div>

        {/* Recently Updated Console Terminal List */}
        <div className={`rounded-xl border flex flex-col h-[400px] overflow-hidden ${
          darkMode ? 'bg-surface-container-low/40 border-outline-variant/20 backdrop-blur-md shadow-sm' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className={`p-4 border-b flex justify-between items-center ${
            darkMode ? 'bg-surface-variant/20 border-outline-variant/30' : 'bg-slate-50 border-slate-100'
          }`}>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-secondary" />
              <h3 className="text-xs font-black text-slate-800 dark:text-on-surface">עדכונים אחרונים</h3>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto font-mono text-xs custom-scrollbar">
            {recentTools.map((tool) => (
              <a 
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                key={tool.id} 
                className={`flex gap-4 p-3 border-b transition-colors ${
                  darkMode 
                    ? 'border-outline-variant/10 bg-surface/5 hover:bg-surface-variant/20 text-on-surface-variant hover:text-on-surface' 
                    : 'border-slate-100 bg-slate-50/20 hover:bg-slate-50 text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="text-secondary opacity-70 w-20 shrink-0 text-right">
                  {new Date(tool.updatedAt || 0).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit' })}
                </span>
                <div className="flex-grow text-right min-w-0 truncate">
                  <span className="text-primary font-medium">[{categories.find(c => c.id === tool.category)?.label || 'כלי'}]</span>{' '}
                  <span>{tool.title}</span>
                </div>
              </a>
            ))}
            {recentTools.length === 0 && (
              <div className="text-center text-slate-400 py-6 text-[10px] font-bold">טרם הועלו כלים למערכת</div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default About;

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
        case 'blue': return { border: 'hover:border-blue-500/50', iconBg: 'bg-blue-500/10 text-blue-400 group-hover:bg-blue-650 group-hover:text-white', colorText: 'text-blue-400', shadow: 'hover:shadow-blue-500/5' };
        case 'cyan': return { border: 'hover:border-cyan-500/50', iconBg: 'bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-600 group-hover:text-slate-950', colorText: 'text-cyan-400', shadow: 'hover:shadow-cyan-500/5' };
        case 'amber': return { border: 'hover:border-amber-500/50', iconBg: 'bg-amber-500/10 text-amber-400 group-hover:bg-amber-600 group-hover:text-slate-950', colorText: 'text-amber-400', shadow: 'hover:shadow-amber-500/5' };
        case 'purple': return { border: 'hover:border-purple-500/50', iconBg: 'bg-purple-500/10 text-purple-400 group-hover:bg-purple-600 group-hover:text-white', colorText: 'text-purple-400', shadow: 'hover:shadow-purple-500/5' };
        default: return { border: 'hover:border-slate-500/50', iconBg: 'bg-slate-500/10 text-slate-400 group-hover:bg-slate-700 group-hover:text-white', colorText: 'text-slate-400', shadow: '' };
      }
    } else {
      switch(color) {
        case 'blue': return { border: 'hover:border-blue-500/30', iconBg: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white', colorText: 'text-blue-600', shadow: 'hover:shadow-blue-500/5' };
        case 'cyan': return { border: 'hover:border-cyan-500/30', iconBg: 'bg-cyan-50 text-cyan-700 group-hover:bg-cyan-650 group-hover:text-white', colorText: 'text-cyan-700', shadow: 'hover:shadow-cyan-500/5' };
        case 'amber': return { border: 'hover:border-amber-500/30', iconBg: 'bg-amber-55 text-amber-700 group-hover:bg-amber-600 group-hover:text-slate-950', colorText: 'text-amber-700', shadow: 'hover:shadow-amber-500/5' };
        case 'purple': return { border: 'hover:border-purple-500/30', iconBg: 'bg-purple-50 text-purple-650 group-hover:bg-purple-600 group-hover:text-white', colorText: 'text-purple-650', shadow: 'hover:shadow-purple-500/5' };
        default: return { border: 'hover:border-slate-500/20', iconBg: 'bg-slate-100 text-slate-600 group-hover:bg-slate-600 group-hover:text-white', colorText: 'text-slate-605', shadow: '' };
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
    <div className="animate-in fade-in duration-500 w-full flex flex-col justify-start max-w-5xl mx-auto space-y-6 md:space-y-8 pb-16 relative px-1 md:px-0">
      
      {/* Premium Hero Banner */}
      <div className={`relative overflow-hidden rounded-2xl md:rounded-[2.5rem] p-6 md:p-12 border transition-all duration-300 ${
        darkMode 
          ? 'bg-slate-900 border-slate-800/80 shadow-lg' 
          : 'bg-gradient-to-br from-slate-50 via-white to-slate-50 text-slate-900 border-slate-200/80 shadow-md shadow-slate-200/10'
      }`}>
        <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto space-y-4 md:space-y-5">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-wider border transition-all duration-300 ${
            darkMode 
              ? 'bg-blue-500/10 text-blue-300 border-blue-500/20' 
              : 'bg-blue-50 text-blue-700 border-blue-100 shadow-sm'
          }`}>
            <Sparkles size={11} />
            <span>DIFS Innovation</span>
          </div>
          
          <h2 className="text-2xl md:text-4xl font-black tracking-tight leading-tight text-slate-900 dark:text-white">
            מרכז החדשנות והבינה המלאכותית
          </h2>
          <p className="text-xs md:text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-405">
            הפלטפורמה המרכזית של החטיבה לזיהוי פלילי המאגדת בוטים מתקדמים, כלי AI חיצוניים ומאגר הדרכות מקצועי.
          </p>
        </div>
      </div>

      {/* Announcement Banner (If Active) */}
      {announcementActive && announcement && (
        <div className={`p-4 rounded-xl md:rounded-2xl border flex items-center gap-3 animate-pulse ${
          darkMode ? 'bg-blue-950/20 border-blue-900/50 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-800'
        }`}>
          <Megaphone size={15} className="shrink-0 text-blue-500" />
          <p className="text-xs font-bold text-right w-full leading-relaxed">{announcement}</p>
        </div>
      )}

      {/* WhatsApp Forum Card Widget */}
      <div className={`p-5 md:p-6 rounded-2xl md:rounded-[2rem] border flex flex-col md:flex-row justify-between items-center gap-5 md:gap-6 ${
        darkMode 
          ? 'bg-slate-900/40 border-slate-800' 
          : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex gap-4 items-start text-right">
          <div className={`p-2.5 rounded-xl ${darkMode ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-700'}`}>
            <MessageSquare size={20} />
          </div>
          <div className="space-y-1">
            <h3 className="text-xs md:text-sm font-bold text-slate-850 text-slate-900 dark:text-white">הפורום המקצועי של מז"פ בוואטסאפ</h3>
            <p className="text-[11px] md:text-xs text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
              קבוצת הדיונים הפנימית של החטיבה לשיתוף פרומפטים מנצחים, התייעצות לגבי כלי AI ותמיכה טכנית הדדית בזמן אמת.
            </p>
          </div>
        </div>
        <a 
          href={whatsappUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className={`w-full md:w-auto px-5 py-2.5 rounded-xl font-bold text-xs text-center transition-all shadow-sm flex items-center justify-center gap-1.5 ${
            darkMode ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          <span>הצטרפות לפורום ב-WhatsApp</span>
          <ArrowUpRight size={13} />
        </a>
      </div>

      {/* Categories Grid (Interactive Navigation Cards) */}
      <div className="space-y-3">
        <h3 className="text-[10px] md:text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">קטגוריות ותוכן</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const theme = getCategoryTheme(cat.color);
            const Icon = iconMap[cat.iconName] || HelpCircle;
            const count = getCount(cat.id);

            return (
              <div 
                key={cat.id}
                onClick={() => setActiveTab(cat.id)} 
                className={`cursor-pointer p-5 md:p-6 rounded-xl md:rounded-[2rem] border glass-card transition-all duration-300 group relative ${theme.border} ${theme.shadow}`}
              >
                <div className="flex justify-between items-start mb-5">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 shadow-sm ${theme.iconBg}`}>
                    <Icon size={16} />
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded transition-all ${
                    darkMode 
                      ? 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-white' 
                      : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-800'
                  }`}>
                    {count} פריטים
                  </span>
                </div>
                
                <h3 className="text-xs md:text-sm font-black mb-1.5 text-slate-800 dark:text-white">
                  {cat.label}
                </h3>
                <p className="text-slate-405 dark:text-slate-500 leading-relaxed text-[10px] mb-4 h-8 line-clamp-2">
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
        <div className={`p-5 md:p-6 rounded-xl md:rounded-[2rem] border ${
          darkMode ? 'bg-slate-900/20 border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center gap-2 mb-4">
            <Star size={15} className="text-amber-500" />
            <h3 className="text-xs md:text-sm font-black text-slate-800 dark:text-white">כלים מובילים במעבדות</h3>
          </div>
          
          <div className="space-y-3">
            {trendingTools.map((tool) => (
              <a 
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                key={tool.id} 
                className={`flex justify-between items-center p-3 rounded-xl border transition-all ${
                  darkMode 
                    ? 'bg-slate-900/30 border-slate-800/60 hover:bg-slate-800/40 hover:border-slate-700' 
                    : 'bg-slate-50 border-slate-100 hover:bg-slate-100/50 hover:border-slate-200'
                }`}
              >
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-805 dark:text-white">{tool.title}</div>
                  <div className="text-[9px] text-slate-400 dark:text-slate-500 truncate max-w-[160px] md:max-w-[200px]">{tool.description}</div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Star size={9} className="text-amber-500" fill="currentColor" />
                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">{tool.avgRating.toFixed(1)}</span>
                </div>
              </a>
            ))}
            {trendingTools.length === 0 && (
              <div className="text-center text-slate-400 py-6 text-[10px] font-bold">טרם התקבלו דירוגים לכלים</div>
            )}
          </div>
        </div>

        {/* Recently Updated */}
        <div className={`p-5 md:p-6 rounded-xl md:rounded-[2rem] border ${
          darkMode ? 'bg-slate-900/20 border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center gap-2 mb-4">
            <Clock size={15} className="text-blue-500" />
            <h3 className="text-xs md:text-sm font-black text-slate-805 dark:text-white">עדכונים אחרונים</h3>
          </div>
          
          <div className="space-y-3">
            {recentTools.map((tool) => (
              <a 
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                key={tool.id} 
                className={`flex justify-between items-center p-3 rounded-xl border transition-all ${
                  darkMode 
                    ? 'bg-slate-900/30 border-slate-800/60 hover:bg-slate-800/40 hover:border-slate-700' 
                    : 'bg-slate-50 border-slate-100 hover:bg-slate-100/50 hover:border-slate-200'
                }`}
              >
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-805 dark:text-white">{tool.title}</div>
                  <div className="text-[9px] text-slate-400 dark:text-slate-500 truncate max-w-[160px] md:max-w-[200px]">{tool.description}</div>
                </div>
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 shrink-0">
                  {new Date(tool.updatedAt || 0).toLocaleDateString('he-IL')}
                </span>
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

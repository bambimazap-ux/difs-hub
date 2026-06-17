import React from 'react';
import { Bot, Sparkles, GraduationCap, Megaphone, ArrowLeft } from 'lucide-react';
import { CATEGORIES } from './Sidebar.jsx';

const About = ({ setActiveTab, items, darkMode }) => {
  // Calculate category counts
  const internalCount = items.filter(i => i.category === 'internal').length;
  const toolCount = items.filter(i => i.category === 'tool').length;
  const trainingCount = items.filter(i => i.category === 'training').length;
  const updatesCount = items.filter(i => i.category === 'updates').length;

  const getCount = (id) => {
    switch(id) {
      case 'internal': return internalCount;
      case 'tool': return toolCount;
      case 'training': return trainingCount;
      case 'updates': return updatesCount;
      default: return 0;
    }
  };

  const getCategoryTheme = (id) => {
    if (darkMode) {
      switch(id) {
        case 'internal': return { border: 'hover:border-blue-500/50', iconBg: 'bg-blue-500/10 text-blue-400 group-hover:bg-blue-600 group-hover:text-white shadow-blue-500/10', colorText: 'text-blue-400', shadow: 'hover:shadow-blue-500/5' };
        case 'tool': return { border: 'hover:border-cyan-500/50', iconBg: 'bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-50 group-hover:text-slate-950 shadow-cyan-500/10', colorText: 'text-cyan-400', shadow: 'hover:shadow-cyan-500/5' };
        case 'training': return { border: 'hover:border-amber-500/50', iconBg: 'bg-amber-500/10 text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 shadow-amber-500/10', colorText: 'text-amber-400', shadow: 'hover:shadow-amber-500/5' };
        case 'updates': return { border: 'hover:border-purple-500/50', iconBg: 'bg-purple-500/10 text-purple-400 group-hover:bg-purple-600 group-hover:text-white shadow-purple-500/10', colorText: 'text-purple-400', shadow: 'hover:shadow-purple-500/5' };
        default: return { border: 'hover:border-slate-500/30', iconBg: 'bg-slate-500/10 text-slate-400', colorText: 'text-slate-400', shadow: '' };
      }
    } else {
      switch(id) {
        case 'internal': return { border: 'hover:border-blue-500/30', iconBg: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white shadow-blue-500/5', colorText: 'text-blue-600', shadow: 'hover:shadow-blue-500/5' };
        case 'tool': return { border: 'hover:border-cyan-500/30', iconBg: 'bg-cyan-50 text-cyan-700 group-hover:bg-cyan-600 group-hover:text-white shadow-cyan-500/5', colorText: 'text-cyan-700', shadow: 'hover:shadow-cyan-500/5' };
        case 'training': return { border: 'hover:border-amber-500/30', iconBg: 'bg-amber-50 text-amber-700 group-hover:bg-amber-500 group-hover:text-slate-950 shadow-amber-500/5', colorText: 'text-amber-700', shadow: 'hover:shadow-amber-500/5' };
        case 'updates': return { border: 'hover:border-purple-500/30', iconBg: 'bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white shadow-purple-500/5', colorText: 'text-purple-600', shadow: 'hover:shadow-purple-500/5' };
        default: return { border: 'hover:border-slate-500/20', iconBg: 'bg-slate-100 text-slate-600', colorText: 'text-slate-600', shadow: '' };
      }
    }
  };

  return (
    <div className="animate-in fade-in duration-700 w-full flex flex-col justify-start lg:justify-center min-h-full max-w-6xl mx-auto space-y-10 pb-16 relative">
      
      {/* Premium Hero Banner */}
      <div className={`relative overflow-hidden rounded-[2.5rem] p-10 md:p-14 border transition-all duration-500 ${
        darkMode 
          ? 'bg-gradient-to-br from-slate-950 via-[#0e1626] to-[#080d19] border-slate-800/80 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)]' 
          : 'bg-gradient-to-br from-indigo-50 via-white to-cyan-50 text-slate-900 border-slate-200/60 shadow-xl shadow-slate-200/20'
      }`}>
        {/* Dynamic mesh graphics behind Hero */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-500/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/25 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        </div>
        
        <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all duration-300 ${
            darkMode 
              ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
              : 'bg-indigo-50 text-indigo-700 border-indigo-100 shadow-sm'
          }`}>
            <Sparkles size={12} className="animate-pulse" />
            <span>מרכז המחקר והחדשנות של מז"פ</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent dark:from-white dark:via-slate-200 dark:to-slate-500">
            DIFS AI Innovation Hub
          </h2>
          <p className={`text-base md:text-lg font-medium leading-relaxed max-w-2xl ${
            darkMode ? 'text-slate-400' : 'text-slate-600'
          }`}>
            הפלטפורמה המרכזית של החטיבה לזיהוי פלילי המרכזת פיתוחים ייעודיים, כלי בינה מלאכותית מתקדמים ומאגר הדרכות לשיפור ומקסום היכולות הפורנזיות.
          </p>
        </div>
      </div>

      {/* Categories Grid (Interactive Counters) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {CATEGORIES.slice(1).map((cat) => {
          const theme = getCategoryTheme(cat.id);
          const Icon = cat.icon;
          const count = getCount(cat.id);

          return (
            <div 
              key={cat.id}
              onClick={() => setActiveTab(cat.id)} 
              className={`cursor-pointer p-6 rounded-[2.2rem] border glass-card transition-all duration-300 group relative overflow-hidden ${theme.border} ${theme.shadow}`}
            >
              {/* Card light decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              
              <div className="flex justify-between items-start mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-md ${theme.iconBg}`}>
                  <Icon size={22} />
                </div>
                <span className={`text-xs font-black px-3 py-1 rounded-xl transition-all duration-300 ${
                  darkMode 
                    ? 'bg-slate-800/80 text-slate-300 group-hover:bg-cyan-500/20 group-hover:text-cyan-300 border border-slate-700/50' 
                    : 'bg-slate-100 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 border border-slate-200'
                }`}>
                  {count} {count === 1 ? 'פריט' : 'פריטים'}
                </span>
              </div>
              
              <h3 className="text-lg font-black mb-2 transition-colors duration-300 text-slate-800 dark:text-white group-hover:text-slate-950 dark:group-hover:text-white">
                {cat.label}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-xs mb-5 h-10 line-clamp-2">
                {cat.subtitle}. כלי עזר ומאגרי מידע מותאמים אישית.
              </p>
              
              <span className={`text-xs font-black flex items-center gap-1 group-hover:gap-2 transition-all duration-300 ${theme.colorText}`}>
                <span>פתח מאגר</span>
                <ArrowLeft size={14} className="transform group-hover:-translate-x-1 transition-transform" />
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default About;

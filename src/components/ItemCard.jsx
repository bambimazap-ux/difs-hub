import React from 'react';
import { 
  Plus, Search, ExternalLink, Bot, Trash2, Edit3, Settings,
  Sparkles, X, ShieldAlert, Pin, Send, Layout, Copy, 
  CheckCircle2, Moon, Sun, Share2, Lightbulb, 
  ChevronLeft, Menu, FileText, Activity, Shield, MessageSquare, Star, Users, Upload, Lock, KeyRound, Eye, Home, Zap, GraduationCap, ArrowLeft, Crown, Megaphone, Calendar
} from 'lucide-react';

const ItemCard = ({ 
  item, 
  isAdmin, 
  darkMode, 
  pinnedItems, 
  setPinnedItems, 
  feedbacks, 
  setEditingItem, 
  setIsModalOpen, 
  handleDelete, 
  toggleGlobalFeatured, 
  setReviewsItem, 
  setIsReviewsModalOpen, 
  setFeedbackItem, 
  setIsFeedbackModalOpen, 
  setViewItem, 
  setIsViewModalOpen,
  showToast 
}) => {
  const isPinned = pinnedItems.includes(item.id);
  const stats = feedbacks[item.id] || { totalRating: 0, count: 0, reviews: [] };
  const avgRating = stats.count > 0 ? (stats.totalRating / stats.count).toFixed(1) : '0.0';

  const togglePin = (id) => {
    if (pinnedItems.includes(id)) {
      setPinnedItems(pinnedItems.filter(x => x !== id));
      showToast('הוסר מהנעוצים');
    } else {
      setPinnedItems([...pinnedItems, id]);
      showToast('נעץ נשמר בהצלחה');
    }
  };

  const copyLink = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item.url);
    showToast('הקישור הועתק ללוח!');
  };

  // Get color configurations
  const getCategoryTheme = (cat) => {
    if (darkMode) {
      switch (cat) {
        case 'internal': return { text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' };
        case 'tool': return { text: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' };
        case 'training': return { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' };
        case 'updates': return { text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' };
        default: return { text: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20' };
      }
    } else {
      switch (cat) {
        case 'internal': return { text: 'text-blue-700', bg: 'bg-blue-50 border border-blue-200/60', border: 'border-blue-200/60' };
        case 'tool': return { text: 'text-cyan-800', bg: 'bg-cyan-50 border border-cyan-200/60', border: 'border-cyan-200/60' };
        case 'training': return { text: 'text-amber-800', bg: 'bg-amber-50 border border-amber-200/60', border: 'border-amber-200/60' };
        case 'updates': return { text: 'text-purple-700', bg: 'bg-purple-50 border border-purple-200/60', border: 'border-purple-200/60' };
        default: return { text: 'text-slate-700', bg: 'bg-slate-50 border border-slate-200/60', border: 'border-slate-200/60' };
      }
    }
  };

  const theme = getCategoryTheme(item.category);

  return (
    <div className={`rounded-[2rem] p-6 border glass-card flex flex-col justify-between group relative overflow-hidden transition-all duration-300 ${
      item.isFeatured ? 'featured-glow' : ''
    }`}>
      {/* Top Header Row */}
      <div className="flex items-center justify-between mb-4">
        {/* Category Indicator Badge */}
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${theme.bg} ${theme.text}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
          <span>
            {item.category === 'internal' ? 'מערכת פנימית' : 
             item.category === 'tool' ? 'כלי AI חיצוני' : 
             item.category === 'training' ? 'הדרכה / ידע' : 
             'עדכון מדור'}
          </span>
        </div>

        {/* Action icons row (copy, pin, edit/delete for admin) */}
        <div className="flex items-center gap-1.5">
          {/* Copy Link */}
          <button 
            onClick={copyLink} 
            className={`p-1.5 rounded-lg border transition-all duration-300 ${
              darkMode 
                ? 'bg-slate-900/40 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-800/80' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-500 border-slate-200'
            }`}
            title="העתק קישור"
          >
            <Copy size={13} />
          </button>

          {/* Pin Card */}
          <button 
            onClick={() => togglePin(item.id)} 
            className={`p-1.5 rounded-lg border transition-all duration-300 ${
              isPinned 
                ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' 
                : darkMode 
                  ? 'bg-slate-900/40 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-800/80' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-500 border-slate-200'
            }`}
            title={isPinned ? "הסר נעיצה" : "נעץ פריט"}
          >
            <Pin size={13} fill={isPinned ? "currentColor" : "none"} />
          </button>

          {/* Admin Controls */}
          {isAdmin && (
            <>
              {/* Toggle Featured */}
              <button 
                onClick={() => toggleGlobalFeatured(item)} 
                className={`p-1.5 rounded-lg border transition-all duration-300 ${
                  item.isFeatured 
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' 
                    : darkMode 
                      ? 'bg-slate-900/40 hover:bg-slate-800 text-slate-400 hover:text-amber-400 border-slate-800/80' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-500 border-slate-200'
                }`}
                title="מומלץ מערכת"
              >
                <Crown size={13} />
              </button>

              {/* Edit */}
              <button 
                onClick={() => { setEditingItem(item); setIsModalOpen(true); }} 
                className={`p-1.5 rounded-lg border transition-all duration-300 ${
                  darkMode 
                    ? 'bg-slate-900/40 hover:bg-slate-800 text-slate-400 hover:text-blue-400 border-slate-800/80' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-500 border-slate-200'
                }`}
                title="ערוך"
              >
                <Edit3 size={13} />
              </button>

              {/* Delete */}
              <button 
                onClick={() => handleDelete(item.id)} 
                className={`p-1.5 rounded-lg border transition-all duration-300 ${
                  darkMode 
                    ? 'bg-slate-900/40 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border-slate-800/80' 
                    : 'bg-slate-100 hover:bg-red-100 text-slate-500 border-slate-200 hover:text-red-600'
                }`}
                title="מחק"
              >
                <Trash2 size={13} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="space-y-3 mb-6 flex-grow">
        <div className="flex items-start gap-2 justify-between">
          <h4 className="text-lg font-black tracking-tight text-slate-800 dark:text-white group-hover:text-cyan-400 dark:group-hover:text-cyan-400 transition-colors duration-300">
            {item.title}
          </h4>
          {item.isFeatured && (
            <span className="flex items-center gap-1 text-[9px] font-black text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
              <Crown size={8} fill="currentColor" />
              <span>מומלץ</span>
            </span>
          )}
        </div>

        {/* Date for updates */}
        {item.category === 'updates' && item.eventDate && (
          <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400 dark:text-slate-500">
            <Calendar size={12} />
            <span>{new Date(item.eventDate).toLocaleDateString('he-IL')}</span>
          </div>
        )}

        <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed line-clamp-3 overflow-hidden">
          {item.description}
        </p>

        {/* Read More button if description is long or image exists */}
        {(item.description.length > 100 || item.imageUrl) && (
          <button 
            onClick={() => { setViewItem(item); setIsViewModalOpen(true); }}
            className="text-[11px] font-black text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-0.5 transition-colors"
          >
            <span>קרא עוד...</span>
            {item.imageUrl && (
              <span className="text-[9px] font-bold bg-white/5 px-1.5 py-0.2 rounded border border-white/5">תמונה</span>
            )}
          </button>
        )}
      </div>

      {/* Card Footer Rating Area */}
      <div className="space-y-4 pt-4 border-t border-slate-200/10 dark:border-slate-800/60 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center text-amber-400">
              <Star size={14} fill="currentColor" className="drop-shadow-[0_0_8px_rgba(245,158,11,0.2)]" />
            </div>
            <span className="text-xs font-black text-slate-800 dark:text-slate-200">{avgRating}</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">({stats.count} דירוגים)</span>
          </div>

          <div className="flex items-center gap-2">
            {stats.reviews.length > 0 && (
              <button 
                onClick={() => { setReviewsItem({ ...item, reviews: stats.reviews }); setIsReviewsModalOpen(true); }}
                className={`text-[11px] font-black px-2 py-1 rounded-lg transition-colors ${
                  darkMode ? 'hover:bg-slate-800/60 text-slate-400 hover:text-slate-200' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
                }`}
              >
                {stats.reviews.length} ביקורות
              </button>
            )}
            <button 
              onClick={() => { setFeedbackItem(item); setIsFeedbackModalOpen(true); }}
              className={`text-[11px] font-black px-3 py-1.5 rounded-xl transition-all duration-300 flex items-center gap-1 ${
                darkMode 
                  ? 'bg-slate-900/50 hover:bg-slate-800 text-cyan-400 border border-slate-800' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              <Star size={10} />
              <span>דרג כלי</span>
            </button>
          </div>
        </div>

        {/* Action Link button */}
        {item.url && (
          <a 
            href={item.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-black text-xs transition-all duration-300 shadow-md ${
              darkMode 
                ? 'bg-slate-800/60 hover:bg-cyan-500 text-slate-200 hover:text-slate-950 border border-slate-700/50 hover:border-cyan-400/30' 
                : 'bg-slate-900 text-white hover:bg-indigo-600 border border-slate-900 hover:border-indigo-500 shadow-slate-900/5'
            }`}
          >
            <span>
              {item.category === 'internal' ? 'הפעל מערכת' : 
               item.category === 'training' ? 'פתח הדרכה' : 
               item.category === 'updates' ? 'לפרטים נוספים' : 
               'פתח כלי'}
            </span>
            <ExternalLink size={12} />
          </a>
        )}
      </div>
    </div>
  );
};

export default ItemCard;

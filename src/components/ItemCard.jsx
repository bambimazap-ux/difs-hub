import React, { useState } from 'react';
import { 
  ExternalLink, Trash2, Edit3, Pin, Crown, Star, Copy, Calendar, ShieldAlert, ChevronDown, ChevronUp 
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
  showToast,
  categories = []
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
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

  // Resolve category configuration dynamically
  const matchedCat = categories.find(c => c.id === item.category);
  const categoryLabel = matchedCat ? matchedCat.label : 'כלי / פריט';
  const categoryColor = matchedCat ? matchedCat.color : 'slate';

  const getCategoryTheme = (color) => {
    if (darkMode) {
      switch (color) {
        case 'blue': return { text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' };
        case 'cyan': return { text: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' };
        case 'amber': return { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' };
        case 'purple': return { text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' };
        default: return { text: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20' };
      }
    } else {
      switch (color) {
        case 'blue': return { text: 'text-blue-700', bg: 'bg-blue-50 border border-blue-200/60', border: 'border-blue-200/60' };
        case 'cyan': return { text: 'text-cyan-800', bg: 'bg-cyan-50 border border-cyan-200/60', border: 'border-cyan-200/60' };
        case 'amber': return { text: 'text-amber-800', bg: 'bg-amber-50 border border-amber-200/60', border: 'border-amber-200/60' };
        case 'purple': return { text: 'text-purple-700', bg: 'bg-purple-50 border border-purple-200/60', border: 'border-purple-200/60' };
        default: return { text: 'text-slate-700', bg: 'bg-slate-50 border border-slate-200/60', border: 'border-slate-200/60' };
      }
    }
  };

  const theme = getCategoryTheme(categoryColor);

  return (
    <div className={`rounded-2xl p-4 md:p-5 border glass-card transition-all duration-300 ${
      item.isFeatured ? 'featured-glow' : ''
    }`}>
      {/* Top Header Row (Main Collapsed View) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-right">
        {/* Right side: Badge, Title, Rating, Date */}
        <div className="flex flex-col gap-1.5 flex-grow min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Dynamic Category Indicator Badge */}
            <div className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${theme.bg} ${theme.text}`}>
              <span className="w-1 h-1 rounded-full bg-current"></span>
              <span>{categoryLabel}</span>
            </div>

            {item.isFeatured && (
              <span className="flex items-center gap-1 text-[8px] font-black text-amber-500 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20 shrink-0">
                <Crown size={8} fill="currentColor" />
                <span>מומלץ</span>
              </span>
            )}

            {/* Date for updates/events */}
            {item.eventDate && (
              <div className="flex items-center gap-1 text-[9px] font-medium text-slate-400 dark:text-slate-500">
                <Calendar size={10} />
                <span>{new Date(item.eventDate).toLocaleDateString('he-IL')}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <h4 className="text-sm font-black tracking-tight text-slate-900 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-200 truncate">
              {item.title}
            </h4>
            
            {/* Mini rating indicator */}
            <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold shrink-0">
              <Star size={10} fill="currentColor" />
              <span>{avgRating}</span>
              <span className="text-slate-400 dark:text-slate-500 text-[8px]">({stats.count})</span>
            </div>
          </div>
        </div>

        {/* Left side: Action Controls & Buttons */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          {/* Quick launch button */}
          {item.url && (
            <a 
              href={item.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-black text-[10px] transition-all duration-200 shadow-sm shrink-0 ${
                darkMode 
                  ? 'bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white border border-slate-700/50' 
                  : 'bg-slate-900 text-white hover:bg-blue-600 border border-slate-900 hover:border-blue-500'
              }`}
            >
              <span>
                {item.category === 'training' || categoryLabel === 'הדרכות ומדריכים' ? 'פתח הדרכה' : 
                 item.category === 'updates' || categoryLabel === 'הנחיות ונהלי עבודה' ? 'לפרטים' : 
                 'הפעל'}
              </span>
              <ExternalLink size={10} />
            </a>
          )}

          {/* Copy Link */}
          {item.url && (
            <button 
              onClick={copyLink} 
              className={`p-2 rounded-lg border transition-all duration-200 ${
                darkMode 
                  ? 'bg-slate-900/40 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-800/80' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-500 border-slate-200'
              }`}
              title="העתק קישור"
            >
              <Copy size={12} />
            </button>
          )}

          {/* Pin Card */}
          <button 
            onClick={() => togglePin(item.id)} 
            className={`p-2 rounded-lg border transition-all duration-200 ${
              isPinned 
                ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' 
                : darkMode 
                  ? 'bg-slate-900/40 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-800/80' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-500 border-slate-200'
            }`}
            title={isPinned ? "הסר נעיצה" : "נעץ פריט"}
          >
            <Pin size={12} fill={isPinned ? "currentColor" : "none"} />
          </button>

          {/* Admin Controls */}
          {isAdmin && (
            <div className="flex items-center gap-1 border-r border-slate-200/10 dark:border-slate-800/60 pr-2 mr-1">
              {/* Toggle Featured */}
              <button 
                onClick={() => toggleGlobalFeatured(item)} 
                className={`p-2 rounded-lg border transition-all duration-200 ${
                  item.isFeatured 
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' 
                    : darkMode 
                      ? 'bg-slate-900/40 hover:bg-slate-800 text-slate-400 hover:text-amber-400 border-slate-800/80' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-500 border-slate-200'
                }`}
                title="מומלץ מערכת"
              >
                <Crown size={12} />
              </button>

              {/* Edit */}
              <button 
                onClick={() => { setEditingItem(item); setIsModalOpen(true); }} 
                className={`p-2 rounded-lg border transition-all duration-200 ${
                  darkMode 
                    ? 'bg-slate-900/40 hover:bg-slate-800 text-slate-400 hover:text-blue-400 border-slate-800/80' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-500 border-slate-200'
                }`}
                title="ערוך"
              >
                <Edit3 size={12} />
              </button>

              {/* Delete */}
              <button 
                onClick={() => handleDelete(item.id)} 
                className={`p-2 rounded-lg border transition-all duration-200 ${
                  darkMode 
                    ? 'bg-slate-900/40 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border-slate-800/80' 
                    : 'bg-slate-100 hover:bg-red-100 text-slate-500 border-slate-200 hover:text-red-600'
                }`}
                title="מחק"
              >
                <Trash2 size={12} />
              </button>
            </div>
          )}

          {/* Expand Chevron Toggle */}
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className={`p-2 rounded-lg border transition-all duration-200 ${
              darkMode 
                ? 'bg-slate-900/40 hover:bg-slate-800 text-slate-400 hover:text-white border-slate-800/80' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
            }`}
            aria-label={isExpanded ? "סגור פרטים" : "פתח פרטים"}
            title={isExpanded ? "סגור פרטים" : "פתח פרטים"}
          >
            {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        </div>
      </div>

      {/* Expanded Content Drawer */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-slate-200/10 dark:border-slate-800/60 animate-in fade-in slide-in-from-top-2 duration-200 space-y-4 text-right">
          
          {/* Main Description Text */}
          <p className="text-slate-600 dark:text-slate-350 text-xs leading-relaxed font-medium">
            {item.description}
          </p>

          {/* Image preview support */}
          {item.imageUrl && (
            <div className="pt-1">
              <button 
                onClick={() => { setViewItem(item); setIsViewModalOpen(true); }}
                className="text-[10px] font-black text-blue-500 dark:text-blue-400 hover:underline flex items-center gap-1 transition-colors"
              >
                <span>הצג תמונה ומפרט מלא</span>
              </button>
            </div>
          )}

          {/* Card Footer Rating & Detailed Controls Area */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200/5 dark:border-slate-800/40">
            <div className="flex items-center gap-1.5 font-bold">
              <div className="flex items-center text-amber-400">
                <Star size={13} fill="currentColor" />
              </div>
              <span className="text-xs text-slate-900 dark:text-slate-200">{avgRating}</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">({stats.count} דירוגים)</span>
            </div>

            <div className="flex items-center gap-2">
              {stats.reviews.length > 0 && (
                <button 
                  onClick={() => { setReviewsItem({ ...item, reviews: stats.reviews }); setIsReviewsModalOpen(true); }}
                  className={`text-[10px] font-black px-3 py-1.5 rounded-lg transition-colors ${
                    darkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-200' : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {stats.reviews.length} ביקורות
                </button>
              )}
              <button 
                onClick={() => { setFeedbackItem(item); setIsFeedbackModalOpen(true); }}
                className={`text-[10px] font-black px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  darkMode 
                    ? 'bg-slate-900/50 hover:bg-slate-800 text-slate-300 border border-slate-800' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                <Star size={12} />
                <span>דרג כלי</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemCard;

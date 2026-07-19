import React, { useState } from 'react';
import { 
  ExternalLink, Trash2, Edit3, Pin, Crown, Star, Copy, Calendar, ShieldAlert, ChevronDown, ChevronUp 
} from 'lucide-react';
import { iconMap } from './Sidebar.jsx';

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
        case 'blue': return { text: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' };
        case 'cyan': return { text: 'text-secondary', bg: 'bg-secondary/10', border: 'border-secondary/20' };
        case 'amber': return { text: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' };
        case 'purple': return { text: 'text-tertiary', bg: 'bg-tertiary/10', border: 'border-tertiary/20' };
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
    <div className={`rounded-xl p-5 border glass-panel transition-all duration-300 relative overflow-hidden flex flex-col gap-4 group ${
      item.isFeatured ? 'border-primary/30 shadow-[0_0_15px_rgba(173,198,255,0.06)]' : 'border-outline-variant/15'
    }`}>
      {/* Scan line effect for active/featured cards in dark mode */}
      {item.isFeatured && darkMode && (
        <div className="scan-line"></div>
      )}

      {/* Right accent border bar */}
      <div className={`absolute top-0 right-0 w-1 h-full transition-all duration-300 group-hover:w-1.5 ${
        item.isFeatured 
          ? 'bg-primary' 
          : darkMode ? 'bg-outline-variant/65' : 'bg-slate-350'
      }`}></div>

      {/* Top Left Controls Row */}
      <div className="absolute top-4 left-4 flex gap-1 z-20">
        {/* Copy Link */}
        {item.url && (
          <button 
            onClick={copyLink} 
            className="text-on-surface-variant/70 hover:text-primary transition-all p-1 rounded hover:bg-surface-variant/30 active:scale-[0.9]"
            title="העתק קישור"
          >
            <Copy size={14} />
          </button>
        )}

        {/* Pin Card */}
        <button 
          onClick={() => togglePin(item.id)} 
          className={`transition-all p-1 rounded hover:bg-surface-variant/30 active:scale-[0.9] ${
            isPinned ? 'text-primary' : 'text-on-surface-variant/70 hover:text-primary'
          }`}
          title={isPinned ? "הסר נעיצה" : "נעץ פריט"}
        >
          <Pin size={14} fill={isPinned ? "currentColor" : "none"} />
        </button>

        {/* Admin Controls */}
        {isAdmin && (
          <>
            {/* Toggle Featured */}
            <button 
              onClick={() => toggleGlobalFeatured(item)} 
              className={`transition-all p-1 rounded hover:bg-surface-variant/30 active:scale-[0.9] ${
                item.isFeatured ? 'text-amber-500' : 'text-on-surface-variant/70 hover:text-amber-400'
              }`}
              title="מומלץ מערכת"
            >
              <Crown size={14} fill={item.isFeatured ? "currentColor" : "none"} />
            </button>

            {/* Edit */}
            <button 
              onClick={() => { setEditingItem(item); setIsModalOpen(true); }} 
              className="text-on-surface-variant/70 hover:text-primary transition-all p-1 rounded hover:bg-surface-variant/30 active:scale-[0.9]"
              title="ערוך"
            >
              <Edit3 size={14} />
            </button>

            {/* Delete */}
            <button 
              onClick={() => handleDelete(item.id)} 
              className="text-on-surface-variant/70 hover:text-red-400 transition-all p-1 rounded hover:bg-surface-variant/30 active:scale-[0.9]"
              title="מחק"
            >
              <Trash2 size={14} />
            </button>
          </>
        )}
      </div>

      {/* Main Info Row (Icon Box + Category badge + Title) */}
      <div className="flex items-start gap-3.5 text-right mt-1">
        {/* Icon Box */}
        <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 border transition-all duration-300 ${
          darkMode 
            ? 'bg-surface-container-high border-outline-variant/40 text-primary shadow-[0_0_10px_rgba(173,198,255,0.06)]' 
            : 'bg-slate-50 border-slate-200 text-blue-600'
        }`}>
          {(() => {
            const Icon = iconMap[categories.find(c => c.id === item.category)?.iconName || 'HelpCircle'];
            return <Icon size={20} />;
          })()}
        </div>

        {/* Badge & Title */}
        <div className="flex flex-col min-w-0 pr-0.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`px-2 py-0.5 rounded-sm font-label-sm text-[8px] font-black tracking-wider border uppercase ${theme.bg} ${theme.text} ${theme.border}`}>
              {categoryLabel}
            </span>
            {item.eventDate && (
              <span className="text-[8px] font-bold text-slate-400 dark:text-on-surface-variant/60 flex items-center gap-0.5">
                <Calendar size={8} />
                <span>{new Date(item.eventDate).toLocaleDateString('he-IL')}</span>
              </span>
            )}
          </div>
          <h3 className="text-xs md:text-sm font-black text-slate-900 dark:text-on-surface mt-1 truncate max-w-[160px] sm:max-w-xs leading-tight">
            {item.title}
          </h3>
        </div>
      </div>

      {/* Card Description */}
      <p 
        onClick={() => { setViewItem(item); setIsViewModalOpen(true); }}
        className="text-[11px] leading-relaxed text-slate-500 dark:text-on-surface-variant flex-1 line-clamp-3 pr-0.5 cursor-pointer hover:text-primary transition-colors text-right"
        title="לחץ לקריאה מורחבת"
      >
        {item.description}
      </p>

      {/* Footer Section */}
      <div className="flex items-center justify-between border-t border-slate-250/10 dark:border-outline-variant/20 pt-3 mt-auto">
        {/* Rating column */}
        <div className="flex flex-col items-start pr-0.5">
          <div className="flex items-center text-amber-500 gap-0.5 font-bold">
            <span className="text-[10px] text-slate-900 dark:text-on-surface">{avgRating}</span>
            <Star size={10} fill="currentColor" />
            <span className="text-slate-400 dark:text-on-surface-variant/65 text-[8px] font-medium mr-0.5">({stats.count})</span>
          </div>
          <button 
            onClick={() => { setReviewsItem({ ...item, reviews: stats.reviews }); setIsReviewsModalOpen(true); }}
            className="text-[9px] text-primary hover:underline mt-0.5 font-black text-right"
          >
            צפה בביקורות
          </button>
        </div>

        {/* Buttons Controls */}
        <div className="flex items-center gap-1.5">
          {/* Rate Button */}
          <button 
            onClick={() => { setFeedbackItem(item); setIsFeedbackModalOpen(true); }}
            className={`p-1.5 rounded-lg border transition-all active:scale-[0.93] ${
              darkMode 
                ? 'bg-surface-variant/40 hover:bg-surface-bright text-on-surface border-outline-variant/30' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
            title="דרג כלי"
          >
            <Star size={12} />
          </button>

          {/* Expand Toggle */}
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className={`p-1.5 rounded-lg border transition-all active:scale-[0.93] ${
              darkMode 
                ? 'bg-surface-variant/40 hover:bg-surface-bright text-on-surface border-outline-variant/30' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
            title={isExpanded ? "סגור פרטים" : "פתח פרטים נוספים"}
          >
            {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>

          {/* Launch Button */}
          {item.url && (
            <a 
              href={item.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`btn-primary px-3.5 py-1.5 rounded font-label-md text-[10px] font-bold flex items-center gap-1 transition-all shadow-sm shrink-0 active:scale-[0.95] ${
                darkMode 
                  ? 'bg-primary/20 hover:bg-primary text-primary hover:text-[#002e6a] border border-primary/30 hover:shadow-[0_0_12px_rgba(173,198,255,0.15)]' 
                  : 'bg-slate-900 text-white hover:bg-blue-600 border border-slate-900'
              }`}
            >
              <span>
                {item.category === 'training' ? 'פתח הדרכה' : 
                 item.category === 'updates' ? 'לפרטים' : 
                 'הפעל כלי'}
              </span>
              <ExternalLink size={10} />
            </a>
          )}
        </div>
      </div>

      {/* Expanded Details Drawer */}
      {isExpanded && (
        <div className="mt-2 pt-3 border-t border-slate-200/10 dark:border-outline-variant/20 animate-in fade-in slide-in-from-top-1 duration-200 text-right text-[10px] text-slate-500 dark:text-on-surface-variant leading-relaxed">
          {item.imageUrl && (
            <div className="mb-2">
              <button 
                onClick={() => { setViewItem(item); setIsViewModalOpen(true); }}
                className="text-[9px] font-black text-primary hover:underline"
              >
                הצג תמונה ומפרט מלא
              </button>
            </div>
          )}
          <div>מזהה כלי: <span className="font-mono">{item.id}</span></div>
          {item.updatedAt && (
            <div>עודכן לאחרונה: {new Date(item.updatedAt).toLocaleString('he-IL')}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ItemCard;

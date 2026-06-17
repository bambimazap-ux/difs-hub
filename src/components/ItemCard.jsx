import React from 'react';
import { 
  ExternalLink, Trash2, Edit3, Pin, Crown, Star, Copy, Calendar, ShieldAlert 
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
    <div className={`rounded-[2rem] p-6 border glass-card flex flex-col justify-between group relative overflow-hidden transition-all duration-300 ${
      item.isFeatured ? 'featured-glow' : ''
    }`}>
      {/* Top Header Row */}
      <div className="flex items-center justify-between mb-4">
        {/* Dynamic Category Indicator Badge */}
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${theme.bg} ${theme.text}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
          <span>{categoryLabel}</span>
        </div>

        {/* Action icons row (copy, pin, edit/delete for admin) */}
        <div className="flex items-center gap-1.5">
          {/* Copy Link */}
          {item.url && (
            <button 
              onClick={copyLink} 
              className={`p-1.5 rounded-lg border transition-all duration-200 ${
                darkMode 
                  ? 'bg-slate-900/40 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border-slate-800/80' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-500 border-slate-200'
              }`}
              title="העתק קישור"
            >
              <Copy size={13} />
            </button>
          )}

          {/* Pin Card */}
          <button 
            onClick={() => togglePin(item.id)} 
            className={`p-1.5 rounded-lg border transition-all duration-200 ${
              isPinned 
                ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' 
                : darkMode 
                  ? 'bg-slate-900/40 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border-slate-800/80' 
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
                className={`p-1.5 rounded-lg border transition-all duration-200 ${
                  item.isFeatured 
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' 
                    : darkMode 
                      ? 'bg-slate-900/40 hover:bg-slate-850 text-slate-400 hover:text-amber-400 border-slate-800/80' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-500 border-slate-200'
                }`}
                title="מומלץ מערכת"
              >
                <Crown size={13} />
              </button>

              {/* Edit */}
              <button 
                onClick={() => { setEditingItem(item); setIsModalOpen(true); }} 
                className={`p-1.5 rounded-lg border transition-all duration-200 ${
                  darkMode 
                    ? 'bg-slate-900/40 hover:bg-slate-850 text-slate-400 hover:text-blue-400 border-slate-800/80' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-500 border-slate-200'
                }`}
                title="ערוך"
              >
                <Edit3 size={13} />
              </button>

              {/* Delete */}
              <button 
                onClick={() => handleDelete(item.id)} 
                className={`p-1.5 rounded-lg border transition-all duration-200 ${
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
          <h4 className="text-base font-black tracking-tight text-slate-900 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-200">
            {item.title}
          </h4>
          {item.isFeatured && (
            <span className="flex items-center gap-1 text-[9px] font-black text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20 shrink-0">
              <Crown size={8} fill="currentColor" />
              <span>מומלץ</span>
            </span>
          )}
        </div>

        {/* Date for updates/events */}
        {item.eventDate && (
          <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400 dark:text-slate-500">
            <Calendar size={11} />
            <span>{new Date(item.eventDate).toLocaleDateString('he-IL')}</span>
          </div>
        )}

        <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed line-clamp-3 overflow-hidden">
          {item.description}
        </p>

        {/* Read More button if description is long or image exists */}
        {(item.description.length > 100 || item.imageUrl) && (
          <button 
            onClick={() => { setViewItem(item); setIsViewModalOpen(true); }}
            className="text-[10px] font-black text-blue-500 dark:text-blue-400 hover:underline flex items-center gap-1 transition-colors"
          >
            <span>קרא עוד...</span>
            {item.imageUrl && (
              <span className="text-[9px] font-bold bg-slate-500/5 px-1.5 py-0.2 rounded border border-slate-500/10">תמונה</span>
            )}
          </button>
        )}
      </div>

      {/* Card Footer Rating Area */}
      <div className="space-y-4 pt-4 border-t border-slate-200/10 dark:border-slate-800/60 shrink-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center text-amber-400">
              <Star size={13} fill="currentColor" />
            </div>
            <span className="text-xs font-black text-slate-900 dark:text-slate-200">{avgRating}</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">({stats.count} דירוגים)</span>
          </div>

          <div className="flex items-center gap-2">
            {stats.reviews.length > 0 && (
              <button 
                onClick={() => { setReviewsItem({ ...item, reviews: stats.reviews }); setIsReviewsModalOpen(true); }}
                className={`text-[10px] font-black px-2 py-1 rounded-lg transition-colors ${
                  darkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-200' : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                {stats.reviews.length} ביקורות
              </button>
            )}
            <button 
              onClick={() => { setFeedbackItem(item); setIsFeedbackModalOpen(true); }}
              className={`text-[10px] font-black px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
                darkMode 
                  ? 'bg-slate-900/50 hover:bg-slate-800 text-slate-300 border border-slate-800' 
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
            className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-black text-xs transition-all duration-200 shadow-sm ${
              darkMode 
                ? 'bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white border border-slate-700' 
                : 'bg-slate-900 text-white hover:bg-blue-600 border border-slate-900 hover:border-blue-500'
            }`}
          >
            <span>
              {item.category === 'training' || categoryLabel === 'הדרכות ומדריכים' ? 'פתח הדרכה' : 
               item.category === 'updates' || categoryLabel === 'הנחיות ונהלי עבודה' ? 'לפרטים נוספים' : 
               'הפעל כעת'}
            </span>
            <ExternalLink size={11} />
          </a>
        )}
      </div>
    </div>
  );
};

export default ItemCard;

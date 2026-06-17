import React, { useState } from 'react';
import { X, Send, Lock, KeyRound, Star, Upload, ExternalLink } from 'lucide-react';
import { CATEGORIES } from './Sidebar.jsx';

// SHA-256 hash helper for secure client-side admin password validation
const sha256 = async (message) => {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const Modals = ({
  darkMode,
  isViewModalOpen, setIsViewModalOpen, viewItem,
  isLoginModalOpen, setIsLoginModalOpen, handleAdminLoginSuccess,
  isModalOpen, setIsModalOpen, editingItem, handleSave, formData, setFormData,
  isImportModalOpen, setIsImportModalOpen, jsonInput, setJsonInput, handleBulkImport,
  isFeedbackModalOpen, setIsFeedbackModalOpen, feedbackItem, handleSendFeedback, feedbackData, setFeedbackData,
  isReviewsModalOpen, setIsReviewsModalOpen, reviewsItem
}) => {

  // Local state for password verification
  const [loginPassword, setLoginPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Convert Google Drive Links to Direct Images
  const getDirectImageUrl = (url) => {
    if (!url) return '';
    const idMatch = url.match(/\/d\/([-_\w]+)/) || url.match(/id=([-_\w]+)/);
    if (idMatch && idMatch[1]) {
      return `https://lh3.googleusercontent.com/d/${idMatch[1]}`;
    }
    return url;
  };

  // Admin login handler
  const handleLocalAdminLogin = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    try {
      const hash = await sha256(loginPassword);
      // SHA-256 hash of "123456"
      if (hash === '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92') {
        handleAdminLoginSuccess();
        setIsLoginModalOpen(false);
        setLoginPassword('');
      } else {
        alert('סיסמה שגויה!');
      }
    } catch (err) {
      console.error(err);
      alert('שגיאה בתהליך האימות');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <>
      {/* 1. View Item Modal (Read More) */}
      {isViewModalOpen && viewItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className={`w-full max-w-lg rounded-[2rem] p-8 shadow-2xl flex flex-col max-h-[85vh] border transition-all ${
            darkMode ? 'bg-slate-900/95 border-slate-800 text-white' : 'bg-white text-slate-900 border-slate-200'
          }`}>
            <div className="flex justify-between items-start mb-6 shrink-0">
              <div className="pr-2">
                <h3 className="text-2xl font-black leading-tight">{viewItem.title}</h3>
                <p className="text-[10px] text-cyan-400 mt-1 font-black uppercase tracking-wider">
                  {CATEGORIES.find(c => c.id === viewItem.category)?.label}
                </p>
              </div>
              <button 
                onClick={() => setIsViewModalOpen(false)} 
                className={`p-2 rounded-xl transition-colors ${darkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500'}`}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-grow overflow-y-auto pr-2 mb-6 custom-scrollbar">
              {/* Image Preview Container */}
              {viewItem.imageUrl && (
                <div className="mb-6 rounded-2xl overflow-hidden shadow-md bg-slate-950/35 border border-white/5 relative min-h-[120px] flex items-center justify-center">
                  <img 
                    src={getDirectImageUrl(viewItem.imageUrl)} 
                    alt={viewItem.title} 
                    className="w-full h-auto object-cover" 
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <p className={`text-sm leading-relaxed whitespace-pre-wrap font-medium ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                {viewItem.description}
              </p>
            </div>

            <div className="shrink-0 pt-6 border-t border-slate-200/10 dark:border-slate-800/60">
              {viewItem.url && (
                <a 
                  href={viewItem.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-black text-sm transition-all shadow-lg shadow-cyan-500/10 ${
                    darkMode ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400' : 'bg-indigo-600 text-white hover:bg-indigo-500'
                  }`}
                >
                  <span>הפעל כעת</span>
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. Admin Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className={`w-full max-w-sm rounded-[2rem] p-8 shadow-2xl text-center border transition-all ${
            darkMode ? 'bg-slate-900/95 border-slate-800 text-white' : 'bg-white text-slate-900 border-slate-200'
          }`}>
            <div className="w-16 h-16 bg-cyan-500/10 text-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-cyan-500/20 shadow-lg shadow-cyan-500/5">
              <Lock size={28} className={isVerifying ? "animate-pulse" : ""} />
            </div>
            <h3 className="text-xl font-black mb-1">כניסת מנהל</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-6 font-medium">הזן סיסמת ניהול לצורך עריכת תכנים</p>
            
            <form onSubmit={handleLocalAdminLogin} className="space-y-4">
              <div className="relative">
                <KeyRound className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="password" 
                  placeholder="סיסמת ניהול" 
                  className={`w-full pr-12 pl-4 py-3 rounded-xl border bg-transparent outline-none transition-all ${
                    darkMode ? 'border-slate-800 focus:border-cyan-500 focus:bg-slate-950' : 'border-slate-200 focus:border-indigo-500 focus:bg-white'
                  }`}
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="flex gap-3">
                <button 
                  type="button" 
                  onClick={() => { setIsLoginModalOpen(false); setLoginPassword(''); }} 
                  className={`flex-1 py-3.5 rounded-xl font-black text-xs transition-colors ${
                    darkMode ? 'bg-slate-800/80 hover:bg-slate-800 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  ביטול
                </button>
                <button 
                  type="submit" 
                  className={`flex-1 py-3.5 rounded-xl font-black text-xs text-white transition-all shadow-md ${
                    darkMode ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-cyan-500/5' : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/5'
                  }`}
                >
                  {isVerifying ? 'מאמת...' : 'כניסה'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Item Form Modal (Add / Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className={`w-full max-w-lg rounded-[2rem] p-8 shadow-2xl border transition-all ${
            darkMode ? 'bg-slate-900/95 border-slate-800 text-white' : 'bg-white text-slate-900 border-slate-200'
          }`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black">{editingItem ? 'עריכת פריט' : 'הוספת פריט חדש'}</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className={`p-1.5 rounded-xl transition-colors ${darkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="space-y-4">
              <input 
                required 
                placeholder="שם הפריט / הכלי" 
                className={`w-full p-3 rounded-xl border bg-transparent outline-none focus:border-cyan-500 dark:border-slate-800`}
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
              />
              
              <input 
                required={formData.category !== 'updates'} 
                placeholder={formData.category === 'updates' ? "URL קישור (אופציונלי)" : "URL קישור"}
                dir="ltr" 
                className={`w-full p-3 rounded-xl border bg-transparent outline-none focus:border-cyan-500 dark:border-slate-800 text-left`}
                value={formData.url} 
                onChange={e => setFormData({...formData, url: e.target.value})} 
              />
              
              <input 
                placeholder="קישור לתמונה / באנר (אופציונלי)" 
                dir="ltr" 
                className={`w-full p-3 rounded-xl border bg-transparent outline-none focus:border-cyan-500 dark:border-slate-800 text-left`}
                value={formData.imageUrl || ''} 
                onChange={e => setFormData({...formData, imageUrl: e.target.value})} 
              />
              
              <div className="grid grid-cols-2 gap-4">
                <select 
                  className={`w-full p-3 rounded-xl border bg-transparent outline-none focus:border-cyan-500 dark:border-slate-800 dark:bg-slate-900`}
                  value={formData.category} 
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  {CATEGORIES.slice(1).map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
                
                {formData.category === 'updates' ? (
                  <input 
                    type="date" 
                    className={`w-full p-3 rounded-xl border bg-transparent outline-none focus:border-cyan-500 dark:border-slate-800`}
                    value={formData.eventDate || ''} 
                    onChange={e => setFormData({...formData, eventDate: e.target.value})}
                  />
                ) : (
                  <div className={`p-3 text-xs text-slate-400 dark:text-slate-500 font-bold flex items-center justify-center rounded-xl border bg-slate-500/5 border-transparent`}>
                    אין שדות תאריך
                  </div>
                )}
              </div>

              <textarea 
                rows="3" 
                placeholder="תיאור קצר והסברים על הפריט..." 
                className={`w-full p-3 rounded-xl border bg-transparent outline-none focus:border-cyan-500 dark:border-slate-800`}
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
              />
              
              <button className={`w-full py-3.5 rounded-2xl font-black text-xs text-white transition-all shadow-md ${
                darkMode ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-cyan-500/5' : 'bg-indigo-600 hover:bg-indigo-500'
              }`}>
                שמור
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className={`w-full max-w-2xl rounded-[2rem] p-8 shadow-2xl border transition-all ${
            darkMode ? 'bg-slate-900/95 border-slate-800 text-white' : 'bg-white text-slate-900 border-slate-200'
          }`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black">ייבוא המוני (JSON)</h3>
              <button 
                onClick={() => setIsImportModalOpen(false)}
                className={`p-1.5 rounded-xl transition-colors ${darkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                הדבק כאן רשימת אובייקטים בפורמט JSON תקני. דוגמה למבנה:<br/>
                <code className="bg-slate-500/10 px-2 py-0.5 rounded text-[11px] font-mono mt-1 block" dir="ltr">
                  [{`{"title":"כלי חדש", "url":"https://...", "description":"הסבר על הכלי", "category":"internal"}`}]
                </code>
              </p>
              <textarea 
                rows="8" 
                className={`w-full p-4 rounded-xl border bg-transparent outline-none focus:border-cyan-500 dark:border-slate-800 font-mono text-xs`}
                dir="ltr"
                value={jsonInput}
                onChange={e => setJsonInput(e.target.value)}
              />
              <button 
                onClick={handleBulkImport} 
                className={`w-full py-3.5 rounded-2xl font-black text-xs text-white transition-all shadow-md flex items-center justify-center gap-2 ${
                  darkMode ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-cyan-500/5' : 'bg-indigo-600 hover:bg-indigo-500'
                }`}
              >
                <Upload size={16} />
                <span>בצע ייבוא</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Feedback Modal (Rate Item) */}
      {isFeedbackModalOpen && feedbackItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className={`w-full max-w-md rounded-[2rem] p-8 shadow-2xl border transition-all ${
            darkMode ? 'bg-slate-900/95 border-slate-800 text-white' : 'bg-white text-slate-900 border-slate-200'
          }`}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-black">דירוג כלי / פריט</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{feedbackItem.title}</p>
              </div>
              <button 
                onClick={() => setIsFeedbackModalOpen(false)}
                className={`p-1.5 rounded-xl transition-colors ${darkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSendFeedback} className="space-y-6">
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFeedbackData({ ...feedbackData, rating: star })}
                    className={`p-1.5 transition-transform hover:scale-115 ${
                      feedbackData.rating >= star ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'
                    }`}
                  >
                    <Star size={32} fill={feedbackData.rating >= star ? "currentColor" : "none"} />
                  </button>
                ))}
              </div>
              
              <textarea 
                rows="3" 
                placeholder="הערות או ביקורת מילולית על תפקוד הכלי (אופציונלי)..." 
                className={`w-full p-4 rounded-xl border bg-transparent outline-none focus:border-cyan-500 dark:border-slate-800 resize-none`}
                value={feedbackData.text} 
                onChange={e => setFeedbackData({...feedbackData, text: e.target.value})} 
              />
              
              <button className={`w-full py-3.5 rounded-2xl font-black text-xs text-white transition-all shadow-md flex items-center justify-center gap-2 ${
                darkMode ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400' : 'bg-indigo-600 hover:bg-indigo-500'
              }`}>
                <Send size={14} />
                <span>שלח דירוג</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 6. Reviews View Modal */}
      {isReviewsModalOpen && reviewsItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className={`w-full max-w-lg rounded-[2rem] p-8 shadow-2xl flex flex-col max-h-[80vh] border transition-all ${
            darkMode ? 'bg-slate-900/95 border-slate-800 text-white' : 'bg-white text-slate-900 border-slate-200'
          }`}>
            <div className="flex justify-between items-center mb-6 shrink-0">
              <div>
                <h3 className="text-xl font-black">ביקורות משתמשים</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{reviewsItem.title}</p>
              </div>
              <button 
                onClick={() => setIsReviewsModalOpen(false)}
                className={`p-1.5 rounded-xl transition-colors ${darkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-grow overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {reviewsItem.reviews.length === 0 ? (
                <p className="text-center text-slate-400 py-10 font-bold text-xs">אין ביקורות מילוליות לכלי זה</p>
              ) : (
                reviewsItem.reviews.map((rev, idx) => (
                  <div key={idx} className={`p-4 rounded-2xl border ${
                    darkMode ? 'bg-slate-950/40 border-slate-900' : 'bg-slate-50 border-slate-100'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => <Star key={i} size={11} fill="currentColor" />)}
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold">
                        {new Date(rev.date).toLocaleDateString('he-IL')}
                      </span>
                    </div>
                    <p className={`text-xs font-medium ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>"{rev.text}"</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modals;

import React, { useState } from 'react';
import { 
  X, Send, Lock, KeyRound, Star, Upload, ExternalLink, Settings, 
  Trash2, Plus, Edit, Save, BookOpen, MessageSquare, ShieldAlert, 
  Calendar, Check, User, Phone, Globe, HelpCircle 
} from 'lucide-react';
import { iconMap } from './Sidebar.jsx';

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
  isReviewsModalOpen, setIsReviewsModalOpen, reviewsItem,
  
  // Dynamic categories CMS & Backlog props
  categories = [],
  toolRequests = [],
  settings = {},
  isSuggestModalOpen, setIsSuggestModalOpen,
  isAdminPanelOpen, setIsAdminPanelOpen,
  handleAddCategory, handleDeleteCategory,
  handleSaveSettings, handleDeleteToolRequest,
  handleSubmitToolRequest
}) => {

  // Local state for password verification
  const [loginPassword, setLoginPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Admin Panel Local Navigation Tab
  const [adminTab, setAdminTab] = useState('categories');

  // Local states for adding a new Category
  const [newCatData, setNewCatData] = useState({
    id: '',
    label: '',
    subtitle: '',
    iconName: 'Bot',
    color: 'blue',
    order: 5
  });

  // Local states for suggesting a Tool
  const [suggestData, setSuggestData] = useState({
    toolName: '',
    description: '',
    suggestedUrl: '',
    contactInfo: ''
  });

  // Local states for updating portal settings
  const [localSettings, setLocalSettings] = useState({
    whatsappUrl: '',
    announcement: '',
    announcementActive: true
  });

  // Load settings into local inputs when opening Admin Panel
  React.useEffect(() => {
    if (settings) {
      setLocalSettings({
        whatsappUrl: settings.whatsappUrl || 'https://chat.whatsapp.com/default-placeholder-link',
        announcement: settings.announcement || '',
        announcementActive: settings.announcementActive !== false
      });
    }
  }, [settings, isAdminPanelOpen]);

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

  const handleSuggestSubmitLocal = (e) => {
    e.preventDefault();
    if (!suggestData.toolName.trim() || !suggestData.description.trim()) {
      alert('אנא מלא את השדות החובה');
      return;
    }
    handleSubmitToolRequest(suggestData);
    setSuggestData({ toolName: '', description: '', suggestedUrl: '', contactInfo: '' });
    setIsSuggestModalOpen(false);
  };

  const handleCatSubmitLocal = (e) => {
    e.preventDefault();
    if (!newCatData.label.trim()) return;
    const catId = newCatData.id.trim() || newCatData.label.trim().toLowerCase().replace(/\s+/g, '-');
    handleAddCategory({
      ...newCatData,
      id: catId,
      order: Number(newCatData.order)
    });
    setNewCatData({ id: '', label: '', subtitle: '', iconName: 'Bot', color: 'blue', order: 5 });
  };

  const handleSaveSettingsLocal = (e) => {
    e.preventDefault();
    handleSaveSettings(localSettings);
  };

  return (
    <>
      {/* 1. View Item Modal (Read More) */}
      {isViewModalOpen && viewItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className={`w-full max-w-lg rounded-[2rem] p-8 shadow-2xl flex flex-col max-h-[85vh] border transition-all ${
            darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white text-slate-900 border-slate-200'
          }`}>
            <div className="flex justify-between items-start mb-6 shrink-0">
              <div className="pr-2">
                <h3 className="text-xl font-black leading-tight">{viewItem.title}</h3>
                <p className="text-[10px] text-blue-500 dark:text-blue-400 mt-1 font-black uppercase tracking-wider">
                  {categories.find(c => c.id === viewItem.category)?.label || 'כלי / פריט'}
                </p>
              </div>
              <button 
                onClick={() => setIsViewModalOpen(false)} 
                className={`p-2 rounded-xl transition-colors ${darkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500'}`}
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="flex-grow overflow-y-auto pr-2 mb-6 custom-scrollbar text-right">
              {/* Image Preview Container */}
              {viewItem.imageUrl && (
                <div className="mb-6 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 relative flex items-center justify-center bg-slate-500/5">
                  <img 
                    src={getDirectImageUrl(viewItem.imageUrl)} 
                    alt={viewItem.title} 
                    className="w-full h-auto max-h-[240px] object-contain" 
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <p className={`text-xs md:text-sm leading-relaxed whitespace-pre-wrap font-medium ${darkMode ? 'text-slate-300' : 'text-slate-650 text-slate-700'}`}>
                {viewItem.description}
              </p>
            </div>

            <div className="shrink-0 pt-6 border-t border-slate-200/10 dark:border-slate-800/60">
              {viewItem.url && (
                <a 
                  href={viewItem.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-black text-xs transition-all shadow-sm ${
                    darkMode ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-slate-900 hover:bg-blue-600 text-white'
                  }`}
                >
                  <span>הפעל כעת</span>
                  <ExternalLink size={12} />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. Admin Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className={`w-full max-w-sm rounded-[2rem] p-8 shadow-2xl text-center border transition-all ${
            darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white text-slate-900 border-slate-200'
          }`}>
            <div className="w-14 h-14 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/20 shadow-sm">
              <Lock size={24} className={isVerifying ? "animate-pulse" : ""} />
            </div>
            <h3 className="text-lg font-black mb-1">כניסת מנהל</h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mb-6 font-medium">הזן סיסמת ניהול לצורך עריכת תכנים</p>
            
            <form onSubmit={handleLocalAdminLogin} className="space-y-4">
              <div className="relative">
                <KeyRound className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-450 text-slate-500 w-4 h-4" />
                <input 
                  type="password" 
                  placeholder="סיסמת ניהול" 
                  className={`w-full pr-10 pl-4 py-3 rounded-xl border bg-transparent text-sm outline-none transition-all ${
                    darkMode ? 'border-slate-800 focus:border-blue-500 focus:bg-slate-950' : 'border-slate-200 focus:border-blue-600 focus:bg-white'
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
                  className={`flex-1 py-3 rounded-xl font-bold text-xs transition-colors ${
                    darkMode ? 'bg-slate-800 hover:bg-slate-755 text-slate-350' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  ביטול
                </button>
                <button 
                  type="submit" 
                  className={`flex-1 py-3 rounded-xl font-bold text-xs text-white transition-all shadow-sm ${
                    darkMode ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/5' : 'bg-slate-900 hover:bg-blue-600'
                  }`}
                >
                  {isVerifying ? 'מאמת...' : 'כניסה'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Item Form Modal (Add / Edit Tool) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className={`w-full max-w-lg rounded-[2rem] p-8 shadow-2xl border transition-all ${
            darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white text-slate-900 border-slate-200'
          }`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black">{editingItem ? 'עריכת פריט' : 'הוספת פריט חדש'}</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className={`p-1.5 rounded-xl transition-colors ${darkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="space-y-4 text-right">
              <div>
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase px-1">שם הפריט / הכלי</label>
                <input 
                  required 
                  placeholder="לדוגמה: Whisper Transcription" 
                  className={`w-full mt-1 p-3 rounded-xl border bg-transparent text-sm outline-none focus:border-blue-500 dark:border-slate-800`}
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                />
              </div>
              
              <div>
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase px-1">קישור URL</label>
                <input 
                  required={formData.category !== 'updates'} 
                  placeholder="הדבק קישור לכלי או הדרכה" 
                  dir="ltr" 
                  className={`w-full mt-1 p-3 rounded-xl border bg-transparent text-sm outline-none focus:border-blue-500 dark:border-slate-800 text-left`}
                  value={formData.url} 
                  onChange={e => setFormData({...formData, url: e.target.value})} 
                />
              </div>
              
              <div>
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase px-1">קישור לתמונה (אופציונלי)</label>
                <input 
                  placeholder="קישור לתמונת באנר קטנה" 
                  dir="ltr" 
                  className={`w-full mt-1 p-3 rounded-xl border bg-transparent text-sm outline-none focus:border-blue-500 dark:border-slate-800 text-left`}
                  value={formData.imageUrl || ''} 
                  onChange={e => setFormData({...formData, imageUrl: e.target.value})} 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase px-1">קטגוריה</label>
                  <select 
                    className={`w-full mt-1 p-3 rounded-xl border bg-transparent text-sm outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-900`}
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                </div>
                
                <div>
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase px-1">תאריך אירוע (אופציונלי)</label>
                  <input 
                    type="date" 
                    className={`w-full mt-1 p-3 rounded-xl border bg-transparent text-sm outline-none focus:border-blue-500 dark:border-slate-800`}
                    value={formData.eventDate || ''} 
                    onChange={e => setFormData({...formData, eventDate: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase px-1">תיאור והסבר לשימוש</label>
                <textarea 
                  rows="3" 
                  placeholder="פרט בקצרה על מהות הכלי, כיצד הוא עוזר ומתי להשתמש בו..." 
                  className={`w-full mt-1 p-3 rounded-xl border bg-transparent text-sm outline-none focus:border-blue-500 dark:border-slate-800`}
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                />
              </div>
              
              <button className={`w-full py-3.5 rounded-2xl font-black text-xs text-white transition-all shadow-sm ${
                darkMode ? 'bg-blue-600 hover:bg-blue-500' : 'bg-slate-900 hover:bg-blue-600'
              }`}>
                שמור פריט
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className={`w-full max-w-2xl rounded-[2rem] p-8 shadow-2xl border transition-all ${
            darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white text-slate-900 border-slate-200'
          }`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black">ייבוא המוני (JSON)</h3>
              <button 
                onClick={() => setIsImportModalOpen(false)}
                className={`p-1.5 rounded-xl transition-colors ${darkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="space-y-4 text-right">
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                הדבק כאן מערך של פריטים בפורמט JSON תקני. דוגמה למבנה:<br/>
                <code className="bg-slate-500/10 px-2 py-0.5 rounded text-[11px] font-mono mt-1 block" dir="ltr">
                  [{`{"title":"כלי חדש", "url":"https://...", "description":"הסבר על הכלי", "category":"internal"}`}]
                </code>
              </p>
              <textarea 
                rows="8" 
                className={`w-full p-4 rounded-xl border bg-transparent outline-none focus:border-blue-500 dark:border-slate-800 font-mono text-xs`}
                dir="ltr"
                value={jsonInput}
                onChange={e => setJsonInput(e.target.value)}
              />
              <button 
                onClick={handleBulkImport} 
                className={`w-full py-3.5 rounded-2xl font-black text-xs text-white transition-all shadow-md flex items-center justify-center gap-2 ${
                  darkMode ? 'bg-blue-600 hover:bg-blue-50 shadow-blue-500/5' : 'bg-slate-900 hover:bg-blue-600'
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className={`w-full max-w-md rounded-[2rem] p-8 shadow-2xl border transition-all ${
            darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white text-slate-900 border-slate-200'
          }`}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-black">דירוג כלי / פריט</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{feedbackItem.title}</p>
              </div>
              <button 
                onClick={() => setIsFeedbackModalOpen(false)}
                className={`p-1.5 rounded-xl transition-colors ${darkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSendFeedback} className="space-y-6">
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFeedbackData({ ...feedbackData, rating: star })}
                    className={`p-1.5 transition-transform hover:scale-110 ${
                      feedbackData.rating >= star ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'
                    }`}
                  >
                    <Star size={28} fill={feedbackData.rating >= star ? "currentColor" : "none"} />
                  </button>
                ))}
              </div>
              
              <textarea 
                rows="3" 
                placeholder="הערות או ביקורת מילולית על תפקוד הכלי במעבדות או בשטח (אופציונלי)..." 
                className={`w-full p-4 rounded-xl border bg-transparent text-xs outline-none focus:border-blue-500 dark:border-slate-800 resize-none`}
                value={feedbackData.text} 
                onChange={e => setFeedbackData({...feedbackData, text: e.target.value})} 
              />
              
              <button className={`w-full py-3 rounded-2xl font-black text-xs text-white transition-all shadow-md flex items-center justify-center gap-2 ${
                darkMode ? 'bg-blue-600 hover:bg-blue-500' : 'bg-slate-900 hover:bg-blue-600'
              }`}>
                <Send size={12} />
                <span>שלח דירוג</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 6. Reviews View Modal */}
      {isReviewsModalOpen && reviewsItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className={`w-full max-w-lg rounded-[2rem] p-8 shadow-2xl flex flex-col max-h-[80vh] border transition-all ${
            darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white text-slate-900 border-slate-200'
          }`}>
            <div className="flex justify-between items-center mb-6 shrink-0">
              <div>
                <h3 className="text-lg font-black">ביקורות משתמשים במז"פ</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{reviewsItem.title}</p>
              </div>
              <button 
                onClick={() => setIsReviewsModalOpen(false)}
                className={`p-1.5 rounded-xl transition-colors ${darkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="flex-grow overflow-y-auto space-y-4 pr-2 custom-scrollbar text-right">
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
                    <p className={`text-xs font-medium ${darkMode ? 'text-slate-350' : 'text-slate-600'}`}>"{rev.text}"</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 7. Suggest a Tool Modal (Researchers Suggestion Box) */}
      {isSuggestModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className={`w-full max-w-md rounded-[2rem] p-8 shadow-2xl border transition-all ${
            darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white text-slate-900 border-slate-200'
          }`}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-black">הצעת כלי חדש / שיתוף צורך מהשטח</h3>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">שלח הצעה ללא פרטים מזהים לצוות מו"פ מז"פ</p>
              </div>
              <button 
                onClick={() => setIsSuggestModalOpen(false)}
                className={`p-1.5 rounded-xl transition-colors ${darkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSuggestSubmitLocal} className="space-y-4 text-right">
              <div>
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase px-1">שם הכלי המוצע / כותרת הצורך *</label>
                <input 
                  required 
                  placeholder="לדוגמה: כלי לתמלול הקלטות שמע מרכב" 
                  className={`w-full mt-1 p-3 rounded-xl border bg-transparent text-sm outline-none focus:border-blue-500 dark:border-slate-800`}
                  value={suggestData.toolName} 
                  onChange={e => setSuggestData({...suggestData, toolName: e.target.value})} 
                />
              </div>
              
              <div>
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase px-1">תיאור הצורך והאתגר המקצועי *</label>
                <textarea 
                  required
                  rows="4" 
                  placeholder="פרט כאן מהו האתגר בשטח או מהו הכלי וכיצד הוא יסייע לחוקרים במז"פ..." 
                  className={`w-full mt-1 p-3 rounded-xl border bg-transparent text-xs outline-none focus:border-blue-500 dark:border-slate-800`}
                  value={suggestData.description} 
                  onChange={e => setSuggestData({...suggestData, description: e.target.value})} 
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase px-1">קישור מוצע (אופציונלי)</label>
                <input 
                  placeholder="קישור לאתר הכלי או מאמר במידה ויש" 
                  dir="ltr" 
                  className={`w-full mt-1 p-3 rounded-xl border bg-transparent text-sm outline-none focus:border-blue-500 dark:border-slate-800 text-left`}
                  value={suggestData.suggestedUrl} 
                  onChange={e => setSuggestData({...suggestData, suggestedUrl: e.target.value})} 
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase px-1">פרטי קשר למעקב (אופציונלי לגמרי)</label>
                <input 
                  placeholder="שם / טלפון / מחלקה במז"פ (אם תרצה שנוכל לחזור אליך)" 
                  className={`w-full mt-1 p-3 rounded-xl border bg-transparent text-sm outline-none focus:border-blue-500 dark:border-slate-800`}
                  value={suggestData.contactInfo} 
                  onChange={e => setSuggestData({...suggestData, contactInfo: e.target.value})} 
                />
              </div>
              
              <button className={`w-full py-3 rounded-2xl font-black text-xs text-white transition-all shadow-md flex items-center justify-center gap-2 ${
                darkMode ? 'bg-blue-600 hover:bg-blue-500' : 'bg-slate-900 hover:bg-blue-600'
              }`}>
                <Send size={12} />
                <span>שלח הצעה לצוות מו"פ</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 8. Unified Admin Control Panel Modal */}
      {isAdminPanelOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className={`w-full max-w-3xl rounded-[2rem] p-8 shadow-2xl border transition-all flex flex-col max-h-[90vh] ${
            darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white text-slate-900 border-slate-200'
          }`}>
            {/* Header */}
            <div className="flex justify-between items-center mb-6 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl">
                  <Settings size={20} />
                </div>
                <h3 className="text-lg font-black">לוח בקרת מנהל - מו"פ מז"פ</h3>
              </div>
              <button 
                onClick={() => setIsAdminPanelOpen(false)}
                className={`p-1.5 rounded-xl transition-colors ${darkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
              >
                <X size={18} />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-250 dark:border-slate-800 mb-6 shrink-0">
              <button 
                onClick={() => setAdminTab('categories')}
                className={`pb-3 px-4 text-xs font-black border-b-2 transition-all ${
                  adminTab === 'categories' 
                    ? 'border-blue-500 text-blue-500' 
                    : 'border-transparent text-slate-400 hover:text-slate-250'
                }`}
              >
                ניהול קטגוריות
              </button>
              <button 
                onClick={() => setAdminTab('backlog')}
                className={`pb-3 px-4 text-xs font-black border-b-2 transition-all relative ${
                  adminTab === 'backlog' 
                    ? 'border-blue-500 text-blue-500' 
                    : 'border-transparent text-slate-400 hover:text-slate-250'
                }`}
              >
                <span>הצעות וצרכים מהשטח</span>
                {toolRequests.length > 0 && (
                  <span className="absolute -top-1 -left-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[9px] font-bold">
                    {toolRequests.length}
                  </span>
                )}
              </button>
              <button 
                onClick={() => setAdminTab('settings')}
                className={`pb-3 px-4 text-xs font-black border-b-2 transition-all ${
                  adminTab === 'settings' 
                    ? 'border-blue-500 text-blue-500' 
                    : 'border-transparent text-slate-400 hover:text-slate-250'
                }`}
              >
                הגדרות פורטל
              </button>
            </div>

            {/* Scrollable Tab Content Container */}
            <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar text-right">
              
              {/* TAB 1: Categories CMS */}
              {adminTab === 'categories' && (
                <div className="space-y-6">
                  {/* Category List */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-slate-400 uppercase">קטגוריות קיימות</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {categories.map((cat) => {
                        const Icon = iconMap[cat.iconName] || HelpCircle;
                        return (
                          <div key={cat.id} className={`p-4 rounded-xl border flex justify-between items-center ${
                            darkMode ? 'bg-slate-950/20 border-slate-800' : 'bg-slate-50 border-slate-200 shadow-sm'
                          }`}>
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${darkMode ? 'bg-slate-800 text-slate-200' : 'bg-white border border-slate-200 text-slate-700'}`}>
                                <Icon size={16} />
                              </div>
                              <div>
                                <div className="text-xs font-bold text-slate-800 dark:text-white">{cat.label}</div>
                                <div className="text-[10px] text-slate-400 dark:text-slate-500">{cat.subtitle} (מפתח: {cat.id})</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-[10px] font-bold bg-slate-500/10 px-2 py-0.5 rounded text-slate-500">
                                סדר: {cat.order}
                              </span>
                              <button 
                                onClick={() => handleDeleteCategory(cat.id)}
                                className={`text-red-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors`}
                                title="מחק קטגוריה"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Add Category Form */}
                  <form onSubmit={handleCatSubmitLocal} className={`p-5 rounded-2xl border text-right space-y-4 ${
                    darkMode ? 'bg-slate-950/30 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <h4 className="text-xs font-black text-slate-400 flex items-center gap-2">
                      <Plus size={14} />
                      <span>הוסף קטגוריה חדשה</span>
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <input 
                        required 
                        placeholder="שם הקטגוריה (למשל: מחשבים ודיגיטל)" 
                        className={`w-full p-2.5 rounded-lg border bg-transparent text-xs outline-none focus:border-blue-500 dark:border-slate-800`}
                        value={newCatData.label}
                        onChange={e => setNewCatData({ ...newCatData, label: e.target.value })}
                      />
                      <input 
                        required 
                        placeholder="תת כותרת (למשל: כלי סייבר פורנזי)" 
                        className={`w-full p-2.5 rounded-lg border bg-transparent text-xs outline-none focus:border-blue-500 dark:border-slate-800`}
                        value={newCatData.subtitle}
                        onChange={e => setNewCatData({ ...newCatData, subtitle: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                      <div className="col-span-2">
                        <select 
                          className={`w-full p-2.5 rounded-lg border bg-transparent text-xs outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-900`}
                          value={newCatData.iconName}
                          onChange={e => setNewCatData({ ...newCatData, iconName: e.target.value })}
                        >
                          <option value="Bot">Bot (בוטים)</option>
                          <option value="Sparkles">Sparkles (ניצוץ AI)</option>
                          <option value="GraduationCap">GraduationCap (הדרכות)</option>
                          <option value="Megaphone">Megaphone (הכרזות)</option>
                          <option value="FileText">FileText (מסמכים)</option>
                          <option value="Shield">Shield (אבטחה)</option>
                          <option value="BookOpen">BookOpen (ספרים)</option>
                          <option value="Link">Link (קישורים)</option>
                          <option value="Tool">Tool (כלי עבודה)</option>
                          <option value="MessageSquare">MessageSquare (דיונים)</option>
                        </select>
                      </div>

                      <div>
                        <select 
                          className={`w-full p-2.5 rounded-lg border bg-transparent text-xs outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-900`}
                          value={newCatData.color}
                          onChange={e => setNewCatData({ ...newCatData, color: e.target.value })}
                        >
                          <option value="blue">כחול</option>
                          <option value="cyan">ציאן</option>
                          <option value="amber">ענבר/כתום</option>
                          <option value="purple">סגול</option>
                          <option value="slate">אפור</option>
                        </select>
                      </div>

                      <div>
                        <input 
                          type="number"
                          placeholder="סדר (order)" 
                          className={`w-full p-2.5 rounded-lg border bg-transparent text-xs outline-none focus:border-blue-500 dark:border-slate-800`}
                          value={newCatData.order}
                          onChange={e => setNewCatData({ ...newCatData, order: Number(e.target.value) })}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <input 
                        placeholder="מזהה קטגוריה באנגלית (למשל: digital-lab) - אופציונלי" 
                        dir="ltr"
                        className={`w-full p-2.5 rounded-lg border bg-transparent text-xs outline-none focus:border-blue-500 dark:border-slate-800 text-left`}
                        value={newCatData.id}
                        onChange={e => setNewCatData({ ...newCatData, id: e.target.value })}
                      />
                      <button 
                        type="submit"
                        className={`px-5 rounded-lg font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 transition-colors shrink-0`}
                      >
                        הוסף
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 2: Field Needs Backlog */}
              {adminTab === 'backlog' && (
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-400 uppercase">הצעות של חוקרים מהשטח</h4>
                  
                  <div className="space-y-3">
                    {toolRequests.map((req) => (
                      <div key={req.id} className={`p-5 rounded-xl border space-y-3 ${
                        darkMode ? 'bg-slate-950/20 border-slate-800' : 'bg-slate-50 border-slate-200 shadow-sm'
                      }`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="text-xs font-black text-slate-900 dark:text-white">{req.toolName}</h5>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500">
                              הוגש ב: {new Date(req.createdAt).toLocaleDateString('he-IL')} בשעה {new Date(req.createdAt).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <button 
                            onClick={() => handleDeleteToolRequest(req.id)}
                            className="text-red-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                            title="מחק מהרשימה"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                          {req.description}
                        </p>

                        {(req.suggestedUrl || req.contactInfo) && (
                          <div className="pt-2.5 border-t border-slate-200/10 dark:border-slate-850 flex flex-wrap gap-4 text-[10px] text-slate-500 dark:text-slate-450">
                            {req.suggestedUrl && (
                              <a 
                                href={req.suggestedUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 hover:underline text-blue-500"
                              >
                                <Globe size={11} />
                                <span>קישור מצורף</span>
                              </a>
                            )}
                            {req.contactInfo && (
                              <div className="flex items-center gap-1">
                                <User size={11} />
                                <span>פרטי קשר: {req.contactInfo}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                    {toolRequests.length === 0 && (
                      <div className="text-center text-slate-400 py-12 text-xs font-bold">תיבת ההצעות מהשטח ריקה</div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: Portal Settings */}
              {adminTab === 'settings' && (
                <form onSubmit={handleSaveSettingsLocal} className="space-y-5">
                  <h4 className="text-xs font-black text-slate-400 uppercase">הגדרות כלליות</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase px-1">קישור לקבוצת WhatsApp (פורום חטיבתי)</label>
                      <input 
                        required 
                        dir="ltr"
                        placeholder="https://chat.whatsapp.com/..." 
                        className={`w-full mt-1 p-3 rounded-xl border bg-transparent text-xs outline-none focus:border-blue-500 dark:border-slate-800 text-left`}
                        value={localSettings.whatsappUrl}
                        onChange={e => setLocalSettings({ ...localSettings, whatsappUrl: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase px-1 font-bold">הודעת מנהל (באנר הכרזה בראש הפורטל)</label>
                      <textarea 
                        rows="3"
                        placeholder="עדכונים קריטיים שיופיעו בראש האתר לכל המשתמשים..." 
                        className={`w-full mt-1 p-3 rounded-xl border bg-transparent text-xs outline-none focus:border-blue-500 dark:border-slate-800`}
                        value={localSettings.announcement}
                        onChange={e => setLocalSettings({ ...localSettings, announcement: e.target.value })}
                      />
                    </div>

                    <div className="flex items-center gap-3 p-1">
                      <input 
                        type="checkbox"
                        id="announcementActive"
                        className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 focus:ring-2"
                        checked={localSettings.announcementActive}
                        onChange={e => setLocalSettings({ ...localSettings, announcementActive: e.target.checked })}
                      />
                      <label htmlFor="announcementActive" className="text-xs font-bold text-slate-700 dark:text-slate-350 cursor-pointer select-none">
                        הצג את באנר ההכרזה למשתמשים
                      </label>
                    </div>
                  </div>

                  <button type="submit" className={`w-full py-3.5 rounded-2xl font-black text-xs text-white transition-all shadow-md ${
                    darkMode ? 'bg-blue-600 hover:bg-blue-550' : 'bg-slate-900 hover:bg-blue-600'
                  }`}>
                    שמור הגדרות
                  </button>
                </form>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modals;

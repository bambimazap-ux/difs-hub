import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Search, ShieldAlert, CheckCircle2, Menu, Lock, Upload, Home, Settings, Star
} from 'lucide-react';
import { auth, db } from './firebase';
import { 
  signInAnonymously, onAuthStateChanged 
} from 'firebase/auth';
import { 
  collection, doc, setDoc, deleteDoc, onSnapshot, addDoc, writeBatch 
} from 'firebase/firestore';

import Sidebar, { iconMap } from './components/Sidebar';
import Header from './components/Header';
import About from './components/About';
import ItemCard from './components/ItemCard';
import Modals from './components/Modals';

const appId = 'gems-portal';

const App = () => {
  // --- States ---
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [feedbacks, setFeedbacks] = useState({});
  const [categories, setCategories] = useState([]);
  const [toolRequests, setToolRequests] = useState([]);
  const [settings, setSettings] = useState({
    whatsappUrl: 'https://chat.whatsapp.com/default-placeholder-link',
    announcement: 'ברוכים הבאים לפורטל החדשנות והמו"פ של חטיבת הזיהוי הפלילי (מז"פ)!',
    announcementActive: true
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('about');
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Modals visibility state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  
  // Editing & Selection targets
  const [editingItem, setEditingItem] = useState(null);
  const [feedbackItem, setFeedbackItem] = useState(null);
  const [reviewsItem, setReviewsItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  
  // Initialize pinned items from LocalStorage
  const [pinnedItems, setPinnedItems] = useState(() => {
    try {
      const saved = localStorage.getItem('difs_pinned_items');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  
  // Forms states
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    url: '', 
    imageUrl: '', 
    category: 'internal', 
    status: 'active', 
    isFeatured: false, 
    eventDate: '' 
  });
  const [feedbackData, setFeedbackData] = useState({ rating: 5, text: '' });
  const [jsonInput, setJsonInput] = useState('');

  // UI styling state
  const [darkMode, setDarkMode] = useState(true); // Default to dark mode
  const [toast, setToast] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // --- Dark Mode Sync ---
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Sync Pinned Items to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('difs_pinned_items', JSON.stringify(pinnedItems));
    } catch (e) {
      console.error("Failed to save pins", e);
    }
  }, [pinnedItems]);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    return h < 12 ? 'בוקר טוב' : h < 17 ? 'צהריים טובים' : h < 21 ? 'ערב טוב' : 'לילה טוב';
  }, []);

  // Firebase Anonymous Auth
  useEffect(() => {
    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (error) {
        console.error("Auth Error:", error);
      }
    };
    initAuth();
    onAuthStateChanged(auth, setUser);
  }, []);

  // 1. Fetch Categories & Seed Defaults if empty
  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'categories'), 
      async (snap) => {
        if (snap.empty) {
          // Seeding default Forensic categories
          const defaults = [
            { id: 'internal', label: 'מערכות וכלי AI', subtitle: 'מערכות ובוטים פנימיים', iconName: 'Bot', color: 'blue', order: 1 },
            { id: 'tool', label: 'כלי בינה מלאכותית', subtitle: 'AI גנרטיבי חיצוני', iconName: 'Sparkles', color: 'cyan', order: 2 },
            { id: 'training', label: 'הדרכות ומדריכים', subtitle: 'ספרייה מקצועית וסרטונים', iconName: 'GraduationCap', color: 'amber', order: 3 },
            { id: 'updates', label: 'הנחיות ונהלי עבודה', subtitle: 'נהלים ומדיניות (SOPs)', iconName: 'Megaphone', color: 'purple', order: 4 }
          ];
          const batch = writeBatch(db);
          defaults.forEach(cat => {
            const ref = doc(db, 'artifacts', appId, 'public', 'data', 'categories', cat.id);
            batch.set(ref, cat);
          });
          await batch.commit();
        } else {
          const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          list.sort((a, b) => (a.order || 0) - (b.order || 0));
          setCategories(list);
        }
      },
      (err) => console.error("Categories fetch error:", err)
    );
    return () => unsub();
  }, [user]);

  // 2. Fetch Portal Settings & Seed config if empty
  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'config'), 
      (docSnap) => {
        if (docSnap.exists()) {
          setSettings(docSnap.data());
        } else {
          setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'config'), {
            whatsappUrl: 'https://chat.whatsapp.com/default-placeholder-link',
            announcement: 'ברוכים הבאים לפורטל החדשנות והמו"פ של חטיבת הזיהוי הפלילי (מז"פ)!',
            announcementActive: true
          });
        }
      },
      (err) => console.error("Settings error:", err)
    );
    return () => unsub();
  }, [user]);

  // 3. Fetch Items
  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'portalItems'), 
      (snap) => setItems(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
      (err) => console.error("Items fetch error:", err)
    );
    return () => unsub();
  }, [user]);

  // 4. Fetch Tool/Feature requests from field researchers
  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'toolRequests'), 
      (snap) => {
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        setToolRequests(list);
      },
      (err) => console.error("Requests fetch error:", err)
    );
    return () => unsub();
  }, [user]);

  // 5. Fetch Feedbacks and aggregate ratings
  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'feedbacks'), 
      (snap) => {
        const map = {};
        snap.docs.forEach(doc => {
          const data = doc.data();
          if (!map[data.itemId]) {
            map[data.itemId] = { totalRating: 0, count: 0, reviews: [] };
          }
          map[data.itemId].totalRating += data.rating;
          map[data.itemId].count += 1;
          if (data.text && data.text.trim().length > 0) {
            map[data.itemId].reviews.push({ 
              text: data.text, 
              rating: data.rating, 
              date: data.createdAt 
            });
          }
        });
        setFeedbacks(map);
      },
      (err) => console.error("Feedbacks fetch error:", err)
    );
    return () => unsub();
  }, [user]);

  // Toast helper
  const showToast = (msg) => { 
    setToast(msg); 
    setTimeout(() => setToast(null), 3000); 
  };

  // --- Database Action Handlers ---

  // Save Item (Add/Edit)
  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;
    const id = editingItem?.id || crypto.randomUUID();
    await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'portalItems', id), { 
      ...formData, 
      updatedAt: new Date().toISOString() 
    });
    setIsModalOpen(false); 
    setEditingItem(null); 
    setFormData({ 
      title: '', 
      description: '', 
      url: '', 
      imageUrl: '', 
      category: activeTab !== 'about' ? activeTab : (categories[0]?.id || 'internal'), 
      status: 'active', 
      isFeatured: false, 
      eventDate: '' 
    });
    showToast('הפריט נשמר בהצלחה');
  };

  // Delete Item
  const handleDelete = async (id) => {
    if (!user || !window.confirm('האם אתה בטוח שברצונך למחוק פריט זה?')) return;
    await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'portalItems', id));
    showToast('הפריט נמחק בהצלחה');
  };

  // Submit Feedback
  const handleSendFeedback = async (e) => {
    e.preventDefault();
    if (!user || !feedbackItem) return;
    
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'feedbacks'), {
        itemId: feedbackItem.id,
        itemTitle: feedbackItem.title,
        rating: feedbackData.rating,
        text: feedbackData.text,
        createdAt: new Date().toISOString()
      });
      setIsFeedbackModalOpen(false);
      setFeedbackData({ rating: 5, text: '' });
      setFeedbackItem(null);
      showToast('הדירוג התקבל, תודה רבה!');
    } catch (err) {
      console.error(err);
      showToast('שגיאה בשליחת הדירוג');
    }
  };

  // Toggle Featured state
  const toggleGlobalFeatured = async (item) => {
    if (!user || !isAdmin) return;
    try {
      const newFeaturedState = !item.isFeatured;
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'portalItems', item.id), { 
        ...item, 
        isFeatured: newFeaturedState 
      }, { merge: true });
      showToast(newFeaturedState ? 'סומן כמומלץ מערכת' : 'הוסר ממומלצי המערכת');
    } catch (e) {
      console.error(e);
      showToast('שגיאה בעדכון');
    }
  };

  // Bulk Import tools from JSON
  const handleBulkImport = async () => {
    if (!jsonInput) return;
    try {
      const data = JSON.parse(jsonInput);
      if (!Array.isArray(data)) throw new Error("הפורמט חייב להיות רשימה (Array)");
      
      const batch = writeBatch(db);
      let count = 0;
      
      data.forEach(item => {
        if (item.title && item.url) {
          const newId = crypto.randomUUID();
          const ref = doc(db, 'artifacts', appId, 'public', 'data', 'portalItems', newId);
          batch.set(ref, {
            title: item.title,
            description: item.description || '',
            url: item.url,
            imageUrl: item.imageUrl || '',
            category: item.category || 'internal',
            status: item.status || 'active',
            isFeatured: false,
            updatedAt: new Date().toISOString()
          });
          count++;
        }
      });
      
      await batch.commit();
      setIsImportModalOpen(false);
      setJsonInput('');
      showToast(`${count} פריטים יובאו בהצלחה!`);
    } catch (e) {
      alert("שגיאה בייבוא: " + e.message);
    }
  };

  const handleAdminLoginSuccess = () => {
    setIsAdmin(true);
    showToast('התחברת בהצלחה כמנהל מערכת');
  };

  // Suggest a tool / request a need (Researchers)
  const handleSubmitToolRequest = async (reqData) => {
    if (!user) return;
    try {
      const id = crypto.randomUUID();
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'toolRequests', id), {
        ...reqData,
        id,
        createdAt: new Date().toISOString()
      });
      showToast('ההצעה/הצורך נשלחו בהצלחה לצוות מו"פ!');
    } catch (e) {
      console.error(e);
      showToast('שגיאה בשליחת הבקשה');
    }
  };

  // Delete/Archive a request (Admin)
  const handleDeleteToolRequest = async (id) => {
    if (!user || !isAdmin || !window.confirm('האם למחוק בקשה זו מהרשימה?')) return;
    await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'toolRequests', id));
    showToast('הבקשה נמחקה בהצלחה');
  };

  // Add/Update a Category (Admin)
  const handleAddCategory = async (catData) => {
    if (!user || !isAdmin) return;
    try {
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'categories', catData.id), catData);
      showToast('הקטגוריה נשמרה בהצלחה');
    } catch (e) {
      console.error(e);
      showToast('שגיאה בשמירת הקטגוריה');
    }
  };

  // Delete a Category (Admin)
  const handleDeleteCategory = async (catId) => {
    if (!user || !isAdmin || !window.confirm('האם אתה בטוח שברצונך למחוק קטגוריה זו? כלים המשויכים אליה לא יוצגו עד שישוייכו מחדש.')) return;
    try {
      await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'categories', catId));
      showToast('הקטגוריה נמחקה בהצלחה');
    } catch (e) {
      console.error(e);
      showToast('שגיאה במחיקת הקטגוריה');
    }
  };

  // Save Settings config (Admin)
  const handleSaveSettings = async (newSettings) => {
    if (!user || !isAdmin) return;
    try {
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'config'), newSettings);
      showToast('הגדרות הפורטל עודכנו בהצלחה');
      setIsAdminPanelOpen(false);
    } catch (e) {
      console.error(e);
      showToast('שגיאה בעדכון ההגדרות');
    }
  };

  // Sync Form category state when activeTab changes
  useEffect(() => {
    if (activeTab !== 'about') {
      setFormData(prev => ({ ...prev, category: activeTab }));
    }
  }, [activeTab]);

  // Load editing item data into form
  useEffect(() => {
    if (editingItem) {
      setFormData({
        title: editingItem.title || '',
        description: editingItem.description || '',
        url: editingItem.url || '',
        imageUrl: editingItem.imageUrl || '',
        category: editingItem.category || 'internal',
        status: editingItem.status || 'active',
        isFeatured: editingItem.isFeatured || false,
        eventDate: editingItem.eventDate || ''
      });
    }
  }, [editingItem]);

  // Filtered and Sorted Items for active catalog tab
  const filteredItems = useMemo(() => {
    return items
      .filter(i => i.category === activeTab)
      .filter(i => 
        i.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        i.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        // Featured always at top
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        // Pinned by user next
        const aPinned = pinnedItems.includes(a.id);
        const bPinned = pinnedItems.includes(b.id);
        if (aPinned && !bPinned) return -1;
        if (!aPinned && bPinned) return 1;
        // Otherwise default chronological by updatedAt
        return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
      });
  }, [items, activeTab, searchTerm, pinnedItems]);

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-[#030712] via-[#090e1a] to-[#030712] text-slate-100' 
        : 'bg-gradient-to-tr from-slate-100 via-[#f8fafc] to-[#eff6ff]/30 text-slate-900'
    }`} dir="rtl">
      
      {/* Subtle ambient backgrounds */}
      <div className="bg-glow-orb top-0 right-0 w-[500px] h-[500px] bg-blue-500/20"></div>
      <div className="bg-glow-orb bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/20"></div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-top-4">
          <div className="bg-slate-950/90 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3 border border-white/10 backdrop-blur-md">
            <CheckCircle2 size={16} className="text-blue-400" />
            <span className="text-xs font-black">{toast}</span>
          </div>
        </div>
      )}

      {/* Sidebar Component */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        darkMode={darkMode} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        isAdmin={isAdmin} 
        setIsAdmin={setIsAdmin} 
        setIsLoginModalOpen={setIsLoginModalOpen} 
        setIsAdminPanelOpen={setIsAdminPanelOpen}
        categories={categories}
      />

      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        
        {/* Top Header Component */}
        <Header 
          greeting={greeting} 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          darkMode={darkMode} 
          setDarkMode={setDarkMode} 
          activeTab={activeTab} 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
        />

        {/* Scrollable Content Viewport */}
        <div className="flex-1 overflow-y-auto p-4 md:p-10 scroll-smooth custom-scrollbar">
          
          {activeTab === 'about' ? (
            <About 
              setActiveTab={setActiveTab} 
              items={items} 
              darkMode={darkMode} 
              whatsappUrl={settings.whatsappUrl}
              announcement={settings.announcement}
              announcementActive={settings.announcementActive}
              categories={categories}
              feedbacks={feedbacks}
            />
          ) : (
            <>
              {/* Category Page Title Row */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-3">
                  {(() => {
                    const matchedCat = categories.find(c => c.id === activeTab);
                    const Icon = matchedCat && iconMap[matchedCat.iconName] ? iconMap[matchedCat.iconName] : Home;
                    return <Icon className="text-blue-500" />;
                  })()}
                  <span>{categories.find(c => c.id === activeTab)?.label}</span>
                </h2>
                
                {/* Admin controls inside category */}
                <div className="flex gap-2">
                  {/* Anonymous user suggestion box button */}
                  <button 
                    onClick={() => setIsSuggestModalOpen(true)}
                    className={`flex items-center gap-2 text-xs font-black px-4 py-2.5 rounded-xl border transition-all ${
                      darkMode ? 'bg-slate-900/50 hover:bg-slate-800 border-slate-800 text-slate-350' : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 shadow-sm'
                    }`}
                  >
                    <span>הצע כלי מהשטח</span>
                  </button>

                  {isAdmin && (
                    <>
                      <button 
                        onClick={() => setIsImportModalOpen(true)}
                        className={`flex items-center gap-2 text-xs font-black px-4 py-2.5 rounded-xl border transition-all ${
                          darkMode ? 'bg-slate-900/50 hover:bg-slate-800 border-slate-800 text-slate-300' : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 shadow-sm'
                        }`}
                      >
                        <Upload size={14} />
                        <span>ייבוא JSON</span>
                      </button>
                      <button 
                        onClick={() => { 
                          setEditingItem(null); 
                          setFormData({ 
                            title: '', 
                            description: '', 
                            url: '', 
                            imageUrl: '', 
                            category: activeTab, 
                            status: 'active', 
                            isFeatured: false, 
                            eventDate: '' 
                          }); 
                          setIsModalOpen(true); 
                        }}
                        className={`flex items-center gap-2 text-xs font-black px-4 py-2.5 rounded-xl text-white transition-all shadow-sm ${
                          darkMode ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/5' : 'bg-slate-900 hover:bg-blue-600'
                        }`}
                      >
                        <Plus size={14} />
                        <span>הוסף פריט</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Mobile Search input */}
              <div className="mb-6 md:hidden">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input 
                    type="text"
                    placeholder="חיפוש..."
                    className={`w-full pr-10 pl-4 py-2.5 rounded-xl text-xs font-medium outline-none border transition-all ${
                      darkMode ? 'bg-slate-900/50 border-slate-800 text-white' : 'bg-white border-slate-200'
                    }`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Grid of Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 pb-12">
                {filteredItems.map(item => (
                  <ItemCard 
                    key={item.id}
                    item={item}
                    isAdmin={isAdmin}
                    darkMode={darkMode}
                    pinnedItems={pinnedItems}
                    setPinnedItems={setPinnedItems}
                    feedbacks={feedbacks}
                    setEditingItem={setEditingItem}
                    setIsModalOpen={setIsModalOpen}
                    handleDelete={handleDelete}
                    toggleGlobalFeatured={toggleGlobalFeatured}
                    setReviewsItem={setReviewsItem}
                    setIsReviewsModalOpen={setIsReviewsModalOpen}
                    setFeedbackItem={setFeedbackItem}
                    setIsFeedbackModalOpen={setIsFeedbackModalOpen}
                    setViewItem={setViewItem}
                    setIsViewModalOpen={setIsViewModalOpen}
                    showToast={showToast}
                    categories={categories}
                  />
                ))}
                
                {filteredItems.length === 0 && (
                  <div className="col-span-full py-20 text-center">
                    <div className="bg-slate-500/5 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-500/10">
                      <Search className="text-slate-400 w-6 h-6" />
                    </div>
                    <p className="text-slate-400 dark:text-slate-500 font-bold text-xs">לא נמצאו פריטים קיימים בקטגוריה זו</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Footer Card */}
          <footer className={`mt-12 pt-10 pb-8 border-t transition-colors duration-300 ${
            darkMode ? 'border-slate-800/60 bg-slate-950/20' : 'border-slate-200 bg-slate-100/30'
          } rounded-[2rem] p-6`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Branding and Credits */}
              <div className="space-y-3 text-center md:text-right">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">מז"פ Tech Hub</h3>
                <p className="text-xs font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                  פלטפורמה זו פותחה על ידי <span className="font-bold text-blue-500 dark:text-blue-400">מדור מחקר ופיתוח (מו"פ)</span>,
                  <br />החטיבה לזיהוי פלילי, אגף החקירות והמודיעין, משטרת ישראל.
                </p>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-450 dark:text-slate-500">
                  © {new Date().getFullYear()} כל הזכויות שמורות לחטיבת הזיהוי הפלילי
                </p>
              </div>

              {/* Security Banner Card */}
              <div className={`p-5 rounded-3xl border ${
                darkMode ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className="flex gap-4 items-start text-right">
                  <div className={`p-2 rounded-2xl shrink-0 ${
                    darkMode ? 'bg-amber-500/10 text-amber-500' : 'bg-amber-50 text-amber-655 text-amber-700'
                  }`}>
                    <ShieldAlert size={18} />
                  </div>
                  <div className="space-y-1.5 w-full">
                    <h4 className="text-xs font-black uppercase tracking-wide text-slate-800 dark:text-slate-250">
                      הנחיות אבטחת מידע ומדיניות
                    </h4>
                    <ul className="text-[11px] font-medium space-y-1 text-slate-500 dark:text-slate-400">
                      <li className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-red-500 shrink-0"></span>
                        <span>חל איסור מוחלט להזין חומרים מסווגים או רגישים למערכות AI ציבוריות.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-blue-500 shrink-0"></span>
                        <span>התשובות מבוססות AI גנרטיבי ומשמשות כעזר בלבד. יש לאמת כל ממצע מקצועית.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </footer>

        </div>
      </main>

      {/* Global Modals Manager */}
      <Modals 
        darkMode={darkMode}
        isViewModalOpen={isViewModalOpen}
        setIsViewModalOpen={setIsViewModalOpen}
        viewItem={viewItem}
        isLoginModalOpen={isLoginModalOpen}
        setIsLoginModalOpen={setIsLoginModalOpen}
        handleAdminLoginSuccess={handleAdminLoginSuccess}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        editingItem={editingItem}
        handleSave={handleSave}
        formData={formData}
        setFormData={setFormData}
        isImportModalOpen={isImportModalOpen}
        setIsImportModalOpen={setIsImportModalOpen}
        jsonInput={jsonInput}
        setJsonInput={setJsonInput}
        handleBulkImport={handleBulkImport}
        isFeedbackModalOpen={isFeedbackModalOpen}
        setIsFeedbackModalOpen={setIsFeedbackModalOpen}
        feedbackItem={feedbackItem}
        handleSendFeedback={handleSendFeedback}
        feedbackData={feedbackData}
        setFeedbackData={setFeedbackData}
        isReviewsModalOpen={isReviewsModalOpen}
        setIsReviewsModalOpen={setIsReviewsModalOpen}
        reviewsItem={reviewsItem}
        
        // Dynamic categories & admin settings props
        categories={categories}
        toolRequests={toolRequests}
        settings={settings}
        isSuggestModalOpen={isSuggestModalOpen}
        setIsSuggestModalOpen={setIsSuggestModalOpen}
        isAdminPanelOpen={isAdminPanelOpen}
        setIsAdminPanelOpen={setIsAdminPanelOpen}
        handleAddCategory={handleAddCategory}
        handleDeleteCategory={handleDeleteCategory}
        handleSaveSettings={handleSaveSettings}
        handleDeleteToolRequest={handleDeleteToolRequest}
        handleSubmitToolRequest={handleSubmitToolRequest}
      />
    </div>
  );
};

export default App;

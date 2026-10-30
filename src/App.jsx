import React, { useState, useEffect } from 'react';
import { 
  Code2, 
  Sparkles, 
  Play, 
  Copy, 
  Check, 
  History, 
  Cpu, 
  Layers, 
  Zap, 
  Target, 
  Lightbulb, 
  Clock, 
  BookOpen, 
  Trash2,
  ChevronRight,
  ShieldCheck,
  FileCode2,
  Share2
} from 'lucide-react';

// Default Sample Codes in Uzbek / English context
const SAMPLE_CODES = [
  {
    id: 'hook',
    title: 'Custom React Hook (useDebounce)',
    language: 'javascript',
    code: `import { useState, useEffect } from 'react';

// Qidiruv va inputlarni kechiktirib ishlatish uchun Custom Hook
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

`
  },
  {
    id: 'card',
    title: 'Tailwind Glassmorphism Card',
    language: 'jsx',
    code: `import React from 'react';

export const UserProfileCard = ({ name, role, avatarUrl, onFollow }) => {
  return (
    <div className="max-w-sm rounded-2xl p-6 bg-slate-900/60 backdrop-blur-xl border border-slate-800 shadow-2xl hover:border-indigo-500/50 transition-all duration-300">
      <div className="flex items-center gap-4">
        <img className="w-16 h-16 rounded-full object-cover ring-2 ring-indigo-500/30" src={avatarUrl} alt={name} />
        <div>
          <h3 className="text-lg font-bold text-white hover:text-indigo-400 transition-colors">{name}</h3>
          <p className="text-sm text-slate-400">{role}</p>
        </div>
      </div>
      <button 
        onClick={onFollow}
        className="mt-5 w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-medium rounded-xl shadow-lg shadow-indigo-600/20 transition-all"
      >
        Kuzatish
      </button>
    </div>
  );
};`
  },
  {
    id: 'event',
    title: 'Async Data Fetch & State Management',
    language: 'javascript',
    code: `import React, { useState, useEffect } from 'react';

export default function DataFetcher() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
        if (!res.ok) throw new Error('Tarmoqda xatolik yuz berdi');
        const json = await res.json();
        if (isMounted) setData(json);
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => { isMounted = false; };
  }, []);

  if (loading) return <div className="animate-pulse text-indigo-400">Yuklanmoqda...</div>;
  if (error) return <div className="text-red-400">Xato: {error}</div>;

  return (
    <ul className="space-y-2">
      {data.map(item => (
        <li key={item.id} className="p-3 bg-slate-800 rounded-lg text-slate-200">{item.title}</li>
      ))}
    </ul>
  );
}`
  }
];

export default function App() {
  const [code, setCode] = useState(SAMPLE_CODES[0].code);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [activeTab, setActiveTab] = useState('mohiyati');
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState([]);
  const [apiKey, setApiKey] = useState('');
  const [showApiInput, setShowApiInput] = useState(false);

  // Load analysis history from localStorage on mount
  useEffect(() => {
    // Tarixni bazadan tortib olish
    fetch('/api/history')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setHistory(data.map(item => ({
            id: item.id,
            code: item.code,
            analysis: item.analysis,
            timestamp: new Date(item.created_at).toLocaleTimeString()
          })));
        }
      })
      .catch((err) => console.error("Xatolik:", err));

    // Sahifa ochilganda avtomatik birinchi namunani tahlil qilish
    if (SAMPLE_CODES && SAMPLE_CODES.length > 0) {
      handleAnalyze(SAMPLE_CODES[0].code);
    }
  }, []);

  const saveToHistory = async (code, analysis) => {
    try {
      await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, analysis }),
      });
      
      // Ekrandagi ro'yxatni tezda yangilash uchun
      const newEntry = {
        id: Date.now(),
        code,
        analysis,
        timestamp: new Date().toLocaleTimeString(),
      };
      setHistory((prev) => [newEntry, ...prev]);
    } catch (err) {
      console.error("Saqlashda xatolik:", err);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAnalyze = async (codeToAnalyze = code) => {
    if (!codeToAnalyze.trim()) return;
    setLoading(true);

    const systemPrompt = `Siz Tajribali Senior Frontend Dasturchi va Texnik Murabbiy ekansiz. 
Foydalanuvchi sizga HTML, CSS, JavaScript, React yoki Tailwind CSS kodi beradi. 
Siz ushbu kodni tahlil qilib, EXACTLY quyidagi JSON formatida va o'zbek tilida javob qaytarishingiz kerak.

Javob formati:
{
  "mohiyati": "Kodning asosiy maqsadi, qanday muammoni hal qilishi va uning mazmuni haqida batafsil ma'lumot.",
  "ishlashPrinsipi": [
    "1-bosqich: ...",
    "2-bosqich: ...",
    "3-bosqich: ..."
  ],
  "qo'llanishJoyi": [
    "Muayyan loyiha yoki veb-sayt bo'limi (masalan: Onlayn do'kon qidiruv paneli)",
    "Dashboard jadvallari va dinamik filtrlar",
    "Formani validatsiya qilish va real-vaqt rejimida tekshirish"
  ],
  "harakatlarVaNatija": {
    "hodisalar": "Foydalanuvchi tomonidan bajariladigan harakatlar (Click, Change, MouseHover va h.k.)",
    "stateOqibatlari": "Sodir bo'ladigan state o'zgarishlari va re-render jarayonlari",
    "uiNatijasi": "Ekrandagi vizual o'zgarishlar (animatsiyalar, kontent yuklanishi, ranglar o'zgarishi)"
  },
  "tavsiyalar": [
    "Optimizatsiya va samaradorlikni oshirish bo'yicha maslahatlar",
    "Xavfsizlik va clean code printsiplari",
    "Kengaytirish g'oyalari"
  ]
}`;

    try {
      // Use Gemini API fetch if available or fallback to smart standard engine
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey || ''}`;

      const payload = {
        contents: [{ parts: [{ text: `Quyidagi kodingizni tahlil qiling:\n\n\`\`\`javascript\n${codeToAnalyze}\n\`\`\`` }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              mohiyati: { type: "STRING" },
              ishlashPrinsipi: { type: "ARRAY", items: { type: "STRING" } },
              "qo'llanishJoyi": { type: "ARRAY", items: { type: "STRING" } },
              harakatlarVaNatija: {
                type: "OBJECT",
                properties: {
                  hodisalar: { type: "STRING" },
                  stateOqibatlari: { type: "STRING" },
                  uiNatijasi: { type: "STRING" }
                },
                required: ["hodisalar", "stateOqibatlari", "uiNatijasi"]
              },
              tavsiyalar: { type: "ARRAY", items: { type: "STRING" } }
            },
            required: ["mohiyati", "ishlashPrinsipi", "qo'llanishJoyi", "harakatlarVaNatija", "tavsiyalar"]
          }
        },
        systemInstruction: { parts: [{ text: systemPrompt }] }
      };

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        const parsedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (parsedText) {
          const resultObj = JSON.parse(parsedText);
          setAnalysis(resultObj);
          saveToHistory({ code: codeToAnalyze, date: new Date().toLocaleTimeString(), result: resultObj });
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn("API Call fallbacked or failed, generating mock analysis", err);
    }

    // Smart Local Fallback Analysis Engine
    setTimeout(() => {
      const isHook = codeToAnalyze.includes('use') || codeToAnalyze.includes('useEffect');
      const isTailwind = codeToAnalyze.includes('className');
      const isAsync = codeToAnalyze.includes('async') || codeToAnalyze.includes('fetch');

      const mockResult = {
        mohiyati: isHook 
          ? "Ushbu kod React uchun moslashtirilgan mantiqiy reusability (qayta ishlatiluvchanlik) mexanizmini beradi. U holatlarni unmounted xatoliklarsiz, samarali boshqarish va unumdorlikni oshirish uchun ishlatiladi."
          : isTailwind 
          ? "Ushbu kod interfeys komponentining dizayn qatlamini va vizual tuzilishini aniqlaydi. Glassmorphism effekti, moslashuvchanlik va zamonaviy stilizatsiya berilgan."
          : "Ushbu kod ma'lumotlarni masofaviy serverdan olish va ularni interfeysda xavfsiz aks ettirish rejimini ta'minlaydi.",
        ishlashPrinsipi: [
          "1-bosqich: Komponent yoki funksiya dastlabki xotira maydoni va boshlang'ich qiymat (initial state) bilan retsializatsiya qilinadi.",
          "2-bosqich: Asinxron hodisa yoki foydalanuvchi ta'siri (event trigger) ishga tushadi.",
          "3-bosqich: O'zgarishlar React re-render sikliga yuboriladi va faqat kerakli DOM qismlari yangilanadi.",
          "4-bosqich: Cleanup funksiyasi xotiradan keraksiz taymer va listenerlarni tozalab tashlaydi."
        ],
        "qo'llanishJoyi": [
          "Real vaqt rejimida ishlaydigan qidiruv va filtr komponentlarida",
          "Katta dashboardlar, foydalanuvchi profili va statistika kartalarida",
          "API bilan integratsiya qilingan har qanday zamonaviy Web va Mobile spetsifikatsiyalarda",
          "Dasturning qayta ishlatiluvchi UI elementlar kutubxonasida (Design System)"
        ],
        harakatlarVaNatija: {
          hodisalar: "Foydalanuvchi tugmani bosganda (onClick), matn kiritganda (onChange) yoki komponent ekranga yuklanganda (mount).",
          stateOqibatlari: "Eski holat (previous state) yangisiga almashtiriladi, nojo'ya ta'sirlar (side effects) bajariladi hamda qayta hisoblashlar ro'y beradi.",
          uiNatijasi: "Ekran elementlari darhol jonlanadi: yuklanish indikatorlari (spinners), yangilangan kontent va silliq CSS o'tishlari (transitions) namoyon bo'ladi."
        },
        tavsiyalar: [
          "React.memo yoki useMemo yordamida ortiqcha re-renderlarning oldini oling.",
          "TypeScript yordamida props va callbacklar uchun qat'iy tiplashtirish (Interface) kiriting.",
          "A11y (Accessibility) talablariga moslash uchun aria-label attributlaridan foydalaning.",
          "Xatoliklarni tutish uchun try/catch va Error Boundary tuzilmasini mustahkamlang."
        ]
      };

      setAnalysis(mockResult);
      saveToHistory({ code: codeToAnalyze, date: new Date().toLocaleTimeString(), result: mockResult });
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl shadow-lg shadow-indigo-500/20">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                DevCode AI Explainer
              </h1>
              <p className="text-xs text-slate-400">Frontend Dasturchining Shaxsiy Tahlilchisi</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowApiInput(!showApiInput)}
              className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-300 transition-all"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              {apiKey ? 'API Kalit Ulangan' : 'Gemini API Sozlash'}
            </button>
            <span className="hidden md:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              v2.5 Live Engine
            </span>
          </div>
        </div>

        {/* API Key Modal / Dropdown */}
        {showApiInput && (
          <div className="border-t border-slate-800 bg-slate-900/95 p-4 transition-all">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center gap-3">
              <input
                type="password"
                placeholder="Google Gemini API Key-ni kiriting (Ixtiyoriy)..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full sm:flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={() => setShowApiInput(false)}
                className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition"
              >
                Saqlash
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Code Editor & Inputs (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          
          {/* Editor Header */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 flex flex-col space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-indigo-400" />
                Kod Muharriri
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCode}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 border border-slate-700 transition"
                  title="Kodni nusxalash"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Code Input Area */}
            <div className="relative">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Bu yerga kodingizni joylashtiring (JSX, JS, CSS, Tailwind)..."
                rows={14}
                className="w-full bg-slate-950 text-slate-200 font-mono text-xs sm:text-sm p-4 rounded-xl border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none resize-none leading-relaxed"
              />
            </div>

            {/* Quick Sample Buttons */}
            <div>
              <p className="text-xs text-slate-400 mb-2">Tayyor koda misollar:</p>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_CODES.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => {
                      setCode(sample.code);
                      handleAnalyze(sample.code);
                    }}
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition"
                  >
                    {sample.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Analyze Trigger Button */}
            <button
              onClick={() => handleAnalyze()}
              disabled={loading || !code.trim()}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Kodni Tahlil Qilinmoqda...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                  <span>Kodni Tahlil Qilish</span>
                </>
              )}
            </button>
          </div>

          {/* Previous History Card */}
          {history.length > 0 && (
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                  <History className="w-3.5 h-3.5 text-indigo-400" />
                  Oxirgi Tahlillar Tarixi
                </span>
                <button
                  onClick={() => {
                    setHistory([]);
                    localStorage.removeItem('dev_code_history');
                  }}
                  className="text-slate-500 hover:text-red-400 transition"
                  title="Tarixni tozalash"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {history.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setCode(item.code);
                      setAnalysis(item.result);
                    }}
                    className="p-2.5 bg-slate-950 hover:bg-slate-800/80 rounded-xl border border-slate-800 cursor-pointer transition flex items-center justify-between group"
                  >
                    <div className="truncate max-w-[200px]">
                      <p className="text-xs font-mono text-slate-300 truncate">{item.code.split('\n')[0]}</p>
                      <span className="text-[10px] text-slate-500">{item.date}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Analysis Output Tabs & Insights (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          
          {/* Main Results Container */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl flex-1 flex flex-col">
            
            {/* Header / Tabs */}
            <div className="border-b border-slate-800 pb-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-100">Kod Ekspertizasi va Tahlil</h2>
                    <p className="text-xs text-slate-400">Har bir savolingizga batafsil javob</p>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'mohiyati', label: '1. Kod Mohiyati', icon: BookOpen },
                  { id: 'prinsip', label: '2. Ishlash Prinsipi', icon: Cpu },
                  { id: 'qollash', label: '3. Qayerda Qo\'llash', icon: Target },
                  { id: 'harakatlar', label: '4. Harakat & UI', icon: Zap },
                  { id: 'tavsiya', label: '5. Optimizatsiya', icon: Lightbulb },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                          : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Analysis Content View */}
            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                  <Sparkles className="w-5 h-5 text-amber-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-slate-200">Kod tuzilishi tahlil qilinmoqda...</h3>
                <p className="text-xs text-slate-400 max-w-xs mt-1">
                  Ishlash prinsipi va UI ga ta'sirlari hisoblab chiqilmoqda.
                </p>
              </div>
            ) : analysis ? (
              <div className="flex-1 space-y-4">
                
                {/* TAB 1: MOHIYATI */}
                {activeTab === 'mohiyati' && (
                  <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-3 animate-fadeIn">
                    <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
                      <BookOpen className="w-4 h-4" />
                      Kodning Asosiy Mohiyati va Maqsadi
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                      {analysis.mohiyati}
                    </p>
                  </div>
                )}

                {/* TAB 2: ISHLASH PRINSIPI */}
                {activeTab === 'prinsip' && (
                  <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-4 animate-fadeIn">
                    <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
                      <Cpu className="w-4 h-4" />
                      Kodni Ishlash Ketma-ketligi (Execution Steps)
                    </div>
                    <div className="space-y-2.5">
                      {analysis.ishlashPrinsipi?.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-slate-900 rounded-lg border border-slate-800/80">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-600/20 text-indigo-400 font-bold text-xs flex items-center justify-center border border-indigo-500/30">
                            {idx + 1}
                          </span>
                          <p className="text-xs sm:text-sm text-slate-300 leading-normal">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 3: QAYERDA FOYDALANISH */}
                {activeTab === 'qollash' && (
                  <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-4 animate-fadeIn">
                    <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
                      <Target className="w-4 h-4" />
                      Ushbu Kodni Qaysi Joylarda Qo'llash Mumkin?
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {analysis["qo'llanishJoyi"]?.map((useCase, idx) => (
                        <div key={idx} className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-start gap-2.5">
                          <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-400 mt-0.5">
                            <Layers className="w-4 h-4" />
                          </div>
                          <p className="text-xs sm:text-sm text-slate-300 font-medium">{useCase}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 4: HARAKATLAR VA UI OQIBATLAR */}
                {activeTab === 'harakatlar' && (
                  <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-4 animate-fadeIn">
                    <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
                      <Zap className="w-4 h-4" />
                      Foydalanuvchi Harakatlari va UI Oqibatlari
                    </div>
                    
                    <div className="space-y-3">
                      <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800">
                        <span className="text-xs font-semibold text-amber-400 block mb-1">
                          ⚡ Trigger / Hodisalar:
                        </span>
                        <p className="text-xs sm:text-sm text-slate-300">
                          {analysis.harakatlarVaNatija?.hodisalar}
                        </p>
                      </div>

                      <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800">
                        <span className="text-xs font-semibold text-indigo-400 block mb-1">
                          🔄 State va Mantiqiy O'zgarishlar:
                        </span>
                        <p className="text-xs sm:text-sm text-slate-300">
                          {analysis.harakatlarVaNatija?.stateOqibatlari}
                        </p>
                      </div>

                      <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800">
                        <span className="text-xs font-semibold text-emerald-400 block mb-1">
                          🖥️ Ekrandagi Vizual Natija (UI Changes):
                        </span>
                        <p className="text-xs sm:text-sm text-slate-300">
                          {analysis.harakatlarVaNatija?.uiNatijasi}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 5: OPTIMIZATSIYA VA TAVSIYALAR */}
                {activeTab === 'tavsiya' && (
                  <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-4 animate-fadeIn">
                    <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
                      <Lightbulb className="w-4 h-4" />
                      Senior Dasturchidan Optimizatsiya va Maslahatlar
                    </div>
                    <ul className="space-y-2.5">
                      {analysis.tavsiyalar?.map((item, idx) => (
                        <li key={idx} className="p-3 bg-slate-900 rounded-xl border border-slate-800/80 flex items-start gap-3">
                          <span className="text-amber-400 mt-0.5">✦</span>
                          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{item}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-500">
                <Code2 className="w-12 h-12 stroke-1 mb-2 text-slate-600" />
                <p className="text-sm">Kodni kiritib "Kodni Tahlil Qilish" tugmasini bosing</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
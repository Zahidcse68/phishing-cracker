
import React, { useState, useEffect, useCallback } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  QrCode, 
  Link as LinkIcon, 
  AlertTriangle, 
  ChevronRight, 
  Sparkles,
  Info,
  ExternalLink,
  RefreshCw,
  Clock
} from 'lucide-react';
import { analyzeLink, getFestiveSecurityTips } from './services/geminiService';
import { RiskLevel, SecurityReport } from './types';
import { RiskBadge } from './components/RiskBadge';

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [report, setReport] = useState<SecurityReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [tips, setTips] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'link' | 'qr'>('link');
  const [scanStatus, setScanStatus] = useState<'idle' | 'processing' | 'done'>('idle');

  useEffect(() => {
    const fetchTips = async () => {
      try {
        const festiveTips = await getFestiveSecurityTips();
        setTips(festiveTips);
      } catch (err) {
        console.error("Failed to fetch tips", err);
      }
    };
    fetchTips();
  }, []);

  const handleAnalyze = async () => {
    if (!url) return;
    setLoading(true);
    try {
      const result = await analyzeLink(url);
      setReport(result);
    } catch (err) {
      console.error("Analysis failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScanStatus('processing');
      // Simulate scanning logic
      setTimeout(async () => {
        const simulatedUrl = "http://bit.ly/new-year-prizes-2025";
        setUrl(simulatedUrl);
        const result = await analyzeLink(simulatedUrl);
        setReport(result);
        setScanStatus('done');
        setActiveTab('link');
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen pb-20 overflow-x-hidden">
      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 glass-morphism py-4 px-6 mb-8 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl shadow-lg">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                SecureYear <span className="text-blue-400">2025</span>
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-blue-400 font-semibold">Fraud Link & QR Shield</p>
            </div>
          </div>
          <div className="hidden md:flex gap-4">
             <div className="flex items-center gap-2 text-xs text-gray-400">
               <Clock className="w-4 h-4" />
               <span>New Year Protection Active</span>
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Protecting your celebrations</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            Don't let <span className="text-blue-500">phishing</span> ruin your holiday.
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Instantly analyze shortened links, QR codes, and suspicious SMS offers. Powered by Gemini AI for real-time threat intelligence.
          </p>
        </div>

        {/* Tools Tabs */}
        <div className="flex gap-2 mb-6 p-1 bg-slate-800/50 rounded-2xl w-fit mx-auto">
          <button 
            onClick={() => setActiveTab('link')}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl transition-all ${activeTab === 'link' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            <LinkIcon className="w-4 h-4" />
            <span>Link Shield</span>
          </button>
          <button 
            onClick={() => setActiveTab('qr')}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl transition-all ${activeTab === 'qr' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            <QrCode className="w-4 h-4" />
            <span>QR Guard</span>
          </button>
        </div>

        {/* Analysis Section */}
        <div className="glass-morphism rounded-3xl p-6 md:p-8 shadow-2xl mb-12">
          {activeTab === 'link' ? (
            <div className="space-y-6">
              <div className="relative">
                <input 
                  type="text" 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste suspicious link here (e.g. bit.ly/prize2025...)"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-4 px-12 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-lg"
                />
                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              </div>
              <button 
                onClick={handleAnalyze}
                disabled={loading || !url}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
              >
                {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                {loading ? 'Analyzing with Gemini...' : 'Analyze Safety'}
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <QrCode className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Scan QR Code</h3>
              <p className="text-gray-400 mb-8">Upload a screenshot or photo of a suspicious QR code found in emails or on physical posters.</p>
              
              <div className="relative inline-block w-full max-w-sm">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden" 
                  id="qr-upload"
                />
                <label 
                  htmlFor="qr-upload"
                  className="flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-3xl p-10 hover:border-blue-500 hover:bg-blue-500/5 transition-all cursor-pointer group"
                >
                  <QrCode className="w-12 h-12 text-slate-600 group-hover:text-blue-400 mb-4 transition-colors" />
                  <span className="font-semibold text-slate-300">
                    {scanStatus === 'processing' ? 'Decoding QR...' : 'Choose Image'}
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Report Display */}
          {report && !loading && (
            <div className="mt-8 pt-8 border-t border-slate-700 animate-in fade-in duration-500">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className={`shrink-0 p-4 rounded-3xl ${report.isSafe ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                  {report.isSafe ? (
                    <ShieldCheck className="w-12 h-12 text-emerald-400" />
                  ) : (
                    <ShieldAlert className="w-12 h-12 text-red-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h4 className="text-xl font-bold">Analysis Results</h4>
                    <RiskBadge level={report.riskLevel} />
                  </div>
                  <p className="text-gray-300 leading-relaxed mb-4">{report.explanation}</p>
                  
                  {report.originalUrl && (
                    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700 mb-6">
                      <p className="text-xs uppercase text-gray-500 font-bold mb-1">Inferred Original Destination</p>
                      <div className="flex items-center justify-between gap-4">
                        <code className="text-blue-400 break-all">{report.originalUrl}</code>
                        <ExternalLink className="w-4 h-4 text-gray-500 shrink-0" />
                      </div>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="flex items-center gap-2 text-sm font-bold text-red-400 mb-3">
                        <AlertTriangle className="w-4 h-4" />
                        Detected Red Flags
                      </h5>
                      <ul className="space-y-2">
                        {report.detectedThreats.map((threat, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-400">
                            <ChevronRight className="w-4 h-4 text-red-400/50 shrink-0 mt-0.5" />
                            {threat}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="flex items-center gap-2 text-sm font-bold text-emerald-400 mb-3">
                        <Info className="w-4 h-4" />
                        Safety Recommendations
                      </h5>
                      <ul className="space-y-2">
                        {report.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-400">
                            <ChevronRight className="w-4 h-4 text-emerald-400/50 shrink-0 mt-0.5" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Holiday Safety Tips */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <h3 className="text-xl font-bold">New Year Security Pro-Tips</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {tips.length > 0 ? (
              tips.map((tip, idx) => (
                <div key={idx} className="glass-morphism p-5 rounded-2xl flex gap-4 items-start border-l-4 border-l-blue-500 transition-transform hover:translate-x-1">
                  <div className="bg-blue-500/10 text-blue-400 font-bold px-2 py-1 rounded-lg text-xs shrink-0">
                    {idx + 1}
                  </div>
                  <p className="text-gray-300 text-sm">{tip}</p>
                </div>
              ))
            ) : (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="glass-morphism p-5 rounded-2xl animate-pulse h-20"></div>
              ))
            )}
          </div>
        </section>

        {/* FAQ / Info */}
        <section className="glass-morphism rounded-3xl p-8 border border-blue-500/20">
          <h3 className="text-xl font-bold mb-4">Why use Link Shield?</h3>
          <div className="space-y-4 text-gray-400 text-sm">
            <p>
              During holidays, scams surge as attackers take advantage of increased online shopping, digital greeting cards, and travel bookings. 
            </p>
            <p>
              Our tool uses advanced AI to "unmask" redirects and analyze domain registration patterns that typical browsers might miss. We look for hidden scripts, typo-squatting, and deceptive URL patterns to keep your identity safe.
            </p>
            <div className="pt-4 flex items-center gap-2 text-emerald-400 font-semibold">
              <ShieldCheck className="w-5 h-5" />
              <span>Stay safe, stay secure, and Happy New Year 2025!</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-20 border-t border-slate-800 py-10 text-center text-gray-500 text-sm px-4">
        <p>© 2025 SecureYear. Protecting your digital life through intelligent analysis.</p>
        <p className="mt-2 text-xs opacity-50">Powered by Gemini AI Technology</p>
      </footer>
    </div>
  );
};

export default App;

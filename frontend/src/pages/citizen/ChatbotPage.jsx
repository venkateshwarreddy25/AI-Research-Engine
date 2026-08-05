import React, { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import ChatMessage from '../../components/chat/ChatMessage';

const SUGGESTED_PROMPTS = [
  '🎓 National Scholarship Portal (NSP)',
  '🌾 PM-KISAN Scheme Benefits & Process',
  '🏥 Ayushman Bharat PM-JAY ₹5L Health Cover',
  '💼 PM Vishwakarma Artisan Support',
  '👩 Lakhpati Didi Scheme for SHG Women',
  '🏠 PMAY Urban 2.0 Housing Subsidy',
];

export default function ChatbotPage() {
  const user = useAuthStore((s) => s.user);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Namaste${user?.fullName ? ', ' + user.fullName.split(' ')[0] : ''}! 🙏 I am your Official Government AI Helpdesk Assistant.\n\nI provide verified, real-time information about central and state government schemes, eligibility criteria, required documents, and official application portals.\n\nWhat government scheme or benefit would you like to inquire about today?`,
    },
  ]);

  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [listening, setListening] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [sessions, setSessions]   = useState(['default-session']);
  const [currentSession, setCurrentSession] = useState('default-session');

  const bottomRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Speech Recognition (STT) setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setListening(false);
      };

      recognition.onerror = () => setListening(false);
      recognition.onend = () => setListening(false);

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  const sendMessage = async (text) => {
    const content = text || input.trim();
    if (!content || loading) return;

    setInput('');
    const userMsg = { role: 'user', content };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/v1/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          history: messages,
          sessionId: currentSession,
          userProfile: user || {},
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: json.data.message,
            retrievedSchemes: json.data.retrievedSchemes,
          },
        ]);
      } else {
        throw new Error(json.message || 'Failed to generate response');
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: "I couldn't find verified information from official Government sources for your query. Please search for specific schemes like PM-KISAN, PM-JAY, or NSP.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex h-[calc(100vh-140px)] sm:h-[calc(100vh-160px)] w-full bg-slate-50 rounded-3xl border border-slate-200 overflow-hidden shadow-xl">
      
      {/* Sidebar for Chat History (Responsive Drawer) */}
      {showHistory && (
        <div className="fixed inset-y-0 left-0 z-50 w-72 md:relative md:w-64 border-r border-slate-200 bg-white p-4 space-y-4 flex-shrink-0 shadow-2xl md:shadow-none animate-in slide-in-from-left duration-200">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Chat Sessions</h3>
            <button onClick={() => setShowHistory(false)} className="text-slate-400 hover:text-slate-600 p-1 font-bold">✕</button>
          </div>

          <button
            onClick={() => {
              const newSess = `session-${Date.now()}`;
              setSessions(prev => [newSess, ...prev]);
              setCurrentSession(newSess);
              setMessages([{
                role: 'assistant',
                content: `New Chat Session Started. Ask about any official government scheme!`,
              }]);
              setShowHistory(false);
            }}
            className="w-full py-2.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl transition-all shadow-md"
          >
            + New Chat Session
          </button>

          <div className="space-y-1 overflow-y-auto max-h-[70vh]">
            {sessions.map(s => (
              <button
                key={s}
                onClick={() => { setCurrentSession(s); setShowHistory(false); }}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium truncate transition-all ${
                  currentSession === s
                    ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                💬 {s === 'default-session' ? 'Main Government Helpdesk' : s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full bg-white min-w-0">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-slate-200"
              title="Toggle Chat History"
            >
              📜 Sessions
            </button>

            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-lg sm:text-xl shadow-lg flex-shrink-0">
              🏛️
            </div>
            <div>
              <div className="font-extrabold text-xs sm:text-sm flex items-center gap-2">
                Official Government AI Helpdesk
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500 text-white">
                  ✓ Verified Feeds
                </span>
              </div>
              <div className="text-[10px] sm:text-[11px] text-emerald-400 flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> RAG Grounded Engine Active
              </div>
            </div>
          </div>
        </div>

        {/* Message History */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
          {messages.map((msg, idx) => (
            <ChatMessage key={idx} msg={msg} />
          ))}

          {/* Typing Indicator */}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-sm text-white font-bold flex-shrink-0">
                🏛️
              </div>
              <div className="bg-white border border-slate-200 rounded-3xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Retrieving verified government data…</span>
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggested Quick Prompts */}
        <div className="px-4 py-2 flex gap-2 overflow-x-auto border-t border-slate-100 bg-slate-50 no-scrollbar flex-shrink-0">
          {SUGGESTED_PROMPTS.map(p => (
            <button
              key={p}
              onClick={() => sendMessage(p)}
              className="flex-shrink-0 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-full text-slate-700 hover:border-indigo-500 hover:text-indigo-600 transition-all whitespace-nowrap shadow-sm"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-200 bg-white flex-shrink-0">
          <div className="flex gap-2 sm:gap-3 items-center">
            
            {/* Voice Input Microphone Button */}
            <button
              onClick={toggleMic}
              className={`p-2.5 sm:p-3 rounded-2xl transition-all flex items-center justify-center flex-shrink-0 ${
                listening
                  ? 'bg-red-500 text-white animate-pulse shadow-lg'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              title={listening ? 'Listening… Click to Stop' : 'Click to Speak (Voice Input)'}
            >
              🎙️
            </button>

            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              rows={1}
              placeholder="Ask about any government scheme, eligibility, documents, or application steps…"
              className="flex-1 resize-none px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />

            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-40 text-white font-bold text-xs sm:text-sm rounded-2xl flex items-center justify-center transition-all shadow-md flex-shrink-0"
            >
              Send ➔
            </button>
          </div>
          <p className="text-[10px] sm:text-[11px] text-center text-slate-400 mt-1.5">
            Verified Government Assistance · Press Enter to send · Shift+Enter for new line
          </p>
        </div>

      </div>
    </div>
  );
}

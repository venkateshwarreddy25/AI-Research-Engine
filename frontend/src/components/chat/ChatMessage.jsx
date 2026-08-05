import React, { useState } from 'react';

export default function ChatMessage({ msg, onSelectScheme }) {
  const isUser = msg.role === 'user';
  const [copied, setCopied]   = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in your browser.');
      return;
    }

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const cleanText = msg.content.replace(/[*_#`[\]()]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText.slice(0, 500));
    utterance.rate = 1.0;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  const handleDownloadPDF = () => {
    const element = document.createElement('a');
    const file = new Blob([msg.content], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `Government_Scheme_Guide_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      
      {/* Avatar */}
      <div className={`flex-shrink-0 w-9 h-9 rounded-2xl flex items-center justify-center text-sm font-bold shadow-md ${
        isUser
          ? 'bg-indigo-600 text-white'
          : 'bg-gradient-to-br from-indigo-500 via-purple-600 to-violet-700 text-white'
      }`}>
        {isUser ? 'U' : '🏛️'}
      </div>

      {/* Message Card */}
      <div className={`max-w-[92%] sm:max-w-[80%] rounded-3xl p-3.5 sm:p-5 text-xs sm:text-sm leading-relaxed space-y-3 ${
        isUser
          ? 'bg-indigo-600 text-white rounded-tr-sm shadow-md'
          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-sm shadow-sm'
      }`}>

        {/* Verification Header for Assistant */}
        {!isUser && (
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-700/60">
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-800">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Verified Government Source
            </div>

            <div className="flex items-center gap-1 flex-wrap">
              <button
                onClick={handleSpeak}
                className={`p-1.5 rounded-lg text-xs transition-all ${
                  speaking
                    ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-600 animate-pulse'
                    : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
                title={speaking ? 'Stop Reading' : 'Read Aloud (Voice)'}
              >
                {speaking ? '🔊 Speaking…' : '🔊 Listen'}
              </button>

              <button
                onClick={handleCopy}
                className="p-1.5 rounded-lg text-xs text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                title="Copy Response"
              >
                {copied ? '✓ Copied' : '📋 Copy'}
              </button>

              <button
                onClick={handleDownloadPDF}
                className="p-1.5 rounded-lg text-xs text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                title="Download Guide"
              >
                📥 Save Guide
              </button>
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="whitespace-pre-wrap font-sans space-y-1.5 leading-relaxed text-xs sm:text-sm">
          {msg.content}
        </div>

        {/* Retrieved Schemes Pills */}
        {!isUser && Array.isArray(msg.retrievedSchemes) && msg.retrievedSchemes.length > 0 && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Referenced Official Schemes:
            </div>
            <div className="flex flex-wrap gap-2">
              {msg.retrievedSchemes.map(s => (
                <a
                  key={s.id || s.title}
                  href={s.officialApplyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold text-xs rounded-xl border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-all flex items-center gap-1"
                >
                  🏛️ {s.title} ↗
                </a>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

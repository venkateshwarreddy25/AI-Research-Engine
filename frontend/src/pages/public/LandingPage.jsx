import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes.constants';

export default function LandingPage() {
  const [activeTab, setActiveTab]            = useState('Home');
  const [mobileMenuOpen, setMobileMenuOpen]  = useState(false);

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-900 text-white font-sans flex flex-col justify-between selection:bg-white selection:text-slate-900">
      
      {/* ── Top Cover Header ────────────────────────────────────────── */}
      <header className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between flex-shrink-0 z-20">
        {/* Brand Title */}
        <Link to="/" className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2 hover:opacity-90 transition-opacity">
          <div className="w-8 h-8 rounded-xl bg-white text-slate-900 font-black flex items-center justify-center text-sm shadow-md">
            🏛️
          </div>
          <span>GovAssist AI</span>
        </Link>

        {/* Right Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
          {[
            { label: 'Home',        to: '/' },
            { label: 'Features',    to: '#features' },
            { label: 'Schemes',     to: ROUTES.SCHEMES },
            { label: 'AI Helpdesk', to: ROUTES.CHATBOT },
          ].map(item => (
            <Link
              key={item.label}
              to={item.to}
              onClick={() => setActiveTab(item.label)}
              className={`transition-all py-1 border-b-2 ${
                activeTab === item.label
                  ? 'border-white text-white font-bold'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to={ROUTES.LOGIN}
            className="text-slate-300 hover:text-white transition-colors ml-2 font-medium"
          >
            Sign In
          </Link>
          <Link
            to={ROUTES.REGISTER}
            className="px-4 py-2 bg-white text-slate-900 font-extrabold text-xs rounded-lg hover:bg-slate-100 transition-all shadow-md"
          >
            Sign Up
          </Link>
        </nav>

        {/* Mobile Hamburger Menu Toggle Button */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            to={ROUTES.LOGIN}
            className="px-3 py-1.5 bg-white text-slate-900 font-extrabold text-xs rounded-lg shadow-sm"
          >
            Sign In
          </Link>
          <button
            onClick={() => setMobileMenuOpen(p => !p)}
            aria-label="Toggle Navigation Menu"
            className="p-2.5 rounded-xl bg-slate-800 text-white hover:bg-slate-700 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-6 py-4 space-y-3 animate-in slide-in-from-top duration-200 z-30">
          {[
            { label: 'Home',        to: '/' },
            { label: 'Features',    to: '#features' },
            { label: 'Schemes',     to: ROUTES.SCHEMES },
            { label: 'AI Helpdesk', to: ROUTES.CHATBOT },
          ].map(item => (
            <Link
              key={item.label}
              to={item.to}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-bold text-slate-200 hover:text-white border-b border-slate-900"
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-2 flex gap-3">
            <Link
              to={ROUTES.REGISTER}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3 bg-white text-slate-900 font-extrabold text-xs rounded-xl shadow-md"
            >
              Create Account (Sign Up)
            </Link>
          </div>
        </div>
      )}

      {/* ── Centered Cover Hero Block ────────────────────────────────── */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 py-12 sm:py-16 max-w-3xl mx-auto space-y-6 sm:space-y-8 z-10 w-full">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-slate-300 text-xs font-semibold backdrop-blur-md max-w-full truncate">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
          <span className="truncate">Powered by Google Gemini AI & Verified Government Open Data</span>
        </div>

        {/* Giant Main Cover Title */}
        <h1 className="text-3xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight">
          Cover your government journey.
        </h1>

        {/* Subtitle / Lede Text */}
        <p className="text-sm sm:text-lg lg:text-xl text-slate-300 max-w-2xl leading-relaxed font-normal px-2">
          GovAssist AI is an intelligent platform for discovering government schemes, evaluating eligibility in real-time, verifying documents with OCR, and tracking applications.
        </p>

        {/* Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto px-4">
          <Link
            to={ROUTES.REGISTER}
            className="w-full sm:w-auto px-8 py-3.5 bg-white text-slate-900 font-extrabold text-sm sm:text-base rounded-xl hover:bg-slate-100 transition-all duration-200 shadow-2xl hover:scale-105 active:scale-100 min-h-[44px] flex items-center justify-center"
          >
            Learn more
          </Link>
          <Link
            to={ROUTES.CHATBOT}
            className="w-full sm:w-auto px-8 py-3.5 bg-slate-800 border border-slate-700 text-white hover:bg-slate-700 font-extrabold text-sm sm:text-base rounded-xl transition-all duration-200 min-h-[44px] flex items-center justify-center"
          >
            🤖 Ask AI Government Officer
          </Link>
        </div>

        {/* Features Highlights Pills */}
        <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full text-left max-w-2xl px-2">
          {[
            { label: '2,000+ Schemes', sub: 'Central & State feeds', icon: '🏛️' },
            { label: 'RAG Grounded', sub: 'Zero hallucination', icon: '🤖' },
            { label: 'OCR Document Vault', sub: 'Auto-fill forms', icon: '📄' },
            { label: 'Status Tracker', sub: 'Step-by-step progress', icon: '📊' },
          ].map(f => (
            <div key={f.label} className="p-3.5 bg-slate-800/80 border border-slate-700/80 rounded-2xl space-y-1">
              <div className="text-lg mb-1">{f.icon}</div>
              <div className="font-extrabold text-xs text-white truncate">{f.label}</div>
              <div className="text-[11px] text-slate-400 truncate">{f.sub}</div>
            </div>
          ))}
        </div>
      </main>

      {/* ── Sub Features Section (On Scroll) ───────────────────────── */}
      <section id="features" className="w-full bg-slate-950 border-t border-slate-800 py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full">
              Platform Features
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Built for Every Citizen Across India
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
              Empowering farmers, students, women entrepreneurs, artisans, and families with verified government information.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Verified AI Assistant',
                desc: 'Ask questions in plain English or Hindi. Powered by Google Gemini with strict function-calling RAG to retrieve verified schemes.',
                icon: '🤖',
                to: ROUTES.CHATBOT,
              },
              {
                title: 'Real-Time Schemes Explorer',
                desc: 'Explore 2,000+ central and state government schemes synced automatically from myScheme.gov.in and data.gov.in.',
                icon: '🏛️',
                to: ROUTES.SCHEMES,
              },
              {
                title: 'OCR Document Vault',
                desc: 'Upload Aadhaar, Income Certificate, or Marksheet. Our OCR engine validates expiry and generates a scheme checklist.',
                icon: '📄',
                to: ROUTES.DOCUMENTS,
              },
            ].map(card => (
              <Link
                key={card.title}
                to={card.to}
                className="group p-6 bg-slate-900 border border-slate-800 rounded-2xl hover:border-slate-600 transition-all hover:-translate-y-1 space-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {card.icon}
                </div>
                <h3 className="font-extrabold text-base text-white group-hover:text-slate-200">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {card.desc}
                </p>
                <div className="text-xs font-bold text-slate-300 pt-2 group-hover:translate-x-1 transition-transform inline-block">
                  Explore →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cover Bottom Footer ──────────────────────────────────────── */}
      <footer className="w-full text-center py-6 px-4 border-t border-slate-800 text-slate-500 text-xs flex-shrink-0 z-20">
        <p className="font-medium">
          Cover template for <span className="text-slate-300 font-bold">GovAssist AI</span>, powered by <span className="text-slate-300 font-bold">Google Gemini RAG</span>.
        </p>
        <p className="text-slate-600 text-[11px] mt-1">
          © 2026 GovAssist AI · Government of India Digital Platform Initiative
        </p>
      </footer>

    </div>
  );
}

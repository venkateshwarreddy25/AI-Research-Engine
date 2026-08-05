import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex bg-slate-900 text-white">
      {/* ── Left brand panel ─────────────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-slate-950 p-12 relative overflow-hidden border-r border-slate-800">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/3 blur-3xl" />
        </div>

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white text-slate-900 flex items-center justify-center font-black text-xl shadow-xl">
            🏛️
          </div>
          <div>
            <span className="text-white font-black text-xl">GovAssist AI</span>
            <p className="text-slate-400 text-xs font-semibold">Digital Citizen Portal</p>
          </div>
        </div>

        {/* Hero text */}
        <div className="relative space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <h1 className="text-white font-black text-5xl leading-tight tracking-tight">
              Cover your<br />
              <span className="text-slate-400">government</span> journey.
            </h1>
            <p className="text-slate-300 text-base mt-4 leading-relaxed max-w-md font-normal">
              Discover schemes you qualify for, get instant AI guidance, verify documents, and track applications in real time.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-3 gap-4"
          >
            {[
              { label: 'Active Schemes',  value: '2,000+', icon: '🏛️' },
              { label: 'Citizens Served', value: '10M+',   icon: '👥' },
              { label: 'RAG Grounded',    value: '100%',   icon: '🤖' },
            ].map((stat) => (
              <div key={stat.label} className="bg-slate-900 rounded-2xl p-4 border border-slate-800 text-center">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <p className="text-white font-black text-xl">{stat.value}</p>
                <p className="text-slate-400 text-xs font-medium mt-0.5">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <p className="relative text-slate-500 text-xs">
          © 2026 GovAssist AI · Government of India Digital Initiative
        </p>
      </div>

      {/* ── Right auth form panel ─────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-white text-slate-900 flex items-center justify-center font-black text-xl shadow-lg">
              🏛️
            </div>
            <span className="font-black text-white text-xl">GovAssist AI</span>
          </div>
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
}

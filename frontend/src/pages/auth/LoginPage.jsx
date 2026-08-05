import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes.constants';
import { useAuthStore } from '../../store/authStore';

const schema = z.object({
  email:    z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function LoginPage() {
  const navigate  = useNavigate();
  const setAuth   = useAuthStore((s) => s.setAuth);
  const [loading, setLoading]   = useState(false);
  const [apiError, setApiError] = useState('');
  const [showPw, setShowPw]     = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setApiError('');
    try {
      const res  = await fetch('http://localhost:5000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Login failed');
      setAuth(json.data.user, json.data.accessToken);
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-3xl border border-slate-700 p-8 sm:p-10 space-y-7 shadow-2xl text-white">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="w-14 h-14 rounded-2xl bg-white text-slate-900 flex items-center justify-center mx-auto mb-4 shadow-xl">
          <span className="text-2xl">🏛️</span>
        </div>
        <h1 className="text-3xl font-black text-white">Welcome back</h1>
        <p className="text-slate-400 text-sm">Sign in to your GovAssist Citizen Portal</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {apiError && (
          <div className="p-4 bg-red-950/60 border border-red-800 rounded-2xl text-red-300 text-sm font-medium flex items-start gap-2">
            <span className="text-lg flex-shrink-0">⚠️</span>
            {apiError}
          </div>
        )}

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-slate-300">Email address</label>
          <input
            {...register('email')}
            type="email"
            placeholder="citizen@example.com"
            className="w-full px-4 py-3.5 rounded-2xl border border-slate-700 bg-slate-900 text-white placeholder-slate-500 focus:ring-2 focus:ring-white focus:border-white outline-none transition-all text-sm font-medium"
          />
          {errors.email && <p className="text-xs text-red-400 font-medium">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-slate-300">Password</label>
          <div className="relative">
            <input
              {...register('password')}
              type={showPw ? 'text' : 'password'}
              placeholder="••••••••"
              className="w-full px-4 py-3.5 pr-12 rounded-2xl border border-slate-700 bg-slate-900 text-white placeholder-slate-500 focus:ring-2 focus:ring-white focus:border-white outline-none transition-all text-sm font-medium"
            />
            <button type="button" onClick={() => setShowPw(p => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-sm">
              {showPw ? '🙈' : '👁️'}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-400 font-medium">{errors.password.message}</p>}
        </div>

        <div className="flex items-center justify-end">
          <Link to={ROUTES.FORGOT} className="text-xs text-slate-300 font-bold hover:underline">Forgot password?</Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-white hover:bg-slate-100 disabled:opacity-60 text-slate-900 font-extrabold rounded-2xl transition-all duration-200 shadow-xl hover:-translate-y-0.5 active:translate-y-0 text-base"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
              Signing in…
            </span>
          ) : '→ Sign In to Portal'}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-slate-700" />
        <span className="text-xs text-slate-500 font-medium">or</span>
        <div className="flex-1 h-px bg-slate-700" />
      </div>

      <p className="text-center text-sm text-slate-400">
        New to GovAssist?{' '}
        <Link to={ROUTES.REGISTER} className="text-white font-extrabold hover:underline">
          Create Free Account →
        </Link>
      </p>

      <p className="text-center text-xs text-slate-500">
        🔒 Secured by SSL · Official Government Portal
      </p>
    </div>
  );
}

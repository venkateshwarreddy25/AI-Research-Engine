import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes.constants';

const schema = z.object({
  fullName:        z.string().min(2, 'Name must be at least 2 characters'),
  email:           z.string().email('Enter a valid email'),
  password:        z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  state:           z.string().min(1, 'Please select your state'),
}).refine(d => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
  'Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka',
  'Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram',
  'Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
  'Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Delhi','Jammu & Kashmir','Ladakh','Puducherry',
];

const inputCls = "w-full px-4 py-3.5 rounded-2xl border border-slate-700 bg-slate-900 text-white placeholder-slate-500 focus:ring-2 focus:ring-white focus:border-white outline-none transition-all text-sm font-medium";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [loading,  setLoading]  = useState(false);
  const [apiError, setApiError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setApiError('');
    try {
      const res  = await fetch('http://localhost:5000/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: data.fullName, email: data.email, password: data.password, state: data.state }),
        credentials: 'include',
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Registration failed');
      navigate(ROUTES.LOGIN + '?registered=1');
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ label, error, children }) => (
    <div className="space-y-1.5">
      <label className="text-sm font-bold text-slate-300">{label}</label>
      {children}
      {error && <p className="text-xs text-red-400 font-medium">{error}</p>}
    </div>
  );

  return (
    <div className="bg-slate-800 rounded-3xl border border-slate-700 p-8 sm:p-10 space-y-6 shadow-2xl text-white">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="w-14 h-14 rounded-2xl bg-white text-slate-900 flex items-center justify-center mx-auto mb-4 shadow-xl">
          <span className="text-2xl">🏛️</span>
        </div>
        <h1 className="text-3xl font-black text-white">Create Account</h1>
        <p className="text-slate-400 text-sm">Join millions of citizens accessing government benefits</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {apiError && (
          <div className="p-4 bg-red-950/60 border border-red-800 rounded-2xl text-red-300 text-sm font-medium flex items-start gap-2">
            <span className="text-lg flex-shrink-0">⚠️</span>
            {apiError}
          </div>
        )}

        <Field label="Full Name" error={errors.fullName?.message}>
          <input {...register('fullName')} type="text" placeholder="Rahul Sharma" className={inputCls} />
        </Field>

        <Field label="Email Address" error={errors.email?.message}>
          <input {...register('email')} type="email" placeholder="citizen@example.com" className={inputCls} />
        </Field>

        <Field label="State" error={errors.state?.message}>
          <select {...register('state')} className={inputCls}>
            <option value="">— Select your state —</option>
            {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Password" error={errors.password?.message}>
            <input {...register('password')} type="password" placeholder="••••••••" className={inputCls} />
          </Field>
          <Field label="Confirm Password" error={errors.confirmPassword?.message}>
            <input {...register('confirmPassword')} type="password" placeholder="••••••••" className={inputCls} />
          </Field>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-white hover:bg-slate-100 disabled:opacity-60 text-slate-900 font-extrabold rounded-2xl transition-all duration-200 shadow-xl hover:-translate-y-0.5 active:translate-y-0 text-base"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
              Creating Account…
            </span>
          ) : '→ Create Free Account'}
        </button>
      </form>

      <p className="text-center text-sm text-slate-400">
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} className="text-white font-extrabold hover:underline">Sign in →</Link>
      </p>
      <p className="text-center text-xs text-slate-500">🔒 Secured by SSL · Official Government Portal</p>
    </div>
  );
}

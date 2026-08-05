import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useThemeStore } from './store/themeStore';
import { useAuthStore }  from './store/authStore';
import { ROUTES }        from './constants/routes.constants';

// ── Lazy-loaded layouts ──────────────────────────────────────────────────────
const MainLayout  = lazy(() => import('./layouts/MainLayout'));
const AuthLayout  = lazy(() => import('./layouts/AuthLayout'));
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));

// ── Lazy-loaded pages ────────────────────────────────────────────────────────
const LandingPage        = lazy(() => import('./pages/public/LandingPage'));
const LoginPage          = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage       = lazy(() => import('./pages/auth/RegisterPage'));
const DashboardPage      = lazy(() => import('./pages/citizen/DashboardPage'));
const ChatbotPage        = lazy(() => import('./pages/citizen/ChatbotPage'));
const SchemeExplorerPage = lazy(() => import('./pages/citizen/SchemeExplorerPage'));
const ProfilePage        = lazy(() => import('./pages/citizen/ProfilePage'));
const DocumentVaultPage    = lazy(() => import('./pages/citizen/DocumentVaultPage'));
const ApplicationsPage     = lazy(() => import('./pages/citizen/ApplicationsPage'));
const NotificationsPage    = lazy(() => import('./pages/citizen/NotificationsPage'));
const NotFoundPage         = lazy(() => import('./pages/public/NotFoundPage'));
const AdminDashboardPage   = lazy(() => import('./pages/admin/AdminDashboardPage'));

// ── Full-page loader ─────────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center shadow-glow animate-pulse">
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Loading GovAssist AI…</p>
      </div>
    </div>
  );
}

// ── Route guards ─────────────────────────────────────────────────────────────
function ProtectedRoute({ children }) {
  const isAuth = useAuthStore((s) => s.isAuth);
  return isAuth ? children : <Navigate to={ROUTES.LOGIN} replace />;
}

function AdminRoute({ children }) {
  const { isAuth, user } = useAuthStore();
  if (!isAuth) return <Navigate to={ROUTES.LOGIN} replace />;
  if (!['admin', 'super_admin'].includes(user?.role)) return <Navigate to={ROUTES.DASHBOARD} replace />;
  return children;
}

function GuestRoute({ children }) {
  const isAuth = useAuthStore((s) => s.isAuth);
  return isAuth ? <Navigate to={ROUTES.DASHBOARD} replace /> : children;
}

// ── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const { isDark } = useThemeStore();

  // Enforce crisp light mode globally
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* ── Public ── */}
        <Route path={ROUTES.HOME}  element={<LandingPage />} />
        <Route path="/404"         element={<NotFoundPage />} />
        <Route path="*"            element={<NotFoundPage />} />

        {/* ── Auth ── */}
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.LOGIN}    element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path={ROUTES.REGISTER} element={<GuestRoute><RegisterPage /></GuestRoute>} />
        </Route>

        {/* ── Citizen (protected) ── */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTES.CHATBOT}   element={<ChatbotPage />} />
          <Route path={ROUTES.SCHEMES}   element={<SchemeExplorerPage />} />
          <Route path={ROUTES.PROFILE}        element={<ProfilePage />} />
          <Route path={ROUTES.DOCUMENTS}      element={<DocumentVaultPage />} />
          <Route path={ROUTES.APPLICATIONS}   element={<ApplicationsPage />} />
          <Route path={ROUTES.NOTIFICATIONS}  element={<NotificationsPage />} />
        </Route>

        {/* ── Admin (role-protected) ── */}
        <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboardPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

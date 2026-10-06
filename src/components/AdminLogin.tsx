import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  User,
  Key,
  ArrowRight,
  Radio,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (user: { name: string; email: string; role: string }) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please provide both administrative username and credentials.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess({
        name: 'Officer Yuvraj Satpute',
        email: 'yuvrajsatpute2020@gmail.com',
        role: 'District Incident Commander · DGMS SOP-7',
      });
    }, 600);
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess({
        name: 'Officer Yuvraj Satpute',
        email: 'yuvrajsatpute2020@gmail.com',
        role: 'District Incident Commander · Google Workspace SSO',
      });
    }, 600);
  };

  const handleQuickDemoLogin = () => {
    onLoginSuccess({
      name: 'Cmdr. Y. Satpute',
      email: 'incident.commander@dgms.gov.in',
      role: 'District Incident Commander (Field Lead)',
    });
  };

  return (
    <div className="mx-auto flex min-h-[580px] max-w-[500px] flex-col justify-center px-4 py-12">
      <div
        className="overflow-hidden rounded-xl border shadow-lg"
        style={{
          borderColor: 'var(--line)',
          background: 'var(--surface)',
        }}
      >
        {/* Header Bar */}
        <div
          className="border-b px-6 py-6 text-center"
          style={{ borderColor: 'var(--line)', background: 'var(--surface-2)' }}
        >
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20">
            <ShieldCheck size={28} />
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[10.5px] font-bold text-amber-700 dark:text-amber-400">
            <span>RESTRICTED ACCESS · DGMS SOP-7 PROTOCOL</span>
          </div>
          <h2
            className="font-display mt-2 text-[20px] font-700 tracking-tight"
            style={{ color: 'var(--ink)' }}
          >
            District Control Room Console
          </h2>
          <p className="mt-1 text-[12.5px]" style={{ color: 'var(--mute)' }}>
            Sign in to access real-time LoRa sentry telemetry, force SMS broadcast, and evacuation management.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {error && (
            <div
              className="mb-4 flex items-center gap-2 rounded-md border p-3 text-[12px] font-medium"
              style={{
                borderColor: 'var(--red)',
                background: 'var(--red-sw)',
                color: 'var(--red)',
              }}
            >
              <AlertCircle size={15} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Option 1: Google OAuth Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="focus-ring flex w-full items-center justify-center gap-3 rounded-lg border py-3 text-[13.5px] font-600 transition-colors cursor-pointer hover:bg-black/[0.03] dark:hover:bg-white/[0.03] shadow-sm disabled:opacity-50"
            style={{
              borderColor: 'var(--line-2)',
              background: 'var(--surface)',
              color: 'var(--ink)',
            }}
          >
            {/* Google Logo SVG */}
            <svg className="h-4.5 w-4.5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative my-5 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" style={{ borderColor: 'var(--line)' }} />
            </div>
            <span
              className="relative px-3 text-[11px] font-semibold uppercase tracking-wider"
              style={{ background: 'var(--surface)', color: 'var(--mute)' }}
            >
              Or with Incident Credentials
            </span>
          </div>

          {/* Option 2: Username & Password Form */}
          <form onSubmit={handlePasswordSubmit} className="space-y-3.5">
            <div>
              <label
                className="mb-1 block text-[12px] font-600"
                style={{ color: 'var(--ink)' }}
              >
                Commander Username / Email
              </label>
              <div className="relative">
                <User
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--mute)' }}
                />
                <input
                  type="text"
                  placeholder="admin@dgms.gov.in"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-md border py-2.5 pl-9 pr-3 text-[13px] outline-none transition-colors"
                  style={{
                    borderColor: 'var(--line)',
                    background: 'var(--surface-2)',
                    color: 'var(--ink)',
                  }}
                />
              </div>
            </div>

            <div>
              <label
                className="mb-1 block text-[12px] font-600"
                style={{ color: 'var(--ink)' }}
              >
                Security Passcode
              </label>
              <div className="relative">
                <Key
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--mute)' }}
                />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border py-2.5 pl-9 pr-3 text-[13px] outline-none transition-colors"
                  style={{
                    borderColor: 'var(--line)',
                    background: 'var(--surface-2)',
                    color: 'var(--ink)',
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="focus-ring flex w-full items-center justify-center gap-2 rounded-lg py-2.8 text-[13px] font-700 text-white transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer shadow"
              style={{ background: 'var(--ink)' }}
            >
              <Lock size={14} />
              <span>{loading ? 'Authenticating…' : 'Access District Control Room'}</span>
              <ArrowRight size={14} />
            </button>
          </form>

          {/* Quick 1-Click Demo Login Button */}
          <div className="mt-4 pt-3 border-t text-center" style={{ borderColor: 'var(--line)' }}>
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="focus-ring inline-flex items-center gap-1.5 text-[12px] font-600 cursor-pointer underline-offset-4 hover:underline"
              style={{ color: 'var(--saffron)' }}
            >
              <Radio size={13} />
              <span>One-Click Quick Login as Incident Commander (Demo)</span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div
          className="border-t px-6 py-3 text-center text-[11px]"
          style={{ borderColor: 'var(--line)', background: 'var(--surface-2)', color: 'var(--mute)' }}
        >
          Protected under Mines Act 1952 · DGMS Technical Circular 07/2026
        </div>
      </div>
    </div>
  );
};

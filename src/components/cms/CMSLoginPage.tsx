/**
 * Dedicated CMS Administrator Login Page
 * Secure authentication for Super Administrators and Content Administrators.
 */

import React, { useState } from 'react';
import { JataNegeriSembilan, JkrLogo } from '../Logos';

export interface CMSUser {
  id: string;
  username: string;
  name: string;
  role: 'Super Administrator' | 'Administrator';
  email: string;
  department: string;
}

interface CMSLoginPageProps {
  onLoginSuccess: (user: CMSUser, token: string) => void;
  onBackToPublic: () => void;
}

export const CMSLoginPage: React.FC<CMSLoginPageProps> = ({
  onLoginSuccess,
  onBackToPublic
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!username.trim() || !password.trim()) {
      setErrorMsg('Sila masukkan Nama Pengguna dan Kata Laluan Pentadbir.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/cms/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim()
        })
      });

      const data = await res.json();

      if (res.ok && data.success && data.user) {
        localStorage.setItem('jkr_cms_token', data.token);
        localStorage.setItem('jkr_cms_user', JSON.stringify(data.user));
        onLoginSuccess(data.user, data.token);
      } else {
        setErrorMsg(data.error || 'Nama pengguna atau kata laluan tidak sah.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Ralat sambungan pelayan. Sila cuba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between text-slate-100 relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black z-0 pointer-events-none opacity-90"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Bar with Negeri Sembilan Colors */}
      <div className="relative z-10 w-full">
        <div className="h-1.5 w-full flex">
          <div className="h-full w-1/2 bg-[#FFD100]"></div>
          <div className="h-full w-1/4 bg-[#DC2626]"></div>
          <div className="h-full w-1/4 bg-[#111827]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 p-1.5 bg-white rounded-xl border border-white/20 shadow-xs">
              <JataNegeriSembilan className="h-9 w-auto" />
              <div className="h-7 w-px bg-slate-200"></div>
              <JkrLogo className="h-9 w-auto" />
            </div>
            <div>
              <span className="text-[10px] tracking-widest uppercase font-bold text-slate-400 block">
                Sistem Pengurusan Kandungan
              </span>
              <h1 className="text-sm sm:text-base font-black text-white tracking-wide">
                JKR NEGERI SEMBILAN (CMS)
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={onBackToPublic}
            className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-[#FFD100] bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 transition-colors cursor-pointer"
          >
            <i className="fa-solid fa-arrow-left text-[11px]"></i>
            <span className="hidden sm:inline">Kembali ke Portal Awam</span>
            <span className="sm:hidden">Portal Awam</span>
          </button>
        </div>
      </div>

      {/* Login Box */}
      <div className="relative z-10 w-full max-w-md mx-auto px-4 py-8">
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80">
          {/* Header Icon */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 to-[#FFD100] text-slate-950 flex items-center justify-center text-2xl font-black mb-3 shadow-lg shadow-yellow-500/20">
              <i className="fa-solid fa-screwdriver-wrench"></i>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Log Masuk Pentadbir CMS
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Portal Pengurusan Kandungan Laman Web Rasmi JKR Negeri Sembilan Darul Khusus
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 text-xs flex items-start gap-2.5 animate-fadeIn">
              <i className="fa-solid fa-circle-exclamation text-red-400 mt-0.5 text-sm flex-shrink-0"></i>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Nama Pengguna (Username)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <i className="fa-solid fa-user-shield text-xs"></i>
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Contoh: admin"
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FFD100] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Kata Laluan
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <i className="fa-solid fa-lock text-xs"></i>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FFD100] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 text-xs cursor-pointer"
                >
                  <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            {/* Access Level Notice */}
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-300">
                <i className="fa-solid fa-shield-halved text-[#FFD100]"></i>
                <span>Kawalan Akses Peranan:</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-slate-400 pl-1">
                <li><strong className="text-amber-400">Super Administrator:</strong> Akses penuh semua modul CMS, pengurusan pentadbir & tetapan sistem.</li>
                <li><strong className="text-blue-400">Administrator:</strong> Suntingan kandungan portal, artikel, muat turun & banner.</li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#FFD100] hover:bg-yellow-400 text-slate-950 font-black text-sm rounded-xl transition-all shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <>
                  <i className="fa-solid fa-circle-notch fa-spin"></i>
                  <span>Mengesahkan Kelayakan...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-right-to-bracket text-[#DC2626]"></i>
                  <span>Log Masuk Papan Pemuka CMS</span>
                </>
              )}
            </button>
          </form>

          {/* Security & Access Restriction Notice */}
          <div className="mt-6 pt-4 border-t border-slate-800 text-center text-[11px] text-slate-500 leading-relaxed">
            <p className="flex items-center justify-center gap-1.5">
              <i className="fa-solid fa-lock text-red-500 text-[10px]"></i>
              <span>Sistem Dilindungi. Akses Tidak Dibenarkan Adalah Satu Kesalahan Jenayah.</span>
            </p>
            <p className="mt-1">
              Untuk urusan tetapan kata laluan atau akaun baharu, sila hubungi Bahagian Pentadbiran &amp; Integriti JKR NS.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 w-full py-4 text-center text-xs text-slate-500 border-t border-slate-900 bg-black/40">
        <span>© 2026 Jabatan Kerja Raya Negeri Sembilan Darul Khusus. Hak Cipta Terpelihara.</span>
      </div>
    </div>
  );
};

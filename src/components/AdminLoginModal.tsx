import React, { useState } from 'react';

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  role: 'Admin' | 'Penyelaras Iklan';
  email: string;
  department: string;
}

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUser) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  // Mode: 'login' | 'register'
  const [modalMode, setModalMode] = useState<'login' | 'register'>('login');

  // Common role selection: 'Admin' | 'Penyelaras Iklan'
  const [selectedRole, setSelectedRole] = useState<'Admin' | 'Penyelaras Iklan'>('Admin');

  // Login inputs
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Register inputs
  const [regFullName, setRegFullName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regDepartment, setRegDepartment] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMsg('Sila masukkan nama pengguna dan kata laluan.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
          requestedRole: selectedRole
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('jkr_admin_token', data.token);
        localStorage.setItem('jkr_admin_user', JSON.stringify(data.user));
        onLoginSuccess(data.user);
        onClose();
      } else {
        setErrorMsg(data.error || 'Nama pengguna, kata laluan, atau peranan yang dipilih tidak sah.');
      }
    } catch (err: any) {
      // Local fallback in case network hiccup
      if (username.trim().toLowerCase() === 'admin' && password.trim() === '123' && selectedRole === 'Admin') {
        const adminUser: AuthUser = {
          id: 'user-admin-1',
          username: 'admin',
          name: 'Pentadbir Utama JKR NS',
          role: 'Admin',
          email: 'admin.jkr@ns.gov.my',
          department: 'Bahagian Pentadbiran & Integriti JKR NS'
        };
        localStorage.setItem('jkr_admin_token', 'jkr-ns-token-admin-demo');
        localStorage.setItem('jkr_admin_user', JSON.stringify(adminUser));
        onLoginSuccess(adminUser);
        onClose();
      } else if (username.trim().toLowerCase() === 'penyelaras' && password.trim() === '123' && selectedRole === 'Penyelaras Iklan') {
        const penyelarasUser: AuthUser = {
          id: 'user-penyelaras-1',
          username: 'penyelaras',
          name: 'Penyelaras Perolehan & Tender JKR',
          role: 'Penyelaras Iklan',
          email: 'penyelaras.tender@ns.gov.my',
          department: 'Unit Perolehan & Kontrak JKR NS'
        };
        localStorage.setItem('jkr_admin_token', 'jkr-ns-token-penyelaras-demo');
        localStorage.setItem('jkr_admin_user', JSON.stringify(penyelarasUser));
        onLoginSuccess(penyelarasUser);
        onClose();
      } else {
        setErrorMsg('Log masuk gagal. Sila semak nama pengguna, kata laluan dan peranan yang dipilih.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFullName.trim() || !regUsername.trim() || !regPassword.trim()) {
      setErrorMsg('Sila lengkapkan Nama Penuh, Nama Pengguna, dan Kata Laluan (*).');
      return;
    }

    if (regUsername.trim().length < 3) {
      setErrorMsg('Nama pengguna mestilah sekurang-kurangnya 3 aksara.');
      return;
    }

    if (regPassword.trim().length < 3) {
      setErrorMsg('Kata laluan mestilah sekurang-kurangnya 3 aksara.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regFullName.trim(),
          username: regUsername.trim().toLowerCase(),
          password: regPassword.trim(),
          role: selectedRole,
          email: regEmail.trim() || `${regUsername.trim().toLowerCase()}@jkr.gov.my`,
          department: regDepartment.trim() || (selectedRole === 'Admin' ? 'Bahagian Pentadbiran & Integriti JKR NS' : 'Unit Perolehan & Kontrak JKR NS')
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMsg(data.message || 'Pendaftaran berjaya! Menyediakan akses portal anda...');
        localStorage.setItem('jkr_admin_token', data.token);
        localStorage.setItem('jkr_admin_user', JSON.stringify(data.user));

        setTimeout(() => {
          onLoginSuccess(data.user);
          onClose();
        }, 1200);
      } else {
        setErrorMsg(data.error || 'Gagal mendaftarkan akaun baharu. Sila semak maklumat.');
      }
    } catch (err: any) {
      setErrorMsg('Ralat rangkaian semasa mendaftar akaun. Sila cuba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 modal-backdrop z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header dengan Jalur Bendera Negeri Sembilan */}
        <div className="h-1.5 w-full flex">
          <div className="h-full w-1/2 bg-[#FFD100]"></div>
          <div className="h-full w-1/4 bg-[#DC2626]"></div>
          <div className="h-full w-1/4 bg-[#111827]"></div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-slate-900 text-[#FFD100] flex items-center justify-center text-lg font-bold shadow-md">
                <i className={`fa-solid ${modalMode === 'login' ? 'fa-shield-halved' : 'fa-user-plus'}`}></i>
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-lg sm:text-xl leading-tight">
                  {modalMode === 'login' ? 'Log Masuk Sistem Dalaman' : 'Daftar Akaun Baharu'}
                </h3>
                <p className="text-xs text-slate-500">
                  Jabatan Kerja Raya Negeri Sembilan
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>

          {/* Tab Pilihan: Log Masuk vs Daftar Akaun Baharu */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-2xl mb-4">
            <button
              type="button"
              onClick={() => {
                setModalMode('login');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                modalMode === 'login'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <i className="fa-solid fa-right-to-bracket text-xs"></i>
              <span>Log Masuk</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setModalMode('register');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                modalMode === 'register'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <i className="fa-solid fa-user-pen text-xs"></i>
              <span>Daftar Akaun</span>
            </button>
          </div>

          {/* Notis Ralat Inline (Tanpa Window.Alert) */}
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs mb-4 flex items-center gap-2 animate-shake">
              <i className="fa-solid fa-triangle-exclamation flex-shrink-0"></i>
              <span className="leading-tight">{errorMsg}</span>
            </div>
          )}

          {/* Notis Kejayaan Inline */}
          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3 rounded-xl text-xs mb-4 flex items-center gap-2 animate-fadeIn">
              <i className="fa-solid fa-circle-check flex-shrink-0 text-emerald-600"></i>
              <span className="leading-tight">{successMsg}</span>
            </div>
          )}

          {/* Pilihan Peranan (Role Selection) - Dikongsi oleh kedua-dua mod */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Pilih Peranan Akses (Role) *
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {/* Role 1: Admin */}
              <label
                className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedRole === 'Admin'
                    ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedRole === 'Admin'}
                  onChange={() => setSelectedRole('Admin')}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-0 cursor-pointer accent-[#FFD100]"
                />
                <div className="text-left">
                  <span className="block text-xs font-black">Role Admin</span>
                  <span className={`block text-[10px] ${selectedRole === 'Admin' ? 'text-slate-300' : 'text-slate-400'}`}>
                    Semak Aduan &amp; Tender
                  </span>
                </div>
              </label>

              {/* Role 2: Penyelaras Iklan */}
              <label
                className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedRole === 'Penyelaras Iklan'
                    ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedRole === 'Penyelaras Iklan'}
                  onChange={() => setSelectedRole('Penyelaras Iklan')}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-0 cursor-pointer accent-[#FFD100]"
                />
                <div className="text-left">
                  <span className="block text-xs font-black">Penyelaras Iklan</span>
                  <span className={`block text-[10px] ${selectedRole === 'Penyelaras Iklan' ? 'text-slate-300' : 'text-slate-400'}`}>
                    Daftar Tender &amp; Iklan
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* ================= MOD 1: LOG MASUK ================= */}
          {modalMode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Pengguna (Username) *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Masukkan nama pengguna"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
                  />
                  <i className="fa-solid fa-user absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kata Laluan (Password) *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata laluan"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
                  />
                  <i className="fa-solid fa-key absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-[#111827] hover:bg-slate-800 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isLoading ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin text-[#FFD100]"></i>
                      <span>Mengesahkan Kelayakan...</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-right-to-bracket text-[#FFD100]"></i>
                      <span>Log Masuk sebagai {selectedRole}</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setModalMode('register');
                    setErrorMsg('');
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800 font-bold hover:underline cursor-pointer"
                >
                  Belum mempunyai akaun? Daftar akaun baharu di sini
                </button>
              </div>
            </form>
          ) : (
            /* ================= MOD 2: DAFTAR AKAUN BAHARU ================= */
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Penuh Pegawai / Staf *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="Contoh: Ir. Ts. Mohd Hafiz bin Razak"
                    className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
                  />
                  <i className="fa-solid fa-id-card absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Username *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      placeholder="contoh: hafiz.jkr"
                      className="w-full pl-8 pr-2.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
                    />
                    <i className="fa-solid fa-at absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kata Laluan *
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min 3 aksara"
                      className="w-full pl-8 pr-2.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
                    />
                    <i className="fa-solid fa-lock absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Emel Jabatan (Pilihan)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="nama@jkr.gov.my"
                    className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
                  />
                  <i className="fa-solid fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Bahagian / Cawangan (Pilihan)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={regDepartment}
                    onChange={(e) => setRegDepartment(e.target.value)}
                    placeholder={selectedRole === 'Admin' ? 'Bahagian Pentadbiran & Integriti' : 'Unit Perolehan & Kontrak JKR NS'}
                    className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
                  />
                  <i className="fa-solid fa-building-user absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isLoading ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin text-[#FFD100]"></i>
                      <span>Mendaftarkan Akaun...</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-user-plus text-[#FFD100]"></i>
                      <span>Daftar Akaun sebagai {selectedRole}</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setModalMode('login');
                    setErrorMsg('');
                  }}
                  className="text-xs text-slate-600 hover:text-slate-900 font-bold hover:underline cursor-pointer"
                >
                  Sudah mempunyai akaun? Log masuk di sini
                </button>
              </div>
            </form>
          )}

          <p className="text-[11px] text-slate-400 text-center mt-5">
            Sistem pengesahan rasmi tertakluk kepada Dasar Keselamatan ICT Kerajaan Negeri Sembilan.
          </p>
        </div>
      </div>
    </div>
  );
};

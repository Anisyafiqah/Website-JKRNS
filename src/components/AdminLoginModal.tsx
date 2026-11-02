import React, { useState } from 'react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('jkr_admin_token', data.token);
        localStorage.setItem('jkr_admin_user', JSON.stringify(data.user));
        onLoginSuccess();
        onClose();
      } else {
        setErrorMsg(data.error || 'Nama pengguna atau kata laluan tidak sah.');
      }
    } catch (err: any) {
      // Fallback local check
      if (username === 'admin' && password === '123') {
        localStorage.setItem('jkr_admin_token', 'jkr-ns-admin-session-token-2026');
        onLoginSuccess();
        onClose();
      } else {
        setErrorMsg('Ralat menyambung ke pelayan pengesahan. Sila cuba lagi.');
      }
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
        {/* Header dengan Jalur Negeri Sembilan */}
        <div className="h-1.5 w-full flex">
          <div className="h-full w-1/2 bg-[#FFD100]"></div>
          <div className="h-full w-1/4 bg-[#DC2626]"></div>
          <div className="h-full w-1/4 bg-[#111827]"></div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-[#FFD100] flex items-center justify-center text-lg font-bold shadow-md">
                <i className="fa-solid fa-lock"></i>
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-lg sm:text-xl">
                  Portal Pentadbir JKR NS
                </h3>
                <p className="text-xs text-slate-500">
                  Modul Kawalan &amp; Pengurusan e-Aduan
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

          {/* Info Kredensial Rasmi */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 text-xs text-amber-900 flex items-start gap-2.5">
            <i className="fa-solid fa-circle-info text-amber-600 mt-0.5 text-sm"></i>
            <div>
              <span className="font-bold block">Akaun Akses Pentadbir:</span>
              <div className="font-mono mt-0.5 text-[11px] text-amber-800 space-y-0.5">
                <div>Nama Pengguna: <span className="font-bold text-slate-900 bg-amber-100/80 px-1.5 py-0.2 rounded">admin</span></div>
                <div>Kata Laluan: <span className="font-bold text-slate-900 bg-amber-100/80 px-1.5 py-0.2 rounded">123</span></div>
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs mb-4 flex items-center gap-2">
              <i className="fa-solid fa-triangle-exclamation"></i>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Pengguna (Username)
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
                />
                <i className="fa-solid fa-user absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kata Laluan (Password)
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="123"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
                />
                <i className="fa-solid fa-key absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#111827] hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin text-[#FFD100]"></i>
                    <span>Mengesahkan Maklumat...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-right-to-bracket text-[#FFD100]"></i>
                    <span>Log Masuk Pentadbir</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <p className="text-[11px] text-slate-400 text-center mt-4">
            Akses sistem ini terhad kepada pegawai Jabatan Kerja Raya Negeri Sembilan yang diberi kuasa sahaja.
          </p>
        </div>
      </div>
    </div>
  );
};

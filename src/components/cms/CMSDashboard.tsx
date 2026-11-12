/**
 * Dedicated CMS Admin Dashboard
 * Full graphical content management interface for JKR Negeri Sembilan Portal.
 */

import React, { useState, useEffect, useRef } from 'react';
import { CMSContent } from '../../data/defaultCmsContent';
import { CMSUser } from './CMSLoginPage';
import { JataNegeriSembilan, JkrLogo } from '../Logos';

interface CMSDashboardProps {
  currentUser: CMSUser;
  onLogout: () => void;
  onViewPublicSite: () => void;
  onContentUpdated?: () => void;
}

type CMSTab =
  | 'overview'
  | 'home'
  | 'profil'
  | 'bahagian'
  | 'kontraktor'
  | 'downloads'
  | 'warga'
  | 'media'
  | 'settings'
  | 'admins'
  | 'audit';

interface MediaFile {
  name: string;
  url: string;
  size: string;
  updatedAt: string;
}

interface AuditEntry {
  id: string;
  action: string;
  section: string;
  user: string;
  timestamp: string;
  details?: string;
}

interface AdminRecord {
  id: string;
  username: string;
  name: string;
  role: 'Super Administrator' | 'Administrator';
  email: string;
  department: string;
  status: 'Aktif' | 'Tidak Aktif';
  createdAt: string;
}

export const CMSDashboard: React.FC<CMSDashboardProps> = ({
  currentUser,
  onLogout,
  onViewPublicSite
}) => {
  // Navigation tab
  const [activeTab, setActiveTab] = useState<CMSTab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // CMS Content State
  const [content, setContent] = useState<CMSContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Sub-tabs for complex modules
  const [homeSubTab, setHomeSubTab] = useState<'slides' | 'notice' | 'gateways' | 'audience'>('slides');
  const [profilSubTab, setProfilSubTab] = useState<'perutusan' | 'visimisi' | 'fungsi' | 'carta' | 'piagam' | 'sejarah'>('perutusan');
  const [bahagianSubTab, setBahagianSubTab] = useState<'hq' | 'districts' | 'staff'>('hq');

  // Media files state
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Audit logs state
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);

  // Admins management state
  const [adminsList, setAdminsList] = useState<AdminRecord[]>([]);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [newAdminData, setNewAdminData] = useState({
    username: '',
    password: '',
    name: '',
    role: 'Administrator' as 'Super Administrator' | 'Administrator',
    email: '',
    department: 'Bahagian Komunikasi Korporat'
  });

  // Password change modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    open: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  // Toast auto-clear
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  // Fetch full CMS content from backend
  const fetchCmsContent = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/cms/content');
      const json = await res.json();
      if (res.ok && json.success && json.data) {
        setContent(json.data);
      } else {
        showToast('Gagal memuat turun data kandungan dari pelayan.', 'error');
      }
    } catch (err: any) {
      showToast(err?.message || 'Ralat sambungan pelayan CMS.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Media List
  const fetchMediaList = async () => {
    try {
      const res = await fetch('/api/cms/media/list');
      const json = await res.json();
      if (res.ok && json.success && Array.isArray(json.files)) {
        setMediaFiles(json.files);
      }
    } catch (err) {
      console.warn('Failed fetching media:', err);
    }
  };

  // Fetch Audit Logs
  const fetchAuditLogs = async () => {
    try {
      const res = await fetch('/api/cms/audit');
      const json = await res.json();
      if (res.ok && json.success && Array.isArray(json.data)) {
        setAuditLogs(json.data);
      }
    } catch (err) {
      console.warn('Failed fetching audit:', err);
    }
  };

  // Fetch Admins List
  const fetchAdminsList = async () => {
    try {
      const res = await fetch('/api/cms/admins');
      const json = await res.json();
      if (res.ok && json.success && Array.isArray(json.data)) {
        setAdminsList(json.data);
      }
    } catch (err) {
      console.warn('Failed fetching admins:', err);
    }
  };

  useEffect(() => {
    fetchCmsContent();
    fetchMediaList();
    fetchAuditLogs();
    if (currentUser.role === 'Super Administrator') {
      fetchAdminsList();
    }
  }, [currentUser]);

  // Save specific section
  const handleSaveSection = async (sectionKey: keyof CMSContent, customData?: any) => {
    if (!content) return;
    setIsSaving(true);
    try {
      const payload = customData !== undefined ? customData : content[sectionKey];
      const res = await fetch(`/api/cms/content/${sectionKey}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: payload,
          user: `${currentUser.name} (${currentUser.role})`
        })
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showToast(`Bahagian "${sectionKey}" berjaya disimpan!`, 'success');
        await fetchCmsContent();
        await fetchAuditLogs();
      } else {
        throw new Error(json.error || 'Gagal menyimpan perubahan.');
      }
    } catch (err: any) {
      showToast(err?.message || 'Ralat semasa menyimpan.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Publish all changes to live public site
  const handlePublishAll = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/cms/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: `${currentUser.name} (${currentUser.role})`,
          notes: 'Menerbitkan semua suntingan kandungan portal'
        })
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showToast('Semua perubahan kandungan telah diterbitkan secara langsung ke portal awam!', 'success');
        await fetchCmsContent();
        await fetchAuditLogs();
      } else {
        throw new Error(json.error || 'Gagal menerbitkan kandungan.');
      }
    } catch (err: any) {
      showToast(err?.message || 'Ralat penerbitan.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Media file upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingMedia(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        const res = await fetch('/api/cms/media/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dataUrl: base64Data,
            filename: file.name,
            mimeType: file.type
          })
        });

        const json = await res.json();
        if (res.ok && json.success) {
          showToast(`Fail "${file.name}" berjaya dimuat naik!`, 'success');
          await fetchMediaList();
          await fetchAuditLogs();
        } else {
          showToast(json.error || 'Gagal memuat naik fail.', 'error');
        }
        setIsUploadingMedia(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      showToast(err?.message || 'Ralat muat naik fail.', 'error');
      setIsUploadingMedia(false);
    }
  };

  // Create new CMS Administrator (Super Admin only)
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminData.username || !newAdminData.password || !newAdminData.name) {
      showToast('Sila lengkapkan semua maklumat pentadbir bertanda (*).', 'error');
      return;
    }

    try {
      const res = await fetch('/api/cms/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAdminData)
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showToast(`Pentadbir "${newAdminData.name}" berjaya didaftarkan!`, 'success');
        setShowAddAdminModal(false);
        setNewAdminData({
          username: '',
          password: '',
          name: '',
          role: 'Administrator',
          email: '',
          department: 'Bahagian Komunikasi Korporat'
        });
        await fetchAdminsList();
        await fetchAuditLogs();
      } else {
        showToast(json.error || 'Gagal mendaftar pentadbir.', 'error');
      }
    } catch (err: any) {
      showToast(err?.message || 'Ralat pelayan.', 'error');
    }
  };

  // Change current password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (newPassword !== confirmPassword) {
      setPasswordError('Kata laluan baharu dan pengesahan tidak sepadan.');
      return;
    }

    if (newPassword.length < 3) {
      setPasswordError('Kata laluan mestilah sekurang-kurangnya 3 aksara.');
      return;
    }

    try {
      const res = await fetch('/api/cms/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: currentUser.username,
          currentPassword,
          newPassword
        })
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showToast('Kata laluan berjaya dikemaskini!', 'success');
        setShowPasswordModal(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        await fetchAuditLogs();
      } else {
        setPasswordError(json.error || 'Gagal mengemaskini kata laluan.');
      }
    } catch (err: any) {
      setPasswordError(err?.message || 'Ralat pelayan.');
    }
  };

  // Reset all to defaults with double confirmation
  const handleResetToDefaults = () => {
    setDeleteModal({
      open: true,
      title: 'Tetapan Semula Kandungan Penuh?',
      message: 'PERINGATAN: Tindakan ini akan mengembalikan semua teks, slaid, notis, maklumat bahagian, dan direktori kepada pratetap asal JKR NS. Sebarang perubahan tidak disimpan akan hilang.',
      onConfirm: async () => {
        try {
          const res = await fetch('/api/cms/reset', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: `${currentUser.name} (${currentUser.role})` })
          });
          const json = await res.json();
          if (res.ok && json.success) {
            showToast('Kandungan telah ditetapkan semula kepada pratetap rasmi.', 'info');
            await fetchCmsContent();
            await fetchAuditLogs();
          }
        } catch (err) {
          showToast('Ralat penetapan semula.', 'error');
        } finally {
          setDeleteModal((prev) => ({ ...prev, open: false }));
        }
      }
    });
  };

  if (isLoading || !content) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white font-sans">
        <div className="w-14 h-14 rounded-2xl bg-[#FFD100] text-slate-950 flex items-center justify-center text-2xl animate-bounce mb-4 shadow-xl">
          <i className="fa-solid fa-cube"></i>
        </div>
        <h2 className="text-xl font-bold tracking-tight">Memuatkan Papan Pemuka CMS...</h2>
        <p className="text-xs text-slate-400 mt-1">Menyambung ke pangkalan data kandungan JKR Negeri Sembilan</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
      {/* ================= TOP NAVIGATION BAR ================= */}
      <header className="bg-slate-900 text-white sticky top-0 z-40 border-b border-slate-800 shadow-md">
        {/* Flag Bar */}
        <div className="h-1 w-full flex">
          <div className="h-full w-1/2 bg-[#FFD100]"></div>
          <div className="h-full w-1/4 bg-[#DC2626]"></div>
          <div className="h-full w-1/4 bg-[#111827]"></div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer"
            >
              <i className="fa-solid fa-bars text-lg"></i>
            </button>

            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5 p-1 bg-white rounded-lg border border-slate-700">
                <JataNegeriSembilan className="h-7 w-auto" />
                <div className="h-5 w-px bg-slate-200"></div>
                <JkrLogo className="h-7 w-auto" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm sm:text-base font-black text-white tracking-wide">
                    CMS JKR NEGERI SEMBILAN
                  </h1>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-[#FFD100] border border-[#FFD100]/30 uppercase">
                    Admin GUI
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 block -mt-0.5">
                  Content Management &amp; Publishing Portal
                </span>
              </div>
            </div>
          </div>

          {/* Action Tools & User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* View Live Public Site Button */}
            <button
              type="button"
              onClick={onViewPublicSite}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-[#FFD100] rounded-xl text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
              title="Lihat Laman Awam Langsung"
            >
              <i className="fa-solid fa-arrow-up-right-from-square text-[11px] text-[#FFD100]"></i>
              <span className="hidden md:inline">Pratonton Laman Awam</span>
            </button>

            {/* Publish Changes Button */}
            <button
              type="button"
              onClick={handlePublishAll}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-900/30 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin text-xs"></i>
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-cloud-arrow-up text-xs"></i>
                  <span>Terbitkan Semua</span>
                </>
              )}
            </button>

            {/* User Dropdown / Profile Badge */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-700">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-white leading-tight">{currentUser.name}</span>
                <span className="text-[10px] font-semibold text-amber-400">
                  {currentUser.role}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setShowPasswordModal(true)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-[#FFD100] text-xs transition-colors cursor-pointer"
                title="Tukar Kata Laluan & Profil"
              >
                <i className="fa-solid fa-key"></i>
              </button>

              <button
                type="button"
                onClick={onLogout}
                className="w-8 h-8 rounded-xl bg-red-950/70 hover:bg-red-800 border border-red-800 flex items-center justify-center text-red-200 text-xs transition-colors cursor-pointer"
                title="Log Keluar CMS"
              >
                <i className="fa-solid fa-power-off"></i>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ================= MAIN CMS LAYOUT (SIDEBAR + CONTENT) ================= */}
      <div className="flex-1 flex w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6 relative">
        {/* Sidebar Navigation */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white lg:bg-transparent rounded-2xl shadow-xl lg:shadow-none p-4 lg:p-0 flex flex-col justify-between transition-transform duration-300 border lg:border-none border-slate-200 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="space-y-1">
            <div className="px-3 py-2 text-[11px] font-black text-slate-400 uppercase tracking-widest">
              Modul Kandungan Portal
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveTab('overview');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-slate-900 text-[#FFD100] shadow-md shadow-slate-900/10'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              <i className="fa-solid fa-chart-pie text-sm w-4"></i>
              <span>Ringkasan / Overview</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('home');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-slate-900 text-[#FFD100] shadow-md shadow-slate-900/10'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              <i className="fa-solid fa-house text-sm w-4 text-red-500"></i>
              <span>Laman Utama (Home)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('profil');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'profil'
                  ? 'bg-slate-900 text-[#FFD100] shadow-md shadow-slate-900/10'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              <i className="fa-solid fa-landmark text-sm w-4 text-amber-500"></i>
              <span>Profil Korporat</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('bahagian');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'bahagian'
                  ? 'bg-slate-900 text-[#FFD100] shadow-md shadow-slate-900/10'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              <i className="fa-solid fa-sitemap text-sm w-4 text-blue-500"></i>
              <span>Bahagian &amp; Pejabat Daerah</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('kontraktor');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'kontraktor'
                  ? 'bg-slate-900 text-[#FFD100] shadow-md shadow-slate-900/10'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              <i className="fa-solid fa-file-contract text-sm w-4 text-purple-500"></i>
              <span>Kontraktor &amp; Perolehan</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('downloads');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'downloads'
                  ? 'bg-slate-900 text-[#FFD100] shadow-md shadow-slate-900/10'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              <i className="fa-solid fa-folder-open text-sm w-4 text-cyan-500"></i>
              <span>Pusat Muat Turun</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('warga');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'warga'
                  ? 'bg-slate-900 text-[#FFD100] shadow-md shadow-slate-900/10'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              <i className="fa-solid fa-users-gear text-sm w-4 text-emerald-500"></i>
              <span>Warga JKRNS</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('media');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'media'
                  ? 'bg-slate-900 text-[#FFD100] shadow-md shadow-slate-900/10'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              <i className="fa-solid fa-photo-film text-sm w-4 text-yellow-500"></i>
              <span>Galeri Media &amp; Imej</span>
            </button>

            <div className="pt-3 px-3 py-1 text-[11px] font-black text-slate-400 uppercase tracking-widest">
              Sistem &amp; Keselamatan
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveTab('settings');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-slate-900 text-[#FFD100] shadow-md shadow-slate-900/10'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              <i className="fa-solid fa-sliders text-sm w-4 text-slate-500"></i>
              <span>Tetapan Portal &amp; Footer</span>
            </button>

            {currentUser.role === 'Super Administrator' && (
              <button
                type="button"
                onClick={() => {
                  setActiveTab('admins');
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'admins'
                    ? 'bg-slate-900 text-[#FFD100] shadow-md shadow-slate-900/10'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                }`}
              >
                <i className="fa-solid fa-user-shield text-sm w-4 text-indigo-500"></i>
                <span>Pengurusan Pentadbir</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setActiveTab('audit');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'audit'
                  ? 'bg-slate-900 text-[#FFD100] shadow-md shadow-slate-900/10'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              <i className="fa-solid fa-clock-rotate-left text-sm w-4 text-teal-500"></i>
              <span>Log Audit Aktiviti</span>
            </button>
          </div>

          {/* Reset System Action */}
          <div className="pt-4 mt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={handleResetToDefaults}
              className="w-full py-2 px-3 rounded-xl text-[11px] font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <i className="fa-solid fa-rotate-left"></i>
              <span>Kembalikan Kandungan Asal</span>
            </button>
          </div>
        </aside>

        {/* Backdrop for mobile sidebar */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          ></div>
        )}

        {/* ================= CONTENT AREA ================= */}
        <main className="flex-1 min-w-0">
          {/* Toast Notification */}
          {toast && (
            <div
              className={`mb-4 p-3.5 rounded-2xl border text-xs font-bold flex items-center justify-between shadow-lg animate-fadeIn ${
                toast.type === 'success'
                  ? 'bg-emerald-950/90 text-emerald-100 border-emerald-700'
                  : toast.type === 'error'
                  ? 'bg-red-950/90 text-red-100 border-red-700'
                  : 'bg-slate-900 text-amber-300 border-amber-600'
              }`}
            >
              <div className="flex items-center gap-2">
                <i
                  className={`fa-solid ${
                    toast.type === 'success'
                      ? 'fa-circle-check text-emerald-400'
                      : toast.type === 'error'
                      ? 'fa-circle-exclamation text-red-400'
                      : 'fa-circle-info text-amber-400'
                  }`}
                ></i>
                <span>{toast.message}</span>
              </div>
              <button
                type="button"
                onClick={() => setToast(null)}
                className="text-slate-400 hover:text-white"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          )}

          {/* ================= TAB 1: OVERVIEW / RINGKASAN ================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Welcome Header */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
                <div className="relative z-10 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD100]/20 text-[#FFD100] text-xs font-bold uppercase tracking-wider mb-2">
                    <i className="fa-solid fa-circle-check"></i>
                    <span>Sistem Aktif &amp; Terpelihara</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                    Selamat Datang, {currentUser.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                    Papan Pemuka CMS JKR Negeri Sembilan membolehkan anda menguruskan teks, imej, maklumat bahagian, dokumen pekeliling, dan direktori tanpa mengubah kod sumber.
                  </p>
                  <div className="flex flex-wrap gap-3 mt-5">
                    <button
                      type="button"
                      onClick={() => setActiveTab('home')}
                      className="px-4 py-2 bg-[#FFD100] text-slate-950 font-bold rounded-xl text-xs hover:bg-yellow-400 transition-colors flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      <i className="fa-solid fa-pen-to-square"></i>
                      <span>Sunting Laman Utama</span>
                    </button>
                    <button
                      type="button"
                      onClick={onViewPublicSite}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-2 cursor-pointer border border-white/20"
                    >
                      <i className="fa-solid fa-globe text-[#FFD100]"></i>
                      <span>Lihat Portal Awam</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    Slaid Hero
                  </span>
                  <div className="text-2xl font-black text-slate-900 mt-1">
                    {content.homeHeroSlides?.length || 0}
                  </div>
                  <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                    <i className="fa-solid fa-circle text-[8px]"></i>
                    <span>{content.homeHeroSlides?.filter((s) => s.status === 'published').length} Diterbitkan</span>
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    Pejabat Daerah
                  </span>
                  <div className="text-2xl font-black text-slate-900 mt-1">
                    {content.bahagianCawangan?.districts?.length || 7}
                  </div>
                  <span className="text-xs text-blue-600 font-semibold flex items-center gap-1 mt-1">
                    <i className="fa-solid fa-building text-[10px]"></i>
                    <span>Semua Aktif</span>
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    Direktori Staf
                  </span>
                  <div className="text-2xl font-black text-slate-900 mt-1">
                    {content.bahagianCawangan?.staffDirectory?.length || 0}
                  </div>
                  <span className="text-xs text-purple-600 font-semibold flex items-center gap-1 mt-1">
                    <i className="fa-solid fa-users text-[10px]"></i>
                    <span>Kakitangan JKR</span>
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    Dokumen &amp; Borang
                  </span>
                  <div className="text-2xl font-black text-slate-900 mt-1">
                    {content.downloads?.length || 0}
                  </div>
                  <span className="text-xs text-amber-600 font-semibold flex items-center gap-1 mt-1">
                    <i className="fa-solid fa-download text-[10px]"></i>
                    <span>Muat Turun Aktif</span>
                  </span>
                </div>
              </div>

              {/* Quick Actions & Recent Activities */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <i className="fa-solid fa-bolt text-[#DC2626]"></i>
                    <span>Tindakan Pantas CMS</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('home');
                        setHomeSubTab('notice');
                      }}
                      className="p-4 rounded-2xl border border-slate-200 hover:border-red-400 hover:bg-red-50/50 transition-all text-left flex items-start gap-3 cursor-pointer group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-red-100 text-[#DC2626] flex items-center justify-center font-bold text-base flex-shrink-0 group-hover:scale-105 transition-transform">
                        <i className="fa-solid fa-triangle-exclamation"></i>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#DC2626]">
                          Kemaskini Notis Jalan
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Ubah amaran penutupan laluan atau lencongan semasa.
                        </p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('profil');
                        setProfilSubTab('perutusan');
                      }}
                      className="p-4 rounded-2xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 transition-all text-left flex items-start gap-3 cursor-pointer group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-base flex-shrink-0 group-hover:scale-105 transition-transform">
                        <i className="fa-solid fa-user-tie"></i>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-800">
                          Perutusan Pengarah
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Tukar foto, petikan ucapan atau teks amanat Pengarah.
                        </p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('bahagian');
                        setBahagianSubTab('staff');
                      }}
                      className="p-4 rounded-2xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all text-left flex items-start gap-3 cursor-pointer group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-base flex-shrink-0 group-hover:scale-105 transition-transform">
                        <i className="fa-solid fa-address-book"></i>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-800">
                          Tambah / Edit Kakitangan
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Kemaskini nombor telefon pegawai dan jawatan bahagian.
                        </p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('downloads')}
                      className="p-4 rounded-2xl border border-slate-200 hover:border-cyan-400 hover:bg-cyan-50/50 transition-all text-left flex items-start gap-3 cursor-pointer group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold text-base flex-shrink-0 group-hover:scale-105 transition-transform">
                        <i className="fa-solid fa-file-arrow-up"></i>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-cyan-800">
                          Muat Naik Borang Baharu
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Tambah permit utiliti, pekeliling, atau dokumen PDF.
                        </p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Audit Feed */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <i className="fa-solid fa-clock-rotate-left text-slate-500"></i>
                      <span>Aktiviti Terkini</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab('audit')}
                      className="text-xs font-bold text-[#DC2626] hover:underline cursor-pointer"
                    >
                      Semua
                    </button>
                  </div>

                  <div className="space-y-3">
                    {auditLogs.slice(0, 5).map((log) => (
                      <div key={log.id} className="text-xs border-b border-slate-100 pb-2.5 last:border-0">
                        <div className="flex items-center justify-between text-slate-400 text-[10px]">
                          <span>{log.timestamp}</span>
                          <span className="font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                            {log.action}
                          </span>
                        </div>
                        <div className="font-bold text-slate-800 mt-0.5">{log.section}</div>
                        <div className="text-slate-500 text-[11px] truncate">{log.details || log.user}</div>
                      </div>
                    ))}
                    {auditLogs.length === 0 && (
                      <p className="text-xs text-slate-400 italic">Tiada rekod aktiviti terkini.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 2: LAMAN UTAMA (HOME) ================= */}
          {activeTab === 'home' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Pengurusan Laman Utama</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Uruskan slaid banner pergerakan, notis kecemasan jalan, dan gerbang perkhidmatan.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSaveSection('homeHeroSlides')}
                  disabled={isSaving}
                  className="px-4 py-2 bg-[#FFD100] hover:bg-yellow-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <i className="fa-solid fa-floppy-disk"></i>
                  <span>Simpan Perubahan</span>
                </button>
              </div>

              {/* Sub-tabs */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setHomeSubTab('slides')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    homeSubTab === 'slides' ? 'bg-slate-900 text-[#FFD100]' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <i className="fa-solid fa-images mr-1.5"></i>
                  Hero Slides ({content.homeHeroSlides?.length || 0})
                </button>
                <button
                  type="button"
                  onClick={() => setHomeSubTab('notice')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    homeSubTab === 'notice' ? 'bg-slate-900 text-[#FFD100]' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <i className="fa-solid fa-bullhorn mr-1.5 text-red-500"></i>
                  Notis Laluan Semasa
                </button>
                <button
                  type="button"
                  onClick={() => setHomeSubTab('gateways')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    homeSubTab === 'gateways' ? 'bg-slate-900 text-[#FFD100]' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <i className="fa-solid fa-cubes mr-1.5 text-amber-500"></i>
                  6 Kad Gerbang Modul
                </button>
                <button
                  type="button"
                  onClick={() => setHomeSubTab('audience')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    homeSubTab === 'audience' ? 'bg-slate-900 text-[#FFD100]' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <i className="fa-solid fa-users mr-1.5 text-blue-500"></i>
                  Kategori Pengguna (Awam/Kontraktor/Agensi)
                </button>
              </div>

              {/* --- SUBTAB: HERO SLIDES --- */}
              {homeSubTab === 'slides' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-semibold">
                      Senarai slaid carousel yang dipaparkan pada banner atas portal.
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const newSlide = {
                          id: `slide-${Date.now()}`,
                          badge: 'Hebahan Terkini JKR',
                          badgeEn: 'Latest Notice',
                          title: 'Tajuk Slaid Baharu &',
                          titleEn: 'New Slide Title &',
                          highlightText: 'Infrastruktur Negeri',
                          description: 'Penerangan ringkas mengenai projek atau pencapaian kejuruteraan JKR Negeri Sembilan.',
                          descriptionEn: 'Brief overview on infrastructure milestone in Negeri Sembilan.',
                          primaryButtonText: 'Ketahui Lanjut',
                          primaryButtonPage: 'profil',
                          secondaryButtonText: 'Buka Aduan',
                          secondaryButtonPage: 'aduan',
                          bgGradient: 'from-[#0B0F19] via-slate-900 to-amber-950/60',
                          status: 'published' as const,
                          order: (content.homeHeroSlides?.length || 0) + 1
                        };
                        setContent({
                          ...content,
                          homeHeroSlides: [...(content.homeHeroSlides || []), newSlide]
                        });
                        showToast('Slaid baharu telah ditambah ke senarai. Sila lengkapkan teks dan tekan Simpan.', 'info');
                      }}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-[#FFD100] font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                    >
                      <i className="fa-solid fa-plus"></i>
                      <span>Tambah Slaid Baharu</span>
                    </button>
                  </div>

                  <div className="space-y-6">
                    {content.homeHeroSlides?.map((slide, idx) => (
                      <div
                        key={slide.id}
                        className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4 relative"
                      >
                        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-slate-900 text-[#FFD100] text-xs font-bold flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <h4 className="font-bold text-sm text-slate-900">
                              {slide.title} {slide.highlightText}
                            </h4>
                          </div>

                          <div className="flex items-center gap-2">
                            <select
                              value={slide.status}
                              onChange={(e) => {
                                const updated = [...content.homeHeroSlides];
                                updated[idx].status = e.target.value as 'published' | 'draft';
                                setContent({ ...content, homeHeroSlides: updated });
                              }}
                              className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                                slide.status === 'published'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : 'bg-amber-50 text-amber-800 border-amber-300'
                              }`}
                            >
                              <option value="published">Diterbitkan (Published)</option>
                              <option value="draft">Draf (Draft)</option>
                            </select>

                            <button
                              type="button"
                              onClick={() => {
                                setDeleteModal({
                                  open: true,
                                  title: `Padam Slaid ${idx + 1}?`,
                                  message: 'Adakah anda pasti mahu memadamkan slaid ini dari banner utama?',
                                  onConfirm: () => {
                                    const filtered = content.homeHeroSlides.filter((s) => s.id !== slide.id);
                                    setContent({ ...content, homeHeroSlides: filtered });
                                    setDeleteModal((prev) => ({ ...prev, open: false }));
                                    showToast('Slaid dipadamkan.', 'info');
                                  }
                                });
                              }}
                              className="w-7 h-7 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 flex items-center justify-center text-xs transition-colors cursor-pointer"
                              title="Padam Slaid"
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                              Lencana (Badge)
                            </label>
                            <input
                              type="text"
                              value={slide.badge}
                              onChange={(e) => {
                                const updated = [...content.homeHeroSlides];
                                updated[idx].badge = e.target.value;
                                setContent({ ...content, homeHeroSlides: updated });
                              }}
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                              Teks Sorotan Warna Emas (Highlight)
                            </label>
                            <input
                              type="text"
                              value={slide.highlightText}
                              onChange={(e) => {
                                const updated = [...content.homeHeroSlides];
                                updated[idx].highlightText = e.target.value;
                                setContent({ ...content, homeHeroSlides: updated });
                              }}
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-amber-700"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                              Tajuk Utama (Bahasa Melayu)
                            </label>
                            <input
                              type="text"
                              value={slide.title}
                              onChange={(e) => {
                                const updated = [...content.homeHeroSlides];
                                updated[idx].title = e.target.value;
                                setContent({ ...content, homeHeroSlides: updated });
                              }}
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                              Tajuk Utama (English)
                            </label>
                            <input
                              type="text"
                              value={slide.titleEn || ''}
                              onChange={(e) => {
                                const updated = [...content.homeHeroSlides];
                                updated[idx].titleEn = e.target.value;
                                setContent({ ...content, homeHeroSlides: updated });
                              }}
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                              Penerangan Slaid (Description)
                            </label>
                            <textarea
                              rows={2}
                              value={slide.description}
                              onChange={(e) => {
                                const updated = [...content.homeHeroSlides];
                                updated[idx].description = e.target.value;
                                setContent({ ...content, homeHeroSlides: updated });
                              }}
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs leading-relaxed"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                              Teks Butang Utama &amp; Halaman
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={slide.primaryButtonText}
                                onChange={(e) => {
                                  const updated = [...content.homeHeroSlides];
                                  updated[idx].primaryButtonText = e.target.value;
                                  setContent({ ...content, homeHeroSlides: updated });
                                }}
                                className="w-2/3 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                              />
                              <select
                                value={slide.primaryButtonPage}
                                onChange={(e) => {
                                  const updated = [...content.homeHeroSlides];
                                  updated[idx].primaryButtonPage = e.target.value;
                                  setContent({ ...content, homeHeroSlides: updated });
                                }}
                                className="w-1/3 px-2 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                              >
                                <option value="kontraktor">Kontraktor</option>
                                <option value="aduan">e-Aduan</option>
                                <option value="profil">Profil</option>
                                <option value="bahagian">Bahagian</option>
                                <option value="muatturun">Muat Turun</option>
                                <option value="warga">Warga</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                              Imej Latar / URL Gambar (Pilihan)
                            </label>
                            <input
                              type="text"
                              value={slide.bgImage || ''}
                              onChange={(e) => {
                                const updated = [...content.homeHeroSlides];
                                updated[idx].bgImage = e.target.value;
                                setContent({ ...content, homeHeroSlides: updated });
                              }}
                              placeholder="URL imej atau pilih dari galeri media"
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* --- SUBTAB: NOTICE --- */}
              {homeSubTab === 'notice' && content.homeNotice && (
                <div className="space-y-4 animate-fadeIn max-w-3xl">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">Notis &amp; Amaran Laluan Semasa</h4>
                      <p className="text-xs text-slate-500">Dipaparkan secara menonjol di laman utama untuk keselamatan orang awam.</p>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <span className="text-xs font-bold text-slate-700">Papar di Laman:</span>
                      <input
                        type="checkbox"
                        checked={content.homeNotice.active}
                        onChange={(e) => {
                          setContent({
                            ...content,
                            homeNotice: { ...content.homeNotice, active: e.target.checked }
                          });
                        }}
                        className="w-4 h-4 rounded text-red-600 focus:ring-red-500"
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Tarikh Hebahan
                      </label>
                      <input
                        type="text"
                        value={content.homeNotice.date}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            homeNotice: { ...content.homeNotice, date: e.target.value }
                          })
                        }
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Lencana Notis
                      </label>
                      <input
                        type="text"
                        value={content.homeNotice.badge}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            homeNotice: { ...content.homeNotice, badge: e.target.value }
                          })
                        }
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-red-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Tajuk Amaran Penutupan / Kerja Jalan
                    </label>
                    <input
                      type="text"
                      value={content.homeNotice.title}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          homeNotice: { ...content.homeNotice, title: e.target.value }
                        })
                      }
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Penerangan Kerosakan / Kerja Cerun
                    </label>
                    <textarea
                      rows={3}
                      value={content.homeNotice.description}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          homeNotice: { ...content.homeNotice, description: e.target.value }
                        })
                      }
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Butiran Laluan Alternatif / Lencongan (Modal Popup)
                    </label>
                    <textarea
                      rows={3}
                      value={content.homeNotice.detourDetails}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          homeNotice: { ...content.homeNotice, detourDetails: e.target.value }
                        })
                      }
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs leading-relaxed"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => handleSaveSection('homeNotice')}
                      className="px-4 py-2 bg-slate-900 text-[#FFD100] font-bold rounded-xl text-xs hover:bg-slate-800 transition-colors"
                    >
                      Simpan Notis Laluan
                    </button>
                  </div>
                </div>
              )}

              {/* --- SUBTAB: GATEWAYS --- */}
              {homeSubTab === 'gateways' && (
                <div className="space-y-4 animate-fadeIn">
                  <h4 className="font-bold text-sm text-slate-900">6 Kad Gerbang Perkhidmatan Utama</h4>
                  <p className="text-xs text-slate-500">Kad navigasi utama pada laman hadapan untuk laluan terus ke modul sistem.</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {content.homeGateways?.map((gw, idx) => (
                      <div key={gw.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {gw.moduleNum}
                          </span>
                          <input
                            type="text"
                            value={gw.icon}
                            onChange={(e) => {
                              const updated = [...content.homeGateways];
                              updated[idx].icon = e.target.value;
                              setContent({ ...content, homeGateways: updated });
                            }}
                            title="Ikon FontAwesome"
                            className="text-xs px-2 py-0.5 border border-slate-300 rounded bg-white w-28 text-center"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Tajuk</label>
                          <input
                            type="text"
                            value={gw.title}
                            onChange={(e) => {
                              const updated = [...content.homeGateways];
                              updated[idx].title = e.target.value;
                              setContent({ ...content, homeGateways: updated });
                            }}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Penerangan</label>
                          <textarea
                            rows={3}
                            value={gw.description}
                            onChange={(e) => {
                              const updated = [...content.homeGateways];
                              updated[idx].description = e.target.value;
                              setContent({ ...content, homeGateways: updated });
                            }}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSaveSection('homeGateways')}
                    className="px-4 py-2 bg-slate-900 text-[#FFD100] font-bold rounded-xl text-xs hover:bg-slate-800 transition-colors"
                  >
                    Simpan Semua Gerbang Modul
                  </button>
                </div>
              )}

              {/* --- SUBTAB: AUDIENCE TABS --- */}
              {homeSubTab === 'audience' && (
                <div className="space-y-6 animate-fadeIn">
                  <h4 className="font-bold text-sm text-slate-900">Panduan Mengikut Kategori Pengguna</h4>

                  {/* Awam */}
                  <div className="p-4 rounded-2xl border border-slate-200 bg-red-50/30 space-y-3">
                    <h5 className="font-bold text-xs text-[#DC2626] uppercase">Kad Kategori: Orang Awam</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {content.homeAudienceTabs?.awamCards?.map((card, idx) => (
                        <div key={card.id} className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                          <input
                            type="text"
                            value={card.title}
                            onChange={(e) => {
                              const updated = { ...content.homeAudienceTabs };
                              updated.awamCards[idx].title = e.target.value;
                              setContent({ ...content, homeAudienceTabs: updated });
                            }}
                            className="w-full px-2 py-1 border border-slate-300 rounded text-xs font-bold"
                          />
                          <textarea
                            rows={3}
                            value={card.description}
                            onChange={(e) => {
                              const updated = { ...content.homeAudienceTabs };
                              updated.awamCards[idx].description = e.target.value;
                              setContent({ ...content, homeAudienceTabs: updated });
                            }}
                            className="w-full px-2 py-1 border border-slate-300 rounded text-[11px]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Kontraktor */}
                  <div className="p-4 rounded-2xl border border-slate-200 bg-amber-50/30 space-y-3">
                    <h5 className="font-bold text-xs text-amber-800 uppercase">Kad Kategori: Kontraktor &amp; Perunding</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {content.homeAudienceTabs?.kontraktorCards?.map((card, idx) => (
                        <div key={card.id} className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                          <input
                            type="text"
                            value={card.title}
                            onChange={(e) => {
                              const updated = { ...content.homeAudienceTabs };
                              updated.kontraktorCards[idx].title = e.target.value;
                              setContent({ ...content, homeAudienceTabs: updated });
                            }}
                            className="w-full px-2 py-1 border border-slate-300 rounded text-xs font-bold"
                          />
                          <textarea
                            rows={3}
                            value={card.description}
                            onChange={(e) => {
                              const updated = { ...content.homeAudienceTabs };
                              updated.kontraktorCards[idx].description = e.target.value;
                              setContent({ ...content, homeAudienceTabs: updated });
                            }}
                            className="w-full px-2 py-1 border border-slate-300 rounded text-[11px]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSaveSection('homeAudienceTabs')}
                    className="px-4 py-2 bg-slate-900 text-[#FFD100] font-bold rounded-xl text-xs hover:bg-slate-800 transition-colors"
                  >
                    Simpan Panduan Kategori
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 3: PROFIL KORPORAT ================= */}
          {activeTab === 'profil' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Pengurusan Profil Korporat</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Sunting ucapan amanat Pengarah JKRNS, Visi &amp; Misi, Carta Organisasi, dan Piagam Pelanggan.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSaveSection('profilKorporat')}
                  disabled={isSaving}
                  className="px-4 py-2 bg-[#FFD100] hover:bg-yellow-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <i className="fa-solid fa-floppy-disk"></i>
                  <span>Simpan Profil Korporat</span>
                </button>
              </div>

              {/* Sub-tabs */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setProfilSubTab('perutusan')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    profilSubTab === 'perutusan' ? 'bg-slate-900 text-[#FFD100]' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Perutusan Pengarah
                </button>
                <button
                  type="button"
                  onClick={() => setProfilSubTab('visimisi')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    profilSubTab === 'visimisi' ? 'bg-slate-900 text-[#FFD100]' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Visi &amp; Misi
                </button>
                <button
                  type="button"
                  onClick={() => setProfilSubTab('fungsi')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    profilSubTab === 'fungsi' ? 'bg-slate-900 text-[#FFD100]' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Fungsi Jabatan
                </button>
                <button
                  type="button"
                  onClick={() => setProfilSubTab('carta')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    profilSubTab === 'carta' ? 'bg-slate-900 text-[#FFD100]' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Carta Organisasi
                </button>
                <button
                  type="button"
                  onClick={() => setProfilSubTab('piagam')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    profilSubTab === 'piagam' ? 'bg-slate-900 text-[#FFD100]' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Piagam Pelanggan
                </button>
              </div>

              {/* --- SUBTAB: PERUTUSAN PENGARAH --- */}
              {profilSubTab === 'perutusan' && content.profilKorporat?.perutusan && (
                <div className="space-y-4 animate-fadeIn max-w-3xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Nama Pengarah JKR NS
                      </label>
                      <input
                        type="text"
                        value={content.profilKorporat.perutusan.pengarahName}
                        onChange={(e) => {
                          const updated = { ...content.profilKorporat };
                          updated.perutusan.pengarahName = e.target.value;
                          setContent({ ...content, profilKorporat: updated });
                        }}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Jawatan &amp; Gred
                      </label>
                      <input
                        type="text"
                        value={content.profilKorporat.perutusan.pengarahGrade}
                        onChange={(e) => {
                          const updated = { ...content.profilKorporat };
                          updated.perutusan.pengarahGrade = e.target.value;
                          setContent({ ...content, profilKorporat: updated });
                        }}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Petikan Amanat / Quote Utama
                    </label>
                    <input
                      type="text"
                      value={content.profilKorporat.perutusan.quote}
                      onChange={(e) => {
                        const updated = { ...content.profilKorporat };
                        updated.perutusan.quote = e.target.value;
                        setContent({ ...content, profilKorporat: updated });
                      }}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 italic"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      URL Foto Pengarah (Pilihan)
                    </label>
                    <input
                      type="text"
                      value={content.profilKorporat.perutusan.pengarahPhoto || ''}
                      onChange={(e) => {
                        const updated = { ...content.profilKorporat };
                        updated.perutusan.pengarahPhoto = e.target.value;
                        setContent({ ...content, profilKorporat: updated });
                      }}
                      placeholder="Masukkan URL foto atau muat naik melalui Galeri Media"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-bold text-slate-600 uppercase">
                        Perenggan Teks Perutusan
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = { ...content.profilKorporat };
                          updated.perutusan.paragraphs.push('Perenggan baharu...');
                          setContent({ ...content, profilKorporat: updated });
                        }}
                        className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                      >
                        + Tambah Perenggan
                      </button>
                    </div>

                    <div className="space-y-3">
                      {content.profilKorporat.perutusan.paragraphs.map((p, pIdx) => (
                        <div key={pIdx} className="flex gap-2">
                          <textarea
                            rows={3}
                            value={p}
                            onChange={(e) => {
                              const updated = { ...content.profilKorporat };
                              updated.perutusan.paragraphs[pIdx] = e.target.value;
                              setContent({ ...content, profilKorporat: updated });
                            }}
                            className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs leading-relaxed"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = { ...content.profilKorporat };
                              updated.perutusan.paragraphs = updated.perutusan.paragraphs.filter((_, i) => i !== pIdx);
                              setContent({ ...content, profilKorporat: updated });
                            }}
                            className="w-8 h-8 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 flex items-center justify-center text-xs self-start mt-1 cursor-pointer"
                            title="Padam Perenggan"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* --- SUBTAB: VISI MISI --- */}
              {profilSubTab === 'visimisi' && content.profilKorporat?.visiMisi && (
                <div className="space-y-4 animate-fadeIn max-w-3xl">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Pernyataan Visi Jabatan
                    </label>
                    <textarea
                      rows={2}
                      value={content.profilKorporat.visiMisi.visi}
                      onChange={(e) => {
                        const updated = { ...content.profilKorporat };
                        updated.visiMisi.visi = e.target.value;
                        setContent({ ...content, profilKorporat: updated });
                      }}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-bold text-slate-600 uppercase">
                        Prinsip Misi Jabatan
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = { ...content.profilKorporat };
                          updated.visiMisi.misi.push('Misi baharu...');
                          setContent({ ...content, profilKorporat: updated });
                        }}
                        className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                      >
                        + Tambah Misi
                      </button>
                    </div>

                    <div className="space-y-2">
                      {content.profilKorporat.visiMisi.misi.map((m, mIdx) => (
                        <div key={mIdx} className="flex gap-2">
                          <input
                            type="text"
                            value={m}
                            onChange={(e) => {
                              const updated = { ...content.profilKorporat };
                              updated.visiMisi.misi[mIdx] = e.target.value;
                              setContent({ ...content, profilKorporat: updated });
                            }}
                            className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = { ...content.profilKorporat };
                              updated.visiMisi.misi = updated.visiMisi.misi.filter((_, i) => i !== mIdx);
                              setContent({ ...content, profilKorporat: updated });
                            }}
                            className="w-8 h-8 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 flex items-center justify-center text-xs cursor-pointer"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* --- SUBTAB: CARTA ORGANISASI --- */}
              {profilSubTab === 'carta' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-slate-900">Senarai Pengurusan Tertinggi (Carta Organisasi)</h4>
                    <button
                      type="button"
                      onClick={() => {
                        const newLeader = {
                          id: `org-${Date.now()}`,
                          position: 'Ketua Unit Baharu',
                          name: 'Nama Pegawai',
                          level: 'division' as const
                        };
                        const updated = { ...content.profilKorporat };
                        updated.cartaOrganisasi.push(newLeader);
                        setContent({ ...content, profilKorporat: updated });
                      }}
                      className="px-3 py-1.5 bg-slate-900 text-[#FFD100] text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                    >
                      <i className="fa-solid fa-plus"></i>
                      <span>Tambah Pemimpin</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {content.profilKorporat?.cartaOrganisasi?.map((member, idx) => (
                      <div key={member.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-800 text-[#FFD100] flex items-center justify-center text-sm font-bold flex-shrink-0">
                          <i className="fa-solid fa-user-tie"></i>
                        </div>
                        <div className="flex-1 space-y-1">
                          <input
                            type="text"
                            value={member.position}
                            onChange={(e) => {
                              const updated = { ...content.profilKorporat };
                              updated.cartaOrganisasi[idx].position = e.target.value;
                              setContent({ ...content, profilKorporat: updated });
                            }}
                            className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs font-bold"
                          />
                          <input
                            type="text"
                            value={member.name}
                            onChange={(e) => {
                              const updated = { ...content.profilKorporat };
                              updated.cartaOrganisasi[idx].name = e.target.value;
                              setContent({ ...content, profilKorporat: updated });
                            }}
                            className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs text-slate-600"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = { ...content.profilKorporat };
                            updated.cartaOrganisasi = updated.cartaOrganisasi.filter((_, i) => i !== idx);
                            setContent({ ...content, profilKorporat: updated });
                          }}
                          className="w-7 h-7 rounded bg-red-100 hover:bg-red-200 text-red-700 flex items-center justify-center text-xs cursor-pointer"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* --- SUBTAB: PIAGAM PELANGGAN --- */}
              {profilSubTab === 'piagam' && (
                <div className="space-y-4 animate-fadeIn">
                  <h4 className="font-bold text-sm text-slate-900">Komitmen Piagam Pelanggan</h4>
                  <div className="space-y-3">
                    {content.profilKorporat?.piagamPelanggan?.map((p, idx) => (
                      <div key={p.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Perkhidmatan</label>
                          <input
                            type="text"
                            value={p.service}
                            onChange={(e) => {
                              const updated = { ...content.profilKorporat };
                              updated.piagamPelanggan[idx].service = e.target.value;
                              setContent({ ...content, profilKorporat: updated });
                            }}
                            className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs font-bold"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Komitmen Piagam</label>
                          <input
                            type="text"
                            value={p.commitment}
                            onChange={(e) => {
                              const updated = { ...content.profilKorporat };
                              updated.piagamPelanggan[idx].commitment = e.target.value;
                              setContent({ ...content, profilKorporat: updated });
                            }}
                            className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Tempoh &amp; Pencapaian</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={p.timeframe}
                              onChange={(e) => {
                                const updated = { ...content.profilKorporat };
                                updated.piagamPelanggan[idx].timeframe = e.target.value;
                                setContent({ ...content, profilKorporat: updated });
                              }}
                              className="w-1/2 px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                            />
                            <input
                              type="text"
                              value={p.complianceRate}
                              onChange={(e) => {
                                const updated = { ...content.profilKorporat };
                                updated.piagamPelanggan[idx].complianceRate = e.target.value;
                                setContent({ ...content, profilKorporat: updated });
                              }}
                              className="w-1/2 px-2 py-1 bg-white border border-slate-300 rounded text-xs font-bold text-emerald-600"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 4: BAHAGIAN & PEJABAT DAERAH ================= */}
          {activeTab === 'bahagian' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Bahagian &amp; Pejabat Daerah</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Pengurusan 10 Bahagian Ibu Pejabat, 7 Pejabat Daerah JKR, dan Senarai Kakitangan.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSaveSection('bahagianCawangan')}
                  disabled={isSaving}
                  className="px-4 py-2 bg-[#FFD100] hover:bg-yellow-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <i className="fa-solid fa-floppy-disk"></i>
                  <span>Simpan Bahagian &amp; Daerah</span>
                </button>
              </div>

              {/* Sub-tabs */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setBahagianSubTab('hq')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    bahagianSubTab === 'hq' ? 'bg-slate-900 text-[#FFD100]' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  10 Bahagian Ibu Pejabat
                </button>
                <button
                  type="button"
                  onClick={() => setBahagianSubTab('districts')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    bahagianSubTab === 'districts' ? 'bg-slate-900 text-[#FFD100]' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  7 Pejabat Daerah
                </button>
                <button
                  type="button"
                  onClick={() => setBahagianSubTab('staff')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    bahagianSubTab === 'staff' ? 'bg-slate-900 text-[#FFD100]' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Direktori Kakitangan ({content.bahagianCawangan?.staffDirectory?.length || 0})
                </button>
              </div>

              {/* --- SUBTAB: HQ DIVISIONS --- */}
              {bahagianSubTab === 'hq' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {content.bahagianCawangan?.hqDivisions?.map((hq, idx) => (
                      <div key={hq.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                            {hq.code}
                          </span>
                          <span className="text-xs text-slate-500 font-mono">{hq.phone}</span>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Nama Bahagian</label>
                          <input
                            type="text"
                            value={hq.name}
                            onChange={(e) => {
                              const updated = { ...content.bahagianCawangan };
                              updated.hqDivisions[idx].name = e.target.value;
                              setContent({ ...content, bahagianCawangan: updated });
                            }}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase">Ketua Bahagian</label>
                            <input
                              type="text"
                              value={hq.ketua}
                              onChange={(e) => {
                                const updated = { ...content.bahagianCawangan };
                                updated.hqDivisions[idx].ketua = e.target.value;
                                setContent({ ...content, bahagianCawangan: updated });
                              }}
                              className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase">Emel Rasmi</label>
                            <input
                              type="text"
                              value={hq.email}
                              onChange={(e) => {
                                const updated = { ...content.bahagianCawangan };
                                updated.hqDivisions[idx].email = e.target.value;
                                setContent({ ...content, bahagianCawangan: updated });
                              }}
                              className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* --- SUBTAB: 7 DISTRICTS --- */}
              {bahagianSubTab === 'districts' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {content.bahagianCawangan?.districts?.map((dist, idx) => (
                      <div key={dist.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm text-slate-900">{dist.name}</h4>
                          <span className="text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded font-bold">
                            {dist.coverageKm}
                          </span>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Jurutera Daerah</label>
                          <input
                            type="text"
                            value={dist.engineer}
                            onChange={(e) => {
                              const updated = { ...content.bahagianCawangan };
                              updated.districts[idx].engineer = e.target.value;
                              setContent({ ...content, bahagianCawangan: updated });
                            }}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase">No. Telefon</label>
                            <input
                              type="text"
                              value={dist.phone}
                              onChange={(e) => {
                                const updated = { ...content.bahagianCawangan };
                                updated.districts[idx].phone = e.target.value;
                                setContent({ ...content, bahagianCawangan: updated });
                              }}
                              className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase">Emel</label>
                            <input
                              type="text"
                              value={dist.email}
                              onChange={(e) => {
                                const updated = { ...content.bahagianCawangan };
                                updated.districts[idx].email = e.target.value;
                                setContent({ ...content, bahagianCawangan: updated });
                              }}
                              className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Alamat Pejabat</label>
                          <input
                            type="text"
                            value={dist.address}
                            onChange={(e) => {
                              const updated = { ...content.bahagianCawangan };
                              updated.districts[idx].address = e.target.value;
                              setContent({ ...content, bahagianCawangan: updated });
                            }}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* --- SUBTAB: STAFF DIRECTORY --- */}
              {bahagianSubTab === 'staff' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      Senarai pegawai dan staf yang boleh dicari oleh orang awam.
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const newStaff = {
                          id: `stf-${Date.now()}`,
                          name: 'Pegawai Baharu',
                          position: 'Penolong Jurutera',
                          department: 'Bahagian Jalan & Jambatan',
                          grade: 'JA29',
                          email: 'pegawai@ns.gov.my',
                          phone: '06-765 9100',
                          category: 'Jalan' as const
                        };
                        const updated = { ...content.bahagianCawangan };
                        updated.staffDirectory = [newStaff, ...(updated.staffDirectory || [])];
                        setContent({ ...content, bahagianCawangan: updated });
                        showToast('Staf baharu ditambah pada senarai atas.', 'info');
                      }}
                      className="px-3 py-1.5 bg-slate-900 text-[#FFD100] text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                    >
                      <i className="fa-solid fa-user-plus"></i>
                      <span>Tambah Kakitangan</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-xs">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] uppercase tracking-wider">
                        <tr>
                          <th className="px-3 py-2.5">Nama Pegawai</th>
                          <th className="px-3 py-2.5">Jawatan &amp; Gred</th>
                          <th className="px-3 py-2.5">Bahagian</th>
                          <th className="px-3 py-2.5">No. Sambungan</th>
                          <th className="px-3 py-2.5 text-center">Tindakan</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {content.bahagianCawangan?.staffDirectory?.map((stf, idx) => (
                          <tr key={stf.id} className="hover:bg-slate-50/70">
                            <td className="px-3 py-2">
                              <input
                                type="text"
                                value={stf.name}
                                onChange={(e) => {
                                  const updated = { ...content.bahagianCawangan };
                                  updated.staffDirectory[idx].name = e.target.value;
                                  setContent({ ...content, bahagianCawangan: updated });
                                }}
                                className="w-full px-2 py-1 bg-transparent border border-slate-200 focus:bg-white rounded font-bold text-xs"
                              />
                            </td>
                            <td className="px-3 py-2">
                              <input
                                type="text"
                                value={stf.position}
                                onChange={(e) => {
                                  const updated = { ...content.bahagianCawangan };
                                  updated.staffDirectory[idx].position = e.target.value;
                                  setContent({ ...content, bahagianCawangan: updated });
                                }}
                                className="w-full px-2 py-1 bg-transparent border border-slate-200 focus:bg-white rounded text-xs"
                              />
                            </td>
                            <td className="px-3 py-2">
                              <input
                                type="text"
                                value={stf.department}
                                onChange={(e) => {
                                  const updated = { ...content.bahagianCawangan };
                                  updated.staffDirectory[idx].department = e.target.value;
                                  setContent({ ...content, bahagianCawangan: updated });
                                }}
                                className="w-full px-2 py-1 bg-transparent border border-slate-200 focus:bg-white rounded text-xs text-slate-600"
                              />
                            </td>
                            <td className="px-3 py-2">
                              <input
                                type="text"
                                value={stf.phone}
                                onChange={(e) => {
                                  const updated = { ...content.bahagianCawangan };
                                  updated.staffDirectory[idx].phone = e.target.value;
                                  setContent({ ...content, bahagianCawangan: updated });
                                }}
                                className="w-24 px-2 py-1 bg-transparent border border-slate-200 focus:bg-white rounded text-xs"
                              />
                            </td>
                            <td className="px-3 py-2 text-center">
                              <button
                                type="button"
                                onClick={() => {
                                  setDeleteModal({
                                    open: true,
                                    title: `Padam Pegawai ${stf.name}?`,
                                    message: 'Adakah anda pasti mahu memadamkan rekod kakitangan ini dari direktori awam?',
                                    onConfirm: () => {
                                      const updated = { ...content.bahagianCawangan };
                                      updated.staffDirectory = updated.staffDirectory.filter((s) => s.id !== stf.id);
                                      setContent({ ...content, bahagianCawangan: updated });
                                      setDeleteModal((prev) => ({ ...prev, open: false }));
                                      showToast('Rekod kakitangan dipadamkan.', 'info');
                                    }
                                  });
                                }}
                                className="w-7 h-7 rounded bg-red-100 hover:bg-red-200 text-red-700 inline-flex items-center justify-center text-xs cursor-pointer"
                              >
                                <i className="fa-solid fa-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 5: KONTRAKTOR & PEROLEHAN ================= */}
          {activeTab === 'kontraktor' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Pengurusan Dasar Kontraktor &amp; Perolehan</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Sunting garis panduan pendaftaran CIDB, langkah bayaran interim 14 hari, dan dasar anti-rasuah ABMS.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSaveSection('kontraktorPolicies')}
                  disabled={isSaving}
                  className="px-4 py-2 bg-[#FFD100] hover:bg-yellow-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <i className="fa-solid fa-floppy-disk"></i>
                  <span>Simpan Dasar Perolehan</span>
                </button>
              </div>

              {content.kontraktorPolicies && (
                <div className="space-y-6">
                  {/* CIDB Guidelines */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <i className="fa-solid fa-gavel text-amber-700"></i>
                      <span>Syarat &amp; Garis Panduan CIDB</span>
                    </h4>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Tajuk Syarat</label>
                      <input
                        type="text"
                        value={content.kontraktorPolicies.cidbGuideline.title}
                        onChange={(e) => {
                          const updated = { ...content.kontraktorPolicies };
                          updated.cidbGuideline.title = e.target.value;
                          setContent({ ...content, kontraktorPolicies: updated });
                        }}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Penerangan</label>
                      <textarea
                        rows={2}
                        value={content.kontraktorPolicies.cidbGuideline.description}
                        onChange={(e) => {
                          const updated = { ...content.kontraktorPolicies };
                          updated.cidbGuideline.description = e.target.value;
                          setContent({ ...content, kontraktorPolicies: updated });
                        }}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Anti-Bribery Policy */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <i className="fa-solid fa-shield-halved text-purple-700"></i>
                      <span>Dasar Anti-Rasuah (ABMS ISO 37001)</span>
                    </h4>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Pernyataan Integriti</label>
                      <textarea
                        rows={2}
                        value={content.kontraktorPolicies.abmsPolicy.statement}
                        onChange={(e) => {
                          const updated = { ...content.kontraktorPolicies };
                          updated.abmsPolicy.statement = e.target.value;
                          setContent({ ...content, kontraktorPolicies: updated });
                        }}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs leading-relaxed"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Emel Whistleblower Aduan Integriti</label>
                      <input
                        type="text"
                        value={content.kontraktorPolicies.abmsPolicy.whistleblowerEmail}
                        onChange={(e) => {
                          const updated = { ...content.kontraktorPolicies };
                          updated.abmsPolicy.whistleblowerEmail = e.target.value;
                          setContent({ ...content, kontraktorPolicies: updated });
                        }}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 6: PUSAT MUAT TURUN (DOWNLOADS) ================= */}
          {activeTab === 'downloads' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Pusat Muat Turun &amp; Dokumen</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Uruskan borang permohonan, pekeliling, spesifikasi kejuruteraan, dan arkib warta.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const newDoc = {
                        id: `dl-${Date.now()}`,
                        title: 'Borang Permohonan / Dokumen Baharu JKR',
                        category: 'Borang Permohonan' as const,
                        fileSize: '1.2 MB',
                        format: 'PDF',
                        fileUrl: '#download-dokumen',
                        updateDate: new Date().toLocaleDateString('ms-MY', { day: '2-digit', month: 'short', year: 'numeric' }),
                        downloadsCount: 0
                      };
                      setContent({
                        ...content,
                        downloads: [newDoc, ...(content.downloads || [])]
                      });
                      showToast('Dokumen baharu ditambah pada senarai atas. Lengkapkan maklumat dan tekan Simpan.', 'info');
                    }}
                    className="px-3.5 py-2 bg-slate-900 text-[#FFD100] text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <i className="fa-solid fa-plus"></i>
                    <span>Tambah Dokumen</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSaveSection('downloads')}
                    disabled={isSaving}
                    className="px-4 py-2 bg-[#FFD100] hover:bg-yellow-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <i className="fa-solid fa-floppy-disk"></i>
                    <span>Simpan Dokumen</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {content.downloads?.map((doc, idx) => (
                  <div key={doc.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={doc.title}
                          onChange={(e) => {
                            const updated = [...content.downloads];
                            updated[idx].title = e.target.value;
                            setContent({ ...content, downloads: updated });
                          }}
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold"
                          placeholder="Tajuk Dokumen"
                        />

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          <select
                            value={doc.category}
                            onChange={(e) => {
                              const updated = [...content.downloads];
                              updated[idx].category = e.target.value as any;
                              setContent({ ...content, downloads: updated });
                            }}
                            className="px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                          >
                            <option value="Borang Permohonan">Borang Permohonan</option>
                            <option value="Garis Panduan Teknikal">Garis Panduan Teknikal</option>
                            <option value="Pekeliling & Warta">Pekeliling & Warta</option>
                            <option value="Arkib">Arkib</option>
                          </select>

                          <input
                            type="text"
                            value={doc.fileSize}
                            onChange={(e) => {
                              const updated = [...content.downloads];
                              updated[idx].fileSize = e.target.value;
                              setContent({ ...content, downloads: updated });
                            }}
                            placeholder="Saiz fail (e.g. 1.5 MB)"
                            className="px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                          />

                          <input
                            type="text"
                            value={doc.format}
                            onChange={(e) => {
                              const updated = [...content.downloads];
                              updated[idx].format = e.target.value;
                              setContent({ ...content, downloads: updated });
                            }}
                            placeholder="Format (PDF, DOCX)"
                            className="px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                          />

                          <input
                            type="text"
                            value={doc.fileUrl}
                            onChange={(e) => {
                              const updated = [...content.downloads];
                              updated[idx].fileUrl = e.target.value;
                              setContent({ ...content, downloads: updated });
                            }}
                            placeholder="Pautan URL Dokumen"
                            className="px-2 py-1 bg-white border border-slate-300 rounded text-xs text-blue-700"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setDeleteModal({
                            open: true,
                            title: `Padam Dokumen?`,
                            message: `Adakah anda pasti mahu memadam "${doc.title}"?`,
                            onConfirm: () => {
                              const filtered = content.downloads.filter((d) => d.id !== doc.id);
                              setContent({ ...content, downloads: filtered });
                              setDeleteModal((prev) => ({ ...prev, open: false }));
                              showToast('Dokumen dipadamkan.', 'info');
                            }
                          });
                        }}
                        className="w-8 h-8 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 flex items-center justify-center text-xs flex-shrink-0 cursor-pointer"
                        title="Padam Dokumen"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 7: WARGA JKRNS ================= */}
          {activeTab === 'warga' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Pengurusan Modul Warga JKRNS</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Kemaskini pautan sistem dalaman dan intranet untuk kemudahan kakitangan.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSaveSection('wargaLinks')}
                  disabled={isSaving}
                  className="px-4 py-2 bg-[#FFD100] hover:bg-yellow-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <i className="fa-solid fa-floppy-disk"></i>
                  <span>Simpan Pautan Warga</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.wargaLinks?.map((link, idx) => (
                  <div key={link.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900">{link.title}</span>
                      <input
                        type="text"
                        value={link.icon}
                        onChange={(e) => {
                          const updated = [...content.wargaLinks];
                          updated[idx].icon = e.target.value;
                          setContent({ ...content, wargaLinks: updated });
                        }}
                        className="w-32 px-2 py-0.5 bg-white border border-slate-300 rounded text-[11px] text-center"
                        title="Ikon FontAwesome"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Sub-tajuk</label>
                      <input
                        type="text"
                        value={link.subtitle}
                        onChange={(e) => {
                          const updated = [...content.wargaLinks];
                          updated[idx].subtitle = e.target.value;
                          setContent({ ...content, wargaLinks: updated });
                        }}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Pautan URL Sistem</label>
                      <input
                        type="text"
                        value={link.url}
                        onChange={(e) => {
                          const updated = [...content.wargaLinks];
                          updated[idx].url = e.target.value;
                          setContent({ ...content, wargaLinks: updated });
                        }}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono text-blue-700"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 8: MEDIA & IMAGE GALLERY ================= */}
          {activeTab === 'media' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Galeri Media &amp; Fail Imej</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Muat naik gambar banner, foto pengarah, atau dokumen untuk digunakan pada sebarang bahagian laman web.
                  </p>
                </div>
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                    accept="image/*,application/pdf"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingMedia}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-[#FFD100] font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    {isUploadingMedia ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin"></i>
                        <span>Memuat Naik...</span>
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-cloud-arrow-up"></i>
                        <span>Muat Naik Fail / Foto</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {mediaFiles.length === 0 ? (
                <div className="p-12 text-center border-2 border-dashed border-slate-300 rounded-3xl">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-xl mx-auto mb-3">
                    <i className="fa-solid fa-images"></i>
                  </div>
                  <h4 className="font-bold text-sm text-slate-800">Tiada Fail Media Dimuat Naik Lagi</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Klik butang &quot;Muat Naik Fail / Foto&quot; di atas untuk memasukkan imej baharu ke dalam storan pelayan.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {mediaFiles.map((file, fIdx) => (
                    <div key={fIdx} className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex flex-col justify-between group">
                      <div className="w-full h-32 bg-slate-200 rounded-xl overflow-hidden mb-2 relative flex items-center justify-center">
                        {file.name.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i) ? (
                          <img
                            src={file.url}
                            alt={file.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <i className="fa-solid fa-file-pdf text-3xl text-red-600"></i>
                        )}
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-slate-900 truncate" title={file.name}>
                          {file.name}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center justify-between mt-0.5">
                          <span>{file.size}</span>
                          <span>{file.updatedAt}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.origin + file.url);
                          showToast('Pautan URL fail telah disalin ke papan klip!', 'info');
                        }}
                        className="mt-2.5 w-full py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <i className="fa-solid fa-copy text-amber-600"></i>
                        <span>Salin Pautan URL</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 9: SETTINGS & FOOTER ================= */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 animate-fadeIn max-w-3xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Tetapan Portal &amp; Maklumat Footer</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Nama portal rasmi, talian perhubungan, waktu operasi kaunter, dan pautan media sosial.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSaveSection('siteConfig')}
                  disabled={isSaving}
                  className="px-4 py-2 bg-[#FFD100] hover:bg-yellow-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <i className="fa-solid fa-floppy-disk"></i>
                  <span>Simpan Tetapan</span>
                </button>
              </div>

              {content.siteConfig && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Nama Jabatan</label>
                      <input
                        type="text"
                        value={content.siteConfig.portalName}
                        onChange={(e) => {
                          const updated = { ...content.siteConfig, portalName: e.target.value };
                          setContent({ ...content, siteConfig: updated });
                        }}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Sub-tajuk Portal</label>
                      <input
                        type="text"
                        value={content.siteConfig.portalSubtitle}
                        onChange={(e) => {
                          const updated = { ...content.siteConfig, portalSubtitle: e.target.value };
                          setContent({ ...content, siteConfig: updated });
                        }}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-red-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Talian Am &amp; Hotline</label>
                      <input
                        type="text"
                        value={content.siteConfig.hotline}
                        onChange={(e) => {
                          const updated = { ...content.siteConfig, hotline: e.target.value };
                          setContent({ ...content, siteConfig: updated });
                        }}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Emel Korporat Rasmi</label>
                      <input
                        type="text"
                        value={content.siteConfig.email}
                        onChange={(e) => {
                          const updated = { ...content.siteConfig, email: e.target.value };
                          setContent({ ...content, siteConfig: updated });
                        }}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Alamat Ibu Pejabat</label>
                    <input
                      type="text"
                      value={content.siteConfig.address}
                      onChange={(e) => {
                        const updated = { ...content.siteConfig, address: e.target.value };
                        setContent({ ...content, siteConfig: updated });
                      }}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Waktu Operasi Kaunter</label>
                    <input
                      type="text"
                      value={content.siteConfig.operatingHours}
                      onChange={(e) => {
                        const updated = { ...content.siteConfig, operatingHours: e.target.value };
                        setContent({ ...content, siteConfig: updated });
                      }}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Pautan Facebook</label>
                      <input
                        type="text"
                        value={content.siteConfig.facebookUrl}
                        onChange={(e) => {
                          const updated = { ...content.siteConfig, facebookUrl: e.target.value };
                          setContent({ ...content, siteConfig: updated });
                        }}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Pautan Twitter / X</label>
                      <input
                        type="text"
                        value={content.siteConfig.twitterUrl}
                        onChange={(e) => {
                          const updated = { ...content.siteConfig, twitterUrl: e.target.value };
                          setContent({ ...content, siteConfig: updated });
                        }}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Pautan YouTube</label>
                      <input
                        type="text"
                        value={content.siteConfig.youtubeUrl}
                        onChange={(e) => {
                          const updated = { ...content.siteConfig, youtubeUrl: e.target.value };
                          setContent({ ...content, siteConfig: updated });
                        }}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Teks Penafian &amp; Hak Cipta</label>
                    <textarea
                      rows={2}
                      value={content.siteConfig.disclaimer}
                      onChange={(e) => {
                        const updated = { ...content.siteConfig, disclaimer: e.target.value };
                        setContent({ ...content, siteConfig: updated });
                      }}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs leading-relaxed"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 10: ADMINS MANAGEMENT (SUPER ADMIN ONLY) ================= */}
          {activeTab === 'admins' && currentUser.role === 'Super Administrator' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Pengurusan Akses Pentadbir CMS</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Kawalan peranan Super Administrator dan Administrator. Pendaftaran akaun pentadbir adalah tertutup.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddAdminModal(true)}
                  className="px-4 py-2 bg-[#FFD100] hover:bg-yellow-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <i className="fa-solid fa-user-plus"></i>
                  <span>Daftar Pentadbir Baharu</span>
                </button>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Nama Pegawai</th>
                      <th className="px-4 py-3">Nama Pengguna</th>
                      <th className="px-4 py-3">Peranan CMS</th>
                      <th className="px-4 py-3">Bahagian / Jabatan</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-center">Tindakan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {adminsList.map((adm) => (
                      <tr key={adm.id} className="hover:bg-slate-50/70">
                        <td className="px-4 py-3 font-bold text-slate-900">{adm.name}</td>
                        <td className="px-4 py-3 font-mono text-slate-600">{adm.username}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              adm.role === 'Super Administrator'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-blue-100 text-blue-900 border border-blue-300'
                            }`}
                          >
                            {adm.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{adm.department}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                              adm.status === 'Aktif' ? 'text-emerald-600' : 'text-red-500'
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                adm.status === 'Aktif' ? 'bg-emerald-500' : 'bg-red-500'
                              }`}
                            ></span>
                            <span>{adm.status}</span>
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {adm.username !== 'admin' && (
                            <button
                              type="button"
                              onClick={() => {
                                setDeleteModal({
                                  open: true,
                                  title: `Padam Pentadbir ${adm.name}?`,
                                  message: 'Akaun ini tidak lagi boleh mengakses sistem CMS.',
                                  onConfirm: async () => {
                                    try {
                                      const res = await fetch(`/api/cms/admins/${adm.id}`, { method: 'DELETE' });
                                      const json = await res.json();
                                      if (res.ok && json.success) {
                                        showToast('Pentadbir telah dipadamkan.', 'info');
                                        await fetchAdminsList();
                                      }
                                    } catch (err) {
                                      showToast('Ralat memadamkan pentadbir.', 'error');
                                    } finally {
                                      setDeleteModal((prev) => ({ ...prev, open: false }));
                                    }
                                  }
                                });
                              }}
                              className="w-7 h-7 rounded bg-red-100 hover:bg-red-200 text-red-700 inline-flex items-center justify-center text-xs cursor-pointer"
                              title="Padam Pentadbir"
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= TAB 11: AUDIT LOGS ================= */}
          {activeTab === 'audit' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Log Jejak Audit Aktiviti</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Rekod keselamatan dan audit penerbitan kandungan untuk tujuan pematuhan integriti.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={fetchAuditLogs}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <i className="fa-solid fa-rotate"></i>
                  <span>Segar Semula</span>
                </button>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Masa &amp; Tarikh</th>
                      <th className="px-4 py-3">Tindakan</th>
                      <th className="px-4 py-3">Bahagian</th>
                      <th className="px-4 py-3">Pegawai / Pentadbir</th>
                      <th className="px-4 py-3">Butiran</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/70">
                        <td className="px-4 py-3 font-mono text-slate-500">{log.timestamp}</td>
                        <td className="px-4 py-3 font-bold text-slate-900">{log.action}</td>
                        <td className="px-4 py-3 text-slate-700">{log.section}</td>
                        <td className="px-4 py-3 font-semibold text-blue-700">{log.user}</td>
                        <td className="px-4 py-3 text-slate-500">{log.details || '-'}</td>
                      </tr>
                    ))}
                    {auditLogs.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-6 text-center text-slate-400 italic">
                          Tiada rekod audit disimpan setakat ini.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ================= MODAL: ADD ADMIN ================= */}
      {showAddAdminModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                <i className="fa-solid fa-user-plus text-amber-600"></i>
                <span>Daftar Pentadbir CMS Baharu</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddAdminModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Nama Penuh Pegawai *
                </label>
                <input
                  type="text"
                  required
                  value={newAdminData.name}
                  onChange={(e) => setNewAdminData({ ...newAdminData, name: e.target.value })}
                  placeholder="Contoh: En. Ahmad bin Razali"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Nama Pengguna (Username) *
                </label>
                <input
                  type="text"
                  required
                  value={newAdminData.username}
                  onChange={(e) => setNewAdminData({ ...newAdminData, username: e.target.value })}
                  placeholder="Contoh: ahmad.razali"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Kata Laluan Awal *
                </label>
                <input
                  type="password"
                  required
                  value={newAdminData.password}
                  onChange={(e) => setNewAdminData({ ...newAdminData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Peranan Akses CMS *
                </label>
                <select
                  value={newAdminData.role}
                  onChange={(e) => setNewAdminData({ ...newAdminData, role: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                >
                  <option value="Administrator">Administrator (Sunting Kandungan &amp; Media)</option>
                  <option value="Super Administrator">Super Administrator (Akses Penuh &amp; Pengguna)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Bahagian / Unit
                </label>
                <input
                  type="text"
                  value={newAdminData.department}
                  onChange={(e) => setNewAdminData({ ...newAdminData, department: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddAdminModal(false)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-[#FFD100] hover:bg-yellow-400 text-slate-950 font-black rounded-xl text-xs transition-colors cursor-pointer shadow-md"
                >
                  Daftarkan Pentadbir
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: CHANGE PASSWORD ================= */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                <i className="fa-solid fa-key text-amber-600"></i>
                <span>Tukar Kata Laluan Pentadbir</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            {passwordError && (
              <div className="mb-3 p-2.5 rounded-xl bg-red-100 text-red-800 text-xs">
                {passwordError}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Kata Laluan Semasa
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Kata Laluan Baharu
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Sahkan Kata Laluan Baharu
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="w-1/2 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 bg-slate-900 text-[#FFD100] font-bold rounded-xl text-xs"
                >
                  Simpan Kata Laluan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: DELETE CONFIRMATION ================= */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 animate-fadeIn text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center text-xl mx-auto">
              <i className="fa-solid fa-triangle-exclamation"></i>
            </div>
            <div>
              <h3 className="font-black text-base text-slate-900">{deleteModal.title}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{deleteModal.message}</p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModal((prev) => ({ ...prev, open: false }))}
                className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={deleteModal.onConfirm}
                className="w-1/2 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-md shadow-red-600/30"
              >
                Ya, Sahkan Padam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

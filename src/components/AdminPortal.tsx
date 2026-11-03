import React, { useState, useEffect } from 'react';
import { JataNegeriSembilan, JkrLogo } from './Logos';
import { TenderRecord } from './PenyelarasPortal';

export interface ComplaintRecord {
  id: string;
  name: string;
  phone: string;
  district: string;
  category: string;
  gps: string;
  description: string;
  image?: string;
  timestamp: string;
  status: 'Diterima' | 'Dalam Siasatan' | 'Tindakan Pembaikan' | 'Selesai';
  storedInCloudflare?: boolean;
  cloudflareProvider?: string;
}

export interface UserItem {
  id: string;
  username: string;
  name: string;
  role: 'Admin' | 'Penyelaras Iklan';
  email: string;
  department: string;
  status: 'Aktif' | 'Tidak Aktif';
  createdAt: string;
}

interface AdminPortalProps {
  complaints: ComplaintRecord[];
  cloudflareInfo: {
    connected: boolean;
    provider: string;
    storageType: string;
    totalRecords: number;
    instruction: string;
  };
  onClose: () => void;
  onLogout: () => void;
  onUpdateStatus: (id: string, newStatus: string) => Promise<void>;
  onDeleteComplaint: (id: string) => Promise<void>;
  onRefresh: () => Promise<void>;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  complaints,
  cloudflareInfo,
  onClose,
  onLogout,
  onUpdateStatus,
  onDeleteComplaint,
  onRefresh,
}) => {
  // Navigation Tabs: 'aduan' | 'tender_review' | 'user_roles'
  const [activeTab, setActiveTab] = useState<'aduan' | 'tender_review' | 'user_roles'>('aduan');

  // --- 1. Aduan States ---
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Semua');
  const [districtFilter, setDistrictFilter] = useState<string>('Semua');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string>('');

  // --- 2. Tender Review States ---
  const [tenders, setTenders] = useState<TenderRecord[]>([]);
  const [tenderFilterStatus, setTenderFilterStatus] = useState<string>('Semua');
  const [tenderSearchQuery, setTenderSearchQuery] = useState('');
  const [selectedTenderReview, setSelectedTenderReview] = useState<TenderRecord | null>(null);
  const [reviewRemarksInput, setReviewRemarksInput] = useState('');
  const [winnerInput, setWinnerInput] = useState('');
  const [isProcessingTender, setIsProcessingTender] = useState(false);

  // --- 3. User & Role Management States ---
  const [usersList, setUsersList] = useState<UserItem[]>([]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [userFormData, setUserFormData] = useState({
    username: '',
    password: '',
    name: '',
    role: 'Penyelaras Iklan' as 'Admin' | 'Penyelaras Iklan',
    email: '',
    department: 'Unit Perolehan & Kontrak JKR NS'
  });

  // Load tenders and users from backend
  const fetchTendersAndUsers = async () => {
    try {
      const [tendersRes, usersRes] = await Promise.all([
        fetch('/api/tenders?all=true').then((r) => r.json()).catch(() => null),
        fetch('/api/users').then((r) => r.json()).catch(() => null)
      ]);

      if (tendersRes && tendersRes.success && Array.isArray(tendersRes.data)) {
        setTenders(tendersRes.data);
      }
      if (usersRes && usersRes.success && Array.isArray(usersRes.data)) {
        setUsersList(usersRes.data);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    }
  };

  useEffect(() => {
    fetchTendersAndUsers();
  }, []);

  // Aduan Metrics
  const totalCount = complaints.length;
  const diterimaCount = complaints.filter((c) => c.status === 'Diterima').length;
  const siasatanCount = complaints.filter((c) => c.status === 'Dalam Siasatan').length;
  const pembaikanCount = complaints.filter((c) => c.status === 'Tindakan Pembaikan').length;
  const selesaiCount = complaints.filter((c) => c.status === 'Selesai').length;

  // Tender Metrics
  const pendingTendersCount = tenders.filter((t) => t.status === 'menunggu_kelulusan').length;
  const openTendersCount = tenders.filter((t) => t.status === 'buka').length;

  // Aduan Filter
  const filteredComplaints = complaints.filter((item) => {
    if (statusFilter !== 'Semua' && item.status !== statusFilter) return false;
    if (districtFilter !== 'Semua' && item.district.toLowerCase() !== districtFilter.toLowerCase())
      return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match =
        item.id.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.phone.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.district.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Tender Filter
  const filteredTenders = tenders.filter((t) => {
    if (tenderFilterStatus !== 'Semua' && t.status !== tenderFilterStatus) return false;
    if (tenderSearchQuery.trim()) {
      const q = tenderSearchQuery.toLowerCase().trim();
      const match =
        t.code.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        t.district.toLowerCase().includes(q) ||
        t.cidb.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Complaint Handlers
  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      await onUpdateStatus(id, newStatus);
      setActionSuccessMsg(`Status tiket ${id} telah berjaya dikemaskini kepada "${newStatus}".`);
      setTimeout(() => setActionSuccessMsg(''), 4000);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteComplaintLocal = async (id: string) => {
    if (window.confirm(`Adakah anda pasti ingin memadamkan aduan ${id}?`)) {
      await onDeleteComplaint(id);
      setActionSuccessMsg(`Aduan ${id} telah dipadamkan.`);
      setTimeout(() => setActionSuccessMsg(''), 4000);
    }
  };

  // --- TENDER REVIEW HANDLER (Luluskan / Ubah Status / Tolak) ---
  const handleReviewTenderStatus = async (
    tenderId: string,
    newStatus: 'buka' | 'tutup' | 'keputusan' | 'ditolak' | 'menunggu_kelulusan'
  ) => {
    setIsProcessingTender(true);
    try {
      const res = await fetch(`/api/tenders/${encodeURIComponent(tenderId)}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          reviewRemarks: reviewRemarksInput || 'Telah disemak oleh Pentadbir Utama JKR NS.',
          reviewedBy: 'Admin (Pentadbir Utama)',
          winner: newStatus === 'keputusan' ? winnerInput : undefined
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setActionSuccessMsg(`Iklan ${data.data.code} telah dikemaskini kepada status "${data.data.statusLabelMs}".`);
        setTimeout(() => setActionSuccessMsg(''), 5000);
        setSelectedTenderReview(null);
        setReviewRemarksInput('');
        setWinnerInput('');
        await fetchTendersAndUsers();
      } else {
        alert(data.error || 'Gagal mengemaskini status iklan.');
      }
    } catch (err: any) {
      alert('Ralat semasa mengemaskini status iklan tender.');
    } finally {
      setIsProcessingTender(false);
    }
  };

  // --- USER ROLE MANAGEMENT HANDLERS ---
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userFormData.username || !userFormData.password || !userFormData.name) {
      alert('Sila lengkapkan semua medan mandatori.');
      return;
    }

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userFormData)
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setActionSuccessMsg(data.message);
        setTimeout(() => setActionSuccessMsg(''), 5000);
        setShowAddUserModal(false);
        setUserFormData({
          username: '',
          password: '',
          name: '',
          role: 'Penyelaras Iklan',
          email: '',
          department: 'Unit Perolehan & Kontrak JKR NS'
        });
        await fetchTendersAndUsers();
      } else {
        alert(data.error || 'Gagal mencipta pengguna baharu.');
      }
    } catch (err) {
      alert('Ralat sistem mencipta pengguna.');
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: 'Admin' | 'Penyelaras Iklan') => {
    try {
      const res = await fetch(`/api/users/${encodeURIComponent(userId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionSuccessMsg(`Peranan pengguna telah ditukar kepada "${newRole}".`);
        setTimeout(() => setActionSuccessMsg(''), 4000);
        await fetchTendersAndUsers();
      } else {
        alert(data.error || 'Gagal menukar peranan pengguna.');
      }
    } catch (err) {
      alert('Ralat menukar peranan pengguna.');
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (window.confirm(`Adakah anda pasti ingin memadamkan akaun "${userName}"?`)) {
      try {
        const res = await fetch(`/api/users/${encodeURIComponent(userId)}`, {
          method: 'DELETE'
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setActionSuccessMsg(data.message);
          setTimeout(() => setActionSuccessMsg(''), 4000);
          await fetchTendersAndUsers();
        } else {
          alert(data.error || 'Gagal memadamkan pengguna.');
        }
      } catch (err) {
        alert('Ralat memadamkan pengguna.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans pb-16">
      {/* ================= HEADER PENTADBIR ================= */}
      <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-40">
        <div className="h-1.5 w-full flex">
          <div className="h-full w-1/2 bg-[#FFD100]"></div>
          <div className="h-full w-1/4 bg-[#DC2626]"></div>
          <div className="h-full w-1/4 bg-[#111827]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 p-1.5 bg-white rounded-xl shadow-sm">
              <JataNegeriSembilan className="h-10 w-auto" />
              <div className="h-8 w-px bg-slate-200"></div>
              <JkrLogo className="h-10 w-auto" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-red-600/90 text-white px-2 py-0.5 rounded">
                  Modul Pentadbir (Admin)
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">
                  Jabatan Kerja Raya Negeri Sembilan
                </span>
              </div>
              <h1 className="text-base sm:text-xl font-black text-white tracking-tight">
                Pusat Kawalan Pentadbir: e-Aduan, Semakan Tender &amp; Peranan
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
              <i className="fa-solid fa-user-shield text-[#FFD100]"></i>
              <span className="font-bold text-white">admin</span>
            </div>

            <button
              type="button"
              onClick={async () => {
                await onRefresh();
                await fetchTendersAndUsers();
              }}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs transition-colors cursor-pointer"
              title="Segar Semula Data"
            >
              <i className="fa-solid fa-rotate"></i>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 bg-[#FFD100] hover:bg-yellow-400 text-slate-900 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <i className="fa-solid fa-arrow-left"></i>
              <span>Kembali ke Portal Awam</span>
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="p-2 bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white rounded-xl text-xs transition-colors cursor-pointer"
              title="Log Keluar"
            >
              <i className="fa-solid fa-power-off"></i>
            </button>
          </div>
        </div>

        {/* 3 Tab Navigasi Utama Admin */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800 flex overflow-x-auto space-x-1 py-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('aduan')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'aduan'
                ? 'bg-[#FFD100] text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <i className="fa-solid fa-road-circle-exclamation"></i>
            <span>Pengurusan e-Aduan Awam</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20">
              {complaints.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tender_review')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'tender_review'
                ? 'bg-[#FFD100] text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <i className="fa-solid fa-file-signature"></i>
            <span>Semakan &amp; Kelulusan Iklan Tender</span>
            {pendingTendersCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-red-600 text-white animate-pulse">
                {pendingTendersCount} Menunggu
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('user_roles')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'user_roles'
                ? 'bg-[#FFD100] text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <i className="fa-solid fa-users-gear"></i>
            <span>Pengurusan Pengguna &amp; Peranan (Roles)</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20">
              {usersList.length} Akaun
            </span>
          </button>
        </div>
      </header>

      {/* ================= KANDUNGAN UTAMA ================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Notis Kejayaan */}
        {actionSuccessMsg && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-2xl text-xs font-bold flex items-center justify-between shadow-sm animate-fadeIn">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-circle-check text-emerald-600 text-base"></i>
              <span>{actionSuccessMsg}</span>
            </div>
            <button
              type="button"
              onClick={() => setActionSuccessMsg('')}
              className="text-emerald-700 hover:text-emerald-900"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        )}

        {/* ================= TAB 1: PENGURUSAN E-ADUAN AWAM ================= */}
        {activeTab === 'aduan' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Metrik Aduan */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
              <div
                onClick={() => setStatusFilter('Semua')}
                className={`cursor-pointer p-4 rounded-2xl border transition-all ${
                  statusFilter === 'Semua'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-102'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-slate-400'
                }`}
              >
                <div className="text-xs font-bold uppercase tracking-wider opacity-75">Jumlah Aduan</div>
                <div className="text-2xl sm:text-3xl font-black mt-1">{totalCount}</div>
                <div className="text-[11px] opacity-70 mt-1">Kesemua rekod sistem</div>
              </div>

              <div
                onClick={() => setStatusFilter('Diterima')}
                className={`cursor-pointer p-4 rounded-2xl border transition-all ${
                  statusFilter === 'Diterima'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-102'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-blue-400'
                }`}
              >
                <div className="text-xs font-bold uppercase tracking-wider text-blue-500">Baru Diterima</div>
                <div className="text-2xl sm:text-3xl font-black mt-1 text-blue-600">{diterimaCount}</div>
                <div className="text-[11px] text-slate-500 mt-1">Menunggu siasatan tapak</div>
              </div>

              <div
                onClick={() => setStatusFilter('Dalam Siasatan')}
                className={`cursor-pointer p-4 rounded-2xl border transition-all ${
                  statusFilter === 'Dalam Siasatan'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-102'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-indigo-400'
                }`}
              >
                <div className="text-xs font-bold uppercase tracking-wider text-indigo-500">Dalam Siasatan</div>
                <div className="text-2xl sm:text-3xl font-black mt-1 text-indigo-600">{siasatanCount}</div>
                <div className="text-[11px] text-slate-500 mt-1">Penilaian juruteknik JKR</div>
              </div>

              <div
                onClick={() => setStatusFilter('Tindakan Pembaikan')}
                className={`cursor-pointer p-4 rounded-2xl border transition-all ${
                  statusFilter === 'Tindakan Pembaikan'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-md scale-102'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-amber-400'
                }`}
              >
                <div className="text-xs font-bold uppercase tracking-wider text-amber-500">Tindakan Pembaikan</div>
                <div className="text-2xl sm:text-3xl font-black mt-1 text-amber-600">{pembaikanCount}</div>
                <div className="text-[11px] text-slate-500 mt-1">Kerja di tapak berjalan</div>
              </div>

              <div
                onClick={() => setStatusFilter('Selesai')}
                className={`cursor-pointer p-4 rounded-2xl border transition-all ${
                  statusFilter === 'Selesai'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-102'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-400'
                }`}
              >
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-500">Selesai</div>
                <div className="text-2xl sm:text-3xl font-black mt-1 text-emerald-600">{selesaiCount}</div>
                <div className="text-[11px] text-slate-500 mt-1">Telah dibaik pulih</div>
              </div>
            </div>

            {/* Carian & Penapis Aduan */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                    <i className="fa-solid fa-magnifying-glass-chart text-[#DC2626]"></i>
                    <span>Fungsi Semak &amp; Carian Aduan Awam</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Cari rekod aduan mengikut Nombor Tiket (contoh: JKRNS-2026-XXXXXX), nama, no telefon atau kawasan.
                  </p>
                </div>

                {(searchQuery || statusFilter !== 'Semua' || districtFilter !== 'Semua') && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('Semua');
                      setDistrictFilter('Semua');
                    }}
                    className="text-xs text-red-600 hover:text-red-800 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <i className="fa-solid fa-rotate-left"></i>
                    <span>Set Semula Penapis</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-6 relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Masukkan Nombor Tiket, Nama Pengadu, atau Kata Kunci..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
                  />
                  <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                </div>

                <div className="sm:col-span-3">
                  <select
                    value={districtFilter}
                    onChange={(e) => setDistrictFilter(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
                  >
                    <option value="Semua">Semua 7 Daerah JKR</option>
                    <option value="Seremban">Seremban</option>
                    <option value="Port Dickson">Port Dickson</option>
                    <option value="Rembau">Rembau</option>
                    <option value="Kuala Pilah">Kuala Pilah</option>
                    <option value="Jempol">Jempol</option>
                    <option value="Jelebu">Jelebu</option>
                    <option value="Tampin">Tampin</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
                  >
                    <option value="Semua">Semua Status</option>
                    <option value="Diterima">Diterima</option>
                    <option value="Dalam Siasatan">Dalam Siasatan</option>
                    <option value="Tindakan Pembaikan">Tindakan Pembaikan</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Senarai Rekod Aduan */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50">
                <div>
                  <h3 className="font-black text-slate-900 text-base sm:text-lg flex items-center gap-2">
                    <i className="fa-solid fa-list-check text-slate-700"></i>
                    <span>Senarai Penuh Maklumat e-Aduan Pengguna</span>
                    <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold ml-1">
                      {filteredComplaints.length} rekod
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Hanya boleh diakses oleh Pentadbir yang disahkan. Disegerakkan ke pangkalan data Cloudflare.
                  </p>
                </div>

                <div className="text-xs text-slate-500 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Storan: {cloudflareInfo.provider}</span>
                </div>
              </div>

              {filteredComplaints.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  <i className="fa-solid fa-folder-open text-3xl mb-2 text-slate-300"></i>
                  <h4 className="font-bold text-slate-800 text-sm">Tiada Rekod Aduan Ditemui</h4>
                  <p className="text-xs text-slate-500 mt-1">Sila laraskan kriteria carian atau penapis daerah/status.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {filteredComplaints.map((item) => (
                    <div
                      key={item.id}
                      className="p-5 sm:p-6 hover:bg-slate-50/80 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono font-black text-xs text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                            {item.id}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-200 text-slate-800">
                            Daerah {item.district}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              item.status === 'Selesai'
                                ? 'bg-emerald-100 text-emerald-800'
                                : item.status === 'Tindakan Pembaikan'
                                ? 'bg-amber-100 text-amber-800'
                                : item.status === 'Dalam Siasatan'
                                ? 'bg-indigo-100 text-indigo-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {item.status}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">
                            <i className="fa-solid fa-cloud text-sky-500"></i>
                            <span>Cloudflare Synced</span>
                          </span>
                        </div>

                        <h4 className="font-black text-slate-900 text-sm sm:text-base">
                          {item.category}
                        </h4>

                        <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                          {item.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-slate-500 pt-1">
                          <span className="flex items-center gap-1.5">
                            <i className="fa-solid fa-user text-slate-400"></i>
                            <span className="font-semibold text-slate-700">{item.name}</span>
                          </span>
                          <a
                            href={`tel:${item.phone}`}
                            className="flex items-center gap-1.5 text-blue-600 hover:underline font-semibold"
                          >
                            <i className="fa-solid fa-phone"></i>
                            <span>{item.phone}</span>
                          </a>
                          <a
                            href={`https://maps.google.com/?q=${encodeURIComponent(item.gps)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 text-emerald-700 hover:underline"
                          >
                            <i className="fa-solid fa-location-dot text-[#DC2626]"></i>
                            <span>{item.gps}</span>
                          </a>
                          <span className="flex items-center gap-1.5 text-slate-400">
                            <i className="fa-solid fa-clock"></i>
                            <span>{item.timestamp}</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-row lg:flex-col items-center lg:items-end gap-3 flex-shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                        {item.image && (
                          <div
                            onClick={() => setPreviewImage(item.image || null)}
                            className="cursor-pointer relative group rounded-xl overflow-hidden border border-slate-200 shadow-sm"
                          >
                            <img
                              src={item.image}
                              alt="Bukti Kerosakan"
                              className="h-14 w-14 object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs transition-opacity">
                              <i className="fa-solid fa-expand"></i>
                            </div>
                          </div>
                        )}

                        <div className="flex flex-col gap-1.5 w-full sm:w-auto">
                          <span className="text-[10px] uppercase font-bold text-slate-400 text-left lg:text-right">
                            Tukar Status:
                          </span>
                          <div className="flex flex-wrap items-center gap-1">
                            <button
                              type="button"
                              disabled={updatingId === item.id || item.status === 'Dalam Siasatan'}
                              onClick={() => handleStatusChange(item.id, 'Dalam Siasatan')}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                                item.status === 'Dalam Siasatan'
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200'
                              }`}
                            >
                              Siasatan
                            </button>
                            <button
                              type="button"
                              disabled={updatingId === item.id || item.status === 'Tindakan Pembaikan'}
                              onClick={() => handleStatusChange(item.id, 'Tindakan Pembaikan')}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                                item.status === 'Tindakan Pembaikan'
                                  ? 'bg-amber-600 text-white'
                                  : 'bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200'
                              }`}
                            >
                              Pembaikan
                            </button>
                            <button
                              type="button"
                              disabled={updatingId === item.id || item.status === 'Selesai'}
                              onClick={() => handleStatusChange(item.id, 'Selesai')}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                                item.status === 'Selesai'
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                              }`}
                            >
                              Selesai
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteComplaintLocal(item.id)}
                              className="px-2 py-1 rounded-lg text-[10px] font-bold bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors cursor-pointer ml-1"
                              title="Padam Aduan"
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 2: SEMAKAN & KELULUSAN IKLAN TENDER ================= */}
        {activeTab === 'tender_review' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Banner Penjelasan Aliran Semakan */}
            <div className="bg-amber-50 border-l-4 border-amber-500 p-5 rounded-2xl shadow-xs">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-black text-slate-900 text-sm sm:text-base flex items-center gap-2">
                    <i className="fa-solid fa-stamp text-amber-600"></i>
                    <span>Pusat Kelulusan Iklan Tender &amp; Sebutharga JKR NS</span>
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                    Semua iklan tender yang didaftarkan oleh <strong>Penyelaras Iklan</strong> mesti disemak dan diluluskan oleh Admin sebelum disiarkan pada portal awam. Anda boleh meluluskan tawaran (status: <em>Sedang Dibuka</em>), menolak untuk pindaan, atau mengemaskini keputusan penender.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="px-3 py-1 bg-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-xs">
                    {pendingTendersCount} Iklan Menunggu Tindakan
                  </span>
                </div>
              </div>
            </div>

            {/* Carian & Penapis Tender */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setTenderFilterStatus('Semua')}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    tenderFilterStatus === 'Semua' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Semua ({tenders.length})
                </button>
                <button
                  type="button"
                  onClick={() => setTenderFilterStatus('menunggu_kelulusan')}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    tenderFilterStatus === 'menunggu_kelulusan'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
                  }`}
                >
                  ⏳ Menunggu Semakan ({pendingTendersCount})
                </button>
                <button
                  type="button"
                  onClick={() => setTenderFilterStatus('buka')}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    tenderFilterStatus === 'buka' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Sedang Dibuka ({openTendersCount})
                </button>
                <button
                  type="button"
                  onClick={() => setTenderFilterStatus('tutup')}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    tenderFilterStatus === 'tutup' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Ditutup / Penilaian
                </button>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={tenderSearchQuery}
                  onChange={(e) => setTenderSearchQuery(e.target.value)}
                  placeholder="Cari no tender / tajuk..."
                  className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs w-56 focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
                />
                <i className="fa-solid fa-magnifying-glass absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
              </div>
            </div>

            {/* Senarai Iklan untuk Semakan */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="divide-y divide-slate-100">
                {filteredTenders.length === 0 ? (
                  <div className="p-12 text-center text-slate-500">
                    <i className="fa-solid fa-file-circle-check text-3xl mb-2 text-slate-300"></i>
                    <p className="text-sm font-semibold">Tiada iklan tender ditemui.</p>
                  </div>
                ) : (
                  filteredTenders.map((t) => (
                    <div
                      key={t.id}
                      className={`p-5 sm:p-6 hover:bg-slate-50/80 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                        t.status === 'menunggu_kelulusan' ? 'bg-amber-50/40 border-l-4 border-amber-500' : ''
                      }`}
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono font-black text-xs text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200">
                            {t.code}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-200 text-slate-800">
                            Daerah {t.district}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              t.status === 'menunggu_kelulusan'
                                ? 'bg-amber-100 text-amber-800 animate-pulse border border-amber-300'
                                : t.status === 'buka'
                                ? 'bg-emerald-100 text-emerald-800'
                                : t.status === 'ditolak'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {t.status === 'menunggu_kelulusan'
                              ? '⚠️ Menunggu Semakan Admin'
                              : t.status === 'buka'
                              ? '✓ Diluluskan & Aktif di Portal'
                              : t.status === 'ditolak'
                              ? '✕ Ditolak / Perlu Pindaan'
                              : t.statusLabelMs || t.status}
                          </span>
                        </div>

                        <h4 className="font-bold text-slate-900 text-sm sm:text-base">{t.title}</h4>

                        <div className="text-xs text-slate-500 flex flex-wrap gap-x-4 gap-y-1">
                          <span><i className="fa-solid fa-tag text-slate-400 mr-1"></i>{t.category}</span>
                          <span><i className="fa-solid fa-certificate text-amber-500 mr-1"></i>{t.cidb}</span>
                          <span><i className="fa-solid fa-calendar mr-1 text-slate-400"></i>Tutup: {t.closingDate}</span>
                          <span><i className="fa-solid fa-user-pen mr-1 text-slate-400"></i>Didaftarkan oleh: {t.createdByName || t.createdBy}</span>
                        </div>

                        {t.description && (
                          <p className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200 mt-1 max-w-3xl">
                            {t.description}
                          </p>
                        )}

                        {t.reviewRemarks && (
                          <div className="text-[11px] bg-slate-100 text-slate-700 p-2 rounded-lg border border-slate-200">
                            <span className="font-bold">Nota Semakan:</span> {t.reviewRemarks} (Disemak: {t.reviewedAt || 'Baru-baru ini'})
                          </div>
                        )}
                      </div>

                      {/* Tindakan Admin Terhadap Iklan */}
                      <div className="flex flex-col sm:flex-row items-center gap-2 flex-shrink-0">
                        {t.status === 'menunggu_kelulusan' ? (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedTenderReview(t);
                                setReviewRemarksInput('Spesifikasi disahkan mematuhi gred CIDB dan piawaian JKR NS.');
                              }}
                              className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <i className="fa-solid fa-check"></i>
                              <span>Semak &amp; Luluskan</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedTenderReview(t);
                                setReviewRemarksInput('Sila perbetulkan syarat kelayakan gred CIDB atau tarikh tutup.');
                              }}
                              className="w-full sm:w-auto px-3.5 py-2 bg-red-100 hover:bg-red-200 text-red-800 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <i className="fa-solid fa-xmark"></i>
                              <span>Tolak / Pindaan</span>
                            </button>
                          </>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedTenderReview(t);
                                setReviewRemarksInput(t.reviewRemarks || '');
                                setWinnerInput(t.winner || '');
                              }}
                              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                              <i className="fa-solid fa-sliders"></i>
                              <span>Tukar Status</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: PENGURUSAN PENGGUNA & PERANAN (ROLES) ================= */}
        {activeTab === 'user_roles' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header Pengurusan Peranan */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-black text-slate-900 text-base sm:text-lg flex items-center gap-2">
                  <i className="fa-solid fa-user-gear text-slate-800"></i>
                  <span>Pengurusan Pengguna, Pentadbir &amp; Penyelaras Iklan</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pentadbir boleh menambah, mengedit peranan (Role: Admin / Penyelaras Iklan), dan membuang pengguna.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setUserFormData({
                    username: '',
                    password: '',
                    name: '',
                    role: 'Penyelaras Iklan',
                    email: '',
                    department: 'Unit Perolehan & Tender JKR NS'
                  });
                  setShowAddUserModal(true);
                }}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer whitespace-nowrap"
              >
                <i className="fa-solid fa-user-plus text-[#FFD100]"></i>
                <span>Tambah Pengguna Baharu</span>
              </button>
            </div>

            {/* Senarai Pengguna & Role */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="divide-y divide-slate-100">
                {usersList.map((u) => (
                  <div
                    key={u.id}
                    className="p-5 sm:p-6 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center text-lg font-bold shadow-xs ${
                          u.role === 'Admin'
                            ? 'bg-slate-900 text-[#FFD100]'
                            : 'bg-amber-500 text-slate-950'
                        }`}
                      >
                        <i className={`fa-solid ${u.role === 'Admin' ? 'fa-shield-halved' : 'fa-bullhorn'}`}></i>
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-slate-900 text-sm sm:text-base">{u.name}</h4>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              u.role === 'Admin'
                                ? 'bg-red-100 text-red-800 border border-red-200'
                                : 'bg-amber-100 text-amber-900 border border-amber-200'
                            }`}
                          >
                            Role: {u.role}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {u.status}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 flex flex-wrap gap-x-4">
                          <span>Username: <strong className="text-slate-800 font-mono">{u.username}</strong></span>
                          <span>Emel: {u.email}</span>
                          <span>Jabatan: {u.department}</span>
                        </div>
                      </div>
                    </div>

                    {/* Tindakan Edit / Tukar Role / Padam */}
                    <div className="flex items-center gap-2 self-start sm:self-center">
                      {/* Butang Tukar Peranan Segera */}
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateUserRole(
                            u.id,
                            u.role === 'Admin' ? 'Penyelaras Iklan' : 'Admin'
                          )
                        }
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                        title="Tukar Peranan"
                      >
                        <i className="fa-solid fa-arrows-rotate text-amber-600"></i>
                        <span>Tukar ke {u.role === 'Admin' ? 'Penyelaras' : 'Admin'}</span>
                      </button>

                      {/* Padam Pengguna */}
                      <button
                        type="button"
                        onClick={() => handleDeleteUser(u.id, u.name)}
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs transition-colors cursor-pointer"
                        title="Padam Pengguna"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ================= MODAL SEMAKAN & KELULUSAN TENDER ================= */}
      {selectedTenderReview && (
        <div
          className="fixed inset-0 modal-backdrop z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedTenderReview(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 overflow-hidden transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                  <i className="fa-solid fa-file-signature"></i>
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-sm sm:text-base">
                    Semakan Iklan: {selectedTenderReview.code}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Didaftarkan oleh: {selectedTenderReview.createdByName} ({selectedTenderReview.createdBy})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTenderReview(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900">{selectedTenderReview.title}</div>
                <div className="text-slate-500 flex flex-wrap gap-x-3 text-[11px]">
                  <span>Daerah: <strong>{selectedTenderReview.district}</strong></span>
                  <span>Gred: <strong>{selectedTenderReview.cidb}</strong></span>
                  <span>Tutup: <strong>{selectedTenderReview.closingDate}</strong></span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Ulasan &amp; Nota Semakan Pentadbir (Admin Remarks)
                </label>
                <textarea
                  rows={2}
                  value={reviewRemarksInput}
                  onChange={(e) => setReviewRemarksInput(e.target.value)}
                  placeholder="Catatan semakan atau arahan pindaan..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
                ></textarea>
              </div>

              {selectedTenderReview.status === 'tutup' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nama Syarikat Pemenang (Keputusan Rasmi)
                  </label>
                  <input
                    type="text"
                    value={winnerInput}
                    onChange={(e) => setWinnerInput(e.target.value)}
                    placeholder="Contoh: Maju Teguh Construction Sdn Bhd"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
                  />
                </div>
              )}

              <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-end">
                <button
                  type="button"
                  disabled={isProcessingTender}
                  onClick={() => handleReviewTenderStatus(selectedTenderReview.id, 'buka')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <i className="fa-solid fa-check-double"></i>
                  <span>Luluskan &amp; Buka Siaran</span>
                </button>

                <button
                  type="button"
                  disabled={isProcessingTender}
                  onClick={() => handleReviewTenderStatus(selectedTenderReview.id, 'ditolak')}
                  className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <i className="fa-solid fa-xmark"></i>
                  <span>Tolak / Pindaan</span>
                </button>

                <button
                  type="button"
                  disabled={isProcessingTender}
                  onClick={() => handleReviewTenderStatus(selectedTenderReview.id, 'tutup')}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center cursor-pointer"
                >
                  Tutup Tawaran
                </button>

                {selectedTenderReview.status === 'tutup' && (
                  <button
                    type="button"
                    disabled={isProcessingTender}
                    onClick={() => handleReviewTenderStatus(selectedTenderReview.id, 'keputusan')}
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer"
                  >
                    Umum Keputusan
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL TAMBAH PENGGUNA & PERANAN ================= */}
      {showAddUserModal && (
        <div
          className="fixed inset-0 modal-backdrop z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowAddUserModal(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 overflow-hidden transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-[#FFD100] flex items-center justify-center font-bold">
                  <i className="fa-solid fa-user-plus"></i>
                </div>
                <h4 className="font-black text-slate-900 text-base">Tambah Pengguna &amp; Peranan</h4>
              </div>
              <button
                type="button"
                onClick={() => setShowAddUserModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Peranan (Role) Pengguna *</label>
                <div className="grid grid-cols-2 gap-2">
                  <label
                    className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer ${
                      userFormData.role === 'Admin'
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={userFormData.role === 'Admin'}
                      onChange={() => setUserFormData({ ...userFormData, role: 'Admin' })}
                      className="accent-[#FFD100]"
                    />
                    <span className="font-bold">Role: Admin</span>
                  </label>

                  <label
                    className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer ${
                      userFormData.role === 'Penyelaras Iklan'
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={userFormData.role === 'Penyelaras Iklan'}
                      onChange={() => setUserFormData({ ...userFormData, role: 'Penyelaras Iklan' })}
                      className="accent-[#FFD100]"
                    />
                    <span className="font-bold">Penyelaras Iklan</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Penuh Pengguna *</label>
                <input
                  type="text"
                  required
                  value={userFormData.name}
                  onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                  placeholder="Contoh: Ir. Ts. Mohd Hafiz bin Razak"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Username *</label>
                  <input
                    type="text"
                    required
                    value={userFormData.username}
                    onChange={(e) => setUserFormData({ ...userFormData, username: e.target.value })}
                    placeholder="Contoh: hafiz.jkr"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kata Laluan *</label>
                  <input
                    type="password"
                    required
                    value={userFormData.password}
                    onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                    placeholder="Kata laluan"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Emel Jabatan</label>
                <input
                  type="email"
                  value={userFormData.email}
                  onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                  placeholder="hafiz@jkr.gov.my"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Bahagian / Cawangan</label>
                <input
                  type="text"
                  value={userFormData.department}
                  onChange={(e) => setUserFormData({ ...userFormData, department: e.target.value })}
                  placeholder="Contoh: Unit Tender & Kontrak JKR Negeri Sembilan"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <i className="fa-solid fa-plus text-[#FFD100]"></i>
                  <span>Daftar Pengguna</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL PRATONTON GAMBAR RESOLUSI PENUH ================= */}
      {previewImage && (
        <div
          className="fixed inset-0 modal-backdrop z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full p-5 shadow-2xl border border-slate-200 overflow-hidden transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <i className="fa-solid fa-image text-slate-600"></i>
                <span>Lampiran Bukti Gambar Kerosakan</span>
              </h4>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <div className="flex items-center justify-center bg-slate-950 rounded-2xl overflow-hidden max-h-[75vh]">
              <img
                src={previewImage}
                alt="Gambar Aduan Penuh"
                className="max-h-[70vh] w-auto object-contain rounded-xl"
              />
            </div>
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="px-5 py-2 bg-[#111827] text-white font-bold rounded-xl text-xs hover:bg-slate-800 cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { JataNegeriSembilan, JkrLogo } from './Logos';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Semua');
  const [districtFilter, setDistrictFilter] = useState<string>('Semua');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedTicketDetail, setSelectedTicketDetail] = useState<ComplaintRecord | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string>('');

  // Calculate metrics
  const totalCount = complaints.length;
  const diterimaCount = complaints.filter((c) => c.status === 'Diterima').length;
  const siasatanCount = complaints.filter((c) => c.status === 'Dalam Siasatan').length;
  const pembaikanCount = complaints.filter((c) => c.status === 'Tindakan Pembaikan').length;
  const selesaiCount = complaints.filter((c) => c.status === 'Selesai').length;

  // Filter complaints
  const filteredList = complaints.filter((item) => {
    // Status filter
    if (statusFilter !== 'Semua' && item.status !== statusFilter) return false;
    // District filter
    if (districtFilter !== 'Semua' && item.district.toLowerCase() !== districtFilter.toLowerCase())
      return false;
    // Search query (search across ID, Name, Phone, Category, Description)
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

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      await onUpdateStatus(id, newStatus);
      setActionSuccessMsg(`Status tiket ${id} telah berjaya dikemaskini kepada "${newStatus}".`);
      setTimeout(() => setActionSuccessMsg(''), 4000);
      if (selectedTicketDetail && selectedTicketDetail.id === id) {
        setSelectedTicketDetail((prev) => (prev ? { ...prev, status: newStatus as any } : null));
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(`Adakah anda pasti ingin memadamkan aduan ${id}?`)) {
      await onDeleteComplaint(id);
      if (selectedTicketDetail?.id === id) {
        setSelectedTicketDetail(null);
      }
      setActionSuccessMsg(`Aduan ${id} telah dipadamkan.`);
      setTimeout(() => setActionSuccessMsg(''), 4000);
    }
  };

  const handlePrint = () => {
    window.print();
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
                Pusat Pengurusan e-Aduan &amp; Tindakan Awam
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Status Cloudflare Badge */}
            <div
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-300"
              title={cloudflareInfo.provider}
            >
              <i className="fa-solid fa-cloud text-sky-400"></i>
              <span className="text-[11px] font-semibold">
                {cloudflareInfo.connected ? 'Cloudflare Terhubung' : 'Pangkalan Data Cloudflare Ready'}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>

            {/* User Profile Badge */}
            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
              <i className="fa-solid fa-user-shield text-[#FFD100]"></i>
              <span className="font-bold text-white">admin</span>
            </div>

            {/* Butang Segar Semula */}
            <button
              type="button"
              onClick={onRefresh}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs transition-colors cursor-pointer"
              title="Segar Semula Data"
            >
              <i className="fa-solid fa-rotate"></i>
            </button>

            {/* Butang Cetak Laporan */}
            <button
              type="button"
              onClick={handlePrint}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              title="Cetak Laporan"
            >
              <i className="fa-solid fa-print"></i>
              <span>Cetak</span>
            </button>

            {/* Butang Kembali ke Portal Awam */}
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 bg-[#FFD100] hover:bg-yellow-400 text-slate-900 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <i className="fa-solid fa-arrow-left"></i>
              <span>Kembali ke Portal Awam</span>
            </button>

            {/* Butang Log Keluar */}
            <button
              type="button"
              onClick={onLogout}
              className="p-2 bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white rounded-xl text-xs transition-colors cursor-pointer"
              title="Log Keluar Pentadbir"
            >
              <i className="fa-solid fa-power-off"></i>
            </button>
          </div>
        </div>
      </header>

      {/* ================= KANDUNGAN UTAMA PENTADBIR ================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Notis Kejayaan Tindakan */}
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

        {/* ================= STATISTIK KAD RINGKASAN ================= */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {/* Kad Jumlah Aduan */}
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
            <div className="text-[11px] opacity-70 mt-1">Kesemua rekod dalam sistem</div>
          </div>

          {/* Kad Baru Diterima */}
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

          {/* Kad Dalam Siasatan */}
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

          {/* Kad Tindakan Pembaikan */}
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
            <div className="text-[11px] text-slate-500 mt-1">Kerja di tapak sedang berjalan</div>
          </div>

          {/* Kad Selesai */}
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
            <div className="text-[11px] text-slate-500 mt-1">Telah disahkan pulih sepenuhnya</div>
          </div>
        </div>

        {/* ================= FUNGSI SEMAK TIKET & PENAPIS PINTAR ================= */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <i className="fa-solid fa-magnifying-glass-chart text-[#DC2626]"></i>
                <span>Fungsi Semak Tiket &amp; Carian Pangkalan Data</span>
              </h2>
              <p className="text-xs text-slate-500">
                Cari aduan menggunakan Nombor Tiket (contoh: JKRNS-2026-951028), nama pengadu, nombor telefon, atau lokasi.
              </p>
            </div>

            {/* Butang Reset Filter */}
            {(searchQuery || statusFilter !== 'Semua' || districtFilter !== 'Semua') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('Semua');
                  setDistrictFilter('Semua');
                }}
                className="text-xs text-red-600 hover:text-red-800 font-bold flex items-center gap-1 self-start md:self-auto cursor-pointer"
              >
                <i className="fa-solid fa-rotate-left"></i>
                <span>Set Semula Penapis</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Input Carian / Semak */}
            <div className="sm:col-span-6 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Masukkan Nombor Tiket, Nama Pengadu, atau Kata Kunci..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
              />
              <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              )}
            </div>

            {/* Penapis Daerah */}
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

            {/* Penapis Status */}
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

        {/* ================= SENARAI REKOD ADUAN (TABEL PENTADBIR) ================= */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50">
            <div>
              <h3 className="font-black text-slate-900 text-base sm:text-lg flex items-center gap-2">
                <i className="fa-solid fa-list-check text-slate-700"></i>
                <span>Senarai Maklumat e-Aduan Pengguna</span>
                <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold ml-1">
                  {filteredList.length} rekod dipadankan
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Semua aduan diselaraskan bersama pengkalan data Cloudflare &amp; arkib pelayan.
              </p>
            </div>

            <div className="text-xs text-slate-500 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Storan Aktif: {cloudflareInfo.provider}</span>
            </div>
          </div>

          {filteredList.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 text-2xl">
                <i className="fa-solid fa-folder-open"></i>
              </div>
              <h4 className="font-bold text-slate-800 text-sm">Tiada Rekod Aduan Ditemui</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Tiada aduan yang sepadan dengan carian atau penapis daerah/status yang dipilih.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredList.map((item) => (
                <div
                  key={item.id}
                  className="p-5 sm:p-6 hover:bg-slate-50/80 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  {/* Butiran Utama */}
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

                    {/* Metadata Pengadu, Lokasi GPS & Tarikh */}
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1.5">
                        <i className="fa-solid fa-user text-slate-400"></i>
                        <span className="font-semibold text-slate-700">{item.name}</span>
                      </span>
                      <a
                        href={`tel:${item.phone}`}
                        className="flex items-center gap-1.5 text-blue-600 hover:underline font-semibold"
                        title="Hubungi Pengadu"
                      >
                        <i className="fa-solid fa-phone"></i>
                        <span>{item.phone}</span>
                      </a>
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(item.gps)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-emerald-700 hover:underline"
                        title="Buka Lokasi di Google Maps"
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

                  {/* Thumbnail Gambar & Butang Kawalan Admin */}
                  <div className="flex flex-row lg:flex-col items-center lg:items-end gap-3 flex-shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    {item.image && (
                      <div
                        onClick={() => setPreviewImage(item.image || null)}
                        className="cursor-pointer relative group rounded-xl overflow-hidden border border-slate-200 shadow-sm"
                        title="Klik untuk lihat gambar bukti saiz penuh"
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

                    {/* Kawalan Status Cepat */}
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
                          onClick={() => handleDelete(item.id)}
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
      </main>

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
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
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

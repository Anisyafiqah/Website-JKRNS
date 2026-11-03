import React, { useState } from 'react';
import { JataNegeriSembilan, JkrLogo } from './Logos';

export interface TenderRecord {
  id: string;
  code: string;
  title: string;
  titleEn?: string;
  category: string;
  district: string;
  closingDate: string;
  openingDate?: string;
  cidb: string;
  estimatedCost?: string;
  docPrice?: string;
  siteVisit?: string;
  description?: string;
  documentUrl?: string;
  status: 'menunggu_kelulusan' | 'buka' | 'tutup' | 'keputusan' | 'ditolak';
  statusLabelMs?: string;
  statusLabelEn?: string;
  winner?: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewRemarks?: string;
}

interface PenyelarasPortalProps {
  currentUser: {
    username: string;
    name: string;
    role: string;
    email: string;
    department?: string;
  };
  tenders: TenderRecord[];
  onClose: () => void;
  onLogout: () => void;
  onRegisterTender: (data: Partial<TenderRecord>) => Promise<boolean>;
  onRefresh: () => Promise<void>;
}

export const PenyelarasPortal: React.FC<PenyelarasPortalProps> = ({
  currentUser,
  tenders,
  onClose,
  onLogout,
  onRegisterTender,
  onRefresh,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [formError, setFormError] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    titleEn: '',
    category: 'Kerja Jalan & Turapan',
    district: 'Seremban',
    cidb: 'CIDB G3 (CE21)',
    estimatedCost: 'RM 250,000.00',
    docPrice: 'RM 50.00',
    closingDate: '',
    siteVisit: 'Tidak Wajib / Tiada Lawatan Tapak',
    description: ''
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.title || !formData.closingDate || !formData.cidb) {
      setFormError('Sila lengkapkan semua medan mandatori yang bertanda (*).');
      return;
    }

    setFormError('');
    setIsSubmitting(true);
    try {
      const ok = await onRegisterTender({
        ...formData,
        createdBy: currentUser.username,
        createdByName: currentUser.name
      });

      if (ok) {
        setSuccessMsg(`Iklan ${formData.code} telah berjaya dihantar untuk semakan Pentadbir (Admin).`);
        setTimeout(() => setSuccessMsg(''), 5000);
        setShowAddForm(false);
        setFormData({
          code: '',
          title: '',
          titleEn: '',
          category: 'Kerja Jalan & Turapan',
          district: 'Seremban',
          cidb: 'CIDB G3 (CE21)',
          estimatedCost: 'RM 250,000.00',
          docPrice: 'RM 50.00',
          closingDate: '',
          siteVisit: 'Tidak Wajib / Tiada Lawatan Tapak',
          description: ''
        });
      } else {
        setFormError('Gagal menghantar iklan tender. Sila semak sambungan rangkaian atau data anda.');
      }
    } catch (err: any) {
      setFormError('Ralat berlaku semasa menghantar iklan tender.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Metrics
  const totalTenders = tenders.length;
  const pendingCount = tenders.filter((t) => t.status === 'menunggu_kelulusan').length;
  const approvedCount = tenders.filter((t) => t.status === 'buka').length;
  const closedCount = tenders.filter((t) => t.status === 'tutup' || t.status === 'keputusan').length;
  const rejectedCount = tenders.filter((t) => t.status === 'ditolak').length;

  // Filter
  const filteredTenders = tenders.filter((item) => {
    if (selectedStatusFilter !== 'Semua' && item.status !== selectedStatusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match =
        item.code.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.district.toLowerCase().includes(q) ||
        item.cidb.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans pb-16">
      {/* Header Penyelaras Iklan */}
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
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-slate-950 px-2 py-0.5 rounded font-mono">
                  Modul Penyelaras Iklan
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">
                  Unit Perolehan &amp; Tender JKR NS
                </span>
              </div>
              <h1 className="text-base sm:text-xl font-black text-white tracking-tight">
                Pusat Pendaftaran Iklan Tender &amp; Sebutharga
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-2 bg-slate-800/90 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
              <i className="fa-solid fa-user text-amber-400"></i>
              <span className="font-bold text-white">{currentUser.name}</span>
            </div>

            <button
              type="button"
              onClick={onRefresh}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs transition-colors cursor-pointer"
              title="Segar Semula"
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
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Notis Kejayaan */}
        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-2xl text-xs font-bold flex items-center justify-between shadow-sm animate-fadeIn">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-circle-check text-emerald-600 text-base"></i>
              <span>{successMsg}</span>
            </div>
            <button
              type="button"
              onClick={() => setSuccessMsg('')}
              className="text-emerald-700 hover:text-emerald-900"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        )}

        {/* Notis Aliran Kerja Rasmi */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 p-4 rounded-2xl shadow-xs flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-500 text-slate-950 rounded-xl mt-0.5">
              <i className="fa-solid fa-clock-rotate-left text-base"></i>
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-sm">
                Aliran Semakan Sebelum Hebahan Rasmi
              </h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                Setiap iklan tender atau sebut harga yang didaftarkan melalui modul ini akan berstatus <strong>Menunggu Kelulusan Admin</strong>. Pentadbir Utama (Admin) akan menyemak dokumen, spesifikasi CIDB dan tarikh tutup terlebih dahulu sebelum meluluskan siaran di portal awam.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex-shrink-0 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <i className={`fa-solid ${showAddForm ? 'fa-xmark' : 'fa-plus'} text-[#FFD100]`}></i>
            <span>{showAddForm ? 'Tutup Borang' : 'Daftar Iklan Baharu'}</span>
          </button>
        </div>

        {/* Ringkasan Metrik */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div
            onClick={() => setSelectedStatusFilter('Semua')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              selectedStatusFilter === 'Semua'
                ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                : 'bg-white text-slate-800 border-slate-200 hover:border-slate-400'
            }`}
          >
            <div className="text-xs font-bold uppercase tracking-wider opacity-75">Jumlah Iklan</div>
            <div className="text-2xl sm:text-3xl font-black mt-1">{totalTenders}</div>
            <div className="text-[11px] opacity-70 mt-1">Semua status</div>
          </div>

          <div
            onClick={() => setSelectedStatusFilter('menunggu_kelulusan')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              selectedStatusFilter === 'menunggu_kelulusan'
                ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md'
                : 'bg-white text-slate-800 border-slate-200 hover:border-amber-400'
            }`}
          >
            <div className="text-xs font-bold uppercase tracking-wider text-amber-600">Menunggu Kelulusan</div>
            <div className="text-2xl sm:text-3xl font-black mt-1 text-amber-600">{pendingCount}</div>
            <div className="text-[11px] text-slate-500 mt-1">Dalam semakan admin</div>
          </div>

          <div
            onClick={() => setSelectedStatusFilter('buka')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              selectedStatusFilter === 'buka'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-400'
            }`}
          >
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-600">Sedang Dibuka</div>
            <div className="text-2xl sm:text-3xl font-black mt-1 text-emerald-600">{approvedCount}</div>
            <div className="text-[11px] text-slate-500 mt-1">Aktif di portal awam</div>
          </div>

          <div
            onClick={() => setSelectedStatusFilter('tutup')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              selectedStatusFilter === 'tutup'
                ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                : 'bg-white text-slate-800 border-slate-200 hover:border-blue-400'
            }`}
          >
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600">Telah Ditutup / Keputusan</div>
            <div className="text-2xl sm:text-3xl font-black mt-1 text-blue-600">{closedCount}</div>
            <div className="text-[11px] text-slate-500 mt-1">Tamat tempoh tawaran</div>
          </div>
        </div>

        {/* BORANG DAFTAR IKLAN BAHARU */}
        {showAddForm && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-fadeIn">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-lg">
                  <i className="fa-solid fa-file-circle-plus"></i>
                </div>
                <div>
                  <h3 className="text-lg font-black">Borang Pendaftaran Iklan Tender / Sebut Harga Baharu</h3>
                  <p className="text-xs text-slate-300">
                    Maklumat ini akan dihantar kepada Pentadbir untuk proses semakan dan kelulusan rasmi.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 sm:p-8 space-y-5">
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-xs flex items-center gap-2 animate-shake">
                  <i className="fa-solid fa-triangle-exclamation flex-shrink-0"></i>
                  <span>{formError}</span>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    No. Rujukan Tender / Sebut Harga *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="Contoh: JKR/NS/JALAN/08/2026"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Daerah Lokasi Projek *
                  </label>
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
                  >
                    <option value="Seremban">Seremban</option>
                    <option value="Port Dickson">Port Dickson</option>
                    <option value="Rembau">Rembau</option>
                    <option value="Kuala Pilah">Kuala Pilah</option>
                    <option value="Jempol">Jempol</option>
                    <option value="Jelebu">Jelebu</option>
                    <option value="Tampin">Tampin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kategori Kejuruteraan *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
                  >
                    <option value="Kerja Jalan & Turapan">Kerja Jalan &amp; Turapan</option>
                    <option value="Kejuruteraan Jambatan">Kejuruteraan Jambatan</option>
                    <option value="Bangunan Awam">Bangunan Awam</option>
                    <option value="Elektrikal">Elektrikal &amp; Lampu Jalan</option>
                    <option value="Mekanikal">Mekanikal</option>
                    <option value="Kejuruteraan Cerun & Geoteknik">Kejuruteraan Cerun &amp; Geoteknik</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tajuk Tender / Sebut Harga (Bahasa Melayu) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Kerja-kerja Memperelok dan Menurap Semula Laluan FT001 (Seremban - Rembau)"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Gred &amp; Pengkhususan CIDB *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.cidb}
                    onChange={(e) => setFormData({ ...formData, cidb: e.target.value })}
                    placeholder="Contoh: CIDB G3 / G4 (CE21)"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tarikh Tutup Tawaran *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.closingDate}
                    onChange={(e) => setFormData({ ...formData, closingDate: e.target.value })}
                    placeholder="Contoh: 28 November 2026"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Harga Dokumen Tender
                  </label>
                  <input
                    type="text"
                    value={formData.docPrice}
                    onChange={(e) => setFormData({ ...formData, docPrice: e.target.value })}
                    placeholder="Contoh: RM 50.00 / Percuma"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Maklumat Lawatan Tapak (Site Visit)
                  </label>
                  <input
                    type="text"
                    value={formData.siteVisit}
                    onChange={(e) => setFormData({ ...formData, siteVisit: e.target.value })}
                    placeholder="Contoh: Wajib (15 Nov 2026, 10:00 AM di JKR Daerah)"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Anggaran Nilai Perolehan (Internal)
                  </label>
                  <input
                    type="text"
                    value={formData.estimatedCost}
                    onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
                    placeholder="Contoh: RM 450,000.00"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Keterangan &amp; Skop Kerja Tambahan
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Keterangan skop kerja, lokasi tepat, dan dokumen sokongan..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
                ></textarea>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-7 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60 shadow-md"
                >
                  {isSubmitting ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin text-amber-400"></i>
                      <span>Menghantar ke Admin...</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-paper-plane text-amber-400"></i>
                      <span>Hantar Iklan untuk Semakan Admin</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Carian & Senarai Iklan */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-black text-slate-900 text-base sm:text-lg flex items-center gap-2">
                <i className="fa-solid fa-file-contract text-amber-600"></i>
                <span>Senarai Iklan Tender &amp; Sebutharga Didaftarkan</span>
                <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold">
                  {filteredTenders.length} rekod
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Pantau status semakan dan kelulusan dari Pentadbir Utama JKR Negeri Sembilan.
              </p>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari no. tender / tajuk..."
                className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#FFD100] w-48 sm:w-60"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredTenders.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <i className="fa-solid fa-file-excel text-3xl mb-2 text-slate-300"></i>
                <p className="text-sm font-semibold">Tiada rekod iklan dijumpai.</p>
              </div>
            ) : (
              filteredTenders.map((item) => (
                <div key={item.id} className="p-5 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-black text-xs text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200">
                        {item.code}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-200 text-slate-800">
                        Daerah {item.district}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          item.status === 'buka'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'menunggu_kelulusan'
                            ? 'bg-amber-100 text-amber-800 animate-pulse'
                            : item.status === 'ditolak'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {item.status === 'menunggu_kelulusan'
                          ? '⏳ Menunggu Semakan Admin'
                          : item.status === 'buka'
                          ? '✓ Diluluskan & Dibuka'
                          : item.status === 'tutup'
                          ? 'Ditutup (Penilaian)'
                          : item.status === 'keputusan'
                          ? 'Keputusan Rasmi'
                          : 'Ditolak / Pindaan'}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">{item.title}</h4>

                    <div className="text-xs text-slate-500 flex flex-wrap gap-x-4 gap-y-1">
                      <span><i className="fa-solid fa-tag text-slate-400 mr-1"></i>{item.category}</span>
                      <span><i className="fa-solid fa-certificate text-amber-500 mr-1"></i>{item.cidb}</span>
                      <span><i className="fa-solid fa-calendar mr-1 text-slate-400"></i>Tutup: {item.closingDate}</span>
                      <span><i className="fa-solid fa-money-bill text-emerald-600 mr-1"></i>Dokumen: {item.docPrice || 'Percuma'}</span>
                    </div>

                    {item.reviewRemarks && (
                      <div className="text-[11px] bg-amber-50 text-amber-900 p-2 rounded-lg border border-amber-200 mt-1">
                        <span className="font-bold">Ulasan Pentadbir:</span> {item.reviewRemarks} (Disemak oleh: {item.reviewedBy || 'Admin'})
                      </div>
                    )}
                  </div>

                  <div className="flex-shrink-0 flex items-center gap-2">
                    {item.status === 'menunggu_kelulusan' && (
                      <span className="text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl font-bold border border-amber-200">
                        Sedang Dalam Tindakan Admin
                      </span>
                    )}
                    {item.status === 'buka' && (
                      <span className="text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl font-bold border border-emerald-200">
                        Aktif Pada Portal Awam
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

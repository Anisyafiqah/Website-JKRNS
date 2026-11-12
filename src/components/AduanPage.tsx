/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

interface CloudflareStatusInfo {
  connected: boolean;
  provider: string;
  storageType: string;
  totalRecords: number;
  instruction: string;
}

interface ComplaintRecord {
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
}

interface AduanPageProps {
  lang: 'BM' | 'EN';
  formData: {
    nama: string;
    telefon: string;
    daerah: string;
    kategori: string;
    keterangan: string;
    gps: string;
    gambar: string;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      nama: string;
      telefon: string;
      daerah: string;
      kategori: string;
      keterangan: string;
      gps: string;
      gambar: string;
    }>
  >;
  imagePreview: string | null;
  setImagePreview: React.Dispatch<React.SetStateAction<string | null>>;
  gpsStatus: string;
  detectUserLocation: () => void;
  isSubmitting: boolean;
  submitStatus: string | null;
  handleComplaintSubmit: (e: React.FormEvent) => Promise<void>;
  ticketSearchInput: string;
  setTicketSearchInput: React.Dispatch<React.SetStateAction<string>>;
  foundTicket: ComplaintRecord | null;
  handleTicketLookup: (e: React.FormEvent) => Promise<void>;
  cloudflareInfo: CloudflareStatusInfo;
  currentUser: any;
  onOpenAdminLogin: () => void;
  onOpenAdminPortal: () => void;
  onOpenModal: (title: string, content: string) => void;
}

export const AduanPage: React.FC<AduanPageProps> = ({
  lang,
  formData,
  setFormData,
  imagePreview,
  setImagePreview,
  gpsStatus,
  detectUserLocation,
  isSubmitting,
  submitStatus,
  handleComplaintSubmit,
  ticketSearchInput,
  setTicketSearchInput,
  foundTicket,
  handleTicketLookup,
  cloudflareInfo,
  currentUser,
  onOpenAdminLogin,
  onOpenAdminPortal,
  onOpenModal
}) => {
  const [activeTab, setActiveTab] = useState<'borang' | 'semak' | 'privasi'>('borang');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        onOpenModal(
          lang === 'BM' ? 'Saiz Fail Terlalu Besar' : 'File Too Large',
          lang === 'BM'
            ? 'Sila muat naik imej yang bersaiz kurang daripada 5MB.'
            : 'Please upload an image smaller than 5MB.'
        );
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
        setFormData((prev) => ({ ...prev, gambar: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full pb-16 animate-fadeIn">
      {/* Banner Tajuk Halaman */}
      <div className="bg-gradient-to-r from-[#0B0F19] via-slate-900 to-slate-800 text-white py-10 px-4 sm:px-6 lg:px-8 border-b-4 border-[#DC2626]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DC2626]/30 border border-[#DC2626]/50 text-[#FFD100] text-xs font-bold uppercase tracking-wider">
              <i className="fa-solid fa-headset text-sm"></i>
              <span>{lang === 'BM' ? 'Sistem e-Aduan Pintar 24 Jam' : '24-Hour Smart e-Complaint System'}</span>
            </div>

            {/* Cloudflare Sync Badge */}
            <div
              onClick={() =>
                onOpenModal(
                  'Status Sambungan Cloudflare',
                  `Maklumat Penyimpanan Cloudflare:\n\n` +
                    `Status: ${cloudflareInfo.connected ? 'Tersambung (Connected)' : 'Sedia untuk Disambung (Ready)'}\n` +
                    `Mod Storan: ${cloudflareInfo.provider}\n` +
                    `Jenis Enjin: ${cloudflareInfo.storageType}\n` +
                    `Jumlah Rekod Disimpan: ${cloudflareInfo.totalRecords}\n\n` +
                    `Panduan Integrasi:\n` +
                    cloudflareInfo.instruction
                )
              }
              className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/90 hover:bg-slate-700 border border-slate-600 text-xs text-slate-200 transition-colors shadow-sm"
              title="Klik untuk melihat perincian pangkalan data Cloudflare"
            >
              <i className="fa-solid fa-cloud text-sky-400"></i>
              <span className="font-semibold">
                {cloudflareInfo.connected ? 'Cloudflare: Tersambung' : 'Storan: Cloudflare Ready'}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {lang === 'BM' ? 'Sistem Pengurusan e-Aduan Jalan Raya' : 'Public Road Complaints Management'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
            {lang === 'BM'
              ? 'Tindakan segera 24 jam bagi kes jalan berlubang (potholes), lampu isyarat padam, tanah runtuh dan kerosakan infrastruktur jalan di 7 daerah Negeri Sembilan. Data disegerakkan secara selamat ke Cloudflare.'
              : 'Prompt 24-hour response for potholes, traffic lights, and public infrastructure damages across Negeri Sembilan. Complaint data securely synced to Cloudflare.'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Tab Penukar Modul e-Aduan */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('borang')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'borang'
                ? 'bg-[#111827] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
            }`}
          >
            <i className="fa-solid fa-pen-to-square mr-1.5 text-[#FFD100]"></i>
            {lang === 'BM' ? 'Hantar Aduan Baharu' : 'Submit New Complaint'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('semak')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'semak'
                ? 'bg-[#111827] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
            }`}
          >
            <i className="fa-solid fa-magnifying-glass mr-1.5 text-sky-400"></i>
            {lang === 'BM' ? 'Semak Status Tiket' : 'Track Ticket Status'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('privasi')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'privasi'
                ? 'bg-[#111827] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
            }`}
          >
            <i className="fa-solid fa-shield-halved mr-1.5 text-emerald-500"></i>
            {lang === 'BM' ? 'Privasi & Akses Admin' : 'Privacy & Admin Access'}
          </button>
        </div>

        {/* ================= TAB 1: BORANG ADUAN ================= */}
        {activeTab === 'borang' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-10">
            {submitStatus && (
              <div
                className={`p-4 mb-6 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-3 ${
                  submitStatus.includes('berjaya') || submitStatus.includes('successfully')
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                <i
                  className={`fa-solid ${
                    submitStatus.includes('berjaya') || submitStatus.includes('successfully')
                      ? 'fa-circle-check text-emerald-600'
                      : 'fa-triangle-exclamation text-red-600'
                  } text-lg`}
                ></i>
                <span>{submitStatus}</span>
              </div>
            )}

            <form onSubmit={handleComplaintSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {/* Nama */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {lang === 'BM' ? 'Nama Penuh Pengadu *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    placeholder={lang === 'BM' ? 'Contoh: Ahmad bin Razak' : 'e.g. John Doe'}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
                  />
                </div>

                {/* Telefon */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {lang === 'BM' ? 'Nombor Telefon Bimbit *' : 'Mobile Phone Number *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.telefon}
                    onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
                    placeholder="012-3456789"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
                  />
                </div>

                {/* Daerah */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {lang === 'BM' ? 'Daerah Lokasi Kejadian *' : 'District Location *'}
                  </label>
                  <select
                    value={formData.daerah}
                    onChange={(e) => setFormData({ ...formData, daerah: e.target.value })}
                    required
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

                {/* Kategori */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {lang === 'BM' ? 'Kategori Kerosakan *' : 'Damage Category *'}
                  </label>
                  <select
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
                  >
                    <option value="Jalan Berlubang (Pothole)">
                      {lang === 'BM' ? 'Jalan Berlubang (Pothole) - Tindakan 24 Jam' : 'Pothole (24h Action)'}
                    </option>
                    <option value="Lampu Isyarat Rosak">
                      {lang === 'BM' ? 'Lampu Isyarat Rosak / Padam' : 'Traffic Light Fault'}
                    </option>
                    <option value="Lampu Jalan Gelap">
                      {lang === 'BM' ? 'Lampu Jalan Gelap / Tidak Menyala' : 'Street Light Outage'}
                    </option>
                    <option value="Tanah Runtuh / Cerun">
                      {lang === 'BM' ? 'Runtuhan Tanah / Cerun Berisiko' : 'Landslide / Slope Issue'}
                    </option>
                    <option value="Penghadang Jalan Rosak">
                      {lang === 'BM' ? 'Penghadang Jalan (Guardrail) Kemek/Rosak' : 'Guardrail Damage'}
                    </option>
                    <option value="Papan Tanda Tumbang">
                      {lang === 'BM' ? 'Papan Tanda Hilang / Tumbang' : 'Missing/Fallen Road Sign'}
                    </option>
                    <option value="Banjir Kilat Laluan">
                      {lang === 'BM' ? 'Banjir Kilat / Saliran Tersumbat' : 'Flash Flood / Clogged Drain'}
                    </option>
                  </select>
                </div>

                {/* GPS */}
                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      {lang === 'BM' ? 'Koordinat GPS Lokasi (Masa Nyata)' : 'GPS Coordinates (Live)'}
                    </label>
                    <button
                      type="button"
                      onClick={detectUserLocation}
                      className="text-[11px] font-bold text-[#DC2626] hover:text-[#991B1B] flex items-center gap-1 cursor-pointer"
                    >
                      <i className="fa-solid fa-location-crosshairs"></i>
                      <span>{lang === 'BM' ? 'Kesan Lokasi Saya' : 'Detect My Location'}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={formData.gps}
                    onChange={(e) => setFormData({ ...formData, gps: e.target.value })}
                    placeholder="Contoh: 2.69225° N, 101.90562° E"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
                  />
                  {gpsStatus && <p className="text-[11px] text-slate-500 mt-1 italic">{gpsStatus}</p>}
                </div>
              </div>

              {/* Keterangan */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {lang === 'BM' ? 'Keterangan Kerosakan & Mercu Tanda *' : 'Description & Nearby Landmarks *'}
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.keterangan}
                  onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                  placeholder={
                    lang === 'BM'
                      ? 'Contoh: Lubang sedalam 10cm di lorong kiri, 100 meter selepas stesen minyak Petronas arah Rembau.'
                      : 'e.g. 10cm deep pothole on left lane, 100m after Petronas station towards Rembau.'
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
                ></textarea>
              </div>

              {/* Muat Naik Gambar */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {lang === 'BM' ? 'Muat Naik Gambar Kerosakan (Pilihan)' : 'Upload Photo (Optional)'}
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#111827] file:text-white hover:file:bg-slate-800 cursor-pointer"
                  />
                  {imagePreview && (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Pratonton Aduan"
                        className="h-12 w-12 object-cover rounded-lg border border-slate-300 shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setFormData((prev) => ({ ...prev, gambar: '' }));
                        }}
                        className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] cursor-pointer"
                      >
                        &times;
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Butang Hantar */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full sm:w-auto px-8 py-3 bg-[#DC2626] hover:bg-[#991B1B] text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 cursor-pointer ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin text-[#FFD100]"></i>
                      <span>{lang === 'BM' ? 'Menyimpan ke Cloudflare...' : 'Saving to Cloudflare...'}</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-paper-plane text-[#FFD100]"></i>
                      <span>{lang === 'BM' ? 'Hantar Laporan Aduan' : 'Submit Complaint Ticket'}</span>
                    </>
                  )}
                </button>
                <span className="text-xs text-slate-500 text-center sm:text-left flex items-center gap-1.5">
                  <i className="fa-solid fa-shield-halved text-emerald-600"></i>
                  <span>
                    {lang === 'BM'
                      ? 'Disimpan dalam storan disulitkan JKR NS & disinkronkan ke Cloudflare.'
                      : 'Encrypted storage with real-time Cloudflare synchronization.'}
                  </span>
                </span>
              </div>
            </form>
          </div>
        )}

        {/* ================= TAB 2: SEMAK STATUS TIKET ================= */}
        {activeTab === 'semak' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 space-y-6">
            <div>
              <h3 className="text-xl font-black text-slate-900">
                {lang === 'BM' ? 'Semakan Status Tiket Aduan Awam' : 'Complaint Ticket Status Tracking'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {lang === 'BM'
                  ? 'Masukkan nombor rujukan aduan (cth: JKRNS-2026-XXXXXX) yang diterima semasa pendaftaran.'
                  : 'Enter your complaint reference code (e.g. JKRNS-2026-XXXXXX) issued upon registration.'}
              </p>
            </div>

            <form onSubmit={handleTicketLookup} className="flex flex-col sm:flex-row gap-3 max-w-xl">
              <input
                type="text"
                required
                value={ticketSearchInput}
                onChange={(e) => setTicketSearchInput(e.target.value.toUpperCase())}
                placeholder="JKRNS-2026-XXXXXX"
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-sm uppercase focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
              />
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#111827] hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <i className="fa-solid fa-search text-[#FFD100]"></i>
                <span>{lang === 'BM' ? 'Semak Status' : 'Check Status'}</span>
              </button>
            </form>

            {foundTicket && (
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 max-w-2xl">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block">NOMBOR TIKET</span>
                    <span className="font-mono font-black text-base text-slate-900">{foundTicket.id}</span>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      foundTicket.status === 'Selesai'
                        ? 'bg-emerald-100 text-emerald-800'
                        : foundTicket.status === 'Tindakan Pembaikan'
                        ? 'bg-blue-100 text-blue-800'
                        : foundTicket.status === 'Dalam Siasatan'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {foundTicket.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 font-bold block">Nama Pengadu:</span>
                    <span className="text-slate-900 font-semibold">{foundTicket.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold block">Daerah Bertanggungjawab:</span>
                    <span className="text-slate-900 font-semibold">JKR Daerah {foundTicket.district}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold block">Kategori Kerosakan:</span>
                    <span className="text-slate-900 font-semibold">{foundTicket.category}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold block">Tarikh Didaftarkan:</span>
                    <span className="text-slate-900 font-mono text-[11px]">{foundTicket.timestamp}</span>
                  </div>
                </div>

                <div className="text-xs pt-2 border-t border-slate-200">
                  <span className="text-slate-500 font-bold block mb-1">Perincian Kerosakan:</span>
                  <p className="text-slate-700 bg-white p-3 rounded-xl border border-slate-200 leading-relaxed">
                    {foundTicket.description}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: PRIVASI & AKSES ADMIN ================= */}
        {activeTab === 'privasi' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-[#FFD100] flex items-center justify-center text-xl flex-shrink-0 shadow-md">
                <i className="fa-solid fa-user-shield"></i>
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-lg sm:text-xl">
                  Kawalan Akses &amp; Perlindungan Privasi e-Aduan
                </h3>
                <span className="text-xs text-amber-700 font-bold">
                  Akta Perlindungan Data Peribadi 2010 (Akta 709)
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Demi memelihara kerahsiaan dan keselamatan data peribadi pengadu, <strong>antaramuka senarai aduan lengkap dan fungsi pengemaskinian status tindakan hanya boleh diakses oleh Pegawai Pentadbir (Admin) JKR Negeri Sembilan yang disahkan</strong>.
            </p>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="text-xs text-slate-600 space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <i className="fa-solid fa-lock text-[#DC2626]"></i>
                  <span>Akses Terhad Pegawai Pentadbir Sistem:</span>
                </div>
                <p className="text-slate-500">
                  Log masuk menggunakan kelayakan rasmi untuk menyemak senarai aduan masuk dan mengemaskini status pembaikan tapak.
                </p>
              </div>

              {currentUser ? (
                <button
                  type="button"
                  onClick={onOpenAdminPortal}
                  className="px-5 py-2.5 bg-[#111827] hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm cursor-pointer whitespace-nowrap"
                >
                  <i className="fa-solid fa-shield-halved text-[#FFD100]"></i>
                  <span>Buka Papan Pemuka Admin</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onOpenAdminLogin}
                  className="px-5 py-2.5 bg-[#111827] hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm cursor-pointer whitespace-nowrap"
                >
                  <i className="fa-solid fa-right-to-bracket text-[#FFD100]"></i>
                  <span>Log Masuk Admin JKR</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

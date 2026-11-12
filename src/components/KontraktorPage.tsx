/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TenderRecord } from './PenyelarasPortal';
import { CMSContent } from '../data/defaultCmsContent';

interface KontraktorPageProps {
  lang: 'BM' | 'EN';
  tenders: TenderRecord[];
  onOpenModal: (title: string, content: string) => void;
  currentUser: any;
  onOpenPenyelarasPortal: () => void;
  onOpenAdminPortal: () => void;
  cmsPolicies?: CMSContent['kontraktorPolicies'];
}

export const KontraktorPage: React.FC<KontraktorPageProps> = ({
  lang,
  tenders,
  onOpenModal,
  currentUser,
  onOpenPenyelarasPortal,
  onOpenAdminPortal,
  cmsPolicies
}) => {
  const [tenderFilter, setTenderFilter] = useState<'semua' | 'buka' | 'tutup' | 'keputusan'>('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTabResource, setActiveTabResource] = useState<'tender' | 'panduan' | 'syarat' | 'abms'>('tender');

  const activePublicTenders = tenders.filter(
    (t) => ['buka', 'tutup', 'keputusan'].includes(t.status)
  );

  const filteredTenders = activePublicTenders.filter((item) => {
    const matchesFilter = tenderFilter === 'semua' || item.status === tenderFilter;
    if (!matchesFilter) return false;
    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      (item.titleEn && item.titleEn.toLowerCase().includes(q)) ||
      item.code.toLowerCase().includes(q) ||
      item.district.toLowerCase().includes(q) ||
      item.cidb.toLowerCase().includes(q)
    );
  });

  return (
    <div className="w-full pb-16 animate-fadeIn">
      {/* Banner Tajuk Halaman */}
      <div className="bg-gradient-to-r from-[#0B0F19] via-slate-900 to-slate-800 text-white py-10 px-4 sm:px-6 lg:px-8 border-b-4 border-[#FFD100]">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DC2626]/30 border border-[#DC2626]/50 text-[#FFD100] text-xs font-bold uppercase tracking-wider mb-3">
            <i className="fa-solid fa-file-contract"></i>
            <span>{lang === 'BM' ? 'Modul Perolehan & Kontrak' : 'Procurement & Contracts'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {lang === 'BM' ? 'Portal Kontraktor: Tender & Sebut Harga' : 'Contractor Portal: Tenders & Bidding'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
            {lang === 'BM'
              ? 'Pusat maklumat perolehan rasmi Kerajaan Negeri Sembilan. Semak tawaran pembinaan kejuruteraan awam, mekanikal, elektrikal, muat turun dokumen tawaran dan semak keputusan rasmi.'
              : 'Official procurement portal for civil, mechanical, and electrical engineering contracts across Negeri Sembilan.'}
          </p>

          {/* Action pills for staff */}
          {currentUser && (
            <div className="mt-4 flex items-center gap-3">
              {currentUser.role === 'Penyelaras Iklan' && (
                <button
                  type="button"
                  onClick={onOpenPenyelarasPortal}
                  className="px-4 py-2 bg-[#FFD100] text-slate-950 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer hover:bg-yellow-400"
                >
                  <i className="fa-solid fa-plus-circle text-[#DC2626]"></i>
                  <span>Daftar Iklan Tender Baharu</span>
                </button>
              )}
              {currentUser.role === 'Admin' && (
                <button
                  type="button"
                  onClick={onOpenAdminPortal}
                  className="px-4 py-2 bg-[#DC2626] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer hover:bg-red-700"
                >
                  <i className="fa-solid fa-shield-halved text-[#FFD100]"></i>
                  <span>Semak &amp; Luluskan Iklan (Admin)</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Tab Penukar Modul Kontraktor */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
          <button
            type="button"
            onClick={() => setActiveTabResource('tender')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTabResource === 'tender'
                ? 'bg-[#111827] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
            }`}
          >
            <i className="fa-solid fa-list-check mr-1.5 text-[#FFD100]"></i>
            {lang === 'BM' ? 'Iklan Tender & Sebut Harga' : 'Tenders & Quotations'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTabResource('syarat')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTabResource === 'syarat'
                ? 'bg-[#111827] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
            }`}
          >
            <i className="fa-solid fa-certificate mr-1.5 text-blue-500"></i>
            {lang === 'BM' ? 'Syarat Pendaftaran CIDB / SPKK' : 'CIDB / SPKK Registration'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTabResource('panduan')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTabResource === 'panduan'
                ? 'bg-[#111827] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
            }`}
          >
            <i className="fa-solid fa-receipt mr-1.5 text-emerald-500"></i>
            {lang === 'BM' ? 'Tuntutan Bayaran Interim (IPC)' : 'Interim Payments (IPC)'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTabResource('abms')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTabResource === 'abms'
                ? 'bg-[#111827] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
            }`}
          >
            <i className="fa-solid fa-scale-balanced mr-1.5 text-purple-500"></i>
            {lang === 'BM' ? 'Polisi Anti-Rasuah (ISO 37001 ABMS)' : 'Anti-Bribery Policy'}
          </button>
        </div>

        {/* KANDUNGAN TAB 1: IKLAN TENDER */}
        {activeTabResource === 'tender' && (
          <div className="space-y-6">
            {/* Filter & Carian */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setTenderFilter('semua')}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    tenderFilter === 'semua'
                      ? 'bg-[#111827] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {lang === 'BM' ? `Semua (${activePublicTenders.length})` : `All (${activePublicTenders.length})`}
                </button>
                <button
                  type="button"
                  onClick={() => setTenderFilter('buka')}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    tenderFilter === 'buka'
                      ? 'bg-[#111827] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block mr-1.5"></span>
                  {lang === 'BM' ? 'Sedang Dibuka' : 'Open'}
                </button>
                <button
                  type="button"
                  onClick={() => setTenderFilter('tutup')}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    tenderFilter === 'tutup'
                      ? 'bg-[#111827] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block mr-1.5"></span>
                  {lang === 'BM' ? 'Ditutup (Penilaian)' : 'Closed'}
                </button>
                <button
                  type="button"
                  onClick={() => setTenderFilter('keputusan')}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    tenderFilter === 'keputusan'
                      ? 'bg-[#111827] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-blue-500 inline-block mr-1.5"></span>
                  {lang === 'BM' ? 'Keputusan Rasmi' : 'Awarded'}
                </button>
              </div>

              <div className="relative w-full md:w-80">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={lang === 'BM' ? 'Cari tajuk, nombor kod, daerah...' : 'Search title, code, district...'}
                  className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
                />
                <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                )}
              </div>
            </div>

            {/* Senarai Tender */}
            <div className="grid grid-cols-1 gap-4">
              {filteredTenders.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm">
                  <i className="fa-solid fa-folder-open text-4xl text-slate-300 mb-2"></i>
                  <p className="text-slate-500 text-sm font-semibold">
                    {lang === 'BM' ? 'Tiada rekod tender atau sebut harga dipadankan.' : 'No tenders matched.'}
                  </p>
                </div>
              ) : (
                filteredTenders.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2 max-w-3xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded border border-slate-200">
                          {item.code}
                        </span>
                        <span className="text-xs font-semibold text-slate-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Daerah: {item.district}
                        </span>
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            item.status === 'buka'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.status === 'tutup'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {lang === 'BM' ? item.statusLabelMs : item.statusLabelEn}
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-900 text-base sm:text-lg leading-snug">
                        {lang === 'BM' ? item.title : item.titleEn || item.title}
                      </h4>

                      <div className="flex flex-wrap gap-y-1 gap-x-4 text-xs text-slate-500">
                        <div>
                          <span className="font-bold text-slate-700">
                            {lang === 'BM' ? 'Kelayakan CIDB:' : 'CIDB Grade:'}
                          </span>{' '}
                          {item.cidb}
                        </div>
                        <div>
                          <span className="font-bold text-slate-700">
                            {lang === 'BM' ? 'Tarikh Tutup:' : 'Closing Date:'}
                          </span>{' '}
                          {item.closingDate}
                        </div>
                        {item.winner && (
                          <div className="text-blue-700 font-semibold">
                            <span className="font-bold text-slate-700">
                              {lang === 'BM' ? 'Kontraktor Berjaya:' : 'Awarded To:'}
                            </span>{' '}
                            {item.winner}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-shrink-0 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          onOpenModal(
                            lang === 'BM' ? `Perincian Tender: ${item.code}` : `Tender Details: ${item.code}`,
                            `Nombor Kod: ${item.code}\nTajuk Projek: ${item.title}\nDaerah: ${item.district}\nKelayakan: ${item.cidb}\nTarikh Tutup Tawaran: ${item.closingDate}\nStatus: ${
                              item.status === 'buka'
                                ? 'Sedang Dibuka (Dokumen boleh dibeli)'
                                : item.status === 'tutup'
                                ? 'Telah Ditutup (Dalam Proses Penilaian)'
                                : `Selesai Dianugerahkan kepada: ${item.winner || 'Kontraktor Terpilih'}`
                            }\n\nTempat Penyerahan Dokumen: Peti Tender, Bahagian Kontrak dan Ukur Bahan (BKUB), Tingkat 2, Kompleks Kerja Raya Seremban 2.`
                          )
                        }
                        className="w-full md:w-auto px-4 py-2.5 bg-[#111827] hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <i className="fa-solid fa-file-pdf text-[#FFD100]"></i>
                        <span>{lang === 'BM' ? 'Maklumat Lengkap' : 'Full Details'}</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* KANDUNGAN TAB 2: SYARAT PENDAFTARAN CIDB / SPKK */}
        {activeTabResource === 'syarat' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-xl font-black text-slate-900">
                Syarat Pendaftaran Kontraktor &amp; Perolehan Kerajaan
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Semua kontraktor yang ingin menyertai tender dan sebut harga JKR Negeri Sembilan wajib mematuhi kriteria kelayakan berikut.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg">
                  <i className="fa-solid fa-id-card"></i>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Pendaftaran CIDB &amp; SPKK</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Memiliki Perakuan Pendaftaran Kontraktor (PPK) CIDB yang masih sah tempoh dan Sijil Perolehan Kerja Kerajaan (SPKK) dalam gred dan kategori yang ditetapkan (G1 hingga G7).
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-lg">
                  <i className="fa-solid fa-building-flag"></i>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Sijil Taraf Bumiputera (STB)</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Bagi tender/sebut harga yang dikhususkan kepada Bumiputera, kontraktor perlu memiliki Sijil Taraf Bumiputera yang sah daripada Pusat Khidmat Kontraktor (PKK) / Kementerian Kewangan.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-lg">
                  <i className="fa-solid fa-laptop-code"></i>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Sistem e-Perolehan Kerajaan</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Berdaftar dengan sistem e-Perolehan Kerajaan Negeri Sembilan dan mempunyai sijil digital sah bagi urusan muat turun dokumen dan penyerahan sebut harga secara elektronik.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* KANDUNGAN TAB 3: BAYARAN INTERIM (IPC) */}
        {activeTabResource === 'panduan' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-xl font-black text-slate-900">
                {cmsPolicies?.ipcCharter?.title || 'Piagam Tuntutan Bayaran Kemajuan Kerja (Interim IPC 14 Hari)'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                JKR Negeri Sembilan komited menyelesaikan perakuan bayaran kontraktor dalam tempoh {cmsPolicies?.ipcCharter?.targetDays || 14} hari selepas tuntutan lengkap diterima.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {cmsPolicies?.ipcCharter?.steps && cmsPolicies.ipcCharter.steps.length > 0 ? (
                cmsPolicies.ipcCharter.steps.map((st) => (
                  <div key={st.step} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="w-7 h-7 rounded-lg bg-[#111827] text-[#FFD100] text-xs font-bold flex items-center justify-center">
                      {st.step}
                    </span>
                    <h5 className="font-bold text-slate-900 text-xs">{st.title}</h5>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{st.desc}</p>
                  </div>
                ))
              ) : (
                <>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="w-7 h-7 rounded-lg bg-[#111827] text-[#FFD100] text-xs font-bold flex items-center justify-center">
                      1
                    </span>
                    <h5 className="font-bold text-slate-900 text-xs">Penyerahan Tuntutan</h5>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Kontraktor menyerahkan tuntutan bayaran bersama invois, dokumen kuantiti tapak dan gambar kemajuan kerja.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="w-7 h-7 rounded-lg bg-[#111827] text-[#FFD100] text-xs font-bold flex items-center justify-center">
                      2
                    </span>
                    <h5 className="font-bold text-slate-900 text-xs">Pengukuran &amp; Penilaian Tapak</h5>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Pegawai Penguasa (S.O) bersama Juruukur Bahan menyemak dan mengesahkan kemajuan fizikal sebenar di tapak bina.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="w-7 h-7 rounded-lg bg-[#111827] text-[#FFD100] text-xs font-bold flex items-center justify-center">
                      3
                    </span>
                    <h5 className="font-bold text-slate-900 text-xs">Pengeluaran Sijil IPC</h5>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Bahagian Kontrak &amp; Ukur Bahan (BKUB) mengeluarkan Perakuan Bayaran Interim dalam tempoh 14 hari kalendar.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="w-7 h-7 rounded-lg bg-[#111827] text-[#FFD100] text-xs font-bold flex items-center justify-center">
                      4
                    </span>
                    <h5 className="font-bold text-slate-900 text-xs">Pemprosesan Bayaran (iSPEKS)</h5>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Bahagian Kewangan memproses Electronic Fund Transfer (EFT) terus ke akaun bank kontraktor.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* KANDUNGAN TAB 4: ABMS */}
        {activeTabResource === 'abms' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="p-5 rounded-2xl bg-gradient-to-r from-red-50 to-amber-50 border-l-8 border-[#DC2626]">
              <h4 className="text-base font-black text-slate-900">
                {cmsPolicies?.abmsPolicy?.title || 'Polisi Sifar Toleransi Terhadap Rasuah & Sistem Pengurusan Anti-Rasuah (ISO 37001 ABMS)'}
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {cmsPolicies?.abmsPolicy?.statement || 'Jabatan Kerja Raya Negeri Sembilan mengamalkan polisi sifar toleransi terhadap sebarang bentuk rasuah, suapan, penipuan, penyelewengan, atau konflik kepentingan dalam semua peringkat proses perolehan tender dan pentadbiran kontrak kerajaan.'}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <i className="fa-solid fa-ban text-[#DC2626] text-base mt-0.5"></i>
                <div>
                  <strong className="text-slate-900 block mb-1">Larangan Pemberian Hadiah:</strong>
                  Semua pegawai dan kakitangan JKR NS dilarang menerima sebarang hadiah, keraian, atau tajaan daripada mana-mana pihak kontraktor atau pembekal.
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <i className="fa-solid fa-bullhorn text-amber-600 text-base mt-0.5"></i>
                <div>
                  <strong className="text-slate-900 block mb-1">Saluran Tiupan Wisel (Whistleblowing):</strong>
                  Sebarang cubaan salah laku atau tawaran rasuah boleh dilaporkan terus kepada Unit Integriti JKR NS atau melalui emel rasmi{' '}
                  <span className="font-mono text-[#DC2626] font-bold">
                    {cmsPolicies?.abmsPolicy?.whistleblowerEmail || 'integriti.jkrns@ns.gov.my'}
                  </span>{' '}
                  dengan perlindungan identiti pengadu.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

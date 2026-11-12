/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CMSContent } from '../data/defaultCmsContent';

interface PusatMuatTurunProps {
  lang: 'BM' | 'EN';
  onOpenModal: (title: string, content: string) => void;
  cmsDownloads?: CMSContent['downloads'];
}

interface DownloadItem {
  id: string;
  category: 'borang' | 'pekeliling' | 'panduan' | 'arkib';
  title: string;
  titleEn: string;
  format: string;
  fileSize: string;
  refNo: string;
  description: string;
  fileUrl?: string;
}

const DOWNLOAD_ITEMS: DownloadItem[] = [
  {
    id: 'd-1',
    category: 'borang',
    title: 'Borang Permohonan Permit Mengorek Jalan & Pemasangan Utiliti JKR NS',
    titleEn: 'Application Form for Utility Trenching & Road Digging Permit',
    format: 'PDF',
    fileSize: '1.4 MB',
    refNo: 'JKR/NS/UTILITI/2026/01',
    description: 'Borang rasmi yang wajib diisi oleh pihak utiliti (TNB, SAINS, TM, dsb.) bersama lukisan pelan laluan (ROW) sebelum sebarang pengorekan dijalankan.'
  },
  {
    id: 'd-2',
    category: 'borang',
    title: 'Borang Permohonan Latihan Industri / Internship Pelajar Kejuruteraan',
    titleEn: 'Industrial Training / Internship Application Form',
    format: 'DOCX',
    fileSize: '450 KB',
    refNo: 'JKR/NS/LI/2026/REV3',
    description: 'Borang permohonan penempatan latihan praktikal bagi pelajar Ijazah dan Diploma bidang Kejuruteraan Awam, Elektrik, Mekanikal dan Ukur Bahan.'
  },
  {
    id: 'd-3',
    category: 'panduan',
    title: 'Garis Panduan Pelan Pengurusan Trafik (TMP) di Tapak Bina JKR NS',
    titleEn: 'Traffic Management Plan (TMP) Operational Guidelines for Workzones',
    format: 'PDF',
    fileSize: '3.8 MB',
    refNo: 'ATJ 2C/85 (Pindaan JKRNS)',
    description: 'Spesifikasi penempatan kon keselamatan, papan tanda amaran berlampu, dan prosedur flagmen bagi memelihara keselamatan zon kerja.'
  },
  {
    id: 'd-4',
    category: 'pekeliling',
    title: 'Pekeliling Integriti Perolehan & Sistem Pengurusan Anti-Rasuah (ISO 37001 ABMS)',
    titleEn: 'Procurement Integrity Circular & Anti-Bribery Management Standard',
    format: 'PDF',
    fileSize: '890 KB',
    refNo: 'PK/JKRNS/ABMS/01/2026',
    description: 'Dasar sifar toleransi terhadap rasuah, pemberian hadiah dan konflik kepentingan dalam semua urusan perolehan kerajaan negeri.'
  },
  {
    id: 'd-5',
    category: 'borang',
    title: 'Senarai Semak Penyerahan Perakuan Bayaran Interim (IPC) Kontraktor',
    titleEn: 'Interim Payment Certificate (IPC) Submission Checklist',
    format: 'PDF',
    fileSize: '620 KB',
    refNo: 'BKUB/NS/CHECKLIST/IPC',
    description: 'Dokumen semakan wajib yang perlu disertakan kontraktor bersama invois dan perakuan kuantiti tapak bagi membolehkan pembayaran 14 hari.'
  },
  {
    id: 'd-6',
    category: 'panduan',
    title: 'Standard Spesifikasi Pembinaan Jalan & Jambatan JKR (Standard Specification for Road Works)',
    titleEn: 'JKR Standard Specification for Road Works (Blue Book)',
    format: 'PDF',
    fileSize: '5.2 MB',
    refNo: 'JKR/SPJ/2020-S4',
    description: 'Rujukan teknikal piawaian ujian pemadatan turapan jalan, campuran asfalt asfaltik konkrit (ACW/ACB), dan struktur pembetung.'
  }
];

export const PusatMuatTurun: React.FC<PusatMuatTurunProps> = ({ lang, onOpenModal, cmsDownloads }) => {
  const [activeCategory, setActiveCategory] = useState<'semua' | 'borang' | 'pekeliling' | 'panduan'>('semua');

  // Convert CMS downloads to unified items
  const effectiveItems: DownloadItem[] = React.useMemo(() => {
    if (cmsDownloads && cmsDownloads.length > 0) {
      return cmsDownloads.map((d) => {
        let cat: 'borang' | 'pekeliling' | 'panduan' | 'arkib' = 'borang';
        if (d.category.includes('Pekeliling')) cat = 'pekeliling';
        else if (d.category.includes('Panduan')) cat = 'panduan';
        else if (d.category.includes('Arkib')) cat = 'arkib';

        return {
          id: d.id,
          category: cat,
          title: d.title,
          titleEn: d.title,
          format: d.format || 'PDF',
          fileSize: d.fileSize || '1.0 MB',
          refNo: d.updateDate || 'JKR/NS/DOC',
          description: `Kategori: ${d.category} • Dikemaskini: ${d.updateDate}`,
          fileUrl: d.fileUrl
        };
      });
    }
    return DOWNLOAD_ITEMS;
  }, [cmsDownloads]);

  const filtered = effectiveItems.filter((item) => {
    if (activeCategory === 'semua') return true;
    return item.category === activeCategory;
  });

  return (
    <section id="muatTurunSection" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
            <i className="fa-solid fa-folder-open"></i>
            <span>{lang === 'BM' ? 'Pusat Sumber & Penerbitan' : 'Resource Center'}</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {lang === 'BM' ? 'Pusat Muat Turun Borang & Dokumen Rasmi' : 'Official Forms & Downloads'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            {lang === 'BM'
              ? 'Dapatkan borang permohonan permit korekan jalan, senarai semak bayaran interim, pekeliling tender, dan garis panduan teknikal.'
              : 'Access trenching permit application forms, interim payment checklists, and official circulars.'}
          </p>
        </div>

        {/* Tab Penapis */}
        <div className="inline-flex p-1 bg-slate-200/90 rounded-2xl">
          {[
            { id: 'semua', label: 'Semua', labelEn: 'All' },
            { id: 'borang', label: 'Borang Rasmi', labelEn: 'Forms' },
            { id: 'panduan', label: 'Garis Panduan', labelEn: 'Guidelines' },
            { id: 'pekeliling', label: 'Pekeliling', labelEn: 'Circulars' }
          ].map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiveCategory(c.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCategory === c.id
                  ? 'bg-[#111827] text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              {lang === 'BM' ? c.label : c.labelEn}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                  {item.category}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    item.format === 'PDF' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {item.format} • {item.fileSize}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-mono block mb-1">
                  Kod: {item.refNo}
                </span>
                <h4 className="font-bold text-slate-900 text-sm leading-snug">
                  {lang === 'BM' ? item.title : item.titleEn}
                </h4>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              {item.fileUrl ? (
                <a
                  href={item.fileUrl}
                  download={item.title}
                  className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs text-center"
                >
                  <i className="fa-solid fa-cloud-arrow-down text-[#FFD100]"></i>
                  <span>{lang === 'BM' ? 'Muat Turun Fail' : 'Download File'}</span>
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    onOpenModal(
                      `Muat Turun: ${item.title}`,
                      `Dokumen: ${item.title}\nNombor Rujukan: ${item.refNo}\nFormat: ${item.format} (${item.fileSize})\n\nPautan muat turun rasmi sedia dimuat turun. Fail disemak bebas daripada perisian hasad melalui gerbang keselamatan ICT JKR NS.`
                    )
                  }
                  className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <i className="fa-solid fa-cloud-arrow-down text-[#FFD100]"></i>
                  <span>{lang === 'BM' ? 'Muat Turun Dokumen' : 'Download Document'}</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

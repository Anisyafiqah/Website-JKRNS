/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CMSContent } from '../data/defaultCmsContent';

interface WargaJKRNSProps {
  lang: 'BM' | 'EN';
  onOpenModal: (title: string, content: string) => void;
  onOpenAdminLogin: () => void;
  cmsLinks?: CMSContent['wargaLinks'];
}

interface StaffSystem {
  id: string;
  name: string;
  desc: string;
  icon: string;
  color: string;
  url: string;
  isExternal?: boolean;
}

const STAFF_SYSTEMS: StaffSystem[] = [
  {
    id: 'hrmis',
    name: 'HRMIS 2.0',
    desc: 'Sistem Maklumat Pengurusan Sumber Manusia Perkhidmatan Awam (Cuti rehat, Prestasi LNPT, Profil Perjawatan MyHRMIS).',
    icon: 'fa-user-gear',
    color: 'bg-blue-600 text-white',
    url: 'https://hrmis2.eghrmis.gov.my'
  },
  {
    id: 'ispeks',
    name: 'iSPEKS',
    desc: 'Sistem Perakaunan Akruan Kerajaan Negeri (Baucar Bayaran, Pesanan Kerajaan, Pesanan Tempatan LO dan Penyata Akaun).',
    icon: 'fa-calculator',
    color: 'bg-emerald-600 text-white',
    url: 'https://ispeks.anm.gov.my'
  },
  {
    id: 'skala',
    name: 'SKALA JKR',
    desc: 'Sistem Kawalan dan Laporan Projek Bersepadu JKR Malaysia untuk pemantauan jadual kemajuan fizikal dan kewangan projek.',
    icon: 'fa-chart-pie',
    color: 'bg-amber-500 text-white',
    url: 'https://skala.jkr.gov.my'
  },
  {
    id: 'ekursus',
    name: 'e-Kursus & CPD BEM',
    desc: 'Pendaftaran kursus kompetensi kejuruteraan CREaTE JKR dan rekod mata CPD berterusan Lembaga Jurutera Malaysia (BEM).',
    icon: 'fa-graduation-cap',
    color: 'bg-purple-600 text-white',
    url: 'https://ekursus.jkr.gov.my'
  },
  {
    id: 'myjalan',
    name: 'MyJalan KKR',
    desc: 'Portal pemantauan dan pengesanan aduan kerosakan jalan raya Kementerian Kerja Raya untuk tindakan pantas sifar lubang jalan.',
    icon: 'fa-road',
    color: 'bg-[#DC2626] text-white',
    url: 'https://myjalan.kkr.gov.my'
  },
  {
    id: 'mykj',
    name: 'My-KJ (Knowledge Hub)',
    desc: 'Pusat repositori pengurusan ilmu kejuruteraan, manual reka bentuk jalan, lukisan piawai JKR dan spesifikasi teknikal.',
    icon: 'fa-book-atlas',
    color: 'bg-teal-600 text-white',
    url: 'https://mykj.jkr.gov.my'
  }
];

export const WargaJKRNS: React.FC<WargaJKRNSProps> = ({
  lang,
  onOpenModal,
  onOpenAdminLogin,
  cmsLinks
}) => {
  return (
    <section id="wargaJkrnsSection" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full scroll-mt-20">
      <span id="sistemStafSection" className="block -mt-20 pt-20"></span>
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-[#111827] text-white rounded-3xl p-6 sm:p-8 md:p-10 border border-slate-700 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD100]/20 border border-[#FFD100]/40 text-[#FFD100] text-xs font-bold uppercase tracking-wider mb-2">
              <i className="fa-solid fa-users-gear"></i>
              <span>{lang === 'BM' ? 'Warga JKRNS • Portal Digital & Intranet' : 'Warga JKRNS • Staff Digital Portal'}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {lang === 'BM' ? 'Warga JKRNS' : 'Warga JKRNS Portal'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              {lang === 'BM'
                ? 'Gerbang capaian aplikasi dalaman rasmi bagi warga kerja JKR Negeri Sembilan menguruskan projek, perkhidmatan perjawatan, kewangan, dan utiliti teknikal.'
                : 'Direct official gateway for JKR Negeri Sembilan staff managing project milestones, HR services, finance, and engineering knowledge.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <button
              type="button"
              onClick={onOpenAdminLogin}
              className="px-4 py-2.5 bg-[#FFD100] hover:bg-yellow-400 text-slate-950 font-bold rounded-xl text-xs transition-all flex items-center gap-2 shadow-md cursor-pointer"
            >
              <i className="fa-solid fa-lock text-[#DC2626]"></i>
              <span>{lang === 'BM' ? 'Log Masuk Staf / Admin' : 'Staff / Admin Login'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {cmsLinks && cmsLinks.length > 0 ? (
            cmsLinks.map((sys) => (
              <div
                key={sys.id}
                onClick={() => {
                  if (sys.url && sys.url.startsWith('http')) {
                    window.open(sys.url, sys.target || '_blank');
                  } else {
                    onOpenModal(
                      `Capaian Sistem Warga JKRNS: ${sys.title}`,
                      `Sistem: ${sys.title} (${sys.subtitle || ''})\nKeterangan: ${sys.description}\nPautan Rasmi: ${sys.url}\n\nNota Keselamatan: Sila gunakan Single Sign-On (SSO) atau ID Pengguna rasmi sektor awam anda untuk mengakses portal ini.`
                    );
                  }
                }}
                className="group bg-slate-800/80 hover:bg-slate-800 p-5 rounded-2xl border border-slate-700 hover:border-[#FFD100] transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-10 h-10 rounded-xl ${sys.color || 'bg-amber-500 text-white'} flex items-center justify-center text-lg shadow-sm group-hover:scale-105 transition-transform`}
                    >
                      <i className={`fa-solid ${sys.icon || 'fa-link'}`}></i>
                    </div>
                    <i className="fa-solid fa-arrow-up-right-from-square text-xs text-slate-500 group-hover:text-[#FFD100] transition-colors"></i>
                  </div>
                  <h4 className="font-bold text-white text-base group-hover:text-[#FFD100] transition-colors">
                    {sys.title}
                  </h4>
                  {sys.subtitle && (
                    <span className="text-[11px] text-[#FFD100] font-semibold block mt-0.5">
                      {sys.subtitle}
                    </span>
                  )}
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{sys.description}</p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-700 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{lang === 'BM' ? 'Akses Selamat Sektor Awam' : 'Secure Public Sector'}</span>
                  <span className="text-[#FFD100] font-semibold flex items-center gap-1">
                    <span>Buka Sistem</span>
                    <i className="fa-solid fa-chevron-right text-[9px]"></i>
                  </span>
                </div>
              </div>
            ))
          ) : (
            STAFF_SYSTEMS.map((sys) => (
              <div
                key={sys.id}
                onClick={() =>
                  onOpenModal(
                    `Capaian Sistem Warga JKRNS: ${sys.name}`,
                    `Sistem: ${sys.name}\nKeterangan: ${sys.desc}\nPautan Rasmi: ${sys.url}\n\nNota Keselamatan: Sila gunakan Single Sign-On (SSO) atau ID Pengguna rasmi sektor awam anda untuk mengakses portal ini.`
                  )
                }
                className="group bg-slate-800/80 hover:bg-slate-800 p-5 rounded-2xl border border-slate-700 hover:border-[#FFD100] transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-10 h-10 rounded-xl ${sys.color} flex items-center justify-center text-lg shadow-sm group-hover:scale-105 transition-transform`}
                    >
                      <i className={`fa-solid ${sys.icon}`}></i>
                    </div>
                    <i className="fa-solid fa-arrow-up-right-from-square text-xs text-slate-500 group-hover:text-[#FFD100] transition-colors"></i>
                  </div>
                  <h4 className="font-bold text-white text-base group-hover:text-[#FFD100] transition-colors">
                    {sys.name}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{sys.desc}</p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-700 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{lang === 'BM' ? 'Akses Selamat Sektor Awam' : 'Secure Public Sector'}</span>
                  <span className="text-[#FFD100] font-semibold flex items-center gap-1">
                    <span>Buka Sistem</span>
                    <i className="fa-solid fa-chevron-right text-[9px]"></i>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

// Backwards compatibility alias
export const SistemAplikasiStaf = WargaJKRNS;

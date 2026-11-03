/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface SistemAplikasiStafProps {
  lang: 'BM' | 'EN';
  onOpenModal: (title: string, content: string) => void;
  onOpenAdminLogin: () => void;
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
    desc: 'Sistem Maklumat Pengurusan Sumber Manusia Perkhidmatan Awam (Cuti, Prestasi LNPT, Profil Perjawatan).',
    icon: 'fa-user-gear',
    color: 'bg-blue-600 text-white',
    url: 'https://hrmis2.eghrmis.gov.my'
  },
  {
    id: 'ispeks',
    name: 'iSPEKS',
    desc: 'Sistem Perakaunan Akruan Kerajaan Negeri (Baucar Bayaran, Pesanan Kerajaan, Pesanan Tempatan LO).',
    icon: 'fa-calculator',
    color: 'bg-emerald-600 text-white',
    url: 'https://ispeks.anm.gov.my'
  },
  {
    id: 'skala',
    name: 'SKALA JKR',
    desc: 'Sistem Kawalan dan Laporan Projek Bersepadu JKR Malaysia untuk pemantauan jadual kemajuan fizikal projek.',
    icon: 'fa-chart-pie',
    color: 'bg-amber-500 text-white',
    url: 'https://skala.jkr.gov.my'
  },
  {
    id: 'ekursus',
    name: 'e-Kursus & CPD',
    desc: 'Pendaftaran kursus kompetensi kejuruteraan CREaTE JKR dan rekod mata CPD Lembaga Jurutera Malaysia (BEM).',
    icon: 'fa-graduation-cap',
    color: 'bg-purple-600 text-white',
    url: 'https://ekursus.jkr.gov.my'
  },
  {
    id: 'myjalan',
    name: 'MyJalan KKR',
    desc: 'Portal pemantauan aduan jalan raya ' +
      'Kementerian Kerja Raya untuk tindakan pantas sifar lubang jalan.',
    icon: 'fa-road',
    color: 'bg-[#DC2626] text-white',
    url: 'https://myjalan.kkr.gov.my'
  },
  {
    id: 'mykj',
    name: 'My-KJ (Knowledge)',
    desc: 'Pusat repositori pengurusan ilmu kejuruteraan, manual reka bentuk jalan, lukisan standard dan spesifikasi teknikal.',
    icon: 'fa-book-atlas',
    color: 'bg-teal-600 text-white',
    url: 'https://mykj.jkr.gov.my'
  }
];

export const SistemAplikasiStaf: React.FC<SistemAplikasiStafProps> = ({
  lang,
  onOpenModal,
  onOpenAdminLogin
}) => {
  return (
    <section id="sistemStafSection" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-[#111827] text-white rounded-3xl p-6 sm:p-8 md:p-10 border border-slate-700 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD100]/20 border border-[#FFD100]/40 text-[#FFD100] text-xs font-bold uppercase tracking-wider mb-2">
              <i className="fa-solid fa-network-wired"></i>
              <span>{lang === 'BM' ? 'Aplikasi Dalaman Staf & Agensi' : 'Staff Intranet & Applications'}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {lang === 'BM' ? 'Gerbang Sistem & Aplikasi Staf JKR' : 'JKR Staff & Intranet Portals'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              {lang === 'BM'
                ? 'Pautan pantas rasmi bagi warga kerja JKR Negeri Sembilan menguruskan projek, kewangan, sumber manusia dan teknikal.'
                : 'Direct official links for JKR staff handling project tracking, finance, human capital and engineering.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenAdminLogin}
            className="px-4 py-2.5 bg-[#FFD100] hover:bg-yellow-400 text-slate-950 font-bold rounded-xl text-xs transition-all flex items-center gap-2 shadow-md self-start md:self-auto cursor-pointer"
          >
            <i className="fa-solid fa-lock text-[#DC2626]"></i>
            <span>{lang === 'BM' ? 'Log Masuk Pentadbir JKR' : 'Staff Admin Login'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {STAFF_SYSTEMS.map((sys) => (
            <div
              key={sys.id}
              onClick={() =>
                onOpenModal(
                  `Capaian Sistem: ${sys.name}`,
                  `Sistem: ${sys.name}\nKeterangan: ${sys.desc}\nPautan Rasmi: ${sys.url}\n\nNota Keselamatan: Sila log masuk menggunakan Single Sign-On (SSO) atau kad pengenalan MyKad yang didaftarkan di bawah domain sektor awam.`
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
                  <span>Buka</span>
                  <i className="fa-solid fa-chevron-right text-[9px]"></i>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

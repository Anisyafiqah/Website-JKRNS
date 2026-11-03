/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

interface EBencanaStatusProps {
  lang: 'BM' | 'EN';
  onOpenModal: (title: string, content: string) => void;
}

interface DisasterAlert {
  id: string;
  routeCode: string;
  location: string;
  district: string;
  type: 'Runtuhan Cerun' | 'Banjir Kilat' | 'Jalan Terputus' | 'Kerja Pembaikan';
  severity: 'Bahaya' | 'Amaran' | 'Terkawal';
  status: string;
  alternativeRoute: string;
  updatedAt: string;
}

const DISASTER_ALERTS: DisasterAlert[] = [
  {
    id: 'b-1',
    routeCode: 'FT086',
    location: 'KM 14.5 - KM 16.2 Jalan Jelebu - Pantai (Bukit Tangga)',
    district: 'Jelebu / Seremban',
    type: 'Runtuhan Cerun',
    severity: 'Amaran',
    status: 'Laluan dibuka satu lorong dengan kawalan lampu isyarat sementara. Kerja-kerja penstabilan ' +
      'cerun dan pembersihan mendapan tanah sedang giat dijalankan.',
    alternativeRoute: 'Pengguna dinasihatkan melalui N30 (Jalan Bukit Tangga Lama) atau E21 Lebuhraya LEKAS.',
    updatedAt: '02 November 2026, 08:30 AM'
  },
  {
    id: 'b-2',
    routeCode: 'N12',
    location: 'KM 4.0 Berhampiran Jambatan Sungai Linggi',
    district: 'Port Dickson',
    type: 'Kerja Pembaikan',
    severity: 'Terkawal',
    status: 'Pemasangan cerucuk lembar keluli dan pengukuhan tebing jambatan. Laluan beroperasi seperti biasa dengan had laju 30 km/j.',
    alternativeRoute: 'Tiada lencongan diperlukan. Patuhi arahan bendera keselamatan di tapak.',
    updatedAt: '01 November 2026, 04:15 PM'
  },
  {
    id: 'b-3',
    routeCode: 'FT001',
    location: 'KM 22.8 Laluan Rembau - Tampin',
    district: 'Rembau',
    type: 'Banjir Kilat',
    severity: 'Terkawal',
    status: 'Air bertakung di bahu jalan surut sepenuhnya. Trafik berjalan lancar di kedua-dua arah.',
    alternativeRoute: 'Laluan selamat dilalui oleh semua kenderaan ringan dan berat.',
    updatedAt: '02 November 2026, 07:00 AM'
  }
];

export const EBencanaStatus: React.FC<EBencanaStatusProps> = ({ lang, onOpenModal }) => {
  const [filterDistrict, setFilterDistrict] = useState<string>('semua');

  const filteredAlerts = DISASTER_ALERTS.filter((item) => {
    if (filterDistrict === 'semua') return true;
    return item.district.toLowerCase().includes(filterDistrict.toLowerCase());
  });

  return (
    <section id="bencanaSection" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 md:p-10 border border-slate-800 shadow-xl relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <span>{lang === 'BM' ? 'Sistem Amaran Bencana JKR (BiGBen)' : 'JKR Disaster Monitoring (BiGBen)'}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {lang === 'BM' ? 'Status e-Bencana & Amaran Laluan Semasa' : 'e-Disaster & Road Network Advisories'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              {lang === 'BM'
                ? 'Laporan masa nyata status keselamatan jalan raya, tanah runtuh cerun dan banjir kilat di 7 daerah Negeri Sembilan.'
                : 'Real-time hazard alerts covering slope landslides, flash floods and detour plans across 7 districts.'}
            </p>
          </div>

          {/* Bilik Gerakan Hotline */}
          <div className="bg-slate-800/90 border border-slate-700 p-4 rounded-2xl flex items-center gap-3 self-start md:self-auto">
            <div className="w-10 h-10 rounded-xl bg-[#DC2626] text-white flex items-center justify-center text-lg">
              <i className="fa-solid fa-phone-volume animate-pulse"></i>
            </div>
            <div className="text-xs">
              <span className="text-slate-400 block font-semibold">
                {lang === 'BM' ? 'Bilik Gerakan Bencana (24 Jam):' : 'Disaster Ops Room (24h):'}
              </span>
              <a href="tel:067659299" className="font-mono text-sm sm:text-base font-black text-[#FFD100] hover:underline">
                06-765 9299 / 9200
              </a>
            </div>
          </div>
        </div>

        {/* Filter Penapis Daerah */}
        <div className="flex flex-wrap items-center gap-2 mb-6 relative z-10">
          <span className="text-xs font-bold text-slate-400 mr-1">
            {lang === 'BM' ? 'Pilih Daerah:' : 'Filter District:'}
          </span>
          {['semua', 'jelebu', 'seremban', 'port dickson', 'rembau', 'kuala pilah'].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setFilterDistrict(d)}
              className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                filterDistrict === d
                  ? 'bg-[#FFD100] text-slate-950 shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {d === 'semua' ? (lang === 'BM' ? 'Semua Daerah' : 'All Districts') : d}
            </button>
          ))}
        </div>

        {/* Senarai Kad Amaran Bencana */}
        <div className="space-y-4 relative z-10">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-slate-800/80 rounded-2xl p-4 sm:p-5 border border-slate-700 hover:border-slate-600 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-700">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded font-mono font-black text-xs bg-[#FFD100] text-slate-950">
                      {alert.routeCode}
                    </span>
                    <h4 className="font-bold text-white text-sm sm:text-base">{alert.location}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        alert.severity === 'Bahaya'
                          ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                          : alert.severity === 'Amaran'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}
                    >
                      {alert.type} ({alert.severity})
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                      {alert.updatedAt}
                    </span>
                  </div>
                </div>

                <div className="pt-3 grid grid-cols-1 md:grid-cols-12 gap-3 items-center text-xs">
                  <div className="md:col-span-8 text-slate-300 space-y-1.5">
                    <p className="leading-relaxed">
                      <strong className="text-slate-100">Status Kejadian:</strong> {alert.status}
                    </p>
                    <p className="text-amber-300 leading-relaxed">
                      <i className="fa-solid fa-route mr-1.5"></i>
                      <strong>Laluan Alternatif:</strong> {alert.alternativeRoute}
                    </p>
                  </div>

                  <div className="md:col-span-4 flex sm:justify-end gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        onOpenModal(
                          `Maklumat Terperinci Laluan ${alert.routeCode}`,
                          `Lokasi: ${alert.location}\nDaerah: ${alert.district}\nJenis Kejadian: ${alert.type}\nStatus: ${alert.status}\n\nLaluan Alternatif:\n${alert.alternativeRoute}\n\nTalian Bilik Gerakan Bencana JKR NS: 06-765 9299`
                        )
                      }
                      className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      <i className="fa-solid fa-circle-info mr-1.5 text-[#FFD100]"></i>
                      <span>Perincian</span>
                    </button>
                    <a
                      href="#aduanSection"
                      className="px-4 py-2 bg-[#DC2626] hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5"
                    >
                      <i className="fa-solid fa-bullhorn text-xs"></i>
                      <span>Lapor Bencana</span>
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-400 bg-slate-800/40 rounded-2xl border border-slate-700">
              <i className="fa-solid fa-circle-check text-3xl text-emerald-400 mb-2"></i>
              <p className="text-xs sm:text-sm">
                Tiada laporan halangan jalan atau bencana aktif dilaporkan di daerah yang dipilih.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

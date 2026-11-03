/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

interface ProfilKorporatProps {
  lang: 'BM' | 'EN';
  onOpenModal: (title: string, content: string) => void;
}

export const ProfilKorporat: React.FC<ProfilKorporatProps> = ({ lang, onOpenModal }) => {
  const [activeTab, setActiveTab] = useState<
    'perutusan' | 'visimisi' | 'fungsi' | 'carta' | 'piagam' | 'sejarah'
  >('perutusan');

  return (
    <section id="profilKorporat" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 w-full">
      {/* Tajuk Bahagian */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD100]/20 border border-[#FFD100]/50 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
            <i className="fa-solid fa-landmark text-[#DC2626]"></i>
            <span>{lang === 'BM' ? 'Mengenai JKR Negeri Sembilan' : 'About JKR Negeri Sembilan'}</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {lang === 'BM' ? 'Profil Korporat Jabatan' : 'Corporate Profile'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            {lang === 'BM'
              ? 'Penyedia perkhidmatan kejuruteraan awam dan pengurusan aset bertaraf dunia bagi Negeri Sembilan Darul Khusus.'
              : 'World-class civil engineering and infrastructure asset management provider for the State of Negeri Sembilan.'}
          </p>
        </div>

        {/* Tab Navigasi Horizontal */}
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-200/90 rounded-2xl overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => setActiveTab('perutusan')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'perutusan'
                ? 'bg-[#111827] text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <i className="fa-solid fa-quote-left mr-1.5 text-[#FFD100]"></i>
            {lang === 'BM' ? 'Perutusan Pengarah' : "Director's Address"}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('visimisi')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'visimisi'
                ? 'bg-[#111827] text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <i className="fa-solid fa-bullseye mr-1.5 text-[#DC2626]"></i>
            {lang === 'BM' ? 'Visi & Misi' : 'Vision & Mission'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('fungsi')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'fungsi'
                ? 'bg-[#111827] text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <i className="fa-solid fa-gears mr-1.5 text-amber-500"></i>
            {lang === 'BM' ? 'Fungsi Jabatan' : 'Core Functions'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('carta')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'carta'
                ? 'bg-[#111827] text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <i className="fa-solid fa-sitemap mr-1.5 text-sky-400"></i>
            {lang === 'BM' ? 'Carta Organisasi' : 'Organization Chart'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('piagam')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'piagam'
                ? 'bg-[#111827] text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <i className="fa-solid fa-handshake mr-1.5 text-emerald-400"></i>
            {lang === 'BM' ? 'Piagam Pelanggan' : 'Charter'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sejarah')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'sejarah'
                ? 'bg-[#111827] text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <i className="fa-solid fa-clock-rotate-left mr-1.5 text-purple-400"></i>
            {lang === 'BM' ? 'Sejarah' : 'History'}
          </button>
        </div>
      </div>

      {/* Kandungan Tab */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-8 md:p-10 transition-all">
        {/* ================= 1. PERUTUSAN PENGARAH ================= */}
        {activeTab === 'perutusan' && (
          <div className="animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-4 flex flex-col items-center text-center bg-gradient-to-b from-slate-50 to-slate-100 p-6 rounded-2xl border border-slate-200">
                <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-2xl overflow-hidden shadow-lg border-4 border-[#FFD100] mb-4 bg-slate-800 flex items-center justify-center">
                  <div className="w-full h-full bg-gradient-to-tr from-[#111827] via-slate-800 to-slate-700 flex flex-col items-center justify-center text-white p-4">
                    <i className="fa-solid fa-user-tie text-5xl text-[#FFD100] mb-2"></i>
                    <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">
                      Pengarah JKR NS
                    </span>
                  </div>
                </div>
                <h4 className="font-black text-slate-900 text-lg leading-tight">
                  Ir. Haji Abdul Shukor bin Abdul Rashid
                </h4>
                <p className="text-xs font-bold text-[#DC2626] mt-1">
                  Pengarah Jabatan Kerja Raya Negeri Sembilan
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Jawatan Utama Sektor Awam (JUSA)</span>
                </div>
              </div>

              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-[#DC2626] uppercase tracking-wider">
                  <i className="fa-solid fa-bullhorn"></i>
                  <span>
                    {lang === 'BM'
                      ? 'Perutusan Pengarah JKR Negeri Sembilan'
                      : "Official Address by Director of Public Works"}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                  {lang === 'BM'
                    ? '"Memacu Pembangunan Infrastruktur Mampan Berteraskan Integriti dan Kecemerlangan Kejuruteraan"'
                    : '"Propelling Sustainable Infrastructure Anchored on Integrity and Engineering Excellence"'}
                </h3>

                <div className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
                  <p>
                    {lang === 'BM'
                      ? 'Selamat datang ke Portal Rasmi Jabatan Kerja Raya Negeri Sembilan. Sebagai agensi teknikal utama Kerajaan Negeri Sembilan dan Persekutuan, JKR Negeri Sembilan terus komited dalam melaksanakan amanah merancang, membina, dan menyenggara jaringan infrastruktur jalan raya dan fasiliti bangunan awam yang selamat, berdaya tahan, dan berimpak tinggi.'
                      : 'Welcome to the Official Portal of the Negeri Sembilan Public Works Department. As the principal technical agency for both the State and Federal Governments, JKR Negeri Sembilan remains steadfast in delivering safe, resilient, and high-impact highway networks and public facilities.'}
                  </p>
                  <p>
                    {lang === 'BM'
                      ? 'Selaras dengan Rancangan Struktur Negeri Sembilan 2030 (NS2030) dan inisiatif nasional MyJalan, kami memperkasakan amalan kejuruteraan moden berasaskan pendigitalan, penggunaan teknologi Building Information Modelling (BIM), pengurusan aset menyeluruh, serta pemantauan bencana masa nyata (BiGBen).'
                      : 'In alignment with the Negeri Sembilan Structure Plan 2030 and national MyJalan agenda, we champion digitized modern engineering practices, Building Information Modelling (BIM), lifecycle asset stewardship, and real-time disaster surveillance.'}
                  </p>
                  <p>
                    {lang === 'BM'
                      ? 'Kami juga berpegang teguh kepada prinsip integriti tertinggi tanpa kompromi melalui pematuhan Sistem Pengurusan Anti-Rasuah (ISO 37001 ABMS) dan Sistem Pengurusan Kualiti (MS ISO 9001:2015), bagi menjamin setiap ringgit pelaburan rakyat dimanfaatkan dengan telus, cepat, dan berkualiti tinggi demi kemakmuran Negeri Sembilan Darul Khusus.'
                      : 'We maintain uncompromised governance adhering to ISO 37001 Anti-Bribery Management System and MS ISO 9001:2015 Quality Management standards, ensuring every public ringgit translates into transparent, prompt, and top-tier infrastructure for all citizens.'}
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700">
                    <i className="fa-solid fa-road text-amber-500"></i>
                    <span>4,600+ KM Rangkaian Jalan Diurus</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700">
                    <i className="fa-solid fa-shield-halved text-emerald-500"></i>
                    <span>Pensijilan Penuh MS ISO 9001 &amp; ABMS 37001</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 2. VISI, MISI & OBJEKTIF ================= */}
        {activeTab === 'visimisi' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Visi */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-50 via-yellow-50 to-white border-l-8 border-[#FFD100] shadow-sm">
              <div className="flex items-center gap-2 text-xs font-black text-amber-800 uppercase tracking-wider mb-2">
                <i className="fa-solid fa-eye text-base"></i>
                <span>{lang === 'BM' ? 'Visi Rasmi Jabatan' : 'Official Vision'}</span>
              </div>
              <blockquote className="text-base sm:text-lg font-bold text-slate-900 italic leading-relaxed">
                {lang === 'BM'
                  ? '“Kami akan menjadi penyedia perkhidmatan bertaraf dunia dan pusat kecemerlangan di dalam pengurusan aset, pengurusan projek dan perkhidmatan kejuruteraan demi pembangunan infrastruktur negara melalui modal insan yang kreatif dan inovatif serta teknologi yang terkini.”'
                  : '“We will become a world-class service provider and centre of excellence in asset management, project management and engineering services for national infrastructure development through creative, innovative human capital and cutting-edge technology.”'}
              </blockquote>
            </div>

            {/* Misi (8 Tonggak Rasmi) */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-3 h-3 rounded-full bg-[#DC2626]"></span>
                <h4 className="text-lg font-black text-slate-900">
                  {lang === 'BM' ? 'Misi Jabatan (8 Teras Utama)' : 'Mission Statement (8 Core Pillars)'}
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    num: '1',
                    icon: 'fa-handshake-angle',
                    text: 'Membantu pelanggan dalam menyampaikan hasil polisi dan perkhidmatan melalui kerjasama rakan kongsi strategik.',
                    textEn: 'Assist clients in delivering policy outcomes and public services via strategic partnership collaboration.'
                  },
                  {
                    num: '2',
                    icon: 'fa-cubes-stacked',
                    text: 'Pemiawaian proses-proses dan sistem demi penyampaian hasil yang konsisten.',
                    textEn: 'Standardizing departmental engineering processes and systems for consistent quality delivery.'
                  },
                  {
                    num: '3',
                    icon: 'fa-lightbulb',
                    text: 'Menyediakan pengurusan aset dan projek yang berkesan dan inovatif.',
                    textEn: 'Providing effective and innovative lifecycle asset and capital project management.'
                  },
                  {
                    num: '4',
                    icon: 'fa-microchip',
                    text: 'Memperkasa kompetensi kejuruteraan sedia ada secara berterusan.',
                    textEn: 'Continuously elevating core engineering competencies and specialized technical prowess.'
                  },
                  {
                    num: '5',
                    icon: 'fa-users-gear',
                    text: 'Membangunkan modal insan dan kompetensi-kompetensi kejuruteraan baharu.',
                    textEn: 'Developing high-caliber human capital and emerging engineering competencies.'
                  },
                  {
                    num: '6',
                    icon: 'fa-scale-balanced',
                    text: 'Berpegang teguh kepada integriti dalam menyampaikan perkhidmatan awam.',
                    textEn: 'Holding steadfast to unyielding integrity in all public service deliveries.'
                  },
                  {
                    num: '7',
                    icon: 'fa-people-roof',
                    text: 'Membina hubungan yang harmoni dengan komuniti dan masyarakat.',
                    textEn: 'Fostering harmonious, collaborative relationships with citizens and local communities.'
                  },
                  {
                    num: '8',
                    icon: 'fa-seedling',
                    text: 'Memelihara persekitaran dan kelestarian alam semula jadi di dalam penyampaian perkhidmatan.',
                    textEn: 'Safeguarding environmental sustainability and natural ecosystems across all project phases.'
                  }
                ].map((m) => (
                  <div
                    key={m.num}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#111827] text-[#FFD100] font-black text-xs flex items-center justify-center flex-shrink-0">
                      {m.num}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                      {lang === 'BM' ? m.text : m.textEn}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Objektif Kualiti Jabatan */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-red-50 to-orange-50 border-l-8 border-[#DC2626]">
              <div className="flex items-center gap-2 text-xs font-black text-[#DC2626] uppercase tracking-wider mb-1.5">
                <i className="fa-solid fa-award"></i>
                <span>{lang === 'BM' ? 'Objektif Kualiti JKR Negeri Sembilan' : 'Quality Objective'}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 font-semibold leading-relaxed">
                {lang === 'BM'
                  ? '“Menyerahkan produk dan melaksanakan perkhidmatan penyenggaraan yang menepati masa, kualiti dan kos yang ditetapkan bagi mencapai faedah aset yang optimum kepada Kerajaan dan rakyat Negeri Sembilan.”'
                  : '“Delivering products and executing maintenance services that adhere strictly to scheduled time, benchmarked quality and stipulated budget to achieve optimum asset value for the State and citizens.”'}
              </p>
            </div>
          </div>
        )}

        {/* ================= 3. FUNGSI JABATAN ================= */}
        {activeTab === 'fungsi' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-slate-100 pb-4">
              <h4 className="text-lg font-black text-slate-900">
                {lang === 'BM' ? 'Peranan & Fungsi Strategik Jabatan' : 'Strategic Departmental Functions'}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                {lang === 'BM'
                  ? 'Fungsi teras JKR Negeri Sembilan berlandaskan Akta Jalan Persekutuan, Enakmen Negeri dan Pekeliling Perbendaharaan.'
                  : 'Mandated statutory functions grounded in Federal Road Act, State Enactments and Treasury Instructions.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  icon: 'fa-road',
                  color: 'bg-amber-500 text-white',
                  title: 'Pengurusan Jalan & Jambatan',
                  titleEn: 'Road & Bridge Management',
                  desc: 'Merancang, membina, menaik taraf, dan menyenggara jaringan jalan persekutuan dan negeri, struktur jambatan, serta pengurusan cerun kritikal.',
                  descEn: 'Planning, constructing, upgrading and maintaining federal & state roads, bridge crossings and critical slopes.'
                },
                {
                  icon: 'fa-building',
                  color: 'bg-blue-600 text-white',
                  title: 'Projek Bangunan Awam',
                  titleEn: 'Public Building Projects',
                  desc: 'Pelaksanaan projek pembinaan kompleks pentadbiran negeri, institusi pendidikan, fasiliti kesihatan, dan penyelenggaraan bangunan kerajaan.',
                  descEn: 'Execution of state administrative complexes, educational facilities, healthcare centres and asset maintenance.'
                },
                {
                  icon: 'fa-bolt',
                  color: 'bg-yellow-500 text-black',
                  title: 'Kejuruteraan Elektrik',
                  titleEn: 'Electrical Engineering',
                  desc: 'Penyeliaan sistem pendawaian voltan tinggi/rendah, lampu jalan solar pintar, sistem lampu isyarat trafik, dan pengauditan kecekapan tenaga.',
                  descEn: 'Supervision of HV/LV systems, smart solar street lighting, traffic light networks and green energy audits.'
                },
                {
                  icon: 'fa-wrench',
                  color: 'bg-emerald-600 text-white',
                  title: 'Kejuruteraan Mekanikal',
                  titleEn: 'Mechanical Engineering',
                  desc: 'Pengurusan sistem HVAC, lif, eskalator, sistem perlindungan kebakaran aktif/pasif, loji jentera pembinaan, dan audit fasiliti.',
                  descEn: 'Managing HVAC chiller plants, vertical transportation lifts, fire protection systems and mechanical plant assets.'
                },
                {
                  icon: 'fa-file-invoice-dollar',
                  color: 'bg-purple-600 text-white',
                  title: 'Kontrak & Ukur Bahan',
                  titleEn: 'Contracts & Quantity Surveying',
                  desc: 'Pengurusan tender, penyediaan anggaran jabatan, pentadbiran kontrak pembinaan, penilaian kemajuan kerja dan pensijilan bayaran.',
                  descEn: 'Procurement management, departmental estimating, contract administration, valuation and interim payments.'
                },
                {
                  icon: 'fa-compass-drafting',
                  color: 'bg-[#DC2626] text-white',
                  title: 'Khidmat Nasihat & Rekabentuk',
                  titleEn: 'Design & Advisory Services',
                  desc: 'Penasihat kejuruteraan utama kepada Kerajaan Negeri, rekabentuk struktur BIM, analisis geoteknik, dan kelulusan permit utiliti korekan jalan.',
                  descEn: 'Principal engineering advisory to the State, BIM structural design, geotechnical studies and trenching permit appraisals.'
                }
              ].map((f, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:shadow-md transition-all space-y-2.5"
                >
                  <div className={`w-10 h-10 rounded-xl ${f.color} flex items-center justify-center text-lg shadow-sm`}>
                    <i className={`fa-solid ${f.icon}`}></i>
                  </div>
                  <h5 className="font-bold text-slate-900 text-sm">{lang === 'BM' ? f.title : f.titleEn}</h5>
                  <p className="text-xs text-slate-600 leading-relaxed">{lang === 'BM' ? f.desc : f.descEn}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 4. CARTA ORGANISASI ================= */}
        {activeTab === 'carta' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h4 className="text-lg font-black text-slate-900">
                  {lang === 'BM' ? 'Carta Organisasi Pentadbiran JKR Negeri Sembilan' : 'Administration Organization Chart'}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {lang === 'BM'
                    ? 'Struktur hierarki pengurusan tertinggi, bahagian teknikal ibu pejabat dan 7 pejabat daerah.'
                    : 'Hierarchical leadership structure spanning top management, HQ divisions and 7 district offices.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  onOpenModal(
                    'Muat Turun Carta Organisasi',
                    'Carta Organisasi rasmi JKR Negeri Sembilan versi penuh (PDF beresolusi tinggi dengan nombor pelan jawatan) boleh dimuat turun dari Pusat Muat Turun Dokumen di bawah atau melalui intranet rasmi SKALA.'
                  )
                }
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 self-start cursor-pointer"
              >
                <i className="fa-solid fa-file-pdf text-[#FFD100]"></i>
                <span>{lang === 'BM' ? 'Muat Turun Carta (PDF)' : 'Download Chart (PDF)'}</span>
              </button>
            </div>

            {/* Visual Tree Struktur Organisasi */}
            <div className="space-y-6 pt-2">
              {/* Level 1: Pengarah */}
              <div className="flex justify-center">
                <div className="bg-gradient-to-r from-[#111827] via-slate-900 to-[#111827] text-white p-4 rounded-2xl border-2 border-[#FFD100] shadow-lg max-w-sm w-full text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFD100]">
                    Ketua Jabatan / Pengurusan Tertinggi
                  </span>
                  <h5 className="text-base font-black mt-0.5">Pengarah JKR Negeri Sembilan</h5>
                  <p className="text-xs text-slate-300 font-semibold mt-1">Ir. Haji Abdul Shukor bin Abdul Rashid</p>
                  <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FFD100] text-slate-950">
                    Gred JUSA C
                  </span>
                </div>
              </div>

              {/* Garis Penyambung */}
              <div className="flex justify-center">
                <div className="w-0.5 h-6 bg-slate-300"></div>
              </div>

              {/* Level 2: Timbalan Pengarah */}
              <div className="flex justify-center">
                <div className="bg-slate-100 text-slate-900 p-3.5 rounded-2xl border border-slate-300 shadow-sm max-w-xs w-full text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#DC2626]">
                    Pengurusan Operasi
                  </span>
                  <h6 className="text-sm font-black">Timbalan Pengarah JKR Negeri Sembilan</h6>
                  <p className="text-xs text-slate-600 font-semibold mt-0.5">Jurutera Awam Penguasa Kanan</p>
                </div>
              </div>

              {/* Garis Penyambung Cabang */}
              <div className="flex justify-center">
                <div className="w-0.5 h-6 bg-slate-300"></div>
              </div>

              {/* Level 3: 2 Cabang Utama (10 Bahagian Ibu Pejabat & 7 Pejabat Daerah) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cabang Ibu Pejabat */}
                <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#FFD100] text-slate-950 flex items-center justify-center font-bold text-xs">
                      <i className="fa-solid fa-building"></i>
                    </div>
                    <h5 className="font-bold text-slate-900 text-sm">
                      10 Bahagian &amp; Cawangan Ibu Pejabat
                    </h5>
                  </div>
                  <ul className="text-xs text-slate-700 space-y-1.5 pl-3 list-disc">
                    <li>Bahagian Jalan</li>
                    <li>Bahagian Bangunan</li>
                    <li>Cawangan Kejuruteraan Elektrik</li>
                    <li>Cawangan Kejuruteraan Mekanikal</li>
                    <li>Bahagian Kontrak dan Ukur Bahan (BKUB)</li>
                    <li>Bahagian Rekabentuk Awam &amp; Struktur (BRADS)</li>
                    <li>Bahagian Arkitek</li>
                    <li>Bahagian Pengurusan Korporat &amp; CPAB</li>
                    <li>Bahagian Pentadbiran dan Kewangan</li>
                    <li>Pasukan Projek Persekutuan / Unit Tentera</li>
                  </ul>
                </div>

                {/* Cabang Pejabat Daerah */}
                <div className="p-5 rounded-2xl bg-red-50/60 border border-red-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#DC2626] text-white flex items-center justify-center font-bold text-xs">
                      <i className="fa-solid fa-map-location-dot"></i>
                    </div>
                    <h5 className="font-bold text-slate-900 text-sm">
                      7 Pejabat Jurutera Daerah (JDR)
                    </h5>
                  </div>
                  <ul className="text-xs text-slate-700 space-y-1.5 pl-3 list-disc">
                    <li>JKR Daerah Seremban</li>
                    <li>JKR Daerah Port Dickson</li>
                    <li>JKR Daerah Rembau</li>
                    <li>JKR Daerah Kuala Pilah</li>
                    <li>JKR Daerah Jempol</li>
                    <li>JKR Daerah Jelebu</li>
                    <li>JKR Daerah Tampin</li>
                  </ul>
                  <div className="pt-2">
                    <a
                      href="#direktoriDaerahSection"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#DC2626] hover:underline"
                    >
                      <span>{lang === 'BM' ? 'Lihat Direktori Penuh 7 Daerah' : 'View Full 7 Districts Directory'}</span>
                      <i className="fa-solid fa-arrow-right text-[10px]"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 5. PIAGAM PELANGGAN ================= */}
        {activeTab === 'piagam' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-slate-100 pb-4">
              <h4 className="text-lg font-black text-slate-900">
                {lang === 'BM' ? 'Piagam Pelanggan JKR Negeri Sembilan' : 'JKR NS Citizen Charter'}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                {lang === 'BM'
                  ? 'Komitmen berkanun kami terhadap kepantasan, kualiti, dan integriti perkhidmatan awam.'
                  : 'Statutory turnaround standards assuring responsiveness, quality, and service integrity.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  icon: 'fa-triangle-exclamation',
                  tag: 'Tindakan 24 Jam',
                  color: 'border-red-500 bg-red-50/50',
                  title: 'Pembaikan Lubang Jalan (Potholes)',
                  titleEn: 'Pothole Patching',
                  desc: 'Mengambil tindakan tampalan segera ke atas setiap kerosakan lubang jalan yang disahkan dalam tempoh 24 jam selepas aduan diterima.'
                },
                {
                  icon: 'fa-file-invoice-dollar',
                  tag: 'Tempoh 14 Hari',
                  color: 'border-amber-500 bg-amber-50/50',
                  title: 'Sijil Bayaran Interim (IPC)',
                  titleEn: 'Interim Payment Certification',
                  desc: 'Memperakukan perakuan bayaran kemajuan kerja kontraktor dalam tempoh tidak melebihi 14 hari selepas tuntutan lengkap diserahkan.'
                },
                {
                  icon: 'fa-helmet-safety',
                  tag: 'Tempoh 14 Hari Bekerja',
                  color: 'border-blue-500 bg-blue-50/50',
                  title: 'Kelulusan Permit Korekan Utiliti',
                  titleEn: 'Utility Trenching Permits',
                  desc: 'Memproses dan memberi maklum balas teknikal bagi permohonan permit kerja pengorekan utiliti jalan dalam tempoh 14 hari bekerja.'
                },
                {
                  icon: 'fa-traffic-light',
                  tag: 'Tindakan 6 Jam',
                  color: 'border-yellow-500 bg-yellow-50/50',
                  title: 'Kerosakan Lampu Isyarat',
                  titleEn: 'Traffic Signal Faults',
                  desc: 'Menggerakkan pasukan teknikal bagi tindakan interim keselamatan ke atas lampu isyarat padam dalam masa 6 jam aduan diterima.'
                },
                {
                  icon: 'fa-headset',
                  tag: 'Akuan 1 Hari',
                  color: 'border-emerald-500 bg-emerald-50/50',
                  title: 'Maklum Balas Aduan Awam',
                  titleEn: 'Public Grievance Acknowledgement',
                  desc: 'Memberikan surat/notis akuan penerimaan rasmi terhadap aduan awam dalam tempoh 1 hari bekerja melalui platform e-Aduan/SISPAA.'
                },
                {
                  icon: 'fa-stamp',
                  tag: 'Tempoh 14 Hari',
                  color: 'border-purple-500 bg-purple-50/50',
                  title: 'Sijil Perakuan Siap Kerja (CPC)',
                  titleEn: 'Certificate of Practical Completion',
                  desc: 'Mengeluarkan Sijil Perakuan Siap Kerja (CPC) kepada kontraktor dalam tempoh 14 hari selepas pemeriksaan bersama tapak diluluskan.'
                }
              ].map((c, idx) => (
                <div key={idx} className={`p-4 rounded-2xl border-l-4 ${c.color} border border-slate-200 space-y-2`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase text-slate-800 bg-white px-2 py-0.5 rounded shadow-xs">
                      {c.tag}
                    </span>
                    <i className={`fa-solid ${c.icon} text-slate-400 text-sm`}></i>
                  </div>
                  <h5 className="font-bold text-slate-900 text-sm">{c.title}</h5>
                  <p className="text-xs text-slate-600 leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 6. SEJARAH ================= */}
        {activeTab === 'sejarah' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-slate-100 pb-4">
              <h4 className="text-lg font-black text-slate-900">
                {lang === 'BM' ? 'Sejarah & Latar Belakang JKR Negeri Sembilan' : 'History & Heritage of JKR NS'}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                {lang === 'BM'
                  ? 'Meredah denai perintis abad ke-19 hingga mencorak mega struktur moden berpaksikan Adat Perpatih.'
                  : 'From 19th-century pioneer cart tracks to modern iconic Minangkabau engineering marvels.'}
              </p>
            </div>

            <div className="relative border-l-2 border-slate-300 ml-4 pl-6 space-y-6">
              <div className="relative">
                <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-[#111827] border-2 border-[#FFD100]"></span>
                <span className="text-xs font-black text-[#DC2626]">Era Awal 1880-an</span>
                <h5 className="font-bold text-slate-900 text-sm mt-0.5">Penubuhan Jabatan Kerja Awam Sungai Ujong</h5>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  Bermula dengan pembinaan jalan pedati awal menghubungkan lombong bijih timah Rasah ke pangkalan Sungai Linggi bagi memudahkan perdagangan maritim.
                </p>
              </div>

              <div className="relative">
                <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-[#111827] border-2 border-[#FFD100]"></span>
                <span className="text-xs font-black text-[#DC2626]">Tahun 1920 - 1957</span>
                <h5 className="font-bold text-slate-900 text-sm mt-0.5">Pembangunan Jalan Persekutuan Melintasi Bukit Tangga</h5>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  Jurutera-jurutera awam JKR merintis pemotongan cerun berisiko di Bukit Tangga bagi menghubungkan Seremban ke Jelebu dan Kuala Pilah, menjalin sistem perhubungan negeri yang kukuh.
                </p>
              </div>

              <div className="relative">
                <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-[#111827] border-2 border-[#FFD100]"></span>
                <span className="text-xs font-black text-[#DC2626]">Era Moden 2000-an - Kini</span>
                <h5 className="font-bold text-slate-900 text-sm mt-0.5">Kompleks Kerja Raya Seremban 2 &amp; Teknologi Pintar</h5>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  JKR Negeri Sembilan berpindah ke Kompleks Kerja Raya moden di Jalan S2 A47, Seremban 2, memimpin integrasi sistem pemantauan bencana pintar (BiGBen), aplikasi aduan sifar lubang MyJalan, dan pembangunan bangunan awam ikonik berkonsepkan bumbung tanduk lentik Minangkabau.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

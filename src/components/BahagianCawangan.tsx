/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

interface BahagianCawanganProps {
  lang: 'BM' | 'EN';
  onOpenModal: (title: string, content: string) => void;
  onSelectDistrict: (districtKey: string) => void;
}

interface DivisionDetail {
  id: string;
  name: string;
  nameEn: string;
  head: string;
  grade: string;
  icon: string;
  color: string;
  objective: string;
  functions: string[];
}

const HQ_DIVISIONS: DivisionDetail[] = [
  {
    id: 'jalan',
    name: 'Bahagian Jalan',
    nameEn: 'Road Division',
    head: 'Ketua Penolong Pengarah Jalan',
    grade: 'J48 / J52',
    icon: 'fa-road',
    color: 'bg-amber-500 text-white',
    objective: 'Merancang, merekabentuk, membina dan menyenggara rangkaian laluan jalan raya persekutuan dan negeri yang selamat, cekap dan selesa.',
    functions: [
      'Pengurusan penyelenggaraan jalan berturap dan bahu jalan merentasi 7 daerah di Negeri Sembilan.',
      'Pelaksanaan projek pembinaan jalan baharu, pelebaran lorong, dan pembinaan persimpangan bertingkat.',
      'Pengurusan mitigasi cerun berisiko runtuh dan pemantauan sistem saliran jalan raya.',
      'Penyelarasan program keselamatan jalan raya (Road Safety Audit) dan inisiatif MyJalan KKR.'
    ]
  },
  {
    id: 'bangunan',
    name: 'Bahagian Bangunan',
    nameEn: 'Building Division',
    head: 'Ketua Penolong Pengarah Bangunan',
    grade: 'J48 / J52',
    icon: 'fa-building',
    color: 'bg-blue-600 text-white',
    objective: 'Melaksanakan projek pembinaan fasiliti bangunan awam berkualiti menepati piawaian kejuruteraan dan kos ditetapkan.',
    functions: [
      'Pengurusan pembinaan kompleks kerajaan negeri, balai polis, mahkamah, sekolah dan hospital.',
      'Penyeliaan tapak pembinaan dan kawalan kualiti bahan mengikut spesifikasi JKR.',
      'Penyelenggaraan fasiliti fizikal bangunan guna sama kerajaan Persekutuan dan Negeri.',
      'Pemeriksaan audit integriti struktur dan forensik kecacatan bangunan awam.'
    ]
  },
  {
    id: 'elektrik',
    name: 'Cawangan Kejuruteraan Elektrik',
    nameEn: 'Electrical Engineering Branch',
    head: 'Jurutera Elektrik Negeri',
    grade: 'J48 / J52',
    icon: 'fa-bolt',
    color: 'bg-yellow-500 text-black',
    objective: 'Menyediakan perkhidmatan kejuruteraan elektrik yang selamat, mampan dan cekap tenaga bagi seluruh aset negeri.',
    functions: [
      'Rekabentuk dan penyeliaan sistem pemasangan elektrik voltan rendah (LV) dan voltan tinggi (HV).',
      'Penyenggaraan lampu jalan persekutuan, lampu solar fotovoltaik (PV), dan lampu isyarat pintar.',
      'Pemasangan sistem janakuasa tunggu sedia (Genset) dan perlindungan kilat (Lightning Protection).',
      'Pengauditan kecekapan tenaga bangunan (Energy Efficiency) selaras dengan Matlamat Rendah Karbon.'
    ]
  },
  {
    id: 'mekanikal',
    name: 'Cawangan Kejuruteraan Mekanikal',
    nameEn: 'Mechanical Engineering Branch',
    head: 'Jurutera Mekanikal Negeri',
    grade: 'J48 / J52',
    icon: 'fa-wrench',
    color: 'bg-emerald-600 text-white',
    objective: 'Penyedia kepakaran kejuruteraan mekanikal dan pengurusan loji jentera berat yang cekap.',
    functions: [
      'Pengurusan sistem penyamanan udara berpusat (HVAC/Chiller) di bangunan kerajaan.',
      'Penyeliaan sistem lif penumpang, eskalator, dan kren angkat industri.',
      'Sistem pencegahan kebakaran aktif (Fire Sprinkler, Hosereel, CO2 Gas Suppression).',
      'Pengurusan perolehan, baik pulih, dan mobilisasi armada jentera berat JKR sewaktu bencana banjir dan tanah runtuh.'
    ]
  },
  {
    id: 'bkub',
    name: 'Bahagian Kontrak dan Ukur Bahan (BKUB)',
    nameEn: 'Contracts & Quantity Surveying Division',
    head: 'Ketua Penolong Pengarah Kontrak (Sr)',
    grade: 'J48 / J52',
    icon: 'fa-file-signature',
    color: 'bg-purple-600 text-white',
    objective: 'Memastikan integriti perolehan kerajaan, ketepatan anggaran kos dan pentadbiran kontrak yang telus.',
    functions: [
      'Penyediaan dokumen tender, sebut harga, dan Senarai Kuantiti (BQ) bagi semua projek.',
      'Urus setia Lembaga Perolehan Negeri dan Jawatankuasa Penilaian Tender JKR NS.',
      'Penyediaan Sijil Bayaran Interim (IPC), Penyata Akaun Muktamad, dan tuntutan perlanjutan masa (EOT).',
      'Penguatkuasaan Sistem Pengurusan Anti-Rasuah (ISO 37001 ABMS) dalam urusan perolehan.'
    ]
  },
  {
    id: 'brads',
    name: 'Bahagian Rekabentuk Awam & Struktur (BRADS)',
    nameEn: 'Civil & Structural Design Division',
    head: 'Ketua Penolong Pengarah BRADS',
    grade: 'J48 / J52',
    icon: 'fa-compass-drafting',
    color: 'bg-[#DC2626] text-white',
    objective: 'Merekabentuk komponen struktur yang kukuh, selamat dan ekonomik menggunakan kaedah pemodelan moden.',
    functions: [
      'Rekabentuk struktur konkrit bertetulang dan kerangka keluli bangunan awam serta jambatan.',
      'Penyiasatan tapak tanah (Soil Investigation) dan analisis geoteknik asas cerun.',
      'Kajian hidrologi, pemodelan larian air hujan dan sistem retensi takungan tebatan banjir.',
      'Pengaplikasian Building Information Modelling (BIM) dalam pemodelan reka bentuk 3D berkoordinasi.'
    ]
  },
  {
    id: 'arkitek',
    name: 'Bahagian Arkitek',
    nameEn: 'Architectural Division',
    head: 'Ketua Penolong Pengarah Arkitek',
    grade: 'J48 / J52',
    icon: 'fa-palette',
    color: 'bg-pink-600 text-white',
    objective: 'Menterjemah keperluan spatial dan fungsi bangunan awam dengan menyulam warisan seni bina Adat Perpatih.',
    functions: [
      'Perancangan reka bentuk pelan susun atur ruang, ergonomik, dan kebolehcapaian OKU (Universal Design).',
      'Penerapan elemen warisan Minangkabau (bumbung lentik, ukiran kayu tradisional) pada fasad bangunan ikonik negeri.',
      'Spesifikasi bahan kemasan dalaman mesra alam dan piawaian Green Building Index (GBI).',
      'Penyelarasan kelulusan pelan bangunan bersama Pihak Berkuasa Tempatan (PBT).'
    ]
  },
  {
    id: 'cpab',
    name: 'Bahagian Pengurusan Korporat & CPAB',
    nameEn: 'Corporate Management & CPAB Division',
    head: 'Ketua Penolong Pengarah Korporat',
    grade: 'J48 / J52',
    icon: 'fa-bullhorn',
    color: 'bg-teal-600 text-white',
    objective: 'Pusat pengurusan kualiti, perhubungan strategik media, pengurusan aduan pelanggan dan transformasi digital.',
    functions: [
      'Pusat Pengurusan Aduan Awam Bersepadu (e-Aduan JKR NS dan SISPAA).',
      'Penyelarasan audit Sistem Pengurusan Kualiti MS ISO 9001:2015 dan ISO 37001 ABMS.',
      'Pengurusan komunikasi korporat, siaran media rasmi, dan penyelenggaraan portal rasmi kerajaan.',
      'Penyelarasan Bilik Gerakan Bencana JKR Negeri Sembilan (BiGBen).'
    ]
  },
  {
    id: 'pentadbiran',
    name: 'Bahagian Pentadbiran dan Kewangan',
    nameEn: 'Administration & Finance Division',
    head: 'Penolong Pengarah Kanan Pentadbiran',
    grade: 'N44 / N48',
    icon: 'fa-wallet',
    color: 'bg-indigo-600 text-white',
    objective: 'Mengurus tadbir sumber manusia, logistik pejabat dan kewangan berhemat mengikut tatacara perbendaharaan.',
    functions: [
      'Pengurusan perjawatan, kenaikan pangkat, skim perkhidmatan, dan kebajikan kakitangan JKR NS.',
      'Pengurusan belanjawan mengurus (OE) dan belanjawan pembangunan (DE) Negeri & Persekutuan.',
      'Sistem perakaunan berkomputer iSPEKS, pemprosesan gaji staf, dan bayaran baucar pembekal.',
      'Pengurusan aset alih kerajaan, stor bekalan pejabat, dan keselamatan premis Kompleks Kerja Raya.'
    ]
  },
  {
    id: 'persekutuan',
    name: 'Pasukan Projek Persekutuan / Unit Tentera',
    nameEn: 'Federal Projects Team / Military Unit',
    head: 'Jurutera Penguasa Projek Persekutuan',
    grade: 'J48 / J52',
    icon: 'fa-shield-halved',
    color: 'bg-slate-700 text-white',
    objective: 'Melaksanakan projek khas infrastruktur pertahanan dan keselamatan negara dengan standard kerahsiaan tertinggi.',
    functions: [
      'Penyeliaan projek pembinaan kem tentera darat/udara Kementerian Pertahanan (MINDEF) di Negeri Sembilan.',
      'Pembinaan fasiliti keselamatan Ibu Pejabat Polis Kontinjen (IPK) dan balai polis di bawah KDN.',
      'Penyelenggaraan kemudahan berek kediaman anggota keselamatan dan pusat latihan rejimen.',
      'Penyelarasan zon keselamatan strategik kerajaan persekutuan.'
    ]
  }
];

export const BahagianCawangan: React.FC<BahagianCawanganProps> = ({
  lang,
  onOpenModal,
  onSelectDistrict
}) => {
  const [selectedDivisionId, setSelectedDivisionId] = useState<string>('jalan');
  const [activeSubTab, setActiveSubTab] = useState<'ibuPejabat' | 'pejabatDaerah'>('ibuPejabat');

  const selectedDivision =
    HQ_DIVISIONS.find((d) => d.id === selectedDivisionId) || HQ_DIVISIONS[0];

  return (
    <section id="bahagianCawangan" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 w-full">
      {/* Header Bahagian */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DC2626]/10 border border-[#DC2626]/30 text-[#DC2626] text-xs font-bold uppercase tracking-wider mb-2">
            <i className="fa-solid fa-sitemap"></i>
            <span>{lang === 'BM' ? 'Struktur Operasi Teknikal' : 'Technical Operations Structure'}</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {lang === 'BM' ? 'Bahagian & Cawangan Ibu Pejabat' : 'HQ Divisions & Branches'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            {lang === 'BM'
              ? '10 bahagian pakar kejuruteraan dan pengurusan di Ibu Pejabat Kompleks Kerja Raya Seremban 2, disokong oleh 7 Pejabat Daerah.'
              : '10 specialized engineering and management divisions at Seremban 2 HQ, reinforced by 7 District Offices.'}
          </p>
        </div>

        {/* Butang Togol Sub-Modul */}
        <div className="inline-flex p-1.5 bg-slate-200/90 rounded-2xl">
          <button
            type="button"
            onClick={() => setActiveSubTab('ibuPejabat')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'ibuPejabat'
                ? 'bg-[#111827] text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <i className="fa-solid fa-building mr-1.5 text-[#FFD100]"></i>
            {lang === 'BM' ? '10 Bahagian Ibu Pejabat' : '10 HQ Divisions'}
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('pejabatDaerah')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'pejabatDaerah'
                ? 'bg-[#111827] text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <i className="fa-solid fa-map-location-dot mr-1.5 text-[#DC2626]"></i>
            {lang === 'BM' ? 'Sub-Modul: 7 Pejabat Daerah' : 'Sub-Module: 7 Districts'}
          </button>
        </div>
      </div>

      {/* ================= PANDANGAN 1: 10 BAHAGIAN IBU PEJABAT ================= */}
      {activeSubTab === 'ibuPejabat' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Grid Senarai 10 Bahagian Sebagai Butang Interaktif */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {HQ_DIVISIONS.map((div) => {
              const isSelected = div.id === selectedDivisionId;
              return (
                <button
                  key={div.id}
                  type="button"
                  onClick={() => setSelectedDivisionId(div.id)}
                  className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between h-32 ${
                    isSelected
                      ? 'bg-[#111827] text-white border-[#FFD100] shadow-md ring-2 ring-[#FFD100]/40'
                      : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div
                      className={`w-8 h-8 rounded-xl ${
                        isSelected ? 'bg-[#FFD100] text-slate-950' : div.color
                      } flex items-center justify-center text-sm shadow-xs`}
                    >
                      <i className={`fa-solid ${div.icon}`}></i>
                    </div>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-[#FFD100] animate-ping"></span>
                    )}
                  </div>
                  <div>
                    <h5
                      className={`text-xs font-bold leading-tight ${
                        isSelected ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {lang === 'BM' ? div.name : div.nameEn}
                    </h5>
                    <span
                      className={`text-[10px] mt-1 block ${
                        isSelected ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      {div.head}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Kad Perincian Bahagian yang Dipilih */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-14 h-14 rounded-2xl ${selectedDivision.color} flex items-center justify-center text-2xl shadow-md`}
                  >
                    <i className={`fa-solid ${selectedDivision.icon}`}></i>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Ibu Pejabat JKR Negeri Sembilan
                    </span>
                    <h4 className="text-xl font-black text-slate-900 leading-tight">
                      {lang === 'BM' ? selectedDivision.name : selectedDivision.nameEn}
                    </h4>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-bold">Jawatan Utama:</span>
                    <span className="font-semibold text-slate-900">{selectedDivision.head}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-bold">Gred Hakiki:</span>
                    <span className="font-semibold text-slate-900">{selectedDivision.grade}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-bold">Lokasi:</span>
                    <span className="font-semibold text-slate-900">Tingkat 2-4, Kompleks JKR S2</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                  <span className="font-black uppercase tracking-wider block mb-1">
                    <i className="fa-solid fa-flag mr-1.5 text-amber-600"></i>
                    {lang === 'BM' ? 'Objektif Bahagian:' : 'Division Objective:'}
                  </span>
                  {selectedDivision.objective}
                </div>
              </div>

              <div className="lg:col-span-8 space-y-4">
                <h5 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]"></span>
                  <span>{lang === 'BM' ? 'Fungsi Utama & Skop Penugasan:' : 'Core Responsibilities:'}</span>
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedDivision.functions.map((fn, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed flex items-start gap-2.5 hover:bg-slate-100 transition-colors"
                    >
                      <i className="fa-solid fa-check text-emerald-600 mt-0.5 flex-shrink-0"></i>
                      <span>{fn}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      onOpenModal(
                        `Pertanyaan Khusus: ${selectedDivision.name}`,
                        `Bagi sebarang urusan teknikal atau permohonan bersama ${selectedDivision.name}, sila hubungi:\n\nTalian Am JKR NS: 06-765 9200\nFaks: 06-763 0835\nEmel Rasmi: korporatjkrns@jkr.gov.my\n\nLokasi: Kompleks Kerja Raya, Jalan S2 A47, 70300 Seremban 2.`
                      )
                    }
                    className="px-4 py-2 bg-[#111827] hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <i className="fa-solid fa-envelope text-[#FFD100]"></i>
                    <span>{lang === 'BM' ? 'Hubungi Bahagian Ini' : 'Contact Division'}</span>
                  </button>
                  <a
                    href="#aduanSection"
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                  >
                    <i className="fa-solid fa-headset text-[#DC2626]"></i>
                    <span>{lang === 'BM' ? 'Salurkan Aduan Terkait' : 'Submit Related Complaint'}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= PANDANGAN 2: SUB-MODUL 7 PEJABAT DAERAH ================= */}
      {activeSubTab === 'pejabatDaerah' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-red-50 to-amber-50 border-l-8 border-[#DC2626]">
            <h4 className="text-base font-black text-slate-900">
              {lang === 'BM'
                ? 'Rangkaian 7 Pejabat Daerah JKR Negeri Sembilan'
                : 'Network of 7 District Engineering Offices'}
            </h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {lang === 'BM'
                ? 'Setiap daerah diketuai oleh Jurutera Daerah (JDR) yang bertanggungjawab terhadap penyelenggaraan jalan raya, jambatan, bangunan awam, serta tindakan aduan potholes 24 jam.'
                : 'Each district is led by a District Engineer (JDR) overseeing road safety, bridge maintenance, public assets and 24-hour pothole turnarounds.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              {
                id: 'seremban',
                name: 'JKR Daerah Seremban',
                head: 'Ir. Mohd Fairuz bin Sulaiman',
                roads: '840+ km laluan',
                phone: '06-765 9200'
              },
              {
                id: 'pd',
                name: 'JKR Daerah Port Dickson',
                head: 'Ir. Norazman bin Alias',
                roads: '620+ km laluan pesisir & bandar',
                phone: '06-647 1322'
              },
              {
                id: 'rembau',
                name: 'JKR Daerah Rembau',
                head: 'Ir. Ts. Siti Hajar binti Osman',
                roads: '490+ km laluan luar bandar',
                phone: '06-685 1244'
              },
              {
                id: 'kualapilah',
                name: 'JKR Daerah Kuala Pilah',
                head: 'Ir. Ahmad Zaki bin Ismail',
                roads: '710+ km laluan berbukit & kampung',
                phone: '06-481 1033'
              },
              {
                id: 'jempol',
                name: 'JKR Daerah Jempol',
                head: 'Ir. Roslan bin Mohamad',
                roads: '880+ km laluan tanah rancangan FELDA',
                phone: '06-458 1322'
              },
              {
                id: 'jelebu',
                name: 'JKR Daerah Jelebu',
                head: 'Ir. Hasnah binti Hashim',
                roads: '560+ km laluan pergunungan Bukit Tangga',
                phone: '06-613 6233'
              },
              {
                id: 'tampin',
                name: 'JKR Daerah Tampin',
                head: 'Ir. Ts. Kamarulzaman bin Zainal',
                roads: '530+ km laluan sempadan Melaka/Johor',
                phone: '06-441 1233'
              }
            ].map((d) => (
              <div
                key={d.id}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-8 h-8 rounded-lg bg-[#111827] text-[#FFD100] flex items-center justify-center text-xs font-bold">
                      <i className="fa-solid fa-building-user"></i>
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                      {d.phone}
                    </span>
                  </div>
                  <h5 className="font-bold text-slate-900 text-sm">{d.name}</h5>
                  <p className="text-xs text-slate-500 mt-1">
                    <span className="font-semibold text-slate-700">JDR:</span> {d.head}
                  </p>
                  <p className="text-[11px] text-amber-700 font-medium mt-1">
                    <i className="fa-solid fa-road mr-1"></i>
                    {d.roads}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectDistrict(d.id);
                      const el = document.getElementById('direktoriDaerahSection');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-xs font-bold text-[#DC2626] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>{lang === 'BM' ? 'Buka Direktori Lengkap' : 'Full Directory'}</span>
                    <i className="fa-solid fa-chevron-right text-[10px]"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center pt-2">
            <a
              href="#direktoriDaerahSection"
              className="px-6 py-2.5 bg-[#DC2626] hover:bg-[#991B1B] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2"
            >
              <i className="fa-solid fa-map-location-dot text-[#FFD100]"></i>
              <span>{lang === 'BM' ? 'Teroka Direktori Interaktif 7 Daerah' : 'Explore Interactive 7 Districts Directory'}</span>
            </a>
          </div>
        </div>
      )}
    </section>
  );
};

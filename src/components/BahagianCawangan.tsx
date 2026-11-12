/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { CMSContent } from '../data/defaultCmsContent';

interface BahagianCawanganProps {
  lang: 'BM' | 'EN';
  onOpenModal: (title: string, content: string) => void;
  onSelectDistrictForComplaint: (districtName: string) => void;
  cmsData?: CMSContent['bahagianCawangan'];
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

interface DistrictDetail {
  id: string;
  tag: string;
  name: string;
  engineer: string;
  grade: string;
  address: string;
  phone: string;
  fax: string;
  email: string;
  roads: string;
  maps: string;
  waze: string;
}

interface StaffMember {
  id: string;
  name: string;
  title: string;
  grade: string;
  division: string;
  divisionCategory: 'Pengurusan' | 'Jalan' | 'Bangunan' | 'Elektrik' | 'Mekanikal' | 'BKUB' | 'BRADS' | 'Arkitek' | 'Korporat' | 'Pentadbiran' | 'Projek Khas' | 'Daerah';
  email: string;
  ext: string;
  phone: string;
  location: string;
}

const HQ_DIVISIONS: DivisionDetail[] = [
  {
    id: 'jalan',
    name: 'Bahagian Jalan',
    nameEn: 'Road Division',
    head: 'Ir. Ts. Mohd Khairul bin Ramli',
    grade: 'J52',
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
    head: 'Ir. Hjh. Rohani binti Mohd Nor',
    grade: 'J52',
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
    head: 'Ir. Ts. Azlan bin Che Mat',
    grade: 'J52',
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
    head: 'Ir. Ts. Shahril bin Sulaiman',
    grade: 'J52',
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
    head: 'Sr. Ts. Norazlina binti Zainal',
    grade: 'J52',
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
    head: 'Ir. Ahmad Zulkifli bin Hashim',
    grade: 'J48',
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
    head: 'Ar. Nurul Huda binti Mansor',
    grade: 'J48',
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
    head: 'Ts. Nurul Ashikin binti Razali',
    grade: 'J48',
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
    head: 'Pn. Siti Sarah binti Othman',
    grade: 'N48',
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
    head: 'Ir. Mohd Hafiz bin Mansor',
    grade: 'J48',
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

const DISTRICTS_SUBMODULE_DATA: DistrictDetail[] = [
  {
    id: 'seremban',
    tag: 'Ibu Pejabat Daerah JKR Seremban',
    name: 'JKR Daerah Seremban',
    engineer: 'Ir. Mohd Fairuz bin Sulaiman',
    grade: 'J48',
    address: 'Kompleks Kerja Raya, Jalan S2 A47, 70300 Seremban 2, Negeri Sembilan Darul Khusus.',
    phone: '06-765 9200',
    fax: '06-763 0835',
    email: 'jkrseremban@jkr.gov.my',
    roads: '840+ km (Laluan Persekutuan FT001, FT051 & Rangkaian Bandar)',
    maps: 'https://maps.google.com/?q=JKR+Seremban',
    waze: 'https://waze.com/ul?q=JKR+Seremban'
  },
  {
    id: 'pd',
    tag: 'Pejabat Jurutera Daerah Port Dickson',
    name: 'JKR Daerah Port Dickson',
    engineer: 'Ir. Norazman bin Alias',
    grade: 'J48',
    address: 'KM 1, Jalan Seremban, 71000 Port Dickson, Negeri Sembilan.',
    phone: '06-647 1322',
    fax: '06-647 3881',
    email: 'jkrpd@jkr.gov.my',
    roads: '620+ km (Laluan Pantai FT005, N12 & Jambatan Linggi)',
    maps: 'https://maps.google.com/?q=JKR+Port+Dickson',
    waze: 'https://waze.com/ul?q=JKR+Port+Dickson'
  },
  {
    id: 'rembau',
    tag: 'Pejabat Jurutera Daerah Rembau',
    name: 'JKR Daerah Rembau',
    engineer: 'Ir. Ts. Siti Hajar binti Osman',
    grade: 'J44',
    address: 'Jalan Dato Lela Maharaja, 71300 Rembau, Negeri Sembilan.',
    phone: '06-685 1244',
    fax: '06-685 2400',
    email: 'jkrrembau@jkr.gov.my',
    roads: '490+ km (Laluan Utama FT001 & Kawasan Luar Bandar Pedas)',
    maps: 'https://maps.google.com/?q=JKR+Rembau',
    waze: 'https://waze.com/ul?q=JKR+Rembau'
  },
  {
    id: 'kualapilah',
    tag: 'Pejabat Jurutera Daerah Kuala Pilah',
    name: 'JKR Daerah Kuala Pilah',
    engineer: 'Ir. Ahmad Zaki bin Ismail',
    grade: 'J48',
    address: 'Jalan Tampin, 72000 Kuala Pilah, Negeri Sembilan.',
    phone: '06-481 1033',
    fax: '06-481 2901',
    email: 'jkrpilah@jkr.gov.my',
    roads: '710+ km (Laluan Berbukit FT051, FT013 & Jaringan Mukim)',
    maps: 'https://maps.google.com/?q=JKR+Kuala+Pilah',
    waze: 'https://waze.com/ul?q=JKR+Kuala+Pilah'
  },
  {
    id: 'jempol',
    tag: 'Pejabat Jurutera Daerah Jempol',
    name: 'JKR Daerah Jempol',
    engineer: 'Ir. Roslan bin Mohamad',
    grade: 'J48',
    address: 'Kompleks Pejabat Kerajaan, 72120 Bandar Seri Jempol, Negeri Sembilan.',
    phone: '06-458 1322',
    fax: '06-458 2901',
    email: 'jkrjempol@jkr.gov.my',
    roads: '880+ km (Laluan FT010, FT011 & Rancangan Tanah FELDA)',
    maps: 'https://maps.google.com/?q=JKR+Jempol',
    waze: 'https://waze.com/ul?q=JKR+Jempol'
  },
  {
    id: 'jelebu',
    tag: 'Pejabat Jurutera Daerah Jelebu',
    name: 'JKR Daerah Jelebu',
    engineer: 'Ir. Hasnah binti Hashim',
    grade: 'J44',
    address: 'Jalan Simpang Pertang, 71600 Kuala Klawang, Jelebu, Negeri Sembilan.',
    phone: '06-613 6233',
    fax: '06-613 7411',
    email: 'jkrjelebu@jkr.gov.my',
    roads: '560+ km (Laluan Cerun FT086 Bukit Tangga & Simpang Durian)',
    maps: 'https://maps.google.com/?q=JKR+Jelebu',
    waze: 'https://waze.com/ul?q=JKR+Jelebu'
  },
  {
    id: 'tampin',
    tag: 'Pejabat Jurutera Daerah Tampin',
    name: 'JKR Daerah Tampin',
    engineer: 'Ir. Ts. Kamarulzaman bin Zainal',
    grade: 'J44',
    address: 'Jalan Seremban, 73000 Tampin, Negeri Sembilan.',
    phone: '06-441 1233',
    fax: '06-441 2400',
    email: 'jkrtampin@jkr.gov.my',
    roads: '530+ km (Laluan FT001 Sempadan Melaka & Gemas)',
    maps: 'https://maps.google.com/?q=JKR+Tampin',
    waze: 'https://waze.com/ul?q=JKR+Tampin'
  }
];

const STAFF_MEMBERS_DATA: StaffMember[] = [
  {
    id: 's-1',
    name: 'Ir. Haji Abdul Shukor bin Abdul Rashid',
    title: 'Pengarah JKR Negeri Sembilan',
    grade: 'JUSA C',
    division: 'Pengurusan Tertinggi',
    divisionCategory: 'Pengurusan',
    email: 'pengarahjkrns@jkr.gov.my',
    ext: '9201',
    phone: '06-765 9201',
    location: 'Tingkat 4, Kompleks S2'
  },
  {
    id: 's-2',
    name: 'Ir. Wan Ahmad bin Wan Yaacob',
    title: 'Timbalan Pengarah (Pembangunan & Operasi)',
    grade: 'J54',
    division: 'Pengurusan Tertinggi',
    divisionCategory: 'Pengurusan',
    email: 'timbalanpengarah@jkr.gov.my',
    ext: '9202',
    phone: '06-765 9202',
    location: 'Tingkat 4, Kompleks S2'
  },
  {
    id: 's-3',
    name: 'Ir. Ts. Mohd Khairul bin Ramli',
    title: 'Ketua Penolong Pengarah Jalan',
    grade: 'J52',
    division: 'Bahagian Jalan',
    divisionCategory: 'Jalan',
    email: 'kppjalan.ns@jkr.gov.my',
    ext: '9215',
    phone: '06-765 9215',
    location: 'Tingkat 3, Sayap Kanan'
  },
  {
    id: 's-4',
    name: 'Ir. Hjh. Rohani binti Mohd Nor',
    title: 'Ketua Penolong Pengarah Bangunan',
    grade: 'J52',
    division: 'Bahagian Bangunan',
    divisionCategory: 'Bangunan',
    email: 'kppbangunan.ns@jkr.gov.my',
    ext: '9230',
    phone: '06-765 9230',
    location: 'Tingkat 3, Sayap Kiri'
  },
  {
    id: 's-5',
    name: 'Ir. Ts. Azlan bin Che Mat',
    title: 'Jurutera Elektrik Negeri',
    grade: 'J52',
    division: 'Cawangan Kejuruteraan Elektrik',
    divisionCategory: 'Elektrik',
    email: 'jen.ns@jkr.gov.my',
    ext: '9245',
    phone: '06-765 9245',
    location: 'Tingkat 2, Sayap Elektrik'
  },
  {
    id: 's-6',
    name: 'Ir. Ts. Shahril bin Sulaiman',
    title: 'Jurutera Mekanikal Negeri',
    grade: 'J52',
    division: 'Cawangan Kejuruteraan Mekanikal',
    divisionCategory: 'Mekanikal',
    email: 'jmn.ns@jkr.gov.my',
    ext: '9250',
    phone: '06-765 9250',
    location: 'Tingkat 2, Sayap Mekanikal'
  },
  {
    id: 's-7',
    name: 'Sr. Ts. Norazlina binti Zainal',
    title: 'Ketua Penolong Pengarah Kontrak & Ukur Bahan (BKUB)',
    grade: 'J52',
    division: 'Bahagian Kontrak dan Ukur Bahan',
    divisionCategory: 'BKUB',
    email: 'kppkontrak.ns@jkr.gov.my',
    ext: '9260',
    phone: '06-765 9260',
    location: 'Tingkat 2, Sayap Kontrak'
  },
  {
    id: 's-8',
    name: 'Ir. Ahmad Zulkifli bin Hashim',
    title: 'Ketua Penolong Pengarah BRADS',
    grade: 'J48',
    division: 'Bahagian Rekabentuk Awam & Struktur',
    divisionCategory: 'BRADS',
    email: 'kppbrads.ns@jkr.gov.my',
    ext: '9272',
    phone: '06-765 9272',
    location: 'Tingkat 3, Bilik Pemodelan BIM'
  },
  {
    id: 's-9',
    name: 'Ar. Nurul Huda binti Mansor',
    title: 'Ketua Penolong Pengarah Arkitek',
    grade: 'J48',
    division: 'Bahagian Arkitek',
    divisionCategory: 'Arkitek',
    email: 'kpparkitek.ns@jkr.gov.my',
    ext: '9275',
    phone: '06-765 9275',
    location: 'Tingkat 3, Studio Seni Bina'
  },
  {
    id: 's-10',
    name: 'Ts. Nurul Ashikin binti Razali',
    title: 'Ketua Penolong Pengarah Korporat & CPAB',
    grade: 'J48',
    division: 'Bahagian Pengurusan Korporat & CPAB',
    divisionCategory: 'Korporat',
    email: 'korporatjkrns@jkr.gov.my',
    ext: '9280',
    phone: '06-765 9280',
    location: 'Tingkat 1, Pusat Aduan Awam'
  },
  {
    id: 's-11',
    name: 'Pn. Siti Sarah binti Othman',
    title: 'Penolong Pengarah Kanan Pentadbiran & Sumber Manusia',
    grade: 'N48',
    division: 'Bahagian Pentadbiran dan Kewangan',
    divisionCategory: 'Pentadbiran',
    email: 'pentadbiranjkrns@jkr.gov.my',
    ext: '9210',
    phone: '06-765 9210',
    location: 'Tingkat 1, Pejabat Am'
  },
  {
    id: 's-12',
    name: 'En. Mohd Farid bin Kamarudin',
    title: 'Ketua Unit Kewangan & Akaun (iSPEKS)',
    grade: 'W44',
    division: 'Bahagian Pentadbiran dan Kewangan',
    divisionCategory: 'Pentadbiran',
    email: 'kewanganjkrns@ns.gov.my',
    ext: '9212',
    phone: '06-765 9212',
    location: 'Tingkat 1, Unit Kewangan'
  },
  {
    id: 's-13',
    name: 'Ir. Mohd Hafiz bin Mansor',
    title: 'Jurutera Penguasa Projek Persekutuan & Tentera',
    grade: 'J48',
    division: 'Pasukan Projek Persekutuan / Unit Tentera',
    divisionCategory: 'Projek Khas',
    email: 'projekkhas.ns@jkr.gov.my',
    ext: '9290',
    phone: '06-765 9290',
    location: 'Tingkat 2, Unit Keselamatan'
  },
  {
    id: 's-14',
    name: 'Ir. Mohd Fairuz bin Sulaiman',
    title: 'Jurutera Daerah Seremban (JDR Seremban)',
    grade: 'J48',
    division: 'JKR Daerah Seremban',
    divisionCategory: 'Daerah',
    email: 'jdrseremban@jkr.gov.my',
    ext: '301',
    phone: '06-765 9200',
    location: 'Pejabat JKR Daerah Seremban'
  },
  {
    id: 's-15',
    name: 'Ir. Norazman bin Alias',
    title: 'Jurutera Daerah Port Dickson (JDR Port Dickson)',
    grade: 'J48',
    division: 'JKR Daerah Port Dickson',
    divisionCategory: 'Daerah',
    email: 'jdrpd@jkr.gov.my',
    ext: '101',
    phone: '06-647 1322',
    location: 'KM 1 Jalan Seremban, Port Dickson'
  },
  {
    id: 's-16',
    name: 'Ir. Ts. Siti Hajar binti Osman',
    title: 'Jurutera Daerah Rembau (JDR Rembau)',
    grade: 'J44',
    division: 'JKR Daerah Rembau',
    divisionCategory: 'Daerah',
    email: 'jdrrembau@jkr.gov.my',
    ext: '102',
    phone: '06-685 1244',
    location: 'Jalan Dato Lela Maharaja, Rembau'
  },
  {
    id: 's-17',
    name: 'Ir. Ahmad Zaki bin Ismail',
    title: 'Jurutera Daerah Kuala Pilah (JDR Kuala Pilah)',
    grade: 'J48',
    division: 'JKR Daerah Kuala Pilah',
    divisionCategory: 'Daerah',
    email: 'jdrpilah@jkr.gov.my',
    ext: '201',
    phone: '06-481 1033',
    location: 'Jalan Tampin, Kuala Pilah'
  },
  {
    id: 's-18',
    name: 'Ir. Roslan bin Mohamad',
    title: 'Jurutera Daerah Jempol (JDR Jempol)',
    grade: 'J48',
    division: 'JKR Daerah Jempol',
    divisionCategory: 'Daerah',
    email: 'jdrjempol@jkr.gov.my',
    ext: '205',
    phone: '06-458 1322',
    location: 'Bandar Seri Jempol'
  },
  {
    id: 's-19',
    name: 'Ir. Hasnah binti Hashim',
    title: 'Jurutera Daerah Jelebu (JDR Jelebu)',
    grade: 'J44',
    division: 'JKR Daerah Jelebu',
    divisionCategory: 'Daerah',
    email: 'jdrjelebu@jkr.gov.my',
    ext: '103',
    phone: '06-613 6233',
    location: 'Kuala Klawang, Jelebu'
  },
  {
    id: 's-20',
    name: 'Ir. Ts. Kamarulzaman bin Zainal',
    title: 'Jurutera Daerah Tampin (JDR Tampin)',
    grade: 'J44',
    division: 'JKR Daerah Tampin',
    divisionCategory: 'Daerah',
    email: 'jdrtampin@jkr.gov.my',
    ext: '104',
    phone: '06-441 1233',
    location: 'Jalan Seremban, Tampin'
  },
  {
    id: 's-21',
    name: 'Ts. Muhammad Syahrul bin Azman',
    title: 'Pegawai Teknologi Maklumat & Keselamatan Siber ICT (ICTSO)',
    grade: 'F44',
    division: 'Bahagian Pengurusan Korporat & CPAB',
    divisionCategory: 'Korporat',
    email: 'ict.jkrns@jkr.gov.my',
    ext: '9285',
    phone: '06-765 9285',
    location: 'Tingkat 1, Pusat Data JKR'
  },
  {
    id: 's-22',
    name: 'Sr. Ahmad Danial bin Mokhtar',
    title: 'Juruukur Bahan Kanan (Pengurusan Tender)',
    grade: 'J44',
    division: 'Bahagian Kontrak dan Ukur Bahan',
    divisionCategory: 'BKUB',
    email: 'tender.bkub@jkr.gov.my',
    ext: '9264',
    phone: '06-765 9264',
    location: 'Tingkat 2, Unit Tender'
  }
];

export const BahagianCawangan: React.FC<BahagianCawanganProps> = ({
  lang,
  onOpenModal,
  onSelectDistrictForComplaint,
  cmsData
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'ibuPejabat' | 'pejabatDaerah' | 'senaraiKakitangan'>('ibuPejabat');
  const [selectedDivisionId, setSelectedDivisionId] = useState<string>('jalan');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('seremban');

  // Staf directory state
  const [staffSearchQuery, setStaffSearchQuery] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('Semua');

  // Dynamic divisions merging
  const effectiveDivisions = useMemo(() => {
    if (!cmsData?.hqDivisions || cmsData.hqDivisions.length === 0) return HQ_DIVISIONS;
    return HQ_DIVISIONS.map((d) => {
      const cmsItem = cmsData.hqDivisions.find((c) => c.id === d.id);
      if (!cmsItem) return d;
      return {
        ...d,
        name: cmsItem.name || d.name,
        head: cmsItem.ketua || d.head,
        functions: cmsItem.functions && cmsItem.functions.length > 0 ? cmsItem.functions : d.functions
      };
    });
  }, [cmsData]);

  // Dynamic districts merging
  const effectiveDistricts = useMemo(() => {
    if (!cmsData?.districts || cmsData.districts.length === 0) return DISTRICTS_SUBMODULE_DATA;
    return DISTRICTS_SUBMODULE_DATA.map((dist) => {
      const cmsItem = cmsData.districts.find((c) => c.id === dist.id);
      if (!cmsItem) return dist;
      return {
        ...dist,
        name: cmsItem.name || dist.name,
        engineer: cmsItem.engineer || dist.engineer,
        grade: cmsItem.engineerTitle || dist.grade,
        address: cmsItem.address || dist.address,
        phone: cmsItem.phone || dist.phone,
        fax: cmsItem.fax || dist.fax,
        email: cmsItem.email || dist.email,
        roads: cmsItem.coverageKm ? `${cmsItem.coverageKm} rangkaian jalan diurus` : dist.roads
      };
    });
  }, [cmsData]);

  const selectedDivision =
    effectiveDivisions.find((d) => d.id === selectedDivisionId) || effectiveDivisions[0];

  const selectedDistrict =
    effectiveDistricts.find((d) => d.id === selectedDistrictId) || effectiveDistricts[0];

  // Dynamic staff list
  const effectiveStaffList: StaffMember[] = useMemo(() => {
    if (cmsData?.staffDirectory && cmsData.staffDirectory.length > 0) {
      return cmsData.staffDirectory.map((s) => ({
        id: s.id,
        name: s.name,
        title: s.position,
        grade: s.grade,
        division: s.department,
        divisionCategory: s.category,
        email: s.email,
        ext: s.phone.includes('-') ? s.phone.split('-')[1]?.trim() : '9000',
        phone: s.phone,
        location: s.department
      }));
    }
    return STAFF_MEMBERS_DATA;
  }, [cmsData]);

  // Filtered staff list
  const filteredStaff = useMemo(() => {
    return effectiveStaffList.filter((staff) => {
      const matchesCategory =
        selectedCategoryFilter === 'Semua' || staff.divisionCategory === selectedCategoryFilter;
      if (!matchesCategory) return false;

      if (!staffSearchQuery.trim()) return true;
      const q = staffSearchQuery.toLowerCase();
      return (
        staff.name.toLowerCase().includes(q) ||
        staff.title.toLowerCase().includes(q) ||
        staff.division.toLowerCase().includes(q) ||
        staff.grade.toLowerCase().includes(q) ||
        staff.email.toLowerCase().includes(q) ||
        staff.ext.includes(q)
      );
    });
  }, [effectiveStaffList, staffSearchQuery, selectedCategoryFilter]);

  return (
    <section id="bahagianCawangan" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 w-full">
      {/* Header Bahagian */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DC2626]/10 border border-[#DC2626]/30 text-[#DC2626] text-xs font-bold uppercase tracking-wider mb-2">
            <i className="fa-solid fa-sitemap"></i>
            <span>{lang === 'BM' ? 'Struktur Operasi & Tenaga Kerja' : 'Operational & Staff Structure'}</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {lang === 'BM' ? 'Bahagian & Cawangan Ibu Pejabat' : 'HQ Divisions & Branches'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            {lang === 'BM'
              ? 'Peneraju teknikal 10 bahagian ibu pejabat di Kompleks Kerja Raya Seremban 2, disokong oleh sub-modul 7 Pejabat Daerah serta direktori senarai nama kakitangan.'
              : '10 HQ specialized engineering divisions at Seremban 2, integrated 7 District Offices sub-module, and official staff directory.'}
          </p>
        </div>

        {/* Butang Togol Sub-Modul (3 Sub-Modul Utama) */}
        <div className="inline-flex p-1.5 bg-slate-200/90 rounded-2xl max-w-full overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveSubTab('ibuPejabat')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
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
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeSubTab === 'pejabatDaerah'
                ? 'bg-[#111827] text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <i className="fa-solid fa-map-location-dot mr-1.5 text-[#DC2626]"></i>
            {lang === 'BM' ? 'Sub-Modul: 7 Pejabat Daerah' : 'Sub-Module: 7 Districts'}
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('senaraiKakitangan')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeSubTab === 'senaraiKakitangan'
                ? 'bg-[#111827] text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <i className="fa-solid fa-address-book mr-1.5 text-emerald-400"></i>
            {lang === 'BM' ? 'Sub-Modul: Senarai Kakitangan' : 'Sub-Module: Staff Directory'}
          </button>
        </div>
      </div>

      {/* ================= SUB-MODUL 1: 10 BAHAGIAN IBU PEJABAT ================= */}
      {activeSubTab === 'ibuPejabat' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Grid Senarai 10 Bahagian Sebagai Butang Interaktif */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {effectiveDivisions.map((div) => {
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
                    <span className="text-slate-500 font-bold">Ketua Bahagian:</span>
                    <span className="font-semibold text-slate-900">{selectedDivision.head}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-bold">Gred Hakiki:</span>
                    <span className="font-semibold text-slate-900">{selectedDivision.grade}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-bold">Lokasi Pejabat:</span>
                    <span className="font-semibold text-slate-900">Kompleks Kerja Raya S2</span>
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
                        `Maklumat Perhubungan: ${selectedDivision.name}`,
                        `Bahagian: ${selectedDivision.name}\nKetua: ${selectedDivision.head} (${selectedDivision.grade})\n\nTalian Am: 06-765 9200\nFaks: 06-763 0835\nEmel: korporatjkrns@jkr.gov.my\nLokasi: Kompleks Kerja Raya, Jalan S2 A47, 70300 Seremban 2.`
                      )
                    }
                    className="px-4 py-2 bg-[#111827] hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <i className="fa-solid fa-envelope text-[#FFD100]"></i>
                    <span>{lang === 'BM' ? 'Hubungi Bahagian Ini' : 'Contact Division'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSubTab('senaraiKakitangan')}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <i className="fa-solid fa-users text-blue-600"></i>
                    <span>{lang === 'BM' ? 'Lihat Warga Staf Bahagian' : 'View Staff Members'}</span>
                  </button>
                  <a
                    href="#aduanSection"
                    className="px-4 py-2 bg-red-50 hover:bg-red-100 text-[#DC2626] rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-red-200"
                  >
                    <i className="fa-solid fa-headset"></i>
                    <span>{lang === 'BM' ? 'Salurkan Aduan Terkait' : 'Submit Related Complaint'}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= SUB-MODUL 2: 7 PEJABAT DAERAH JKR ================= */}
      {activeSubTab === 'pejabatDaerah' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-red-50 to-amber-50 border-l-8 border-[#DC2626] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-base font-black text-slate-900">
                {lang === 'BM'
                  ? 'Sub-Modul Rasmi: 7 Pejabat Daerah JKR Negeri Sembilan'
                  : 'Official Sub-Module: 7 JKR District Offices'}
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {lang === 'BM'
                  ? 'Pilih daerah untuk melihat maklumat Jurutera Daerah (JDR), talian perhubungan rasmi, peta panduan arah, serta salur aduan terus ke daerah yang dipilih.'
                  : 'Select a district to explore the District Engineer (JDR) profile, direct contact lines, GPS navigation and instant complaint dispatch.'}
              </p>
            </div>
            <span className="px-3 py-1 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 self-start sm:self-auto shadow-xs whitespace-nowrap">
              7 Jurutera Daerah
            </span>
          </div>

          {/* Bar Pilihan Butang 7 Daerah */}
          <div className="flex flex-wrap gap-2">
            {effectiveDistricts.map((dist) => {
              const isSelected = dist.id === selectedDistrictId;
              return (
                <button
                  key={dist.id}
                  type="button"
                  onClick={() => setSelectedDistrictId(dist.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#111827] text-white shadow-md ring-2 ring-[#FFD100]/40'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <i className={`fa-solid fa-location-dot mr-1.5 ${isSelected ? 'text-[#FFD100]' : 'text-[#DC2626]'}`}></i>
                  {dist.name.replace('JKR Daerah ', '')}
                </button>
              );
            })}
          </div>

          {/* Kad Perincian Komprehensif Daerah Terpilih */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD100]/20 text-amber-900 text-xs font-bold">
                  <i className="fa-solid fa-building-user"></i>
                  <span>{selectedDistrict.tag}</span>
                </div>

                <div>
                  <h4 className="text-2xl font-black text-slate-900">{selectedDistrict.name}</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1">
                    {selectedDistrict.address}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                    <span className="font-bold text-slate-500">
                      {lang === 'BM' ? 'Jurutera Daerah (JDR):' : 'District Engineer:'}
                    </span>
                    <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      {selectedDistrict.engineer} ({selectedDistrict.grade})
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold text-slate-500">Rangkaian Jalan Diurus:</span>
                    <span className="font-semibold text-amber-800">{selectedDistrict.roads}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700 font-medium">
                  <a
                    href={`tel:${selectedDistrict.phone}`}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:text-[#DC2626] transition-colors"
                  >
                    <i className="fa-solid fa-phone text-[#DC2626]"></i>
                    <span>{selectedDistrict.phone}</span>
                  </a>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-500">
                    <i className="fa-solid fa-fax text-slate-400"></i>
                    <span>{selectedDistrict.fax}</span>
                  </div>
                  <a
                    href={`mailto:${selectedDistrict.email}`}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:text-[#DC2626] transition-colors"
                  >
                    <i className="fa-solid fa-envelope text-[#DC2626]"></i>
                    <span className="truncate">{selectedDistrict.email}</span>
                  </a>
                </div>
              </div>

              {/* Tindakan Peta & Aduan Segera */}
              <div className="lg:col-span-4 flex flex-col gap-3">
                <a
                  href={selectedDistrict.maps}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 px-4 bg-[#111827] hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <i className="fa-solid fa-map-location text-[#FFD100]"></i>
                  <span>{lang === 'BM' ? 'Buka Google Maps' : 'Open Google Maps'}</span>
                </a>
                <a
                  href={selectedDistrict.waze}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 px-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <i className="fa-brands fa-waze text-white text-base"></i>
                  <span>{lang === 'BM' ? 'Panduan Arah Waze' : 'Navigate with Waze'}</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    const mappedName =
                      selectedDistrict.id === 'pd'
                        ? 'Port Dickson'
                        : selectedDistrict.id === 'kualapilah'
                        ? 'Kuala Pilah'
                        : selectedDistrict.name.replace('JKR Daerah ', '');
                    onSelectDistrictForComplaint(mappedName);
                    const aduanEl = document.getElementById('aduanSection');
                    if (aduanEl) aduanEl.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-3 px-4 bg-[#DC2626] hover:bg-[#991B1B] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <i className="fa-solid fa-bullhorn text-[#FFD100]"></i>
                  <span>{lang === 'BM' ? 'Salur Aduan ke Daerah Ini' : 'Report Issue to this District'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= SUB-MODUL 3: SENARAI NAMA KAKITANGAN / DIREKTORI STAF ================= */}
      {activeSubTab === 'senaraiKakitangan' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header Sub-Modul Staf */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-white border-l-8 border-emerald-500 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
                <i className="fa-solid fa-address-book"></i>
                <span>Direktori Warga Kerja Rasmi</span>
              </div>
              <h4 className="text-base font-black text-slate-900">
                {lang === 'BM'
                  ? 'Senarai Nama Kakitangan JKR Negeri Sembilan'
                  : 'Official Staff Directory of JKR Negeri Sembilan'}
              </h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                {lang === 'BM'
                  ? 'Carian nama pegawai, jawatan, nombor sambungan telefon dan bahagian penempatan di Ibu Pejabat & 7 Pejabat Daerah.'
                  : 'Search staff by name, official designation, telephone extension, and division.'}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs self-start md:self-auto">
              <i className="fa-solid fa-users text-emerald-600"></i>
              <span>{filteredStaff.length} Pegawai Dipaparkan</span>
            </div>
          </div>

          {/* Kotak Carian & Penapis Kategori Staf */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={staffSearchQuery}
                  onChange={(e) => setStaffSearchQuery(e.target.value)}
                  placeholder={
                    lang === 'BM'
                      ? 'Cari nama pegawai, jawatan (cth: Jurutera, KPP), atau bahagian...'
                      : 'Search staff name, designation (e.g. Engineer), or division...'
                  }
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
                />
                <i className="fa-solid fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                {staffSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setStaffSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                )}
              </div>
            </div>

            {/* Filter Pills Kategori */}
            <div className="flex flex-wrap gap-1.5 text-xs font-bold">
              {[
                'Semua',
                'Pengurusan',
                'Jalan',
                'Bangunan',
                'Elektrik',
                'Mekanikal',
                'BKUB',
                'BRADS',
                'Arkitek',
                'Korporat',
                'Pentadbiran',
                'Projek Khas',
                'Daerah'
              ].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    selectedCategoryFilter === cat
                      ? 'bg-[#111827] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Senarai Kad / Jadual Kakitangan */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStaff.length > 0 ? (
              filteredStaff.map((staff) => (
                <div
                  key={staff.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 text-[#FFD100] flex items-center justify-center text-sm font-bold flex-shrink-0">
                          <i className="fa-solid fa-user-tie"></i>
                        </div>
                        <div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                            Gred {staff.grade}
                          </span>
                          <span className="text-[10px] text-slate-500 ml-1.5">
                            Ext: <strong className="text-slate-800 font-mono">{staff.ext}</strong>
                          </span>
                        </div>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1" title="Aktif Bertugas"></span>
                    </div>

                    <div>
                      <h5 className="font-black text-slate-900 text-sm leading-snug">{staff.name}</h5>
                      <p className="text-xs font-semibold text-[#DC2626] mt-0.5">{staff.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{staff.division}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 space-y-1 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <i className="fa-solid fa-location-dot text-slate-400 text-[11px] w-3.5"></i>
                        <span>{staff.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <i className="fa-solid fa-phone text-slate-400 text-[11px] w-3.5"></i>
                        <span>{staff.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 truncate">
                        <i className="fa-solid fa-envelope text-slate-400 text-[11px] w-3.5"></i>
                        <span className="truncate">{staff.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center gap-2">
                    <a
                      href={`mailto:${staff.email}`}
                      className="flex-1 py-1.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold text-center transition-colors flex items-center justify-center gap-1.5"
                    >
                      <i className="fa-solid fa-envelope text-[#FFD100] text-[10px]"></i>
                      <span>Hantar Emel</span>
                    </a>
                    <button
                      type="button"
                      onClick={() =>
                        onOpenModal(
                          `Maklumat Kakitangan: ${staff.name}`,
                          `Nama: ${staff.name}\nJawatan: ${staff.title} (${staff.grade})\nBahagian: ${staff.division}\nLokasi Pejabat: ${staff.location}\nNo. Telefon: ${staff.phone} (Ext. ${staff.ext})\nEmel Rasmi: ${staff.email}\n\nWaktu Urusan: 8.00 pagi - 5.00 petang (Isnin - Jumaat)`
                        )
                      }
                      className="p-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      title="Lihat Maklumat Penuh"
                    >
                      <i className="fa-solid fa-circle-info"></i>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="md:col-span-3 text-center py-10 bg-slate-50 rounded-2xl border border-slate-200 text-slate-500">
                <i className="fa-solid fa-user-slash text-3xl text-slate-400 mb-2"></i>
                <p className="text-sm font-semibold">Tiada rekod kakitangan ditemui bagi carian tersebut.</p>
                <button
                  type="button"
                  onClick={() => {
                    setStaffSearchQuery('');
                    setSelectedCategoryFilter('Semua');
                  }}
                  className="mt-3 px-4 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Tetapkan Semula Carian
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

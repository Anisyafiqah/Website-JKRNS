/**
 * Default Seed Content for JKR Negeri Sembilan CMS
 * This guarantees all existing portal content is preserved and immediately editable.
 */

export interface CMSContent {
  siteConfig: {
    portalName: string;
    portalSubtitle: string;
    stateName: string;
    hotline: string;
    email: string;
    address: string;
    operatingHours: string;
    facebookUrl: string;
    twitterUrl: string;
    youtubeUrl: string;
    disclaimer: string;
    copyright: string;
  };
  homeHeroSlides: Array<{
    id: string;
    badge: string;
    badgeEn: string;
    title: string;
    titleEn: string;
    highlightText: string;
    description: string;
    descriptionEn: string;
    primaryButtonText: string;
    primaryButtonPage: string;
    secondaryButtonText: string;
    secondaryButtonPage: string;
    bgGradient: string;
    bgImage?: string;
    status: 'published' | 'draft';
    order: number;
  }>;
  homeNotice: {
    active: boolean;
    badge: string;
    badgeEn: string;
    date: string;
    title: string;
    titleEn: string;
    description: string;
    descriptionEn: string;
    detourTitle: string;
    detourDetails: string;
  };
  homeGateways: Array<{
    id: string;
    moduleNum: string;
    title: string;
    titleEn: string;
    description: string;
    descriptionEn: string;
    icon: string;
    targetPage: string;
    borderColor: string;
    status: 'published' | 'draft';
  }>;
  homeAudienceTabs: {
    awamCards: Array<{
      id: string;
      icon: string;
      iconBg: string;
      iconColor: string;
      title: string;
      description: string;
      actionText: string;
      targetPage: string;
    }>;
    kontraktorCards: Array<{
      id: string;
      icon: string;
      iconBg: string;
      iconColor: string;
      title: string;
      description: string;
      actionText: string;
      targetPage: string;
    }>;
    agensiCards: Array<{
      id: string;
      icon: string;
      iconBg: string;
      iconColor: string;
      title: string;
      description: string;
      actionText: string;
      targetPage: string;
    }>;
  };
  profilKorporat: {
    perutusan: {
      pengarahName: string;
      pengarahTitle: string;
      pengarahGrade: string;
      pengarahPhoto: string;
      quote: string;
      paragraphs: string[];
    };
    visiMisi: {
      visi: string;
      visiEn: string;
      misi: string[];
      misiEn: string[];
      objektif: string[];
    };
    fungsiUtama: Array<{
      id: string;
      title: string;
      description: string;
      icon: string;
    }>;
    cartaOrganisasi: Array<{
      id: string;
      position: string;
      name: string;
      level: 'top' | 'deputy' | 'division';
      photo?: string;
    }>;
    piagamPelanggan: Array<{
      id: string;
      service: string;
      commitment: string;
      timeframe: string;
      complianceRate: string;
    }>;
    sejarahMilestones: Array<{
      id: string;
      year: string;
      title: string;
      description: string;
    }>;
  };
  bahagianCawangan: {
    hqDivisions: Array<{
      id: string;
      code: string;
      name: string;
      ketua: string;
      email: string;
      phone: string;
      functions: string[];
      location: string;
    }>;
    districts: Array<{
      id: string;
      name: string;
      engineer: string;
      engineerTitle: string;
      address: string;
      phone: string;
      fax: string;
      email: string;
      wazeUrl: string;
      mapsUrl: string;
      coverageKm: string;
    }>;
    staffDirectory: Array<{
      id: string;
      name: string;
      position: string;
      department: string;
      grade: string;
      email: string;
      phone: string;
      category: 'Pengurusan' | 'Jalan' | 'Bangunan' | 'Elektrik' | 'Mekanikal' | 'BKUB' | 'BRADS' | 'Arkitek' | 'Korporat' | 'Pentadbiran' | 'Projek Khas' | 'Daerah';
    }>;
  };
  kontraktorPolicies: {
    cidbGuideline: {
      title: string;
      description: string;
      grades: Array<{ grade: string; limit: string; description: string }>;
    };
    ipcCharter: {
      title: string;
      targetDays: number;
      steps: Array<{ step: number; title: string; desc: string }>;
    };
    abmsPolicy: {
      title: string;
      isoCode: string;
      statement: string;
      whistleblowerEmail: string;
    };
  };
  downloads: Array<{
    id: string;
    title: string;
    category: 'Borang Permohonan' | 'Garis Panduan Teknikal' | 'Pekeliling & Warta' | 'Arkib';
    fileSize: string;
    format: string;
    fileUrl: string;
    updateDate: string;
    downloadsCount: number;
  }>;
  wargaLinks: Array<{
    id: string;
    title: string;
    subtitle: string;
    description: string;
    icon: string;
    color: string;
    url: string;
    target: string;
  }>;
}

export const defaultCmsContent: CMSContent = {
  siteConfig: {
    portalName: 'JABATAN KERJA RAYA',
    portalSubtitle: 'NEGERI SEMBILAN DARUL KHUSUS',
    stateName: 'Negeri Sembilan Darul Khusus',
    hotline: '06-765 9000 / 06-765 9100',
    email: 'korporat.jkrns@ns.gov.my',
    address: 'Tingkat 1-3, Blok C, Wisma Negeri, 70503 Seremban, Negeri Sembilan Darul Khusus',
    operatingHours: 'Isnin - Khamis: 8:00 PG - 5:00 PTG | Jumaat: 8:00 PG - 12:15 TGH & 2:45 PTG - 5:00 PTG',
    facebookUrl: 'https://facebook.com/jkrns',
    twitterUrl: 'https://twitter.com/jkrns',
    youtubeUrl: 'https://youtube.com',
    disclaimer: 'Jabatan Kerja Raya Negeri Sembilan tidak bertanggungjawab terhadap sebarang kehilangan atau kerosakan yang dialami kerana menggunakan maklumat dalam portal ini.',
    copyright: '© 2026 Jabatan Kerja Raya Negeri Sembilan Darul Khusus. Hak Cipta Terpelihara.'
  },
  homeHeroSlides: [
    {
      id: 'slide-1',
      badge: 'Penyambung Warisan & Kejuruteraan',
      badgeEn: 'Bridging Heritage & Engineering',
      title: 'Penaiktarafan Laluan Persekutuan &',
      titleEn: 'Upgrading Federal Routes &',
      highlightText: 'Jaringan Jalan Negeri',
      description: 'Memacu pembangunan jaringan infrastruktur berkualiti tinggi merentasi 7 daerah di Negeri Sembilan berpaksikan kemampanan teknologi dan kelancaran pergerakan rakyat.',
      descriptionEn: 'Driving high-quality infrastructure development across 7 districts in Negeri Sembilan anchored on technology sustainability and seamless citizen mobility.',
      primaryButtonText: 'Modul Kontraktor (Tender)',
      primaryButtonPage: 'kontraktor',
      secondaryButtonText: 'Buka Modul e-Aduan',
      secondaryButtonPage: 'aduan',
      bgGradient: 'from-[#0B0F19] via-[#0B0F19]/85 to-transparent',
      status: 'published',
      order: 1
    },
    {
      id: 'slide-2',
      badge: 'Tindakan Pantas MyJalan',
      badgeEn: 'MyJalan Fast Action',
      title: 'Inisiatif Sifar Pothole &',
      titleEn: 'Zero Pothole Initiative &',
      highlightText: 'Pembaikan Lubang 24 Jam',
      description: 'Tindakan tampalan segera bagi keselamatan pengguna jalan raya di Seremban, Port Dickson, Jempol, Jelebu, Kuala Pilah, Rembau, dan Tampin dengan integrasi koordinat GPS masa nyata.',
      descriptionEn: 'Swift patching operations ensuring motorist safety across Seremban, Port Dickson, Jempol, Jelebu, Kuala Pilah, Rembau, and Tampin integrated with real-time GPS coordinates.',
      primaryButtonText: 'Lapor Lubang Jalan',
      primaryButtonPage: 'aduan',
      secondaryButtonText: 'Bahagian & Pejabat Daerah',
      secondaryButtonPage: 'bahagian',
      bgGradient: 'from-[#0B0F19] via-slate-900 to-red-950/70',
      status: 'published',
      order: 2
    },
    {
      id: 'slide-3',
      badge: 'Warisan & Fasiliti Awam',
      badgeEn: 'Heritage & Public Facilities',
      title: 'Seni Bina Minangkabau &',
      titleEn: 'Minangkabau Heritage &',
      highlightText: 'Bangunan Awam Berimpak Tinggi',
      description: 'Memelihara identiti Adat Perpatih dalam reka bentuk kompleks pentadbiran, fasiliti kesihatan, dan dewan komuniti bertaraf dunia di seluruh Negeri Sembilan.',
      descriptionEn: 'Preserving customary Adat Perpatih identity in administrative complexes, healthcare clinics, and world-class multipurpose halls across Negeri Sembilan.',
      primaryButtonText: 'Ketahui Profil Korporat',
      primaryButtonPage: 'profil',
      secondaryButtonText: 'Portal Warga JKRNS',
      secondaryButtonPage: 'warga',
      bgGradient: 'from-[#0B0F19] via-slate-900 to-amber-950/60',
      status: 'published',
      order: 3
    }
  ],
  homeNotice: {
    active: true,
    badge: 'Notis Laluan Semasa',
    badgeEn: 'Active Road Advisory',
    date: '03 November 2026',
    title: 'Penutupan Sementara Laluan FT086 (Jalan Jelebu - Pantai KM 14-16)',
    titleEn: 'Temporary Closure on Route FT086 (Jelebu - Pantai KM 14-16)',
    description: 'Kerja penstabilan cerun dan mitigasi runtuhan tanah sedang aktif dijalankan. Pengguna disarankan menggunakan laluan alternatif melalui Bukit Tangga atau sambungan Lebuhraya Kajang-Seremban (LEKAS).',
    descriptionEn: 'Slope stabilization and landslide mitigation works are actively underway. Motorists are advised to utilize alternative detours via Bukit Tangga or the LEKAS Highway.',
    detourTitle: 'Pelan Lencongan Laluan FT086',
    detourDetails: 'Jadual Kerja Penstabilan Cerun:\nTarikh Mula: 1 November 2026\nTarikh Jangka Siap: 15 November 2026\nLaluan Alternatif 1: N30 Jalan Bukit Tangga\nLaluan Alternatif 2: E21 Lebuhraya LEKAS susur keluar Mantin.'
  },
  homeGateways: [
    {
      id: 'gw-1',
      moduleNum: 'Modul 1',
      title: 'Profil Korporat',
      titleEn: 'Corporate Profile',
      description: 'Perutusan Pengarah, Visi, Misi, Objektif, Piagam Pelanggan, Carta Organisasi dan lipatan sejarah JKR NS.',
      descriptionEn: 'Director’s address, Vision, Mission, Customer Charter, and Departmental Heritage.',
      icon: 'fa-landmark',
      targetPage: 'profil',
      borderColor: 'border-[#FFD100]',
      status: 'published'
    },
    {
      id: 'gw-2',
      moduleNum: 'Modul 2',
      title: 'Bahagian & Cawangan',
      titleEn: 'HQ Divisions & Districts',
      description: '10 Bahagian & Cawangan Ibu Pejabat, Sub-Modul 7 Pejabat Daerah dan Direktori Senarai Nama Kakitangan.',
      descriptionEn: '10 HQ technical divisions, 7 district offices sub-module, and official staff telephone directory.',
      icon: 'fa-sitemap',
      targetPage: 'bahagian',
      borderColor: 'border-[#DC2626]',
      status: 'published'
    },
    {
      id: 'gw-3',
      moduleNum: 'Modul 3',
      title: 'Kontraktor & Perolehan',
      titleEn: 'Contractors & Tenders',
      description: 'Iklan tender, sebut harga kerja pembinaan/mekanikal/elektrikal, keputusan rasmi dan syarat CIDB/SPKK.',
      descriptionEn: 'Active tenders, engineering quotation notices, award lists, and CIDB registration guidelines.',
      icon: 'fa-file-contract',
      targetPage: 'kontraktor',
      borderColor: 'border-[#111827]',
      status: 'published'
    },
    {
      id: 'gw-4',
      moduleNum: 'Modul 4',
      title: 'e-Aduan Kerosakan 24 Jam',
      titleEn: '24h Damage e-Complaint',
      description: 'Borang laporan pothole dengan GPS masa nyata, muat naik foto kerosakan, dan semakan tiket rujukan.',
      descriptionEn: 'Fast road pothole reports with live GPS, photo upload, and instant status tracker.',
      icon: 'fa-road-circle-exclamation',
      targetPage: 'aduan',
      borderColor: 'border-red-500',
      status: 'published'
    },
    {
      id: 'gw-5',
      moduleNum: 'Modul 5',
      title: 'Pusat Muat Turun Borang',
      titleEn: 'Forms & Downloads',
      description: 'Borang rasmi permit mengorek jalan & utiliti, latihan industri pelajar, senarai semak bayaran interim, dan pekeliling.',
      descriptionEn: 'Official trenching permit applications, internship forms, and technical road specifications.',
      icon: 'fa-folder-open',
      targetPage: 'muatturun',
      borderColor: 'border-blue-500',
      status: 'published'
    },
    {
      id: 'gw-6',
      moduleNum: 'Modul 6',
      title: 'Warga JKRNS',
      titleEn: 'Warga JKRNS',
      description: 'Gerbang aplikasi staf: HRMIS 2.0, iSPEKS, SKALA, e-Kursus & CPD BEM, MyJalan, dan My-KJ repositori kejuruteraan.',
      descriptionEn: 'Official intranet portal for staff: HRMIS, iSPEKS, SKALA project monitoring, and engineering knowledge base.',
      icon: 'fa-users-gear',
      targetPage: 'warga',
      borderColor: 'border-emerald-500',
      status: 'published'
    }
  ],
  homeAudienceTabs: {
    awamCards: [
      {
        id: 'awam-1',
        icon: 'fa-bullhorn',
        iconBg: 'bg-red-100',
        iconColor: 'text-[#DC2626]',
        title: 'Saluran Aduan Rasmi 24 Jam',
        description: 'Gunakan modul e-Aduan digital untuk melaporkan jalan rosak, lampu isyarat padam, atau penghadang jalan rosak secara terus ke JKR daerah.',
        actionText: 'Hantar Aduan Sekarang',
        targetPage: 'aduan'
      },
      {
        id: 'awam-2',
        icon: 'fa-building-user',
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-700',
        title: '7 Pejabat Daerah JKR',
        description: 'Ketahui alamat, talian am, dan panduan arah Waze / Google Maps ke pejabat JKR di Seremban, Port Dickson, Rembau, Kuala Pilah, Jempol, Jelebu, dan Tampin.',
        actionText: 'Lihat Direktori Daerah',
        targetPage: 'bahagian'
      },
      {
        id: 'awam-3',
        icon: 'fa-file-arrow-down',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-700',
        title: 'Borang Latihan Industri Pelajar',
        description: 'Pelajar universiti/politeknik bidang kejuruteraan awam, elektrik, mekanikal, dan ukur bahan boleh memohon penempatan praktikal di JKR NS.',
        actionText: 'Muat Turun Borang',
        targetPage: 'muatturun'
      }
    ],
    kontraktorCards: [
      {
        id: 'kont-1',
        icon: 'fa-gavel',
        iconBg: 'bg-yellow-100',
        iconColor: 'text-amber-800',
        title: 'Pusat Tender & Sebut Harga',
        description: 'Muat turun kenyataan tender, jadual sebut harga, dan syarat kelayakan pendaftaran CIDB / PKK bagi kerja pembinaan awam.',
        actionText: 'Buka Senarai Tender',
        targetPage: 'kontraktor'
      },
      {
        id: 'kont-2',
        icon: 'fa-receipt',
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-800',
        title: 'Tuntutan Bayaran Interim (IPC)',
        description: 'JKR NS mematuhi piagam penyelesaian sijil bayaran kemajuan kerja kontraktor dalam tempoh 14 hari selepas permohonan lengkap.',
        actionText: 'Panduan Bayaran Interim',
        targetPage: 'kontraktor'
      },
      {
        id: 'kont-3',
        icon: 'fa-scale-balanced',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-800',
        title: 'Polisi Anti-Rasuah (ABMS)',
        description: 'Semua urusan perolehan tertakluk kepada Sistem Pengurusan Anti-Rasuah ISO 37001 bagi menjamin integriti saksama.',
        actionText: 'Ketahui Polisi ABMS',
        targetPage: 'kontraktor'
      }
    ],
    agensiCards: [
      {
        id: 'agensi-1',
        icon: 'fa-compass-drafting',
        iconBg: 'bg-slate-100',
        iconColor: 'text-slate-800',
        title: 'Perundingan Kejuruteraan',
        description: 'Khidmat nasihat teknikal reka bentuk jalan, struktur bangunan awam, dan penyelenggaraan aset premis kerajaan negeri.',
        actionText: 'Hubungi Bahagian Teknikal',
        targetPage: 'bahagian'
      },
      {
        id: 'agensi-2',
        icon: 'fa-helmet-safety',
        iconBg: 'bg-cyan-100',
        iconColor: 'text-cyan-800',
        title: 'Kelulusan Permit Korekan Jalan',
        description: 'Permohonan laluan utiliti (air, elektrik, gentian optik) perlu melalui semakan teknikal JKR Daerah sebelum kerja bermula.',
        actionText: 'Borang Permit Utiliti',
        targetPage: 'muatturun'
      },
      {
        id: 'agensi-3',
        icon: 'fa-diagram-project',
        iconBg: 'bg-indigo-100',
        iconColor: 'text-indigo-800',
        title: 'Pemantauan Projek Negeri',
        description: 'Penyelarasan laporan kemajuan fizikal bersama Unit Perancang Ekonomi Negeri (UPEN) Negeri Sembilan.',
        actionText: 'Sistem SKALA JKR',
        targetPage: 'warga'
      }
    ]
  },
  profilKorporat: {
    perutusan: {
      pengarahName: 'Ir. Haji Abdul Shukor bin Abdul Rashid',
      pengarahTitle: 'Pengarah Jabatan Kerja Raya Negeri Sembilan',
      pengarahGrade: 'Jawatan Utama Sektor Awam (JUSA)',
      pengarahPhoto: '',
      quote: '"Menerajui Transformasi Infrastruktur Negeri Sembilan yang Berdaya Tahan, Selamat, dan Memelihara Nilai Warisan Adat Perpatih."',
      paragraphs: [
        'Assalamualaikum Warahmatullahi Wabarakatuh dan Salam Sejahtera.',
        'Selamat datang ke Portal Rasmi Jabatan Kerja Raya (JKR) Negeri Sembilan Darul Khusus. Sebagai agensi teknikal utama kerajaan negeri, JKR Negeri Sembilan komited dalam menyediakan perkhidmatan kejuruteraan bertaraf dunia bagi merealisasikan aspirasi pembangunan negeri yang mampan dan inklusif.',
        'Dalam menghadapi cabaran pemodenan dan perubahan iklim, kami mengadaptasi teknologi kejuruteraan terkini seperti Building Information Modelling (BIM), pengurusan aset berasaskan digital, serta inisiatif tindak balas pantas seperti Inisiatif Sifar Pothole dan platform MyJalan.',
        'Kami juga sentiasa berpegang teguh kepada prinsip integriti melalui pelaksanaan Sistem Pengurusan Anti-Rasuah (ABMS) ISO 37001 dan Sistem Pengurusan Kualiti ISO 9001:2015. Portal ini berfungsi sebagai jendela interaksi antara JKRNS bersama rakyat, kontraktor, dan agensi rakan strategik.',
        'Semoga portal ini memberi manfaat yang optimum kepada semua pihak. Terima kasih atas sokongan berterusan anda kepada JKR Negeri Sembilan.'
      ]
    },
    visiMisi: {
      visi: 'Menjadi Penyedia Perkhidmatan Infrastruktur dan Pengurusan Aset Awam Terunggul Berteraskan Kejuruteraan Termaju dan Integriti.',
      visiEn: 'To be the preeminent infrastructure service and public asset management provider anchored on advanced engineering and integrity.',
      misi: [
        'Memastikan perkhidmatan perundingan kejuruteraan awam, mekanikal, elektrikal, dan ukur bahan yang berkualiti tinggi dan kos efektif.',
        'Melaksanakan projek pembangunan infrastruktur jalan, jambatan, dan bangunan awam menepati masa, kualiti, dan kos yang ditetapkan.',
        'Mengekalkan tahap kebolehkhidmatan dan keselamatan aset infrastruktur awam secara mampan demi kesejahteraan rakyat Negeri Sembilan.'
      ],
      misiEn: [
        'Deliver top-tier, cost-effective civil, mechanical, electrical, and quantity surveying engineering consultation services.',
        'Execute road, bridge, and public building development projects strictly meeting schedule, budget, and quality standards.',
        'Sustain optimum serviceability and safety of state public infrastructure assets for citizen wellbeing.'
      ],
      objektif: [
        'Mencapai sekurang-kurangnya 95% kepuasan pelanggan terhadap perkhidmatan kejuruteraan dan fasiliti.',
        'Menyelesaikan aduan kerosakan kritikal jalan raya (pothole) dalam tempoh 24 jam.',
        'Memastikan 100% projek persekutuan dan negeri diuruskan mengikut piawaian ISO 9001:2015.',
        'Menyelesaikan perakuan bayaran interim (IPC) kontraktor dalam tempoh 14 hari.'
      ]
    },
    fungsiUtama: [
      {
        id: 'func-1',
        title: 'Pembangunan & Penyelenggaraan Jalan',
        description: 'Merancang, mereka bentuk, membina dan menyelenggara rangkaian Jalan Persekutuan dan Jalan Negeri merangkumi lebih 4,200 km di Negeri Sembilan.',
        icon: 'fa-road'
      },
      {
        id: 'func-2',
        title: 'Kejuruteraan Bangunan Awam',
        description: 'Melaksanakan reka bentuk arkitek dan struktur bagi kompleks pentadbiran kerajaan, hospital, klinik kesihatan, balai raya, dan fasiliti warisan.',
        icon: 'fa-building'
      },
      {
        id: 'func-3',
        title: 'Perkhidmatan Mekanikal & Elektrikal',
        description: 'Menyediakan kepakaran pemasangan lif, pendingin hawa berpusat, sistem pencegahan kebakaran, dan lampu jalan fotovoltaik pintar.',
        icon: 'fa-bolt'
      },
      {
        id: 'func-4',
        title: 'Pengurusan Kontrak & Ukur Bahan',
        description: 'Menguruskan perolehan tender kerajaan, anggaran kos projek, penyediaan dokumen kontrak, dan penilaian bayaran interim secara telus.',
        icon: 'fa-calculator'
      }
    ],
    cartaOrganisasi: [
      {
        id: 'org-1',
        position: 'Pengarah JKR Negeri Sembilan',
        name: 'Ir. Haji Abdul Shukor bin Abdul Rashid',
        level: 'top'
      },
      {
        id: 'org-2',
        position: 'Timbalan Pengarah (Pembangunan)',
        name: 'Ir. Ts. Mohd Azhar bin Zainal',
        level: 'deputy'
      },
      {
        id: 'org-3',
        position: 'Timbalan Pengarah (Penyelenggaraan)',
        name: 'Ir. Norazman bin Hashim',
        level: 'deputy'
      },
      {
        id: 'org-4',
        position: 'Ketua Bahagian Jalan',
        name: 'Ir. Wan Rosli bin Wan Ismail',
        level: 'division'
      },
      {
        id: 'org-5',
        position: 'Ketua Bahagian Bangunan',
        name: 'Ar. Siti Rohani binti Mansor',
        level: 'division'
      },
      {
        id: 'org-6',
        position: 'Ketua Cawangan Elektrik',
        name: 'Ir. Khairul Anuar bin Basir',
        level: 'division'
      },
      {
        id: 'org-7',
        position: 'Ketua Cawangan Mekanikal',
        name: 'Ir. Ahmad Tarmizi bin Othman',
        level: 'division'
      },
      {
        id: 'org-8',
        position: 'Ketua Cawangan Kontrak & Ukur Bahan (BKUB)',
        name: 'Sr. Norhafizah binti Che Mat',
        level: 'division'
      }
    ],
    piagamPelanggan: [
      {
        id: 'piagam-1',
        service: 'Aduan Jalan Berlubang (Pothole)',
        commitment: 'Mengambil tindakan penampalan kecemasan dalam tempoh 24 jam selepas aduan diterima.',
        timeframe: '24 Jam',
        complianceRate: '98.4%'
      },
      {
        id: 'piagam-2',
        service: 'Perakuan Bayaran Interim Kontraktor (IPC)',
        commitment: 'Mengeluarkan Sijil Bayaran Interim dalam tempoh 14 hari dari tarikh tuntutan lengkap.',
        timeframe: '14 Hari',
        complianceRate: '99.1%'
      },
      {
        id: 'piagam-3',
        service: 'Ulasan Pelan Pembangunan Infrastruktur',
        commitment: 'Menyediakan ulasan teknikal permohonan kebenaran merancang (OSC) dalam tempoh 14 hari bekerja.',
        timeframe: '14 Hari Bekerja',
        complianceRate: '96.8%'
      },
      {
        id: 'piagam-4',
        service: 'Permohonan Permit Korekan Jalan Utiliti',
        commitment: 'Memproses dan memberi maklum balas kelulusan permit pengorekan utiliti dalam tempoh 21 hari bekerja.',
        timeframe: '21 Hari Bekerja',
        complianceRate: '95.5%'
      }
    ],
    sejarahMilestones: [
      {
        id: 'milestone-1',
        year: '1889',
        title: 'Penubuhan Awal Public Works Department (PWD) Sungei Ujong',
        description: 'Pembinaan jalan kereta lembu dan jambatan kayu pertama menghubungkan Seremban dan Pengkalan Kempas bagi aktiviti perdagangan bijih timah.'
      },
      {
        id: 'milestone-2',
        year: '1957',
        title: 'Peralihan Kemerdekaan & Penstrukturan PWD Negeri Sembilan',
        description: 'Penjenamaan kepada Jabatan Kerja Raya (JKR) dan penumpuan kepada pembinaan jalan luar bandar serta sekolah kebangsaan pasca kemerdekaan.'
      },
      {
        id: 'milestone-3',
        year: '1987',
        title: 'Perpindahan ke Wisma Negeri Seremban',
        description: 'Ibu pejabat JKRNS beroperasi secara berpusat di Wisma Negeri bagi memperkemaskan koordinasi bersama pentadbiran Setiausaha Kerajaan Negeri (SUK).'
      },
      {
        id: 'milestone-4',
        year: '2026',
        title: 'Era Pendigitalan Pintar, BIM & Sifar Pothole MyJalan',
        description: 'Pelaksanaan menyeluruh sistem e-Aduan geolokasi, integrasi perolehan telus, dan pensijilan Anti-Bribery Management System ISO 37001.'
      }
    ]
  },
  bahagianCawangan: {
    hqDivisions: [
      {
        id: 'hq-1',
        code: 'JALAN',
        name: 'Bahagian Jalan & Jambatan',
        ketua: 'Ir. Wan Rosli bin Wan Ismail',
        email: 'jalan.jkrns@ns.gov.my',
        phone: '06-765 9120',
        location: 'Tingkat 2, Blok C, Wisma Negeri',
        functions: [
          'Merancang dan merekabentuk jaringan Jalan Persekutuan dan Jalan Negeri.',
          'Pengurusan program penurapan berkala dan pelebaran jalan.',
          'Pemeriksaan struktur keselamatan jambatan dan cerun kritikal.',
          'Penyelarasan audit keselamatan jalan raya (Road Safety Audit).'
        ]
      },
      {
        id: 'hq-2',
        code: 'BANGUNAN',
        name: 'Bahagian Bangunan & Fasiliti Awam',
        ketua: 'Ar. Siti Rohani binti Mansor',
        email: 'bangunan.jkrns@ns.gov.my',
        phone: '06-765 9140',
        location: 'Tingkat 2, Blok C, Wisma Negeri',
        functions: [
          'Reka bentuk seni bina bangunan kerajaan bercirikan Minangkabau.',
          'Penyeliaan tapak binaan kompleks pentadbiran dan dewan masyarakat.',
          'Pemeriksaan integriti struktur dan forensik kegagalan bangunan.',
          'Khidmat perundingan reka bentuk lestari (Green Building).'
        ]
      },
      {
        id: 'hq-3',
        code: 'ELEKTRIK',
        name: 'Cawangan Kejuruteraan Elektrik',
        ketua: 'Ir. Khairul Anuar bin Basir',
        email: 'elektrik.jkrns@ns.gov.my',
        phone: '06-765 9160',
        location: 'Tingkat 3, Blok C, Wisma Negeri',
        functions: [
          'Pemasangan dan penyelenggaraan lampu jalan persekutuan/negeri.',
          'Reka bentuk sistem voltan tinggi, sederhana, dan genset kecemasan.',
          'Penyenggaraan sistem lampu isyarat pintar berkomputer.',
          'Pemasangan sistem solar fotovoltaik di fasiliti awam.'
        ]
      },
      {
        id: 'hq-4',
        code: 'MEKANIKAL',
        name: 'Cawangan Kejuruteraan Mekanikal',
        ketua: 'Ir. Ahmad Tarmizi bin Othman',
        email: 'mekanikal.jkrns@ns.gov.my',
        phone: '06-765 9170',
        location: 'Tingkat 3, Blok C, Wisma Negeri',
        functions: [
          'Pengurusan sistem penyaman udara berpusat (HVAC) premis kerajaan.',
          'Pemasangan lif, eskalator, dan kren angkat bengkel.',
          'Penyelenggaraan sistem pencegahan kebakaran automatik.',
          'Pengurusan loji rawatan kumbahan premis awam.'
        ]
      },
      {
        id: 'hq-5',
        code: 'BKUB',
        name: 'Cawangan Kontrak & Ukur Bahan (BKUB)',
        ketua: 'Sr. Norhafizah binti Che Mat',
        email: 'bkub.jkrns@ns.gov.my',
        phone: '06-765 9180',
        location: 'Tingkat 1, Blok C, Wisma Negeri',
        functions: [
          'Penyediaan anggaran kos awalan dan jadual kuantiti (BQ).',
          'Pengiklanan tender, urus setia perolehan, dan analisis tender.',
          'Penyediaan dokumen perjanjian kontrak rasmi.',
          'Penilaian bayaran interim, pelarasan turun naik harga, dan akaun akhir.'
        ]
      },
      {
        id: 'hq-6',
        code: 'CPAB',
        name: 'Cawangan Pengurusan Aset Bersepadu (CPAB)',
        ketua: 'Ir. Ts. Hairul Nizam bin Dahlan',
        email: 'cpab.jkrns@ns.gov.my',
        phone: '06-765 9190',
        location: 'Tingkat 1, Blok C, Wisma Negeri',
        functions: [
          'Pengurusan pangkalan data aset infrastruktur kerajaan negeri.',
          'Pelaksanaan Total Asset Management System (TAMS).',
          'Pemantauan kitaran hayat aset dan pelan pelupusan fasiliti.'
        ]
      },
      {
        id: 'hq-7',
        code: 'BRADS',
        name: 'Cawangan Reka Bentuk & Arkitek (BRADS)',
        ketua: 'Ar. Muhammad Haziq bin Razali',
        email: 'brads.jkrns@ns.gov.my',
        phone: '06-765 9145',
        location: 'Tingkat 2, Blok C, Wisma Negeri',
        functions: [
          'Reka bentuk konsep visual dan pemodelan 3D Building Information Modelling.',
          'Pemeliharaan seni bina Adat Perpatih pada fasiliti baharu.',
          'Reka bentuk landskap jalan dan dataran awam.'
        ]
      },
      {
        id: 'hq-8',
        code: 'PENTADBIRAN',
        name: 'Bahagian Pengurusan & Kewangan',
        ketua: 'Puan Siti Noraisyah binti Kamarudin',
        email: 'kewangan.jkrns@ns.gov.my',
        phone: '06-765 9105',
        location: 'Tingkat 1, Blok C, Wisma Negeri',
        functions: [
          'Pengurusan sumber manusia, perjawatan, latihan dan CPD kakitangan.',
          'Pengurusan bajet mengurus dan akaun melalui sistem iSPEKS.',
          'Pengurusan integriti, tatatertib, dan kawalan rekod rasmi.'
        ]
      },
      {
        id: 'hq-9',
        code: 'PROJEK-KHAS',
        name: 'Unit Projek Khas & Persekutuan',
        ketua: 'Ir. Zulkifli bin Yaacob',
        email: 'projekkhas.jkrns@ns.gov.my',
        phone: '06-765 9155',
        location: 'Tingkat 2, Blok C, Wisma Negeri',
        functions: [
          'Penyeliaan projek berimpak tinggi kementerian persekutuan.',
          'Projek fasiliti keselamatan dan pangkalan tentera/polis.',
          'Koordinasi rentas agensi bagi infrastruktur strategik.'
        ]
      },
      {
        id: 'hq-10',
        code: 'KORPORAT',
        name: 'Unit Komunikasi Korporat & IT',
        ketua: 'Encik Faris Danial bin Ridzuan',
        email: 'korporat.jkrns@ns.gov.my',
        phone: '06-765 9110',
        location: 'Tingkat 1, Blok C, Wisma Negeri',
        functions: [
          'Pengurusan portal rasmi, media sosial, dan hebahan media.',
          'Pengurusan maklum balas awam dan aduan SISPAA / e-Aduan.',
          'Penyelenggaraan infrastruktur ICT dan keselamatan siber.'
        ]
      }
    ],
    districts: [
      {
        id: 'dist-seremban',
        name: 'JKR Daerah Seremban',
        engineer: 'Ir. Mohd Fadhil bin Abdul Karim',
        engineerTitle: 'Jurutera Daerah Seremban',
        address: 'KM 4, Jalan Seremban - Tampin, 70450 Seremban, Negeri Sembilan',
        phone: '06-762 3344 / 06-762 3345',
        fax: '06-763 8812',
        email: 'jkr.seremban@ns.gov.my',
        wazeUrl: 'https://waze.com/ul/hw22x8b4w7',
        mapsUrl: 'https://maps.google.com/?q=JKR+Daerah+Seremban',
        coverageKm: '942 km Jalan Negeri & Persekutuan'
      },
      {
        id: 'dist-pd',
        name: 'JKR Daerah Port Dickson',
        engineer: 'Ir. Ts. Noor Hisham bin Sulaiman',
        engineerTitle: 'Jurutera Daerah Port Dickson',
        address: 'Batu 1, Jalan Seremban, 71000 Port Dickson, Negeri Sembilan',
        phone: '06-647 1222 / 06-647 1223',
        fax: '06-647 3481',
        email: 'jkr.portdickson@ns.gov.my',
        wazeUrl: 'https://waze.com/ul/hw22k91j62',
        mapsUrl: 'https://maps.google.com/?q=JKR+Daerah+Port+Dickson',
        coverageKm: '584 km Jalan Pesisir Pantai & Pelancongan'
      },
      {
        id: 'dist-jempol',
        name: 'JKR Daerah Jempol',
        engineer: 'Ir. Kamarulzaman bin Md Isa',
        engineerTitle: 'Jurutera Daerah Jempol',
        address: 'Kompleks Pejabat Kerajaan, 72120 Bandar Seri Jempol, Negeri Sembilan',
        phone: '06-458 1333 / 06-458 1334',
        fax: '06-458 2110',
        email: 'jkr.jempol@ns.gov.my',
        wazeUrl: 'https://waze.com/ul/hw289m43e1',
        mapsUrl: 'https://maps.google.com/?q=JKR+Daerah+Jempol',
        coverageKm: '792 km Laluan Persekutuan & Felda'
      },
      {
        id: 'dist-pilah',
        name: 'JKR Daerah Kuala Pilah',
        engineer: 'Ir. Maznah binti Alias',
        engineerTitle: 'Jurutera Daerah Kuala Pilah',
        address: 'Jalan Dato\' Undang Johol, 72000 Kuala Pilah, Negeri Sembilan',
        phone: '06-481 1244 / 06-481 1245',
        fax: '06-481 2901',
        email: 'jkr.kualapilah@ns.gov.my',
        wazeUrl: 'https://waze.com/ul/hw22x8b4w7',
        mapsUrl: 'https://maps.google.com/?q=JKR+Daerah+Kuala+Pilah',
        coverageKm: '615 km Rangkaian Warisan & Kampung'
      },
      {
        id: 'dist-rembau',
        name: 'JKR Daerah Rembau',
        engineer: 'Ir. Mohd Fairuz bin Zakaria',
        engineerTitle: 'Jurutera Daerah Rembau',
        address: 'Jalan Terentang, 71300 Rembau, Negeri Sembilan',
        phone: '06-685 1300 / 06-685 1301',
        fax: '06-685 2419',
        email: 'jkr.rembau@ns.gov.my',
        wazeUrl: 'https://waze.com/ul/hw22qb95p2',
        mapsUrl: 'https://maps.google.com/?q=JKR+Daerah+Rembau',
        coverageKm: '430 km Jalan FT001 & Laluan Daerah'
      },
      {
        id: 'dist-tampin',
        name: 'JKR Daerah Tampin',
        engineer: 'Ir. Hairul Anuar bin Ibrahim',
        engineerTitle: 'Jurutera Daerah Tampin',
        address: 'Jalan Seremban - Tampin, 73000 Tampin, Negeri Sembilan',
        phone: '06-441 1255 / 06-441 1256',
        fax: '06-441 2309',
        email: 'jkr.tampin@ns.gov.my',
        wazeUrl: 'https://waze.com/ul/hw22mg78e3',
        mapsUrl: 'https://maps.google.com/?q=JKR+Daerah+Tampin',
        coverageKm: '488 km Sempadan Melaka & Johor'
      },
      {
        id: 'dist-jelebu',
        name: 'JKR Daerah Jelebu',
        engineer: 'Ir. Ahmad Syahir bin Che Hassan',
        engineerTitle: 'Jurutera Daerah Jelebu',
        address: 'Jalan Simpang Pertang, 71600 Kuala Klawang, Negeri Sembilan',
        phone: '06-613 6233 / 06-613 6234',
        fax: '06-613 7104',
        email: 'jkr.jelebu@ns.gov.my',
        wazeUrl: 'https://waze.com/ul/hw281u01v9',
        mapsUrl: 'https://maps.google.com/?q=JKR+Daerah+Jelebu',
        coverageKm: '450 km Laluan Pergunungan & Cerun'
      }
    ],
    staffDirectory: [
      {
        id: 'stf-1',
        name: 'Ir. Haji Abdul Shukor bin Abdul Rashid',
        position: 'Pengarah JKR Negeri Sembilan',
        department: 'Pejabat Pengarah',
        grade: 'JUSA C',
        email: 'shukor.rashid@ns.gov.my',
        phone: '06-765 9101',
        category: 'Pengurusan'
      },
      {
        id: 'stf-2',
        name: 'Ir. Ts. Mohd Azhar bin Zainal',
        position: 'Timbalan Pengarah (Pembangunan)',
        department: 'Pejabat Pengarah',
        grade: 'J52',
        email: 'azhar.zainal@ns.gov.my',
        phone: '06-765 9102',
        category: 'Pengurusan'
      },
      {
        id: 'stf-3',
        name: 'Ir. Norazman bin Hashim',
        position: 'Timbalan Pengarah (Penyelenggaraan)',
        department: 'Pejabat Pengarah',
        grade: 'J52',
        email: 'norazman.h@ns.gov.my',
        phone: '06-765 9103',
        category: 'Pengurusan'
      },
      {
        id: 'stf-4',
        name: 'Ir. Wan Rosli bin Wan Ismail',
        position: 'Ketua Bahagian Jalan',
        department: 'Bahagian Jalan & Jambatan',
        grade: 'J48',
        email: 'wanrosli@ns.gov.my',
        phone: '06-765 9121',
        category: 'Jalan'
      },
      {
        id: 'stf-5',
        name: 'Ar. Siti Rohani binti Mansor',
        position: 'Ketua Bahagian Bangunan',
        department: 'Bahagian Bangunan',
        grade: 'J48',
        email: 'rohani.mansor@ns.gov.my',
        phone: '06-765 9141',
        category: 'Bangunan'
      },
      {
        id: 'stf-6',
        name: 'Ir. Khairul Anuar bin Basir',
        position: 'Ketua Cawangan Elektrik',
        department: 'Cawangan Kejuruteraan Elektrik',
        grade: 'J48',
        email: 'khairul.basir@ns.gov.my',
        phone: '06-765 9161',
        category: 'Elektrik'
      },
      {
        id: 'stf-7',
        name: 'Ir. Ahmad Tarmizi bin Othman',
        position: 'Ketua Cawangan Mekanikal',
        department: 'Cawangan Kejuruteraan Mekanikal',
        grade: 'J48',
        email: 'tarmizi.o@ns.gov.my',
        phone: '06-765 9171',
        category: 'Mekanikal'
      },
      {
        id: 'stf-8',
        name: 'Sr. Norhafizah binti Che Mat',
        position: 'Ketua Cawangan Ukur Bahan',
        department: 'Cawangan Kontrak & Ukur Bahan',
        grade: 'J48',
        email: 'norhafizah.cm@ns.gov.my',
        phone: '06-765 9181',
        category: 'BKUB'
      },
      {
        id: 'stf-9',
        name: 'Ir. Mohd Fadhil bin Abdul Karim',
        position: 'Jurutera Daerah Seremban',
        department: 'JKR Daerah Seremban',
        grade: 'J48',
        email: 'fadhil.karim@ns.gov.my',
        phone: '06-762 3344',
        category: 'Daerah'
      },
      {
        id: 'stf-10',
        name: 'Ir. Ts. Noor Hisham bin Sulaiman',
        position: 'Jurutera Daerah Port Dickson',
        department: 'JKR Daerah Port Dickson',
        grade: 'J44',
        email: 'hisham.s@ns.gov.my',
        phone: '06-647 1222',
        category: 'Daerah'
      },
      {
        id: 'stf-11',
        name: 'Ir. Kamarulzaman bin Md Isa',
        position: 'Jurutera Daerah Jempol',
        department: 'JKR Daerah Jempol',
        grade: 'J44',
        email: 'kamarulzaman.i@ns.gov.my',
        phone: '06-458 1333',
        category: 'Daerah'
      },
      {
        id: 'stf-12',
        name: 'Ir. Maznah binti Alias',
        position: 'Jurutera Daerah Kuala Pilah',
        department: 'JKR Daerah Kuala Pilah',
        grade: 'J44',
        email: 'maznah.alias@ns.gov.my',
        phone: '06-481 1244',
        category: 'Daerah'
      },
      {
        id: 'stf-13',
        name: 'Ir. Mohd Fairuz bin Zakaria',
        position: 'Jurutera Daerah Rembau',
        department: 'JKR Daerah Rembau',
        grade: 'J44',
        email: 'fairuz.zakaria@ns.gov.my',
        phone: '06-685 1300',
        category: 'Daerah'
      },
      {
        id: 'stf-14',
        name: 'Ir. Hairul Anuar bin Ibrahim',
        position: 'Jurutera Daerah Tampin',
        department: 'JKR Daerah Tampin',
        grade: 'J44',
        email: 'hairul.ibrahim@ns.gov.my',
        phone: '06-441 1255',
        category: 'Daerah'
      },
      {
        id: 'stf-15',
        name: 'Ir. Ahmad Syahir bin Che Hassan',
        position: 'Jurutera Daerah Jelebu',
        department: 'JKR Daerah Jelebu',
        grade: 'J44',
        email: 'syahir.hassan@ns.gov.my',
        phone: '06-613 6233',
        category: 'Daerah'
      }
    ]
  },
  kontraktorPolicies: {
    cidbGuideline: {
      title: 'Syarat Pendaftaran Lembaga Pembangunan Industri Pembinaan (CIDB)',
      description: 'Semua kontraktor yang berhasrat menyertai perolehan JKR Negeri Sembilan mestilah mempunyai Perakuan Pendaftaran Kontraktor (PPK) dan Sijil Perolehan Kerja Kerajaan (SPKK) yang sah.',
      grades: [
        { grade: 'G1', limit: 'Sehingga RM 200,000', description: 'Khusus untuk kontraktor tempatan daerah (kerja kecil & penyelenggaraan)' },
        { grade: 'G2', limit: 'Sehingga RM 500,000', description: 'Kerja-kerja turapan tempatan dan naik taraf longkang' },
        { grade: 'G3', limit: 'Sehingga RM 1,000,000', description: 'Penyelenggaraan jambatan dan lampu jalan berpusat' },
        { grade: 'G4', limit: 'Sehingga RM 3,000,000', description: 'Kerja pembinaan jalan utama dan pembaikan cerun' },
        { grade: 'G5 - G7', limit: 'RM 5,000,000 ke atas (Tiada Had)', description: 'Projek infrastruktur mega persekutuan dan bangunan kompleks' }
      ]
    },
    ipcCharter: {
      title: 'Piagam Pelanggan Bayaran Interim Kontraktor (IPC 14 Hari)',
      targetDays: 14,
      steps: [
        { step: 1, title: 'Penyerahan Tuntutan', desc: 'Kontraktor mengemukakan permohonan bayaran beserta bukti pengukuran kerja tapak.' },
        { step: 2, title: 'Pengesahan Tapak', desc: 'Pegawai Penguasa (SO) membuat lawatan tapak dan mengesahkan kuantiti dalam 4 hari.' },
        { step: 3, title: 'Penyediaan Perakuan (BKUB)', desc: 'Cawangan Kontrak & Ukur Bahan menyemak nilai potongan wang jaminan & caruman.' },
        { step: 4, title: 'Kelulusan Pengarah / Jurutera', desc: 'Tandatangan rasmi Sijil Perakuan Bayaran Interim (Interim Payment Certificate).' },
        { step: 5, title: 'Pelepasan Bayaran', desc: 'Baucar dihantar ke Perbendaharaan Negeri untuk kredit terus ke akaun bank kontraktor.' }
      ]
    },
    abmsPolicy: {
      title: 'Dasar Sistem Pengurusan Anti-Rasuah (ABMS) ISO 37001',
      isoCode: 'ISO 37001:2016 Certified',
      statement: 'JKR Negeri Sembilan mengamalkan dasar sifar toleransi terhadap sebarang bentuk rasuah, penipuan, penyelewengan, dan salah guna kuasa dalam semua urusan perolehan kerajaan.',
      whistleblowerEmail: 'integriti.jkrns@ns.gov.my'
    }
  },
  downloads: [
    {
      id: 'dl-1',
      title: 'Borang Permohonan Permit Mengorek Jalan & Pemasangan Utiliti (Borang JKR/NS/UTL/2026)',
      category: 'Borang Permohonan',
      fileSize: '1.4 MB',
      format: 'PDF',
      fileUrl: '#download-permit-utiliti',
      updateDate: '15 Okt 2026',
      downloadsCount: 1420
    },
    {
      id: 'dl-2',
      title: 'Borang Permohonan Latihan Industri Pelajar IPTA/IPTS (Borang JKR/LI/01)',
      category: 'Borang Permohonan',
      fileSize: '420 KB',
      format: 'PDF',
      fileUrl: '#download-latihan-industri',
      updateDate: '01 Nov 2026',
      downloadsCount: 2310
    },
    {
      id: 'dl-3',
      title: 'Senarai Semak Dokumen Tuntutan Bayaran Kemajuan Interim Kontraktor (IPC Checklist)',
      category: 'Borang Permohonan',
      fileSize: '650 KB',
      format: 'PDF',
      fileUrl: '#download-ipc-checklist',
      updateDate: '20 Okt 2026',
      downloadsCount: 980
    },
    {
      id: 'dl-4',
      title: 'Spesifikasi Piawai Kerja Jalan JKR (Standard Specification for Road Works - Section 4: Flexible Pavement)',
      category: 'Garis Panduan Teknikal',
      fileSize: '3.8 MB',
      format: 'PDF',
      fileUrl: '#download-road-spec',
      updateDate: '12 Sep 2026',
      downloadsCount: 3105
    },
    {
      id: 'dl-5',
      title: 'Manual Rekabentuk Saliran & Perparitan Jalan Raya Negeri Sembilan (Road Drainage Manual 2026)',
      category: 'Garis Panduan Teknikal',
      fileSize: '5.2 MB',
      format: 'PDF',
      fileUrl: '#download-drainage-manual',
      updateDate: '05 Ogos 2026',
      downloadsCount: 1850
    },
    {
      id: 'dl-6',
      title: 'Pekeliling Am Perolehan Kerajaan Negeri Sembilan Bil. 03/2026: Pematuhan Integriti Kontraktor',
      category: 'Pekeliling & Warta',
      fileSize: '890 KB',
      format: 'PDF',
      fileUrl: '#download-pekeliling-integriti',
      updateDate: '10 Okt 2026',
      downloadsCount: 1540
    }
  ],
  wargaLinks: [
    {
      id: 'warga-1',
      title: 'HRMIS 2.0',
      subtitle: 'Sistem Maklumat Pengurusan Sumber Manusia',
      description: 'Pengurusan cuti rehat, rekod perkhidmatan, LNPT, e-Gaji, dan pengisytiharan harta penjawat awam JPA.',
      icon: 'fa-id-card-clip',
      color: 'bg-blue-600',
      url: 'https://hrmis2.eghrmis.gov.my',
      target: '_blank'
    },
    {
      id: 'warga-2',
      title: 'iSPEKS',
      subtitle: 'Sistem Perakaunan Standard Kerajaan Negeri',
      description: 'Pengurusan pesanan kerajaan (LO), baucar bayaran, tuntutan elaun perjalanan, dan lejar kewangan negeri.',
      icon: 'fa-receipt',
      color: 'bg-emerald-600',
      url: 'https://ispeks.anm.gov.my',
      target: '_blank'
    },
    {
      id: 'warga-3',
      title: 'SKALA JKR',
      subtitle: 'Sistem Kawalan & Pemantauan Projek',
      description: 'Pemantauan status fizikal dan kewangan projek pembinaan jalan, bangunan, mekanikal dan elektrikal secara masa nyata.',
      icon: 'fa-chart-pie',
      color: 'bg-amber-600',
      url: 'https://skala.jkr.gov.my',
      target: '_blank'
    },
    {
      id: 'warga-4',
      title: 'e-Kursus & CPD',
      subtitle: 'Portal Latihan & Mata Pembangunan Profesional',
      description: 'Pendaftaran kursus dalaman CREST, permohonan latihan luar, dan pengumpulan mata CPD Lembaga Jurutera Malaysia (BEM).',
      icon: 'fa-graduation-cap',
      color: 'bg-purple-600',
      url: 'https://kursus.jkr.gov.my',
      target: '_blank'
    },
    {
      id: 'warga-5',
      title: 'MyJalan JKR',
      subtitle: 'Platform Pengurusan Aduan Jalan Raya Bersepadu',
      description: 'Sistem aduan sifar pothole dan tindakan 24 jam dengan integrasi geolokasi GPS rentas daerah.',
      icon: 'fa-road',
      color: 'bg-red-600',
      url: 'https://myjalan.kkr.gov.my',
      target: '_blank'
    },
    {
      id: 'warga-6',
      title: 'My-KJ JKR',
      subtitle: 'Repositori Pengetahuan Kejuruteraan Jabatan',
      description: 'Pangkalan data standard lukisan piawai JKR, manual teknikal, garis panduan cerun, dan arkib pekeliling.',
      icon: 'fa-book-bookmark',
      color: 'bg-indigo-600',
      url: 'https://mykj.jkr.gov.my',
      target: '_blank'
    }
  ]
};

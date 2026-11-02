/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  JataNegeriSembilan,
  JkrLogo
} from './components/Logos';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminPortal } from './components/AdminPortal';

interface TenderItem {
  id: string;
  code: string;
  title: string;
  titleEn: string;
  district: string;
  closingDate: string;
  cidb: string;
  status: 'buka' | 'tutup' | 'keputusan';
  statusLabelMs: string;
  statusLabelEn: string;
  winner?: string;
}

interface DistrictInfo {
  tag: string;
  title: string;
  address: string;
  phone: string;
  fax: string;
  email: string;
  engineer: string;
  maps: string;
  waze: string;
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
  cloudflareProvider?: string;
}

interface CloudflareStatusInfo {
  connected: boolean;
  provider: string;
  storageType: string;
  totalRecords: number;
  instruction: string;
}

const TENDERS_DATA: TenderItem[] = [
  {
    id: 't-1',
    code: 'JKR/NS/JALAN/04/2026',
    title: 'Kerja-kerja Memperelok dan Menurap Semula Laluan FT001 (Seremban - Rembau)',
    titleEn: 'Road Rehabilitation and Resurfacing Works on Route FT001 (Seremban - Rembau)',
    district: 'Rembau',
    closingDate: '28 November 2026',
    cidb: 'CIDB G4 / G5 (CE21)',
    status: 'buka',
    statusLabelMs: 'Sedang Dibuka',
    statusLabelEn: 'Open'
  },
  {
    id: 't-2',
    code: 'JKR/NS/JAMB/09/2026',
    title: 'Penyelenggaraan Struktur Jambatan Sungai Linggi di Laluan N12 (Port Dickson)',
    titleEn: 'Structural Bridge Maintenance of Sungai Linggi Bridge on Route N12 (Port Dickson)',
    district: 'Port Dickson',
    closingDate: '18 November 2026',
    cidb: 'CIDB G3 (CE02)',
    status: 'buka',
    statusLabelMs: 'Sedang Dibuka',
    statusLabelEn: 'Open'
  },
  {
    id: 't-3',
    code: 'JKR/NS/BGN/01/2026',
    title: 'Membina Dewan Serbaguna Berkonsep Minangkabau di Kuala Pilah',
    titleEn: 'Construction of Minangkabau Architectural Concept Multipurpose Hall in Kuala Pilah',
    district: 'Kuala Pilah',
    closingDate: '24 Oktober 2026',
    cidb: 'CIDB G5 / G6 (B04)',
    status: 'tutup',
    statusLabelMs: 'Telah Ditutup (Penilaian)',
    statusLabelEn: 'Closed (Under Evaluation)'
  },
  {
    id: 't-4',
    code: 'JKR/NS/ELK/02/2026',
    title: 'Pemasangan Lampu Jalan Solar Pintar Sepanjang Laluan Persekutuan Jempol',
    titleEn: 'Installation of Smart Solar Street Lights along Federal Route Jempol',
    district: 'Jempol',
    closingDate: '15 Oktober 2026',
    cidb: 'CIDB G3 / G4 (E11)',
    status: 'keputusan',
    statusLabelMs: 'Keputusan Rasmi',
    statusLabelEn: 'Awarded',
    winner: 'Wawasan Elektrik NS Sdn Bhd'
  }
];

const DISTRICTS_DATA: Record<string, DistrictInfo> = {
  seremban: {
    tag: 'Ibu Pejabat Daerah JKR Seremban',
    title: 'Pejabat Jurutera Daerah Seremban',
    address: 'Kompleks Kerja Raya, Jalan S2 A47, 70300 Seremban 2, Negeri Sembilan Darul Khusus.',
    phone: '06-765 9200',
    fax: '06-763 0835',
    email: 'jkrseremban@jkr.gov.my',
    engineer: 'Ir. Mohd Fairuz bin Sulaiman',
    maps: 'https://maps.google.com/?q=JKR+Seremban',
    waze: 'https://waze.com/ul?q=JKR+Seremban'
  },
  pd: {
    tag: 'Pejabat Jurutera Daerah Port Dickson',
    title: 'JKR Daerah Port Dickson',
    address: 'KM 1, Jalan Seremban, 71000 Port Dickson, Negeri Sembilan.',
    phone: '06-647 1322',
    fax: '06-647 3881',
    email: 'jkrpd@jkr.gov.my',
    engineer: 'Ir. Norazman bin Alias',
    maps: 'https://maps.google.com/?q=JKR+Port+Dickson',
    waze: 'https://waze.com/ul?q=JKR+Port+Dickson'
  },
  rembau: {
    tag: 'Pejabat Jurutera Daerah Rembau',
    title: 'JKR Daerah Rembau',
    address: 'Jalan Dato Lela Maharaja, 71300 Rembau, Negeri Sembilan.',
    phone: '06-685 1244',
    fax: '06-685 2400',
    email: 'jkrrembau@jkr.gov.my',
    engineer: 'Ir. Ts. Siti Hajar binti Osman',
    maps: 'https://maps.google.com/?q=JKR+Rembau',
    waze: 'https://waze.com/ul?q=JKR+Rembau'
  },
  kualapilah: {
    tag: 'Pejabat Jurutera Daerah Kuala Pilah',
    title: 'JKR Daerah Kuala Pilah',
    address: 'Jalan Tampin, 72000 Kuala Pilah, Negeri Sembilan.',
    phone: '06-481 1033',
    fax: '06-481 2901',
    email: 'jkrpilah@jkr.gov.my',
    engineer: 'Ir. Ahmad Zaki bin Ismail',
    maps: 'https://maps.google.com/?q=JKR+Kuala+Pilah',
    waze: 'https://waze.com/ul?q=JKR+Kuala+Pilah'
  },
  jempol: {
    tag: 'Pejabat Jurutera Daerah Jempol',
    title: 'JKR Daerah Jempol',
    address: 'Kompleks Pentadbiran Daerah, 72120 Bandar Seri Jempol, Negeri Sembilan.',
    phone: '06-458 1200',
    fax: '06-458 2433',
    email: 'jkrjempol@jkr.gov.my',
    engineer: 'Ir. Azman bin Mat Nor',
    maps: 'https://maps.google.com/?q=JKR+Jempol',
    waze: 'https://waze.com/ul?q=JKR+Jempol'
  },
  jelebu: {
    tag: 'Pejabat Jurutera Daerah Jelebu',
    title: 'JKR Daerah Jelebu',
    address: '71600 Kuala Klawang, Jelebu, Negeri Sembilan.',
    phone: '06-613 6233',
    fax: '06-613 6911',
    email: 'jkrjelebu@jkr.gov.my',
    engineer: 'Ir. Ts. Hafizul bin Hashim',
    maps: 'https://maps.google.com/?q=JKR+Jelebu',
    waze: 'https://waze.com/ul?q=JKR+Jelebu'
  },
  tampin: {
    tag: 'Pejabat Jurutera Daerah Tampin',
    title: 'JKR Daerah Tampin',
    address: 'Jalan Kolam Air, 73000 Tampin, Negeri Sembilan.',
    phone: '06-441 1255',
    fax: '06-441 2022',
    email: 'jkrtampin@jkr.gov.my',
    engineer: 'Ir. Roslan bin Jaafar',
    maps: 'https://maps.google.com/?q=JKR+Tampin',
    waze: 'https://waze.com/ul?q=JKR+Tampin'
  }
};

export default function App() {
  // Accessibility state
  const [fontSize, setFontSize] = useState<'small' | 'normal' | 'large'>('normal');
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [lang, setLang] = useState<'BM' | 'EN'>('BM');

  // Navigation state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hero Slider state
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideCount = 3;
  const slideTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Category Tabs state
  const [activeCategoryTab, setActiveCategoryTab] = useState<'awam' | 'kontraktor' | 'agensi'>('awam');

  // Tender filter state
  const [tenderFilter, setTenderFilter] = useState<'semua' | 'buka' | 'tutup' | 'keputusan'>('semua');

  // District directory state
  const [selectedDistrict, setSelectedDistrict] = useState<string>('seremban');

  // Complaint form state
  const [formData, setFormData] = useState({
    nama: '',
    telefon: '',
    daerah: 'Seremban',
    kategori: 'Jalan Berlubang (Pothole) - Tindakan 24 Jam',
    gps: '',
    keterangan: '',
    gambar: ''
  });
  const [gpsStatus, setGpsStatus] = useState<string>(
    'Tekan butang untuk memasukkan lokasi telefon/komputer anda secara automatik.'
  );
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submittedComplaints, setSubmittedComplaints] = useState<ComplaintRecord[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Cloudflare Status State
  const [cloudflareInfo, setCloudflareInfo] = useState<CloudflareStatusInfo>({
    connected: false,
    provider: 'Memuatkan status...',
    storageType: 'Loading',
    totalRecords: 0,
    instruction: ''
  });

  // Ticket Lookup state
  const [ticketSearchInput, setTicketSearchInput] = useState('');
  const [foundTicket, setFoundTicket] = useState<ComplaintRecord | null>(null);

  // Modal Dialog state
  const [modalState, setModalState] = useState<{
    open: boolean;
    title: string;
    content: string;
  }>({
    open: false,
    title: '',
    content: ''
  });

  // Admin Module State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('jkr_admin_token') === 'jkr-ns-admin-session-token-2026';
  });
  const [showAdminLoginModal, setShowAdminLoginModal] = useState<boolean>(false);
  const [showAdminPortal, setShowAdminPortal] = useState<boolean>(false);

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    setShowAdminPortal(true);
    refreshBackendData();
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('jkr_admin_token');
    localStorage.removeItem('jkr_admin_user');
    setIsAdminLoggedIn(false);
    setShowAdminPortal(false);
  };

  const handleDeleteComplaint = async (id: string) => {
    try {
      const res = await fetch(`/api/aduan/${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        await refreshBackendData();
      }
    } catch (err) {
      console.error('Failed to delete complaint:', err);
    }
  };

  // Fetch complaints and Cloudflare connection status from backend
  const refreshBackendData = async () => {
    try {
      const [cfRes, aduanRes] = await Promise.all([
        fetch('/api/cloudflare/status').then((r) => r.json()).catch(() => null),
        fetch('/api/aduan').then((r) => r.json()).catch(() => null)
      ]);

      if (cfRes) {
        setCloudflareInfo({
          connected: cfRes.connected,
          provider: cfRes.provider,
          storageType: cfRes.storageType,
          totalRecords: cfRes.totalRecords,
          instruction: cfRes.instruction
        });
      }

      if (aduanRes && aduanRes.success && Array.isArray(aduanRes.data)) {
        setSubmittedComplaints(aduanRes.data);
      }
    } catch (err) {
      console.warn('Backend connection fallback:', err);
    }
  };

  // Visitor counter state
  const [visitorCount, setVisitorCount] = useState<number>(1483129);

  // Current Date display
  const [currentDateStr, setCurrentDateStr] = useState('');

  // Initialize and load saved accessibility preferences
  useEffect(() => {
    const savedContrast = localStorage.getItem('jkr_ns_contrast') === 'true';
    if (savedContrast) setHighContrast(true);

    const savedFont = localStorage.getItem('jkr_ns_font_size') as 'small' | 'normal' | 'large' | null;
    if (savedFont && ['small', 'normal', 'large'].includes(savedFont)) {
      setFontSize(savedFont);
    }

    const savedVisits = parseInt(localStorage.getItem('jkr_ns_visits') || '1483128', 10) + 1;
    localStorage.setItem('jkr_ns_visits', savedVisits.toString());
    setVisitorCount(savedVisits);

    // Load complaints & Cloudflare status from Express backend
    refreshBackendData();
  }, []);

  // Update current date according to language
  useEffect(() => {
    const now = new Date();
    const formatted = now.toLocaleDateString(lang === 'BM' ? 'ms-MY' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    setCurrentDateStr(formatted);
  }, [lang]);

  // Sync high contrast and font size to document body
  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    localStorage.setItem('jkr_ns_contrast', highContrast ? 'true' : 'false');
  }, [highContrast]);

  useEffect(() => {
    document.body.classList.remove('font-size-small', 'font-size-normal', 'font-size-large');
    document.body.classList.add(`font-size-${fontSize}`);
    localStorage.setItem('jkr_ns_font_size', fontSize);
  }, [fontSize]);

  // Auto carousel slide effect
  useEffect(() => {
    if (slideTimerRef.current) clearInterval(slideTimerRef.current);
    slideTimerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideCount);
    }, 6000);

    return () => {
      if (slideTimerRef.current) clearInterval(slideTimerRef.current);
    };
  }, [slideCount]);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slideCount);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slideCount) % slideCount);
  };

  const openModal = (title: string, content: string) => {
    setModalState({ open: true, title, content });
  };

  const closeModal = () => {
    setModalState({ open: false, title: '', content: '' });
  };

  // Detect GPS location
  const detectUserLocation = () => {
    if (!navigator.geolocation) {
      setGpsStatus(
        lang === 'BM'
          ? 'Pelayar anda tidak menyokong fungsi pengesanan GPS.'
          : 'Your browser does not support geolocation.'
      );
      return;
    }

    setGpsStatus(
      lang === 'BM'
        ? 'Sedang mendapatkan koordinat lokasi GPS masa nyata...'
        : 'Detecting live GPS coordinates...'
    );

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(5);
        const lng = position.coords.longitude.toFixed(5);
        const coords = `${lat}° N, ${lng}° E`;
        setFormData((prev) => ({ ...prev, gps: coords }));
        setGpsStatus(
          lang === 'BM'
            ? `Lokasi dikesan: Lat ${lat}, Lng ${lng} (Akurasi: ±${Math.round(position.coords.accuracy)}m)`
            : `Location detected: Lat ${lat}, Lng ${lng} (Accuracy: ±${Math.round(position.coords.accuracy)}m)`
        );
      },
      (err) => {
        // Fallback Seremban coordinates
        const fallback = '2.69225° N, 101.90562° E';
        setFormData((prev) => ({ ...prev, gps: fallback }));
        setGpsStatus(
          lang === 'BM'
            ? 'Koordinat berhampiran Seremban 2 dimasukkan (Akses lokasi pelayar disekat).'
            : 'Coordinates for Seremban 2 inserted (Location access denied).'
        );
      },
      { timeout: 7000 }
    );
  };

  // Image Upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        setImagePreview(result);
        setFormData((prev) => ({ ...prev, gambar: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle complaint submission to backend (Cloudflare + local vault)
  const handleComplaintSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama.trim() || !formData.telefon.trim() || !formData.keterangan.trim()) {
      openModal(
        lang === 'BM' ? 'Borang Tidak Lengkap' : 'Incomplete Form',
        lang === 'BM' ? 'Sila lengkapkan semua maklumat mandatori bertanda (*).' : 'Please fill all mandatory fields (*).'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/aduan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.nama,
          phone: formData.telefon,
          district: formData.daerah,
          category: formData.kategori,
          gps: formData.gps || '2.6922° N, 101.9056° E',
          description: formData.keterangan,
          image: imagePreview || undefined
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        const ticketId = result.ticketId;
        const cfInfo = result.cloudflare;

        const cfStatusText = cfInfo?.synced
          ? `Disimpan secara selamat ke ${cfInfo.provider}.`
          : `Disimpan ke storan selamat pangkalan data JKR NS.`;

        const msg =
          lang === 'BM'
            ? `Terima kasih ${formData.nama}. Laporan bagi "${formData.kategori}" di daerah ${formData.daerah} telah berjaya direkodkan.\n\nNombor Rujukan Tiket: ${ticketId}\nStatus Storan: ${cfStatusText}\n\nJuruteknik JKR Daerah akan mengambil tindakan pembaikan dalam tempoh 24 jam.`
            : `Thank you ${formData.nama}. Your report for "${formData.kategori}" in ${formData.daerah} has been registered.\n\nTicket Reference: ${ticketId}\nStorage Status: ${cfStatusText}\n\nJKR district technicians will initiate maintenance response within 24 hours.`;

        openModal(lang === 'BM' ? 'Aduan Berjaya Didaftarkan' : 'Complaint Successfully Filed', msg);

        // Reset Form
        setFormData({
          nama: '',
          telefon: '',
          daerah: 'Seremban',
          kategori: 'Jalan Berlubang (Pothole) - Tindakan 24 Jam',
          gps: '',
          keterangan: '',
          gambar: ''
        });
        setImagePreview(null);
        setGpsStatus('Tekan butang untuk memasukkan lokasi telefon/komputer anda secara automatik.');

        // Refresh list and status from backend
        await refreshBackendData();
      } else {
        throw new Error(result.error || 'Gagal menyimpan aduan');
      }
    } catch (err: any) {
      console.error('Error submitting complaint:', err);
      openModal(
        lang === 'BM' ? 'Ralat Penghantaran' : 'Submission Error',
        lang === 'BM'
          ? `Tidak dapat menghantar aduan: ${err.message || 'Sila semak sambungan rangkaian anda.'}`
          : `Failed to submit complaint: ${err.message || 'Please check your connection.'}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter tenders based on filter and live search query
  const filteredTenders = TENDERS_DATA.filter((item) => {
    const matchesFilter = tenderFilter === 'semua' || item.status === tenderFilter;
    if (!matchesFilter) return false;
    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.titleEn.toLowerCase().includes(q) ||
      item.code.toLowerCase().includes(q) ||
      item.district.toLowerCase().includes(q) ||
      item.cidb.toLowerCase().includes(q)
    );
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      openModal(
        lang === 'BM' ? 'Carian Kosong' : 'Empty Search',
        lang === 'BM'
          ? 'Sila masukkan kata kunci seperti "Tender", "Rembau", "Pothole", atau "Jambatan".'
          : 'Please enter keywords such as "Tender", "Rembau", "Pothole", or "Bridge".'
      );
      return;
    }

    const matchedTenders = TENDERS_DATA.filter(
      (t) =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const matchDistrict = Object.entries(DISTRICTS_DATA).find(([key, d]) =>
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.engineer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    let summary = `Carian untuk "${searchQuery}": `;
    if (matchedTenders.length > 0) {
      summary += `${matchedTenders.length} tender/sebut harga dipadankan. `;
    }
    if (matchDistrict) {
      summary += `Padanan Pejabat Daerah: ${matchDistrict[1].title}. `;
    }
    if (matchedTenders.length === 0 && !matchDistrict) {
      summary += `Tiada rekod langsung ditemui, namun anda boleh menyemak direktori atau mengajukan aduan terus.`;
    }

    openModal(lang === 'BM' ? 'Keputusan Carian Pintar' : 'Smart Search Results', summary);
  };

  // Ticket status lookup via backend API
  const handleTicketLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = ticketSearchInput.trim().toUpperCase();
    if (!query) return;

    try {
      const res = await fetch(`/api/aduan/${encodeURIComponent(query)}`);
      const json = await res.json();
      if (res.ok && json.success && json.data) {
        setFoundTicket(json.data);
      } else {
        // Check in current state
        const local = submittedComplaints.find((c) => c.id.toUpperCase() === query);
        if (local) {
          setFoundTicket(local);
        } else {
          setFoundTicket(null);
          openModal(
            lang === 'BM' ? 'Tiket Tidak Ditemui' : 'Ticket Not Found',
            lang === 'BM'
              ? `Tiada rekod aduan ditemui bagi nombor rujukan "${query}". Sila pastikan format nombor rujukan seperti JKRNS-2026-XXXXXX.`
              : `No complaint found for reference "${query}". Please check reference code format (e.g. JKRNS-2026-XXXXXX).`
          );
        }
      }
    } catch (err) {
      const local = submittedComplaints.find((c) => c.id.toUpperCase() === query);
      if (local) {
        setFoundTicket(local);
      } else {
        openModal(
          lang === 'BM' ? 'Ralat Carian' : 'Search Error',
          lang === 'BM' ? 'Tidak dapat menyemak status tiket pada masa ini.' : 'Unable to query ticket at this time.'
        );
      }
    }
  };

  // Update complaint ticket status
  const handleUpdateTicketStatus = async (ticketId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/aduan/${encodeURIComponent(ticketId)}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        await refreshBackendData();
        if (foundTicket && foundTicket.id === ticketId) {
          setFoundTicket((prev) => (prev ? { ...prev, status: newStatus as any } : null));
        }
        openModal(
          'Status Dikemaskini',
          `Status tiket ${ticketId} telah berjaya dikemaskini kepada "${newStatus}".`
        );
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const currentDistrict = DISTRICTS_DATA[selectedDistrict] || DISTRICTS_DATA.seremban;

  // Render Admin Portal if activated by logged-in admin
  if (showAdminPortal && isAdminLoggedIn) {
    return (
      <AdminPortal
        complaints={submittedComplaints}
        cloudflareInfo={cloudflareInfo}
        onClose={() => setShowAdminPortal(false)}
        onLogout={handleAdminLogout}
        onUpdateStatus={handleUpdateTicketStatus}
        onDeleteComplaint={handleDeleteComplaint}
        onRefresh={refreshBackendData}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-800 transition-colors duration-200">
      {/* ==================== 1. HEADER & ACCESSIBILITY BAR ==================== */}
      <header className="w-full bg-white shadow-md sticky top-0 z-50">
        {/* Bar Aksesibiliti & Tarikh Terkini */}
        <div className="bg-[#0B0F19] text-slate-200 text-xs px-4 py-2 border-b border-[#FFD100]/40">
          <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-semibold text-slate-200">
                {lang === 'BM'
                  ? 'Portal Rasmi Kerajaan Negeri Sembilan'
                  : 'Official Portal of the Negeri Sembilan State Government'}
              </span>
              <span className="hidden sm:inline text-slate-600">|</span>
              <span className="hidden sm:inline text-slate-400 font-mono text-[11px]">
                {currentDateStr || 'Memuatkan tarikh...'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Saiz Fon */}
              <div className="flex items-center gap-1 bg-slate-800/90 px-2 py-0.5 rounded-lg border border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider mr-1">
                  {lang === 'BM' ? 'Teks:' : 'Text:'}
                </span>
                <button
                  type="button"
                  onClick={() => setFontSize('small')}
                  title="Saiz Kecil"
                  className={`px-1.5 py-0.5 rounded font-bold transition-colors ${
                    fontSize === 'small' ? 'text-[#FFD100] bg-slate-700' : 'hover:text-[#FFD100]'
                  }`}
                >
                  A-
                </button>
                <button
                  type="button"
                  onClick={() => setFontSize('normal')}
                  title="Saiz Asal"
                  className={`px-1.5 py-0.5 rounded font-bold transition-colors ${
                    fontSize === 'normal' ? 'text-[#FFD100] bg-slate-700' : 'hover:text-[#FFD100]'
                  }`}
                >
                  A
                </button>
                <button
                  type="button"
                  onClick={() => setFontSize('large')}
                  title="Saiz Besar"
                  className={`px-1.5 py-0.5 rounded font-bold transition-colors ${
                    fontSize === 'large' ? 'text-[#FFD100] bg-slate-700' : 'hover:text-[#FFD100]'
                  }`}
                >
                  A+
                </button>
              </div>

              {/* Mod Kontras Tinggi */}
              <button
                type="button"
                onClick={() => setHighContrast(!highContrast)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-colors ${
                  highContrast
                    ? 'bg-[#FFD100] text-black border-[#FFD100]'
                    : 'bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-[#FFD100] border-slate-700'
                }`}
                title="Togol Mod Kontras Tinggi"
              >
                <i className="fa-solid fa-circle-half-stroke text-xs"></i>
                <span>{lang === 'BM' ? 'Kontras' : 'Contrast'}</span>
              </button>

              {/* Dwi-Bahasa */}
              <button
                type="button"
                onClick={() => setLang(lang === 'BM' ? 'EN' : 'BM')}
                className="flex items-center gap-1.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-[#FFD100] px-2.5 py-1 rounded-lg border border-slate-700 transition-colors font-semibold text-xs"
                title="Tukar Bahasa"
              >
                <i className="fa-solid fa-globe text-xs text-[#DC2626]"></i>
                <span className="font-bold">{lang}</span>
              </button>

              {/* Butang Akses Pentadbir (Admin) */}
              {isAdminLoggedIn ? (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setShowAdminPortal(true)}
                    className="flex items-center gap-1.5 bg-[#FFD100] text-slate-900 px-2.5 py-1 rounded-lg font-bold text-xs hover:bg-yellow-400 transition-all shadow-xs cursor-pointer"
                    title="Buka Papan Pemuka Pentadbir"
                  >
                    <i className="fa-solid fa-shield-halved text-xs text-[#DC2626]"></i>
                    <span>Portal Admin</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleAdminLogout}
                    className="px-2 py-1 bg-red-900/50 hover:bg-red-700 text-red-200 rounded-lg text-xs transition-colors cursor-pointer"
                    title="Log Keluar Pentadbir"
                  >
                    <i className="fa-solid fa-power-off"></i>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowAdminLoginModal(true)}
                  className="flex items-center gap-1.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-[#FFD100] px-2.5 py-1 rounded-lg border border-slate-700 transition-colors font-semibold text-xs cursor-pointer"
                  title="Log Masuk Pentadbir JKR"
                >
                  <i className="fa-solid fa-lock text-xs text-[#FFD100]"></i>
                  <span>Log Masuk Admin</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Jalur Bendera Negeri Sembilan: Kuning (50%), Merah (25%), Hitam (25%) */}
        <div className="h-1.5 w-full flex">
          <div className="h-full w-1/2 bg-[#FFD100]"></div>
          <div className="h-full w-1/4 bg-[#DC2626]"></div>
          <div className="h-full w-1/4 bg-[#111827]"></div>
        </div>

        {/* Jenama & Logo Rasmi */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            {/* Logo Gabungan (Kiri: Jata NS, Kanan: JKR NS) */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2 p-1.5 bg-white rounded-xl border border-slate-200 shadow-sm">
                <JataNegeriSembilan className="h-11 sm:h-13 w-auto object-contain transition-transform hover:scale-105" />
                <div className="h-9 w-px bg-slate-200"></div>
                <JkrLogo className="h-11 sm:h-13 w-auto object-contain transition-transform hover:scale-105" />
              </div>
              <div>
                <span className="block text-[11px] sm:text-xs uppercase tracking-widest text-slate-500 font-bold">
                  {lang === 'BM' ? 'Portal Rasmi' : 'Official Portal'}
                </span>
                <h1 className="text-base sm:text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                  JABATAN KERJA RAYA
                </h1>
                <p className="text-xs sm:text-sm font-bold text-[#DC2626] tracking-wide flex items-center gap-1">
                  <span>NEGERI SEMBILAN DARUL KHUSUS</span>
                </p>
              </div>
            </div>

            {/* Menu Desktop */}
            <nav className="hidden lg:flex items-center gap-5 font-semibold text-xs sm:text-sm text-slate-700">
              <a href="#heroSlider" className="hover:text-[#DC2626] transition-colors py-1">
                {lang === 'BM' ? 'Utama' : 'Home'}
              </a>
              <a href="#aksesPantas" className="hover:text-[#DC2626] transition-colors py-1">
                {lang === 'BM' ? 'Akses Pantas' : 'Quick Access'}
              </a>
              <a href="#kategoriPengguna" className="hover:text-[#DC2626] transition-colors py-1">
                {lang === 'BM' ? 'Kategori' : 'Categories'}
              </a>
              <a href="#tenderSection" className="hover:text-[#DC2626] transition-colors py-1 flex items-center gap-1.5">
                <span>{lang === 'BM' ? 'Tender' : 'Tenders'}</span>
                <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-ping"></span>
              </a>
              <a href="#direktoriDaerahSection" className="hover:text-[#DC2626] transition-colors py-1">
                {lang === 'BM' ? '7 Pejabat Daerah' : '7 District Offices'}
              </a>
              <a
                href="#aduanSection"
                className="bg-[#DC2626] hover:bg-[#991B1B] text-white px-4 py-2 rounded-xl font-bold shadow-md shadow-red-600/20 transition-all flex items-center gap-2"
              >
                <i className="fa-solid fa-headset text-[#FFD100]"></i>
                <span>e-Aduan</span>
              </a>

              {/* Butang Terus Portal Pentadbir */}
              <button
                type="button"
                onClick={() => {
                  if (isAdminLoggedIn) {
                    setShowAdminPortal(true);
                  } else {
                    setShowAdminLoginModal(true);
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border border-slate-300 hover:border-slate-800 text-slate-800 hover:bg-slate-100 transition-all cursor-pointer"
                title="Pusat Kawalan Pentadbir"
              >
                <i className="fa-solid fa-user-shield text-[#DC2626]"></i>
                <span>{isAdminLoggedIn ? 'Modul Admin' : 'Log Masuk Admin'}</span>
              </button>
            </nav>

            {/* Butang Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none"
              aria-label="Togol Menu Navigasi"
            >
              <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>

          {/* Menu Dropdown Mobile */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-3 pt-3 border-t border-slate-200 space-y-2 text-sm font-semibold animate-fadeIn">
              <a
                href="#heroSlider"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-3 rounded-lg hover:bg-slate-100 text-slate-800"
              >
                {lang === 'BM' ? 'Utama' : 'Home'}
              </a>
              <a
                href="#aksesPantas"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-3 rounded-lg hover:bg-slate-100 text-slate-800"
              >
                {lang === 'BM' ? 'Akses Pantas' : 'Quick Access'}
              </a>
              <a
                href="#kategoriPengguna"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-3 rounded-lg hover:bg-slate-100 text-slate-800"
              >
                {lang === 'BM' ? 'Kategori Pengguna' : 'User Categories'}
              </a>
              <a
                href="#tenderSection"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-3 rounded-lg hover:bg-slate-100 text-slate-800"
              >
                {lang === 'BM' ? 'Tender & Sebut Harga' : 'Tenders & Quotations'}
              </a>
              <a
                href="#direktoriDaerahSection"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-3 rounded-lg hover:bg-slate-100 text-slate-800"
              >
                {lang === 'BM' ? '7 Pejabat Daerah' : '7 District Offices'}
              </a>
              <a
                href="#aduanSection"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-3 rounded-lg bg-[#DC2626] text-white font-bold"
              >
                {lang === 'BM' ? 'e-Aduan Kerosakan' : 'Damage e-Complaint'}
              </a>
            </div>
          )}
        </div>
      </header>

      {/* ==================== 2. HERO SLIDER BERGERAK (CAROUSEL) ==================== */}
      <section id="heroSlider" className="relative w-full h-[460px] md:h-[540px] overflow-hidden bg-[#0B0F19] text-white">
        <div className="relative w-full h-full">
          {/* Slide 1 */}
          <div
            className={`absolute inset-0 w-full h-full slide-fade flex items-center perpatih-pattern ${
              currentSlide === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F19] via-[#0B0F19]/85 to-transparent"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
              <div className="max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DC2626]/20 border border-[#DC2626]/50 text-red-300 text-xs font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-pulse"></span>
                  {lang === 'BM' ? 'Penyambung Warisan & Kejuruteraan' : 'Bridging Heritage & Engineering'}
                </div>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
                  {lang === 'BM' ? (
                    <>
                      Penaiktarafan Laluan Persekutuan &amp;{' '}
                      <span className="text-[#FFD100]">Jaringan Jalan Negeri</span>
                    </>
                  ) : (
                    <>
                      Upgrading Federal Routes &amp;{' '}
                      <span className="text-[#FFD100]">State Highway Networks</span>
                    </>
                  )}
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">
                  {lang === 'BM'
                    ? 'Memacu pembangunan jaringan infrastruktur berkualiti tinggi merentasi 7 daerah di Negeri Sembilan berpaksikan kemampanan teknologi dan kelancaran pergerakan rakyat.'
                    : 'Driving high-quality infrastructure development across 7 districts in Negeri Sembilan anchored on technology sustainability and seamless citizen mobility.'}
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <a
                    href="#tenderSection"
                    className="px-5 py-2.5 sm:py-3 bg-[#FFD100] text-[#111827] font-bold rounded-xl text-xs sm:text-sm hover:bg-yellow-400 transition-all flex items-center gap-2 shadow-lg shadow-yellow-500/20"
                  >
                    <i className="fa-solid fa-file-signature"></i>
                    <span>{lang === 'BM' ? 'Senarai Tender Terkini' : 'Latest Tenders'}</span>
                  </a>
                  <a
                    href="#aduanSection"
                    className="px-5 py-2.5 sm:py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl text-xs sm:text-sm transition-all flex items-center gap-2"
                  >
                    <i className="fa-solid fa-headset text-[#FFD100]"></i>
                    <span>{lang === 'BM' ? 'Salurkan Aduan' : 'Submit Complaint'}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Slide 2 */}
          <div
            className={`absolute inset-0 w-full h-full slide-fade flex items-center bg-slate-900 ${
              currentSlide === 1 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 75% 50%, rgba(220, 38, 38, 0.4) 0%, transparent 60%), linear-gradient(135deg, #0b0f19 0%, #1e293b 100%)'
              }}
            ></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
              <div className="max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD100]/20 border border-[#FFD100]/50 text-[#FFD100] text-xs font-bold uppercase tracking-wider">
                  <i className="fa-solid fa-bolt"></i>
                  {lang === 'BM' ? 'Tindakan Pantas MyJalan' : 'MyJalan Fast Action'}
                </div>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
                  {lang === 'BM' ? (
                    <>
                      Inisiatif Sifar Pothole &amp;{' '}
                      <span className="text-[#FFD100]">Pembaikan Lubang 24 Jam</span>
                    </>
                  ) : (
                    <>
                      Zero Pothole Initiative &amp;{' '}
                      <span className="text-[#FFD100]">24-Hour Road Repair</span>
                    </>
                  )}
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">
                  {lang === 'BM'
                    ? 'Tindakan tampalan segera bagi keselamatan pengguna jalan raya di Seremban, Port Dickson, Jempol, Jelebu, Kuala Pilah, Rembau, dan Tampin dengan integrasi koordinat GPS masa nyata.'
                    : 'Swift patching operations ensuring motorist safety across Seremban, Port Dickson, Jempol, Jelebu, Kuala Pilah, Rembau, and Tampin integrated with real-time GPS coordinates.'}
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <a
                    href="#aduanSection"
                    className="px-5 py-2.5 sm:py-3 bg-[#DC2626] hover:bg-[#991B1B] text-white font-bold rounded-xl text-xs sm:text-sm transition-all flex items-center gap-2 shadow-lg shadow-red-600/25"
                  >
                    <i className="fa-solid fa-triangle-exclamation text-[#FFD100]"></i>
                    <span>{lang === 'BM' ? 'Lapor Lubang Jalan' : 'Report Pothole'}</span>
                  </a>
                  <a
                    href="#direktoriDaerahSection"
                    className="px-5 py-2.5 sm:py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl text-xs sm:text-sm transition-all flex items-center gap-2"
                  >
                    <i className="fa-solid fa-map-location-dot text-[#FFD100]"></i>
                    <span>{lang === 'BM' ? 'Direktori Jurutera Daerah' : 'District Engineers'}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Slide 3 */}
          <div
            className={`absolute inset-0 w-full h-full slide-fade flex items-center bg-slate-950 ${
              currentSlide === 2 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F19] via-slate-900 to-amber-950/60"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
              <div className="max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                  <i className="fa-solid fa-building-columns"></i>
                  {lang === 'BM' ? 'Warisan & Fasiliti Awam' : 'Heritage & Public Facilities'}
                </div>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
                  {lang === 'BM' ? (
                    <>
                      Penyelenggaraan Jambatan &amp;{' '}
                      <span className="text-[#FFD100]">Seni Bina Minangkabau</span>
                    </>
                  ) : (
                    <>
                      Bridge Maintenance &amp;{' '}
                      <span className="text-[#FFD100]">Minangkabau Architecture</span>
                    </>
                  )}
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">
                  {lang === 'BM'
                    ? 'Memelihara kedaulatan estetika Adat Perpatih dalam reka bentuk kejuruteraan struktur bangunan awam dan infrastruktur jambatan Negeri Sembilan.'
                    : 'Preserving the heritage aesthetic of Adat Perpatih within public building structural engineering and bridge infrastructure across Negeri Sembilan.'}
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <a
                    href="#aksesPantas"
                    className="px-5 py-2.5 sm:py-3 bg-[#FFD100] text-[#111827] font-bold rounded-xl text-xs sm:text-sm hover:bg-yellow-400 transition-all flex items-center gap-2 shadow-lg shadow-yellow-500/20"
                  >
                    <i className="fa-solid fa-layer-group"></i>
                    <span>{lang === 'BM' ? 'Akses Perkhidmatan' : 'Explore Services'}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Butang Kawalan Slider (Kiri/Kanan) */}
        <button
          type="button"
          onClick={handlePrevSlide}
          aria-label="Slaid Sebelum"
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-[#DC2626] text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all cursor-pointer"
        >
          <i className="fa-solid fa-chevron-left text-sm sm:text-base"></i>
        </button>
        <button
          type="button"
          onClick={handleNextSlide}
          aria-label="Slaid Seterusnya"
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-[#DC2626] text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all cursor-pointer"
        >
          <i className="fa-solid fa-chevron-right text-sm sm:text-base"></i>
        </button>

        {/* Titik Indikator Slider */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
          {[0, 1, 2].map((idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              className={`rounded-full transition-all cursor-pointer ${
                currentSlide === idx ? 'w-8 h-2 bg-[#FFD100]' : 'w-3 h-2 bg-white/40 hover:bg-white'
              }`}
              aria-label={`Ke Slaid ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ==================== 3. BAR CARIAN PINTAR ==================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-40 w-full">
        <form
          onSubmit={handleSearchSubmit}
          className="bg-white rounded-2xl shadow-xl p-4 sm:p-5 border border-slate-200"
        >
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="w-full md:w-auto flex items-center gap-2 text-slate-800 font-bold text-sm whitespace-nowrap">
              <div className="w-8 h-8 rounded-lg bg-[#DC2626] text-white flex items-center justify-center shadow-sm">
                <i className="fa-solid fa-magnifying-glass"></i>
              </div>
              <span>{lang === 'BM' ? 'Carian Pintar JKR:' : 'Smart JKR Search:'}</span>
            </div>
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  lang === 'BM'
                    ? 'Cari tender, nama jurutera daerah, jalan ditutup, atau nombor laluan...'
                    : 'Search tenders, district engineers, road closures, or route numbers...'
                }
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD100] focus:border-transparent transition-all"
              />
              <i className="fa-solid fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              )}
            </div>
            <button
              type="submit"
              className="w-full md:w-auto px-6 py-2.5 bg-[#111827] hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{lang === 'BM' ? 'Cari' : 'Search'}</span>
              <i className="fa-solid fa-arrow-right text-[#FFD100] text-xs"></i>
            </button>
          </div>
        </form>
      </section>

      {/* ==================== 4. AKSES PANTAS (QUICK SERVICES) ==================== */}
      <section id="aksesPantas" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8 w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {lang === 'BM' ? 'Perkhidmatan & Akses Pantas' : 'Services & Quick Access'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              {lang === 'BM'
                ? 'Pautan segera ke modul teknikal dan aplikasi rasmi kerajaan.'
                : 'Direct links to official technical modules and government portals.'}
            </p>
          </div>
          <div className="h-1 flex-1 mx-6 bg-slate-200 hidden md:block rounded"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Card 1 */}
          <a
            href="#tenderSection"
            className="group bg-white p-5 rounded-2xl border-t-4 border-[#FFD100] shadow-sm hover:shadow-xl transition-all duration-300 border-x border-b border-slate-200"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-50 group-hover:bg-[#FFD100] text-amber-600 group-hover:text-black flex items-center justify-center text-xl mb-3 transition-colors">
              <i className="fa-solid fa-file-contract"></i>
            </div>
            <h4 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-[#DC2626] transition-colors">
              {lang === 'BM' ? 'e-Tender & Sebut Harga' : 'e-Tenders & Quotations'}
            </h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {lang === 'BM'
                ? 'Iklan tawaran kerja pembinaan, mekanikal & elektrikal semasa.'
                : 'Current civil, mechanical & electrical engineering procurement notices.'}
            </p>
          </a>

          {/* Card 2 */}
          <a
            href="#aduanSection"
            className="group bg-white p-5 rounded-2xl border-t-4 border-[#DC2626] shadow-sm hover:shadow-xl transition-all duration-300 border-x border-b border-slate-200"
          >
            <div className="w-12 h-12 rounded-xl bg-red-50 group-hover:bg-[#DC2626] text-[#DC2626] group-hover:text-white flex items-center justify-center text-xl mb-3 transition-colors">
              <i className="fa-solid fa-road-circle-exclamation"></i>
            </div>
            <h4 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-[#DC2626] transition-colors">
              {lang === 'BM' ? 'e-Aduan Jalan & Pothole' : 'e-Complaint & Potholes'}
            </h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {lang === 'BM'
                ? 'Sistem laporan kerosakan jalan awam dengan GPS masa nyata.'
                : 'Public road damage reporting platform integrated with live GPS coordinates.'}
            </p>
          </a>

          {/* Card 3 */}
          <a
            href="#direktoriDaerahSection"
            className="group bg-white p-5 rounded-2xl border-t-4 border-[#111827] shadow-sm hover:shadow-xl transition-all duration-300 border-x border-b border-slate-200"
          >
            <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-[#111827] text-slate-800 group-hover:text-[#FFD100] flex items-center justify-center text-xl mb-3 transition-colors">
              <i className="fa-solid fa-map-location-dot"></i>
            </div>
            <h4 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-[#DC2626] transition-colors">
              {lang === 'BM' ? 'Direktori 7 Daerah' : '7 District Directory'}
            </h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {lang === 'BM'
                ? 'Maklumat pejabat, talian am dan panduan arah Waze / Google Maps.'
                : 'Office contacts, general lines, and direct Waze / Google Maps navigation.'}
            </p>
          </a>

          {/* Card 4 */}
          <div
            onClick={() =>
              openModal(
                lang === 'BM' ? 'Piagam Pelanggan JKR Negeri Sembilan' : 'JKR Negeri Sembilan Citizen Charter',
                lang === 'BM'
                  ? 'Komitmen Piagam Pelanggan JKR NS:\n1. Membaiki pothole (jalan berlubang) dalam tempoh 24 jam selepas aduan sahih diterima.\n2. Meluluskan permohonan pelan laluan utiliti dalam tempoh 14 hari bekerja.\n3. Memperaku perakuan bayaran kemajuan kerja kontraktor dalam tempoh 14 hari selepas tuntutan lengkap diterima.\n4. Memastikan lampu isyarat yang dilaporkan rosak diambil tindakan interim dalam tempoh 6 jam.'
                  : 'Customer Charter Commitments:\n1. Repair confirmed potholes within 24 hours of report receipt.\n2. Process utility right-of-way submissions within 14 working days.\n3. Issue interim payment certificates to contractors within 14 days of complete claims.\n4. Mobilize traffic light repair teams within 6 hours of reported fault.'
              )
            }
            className="cursor-pointer group bg-white p-5 rounded-2xl border-t-4 border-emerald-500 shadow-sm hover:shadow-xl transition-all duration-300 border-x border-b border-slate-200"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 group-hover:bg-emerald-600 text-emerald-600 group-hover:text-white flex items-center justify-center text-xl mb-3 transition-colors">
              <i className="fa-solid fa-clock-rotate-left"></i>
            </div>
            <h4 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-[#DC2626] transition-colors">
              {lang === 'BM' ? 'Piagam Pelanggan' : 'Customer Charter'}
            </h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {lang === 'BM'
                ? 'Standard ketelusan perkhidmatan dan tempoh masa tindak balas rasmi.'
                : 'Official performance benchmarks and guaranteed response turnarounds.'}
            </p>
          </div>
        </div>
      </section>

      {/* ==================== 5. NOTIS & AMARAN LALUAN ==================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">
        <div className="bg-gradient-to-r from-red-50 to-amber-50 border-l-4 border-[#DC2626] p-4 rounded-xl shadow-sm flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-[#DC2626] text-white flex-shrink-0">
            <i className="fa-solid fa-triangle-exclamation animate-bounce"></i>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase text-[#DC2626] bg-red-100 px-2 py-0.5 rounded">
                {lang === 'BM' ? 'Notis Laluan Semasa' : 'Active Road Advisory'}
              </span>
              <span className="text-xs text-slate-500">02 November 2026</span>
            </div>
            <h4 className="font-bold text-slate-900 text-sm mt-1">
              {lang === 'BM'
                ? 'Penutupan Sementara Laluan FT086 (Jalan Jelebu - Pantai KM 14-16)'
                : 'Temporary Closure on Route FT086 (Jelebu - Pantai KM 14-16)'}
            </h4>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
              {lang === 'BM'
                ? 'Kerja penstabilan cerun dan mitigasi runtuhan tanah sedang aktif dijalankan. Pengguna disarankan menggunakan laluan alternatif melalui Bukit Tangga atau sambungan Lebuhraya Kajang-Seremban (LEKAS).'
                : 'Slope stabilization and landslide mitigation works are actively underway. Motorists are advised to utilize alternative detours via Bukit Tangga or the LEKAS Highway.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              openModal(
                lang === 'BM' ? 'Pelan Lencongan Laluan FT086' : 'Detour Plan Route FT086',
                lang === 'BM'
                  ? 'Jadual Kerja Penstabilan Cerun:\nTarikh Mula: 1 November 2026\nTarikh Jangka Siap: 15 November 2026\nLaluan Alternatif 1: N30 Jalan Bukit Tangga\nLaluan Alternatif 2: E21 Lebuhraya LEKAS susur keluar Mantin.'
                  : 'Slope Stabilization Schedule:\nStart Date: 1 Nov 2026\nEstimated Completion: 15 Nov 2026\nAlternative 1: N30 Jalan Bukit Tangga\nAlternative 2: E21 LEKAS Highway exit Mantin.'
              )
            }
            className="hidden sm:flex text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 px-3 py-1.5 rounded-lg items-center gap-1.5 transition-colors self-center whitespace-nowrap cursor-pointer"
          >
            <i className="fa-solid fa-map-signs text-amber-600"></i>
            <span>{lang === 'BM' ? 'Lihat Lencongan' : 'View Detour'}</span>
          </button>
        </div>
      </section>

      {/* ==================== 6. KATEGORI PENGGUNA (TABS INTERAKTIF) ==================== */}
      <section id="kategoriPengguna" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            {lang === 'BM' ? 'Kategori Pengguna' : 'User Categories'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {lang === 'BM'
              ? 'Pilih profil peranan anda untuk panduan dan capaian yang disesuaikan.'
              : 'Select your role profile for tailored services and technical procedures.'}
          </p>

          {/* Tab Buttons */}
          <div className="inline-flex p-1 bg-slate-200/80 rounded-xl mt-4 max-w-full overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveCategoryTab('awam')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeCategoryTab === 'awam'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang === 'BM' ? 'Orang Awam' : 'Public Citizens'}
            </button>
            <button
              type="button"
              onClick={() => setActiveCategoryTab('kontraktor')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeCategoryTab === 'kontraktor'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang === 'BM' ? 'Kontraktor & Perunding' : 'Contractors & Consultants'}
            </button>
            <button
              type="button"
              onClick={() => setActiveCategoryTab('agensi')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeCategoryTab === 'agensi'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang === 'BM' ? 'Agensi Kerajaan' : 'Government Agencies'}
            </button>
          </div>
        </div>

        {/* Tab Content: Awam */}
        {activeCategoryTab === 'awam' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-lg bg-red-100 text-[#DC2626] flex items-center justify-center font-bold">
                  <i className="fa-solid fa-bullhorn"></i>
                </div>
                <h4 className="font-bold text-slate-900 text-base">
                  {lang === 'BM' ? 'Saluran Aduan Rasmi' : 'Official Complaint Channels'}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {lang === 'BM'
                    ? 'Gunakan borang e-Aduan digital untuk melaporkan jalan rosak, lampu isyarat padam, atau penghadang jalan yang rosak secara terus ke JKR daerah.'
                    : 'Report potholes, damaged traffic signals, or fallen guardrails directly to the responsible district office with photo and GPS.'}
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <i className="fa-solid fa-map-marked-alt"></i>
                </div>
                <h4 className="font-bold text-slate-900 text-base">
                  {lang === 'BM' ? 'Semakan Status Jalan Raya' : 'Road Status Advisories'}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {lang === 'BM'
                    ? 'Ketahui laluan terputus atau kerja pembaikan cerun berjadual sebelum memulakan perjalanan merentasi daerah di Negeri Sembilan.'
                    : 'Check road closures, scheduled slope works, or bridge maintenance before embarking across the 7 districts.'}
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <i className="fa-solid fa-shield-halved"></i>
                </div>
                <h4 className="font-bold text-slate-900 text-base">
                  {lang === 'BM' ? 'Keselamatan Trafik Zon Kerja' : 'Work Zone Traffic Safety'}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {lang === 'BM'
                    ? 'Patuhi papan tanda amaran dan had laju di zon projek naik taraf bagi mengelakkan kemalangan tidak diingini.'
                    : 'Observe temporary safety signs, speed restrictions, and flagmen instructions at construction project zones.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Kontraktor */}
        {activeCategoryTab === 'kontraktor' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-lg bg-yellow-100 text-amber-800 flex items-center justify-center font-bold">
                  <i className="fa-solid fa-gavel"></i>
                </div>
                <h4 className="font-bold text-slate-900 text-base">
                  {lang === 'BM' ? 'Pusat Tender Terbuka' : 'Open Tender Portal'}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {lang === 'BM'
                    ? 'Muat turun kenyataan tender, jadual sebut harga, dan syarat kelayakan pendaftaran CIDB / PKK bagi kerja pembinaan awam.'
                    : 'Download tender notices, price schedules, and CIDB / PKK qualification criteria for civil and infrastructure works.'}
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <i className="fa-solid fa-receipt"></i>
                </div>
                <h4 className="font-bold text-slate-900 text-base">
                  {lang === 'BM' ? 'Tuntutan Bayaran Interim' : 'Interim Payment Certification'}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {lang === 'BM'
                    ? 'JKR NS mematuhi piagam penyelesaian sijil bayaran kemajuan kerja kontraktor dalam tempoh 14 hari selepas permohonan lengkap.'
                    : 'JKR NS adheres to prompt processing of contractor interim work valuation certificates within 14 calendar days.'}
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                  <i className="fa-solid fa-scale-balanced"></i>
                </div>
                <h4 className="font-bold text-slate-900 text-base">
                  {lang === 'BM' ? 'Polisi Anti-Rasuah (ABMS)' : 'Anti-Bribery Policy (ABMS)'}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {lang === 'BM'
                    ? 'Semua urusan perolehan tertakluk kepada Sistem Pengurusan Anti-Rasuah ISO 37001 bagi menjamin integriti saksama.'
                    : 'All procurement proceedings are strictly governed under ISO 37001 Anti-Bribery Management System for zero tolerance integrity.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Agensi */}
        {activeCategoryTab === 'agensi' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
                  <i className="fa-solid fa-compass-drafting"></i>
                </div>
                <h4 className="font-bold text-slate-900 text-base">
                  {lang === 'BM' ? 'Perundingan Kejuruteraan' : 'Engineering Advisory'}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {lang === 'BM'
                    ? 'Khidmat nasihat teknikal reka bentuk jalan, struktur bangunan awam, dan penyelenggaraan aset premis kerajaan negeri.'
                    : 'Professional technical guidance on highway alignment, public structural design, and state asset facility engineering.'}
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold">
                  <i className="fa-solid fa-helmet-safety"></i>
                </div>
                <h4 className="font-bold text-slate-900 text-base">
                  {lang === 'BM' ? 'Kelulusan Permit Korekan Jalan' : 'Utility Trenching Permits'}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {lang === 'BM'
                    ? 'Permohonan laluan utiliti (air, elektrik, gentian optik) perlu melalui semakan teknikal JKR Daerah sebelum kerja bermula.'
                    : 'Utility alignment permissions (water, power, fiber optics) undergo mandatory JKR district technical appraisal prior to commencement.'}
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
                  <i className="fa-solid fa-diagram-project"></i>
                </div>
                <h4 className="font-bold text-slate-900 text-base">
                  {lang === 'BM' ? 'Pemantauan Projek Negeri' : 'State Project Monitoring'}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {lang === 'BM'
                    ? 'Penyelarasan laporan kemajuan fizikal bersama Unit Perancang Ekonomi Negeri (UPEN) Negeri Sembilan.'
                    : 'Harmonized physical milestone reporting with the Negeri Sembilan State Economic Planning Unit (UPEN).'}
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ==================== 7. MODUL TENDER & SEBUT HARGA BERPENAPIS ==================== */}
      <section id="tenderSection" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#DC2626] uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-ping"></span>
              {lang === 'BM' ? 'Perolehan & Kontrak' : 'Procurement & Contracts'}
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {lang === 'BM' ? 'Kenyataan Tender & Sebut Harga Semasa' : 'Current Tenders & Quotations'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              {lang === 'BM'
                ? 'Semakan hebahan rasmi kerja pembinaan dan perbekalan JKR Negeri Sembilan.'
                : 'Official announcements for civil engineering, electrical, and maintenance contracts.'}
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2 text-xs font-bold">
            <button
              type="button"
              onClick={() => setTenderFilter('semua')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                tenderFilter === 'semua'
                  ? 'bg-[#111827] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {lang === 'BM' ? 'Semua (4)' : 'All (4)'}
            </button>
            <button
              type="button"
              onClick={() => setTenderFilter('buka')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                tenderFilter === 'buka'
                  ? 'bg-[#111827] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {lang === 'BM' ? 'Dibuka (2)' : 'Open (2)'}
            </button>
            <button
              type="button"
              onClick={() => setTenderFilter('tutup')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                tenderFilter === 'tutup'
                  ? 'bg-[#111827] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {lang === 'BM' ? 'Tutup (1)' : 'Closed (1)'}
            </button>
            <button
              type="button"
              onClick={() => setTenderFilter('keputusan')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                tenderFilter === 'keputusan'
                  ? 'bg-[#111827] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {lang === 'BM' ? 'Keputusan (1)' : 'Awarded (1)'}
            </button>
          </div>
        </div>

        {/* Senarai Tender */}
        <div className="space-y-3">
          {filteredTenders.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500">
              <i className="fa-solid fa-box-open text-3xl mb-2 text-slate-400"></i>
              <p className="text-sm font-semibold">
                {lang === 'BM' ? 'Tiada tender ditemui bagi kriteria ini.' : 'No tenders match the specified filter.'}
              </p>
            </div>
          ) : (
            filteredTenders.map((item) => (
              <div
                key={item.id}
                className={`bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#FFD100] transition-all ${
                  item.status === 'tutup' ? 'opacity-80' : ''
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        item.status === 'buka'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'tutup'
                          ? 'bg-slate-200 text-slate-700'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {lang === 'BM' ? item.statusLabelMs : item.statusLabelEn}
                    </span>
                    <span className="text-xs font-mono text-slate-500">{item.code}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                    {lang === 'BM' ? item.title : item.titleEn}
                  </h4>
                  <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span className="flex items-center gap-1">
                      <i className="fa-solid fa-location-dot text-[#DC2626]"></i>
                      <span>Daerah {item.district}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <i className="fa-solid fa-calendar text-slate-400"></i>
                      <span>
                        {item.status === 'keputusan'
                          ? 'Selesai Dianugerahkan'
                          : `Tutup: ${item.closingDate}`}
                      </span>
                    </span>
                    <span className="flex items-center gap-1">
                      <i className="fa-solid fa-certificate text-amber-500"></i>
                      <span>{item.cidb}</span>
                    </span>
                    {item.winner && (
                      <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                        <i className="fa-solid fa-trophy text-[#FFD100]"></i>
                        <span>Pemenang: {item.winner}</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex-shrink-0">
                  {item.status === 'buka' && (
                    <button
                      type="button"
                      onClick={() =>
                        openModal(
                          `Dokumen Tender: ${item.code}`,
                          `Kenyataan tender "${item.title}" boleh diperoleh melalui portal e-Perolehan Kerajaan Negeri Sembilan. Pastikan sijil CIDB dan PKK anda sah semasa pembelian dokumen tender.`
                        )
                      }
                      className="w-full md:w-auto px-4 py-2 bg-slate-100 hover:bg-[#FFD100] hover:text-black text-slate-800 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <i className="fa-solid fa-download"></i>
                      <span>{lang === 'BM' ? 'Muat Turun Kenyataan' : 'Download Notice'}</span>
                    </button>
                  )}
                  {item.status === 'tutup' && (
                    <span className="text-xs font-semibold text-slate-400 italic block py-2 text-center md:text-right">
                      {lang === 'BM' ? 'Peringkat Penilaian Teknikal' : 'Technical Evaluation Stage'}
                    </span>
                  )}
                  {item.status === 'keputusan' && (
                    <button
                      type="button"
                      onClick={() =>
                        openModal(
                          `Keputusan Rasmi: ${item.code}`,
                          `Tawaran bagi projek "${item.title}" telah disahkan dianugerahkan kepada ${item.winner} setelah memenuhi kriteria penilaian kewangan dan spesifikasi kejuruteraan elektrikal JKR.`
                        )
                      }
                      className="w-full md:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <i className="fa-solid fa-circle-info text-blue-600"></i>
                      <span>{lang === 'BM' ? 'Lihat Keputusan' : 'View Award'}</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ==================== 8. DIREKTORI 7 PEJABAT DAERAH JKR NS ==================== */}
      <section id="direktoriDaerahSection" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-6">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            {lang === 'BM'
              ? 'Direktori 7 Pejabat Daerah JKR Negeri Sembilan'
              : 'Directory of 7 JKR Negeri Sembilan District Offices'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600">
            {lang === 'BM'
              ? 'Pilih daerah untuk melihat maklumat Jurutera Daerah (JDR), talian kecemasan, dan panduan arah pantas.'
              : 'Select a district to view District Engineer (JDR) details, phone numbers, and direct GPS navigation.'}
          </p>
        </div>

        {/* Pilihan Butang 7 Daerah */}
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.keys(DISTRICTS_DATA).map((key) => {
            const isSelected = selectedDistrict === key;
            const districtDisplayName =
              key === 'pd'
                ? 'Port Dickson'
                : key === 'kualapilah'
                ? 'Kuala Pilah'
                : key.charAt(0).toUpperCase() + key.slice(1);

            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedDistrict(key)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#111827] text-white shadow-md'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {districtDisplayName}
              </button>
            );
          })}
        </div>

        {/* Kad Maklumat Daerah Dipilih */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD100]/20 text-amber-900 text-xs font-bold">
                <i className="fa-solid fa-building-user"></i>
                <span>{currentDistrict.tag}</span>
              </div>
              <h4 className="text-xl sm:text-2xl font-black text-slate-900">{currentDistrict.title}</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{currentDistrict.address}</p>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="text-xs text-slate-800 flex items-center gap-2">
                  <span className="font-bold text-slate-500">
                    {lang === 'BM' ? 'Jurutera Daerah (JDR):' : 'District Engineer:'}
                  </span>
                  <span className="font-semibold text-slate-900">{currentDistrict.engineer}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700 font-medium">
                  <a
                    href={`tel:${currentDistrict.phone}`}
                    className="flex items-center gap-2 hover:text-[#DC2626] transition-colors"
                  >
                    <i className="fa-solid fa-phone text-[#DC2626]"></i>
                    <span>{currentDistrict.phone}</span>
                  </a>
                  <div className="flex items-center gap-2 text-slate-500">
                    <i className="fa-solid fa-fax text-slate-400"></i>
                    <span>{currentDistrict.fax}</span>
                  </div>
                  <a
                    href={`mailto:${currentDistrict.email}`}
                    className="flex items-center gap-2 hover:text-[#DC2626] transition-colors"
                  >
                    <i className="fa-solid fa-envelope text-[#DC2626]"></i>
                    <span>{currentDistrict.email}</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="md:col-span-4 flex flex-col gap-2.5">
              <a
                href={currentDistrict.maps}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 bg-[#111827] hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <i className="fa-solid fa-map-location text-[#FFD100]"></i>
                <span>{lang === 'BM' ? 'Buka Google Maps' : 'Open in Google Maps'}</span>
              </a>
              <a
                href={currentDistrict.waze}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <i className="fa-brands fa-waze text-white text-base"></i>
                <span>{lang === 'BM' ? 'Panduan Arah Waze' : 'Navigate with Waze'}</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    daerah:
                      selectedDistrict === 'pd'
                        ? 'Port Dickson'
                        : selectedDistrict === 'kualapilah'
                        ? 'Kuala Pilah'
                        : selectedDistrict.charAt(0).toUpperCase() + selectedDistrict.slice(1)
                  }));
                  const aduanEl = document.getElementById('aduanSection');
                  if (aduanEl) aduanEl.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <i className="fa-solid fa-bullhorn text-[#DC2626]"></i>
                <span>{lang === 'BM' ? 'Salur Aduan ke Daerah Ini' : 'Report Issue to this District'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 9. E-ADUAN PINTAR (BACKEND CLOUDFLARE + SIMULASI TIKET) ==================== */}
      <section id="aduanSection" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          {/* Header Banner */}
          <div className="p-6 sm:p-10 bg-gradient-to-r from-[#0B0F19] via-slate-900 to-slate-800 text-white">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DC2626]/30 border border-[#DC2626]/50 text-[#FFD100] text-xs font-bold uppercase tracking-wider">
                <i className="fa-solid fa-location-crosshairs"></i>
                {lang === 'BM' ? 'Sistem Pengurusan Aduan Awam JKR' : 'JKR Public Road Complaints Management'}
              </div>

              {/* Status Cloudflare Badge */}
              <div
                onClick={() =>
                  openModal(
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
                className="cursor-pointer inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/90 hover:bg-slate-700 border border-slate-600 text-xs text-slate-200 transition-colors shadow-sm"
                title="Klik untuk melihat perincian sambungan Cloudflare"
              >
                <i className="fa-solid fa-cloud text-sky-400"></i>
                <span className="font-semibold">
                  {cloudflareInfo.connected ? 'Cloudflare: Aktif' : 'Storan: Cloudflare Ready'}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <i className="fa-solid fa-circle-info text-[10px] text-slate-400"></i>
              </div>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black">
              {lang === 'BM'
                ? 'Salurkan Aduan Jalan Raya & Infrastruktur'
                : 'Submit Road & Infrastructure Maintenance Complaint'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
              {lang === 'BM'
                ? 'Tindakan pantas 24 jam untuk kes potholes jalan persekutuan dan negeri. Data aduan disimpan secara selamat ke pangkalan data awan Cloudflare dan diagihkan segera kepada jurutera daerah.'
                : 'Fast 24-hour turnaround for potholes on state and federal routes. Complaint data is securely persisted to Cloudflare storage and immediately dispatched to district engineers.'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleComplaintSubmit} className="p-6 sm:p-10 space-y-6">
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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Jenis Kerosakan */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {lang === 'BM' ? 'Kategori Masalah / Kerosakan *' : 'Problem Category *'}
                </label>
                <select
                  value={formData.kategori}
                  onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
                >
                  <option value="Jalan Berlubang (Pothole) - Tindakan 24 Jam">
                    {lang === 'BM'
                      ? 'Jalan Berlubang (Pothole) - Tindakan 24 Jam'
                      : 'Pothole - 24hr Fast Action'}
                  </option>
                  <option value="Lampu Isyarat Rosak / Padam">
                    {lang === 'BM' ? 'Lampu Isyarat Rosak / Padam' : 'Traffic Light Fault / Outage'}
                  </option>
                  <option value="Runtuhan Cerun / Tebing">
                    {lang === 'BM' ? 'Runtuhan Cerun / Tebing Jalan' : 'Slope Collapse / Landslide'}
                  </option>
                  <option value="Papan Tanda Tumbang / Halangan">
                    {lang === 'BM' ? 'Papan Tanda Tumbang / Halangan Laluan' : 'Fallen Sign / Obstruction'}
                  </option>
                  <option value="Lain-lain Kerosakan">
                    {lang === 'BM' ? 'Lain-lain Kerosakan Struktur' : 'Other Structural Damage'}
                  </option>
                </select>
              </div>

              {/* Butang Pengesanan GPS */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {lang === 'BM' ? 'Koordinat Lokasi GPS (Pilihan Pintar)' : 'GPS Coordinates (Smart Option)'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.gps}
                    onChange={(e) => setFormData({ ...formData, gps: e.target.value })}
                    placeholder="Contoh: 2.6922° N, 101.9056° E"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
                  />
                  <button
                    type="button"
                    onClick={detectUserLocation}
                    className="px-4 py-2.5 bg-[#FFD100] text-black hover:bg-yellow-400 font-bold rounded-xl text-xs flex items-center gap-1.5 whitespace-nowrap shadow-sm cursor-pointer"
                  >
                    <i className="fa-solid fa-location-arrow"></i>
                    <span className="hidden sm:inline">
                      {lang === 'BM' ? 'Kesan GPS' : 'Auto GPS'}
                    </span>
                  </button>
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">{gpsStatus}</span>
              </div>
            </div>

            {/* Butiran Lokasi */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {lang === 'BM'
                  ? 'Keterangan Lokasi & Butiran Masalah *'
                  : 'Location Description & Issue Details *'}
              </label>
              <textarea
                rows={3}
                required
                value={formData.keterangan}
                onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                placeholder={
                  lang === 'BM'
                    ? "Contoh: Jalan berlubang berhampiran simpang keluar Hospital Tuanku Ja'afar menghala ke Senawang..."
                    : 'e.g. Severe pothole near the Senawang junction on the left lane...'
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
              ></textarea>
            </div>

            {/* Muat Naik Gambar */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {lang === 'BM' ? 'Lampiran Gambar Bukti Kerosakan' : 'Upload Evidence Photo'}
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-800 hover:file:bg-slate-200 cursor-pointer"
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

          {/* Notis Kawalan Akses & Privasi Data e-Aduan (Hanya Boleh Dilihat Oleh Admin) */}
          <div className="border-t border-slate-200 bg-slate-50/90 p-6 sm:p-10">
            <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-[#FFD100] flex items-center justify-center text-xl flex-shrink-0 shadow-md">
                  <i className="fa-solid fa-user-shield"></i>
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-black text-slate-900 text-sm sm:text-base">
                      Kawalan Akses &amp; Perlindungan Privasi e-Aduan
                    </h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      Akses Terhad (Admin Sahaja)
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Demi memelihara kerahsiaan dan perlindungan data peribadi pengadu selaras dengan Akta Perlindungan Data Peribadi 2010 (Akta 709), <strong>antaramuka senarai aduan yang didaftarkan dan modul semakan status penuh hanya boleh diakses oleh Pegawai Pentadbir JKR yang disahkan</strong>.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="text-xs text-slate-600 space-y-0.5">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <i className="fa-solid fa-key text-amber-500"></i>
                    <span>Log Masuk Pentadbir JKR (Admin):</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Username: <span className="font-bold text-slate-800 bg-white px-1.5 py-0.5 rounded border border-slate-200">admin</span> &nbsp;|&nbsp; 
                    Password: <span className="font-bold text-slate-800 bg-white px-1.5 py-0.5 rounded border border-slate-200">123</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (isAdminLoggedIn) {
                      setShowAdminPortal(true);
                    } else {
                      setShowAdminLoginModal(true);
                    }
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 bg-[#111827] hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer whitespace-nowrap"
                >
                  <i className="fa-solid fa-right-to-bracket text-[#FFD100]"></i>
                  <span>{isAdminLoggedIn ? 'Buka Modul Pentadbir (Aktif)' : 'Log Masuk Pentadbir'}</span>
                </button>
              </div>

              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
                <span className="flex items-center gap-1.5">
                  <i className="fa-solid fa-cloud text-sky-500"></i>
                  <span>Disimpan &amp; disegerakkan ke pangkalan data Cloudflare JKR Negeri Sembilan</span>
                </span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <i className="fa-solid fa-circle-check"></i>
                  <span>Keselamatan Data Terpelihara</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 10. FOOTER LENGKAP ==================== */}
      <footer className="bg-[#0B0F19] text-slate-300 pt-16 pb-8 border-t-4 border-[#FFD100] mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
          {/* Kolum 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl w-fit border border-white/10">
              <JataNegeriSembilan className="h-10 w-auto" />
              <div className="h-8 w-px bg-slate-700"></div>
              <JkrLogo className="h-10 w-auto" />
            </div>
            <h4 className="text-white font-bold text-sm">Jabatan Kerja Raya Negeri Sembilan</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Kompleks Kerja Raya, Jalan S2 A47,
              <br />
              70300 Seremban 2, Negeri Sembilan Darul Khusus.
            </p>
            <div className="text-xs text-slate-400 space-y-1">
              <div>
                <span className="font-bold text-slate-300">{lang === 'BM' ? 'Talian Am:' : 'General Line:'}</span>{' '}
                06-765 9200
              </div>
              <div>
                <span className="font-bold text-slate-300">{lang === 'BM' ? 'Faks:' : 'Fax:'}</span> 06-763 0835
              </div>
            </div>
          </div>

          {/* Kolum 2 */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase text-[#FFD100]">
              {lang === 'BM' ? 'Pautan Pantas' : 'Quick Links'}
            </h4>
            <ul className="text-xs space-y-2 text-slate-400">
              <li>
                <a href="#heroSlider" className="hover:text-[#FFD100] transition-colors">
                  {lang === 'BM' ? 'Laman Utama' : 'Home Portal'}
                </a>
              </li>
              <li>
                <a href="#tenderSection" className="hover:text-[#FFD100] transition-colors">
                  {lang === 'BM' ? 'Tender & Sebut Harga' : 'Tenders & Bidding'}
                </a>
              </li>
              <li>
                <a href="#direktoriDaerahSection" className="hover:text-[#FFD100] transition-colors">
                  {lang === 'BM' ? 'Direktori Jurutera Daerah' : 'District Engineers Directory'}
                </a>
              </li>
              <li>
                <a href="#aduanSection" className="hover:text-[#FFD100] transition-colors">
                  {lang === 'BM' ? 'e-Aduan Pothole 24 Jam' : '24h Pothole e-Complaint'}
                </a>
              </li>
              <li>
                <a
                  href="https://www.n9.gov.my"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#FFD100] transition-colors"
                >
                  Portal Kerajaan Negeri Sembilan
                </a>
              </li>
            </ul>
          </div>

          {/* Kolum 3 */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase text-[#FFD100]">
              {lang === 'BM' ? 'Ketelusan & Dasar' : 'Transparency & Policies'}
            </h4>
            <ul className="text-xs space-y-2 text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() =>
                    openModal(
                      'Dasar Privasi JKR Negeri Sembilan',
                      'Jabatan Kerja Raya Negeri Sembilan komited dalam melindungi privasi maklumat peribadi pengguna selaras dengan Akta Perlindungan Data Peribadi 2010 (Akta 709). Data yang diserahkan melalui modul aduan hanya digunakan bagi tujuan pengesahan lokasi teknikal dan penyelesaian tindakan pembinaan jalan.'
                    )
                  }
                  className="hover:text-[#FFD100] text-left cursor-pointer"
                >
                  Dasar Privasi
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    openModal(
                      'Dasar Keselamatan Siber (DKS)',
                      'Keselamatan portal ini diurus mengikut rangka kerja Agensi Keselamatan Siber Negara (NACSA) dan Garis Panduan Keselamatan ICT Sektor Awam MAMPU/JDN. Data komunikasi disulitkan menggunakan sambungan protokol selamat SSL/TLS.'
                    )
                  }
                  className="hover:text-[#FFD100] text-left cursor-pointer"
                >
                  Dasar Keselamatan Siber (DKS)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    openModal(
                      'Penafian Rasmi',
                      'Kerajaan Negeri Sembilan dan Jabatan Kerja Raya Negeri Sembilan tidak bertanggungjawab terhadap sebarang kerugian atau kerosakan yang dialami akibat daripada penggunaan mana-mana maklumat yang diperoleh daripada portal ini.'
                    )
                  }
                  className="hover:text-[#FFD100] text-left cursor-pointer"
                >
                  Penafian Rasmi
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    openModal(
                      'Pensijilan Standard ISO 9001 & ABMS 37001',
                      'JKR Negeri Sembilan mematuhi Standard MS ISO 9001:2015 (Sistem Pengurusan Kualiti Kejuruteraan) dan Sistem Pengurusan Anti-Rasuah ISO 37001 bagi membudayakan urus tadbir telus dan profesional.'
                    )
                  }
                  className="hover:text-[#FFD100] text-left cursor-pointer"
                >
                  ISO 9001 & ABMS 37001
                </button>
              </li>
            </ul>
          </div>

          {/* Kolum 4 */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase text-[#FFD100]">
              {lang === 'BM' ? 'Statistik & Akses' : 'Statistics & Status'}
            </h4>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="text-[11px] text-slate-400">
                {lang === 'BM' ? 'Jumlah Lawatan Portal:' : 'Total Portal Visits:'}
              </div>
              <div className="text-xl font-mono font-bold text-[#FFD100]">
                {visitorCount.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800">
                {lang === 'BM' ? 'Tarikh Kemas Kini:' : 'Last Updated:'}{' '}
                <span className="text-slate-300 font-mono">02 November 2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hak Cipta */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>&copy; 2026 Jabatan Kerja Raya Negeri Sembilan. Hak Cipta Terpelihara.</p>
          <p className="text-[11px]">
            {lang === 'BM'
              ? 'Paparan terbaik menggunakan resolusi 1920x1080 pada pelayar moden.'
              : 'Best viewed at 1920x1080 resolution on modern browsers.'}
          </p>
        </div>
      </footer>

      {/* ==================== MODAL MAKLUMAT UMUM (TANPA WINDOW.ALERT) ==================== */}
      {modalState.open && (
        <div
          className="fixed inset-0 modal-backdrop z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <h4 className="font-bold text-base text-slate-900">{modalState.title}</h4>
              <button
                type="button"
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                aria-label="Tutup Maklumat"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 whitespace-pre-line">
              {modalState.content}
            </p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="px-5 py-2 bg-[#111827] hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                {lang === 'BM' ? 'Tutup' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Log Masuk Pentadbir (Admin) */}
      <AdminLoginModal
        isOpen={showAdminLoginModal}
        onClose={() => setShowAdminLoginModal(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />
    </div>
  );
}

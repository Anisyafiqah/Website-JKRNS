/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  JataNegeriSembilan,
  JkrLogo
} from './components/Logos';
import { AdminLoginModal, AuthUser } from './components/AdminLoginModal';
import { AdminPortal } from './components/AdminPortal';
import { PenyelarasPortal, TenderRecord } from './components/PenyelarasPortal';
import { HomePage, PageId } from './components/HomePage';
import { ProfilKorporat } from './components/ProfilKorporat';
import { BahagianCawangan } from './components/BahagianCawangan';
import { KontraktorPage } from './components/KontraktorPage';
import { PusatMuatTurun } from './components/PusatMuatTurun';
import { WargaJKRNS } from './components/SistemAplikasiStaf';
import { AduanPage } from './components/AduanPage';
import { CMSDashboard } from './components/cms/CMSDashboard';
import { CMSLoginPage } from './components/cms/CMSLoginPage';
import { CMSContent, defaultCmsContent } from './data/defaultCmsContent';

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

export default function App() {
  // Page Navigation State (Satu Modul Satu Halaman)
  const [currentPage, setCurrentPage] = useState<PageId>('utama');

  // Accessibility state
  const [fontSize, setFontSize] = useState<'small' | 'normal' | 'large'>('normal');
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [lang, setLang] = useState<'BM' | 'EN'>('BM');

  // Mobile drawer state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hero Slider state (Laman Utama)
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideCount = 3;
  const slideTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Global search state
  const [searchQuery, setSearchQuery] = useState('');

  // Category Tabs state (Laman Utama)
  const [activeCategoryTab, setActiveCategoryTab] = useState<'awam' | 'kontraktor' | 'agensi'>('awam');

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
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);

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

  // User Authentication & Roles ('Admin' | 'Penyelaras Iklan')
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('jkr_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [showAdminLoginModal, setShowAdminLoginModal] = useState<boolean>(false);
  const [showAdminPortal, setShowAdminPortal] = useState<boolean>(false);
  const [showPenyelarasPortal, setShowPenyelarasPortal] = useState<boolean>(false);
  const [liveTenders, setLiveTenders] = useState<TenderRecord[]>([]);

  // CMS Content Management State
  const [cmsContent, setCmsContent] = useState<CMSContent>(defaultCmsContent);
  const [cmsUser, setCmsUser] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('jkr_cms_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [showCmsDashboard, setShowCmsDashboard] = useState<boolean>(() => {
    return window.location.hash.toLowerCase() === '#cms';
  });
  const [showCmsLogin, setShowCmsLogin] = useState<boolean>(() => {
    return window.location.hash.toLowerCase() === '#cms-login';
  });

  // Visitor counter state
  const [visitorCount, setVisitorCount] = useState<number>(1483129);
  const [currentDateStr, setCurrentDateStr] = useState('');

  // Handle URL Hash navigation (including #cms and #cms-login)
  useEffect(() => {
    const handleHashChange = () => {
      const fullHash = window.location.hash.toLowerCase();
      if (fullHash === '#cms') {
        setShowCmsDashboard(true);
        setShowCmsLogin(false);
        return;
      }
      if (fullHash === '#cms-login') {
        setShowCmsLogin(true);
        setShowCmsDashboard(false);
        return;
      }

      setShowCmsDashboard(false);
      setShowCmsLogin(false);

      const hash = fullHash.replace('#', '');
      if (['utama', 'profil', 'bahagian', 'kontraktor', 'muatturun', 'warga', 'aduan'].includes(hash)) {
        setCurrentPage(hash as PageId);
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToPage = (page: PageId) => {
    setShowCmsDashboard(false);
    setShowCmsLogin(false);
    setCurrentPage(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  // CMS login and logout actions
  const handleCmsLoginSuccess = (user: any) => {
    setCmsUser(user);
    setShowCmsLogin(false);
    setShowCmsDashboard(true);
    window.location.hash = 'cms';
  };

  const handleCmsLogout = () => {
    localStorage.removeItem('jkr_cms_token');
    localStorage.removeItem('jkr_cms_user');
    setCmsUser(null);
    setShowCmsDashboard(false);
    setShowCmsLogin(false);
    window.location.hash = 'utama';
  };

  // Fetch complaints, Cloudflare connection status, tenders, and CMS content from backend
  const refreshBackendData = async () => {
    try {
      const [cfRes, aduanRes, tendersRes, cmsRes] = await Promise.all([
        fetch('/api/cloudflare/status').then((r) => r.json()).catch(() => null),
        fetch('/api/aduan').then((r) => r.json()).catch(() => null),
        fetch('/api/tenders').then((r) => r.json()).catch(() => null),
        fetch('/api/cms/content').then((r) => r.json()).catch(() => null)
      ]);

      if (cmsRes && cmsRes.success && cmsRes.data) {
        setCmsContent(cmsRes.data);
      }

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

      if (tendersRes && tendersRes.success && Array.isArray(tendersRes.data)) {
        setLiveTenders(tendersRes.data);
      }
    } catch (err) {
      console.warn('Backend connection fallback:', err);
    }
  };

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

  // Auto carousel slide effect for HomePage
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
      () => {
        const fallback = '2.69225° N, 101.90562° E';
        setFormData((prev) => ({ ...prev, gps: fallback }));
        setGpsStatus(
          lang === 'BM'
            ? 'Lokasi anggaran Seremban (Sila benarkan akses lokasi pelayar jika perlu).'
            : 'Estimated Seremban coordinates (Please allow browser location permissions).'
        );
      },
      { timeout: 8000 }
    );
  };

  // Handle complaint submission
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
    setSubmitStatus(null);

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

        setSubmitStatus(
          lang === 'BM'
            ? `Aduan ${ticketId} berjaya dihantar! Sila simpan nombor rujukan anda.`
            : `Complaint ${ticketId} successfully submitted! Please save your reference code.`
        );

        openModal(lang === 'BM' ? 'Aduan Berjaya Didaftarkan' : 'Complaint Successfully Filed', msg);

        if (result.record) {
          setSubmittedComplaints((prev) => [result.record, ...prev.filter((c) => c.id !== result.record.id)]);
        }

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

  // Ticket lookup
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

  // Global search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      openModal(
        lang === 'BM' ? 'Carian Kosong' : 'Empty Search',
        lang === 'BM'
          ? 'Sila masukkan kata kunci seperti "Tender", "Rembau", "Borang", atau "Jambatan".'
          : 'Please enter keywords such as "Tender", "Rembau", "Form", or "Bridge".'
      );
      return;
    }

    const q = searchQuery.toLowerCase();
    if (q.includes('tender') || q.includes('kontrak') || q.includes('sebut harga')) {
      navigateToPage('kontraktor');
    } else if (q.includes('aduan') || q.includes('pothole') || q.includes('lubang') || q.includes('rosak')) {
      navigateToPage('aduan');
    } else if (q.includes('borang') || q.includes('permit') || q.includes('muat turun')) {
      navigateToPage('muatturun');
    } else if (q.includes('staf') || q.includes('hrmis') || q.includes('ispeks') || q.includes('warga')) {
      navigateToPage('warga');
    } else if (q.includes('visi') || q.includes('misi') || q.includes('pengarah') || q.includes('piagam')) {
      navigateToPage('profil');
    } else if (q.includes('daerah') || q.includes('jurutera') || q.includes('seremban') || q.includes('bahagian')) {
      navigateToPage('bahagian');
    } else {
      openModal(
        lang === 'BM' ? `Carian: "${searchQuery}"` : `Search: "${searchQuery}"`,
        `Carian dipadankan. Anda boleh meneliti maklumat berkaitan di modul Kontraktor, Bahagian & Cawangan atau Pusat Muat Turun.`
      );
    }
  };

  // Auth actions
  const handleAdminLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    if (user.role === 'Admin') {
      setShowAdminPortal(true);
      setShowPenyelarasPortal(false);
    } else if (user.role === 'Penyelaras Iklan') {
      setShowPenyelarasPortal(true);
      setShowAdminPortal(false);
    }
    refreshBackendData();
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('jkr_admin_token');
    localStorage.removeItem('jkr_admin_user');
    setCurrentUser(null);
    setShowAdminPortal(false);
    setShowPenyelarasPortal(false);
  };

  const handleRegisterTender = async (data: Partial<TenderRecord>): Promise<boolean> => {
    try {
      const res = await fetch('/api/tenders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          createdBy: currentUser?.username || 'penyelaras',
          createdByName: currentUser?.name || 'Penyelaras Iklan JKR'
        })
      });
      const json = await res.json();
      if (res.ok && json.success) {
        await refreshBackendData();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to register tender:', err);
      return false;
    }
  };

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
        openModal('Status Dikemaskini', `Status tiket ${ticketId} telah dikemaskini kepada "${newStatus}".`);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
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

  // Full Screen CMS Admin Dashboard & Login
  if (showCmsDashboard) {
    if (!cmsUser) {
      return (
        <CMSLoginPage
          onLoginSuccess={handleCmsLoginSuccess}
          onBackToPublic={() => {
            setShowCmsDashboard(false);
            window.location.hash = 'utama';
          }}
        />
      );
    }
    return (
      <CMSDashboard
        currentUser={cmsUser}
        onLogout={handleCmsLogout}
        onViewPublicSite={() => {
          setShowCmsDashboard(false);
          window.location.hash = 'utama';
          refreshBackendData();
        }}
        onContentUpdated={() => refreshBackendData()}
      />
    );
  }

  if (showCmsLogin) {
    return (
      <CMSLoginPage
        onLoginSuccess={handleCmsLoginSuccess}
        onBackToPublic={() => {
          setShowCmsLogin(false);
          window.location.hash = 'utama';
        }}
      />
    );
  }

  // Full Screen Portals for Admin / Penyelaras
  if (showPenyelarasPortal && currentUser && currentUser.role === 'Penyelaras Iklan') {
    return (
      <PenyelarasPortal
        currentUser={currentUser}
        tenders={liveTenders}
        onClose={() => setShowPenyelarasPortal(false)}
        onLogout={handleAdminLogout}
        onRegisterTender={handleRegisterTender}
        onRefresh={refreshBackendData}
      />
    );
  }

  if (showAdminPortal && currentUser && currentUser.role === 'Admin') {
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

  // Page titles for breadcrumbs
  const getPageTitle = (p: PageId) => {
    switch (p) {
      case 'profil':
        return lang === 'BM' ? 'Profil Korporat' : 'Corporate Profile';
      case 'bahagian':
        return lang === 'BM' ? 'Bahagian & Cawangan Ibu Pejabat' : 'HQ Divisions & Districts';
      case 'kontraktor':
        return lang === 'BM' ? 'Kontraktor & Perolehan' : 'Contractors & Procurement';
      case 'muatturun':
        return lang === 'BM' ? 'Pusat Muat Turun Borang' : 'Official Forms & Downloads';
      case 'warga':
        return 'Warga JKRNS';
      case 'aduan':
        return lang === 'BM' ? 'e-Aduan Kerosakan Jalan' : 'Damage e-Complaint';
      default:
        return lang === 'BM' ? 'Laman Utama' : 'Home';
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-800 transition-colors duration-200">
      {/* ==================== 1. HEADER & ACCESSIBILITY BAR ==================== */}
      <header className="w-full bg-white shadow-md sticky top-0 z-50">
        {/* Top Accessibility Bar */}
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
              {/* Saiz Teks */}
              <div className="flex items-center gap-1 bg-slate-800/90 px-2 py-0.5 rounded-lg border border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider mr-1">Teks:</span>
                <button
                  type="button"
                  onClick={() => setFontSize('small')}
                  className={`px-1.5 py-0.5 rounded transition-colors ${
                    fontSize === 'small' ? 'bg-[#FFD100] text-black font-bold' : 'hover:text-[#FFD100]'
                  }`}
                  title="Saiz Teks Kecil"
                >
                  A-
                </button>
                <button
                  type="button"
                  onClick={() => setFontSize('normal')}
                  className={`px-1.5 py-0.5 rounded transition-colors ${
                    fontSize === 'normal' ? 'bg-[#FFD100] text-black font-bold' : 'hover:text-[#FFD100]'
                  }`}
                  title="Saiz Teks Biasa"
                >
                  A
                </button>
                <button
                  type="button"
                  onClick={() => setFontSize('large')}
                  className={`px-1.5 py-0.5 rounded transition-colors ${
                    fontSize === 'large' ? 'bg-[#FFD100] text-black font-bold' : 'hover:text-[#FFD100]'
                  }`}
                  title="Saiz Teks Besar"
                >
                  A+
                </button>
              </div>

              {/* Kontras Tinggi */}
              <button
                type="button"
                onClick={() => setHighContrast(!highContrast)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
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
                className="flex items-center gap-1.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-[#FFD100] px-2.5 py-1 rounded-lg border border-slate-700 transition-colors font-semibold text-xs cursor-pointer"
                title="Tukar Bahasa"
              >
                <i className="fa-solid fa-globe text-xs text-[#DC2626]"></i>
                <span className="font-bold">{lang}</span>
              </button>

              {/* CMS Admin Button */}
              <button
                type="button"
                onClick={() => {
                  if (cmsUser) {
                    setShowCmsDashboard(true);
                    window.location.hash = 'cms';
                  } else {
                    setShowCmsLogin(true);
                    window.location.hash = 'cms-login';
                  }
                }}
                className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 px-2.5 py-1 rounded-lg font-black text-xs transition-all shadow-xs cursor-pointer"
                title="Sistem Pengurusan Kandungan Laman (CMS Portal)"
              >
                <i className="fa-solid fa-gauge-high text-xs text-slate-900"></i>
                <span>CMS Pentadbir</span>
                {cmsUser && (
                  <span className="w-2 h-2 rounded-full bg-emerald-700 animate-ping"></span>
                )}
              </button>

              {/* Akses Pentadbir / Penyelaras */}
              {currentUser ? (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (currentUser.role === 'Admin') setShowAdminPortal(true);
                      else setShowPenyelarasPortal(true);
                    }}
                    className="flex items-center gap-1.5 bg-[#FFD100] text-slate-900 px-2.5 py-1 rounded-lg font-bold text-xs hover:bg-yellow-400 transition-all shadow-xs cursor-pointer"
                  >
                    <i className={`fa-solid ${currentUser.role === 'Admin' ? 'fa-shield-halved' : 'fa-bullhorn'} text-xs text-[#DC2626]`}></i>
                    <span>{currentUser.role === 'Admin' ? 'Portal Admin' : 'Portal Penyelaras'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleAdminLogout}
                    className="px-2 py-1 bg-red-900/50 hover:bg-red-700 text-red-200 rounded-lg text-xs transition-colors cursor-pointer"
                    title="Log Keluar"
                  >
                    <i className="fa-solid fa-power-off"></i>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowAdminLoginModal(true)}
                  className="flex items-center gap-1.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-[#FFD100] px-2.5 py-1 rounded-lg border border-slate-700 transition-colors font-semibold text-xs cursor-pointer"
                  title="Log Masuk Staf & Pentadbir JKR"
                >
                  <i className="fa-solid fa-lock text-xs text-[#FFD100]"></i>
                  <span>Log Masuk Staf</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Jalur Bendera Negeri Sembilan */}
        <div className="h-1.5 w-full flex">
          <div className="h-full w-1/2 bg-[#FFD100]"></div>
          <div className="h-full w-1/4 bg-[#DC2626]"></div>
          <div className="h-full w-1/4 bg-[#111827]"></div>
        </div>

        {/* Jenama & Logo Rasmi */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div
              onClick={() => navigateToPage('utama')}
              className="flex items-center gap-3 sm:gap-4 cursor-pointer"
            >
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
                  {cmsContent.siteConfig.portalName || 'JABATAN KERJA RAYA'}
                </h1>
                <p className="text-xs sm:text-sm font-bold text-[#DC2626] tracking-wide flex items-center gap-1">
                  <span>{cmsContent.siteConfig.portalSubtitle || 'NEGERI SEMBILAN DARUL KHUSUS'}</span>
                </p>
              </div>
            </div>

            {/* Menu Navigasi Desktop (Satu Modul Satu Halaman) */}
            <nav className="hidden lg:flex items-center gap-2 xl:gap-3 font-semibold text-xs sm:text-sm">
              <button
                type="button"
                onClick={() => navigateToPage('utama')}
                className={`py-1.5 px-3 rounded-xl transition-all cursor-pointer ${
                  currentPage === 'utama'
                    ? 'bg-slate-900 text-[#FFD100] font-bold shadow-xs'
                    : 'text-slate-700 hover:text-[#DC2626] hover:bg-slate-100'
                }`}
              >
                {lang === 'BM' ? 'Utama' : 'Home'}
              </button>
              <button
                type="button"
                onClick={() => navigateToPage('profil')}
                className={`py-1.5 px-3 rounded-xl transition-all cursor-pointer ${
                  currentPage === 'profil'
                    ? 'bg-slate-900 text-[#FFD100] font-bold shadow-xs'
                    : 'text-slate-700 hover:text-[#DC2626] hover:bg-slate-100'
                }`}
              >
                {lang === 'BM' ? 'Profil Korporat' : 'Corporate Profile'}
              </button>
              <button
                type="button"
                onClick={() => navigateToPage('bahagian')}
                className={`py-1.5 px-3 rounded-xl transition-all cursor-pointer ${
                  currentPage === 'bahagian'
                    ? 'bg-slate-900 text-[#FFD100] font-bold shadow-xs'
                    : 'text-slate-700 hover:text-[#DC2626] hover:bg-slate-100'
                }`}
              >
                {lang === 'BM' ? 'Bahagian & Cawangan' : 'HQ Divisions'}
              </button>
              <button
                type="button"
                onClick={() => navigateToPage('kontraktor')}
                className={`py-1.5 px-3 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  currentPage === 'kontraktor'
                    ? 'bg-slate-900 text-[#FFD100] font-bold shadow-xs'
                    : 'text-slate-700 hover:text-[#DC2626] hover:bg-slate-100'
                }`}
              >
                <span>{lang === 'BM' ? 'Kontraktor' : 'Contractors'}</span>
                <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-ping"></span>
              </button>
              <button
                type="button"
                onClick={() => navigateToPage('muatturun')}
                className={`py-1.5 px-3 rounded-xl transition-all cursor-pointer ${
                  currentPage === 'muatturun'
                    ? 'bg-slate-900 text-[#FFD100] font-bold shadow-xs'
                    : 'text-slate-700 hover:text-[#DC2626] hover:bg-slate-100'
                }`}
              >
                {lang === 'BM' ? 'Muat Turun' : 'Downloads'}
              </button>
              <button
                type="button"
                onClick={() => navigateToPage('warga')}
                className={`py-1.5 px-3 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  currentPage === 'warga'
                    ? 'bg-slate-900 text-[#FFD100] font-bold shadow-xs'
                    : 'text-slate-700 hover:text-[#DC2626] hover:bg-slate-100'
                }`}
              >
                <i className="fa-solid fa-users text-amber-500 text-xs"></i>
                <span>Warga JKRNS</span>
              </button>
              <button
                type="button"
                onClick={() => navigateToPage('aduan')}
                className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 text-xs cursor-pointer shadow-md ${
                  currentPage === 'aduan'
                    ? 'bg-[#991B1B] text-white ring-2 ring-[#FFD100]'
                    : 'bg-[#DC2626] hover:bg-[#991B1B] text-white shadow-red-600/25'
                }`}
              >
                <i className="fa-solid fa-headset text-[#FFD100]"></i>
                <span>e-Aduan</span>
              </button>
            </nav>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 cursor-pointer"
              aria-label="Togol Menu Navigasi"
            >
              <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>

          {/* Mobile Dropdown Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-3 pt-3 border-t border-slate-200 space-y-1 text-sm font-semibold animate-fadeIn">
              <button
                type="button"
                onClick={() => navigateToPage('utama')}
                className={`w-full text-left py-2.5 px-3 rounded-xl transition-colors ${
                  currentPage === 'utama' ? 'bg-slate-900 text-[#FFD100]' : 'hover:bg-slate-100 text-slate-800'
                }`}
              >
                {lang === 'BM' ? 'Laman Utama' : 'Home'}
              </button>
              <button
                type="button"
                onClick={() => navigateToPage('profil')}
                className={`w-full text-left py-2.5 px-3 rounded-xl transition-colors ${
                  currentPage === 'profil' ? 'bg-slate-900 text-[#FFD100]' : 'hover:bg-slate-100 text-slate-800'
                }`}
              >
                {lang === 'BM' ? 'Profil Korporat' : 'Corporate Profile'}
              </button>
              <button
                type="button"
                onClick={() => navigateToPage('bahagian')}
                className={`w-full text-left py-2.5 px-3 rounded-xl transition-colors ${
                  currentPage === 'bahagian' ? 'bg-slate-900 text-[#FFD100]' : 'hover:bg-slate-100 text-slate-800'
                }`}
              >
                {lang === 'BM' ? 'Bahagian & Cawangan Ibu Pejabat' : 'HQ Divisions & Branches'}
              </button>
              <button
                type="button"
                onClick={() => navigateToPage('kontraktor')}
                className={`w-full text-left py-2.5 px-3 rounded-xl transition-colors ${
                  currentPage === 'kontraktor' ? 'bg-slate-900 text-[#FFD100]' : 'hover:bg-slate-100 text-slate-800'
                }`}
              >
                {lang === 'BM' ? 'Kontraktor (Tender & Sebut Harga)' : 'Contractors (Tenders & Bidding)'}
              </button>
              <button
                type="button"
                onClick={() => navigateToPage('muatturun')}
                className={`w-full text-left py-2.5 px-3 rounded-xl transition-colors ${
                  currentPage === 'muatturun' ? 'bg-slate-900 text-[#FFD100]' : 'hover:bg-slate-100 text-slate-800'
                }`}
              >
                {lang === 'BM' ? 'Pusat Muat Turun Borang' : 'Download Forms'}
              </button>
              <button
                type="button"
                onClick={() => navigateToPage('warga')}
                className={`w-full text-left py-2.5 px-3 rounded-xl transition-colors ${
                  currentPage === 'warga' ? 'bg-slate-900 text-[#FFD100]' : 'hover:bg-slate-100 text-slate-800'
                }`}
              >
                Warga JKRNS
              </button>
              <button
                type="button"
                onClick={() => navigateToPage('aduan')}
                className="w-full text-left py-2.5 px-3 rounded-xl bg-[#DC2626] text-white font-bold"
              >
                {lang === 'BM' ? 'e-Aduan Kerosakan' : 'Damage e-Complaint'}
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ==================== 2. BREADCRUMBS BANNER (BAGI HALAMAN BUKAN UTAMA) ==================== */}
      {currentPage !== 'utama' && (
        <div className="bg-slate-100 border-b border-slate-200 py-2.5 px-4 sm:px-6 lg:px-8 text-xs text-slate-600">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigateToPage('utama')}
                className="hover:text-[#DC2626] font-semibold flex items-center gap-1.5 cursor-pointer text-slate-500"
              >
                <i className="fa-solid fa-house text-slate-400"></i>
                <span>{lang === 'BM' ? 'Utama' : 'Home'}</span>
              </button>
              <i className="fa-solid fa-chevron-right text-[10px] text-slate-400"></i>
              <span className="font-bold text-slate-900">{getPageTitle(currentPage)}</span>
            </div>

            <button
              type="button"
              onClick={() => navigateToPage('utama')}
              className="text-xs font-bold text-[#DC2626] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <i className="fa-solid fa-arrow-left text-[10px]"></i>
              <span>{lang === 'BM' ? 'Kembali ke Utama' : 'Back to Home'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ==================== 3. KANDUNGAN UTAMA (SATU MODUL SATU HALAMAN) ==================== */}
      <main className="flex-1 w-full">
        {/* Laman 1: Utama */}
        {currentPage === 'utama' && (
          <HomePage
            lang={lang}
            currentSlide={currentSlide}
            slideCount={slideCount}
            handleNextSlide={handleNextSlide}
            handlePrevSlide={handlePrevSlide}
            setCurrentSlide={setCurrentSlide}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearchSubmit={handleSearchSubmit}
            activeCategoryTab={activeCategoryTab}
            setActiveCategoryTab={setActiveCategoryTab}
            onNavigateToPage={navigateToPage}
            onOpenModal={openModal}
            cmsContent={cmsContent}
          />
        )}

        {/* Laman 2: Profil Korporat */}
        {currentPage === 'profil' && (
          <ProfilKorporat
            lang={lang}
            onOpenModal={openModal}
            cmsData={cmsContent.profilKorporat}
          />
        )}

        {/* Laman 3: Bahagian & Cawangan Ibu Pejabat */}
        {currentPage === 'bahagian' && (
          <BahagianCawangan
            lang={lang}
            onOpenModal={openModal}
            cmsData={cmsContent.bahagianCawangan}
            onSelectDistrictForComplaint={(districtName) => {
              setFormData((prev) => ({ ...prev, daerah: districtName }));
              navigateToPage('aduan');
            }}
          />
        )}

        {/* Laman 4: Kontraktor & Perolehan */}
        {currentPage === 'kontraktor' && (
          <KontraktorPage
            lang={lang}
            tenders={liveTenders.length > 0 ? liveTenders : (TENDERS_DATA as any[])}
            onOpenModal={openModal}
            currentUser={currentUser}
            onOpenPenyelarasPortal={() => setShowPenyelarasPortal(true)}
            onOpenAdminPortal={() => setShowAdminPortal(true)}
            cmsPolicies={cmsContent.kontraktorPolicies}
          />
        )}

        {/* Laman 5: Pusat Muat Turun */}
        {currentPage === 'muatturun' && (
          <PusatMuatTurun
            lang={lang}
            onOpenModal={openModal}
            cmsDownloads={cmsContent.downloads}
          />
        )}

        {/* Laman 6: Warga JKRNS */}
        {currentPage === 'warga' && (
          <WargaJKRNS
            lang={lang}
            onOpenModal={openModal}
            onOpenAdminLogin={() => setShowAdminLoginModal(true)}
            cmsLinks={cmsContent.wargaLinks}
          />
        )}

        {/* Laman 7: e-Aduan Kerosakan */}
        {currentPage === 'aduan' && (
          <AduanPage
            lang={lang}
            formData={formData}
            setFormData={setFormData}
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
            gpsStatus={gpsStatus}
            detectUserLocation={detectUserLocation}
            isSubmitting={isSubmitting}
            submitStatus={submitStatus}
            handleComplaintSubmit={handleComplaintSubmit}
            ticketSearchInput={ticketSearchInput}
            setTicketSearchInput={setTicketSearchInput}
            foundTicket={foundTicket}
            handleTicketLookup={handleTicketLookup}
            cloudflareInfo={cloudflareInfo}
            currentUser={currentUser}
            onOpenAdminLogin={() => setShowAdminLoginModal(true)}
            onOpenAdminPortal={() => setShowAdminPortal(true)}
            onOpenModal={openModal}
          />
        )}
      </main>

      {/* ==================== 4. FOOTER KONSISTEN ==================== */}
      <footer className="bg-[#0B0F19] text-slate-300 pt-16 pb-8 border-t-4 border-[#FFD100] mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
          {/* Kolum 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl w-fit border border-white/10">
              <JataNegeriSembilan className="h-10 w-auto" />
              <div className="h-8 w-px bg-slate-700"></div>
              <JkrLogo className="h-10 w-auto" />
            </div>
            <h4 className="text-white font-bold text-sm">
              {cmsContent.siteConfig.portalName} {cmsContent.siteConfig.portalSubtitle}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-line">
              {cmsContent.siteConfig.address || 'Kompleks Kerja Raya, Jalan S2 A47,\n70300 Seremban 2, Negeri Sembilan Darul Khusus.'}
            </p>
            <div className="text-xs text-slate-400 space-y-1">
              <div>
                <span className="font-bold text-slate-300">{lang === 'BM' ? 'Talian Am:' : 'General Line:'}</span>{' '}
                {cmsContent.siteConfig.hotline || '06-765 9200'}
              </div>
              <div>
                <span className="font-bold text-slate-300">{lang === 'BM' ? 'Emel Rasmi:' : 'Email:'}</span>{' '}
                {cmsContent.siteConfig.email || 'korporat.jkrns@ns.gov.my'}
              </div>
            </div>
          </div>

          {/* Kolum 2: Modul Utama */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase text-[#FFD100]">
              {lang === 'BM' ? 'Modul Portal' : 'Portal Modules'}
            </h4>
            <ul className="text-xs space-y-2 text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => navigateToPage('utama')}
                  className="hover:text-[#FFD100] transition-colors cursor-pointer text-left"
                >
                  {lang === 'BM' ? 'Laman Utama' : 'Home'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateToPage('profil')}
                  className="hover:text-[#FFD100] transition-colors cursor-pointer text-left"
                >
                  {lang === 'BM' ? 'Profil Korporat' : 'Corporate Profile'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateToPage('bahagian')}
                  className="hover:text-[#FFD100] transition-colors cursor-pointer text-left"
                >
                  {lang === 'BM' ? 'Bahagian & Cawangan Ibu Pejabat' : 'HQ Divisions & Districts'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateToPage('kontraktor')}
                  className="hover:text-[#FFD100] transition-colors cursor-pointer text-left"
                >
                  {lang === 'BM' ? 'Kontraktor & Perolehan' : 'Contractors & Tenders'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateToPage('muatturun')}
                  className="hover:text-[#FFD100] transition-colors cursor-pointer text-left"
                >
                  {lang === 'BM' ? 'Pusat Muat Turun Borang' : 'Official Downloads'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateToPage('warga')}
                  className="hover:text-[#FFD100] transition-colors cursor-pointer text-left"
                >
                  Warga JKRNS
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateToPage('aduan')}
                  className="hover:text-[#FFD100] transition-colors cursor-pointer text-left"
                >
                  {lang === 'BM' ? 'e-Aduan Kerosakan Jalan' : '24h e-Complaint'}
                </button>
              </li>
            </ul>
          </div>

          {/* Kolum 3: Ketelusan & Dasar */}
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
                  ISO 9001 &amp; ABMS 37001
                </button>
              </li>
            </ul>
          </div>

          {/* Kolum 4: Statistik & Akses */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase text-[#FFD100]">
              {lang === 'BM' ? 'Statistik & Akses' : 'Statistics & Status'}
            </h4>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
              <div>
                <div className="text-[11px] text-slate-400">
                  {lang === 'BM' ? 'Jumlah Lawatan Portal:' : 'Total Portal Visits:'}
                </div>
                <div className="text-xl font-mono font-bold text-[#FFD100]">
                  {visitorCount.toLocaleString()}
                </div>
              </div>
              <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800">
                {lang === 'BM' ? 'Tarikh Kemas Kini:' : 'Last Updated:'}{' '}
                <span className="text-slate-300 font-mono">03 November 2026</span>
              </div>
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    if (cmsUser) {
                      setShowCmsDashboard(true);
                      window.location.hash = 'cms';
                    } else {
                      setShowCmsLogin(true);
                      window.location.hash = 'cms-login';
                    }
                  }}
                  className="w-full py-2 px-3 bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-[#FFD100] border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <i className="fa-solid fa-sliders text-[#FFD100]"></i>
                  <span>CMS Pentadbir Portal</span>
                </button>
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

      {/* Modal Log Masuk Pentadbir / Penyelaras */}
      <AdminLoginModal
        isOpen={showAdminLoginModal}
        onClose={() => setShowAdminLoginModal(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />
    </div>
  );
}

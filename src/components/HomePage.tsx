/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

import { CMSContent } from '../data/defaultCmsContent';

export type PageId = 'utama' | 'profil' | 'bahagian' | 'kontraktor' | 'muatturun' | 'warga' | 'aduan';

interface HomePageProps {
  lang: 'BM' | 'EN';
  currentSlide: number;
  slideCount: number;
  handleNextSlide: () => void;
  handlePrevSlide: () => void;
  setCurrentSlide: (index: number) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearchSubmit: (e: React.FormEvent) => void;
  activeCategoryTab: 'awam' | 'kontraktor' | 'agensi';
  setActiveCategoryTab: (tab: 'awam' | 'kontraktor' | 'agensi') => void;
  onNavigateToPage: (page: PageId) => void;
  onOpenModal: (title: string, content: string) => void;
  cmsContent?: CMSContent;
}

export const HomePage: React.FC<HomePageProps> = ({
  lang,
  currentSlide,
  slideCount,
  handleNextSlide,
  handlePrevSlide,
  setCurrentSlide,
  searchQuery,
  setSearchQuery,
  handleSearchSubmit,
  activeCategoryTab,
  setActiveCategoryTab,
  onNavigateToPage,
  onOpenModal,
  cmsContent
}) => {
  const heroSlides =
    cmsContent?.homeHeroSlides && cmsContent.homeHeroSlides.length > 0
      ? cmsContent.homeHeroSlides.filter((s) => s.status !== 'draft')
      : null;
  const noticeData = cmsContent?.homeNotice;
  const gateways =
    cmsContent?.homeGateways && cmsContent.homeGateways.length > 0
      ? cmsContent.homeGateways.filter((g) => g.status !== 'draft')
      : null;
  const audienceTabs = cmsContent?.homeAudienceTabs;
  const effectiveSlideCount = heroSlides && heroSlides.length > 0 ? heroSlides.length : slideCount;

  return (
    <div className="w-full pb-16 animate-fadeIn">
      {/* ==================== 1. HERO SLIDER BERGERAK (CAROUSEL) ==================== */}
      <section className="relative w-full h-[460px] md:h-[520px] overflow-hidden bg-[#0B0F19] text-white">
        <div className="relative w-full h-full">
          {heroSlides && heroSlides.length > 0 ? (
            heroSlides.map((slide, idx) => {
              const isCurrent = currentSlide % effectiveSlideCount === idx;
              return (
                <div
                  key={slide.id || idx}
                  className={`absolute inset-0 w-full h-full slide-fade flex items-center perpatih-pattern ${
                    isCurrent ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                  style={
                    slide.bgImage
                      ? {
                          backgroundImage: `url(${slide.bgImage})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }
                      : undefined
                  }
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${
                      slide.bgGradient || 'from-[#0B0F19] via-[#0B0F19]/85 to-transparent'
                    }`}
                  ></div>
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
                    <div className="max-w-2xl space-y-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DC2626]/20 border border-[#DC2626]/50 text-red-300 text-xs font-bold uppercase tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-pulse"></span>
                        <span>{lang === 'BM' ? slide.badge : (slide.badgeEn || slide.badge)}</span>
                      </div>
                      <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
                        {lang === 'BM' ? slide.title : (slide.titleEn || slide.title)}{' '}
                        <span className="text-[#FFD100]">{slide.highlightText}</span>
                      </h2>
                      <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">
                        {lang === 'BM' ? slide.description : (slide.descriptionEn || slide.description)}
                      </p>
                      <div className="flex flex-wrap gap-3 pt-2">
                        {slide.primaryButtonText && (
                          <button
                            type="button"
                            onClick={() => onNavigateToPage((slide.primaryButtonPage as PageId) || 'kontraktor')}
                            className="px-5 py-2.5 sm:py-3 bg-[#FFD100] text-[#111827] font-bold rounded-xl text-xs sm:text-sm hover:bg-yellow-400 transition-all flex items-center gap-2 shadow-lg shadow-yellow-500/20 cursor-pointer"
                          >
                            <i className="fa-solid fa-file-signature"></i>
                            <span>{slide.primaryButtonText}</span>
                          </button>
                        )}
                        {slide.secondaryButtonText && (
                          <button
                            type="button"
                            onClick={() => onNavigateToPage((slide.secondaryButtonPage as PageId) || 'aduan')}
                            className="px-5 py-2.5 sm:py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
                          >
                            <i className="fa-solid fa-headset text-[#FFD100]"></i>
                            <span>{slide.secondaryButtonText}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <>
              {/* Fallback Slide 1 */}
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
                      <button
                        type="button"
                        onClick={() => onNavigateToPage('kontraktor')}
                        className="px-5 py-2.5 sm:py-3 bg-[#FFD100] text-[#111827] font-bold rounded-xl text-xs sm:text-sm hover:bg-yellow-400 transition-all flex items-center gap-2 shadow-lg shadow-yellow-500/20 cursor-pointer"
                      >
                        <i className="fa-solid fa-file-signature"></i>
                        <span>{lang === 'BM' ? 'Modul Kontraktor (Tender)' : 'Contractors & Tenders'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onNavigateToPage('aduan')}
                        className="px-5 py-2.5 sm:py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <i className="fa-solid fa-headset text-[#FFD100]"></i>
                        <span>{lang === 'BM' ? 'Buka Modul e-Aduan' : 'Open e-Complaint'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fallback Slide 2 */}
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
                      <button
                        type="button"
                        onClick={() => onNavigateToPage('aduan')}
                        className="px-5 py-2.5 sm:py-3 bg-[#DC2626] hover:bg-[#991B1B] text-white font-bold rounded-xl text-xs sm:text-sm transition-all flex items-center gap-2 shadow-lg shadow-red-600/25 cursor-pointer"
                      >
                        <i className="fa-solid fa-triangle-exclamation text-[#FFD100]"></i>
                        <span>{lang === 'BM' ? 'Lapor Lubang Jalan' : 'Report Pothole'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onNavigateToPage('bahagian')}
                        className="px-5 py-2.5 sm:py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <i className="fa-solid fa-sitemap text-[#FFD100]"></i>
                        <span>{lang === 'BM' ? 'Bahagian & Pejabat Daerah' : 'Divisions & Districts'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fallback Slide 3 */}
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
                          Seni Bina Minangkabau &amp;{' '}
                          <span className="text-[#FFD100]">Bangunan Awam Berimpak Tinggi</span>
                        </>
                      ) : (
                        <>
                          Minangkabau Heritage &amp;{' '}
                          <span className="text-[#FFD100]">High Impact Public Assets</span>
                        </>
                      )}
                    </h2>
                    <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">
                      {lang === 'BM'
                        ? 'Memelihara identiti Adat Perpatih dalam reka bentuk kompleks pentadbiran, fasiliti kesihatan, dan dewan komuniti bertaraf dunia di seluruh Negeri Sembilan.'
                        : 'Preserving customary Adat Perpatih identity in administrative complexes, healthcare clinics, and world-class multipurpose halls across Negeri Sembilan.'}
                    </p>
                    <div className="flex flex-wrap gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => onNavigateToPage('profil')}
                        className="px-5 py-2.5 sm:py-3 bg-[#FFD100] text-[#111827] font-bold rounded-xl text-xs sm:text-sm hover:bg-yellow-400 transition-all flex items-center gap-2 shadow-lg shadow-yellow-500/20 cursor-pointer"
                      >
                        <i className="fa-solid fa-landmark"></i>
                        <span>{lang === 'BM' ? 'Ketahui Profil Korporat' : 'Explore Corporate Profile'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onNavigateToPage('warga')}
                        className="px-5 py-2.5 sm:py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <i className="fa-solid fa-users text-[#FFD100]"></i>
                        <span>{lang === 'BM' ? 'Portal Warga JKRNS' : 'Warga JKRNS'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Kawalan Navigasi Slaid */}
        <div className="absolute bottom-6 right-6 sm:right-10 z-30 flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrevSlide}
            aria-label="Slaid Sebelum"
            className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 flex items-center justify-center transition-colors cursor-pointer"
          >
            <i className="fa-solid fa-chevron-left text-sm"></i>
          </button>
          <div className="flex gap-1.5 px-2">
            {Array.from({ length: effectiveSlideCount }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Pergi ke slaid ${idx + 1}`}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentSlide % effectiveSlideCount === idx ? 'w-6 bg-[#FFD100]' : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
              ></button>
            ))}
          </div>
          <button
            type="button"
            onClick={handleNextSlide}
            aria-label="Slaid Seterusnya"
            className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 flex items-center justify-center transition-colors cursor-pointer"
          >
            <i className="fa-solid fa-chevron-right text-sm"></i>
          </button>
        </div>
      </section>

      {/* ==================== 2. BAR CARIAN PINTAR ==================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-30">
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
                    ? 'Cari tender, jurutera daerah, borang permohonan, atau talian pejabat...'
                    : 'Search tenders, district engineers, application forms, or office contacts...'
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

      {/* ==================== 3. GERBANG MODUL UTAMA (SATU MODUL SATU LAMAN) ==================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
              <i className="fa-solid fa-cubes"></i>
              <span>{lang === 'BM' ? 'Akses Modul Dedicated' : 'Dedicated Portal Modules'}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {lang === 'BM' ? 'Gerbang Modul & Perkhidmatan Utama' : 'Core Portals & Modules'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {lang === 'BM'
                ? 'Pilih modul spesifik mengikut keperluan anda untuk capaian pantas tanpa kekeruhan laman.'
                : 'Select a dedicated module to access focused tools and comprehensive information.'}
            </p>
          </div>
        </div>

        {/* Kad Modul Utama Berpautan Terus ke Laman Masing-Masing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {gateways && gateways.length > 0 ? (
            gateways.map((gw) => (
              <div
                key={gw.id}
                onClick={() => onNavigateToPage(gw.targetPage as PageId)}
                className={`group bg-white p-6 rounded-3xl border-t-4 ${
                  gw.borderColor || 'border-slate-800'
                } border-x border-b border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between`}
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 group-hover:bg-[#FFD100] text-amber-700 group-hover:text-slate-950 flex items-center justify-center text-xl mb-4 transition-colors">
                    <i className={`fa-solid ${gw.icon || 'fa-cubes'}`}></i>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">
                    {gw.moduleNum}
                  </span>
                  <h4 className="font-black text-slate-900 text-lg group-hover:text-[#DC2626] transition-colors">
                    {lang === 'BM' ? gw.title : (gw.titleEn || gw.title)}
                  </h4>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {lang === 'BM' ? gw.description : (gw.descriptionEn || gw.description)}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700 group-hover:text-[#DC2626]">
                  <span>{lang === 'BM' ? 'Buka Modul' : 'Open Module'}</span>
                  <i className="fa-solid fa-arrow-right text-[11px] group-hover:translate-x-1 transition-transform"></i>
                </div>
              </div>
            ))
          ) : (
            <>
              {/* Fallback Gateway 1 */}
              <div
                onClick={() => onNavigateToPage('profil')}
                className="group bg-white p-6 rounded-3xl border-t-4 border-[#FFD100] border-x border-b border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 group-hover:bg-[#FFD100] text-amber-700 group-hover:text-slate-950 flex items-center justify-center text-xl mb-4 transition-colors">
                    <i className="fa-solid fa-landmark"></i>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">
                    Modul 1
                  </span>
                  <h4 className="font-black text-slate-900 text-lg group-hover:text-[#DC2626] transition-colors">
                    {lang === 'BM' ? 'Profil Korporat' : 'Corporate Profile'}
                  </h4>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {lang === 'BM'
                      ? 'Perutusan Pengarah, Visi, Misi, Objektif, Piagam Pelanggan, Carta Organisasi dan lipatan sejarah JKR NS.'
                      : 'Director’s address, Vision, Mission, Customer Charter, and Departmental Heritage.'}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700 group-hover:text-[#DC2626]">
                  <span>{lang === 'BM' ? 'Buka Halaman Profil' : 'Open Profile'}</span>
                  <i className="fa-solid fa-arrow-right text-[11px] group-hover:translate-x-1 transition-transform"></i>
                </div>
              </div>

              {/* Fallback Gateway 2 */}
              <div
                onClick={() => onNavigateToPage('bahagian')}
                className="group bg-white p-6 rounded-3xl border-t-4 border-[#DC2626] border-x border-b border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-red-50 group-hover:bg-[#DC2626] text-[#DC2626] group-hover:text-white flex items-center justify-center text-xl mb-4 transition-colors">
                    <i className="fa-solid fa-sitemap"></i>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">
                    Modul 2
                  </span>
                  <h4 className="font-black text-slate-900 text-lg group-hover:text-[#DC2626] transition-colors">
                    {lang === 'BM' ? 'Bahagian & Cawangan' : 'HQ Divisions & Districts'}
                  </h4>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {lang === 'BM'
                      ? '10 Bahagian & Cawangan Ibu Pejabat, Sub-Modul 7 Pejabat Daerah dan Direktori Senarai Nama Kakitangan.'
                      : '10 HQ technical divisions, 7 district offices sub-module, and official staff telephone directory.'}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700 group-hover:text-[#DC2626]">
                  <span>{lang === 'BM' ? 'Buka Bahagian & Cawangan' : 'Open Divisions'}</span>
                  <i className="fa-solid fa-arrow-right text-[11px] group-hover:translate-x-1 transition-transform"></i>
                </div>
              </div>

              {/* Fallback Gateway 3 */}
              <div
                onClick={() => onNavigateToPage('kontraktor')}
                className="group bg-white p-6 rounded-3xl border-t-4 border-[#111827] border-x border-b border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 group-hover:bg-[#111827] text-slate-800 group-hover:text-[#FFD100] flex items-center justify-center text-xl mb-4 transition-colors">
                    <i className="fa-solid fa-file-contract"></i>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">
                    Modul 3
                  </span>
                  <h4 className="font-black text-slate-900 text-lg group-hover:text-[#DC2626] transition-colors">
                    {lang === 'BM' ? 'Kontraktor & Perolehan' : 'Contractors & Tenders'}
                  </h4>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {lang === 'BM'
                      ? 'Iklan tender, sebut harga kerja pembinaan/mekanikal/elektrikal, keputusan rasmi dan syarat CIDB/SPKK.'
                      : 'Active tenders, engineering quotation notices, award lists, and CIDB registration guidelines.'}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700 group-hover:text-[#DC2626]">
                  <span>{lang === 'BM' ? 'Buka Portal Kontraktor' : 'Open Contractors'}</span>
                  <i className="fa-solid fa-arrow-right text-[11px] group-hover:translate-x-1 transition-transform"></i>
                </div>
              </div>

              {/* Fallback Gateway 4 */}
              <div
                onClick={() => onNavigateToPage('aduan')}
                className="group bg-white p-6 rounded-3xl border-t-4 border-red-500 border-x border-b border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-red-50 group-hover:bg-red-600 text-red-600 group-hover:text-white flex items-center justify-center text-xl mb-4 transition-colors">
                    <i className="fa-solid fa-road-circle-exclamation"></i>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">
                    Modul 4
                  </span>
                  <h4 className="font-black text-slate-900 text-lg group-hover:text-[#DC2626] transition-colors">
                    {lang === 'BM' ? 'e-Aduan Kerosakan 24 Jam' : '24h Damage e-Complaint'}
                  </h4>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {lang === 'BM'
                      ? 'Borang laporan pothole dengan GPS masa nyata, muat naik foto kerosakan, dan semakan tiket rujukan.'
                      : 'Fast road pothole reports with live GPS, photo upload, and instant status tracker.'}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700 group-hover:text-[#DC2626]">
                  <span>{lang === 'BM' ? 'Buka Halaman e-Aduan' : 'Open e-Complaint'}</span>
                  <i className="fa-solid fa-arrow-right text-[11px] group-hover:translate-x-1 transition-transform"></i>
                </div>
              </div>

              {/* Fallback Gateway 5 */}
              <div
                onClick={() => onNavigateToPage('muatturun')}
                className="group bg-white p-6 rounded-3xl border-t-4 border-blue-500 border-x border-b border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center text-xl mb-4 transition-colors">
                    <i className="fa-solid fa-folder-open"></i>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">
                    Modul 5
                  </span>
                  <h4 className="font-black text-slate-900 text-lg group-hover:text-[#DC2626] transition-colors">
                    {lang === 'BM' ? 'Pusat Muat Turun Borang' : 'Forms & Downloads'}
                  </h4>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {lang === 'BM'
                      ? 'Borang rasmi permit mengorek jalan & utiliti, latihan industri pelajar, senarai semak bayaran interim, dan pekeliling.'
                      : 'Official trenching permit applications, internship forms, and technical road specifications.'}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700 group-hover:text-[#DC2626]">
                  <span>{lang === 'BM' ? 'Buka Pusat Muat Turun' : 'Open Downloads'}</span>
                  <i className="fa-solid fa-arrow-right text-[11px] group-hover:translate-x-1 transition-transform"></i>
                </div>
              </div>

              {/* Fallback Gateway 6 */}
              <div
                onClick={() => onNavigateToPage('warga')}
                className="group bg-white p-6 rounded-3xl border-t-4 border-emerald-500 border-x border-b border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 group-hover:bg-emerald-600 text-emerald-600 group-hover:text-white flex items-center justify-center text-xl mb-4 transition-colors">
                    <i className="fa-solid fa-users-gear"></i>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">
                    Modul 6
                  </span>
                  <h4 className="font-black text-slate-900 text-lg group-hover:text-[#DC2626] transition-colors">
                    Warga JKRNS
                  </h4>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {lang === 'BM'
                      ? 'Gerbang aplikasi staf: HRMIS 2.0, iSPEKS, SKALA, e-Kursus & CPD BEM, MyJalan, dan My-KJ repositori kejuruteraan.'
                      : 'Official intranet portal for staff: HRMIS, iSPEKS, SKALA project monitoring, and engineering knowledge base.'}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700 group-hover:text-[#DC2626]">
                  <span>{lang === 'BM' ? 'Buka Warga JKRNS' : 'Open Warga JKRNS'}</span>
                  <i className="fa-solid fa-arrow-right text-[11px] group-hover:translate-x-1 transition-transform"></i>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ==================== 4. NOTIS & AMARAN SEMASA ==================== */}
      {(!noticeData || noticeData.active !== false) && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 w-full">
          <div className="bg-gradient-to-r from-red-50 to-amber-50 border-l-4 border-[#DC2626] p-4 rounded-xl shadow-sm flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-[#DC2626] text-white flex-shrink-0">
              <i className="fa-solid fa-triangle-exclamation animate-bounce"></i>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase text-[#DC2626] bg-red-100 px-2 py-0.5 rounded">
                  {lang === 'BM' ? (noticeData?.badge || 'Notis Laluan Semasa') : (noticeData?.badgeEn || noticeData?.badge || 'Active Road Advisory')}
                </span>
                <span className="text-xs text-slate-500">{noticeData?.date || '03 November 2026'}</span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm mt-1">
                {lang === 'BM'
                  ? (noticeData?.title || 'Penutupan Sementara Laluan FT086 (Jalan Jelebu - Pantai KM 14-16)')
                  : (noticeData?.titleEn || noticeData?.title || 'Temporary Closure on Route FT086 (Jelebu - Pantai KM 14-16)')}
              </h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                {lang === 'BM'
                  ? (noticeData?.description || 'Kerja penstabilan cerun dan mitigasi runtuhan tanah sedang aktif dijalankan. Pengguna disarankan menggunakan laluan alternatif melalui Bukit Tangga atau sambungan Lebuhraya Kajang-Seremban (LEKAS).')
                  : (noticeData?.descriptionEn || noticeData?.description || 'Slope stabilization and landslide mitigation works are actively underway. Motorists are advised to utilize alternative detours via Bukit Tangga or the LEKAS Highway.')}
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                onOpenModal(
                  noticeData?.detourTitle || (lang === 'BM' ? 'Pelan Lencongan Laluan FT086' : 'Detour Plan Route FT086'),
                  noticeData?.detourDetails || (lang === 'BM'
                    ? 'Jadual Kerja Penstabilan Cerun:\nTarikh Mula: 1 November 2026\nTarikh Jangka Siap: 15 November 2026\nLaluan Alternatif 1: N30 Jalan Bukit Tangga\nLaluan Alternatif 2: E21 Lebuhraya LEKAS susur keluar Mantin.'
                    : 'Slope Stabilization Schedule:\nStart Date: 1 Nov 2026\nEstimated Completion: 15 Nov 2026\nAlternative 1: N30 Jalan Bukit Tangga\nAlternative 2: E21 LEKAS Highway exit Mantin.')
                )
              }
              className="hidden sm:flex text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 px-3 py-1.5 rounded-lg items-center gap-1.5 transition-colors self-center whitespace-nowrap cursor-pointer"
            >
              <i className="fa-solid fa-map-signs text-amber-600"></i>
              <span>{lang === 'BM' ? 'Lihat Lencongan' : 'View Detour'}</span>
            </button>
          </div>
        </section>
      )}

      {/* ==================== 5. KATEGORI PENGGUNA (ORANG AWAM, KONTRAKTOR, AGENSI) ==================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 w-full">
        <div className="text-center max-w-xl mx-auto mb-6">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            {lang === 'BM' ? 'Panduan Khusus Mengikut Kategori' : 'User Categories'}
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
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(audienceTabs?.awamCards && audienceTabs.awamCards.length > 0
                ? audienceTabs.awamCards
                : [
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
                  ]
              ).map((card) => (
                <div key={card.id} className="space-y-2">
                  <div className={`w-10 h-10 rounded-lg ${card.iconBg || 'bg-red-100'} ${card.iconColor || 'text-[#DC2626]'} flex items-center justify-center font-bold`}>
                    <i className={`fa-solid ${card.icon || 'fa-circle-info'}`}></i>
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">{card.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {card.description}
                  </p>
                  <button
                    type="button"
                    onClick={() => onNavigateToPage((card.targetPage as PageId) || 'aduan')}
                    className="text-xs font-bold text-[#DC2626] hover:underline flex items-center gap-1 cursor-pointer pt-1"
                  >
                    <span>{card.actionText}</span>
                    <i className="fa-solid fa-arrow-right text-[10px]"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content: Kontraktor */}
        {activeCategoryTab === 'kontraktor' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(audienceTabs?.kontraktorCards && audienceTabs.kontraktorCards.length > 0
                ? audienceTabs.kontraktorCards
                : [
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
                  ]
              ).map((card) => (
                <div key={card.id} className="space-y-2">
                  <div className={`w-10 h-10 rounded-lg ${card.iconBg || 'bg-amber-100'} ${card.iconColor || 'text-amber-800'} flex items-center justify-center font-bold`}>
                    <i className={`fa-solid ${card.icon || 'fa-gavel'}`}></i>
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">{card.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {card.description}
                  </p>
                  <button
                    type="button"
                    onClick={() => onNavigateToPage((card.targetPage as PageId) || 'kontraktor')}
                    className="text-xs font-bold text-amber-800 hover:underline flex items-center gap-1 cursor-pointer pt-1"
                  >
                    <span>{card.actionText}</span>
                    <i className="fa-solid fa-arrow-right text-[10px]"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content: Agensi */}
        {activeCategoryTab === 'agensi' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(audienceTabs?.agensiCards && audienceTabs.agensiCards.length > 0
                ? audienceTabs.agensiCards
                : [
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
              ).map((card) => (
                <div key={card.id} className="space-y-2">
                  <div className={`w-10 h-10 rounded-lg ${card.iconBg || 'bg-slate-100'} ${card.iconColor || 'text-slate-800'} flex items-center justify-center font-bold`}>
                    <i className={`fa-solid ${card.icon || 'fa-compass-drafting'}`}></i>
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">{card.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {card.description}
                  </p>
                  <button
                    type="button"
                    onClick={() => onNavigateToPage((card.targetPage as PageId) || 'bahagian')}
                    className="text-xs font-bold text-slate-800 hover:underline flex items-center gap-1 cursor-pointer pt-1"
                  >
                    <span>{card.actionText}</span>
                    <i className="fa-solid fa-arrow-right text-[10px]"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

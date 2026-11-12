import React from 'react';

/**
 * Path logo rasmi yang dimuat naik
 */
export const JATA_NEGERI_SEMBILAN_SRC =
  '/assets/aistudio/negeri-sembilan-jata-logo-4C151D5592-seeklogo.com_417f8eb4.png';
export const JKR_LOGO_SRC =
  '/assets/aistudio/Logo_JKR-removebg-preview_6c9ec156.png';

/**
 * Jata Rasmi Negeri Sembilan Darul Khusus (Imej Sebenar)
 */
export const JataNegeriSembilan: React.FC<{
  className?: string;
  alt?: string;
}> = ({
  className = 'h-12 w-auto object-contain',
  alt = 'Jata Rasmi Kerajaan Negeri Sembilan Darul Khusus'
}) => (
  <img
    src={JATA_NEGERI_SEMBILAN_SRC}
    alt={alt}
    className={`${className} select-none`}
    loading="eager"
    decoding="async"
    draggable={false}
  />
);

/**
 * Logo Rasmi Jabatan Kerja Raya (JKR) Negeri Sembilan (Imej Sebenar)
 */
export const JkrLogo: React.FC<{
  className?: string;
  alt?: string;
}> = ({
  className = 'h-12 w-auto object-contain',
  alt = 'Logo Rasmi Jabatan Kerja Raya Negeri Sembilan'
}) => (
  <img
    src={JKR_LOGO_SRC}
    alt={alt}
    className={`${className} select-none`}
    loading="eager"
    decoding="async"
    draggable={false}
  />
);


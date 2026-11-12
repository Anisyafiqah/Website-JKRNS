/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import fsPromises from 'fs/promises';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { defaultCmsContent, CMSContent } from './src/data/defaultCmsContent';

export interface CMSAuditEntry {
  id: string;
  action: string;
  section: string;
  user: string;
  timestamp: string;
  details?: string;
}

// ================= DATA STRUCTURES =================
export interface AduanRecord {
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

export interface UserRecord {
  id: string;
  username: string;
  password: string;
  name: string;
  role: 'Admin' | 'Penyelaras Iklan' | 'Super Administrator' | 'Administrator';
  email: string;
  department: string;
  status: 'Aktif' | 'Tidak Aktif';
  createdAt: string;
}

export interface TenderRecord {
  id: string;
  code: string;
  title: string;
  titleEn?: string;
  category: string;
  district: string;
  closingDate: string;
  openingDate?: string;
  cidb: string;
  estimatedCost?: string;
  docPrice?: string;
  siteVisit?: string;
  description?: string;
  documentUrl?: string;
  status: 'menunggu_kelulusan' | 'buka' | 'tutup' | 'keputusan' | 'ditolak';
  statusLabelMs?: string;
  winner?: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewRemarks?: string;
}

// Local cache / persistence directory
const DATA_DIR = path.resolve(__dirname, 'data');
const ADUAN_FILE = path.resolve(DATA_DIR, 'aduan-store.json');
const USERS_FILE = path.resolve(DATA_DIR, 'users-store.json');
const TENDERS_FILE = path.resolve(DATA_DIR, 'tenders-store.json');
const CMS_CONTENT_FILE = path.resolve(DATA_DIR, 'cms-content.json');
const CMS_AUDIT_FILE = path.resolve(DATA_DIR, 'cms-audit.json');
const MEDIA_DIR = path.resolve(DATA_DIR, 'media');

// --- 4. CMS Store ---
async function ensureCmsStore(): Promise<CMSContent> {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      await fsPromises.mkdir(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(MEDIA_DIR)) {
      await fsPromises.mkdir(MEDIA_DIR, { recursive: true });
    }
    if (!fs.existsSync(CMS_CONTENT_FILE)) {
      await fsPromises.writeFile(CMS_CONTENT_FILE, JSON.stringify(defaultCmsContent, null, 2), 'utf-8');
      return defaultCmsContent;
    }
    const raw = await fsPromises.readFile(CMS_CONTENT_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return { ...defaultCmsContent, ...parsed };
  } catch (err) {
    console.error('[CMS Storage Error] Reading CMS store failed:', err);
    return defaultCmsContent;
  }
}

async function writeCmsStore(data: CMSContent): Promise<void> {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      await fsPromises.mkdir(DATA_DIR, { recursive: true });
    }
    await fsPromises.writeFile(CMS_CONTENT_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('[CMS Storage Error] Writing CMS store failed:', err);
  }
}

async function logCmsAudit(action: string, section: string, user: string, details?: string): Promise<void> {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      await fsPromises.mkdir(DATA_DIR, { recursive: true });
    }
    let entries: CMSAuditEntry[] = [];
    if (fs.existsSync(CMS_AUDIT_FILE)) {
      const raw = await fsPromises.readFile(CMS_AUDIT_FILE, 'utf-8');
      entries = JSON.parse(raw);
    }
    const newEntry: CMSAuditEntry = {
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      action,
      section,
      user,
      details,
      timestamp: new Date().toLocaleDateString('ms-MY', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    entries.unshift(newEntry);
    if (entries.length > 100) entries = entries.slice(0, 100);
    await fsPromises.writeFile(CMS_AUDIT_FILE, JSON.stringify(entries, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[CMS Audit Error]', err);
  }
}

// --- 1. Aduan Store ---
async function ensureDataStore(): Promise<AduanRecord[]> {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      await fsPromises.mkdir(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(ADUAN_FILE)) {
      const initial: AduanRecord[] = [
        {
          id: 'JKRNS-2026-881924',
          name: 'Hj. Ismail bin Wahab',
          phone: '019-3214567',
          district: 'Seremban',
          category: 'Jalan Berlubang (Pothole)',
          gps: '2.6922° N, 101.9056° E',
          description: 'Pothole sedalam 4 inci berhampiran persimpangan Rahang Baru.',
          timestamp: '02 Nov 2026, 09:15 AM',
          status: 'Tindakan Pembaikan',
          storedInCloudflare: false,
          cloudflareProvider: 'Local Secured Vault'
        }
      ];
      await fsPromises.writeFile(ADUAN_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const content = await fsPromises.readFile(ADUAN_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('[Storage Error] Failed reading local aduan store:', err);
    return [];
  }
}

async function writeDataStore(records: AduanRecord[]): Promise<void> {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      await fsPromises.mkdir(DATA_DIR, { recursive: true });
    }
    await fsPromises.writeFile(ADUAN_FILE, JSON.stringify(records, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Storage Error] Failed writing local aduan store:', err);
  }
}

// --- 2. Users Store ---
async function ensureUsersStore(): Promise<UserRecord[]> {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      await fsPromises.mkdir(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(USERS_FILE)) {
      const initial: UserRecord[] = [
        {
          id: 'user-admin-1',
          username: 'admin',
          password: '123',
          name: 'Pentadbir Utama JKR NS',
          role: 'Admin',
          email: 'admin.jkr@ns.gov.my',
          department: 'Bahagian Pentadbiran & Integriti JKR NS',
          status: 'Aktif',
          createdAt: '01 Nov 2026'
        },
        {
          id: 'user-penyelaras-1',
          username: 'penyelaras',
          password: '123',
          name: 'Penyelaras Perolehan & Tender JKR',
          role: 'Penyelaras Iklan',
          email: 'penyelaras.tender@ns.gov.my',
          department: 'Unit Perolehan & Kontrak JKR NS',
          status: 'Aktif',
          createdAt: '01 Nov 2026'
        }
      ];
      await fsPromises.writeFile(USERS_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const content = await fsPromises.readFile(USERS_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('[Storage Error] Failed reading users store:', err);
    return [];
  }
}

async function writeUsersStore(records: UserRecord[]): Promise<void> {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      await fsPromises.mkdir(DATA_DIR, { recursive: true });
    }
    await fsPromises.writeFile(USERS_FILE, JSON.stringify(records, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Storage Error] Failed writing users store:', err);
  }
}

// --- 3. Tenders Store ---
async function ensureTendersStore(): Promise<TenderRecord[]> {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      await fsPromises.mkdir(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(TENDERS_FILE)) {
      const initial: TenderRecord[] = [
        {
          id: 't-1',
          code: 'JKR/NS/JALAN/04/2026',
          title: 'Kerja-kerja Memperelok dan Menurap Semula Laluan FT001 (Seremban - Rembau)',
          titleEn: 'Road Rehabilitation and Resurfacing Works on Route FT001 (Seremban - Rembau)',
          category: 'Kerja Jalan & Turapan',
          district: 'Rembau',
          closingDate: '28 November 2026',
          openingDate: '28 Oktober 2026',
          cidb: 'CIDB G4 / G5 (CE21)',
          estimatedCost: 'RM 1,250,000.00',
          docPrice: 'RM 100.00',
          siteVisit: 'Wajib (10 Nov 2026, 10:00 AM di JKR Rembau)',
          status: 'buka',
          statusLabelMs: 'Sedang Dibuka',
          createdBy: 'admin',
          createdByName: 'Pentadbir Utama JKR NS',
          createdAt: '28 Okt 2026',
          reviewedBy: 'admin',
          reviewedAt: '28 Okt 2026',
          reviewRemarks: 'Diluluskan untuk siaran portal rasmi.'
        },
        {
          id: 't-2',
          code: 'JKR/NS/JAMB/09/2026',
          title: 'Penyelenggaraan Struktur Jambatan Sungai Linggi di Laluan N12 (Port Dickson)',
          titleEn: 'Structural Bridge Maintenance of Sungai Linggi Bridge on Route N12 (Port Dickson)',
          category: 'Kejuruteraan Jambatan',
          district: 'Port Dickson',
          closingDate: '18 November 2026',
          openingDate: '20 Oktober 2026',
          cidb: 'CIDB G3 (CE02)',
          estimatedCost: 'RM 480,000.00',
          docPrice: 'RM 50.00',
          siteVisit: 'Pilihan',
          status: 'buka',
          statusLabelMs: 'Sedang Dibuka',
          createdBy: 'admin',
          createdByName: 'Pentadbir Utama JKR NS',
          createdAt: '20 Okt 2026',
          reviewedBy: 'admin',
          reviewedAt: '20 Okt 2026',
          reviewRemarks: 'Spesifikasi jambatan lengkap.'
        },
        {
          id: 't-3',
          code: 'JKR/NS/BGN/01/2026',
          title: 'Membina Dewan Serbaguna Berkonsep Minangkabau di Kuala Pilah',
          titleEn: 'Construction of Minangkabau Architectural Concept Multipurpose Hall in Kuala Pilah',
          category: 'Bangunan Awam',
          district: 'Kuala Pilah',
          closingDate: '24 Oktober 2026',
          openingDate: '24 September 2026',
          cidb: 'CIDB G5 / G6 (B04)',
          status: 'tutup',
          statusLabelMs: 'Telah Ditutup (Penilaian)',
          createdBy: 'penyelaras',
          createdByName: 'Penyelaras Perolehan JKR NS',
          createdAt: '24 Sep 2026',
          reviewedBy: 'admin',
          reviewedAt: '25 Sep 2026',
          reviewRemarks: 'Diluluskan. Kini dalam peringkat penilaian teknikal tender.'
        },
        {
          id: 't-4',
          code: 'JKR/NS/ELK/02/2026',
          title: 'Pemasangan Lampu Jalan Solar Pintar Sepanjang Laluan Persekutuan Jempol',
          titleEn: 'Installation of Smart Solar Street Lights along Federal Route Jempol',
          category: 'Elektrikal',
          district: 'Jempol',
          closingDate: '15 Oktober 2026',
          openingDate: '15 September 2026',
          cidb: 'CIDB G3 / G4 (E11)',
          status: 'keputusan',
          statusLabelMs: 'Keputusan Rasmi',
          winner: 'Wawasan Elektrik NS Sdn Bhd',
          createdBy: 'penyelaras',
          createdByName: 'Penyelaras Perolehan JKR NS',
          createdAt: '15 Sep 2026',
          reviewedBy: 'admin',
          reviewedAt: '16 Sep 2026',
          reviewRemarks: 'Keputusan telah disahkan.'
        },
        {
          id: 't-5',
          code: 'JKR/NS/CERUN/11/2026',
          title: 'Kerja Pembaikan Runtuhan Cerun Laluan FT086 (Jelebu - Pantai KM 14-16)',
          titleEn: 'Slope Failure Remediation Works on Route FT086 (Jelebu - Pantai KM 14-16)',
          category: 'Kejuruteraan Cerun & Geoteknik',
          district: 'Jelebu',
          closingDate: '12 Disember 2026',
          openingDate: '02 November 2026',
          cidb: 'CIDB G4 (CE08 / CE12)',
          estimatedCost: 'RM 890,000.00',
          docPrice: 'RM 80.00',
          siteVisit: 'Wajib (15 Nov 2026 di tapak projek)',
          description: 'Kerja-kerja menstabilkan cerun kritikal, pemasangan soil nailing, dan sistem perparitan cerun konkrit bertetulang.',
          status: 'menunggu_kelulusan',
          statusLabelMs: 'Menunggu Kelulusan Admin',
          createdBy: 'penyelaras',
          createdByName: 'Penyelaras Perolehan & Tender JKR',
          createdAt: '02 Nov 2026'
        }
      ];
      await fsPromises.writeFile(TENDERS_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const content = await fsPromises.readFile(TENDERS_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('[Storage Error] Failed reading tenders store:', err);
    return [];
  }
}

async function writeTendersStore(records: TenderRecord[]): Promise<void> {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      await fsPromises.mkdir(DATA_DIR, { recursive: true });
    }
    await fsPromises.writeFile(TENDERS_FILE, JSON.stringify(records, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Storage Error] Failed writing tenders store:', err);
  }
}

// ================= CLOUDFLARE INTEGRATION HANDLERS =================
interface CloudflareConfig {
  accountId?: string;
  apiToken?: string;
  d1DatabaseId?: string;
  kvNamespaceId?: string;
  workerUrl?: string;
}

function getCloudflareConfig(): CloudflareConfig {
  return {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
    apiToken: process.env.CLOUDFLARE_API_TOKEN,
    d1DatabaseId: process.env.CLOUDFLARE_D1_DATABASE_ID,
    kvNamespaceId: process.env.CLOUDFLARE_KV_NAMESPACE_ID,
    workerUrl: process.env.CLOUDFLARE_WORKER_URL,
  };
}

let d1Initialized = false;

async function ensureCloudflareD1Table(config: CloudflareConfig): Promise<boolean> {
  if (d1Initialized) return true;
  if (!config.accountId || !config.apiToken || !config.d1DatabaseId) return false;

  try {
    const url = `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/d1/database/${config.d1DatabaseId}/query`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sql: `CREATE TABLE IF NOT EXISTS aduan (
          id TEXT PRIMARY KEY,
          name TEXT,
          phone TEXT,
          district TEXT,
          category TEXT,
          gps TEXT,
          description TEXT,
          image TEXT,
          timestamp TEXT,
          status TEXT
        );`
      })
    });

    const json = await res.json() as any;
    if (json.success) {
      d1Initialized = true;
      console.log('[Cloudflare D1] Database table "aduan" verified / created successfully.');
      return true;
    }
    return false;
  } catch (error) {
    console.error('[Cloudflare D1] Table verification failed:', error);
    return false;
  }
}

async function persistToCloudflare(record: AduanRecord): Promise<{ success: boolean; provider: string; error?: string }> {
  const config = getCloudflareConfig();

  if (config.accountId && config.apiToken && config.d1DatabaseId) {
    try {
      await ensureCloudflareD1Table(config);
      const url = `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/d1/database/${config.d1DatabaseId}/query`;
      
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sql: `INSERT OR REPLACE INTO aduan (id, name, phone, district, category, gps, description, image, timestamp, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          params: [
            record.id,
            record.name,
            record.phone,
            record.district,
            record.category,
            record.gps,
            record.description,
            record.image || '',
            record.timestamp,
            record.status
          ]
        })
      });

      const json = await res.json() as any;
      if (json.success) {
        return { success: true, provider: 'Cloudflare D1 Database' };
      }
      return { success: false, provider: 'Cloudflare D1', error: json.errors?.[0]?.message };
    } catch (err: any) {
      return { success: false, provider: 'Cloudflare D1', error: err?.message || String(err) };
    }
  }

  if (config.workerUrl) {
    try {
      const endpoint = config.workerUrl.replace(/\/+$/, '') + '/api/aduan';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record)
      });
      if (res.ok) {
        return { success: true, provider: 'Cloudflare Worker' };
      }
      return { success: false, provider: 'Cloudflare Worker', error: `HTTP ${res.status}` };
    } catch (err: any) {
      return { success: false, provider: 'Cloudflare Worker', error: err?.message };
    }
  }

  if (config.accountId && config.apiToken && config.kvNamespaceId) {
    try {
      const url = `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/storage/kv/namespaces/${config.kvNamespaceId}/values/${record.id}`;
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${config.apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(record)
      });
      const json = await res.json() as any;
      if (json.success) {
        return { success: true, provider: 'Cloudflare KV' };
      }
      return { success: false, provider: 'Cloudflare KV', error: json.errors?.[0]?.message };
    } catch (err: any) {
      return { success: false, provider: 'Cloudflare KV', error: err?.message };
    }
  }

  return {
    success: false,
    provider: 'Local Secured Vault (Pending Cloudflare Connection)',
    error: 'Cloudflare credentials not fully provided'
  };
}

async function fetchFromCloudflare(): Promise<AduanRecord[] | null> {
  const config = getCloudflareConfig();
  if (config.accountId && config.apiToken && config.d1DatabaseId) {
    try {
      const url = `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/d1/database/${config.d1DatabaseId}/query`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sql: `SELECT * FROM aduan ORDER BY timestamp DESC LIMIT 50;`
        })
      });
      const json = await res.json() as any;
      if (json.success && json.result?.[0]?.results) {
        return json.result[0].results.map((row: any) => ({
          ...row,
          storedInCloudflare: true,
          cloudflareProvider: 'Cloudflare D1 Database'
        }));
      }
    } catch (err) {
      console.warn('[Cloudflare D1] Fetch failed, falling back to local store:', err);
    }
  }
  return null;
}

// ================= EXPRESS APPLICATION SETUP =================
async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // Ensure initial data stores
  await ensureDataStore();
  await ensureUsersStore();
  await ensureTendersStore();
  await ensureCmsStore();

  // Static directory for uploaded media files
  app.use('/api/cms/media/files', express.static(MEDIA_DIR));

  // API Status & Health
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'JKR Negeri Sembilan Portal API',
      timestamp: new Date().toISOString()
    });
  });

  // Check Cloudflare Connection Status
  app.get('/api/cloudflare/status', async (req: Request, res: Response) => {
    const config = getCloudflareConfig();
    const hasD1 = Boolean(config.accountId && config.apiToken && config.d1DatabaseId);
    const hasKV = Boolean(config.accountId && config.apiToken && config.kvNamespaceId);
    const hasWorker = Boolean(config.workerUrl);

    let provider = 'Local Secured Vault (Fallback)';
    let connected = false;

    if (hasD1) {
      provider = 'Cloudflare D1 SQL Database';
      connected = true;
    } else if (hasWorker) {
      provider = 'Cloudflare Worker Endpoint';
      connected = true;
    } else if (hasKV) {
      provider = 'Cloudflare KV Namespace';
      connected = true;
    }

    const currentRecords = await ensureDataStore();

    res.json({
      connected,
      provider,
      storageType: hasD1 ? 'D1' : hasWorker ? 'Worker' : hasKV ? 'KV' : 'Local',
      config: {
        hasAccountId: Boolean(config.accountId),
        hasApiToken: Boolean(config.apiToken),
        hasD1DatabaseId: Boolean(config.d1DatabaseId),
        hasKvNamespaceId: Boolean(config.kvNamespaceId),
        hasWorkerUrl: Boolean(config.workerUrl)
      },
      totalRecords: currentRecords.length,
      instruction: connected
        ? `Tersambung ke ${provider}. Semua aduan baru disimpan ke Cloudflare.`
        : 'Sedia menyambung ke Cloudflare. Masukkan CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN, dan CLOUDFLARE_D1_DATABASE_ID pada environment secrets untuk auto-sync.'
    });
  });

  // ================= AUTHENTICATION & ROLE-BASED LOGIN =================
  // POST /api/auth/login - Role-based login (Admin & Penyelaras Iklan)
  app.post('/api/auth/login', async (req: Request, res: Response) => {
    try {
      const { username, password, requestedRole } = req.body;
      const users = await ensureUsersStore();

      const user = users.find(
        (u) =>
          u.username.toLowerCase() === String(username).toLowerCase().trim() &&
          u.password === String(password).trim()
      );

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Nama pengguna atau kata laluan tidak sah.'
        });
      }

      if (user.status !== 'Aktif') {
        return res.status(403).json({
          success: false,
          error: 'Akaun anda telah dinyahaktifkan. Sila hubungi Pentadbir Sistem.'
        });
      }

      // Check role verification if user selected specific checkbox
      if (requestedRole && requestedRole !== user.role) {
        return res.status(403).json({
          success: false,
          error: `Akaun ini didaftarkan sebagai "${user.role}", bukan "${requestedRole}". Sila tandakan peranan yang betul.`
        });
      }

      const token = `jkr-ns-token-${user.role.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;

      res.json({
        success: true,
        message: `Log masuk berjaya sebagai ${user.role}`,
        token,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          role: user.role,
          email: user.email,
          department: user.department
        }
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  // POST /api/auth/register - Register new staff / admin / penyelaras account
  app.post('/api/auth/register', async (req: Request, res: Response) => {
    try {
      const rawUsername = req.body.username || req.body.namaPengguna;
      const rawPassword = req.body.password || req.body.kataLaluan;
      const rawName = req.body.name || req.body.nama || req.body.namaPenuh;
      const rawRole = req.body.role || req.body.peranan || 'Penyelaras Iklan';
      const rawEmail = req.body.email || req.body.emel;
      const rawDept = req.body.department || req.body.jabatan || req.body.bahagian;

      if (!rawUsername || !rawPassword || !rawName) {
        return res.status(400).json({
          success: false,
          error: 'Sila lengkapkan Nama Penuh, Nama Pengguna (Username) dan Kata Laluan.'
        });
      }

      const cleanUsername = String(rawUsername).trim().toLowerCase();
      const cleanPassword = String(rawPassword).trim();
      const cleanName = String(rawName).trim();

      if (cleanUsername.length < 3) {
        return res.status(400).json({
          success: false,
          error: 'Nama pengguna mestilah sekurang-kurangnya 3 aksara.'
        });
      }

      if (cleanPassword.length < 3) {
        return res.status(400).json({
          success: false,
          error: 'Kata laluan mestilah sekurang-kurangnya 3 aksara.'
        });
      }

      const targetRole: 'Admin' | 'Penyelaras Iklan' =
        rawRole === 'Admin' || String(rawRole).toLowerCase().includes('admin')
          ? 'Admin'
          : 'Penyelaras Iklan';

      const users = await ensureUsersStore();
      const exists = users.find((u) => u.username.toLowerCase() === cleanUsername);
      if (exists) {
        return res.status(400).json({
          success: false,
          error: `Nama pengguna "${cleanUsername}" telah wujud dalam sistem. Sila pilih nama pengguna lain.`
        });
      }

      const defaultDept =
        targetRole === 'Admin'
          ? 'Bahagian Pentadbiran & Integriti JKR NS'
          : 'Unit Perolehan & Kontrak JKR NS';

      const newUser: UserRecord = {
        id: `user-${Date.now()}`,
        username: cleanUsername,
        password: cleanPassword,
        name: cleanName,
        role: targetRole,
        email: rawEmail ? String(rawEmail).trim() : `${cleanUsername}@jkr.gov.my`,
        department: rawDept ? String(rawDept).trim() : defaultDept,
        status: 'Aktif',
        createdAt: new Date().toLocaleDateString('ms-MY', { day: '2-digit', month: 'short', year: 'numeric' })
      };

      users.push(newUser);
      await writeUsersStore(users);

      const token = `jkr-ns-token-${newUser.role.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
      const { password: _, ...sanitized } = newUser;

      res.status(201).json({
        success: true,
        message: `Pendaftaran berjaya! Akaun "${newUser.name}" telah didaftarkan sebagai ${newUser.role}.`,
        token,
        user: sanitized,
        data: sanitized
      });
    } catch (err: any) {
      console.error('[Registration Error]', err);
      res.status(500).json({ success: false, error: err?.message || 'Ralat semasa mendaftar akaun baharu.' });
    }
  });

  // Backward compatible route: POST /api/admin/login
  app.post('/api/admin/login', async (req: Request, res: Response) => {
    const { username, password, role } = req.body;
    const users = await ensureUsersStore();
    const user = users.find(
      (u) =>
        u.username.toLowerCase() === String(username).toLowerCase().trim() &&
        u.password === String(password).trim()
    );

    if (user) {
      res.json({
        success: true,
        message: 'Log masuk berjaya',
        token: 'jkr-ns-admin-session-token-2026',
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          role: user.role,
          email: user.email,
          department: user.department
        }
      });
    } else {
      res.status(401).json({
        success: false,
        error: 'Nama pengguna atau kata laluan salah.'
      });
    }
  });

  // ================= USER & ROLE MANAGEMENT (ADMIN ONLY) =================
  // GET /api/users - List all users
  app.get('/api/users', async (req: Request, res: Response) => {
    try {
      const users = await ensureUsersStore();
      // Remove passwords from returned objects
      const sanitized = users.map(({ password, ...rest }) => rest);
      res.json({ success: true, data: sanitized });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  // POST /api/users - Create new user (Admin / Penyelaras Iklan)
  app.post('/api/users', async (req: Request, res: Response) => {
    try {
      const rawUsername = req.body.username || req.body.namaPengguna;
      const rawPassword = req.body.password || req.body.kataLaluan;
      const rawName = req.body.name || req.body.nama || req.body.namaPenuh;
      const rawRole = req.body.role || req.body.peranan || 'Penyelaras Iklan';
      const rawEmail = req.body.email || req.body.emel;
      const rawDept = req.body.department || req.body.jabatan || req.body.bahagian;

      if (!rawUsername || !rawPassword || !rawName) {
        return res.status(400).json({
          success: false,
          error: 'Nama Penuh, Nama Pengguna (Username), dan Kata Laluan mesti diisi.'
        });
      }

      const cleanUsername = String(rawUsername).trim().toLowerCase();
      const cleanPassword = String(rawPassword).trim();
      const cleanName = String(rawName).trim();
      const targetRole: 'Admin' | 'Penyelaras Iklan' =
        rawRole === 'Admin' || String(rawRole).toLowerCase().includes('admin')
          ? 'Admin'
          : 'Penyelaras Iklan';

      const users = await ensureUsersStore();
      const exists = users.find((u) => u.username.toLowerCase() === cleanUsername);
      if (exists) {
        return res.status(400).json({
          success: false,
          error: `Nama pengguna "${cleanUsername}" telah digunakan. Sila pilih nama pengguna lain.`
        });
      }

      const defaultDept =
        targetRole === 'Admin'
          ? 'Bahagian Pentadbiran & Integriti JKR NS'
          : 'Unit Perolehan & Kontrak JKR NS';

      const newUser: UserRecord = {
        id: `user-${Date.now()}`,
        username: cleanUsername,
        password: cleanPassword,
        name: cleanName,
        role: targetRole,
        email: rawEmail ? String(rawEmail).trim() : `${cleanUsername}@jkr.gov.my`,
        department: rawDept ? String(rawDept).trim() : defaultDept,
        status: 'Aktif',
        createdAt: new Date().toLocaleDateString('ms-MY', { day: '2-digit', month: 'short', year: 'numeric' })
      };

      users.push(newUser);
      await writeUsersStore(users);

      const { password: _, ...sanitized } = newUser;
      res.status(201).json({
        success: true,
        message: `Pengguna baharu "${newUser.name}" dengan peranan "${newUser.role}" telah berjaya didaftarkan.`,
        data: sanitized,
        user: sanitized
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  // PUT /api/users/:id - Edit user & role
  app.put('/api/users/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, role, email, department, status, password } = req.body;
      const users = await ensureUsersStore();

      const idx = users.findIndex((u) => u.id === id);
      if (idx === -1) {
        return res.status(404).json({ success: false, error: 'Pengguna tidak ditemui.' });
      }

      if (name) users[idx].name = String(name).trim();
      if (role && (role === 'Admin' || role === 'Penyelaras Iklan')) {
        users[idx].role = role;
      }
      if (email) users[idx].email = String(email).trim();
      if (department) users[idx].department = String(department).trim();
      if (status && (status === 'Aktif' || status === 'Tidak Aktif')) {
        users[idx].status = status;
      }
      if (password && String(password).trim()) {
        users[idx].password = String(password).trim();
      }

      await writeUsersStore(users);
      const { password: _, ...sanitized } = users[idx];
      res.json({
        success: true,
        message: `Maklumat pengguna "${sanitized.name}" telah dikemaskini.`,
        data: sanitized
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  // DELETE /api/users/:id - Delete user
  app.delete('/api/users/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const users = await ensureUsersStore();

      // Don't delete last admin
      const target = users.find((u) => u.id === id);
      if (!target) {
        return res.status(404).json({ success: false, error: 'Pengguna tidak ditemui.' });
      }

      if (target.username === 'admin') {
        const adminCount = users.filter((u) => u.role === 'Admin').length;
        if (adminCount <= 1) {
          return res.status(400).json({
            success: false,
            error: 'Tidak boleh memadamkan akaun pentadbir utama tunggal.'
          });
        }
      }

      const updated = users.filter((u) => u.id !== id);
      await writeUsersStore(updated);
      res.json({ success: true, message: `Pengguna "${target.name}" telah dipadamkan.` });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  // ================= TENDER & ADVERTISEMENT MODULE =================
  // GET /api/tenders - List tenders (public vs all)
  app.get('/api/tenders', async (req: Request, res: Response) => {
    try {
      const tenders = await ensureTendersStore();
      const showAll = req.query.all === 'true';

      if (showAll) {
        return res.json({ success: true, data: tenders });
      }

      // Public only gets approved tenders
      const publicTenders = tenders.filter(
        (t) => t.status === 'buka' || t.status === 'tutup' || t.status === 'keputusan'
      );
      res.json({ success: true, data: publicTenders });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  // POST /api/tenders - Penyelaras Iklan register new tender/quotation
  app.post('/api/tenders', async (req: Request, res: Response) => {
    try {
      const {
        code,
        title,
        titleEn,
        category,
        district,
        closingDate,
        openingDate,
        cidb,
        estimatedCost,
        docPrice,
        siteVisit,
        description,
        createdBy,
        createdByName
      } = req.body;

      if (!code || !title || !district || !closingDate || !cidb) {
        return res.status(400).json({
          success: false,
          error: 'No. Rujukan Tender, Tajuk, Daerah, Tarikh Tutup dan Gred CIDB wajib diisi.'
        });
      }

      const tenders = await ensureTendersStore();
      const newTender: TenderRecord = {
        id: `t-${Date.now()}`,
        code: String(code).trim(),
        title: String(title).trim(),
        titleEn: titleEn ? String(titleEn).trim() : undefined,
        category: category ? String(category).trim() : 'Kerja Awam & Infrastruktur',
        district: String(district).trim(),
        closingDate: String(closingDate).trim(),
        openingDate: openingDate ? String(openingDate).trim() : new Date().toLocaleDateString('ms-MY'),
        cidb: String(cidb).trim(),
        estimatedCost: estimatedCost ? String(estimatedCost).trim() : undefined,
        docPrice: docPrice ? String(docPrice).trim() : 'Percuma / Dimuat Turun',
        siteVisit: siteVisit ? String(siteVisit).trim() : 'Tiada Lawatan Tapak',
        description: description ? String(description).trim() : undefined,
        // Status sentiasa 'menunggu_kelulusan' supaya Admin semak dahulu
        status: 'menunggu_kelulusan',
        statusLabelMs: 'Menunggu Kelulusan Admin',
        createdBy: createdBy || 'penyelaras',
        createdByName: createdByName || 'Penyelaras Iklan JKR NS',
        createdAt: new Date().toLocaleDateString('ms-MY', { day: '2-digit', month: 'short', year: 'numeric' })
      };

      tenders.unshift(newTender);
      await writeTendersStore(tenders);

      res.status(201).json({
        success: true,
        message: 'Iklan tender baharu telah dihantar dan sedang menunggu semakan & kelulusan Admin.',
        data: newTender
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  // PATCH /api/tenders/:id/status - Admin reviews and updates tender status
  app.patch('/api/tenders/:id/status', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status, reviewRemarks, reviewedBy, winner } = req.body;

      const validStatuses = ['menunggu_kelulusan', 'buka', 'tutup', 'keputusan', 'ditolak'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, error: 'Status iklan tender tidak sah.' });
      }

      const tenders = await ensureTendersStore();
      const idx = tenders.findIndex((t) => t.id === id);
      if (idx === -1) {
        return res.status(404).json({ success: false, error: 'Iklan tender tidak dijumpai.' });
      }

      tenders[idx].status = status as any;
      if (status === 'buka') tenders[idx].statusLabelMs = 'Sedang Dibuka';
      if (status === 'tutup') tenders[idx].statusLabelMs = 'Telah Ditutup (Penilaian)';
      if (status === 'keputusan') tenders[idx].statusLabelMs = 'Keputusan Rasmi';
      if (status === 'ditolak') tenders[idx].statusLabelMs = 'Ditolak / Pindaan Diperlukan';
      if (status === 'menunggu_kelulusan') tenders[idx].statusLabelMs = 'Menunggu Kelulusan Admin';

      if (reviewRemarks !== undefined) tenders[idx].reviewRemarks = String(reviewRemarks);
      if (reviewedBy) tenders[idx].reviewedBy = String(reviewedBy);
      if (winner) tenders[idx].winner = String(winner);
      tenders[idx].reviewedAt = new Date().toLocaleDateString('ms-MY', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      await writeTendersStore(tenders);

      res.json({
        success: true,
        message: `Status iklan ${tenders[idx].code} telah ditukar kepada "${tenders[idx].statusLabelMs}".`,
        data: tenders[idx]
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  // DELETE /api/tenders/:id - Admin / Penyelaras delete tender
  app.delete('/api/tenders/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const tenders = await ensureTendersStore();
      const target = tenders.find((t) => t.id === id);
      if (!target) {
        return res.status(404).json({ success: false, error: 'Iklan tender tidak dijumpai.' });
      }

      const updated = tenders.filter((t) => t.id !== id);
      await writeTendersStore(updated);
      res.json({ success: true, message: `Iklan ${target.code} telah dipadamkan.` });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  // ================= E-ADUAN MODULE ENDPOINTS =================
  // GET /api/aduan - List all complaints
  app.get('/api/aduan', async (req: Request, res: Response) => {
    try {
      const localRecords = await ensureDataStore();
      const cfRecords = await fetchFromCloudflare();

      let combined: AduanRecord[] = [...localRecords];

      if (cfRecords && Array.isArray(cfRecords) && cfRecords.length > 0) {
        // Merge cloudflare records that aren't already present locally
        const existingIds = new Set(localRecords.map((r) => r.id));
        for (const cfItem of cfRecords) {
          if (!existingIds.has(cfItem.id)) {
            combined.push(cfItem);
          }
        }
      }

      res.json({
        success: true,
        source: cfRecords && cfRecords.length > 0 ? 'hybrid_cloudflare_local' : 'local',
        data: combined
      });
    } catch (err: any) {
      console.error('[GET /api/aduan Error]', err);
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  // GET /api/aduan/:id - Get single complaint by ID
  app.get('/api/aduan/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const records = await ensureDataStore();
      const found = records.find((r) => r.id.toUpperCase() === id.toUpperCase());

      if (!found) {
        return res.status(404).json({ success: false, message: 'Tiket aduan tidak dijumpai' });
      }

      res.json({ success: true, data: found });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  // POST /api/aduan - Create new complaint and store into Cloudflare + Local Store
  app.post('/api/aduan', async (req: Request, res: Response) => {
    try {
      // Support both English and Bahasa Melayu field keys seamlessly
      const rawName = req.body.name || req.body.nama || req.body.namaPenuh;
      const rawPhone = req.body.phone || req.body.telefon || req.body.noTelefon;
      const rawDistrict = req.body.district || req.body.daerah || 'Seremban';
      const rawCategory = req.body.category || req.body.kategori || 'Jalan Berlubang (Pothole)';
      const rawGps = req.body.gps || req.body.koordinat || '2.6922° N, 101.9056° E';
      const rawDescription = req.body.description || req.body.keterangan || req.body.aduan || '';
      const rawImage = req.body.image || req.body.gambar || req.body.foto;

      if (!rawName || !rawPhone || !rawDescription) {
        return res.status(400).json({
          success: false,
          error: 'Sila lengkapkan Nama Penuh, Nombor Telefon, dan Keterangan Aduan (*).'
        });
      }

      const year = new Date().getFullYear();
      const randomTicket = Math.floor(100000 + Math.random() * 900000);
      const ticketId = `JKRNS-${year}-${randomTicket}`;

      const timestamp = new Date().toLocaleDateString('ms-MY', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const newRecord: AduanRecord = {
        id: ticketId,
        name: String(rawName).trim(),
        phone: String(rawPhone).trim(),
        district: String(rawDistrict).trim(),
        category: String(rawCategory).trim(),
        gps: String(rawGps).trim(),
        description: String(rawDescription).trim(),
        image: rawImage || undefined,
        timestamp,
        status: 'Diterima'
      };

      // 1. Persist to Cloudflare (D1 / Worker / KV)
      const cfResult = await persistToCloudflare(newRecord);
      newRecord.storedInCloudflare = cfResult.success;
      newRecord.cloudflareProvider = cfResult.provider;

      // 2. Always persist locally as well so data is never lost
      const currentList = await ensureDataStore();
      const updatedList = [newRecord, ...currentList.filter((item) => item.id !== newRecord.id)];
      await writeDataStore(updatedList);

      res.status(201).json({
        success: true,
        message: 'Aduan berjaya didaftarkan ke sistem JKR NS.',
        ticketId: newRecord.id,
        record: newRecord,
        data: newRecord,
        cloudflare: {
          synced: cfResult.success,
          provider: cfResult.provider,
          error: cfResult.error || null
        }
      });
    } catch (err: any) {
      console.error('[Aduan Submit Error]', err);
      res.status(500).json({ success: false, error: err?.message || 'Ralat pelayan memproses aduan' });
    }
  });

  // PATCH /api/aduan/:id/status - Update complaint status
  app.patch('/api/aduan/:id/status', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = ['Diterima', 'Dalam Siasatan', 'Tindakan Pembaikan', 'Selesai'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, error: 'Status tidak sah' });
      }

      const records = await ensureDataStore();
      const idx = records.findIndex((r) => r.id.toUpperCase() === id.toUpperCase());
      if (idx === -1) {
        return res.status(404).json({ success: false, error: 'Tiket tidak ditemui' });
      }

      records[idx].status = status as any;
      await writeDataStore(records);

      // Also update in Cloudflare if configured
      await persistToCloudflare(records[idx]);

      res.json({ success: true, message: 'Status tiket dikemaskini', record: records[idx] });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  // DELETE /api/aduan/:id - Delete complaint
  app.delete('/api/aduan/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const records = await ensureDataStore();
      const updated = records.filter((r) => r.id.toUpperCase() !== id.toUpperCase());
      if (updated.length === records.length) {
        return res.status(404).json({ success: false, error: 'Aduan tidak dijumpai' });
      }
      await writeDataStore(updated);
      res.json({ success: true, message: `Aduan ${id} telah berjaya dipadamkan.` });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  // ================= CONTENT MANAGEMENT SYSTEM (CMS) ENDPOINTS =================
  
  // 1. GET /api/cms/content - Fetch full CMS content
  app.get('/api/cms/content', async (req: Request, res: Response) => {
    try {
      const content = await ensureCmsStore();
      const mode = req.query.mode as string | undefined;

      // If public mode, filter out drafts from sliders if requested
      if (mode === 'public') {
        const publicHeroSlides = (content.homeHeroSlides || []).filter((s) => s.status !== 'draft');
        const publicGateways = (content.homeGateways || []).filter((g) => g.status !== 'draft');
        return res.json({
          success: true,
          data: {
            ...content,
            homeHeroSlides: publicHeroSlides.length > 0 ? publicHeroSlides : content.homeHeroSlides,
            homeGateways: publicGateways.length > 0 ? publicGateways : content.homeGateways
          }
        });
      }

      res.json({ success: true, data: content });
    } catch (err: any) {
      console.error('[GET /api/cms/content Error]', err);
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  // 2. PUT /api/cms/content - Full content update
  app.put('/api/cms/content', async (req: Request, res: Response) => {
    try {
      const incoming = req.body.content || req.body;
      const user = req.body.user || 'Pentadbir CMS';

      if (!incoming || typeof incoming !== 'object') {
        return res.status(400).json({ success: false, error: 'Data kandungan tidak sah.' });
      }

      const current = await ensureCmsStore();
      const merged = { ...current, ...incoming };
      await writeCmsStore(merged);
      await logCmsAudit('Kemaskini Penuh', 'Semua Bahagian', user, 'Mengemaskini pangkalan data kandungan CMS portal');

      res.json({
        success: true,
        message: 'Kandungan portal telah berjaya dikemaskini dan disimpan.',
        data: merged
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  // 3. PUT /api/cms/content/:sectionKey - Update specific section (e.g. siteConfig, homeHeroSlides, etc.)
  app.put('/api/cms/content/:sectionKey', async (req: Request, res: Response) => {
    try {
      const { sectionKey } = req.params;
      const sectionData = req.body.data !== undefined ? req.body.data : req.body;
      const user = req.body.user || 'Pentadbir CMS';

      const current = await ensureCmsStore();
      if (!(sectionKey in current)) {
        return res.status(400).json({
          success: false,
          error: `Bahagian "${sectionKey}" tidak ditemui dalam skema CMS.`
        });
      }

      (current as any)[sectionKey] = sectionData;
      await writeCmsStore(current);
      await logCmsAudit('Kemaskini Bahagian', sectionKey, user, `Menyimpan perubahan untuk seksyen ${sectionKey}`);

      res.json({
        success: true,
        message: `Bahagian "${sectionKey}" telah berjaya dikemaskini.`,
        data: (current as any)[sectionKey]
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  // 4. POST /api/cms/content/:sectionKey/items - Add item to list section
  app.post('/api/cms/content/:sectionKey/items', async (req: Request, res: Response) => {
    try {
      const { sectionKey } = req.params;
      const { item, user = 'Pentadbir CMS', subPath } = req.body;

      if (!item) {
        return res.status(400).json({ success: false, error: 'Item data diperlukan.' });
      }

      const current = await ensureCmsStore();
      const newItem = {
        id: item.id || `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        ...item
      };

      if (subPath && (current as any)[sectionKey]?.[subPath] && Array.isArray((current as any)[sectionKey][subPath])) {
        (current as any)[sectionKey][subPath].push(newItem);
      } else if (Array.isArray((current as any)[sectionKey])) {
        (current as any)[sectionKey].push(newItem);
      } else {
        return res.status(400).json({ success: false, error: `Bahagian "${sectionKey}" bukan senarai array.` });
      }

      await writeCmsStore(current);
      await logCmsAudit('Tambah Item', `${sectionKey}${subPath ? '.' + subPath : ''}`, user, `Menambah item baharu: ${newItem.title || newItem.name || newItem.id}`);

      res.status(201).json({
        success: true,
        message: 'Item baharu berjaya ditambah.',
        data: newItem
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  // 5. PUT /api/cms/content/:sectionKey/items/:itemId - Update item in list section
  app.put('/api/cms/content/:sectionKey/items/:itemId', async (req: Request, res: Response) => {
    try {
      const { sectionKey, itemId } = req.params;
      const { item, user = 'Pentadbir CMS', subPath } = req.body;

      const current = await ensureCmsStore();
      let targetArray: any[] | null = null;

      if (subPath && (current as any)[sectionKey]?.[subPath] && Array.isArray((current as any)[sectionKey][subPath])) {
        targetArray = (current as any)[sectionKey][subPath];
      } else if (Array.isArray((current as any)[sectionKey])) {
        targetArray = (current as any)[sectionKey];
      }

      if (!targetArray) {
        return res.status(400).json({ success: false, error: `Bahagian "${sectionKey}" bukan senarai array.` });
      }

      const idx = targetArray.findIndex((el) => String(el.id) === String(itemId));
      if (idx === -1) {
        return res.status(404).json({ success: false, error: `Item ${itemId} tidak ditemui.` });
      }

      targetArray[idx] = { ...targetArray[idx], ...item, id: itemId };
      await writeCmsStore(current);
      await logCmsAudit('Kemaskini Item', `${sectionKey}${subPath ? '.' + subPath : ''}`, user, `Mengemaskini item ID ${itemId}`);

      res.json({
        success: true,
        message: 'Item berjaya dikemaskini.',
        data: targetArray[idx]
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  // 6. DELETE /api/cms/content/:sectionKey/items/:itemId - Delete item from list section
  app.delete('/api/cms/content/:sectionKey/items/:itemId', async (req: Request, res: Response) => {
    try {
      const { sectionKey, itemId } = req.params;
      const { user = 'Pentadbir CMS', subPath } = req.body || {};

      const current = await ensureCmsStore();
      let targetArray: any[] | null = null;

      if (subPath && (current as any)[sectionKey]?.[subPath] && Array.isArray((current as any)[sectionKey][subPath])) {
        targetArray = (current as any)[sectionKey][subPath];
      } else if (Array.isArray((current as any)[sectionKey])) {
        targetArray = (current as any)[sectionKey];
      }

      if (!targetArray) {
        return res.status(400).json({ success: false, error: `Bahagian "${sectionKey}" bukan senarai array.` });
      }

      const originalLength = targetArray.length;
      const filtered = targetArray.filter((el) => String(el.id) !== String(itemId));

      if (filtered.length === originalLength) {
        return res.status(404).json({ success: false, error: `Item ${itemId} tidak ditemui.` });
      }

      if (subPath) {
        (current as any)[sectionKey][subPath] = filtered;
      } else {
        (current as any)[sectionKey] = filtered;
      }

      await writeCmsStore(current);
      await logCmsAudit('Padam Item', `${sectionKey}${subPath ? '.' + subPath : ''}`, user, `Memadam item ID ${itemId}`);

      res.json({
        success: true,
        message: `Item ${itemId} telah berjaya dipadamkan.`
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  // 7. POST /api/cms/media/upload - Media file & image upload (supports base64 dataUrl)
  app.post('/api/cms/media/upload', async (req: Request, res: Response) => {
    try {
      const { dataUrl, filename, mimeType, description } = req.body;

      if (!dataUrl || !filename) {
        return res.status(400).json({
          success: false,
          error: 'Maklumat fail tidak lengkap (dataUrl dan filename diperlukan).'
        });
      }

      // Check if dataUrl is base64
      const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      const safeName = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
      const uniqueName = `${Date.now()}_${safeName}`;
      const filePath = path.resolve(MEDIA_DIR, uniqueName);

      if (matches && matches.length === 3) {
        const buffer = Buffer.from(matches[2], 'base64');
        await fsPromises.writeFile(filePath, buffer);
      } else {
        // Raw text / svg / url
        await fsPromises.writeFile(filePath, dataUrl, 'utf-8');
      }

      const mediaUrl = `/api/cms/media/files/${uniqueName}`;

      res.status(201).json({
        success: true,
        message: 'Fail media berjaya dimuat naik ke storan pelayan.',
        url: mediaUrl,
        filename: uniqueName,
        originalName: filename,
        dataUrl: dataUrl.length < 500000 ? dataUrl : undefined
      });
    } catch (err: any) {
      console.error('[Media Upload Error]', err);
      res.status(500).json({ success: false, error: err?.message || 'Gagal memuat naik fail media.' });
    }
  });

  // 8. GET /api/cms/media/list - List uploaded media files
  app.get('/api/cms/media/list', async (req: Request, res: Response) => {
    try {
      if (!fs.existsSync(MEDIA_DIR)) {
        await fsPromises.mkdir(MEDIA_DIR, { recursive: true });
        return res.json({ success: true, files: [] });
      }

      const fileNames = await fsPromises.readdir(MEDIA_DIR);
      const filesInfo = await Promise.all(
        fileNames.map(async (name) => {
          const stat = await fsPromises.stat(path.resolve(MEDIA_DIR, name));
          return {
            name,
            url: `/api/cms/media/files/${name}`,
            size: `${(stat.size / 1024).toFixed(1)} KB`,
            updatedAt: stat.mtime.toLocaleDateString('ms-MY')
          };
        })
      );

      res.json({ success: true, files: filesInfo });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  // 9. POST /api/cms/publish - Mark changes as live/published
  app.post('/api/cms/publish', async (req: Request, res: Response) => {
    try {
      const { user = 'Pentadbir CMS', notes } = req.body;
      const current = await ensureCmsStore();

      // Ensure all slides and gateways are marked published
      if (Array.isArray(current.homeHeroSlides)) {
        current.homeHeroSlides.forEach((s) => {
          s.status = 'published';
        });
      }
      if (Array.isArray(current.homeGateways)) {
        current.homeGateways.forEach((g) => {
          g.status = 'published';
        });
      }

      await writeCmsStore(current);
      await logCmsAudit('Penerbitan Rasmi', 'Semua Bahagian', user, notes || 'Menerbitkan semua kandungan portal ke paparan awam');

      res.json({
        success: true,
        message: 'Semua perubahan kandungan telah diterbitkan secara langsung ke portal awam.',
        publishedAt: new Date().toISOString(),
        data: current
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  // 10. POST /api/cms/reset - Reset to factory defaults
  app.post('/api/cms/reset', async (req: Request, res: Response) => {
    try {
      const { user = 'Pentadbir Utama' } = req.body;
      await writeCmsStore(defaultCmsContent);
      await logCmsAudit('Tetapan Semula', 'Sistem Penuh', user, 'Mengembalikan kandungan asal pratetap portal');

      res.json({
        success: true,
        message: 'Kandungan portal telah ditetapkan semula kepada nilai asal pratetap.',
        data: defaultCmsContent
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  // 11. GET /api/cms/audit - Get audit log history
  app.get('/api/cms/audit', async (req: Request, res: Response) => {
    try {
      if (!fs.existsSync(CMS_AUDIT_FILE)) {
        return res.json({ success: true, data: [] });
      }
      const raw = await fsPromises.readFile(CMS_AUDIT_FILE, 'utf-8');
      const list = JSON.parse(raw);
      res.json({ success: true, data: list });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  // 12. POST /api/cms/auth/login - Dedicated CMS Administrator login
  app.post('/api/cms/auth/login', async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          error: 'Sila masukkan Nama Pengguna dan Kata Laluan Pentadbir CMS.'
        });
      }

      const users = await ensureUsersStore();
      const cleanUser = String(username).trim().toLowerCase();
      const cleanPass = String(password).trim();

      const user = users.find(
        (u) => u.username.toLowerCase() === cleanUser && u.password === cleanPass
      );

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Nama pengguna atau kata laluan tidak sah.'
        });
      }

      if (user.status !== 'Aktif') {
        return res.status(403).json({
          success: false,
          error: 'Akaun pentadbir ini telah dinyahaktifkan. Sila hubungi Pegawai Sistem.'
        });
      }

      // Map existing roles to CMS hierarchy:
      // 'admin' username or 'Admin' role => Super Administrator
      // 'Administrator' => Administrator
      // 'Penyelaras Iklan' => can edit Tenders & Content as Administrator
      let cmsRole: 'Super Administrator' | 'Administrator' = 'Administrator';
      if (user.username === 'admin' || user.role === 'Admin' || user.role === 'Super Administrator') {
        cmsRole = 'Super Administrator';
      }

      const sessionToken = `cms-token-${cmsRole.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
      await logCmsAudit('Log Masuk', 'Keselamatan', user.name, `Log masuk CMS berjaya dengan peranan ${cmsRole}`);

      res.json({
        success: true,
        message: `Log masuk CMS berjaya sebagai ${cmsRole}.`,
        token: sessionToken,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          role: cmsRole,
          rawRole: user.role,
          email: user.email,
          department: user.department
        }
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  // 13. POST /api/cms/auth/change-password - Change current admin password
  app.post('/api/cms/auth/change-password', async (req: Request, res: Response) => {
    try {
      const { username, currentPassword, newPassword } = req.body;
      if (!username || !currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          error: 'Sila isi kata laluan semasa dan kata laluan baharu.'
        });
      }

      if (String(newPassword).trim().length < 3) {
        return res.status(400).json({
          success: false,
          error: 'Kata laluan baharu mestilah sekurang-kurangnya 3 aksara.'
        });
      }

      const users = await ensureUsersStore();
      const idx = users.findIndex(
        (u) =>
          u.username.toLowerCase() === String(username).toLowerCase().trim() &&
          u.password === String(currentPassword).trim()
      );

      if (idx === -1) {
        return res.status(401).json({
          success: false,
          error: 'Kata laluan semasa tidak tepat.'
        });
      }

      users[idx].password = String(newPassword).trim();
      await writeUsersStore(users);
      await logCmsAudit('Tukar Kata Laluan', 'Keselamatan', users[idx].name, 'Menukar kata laluan akaun pentadbir');

      res.json({
        success: true,
        message: 'Kata laluan pentadbir telah berjaya dikemaskini.'
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  // 14. GET /api/cms/admins - List all CMS administrators
  app.get('/api/cms/admins', async (req: Request, res: Response) => {
    try {
      const users = await ensureUsersStore();
      const sanitized = users.map((u) => ({
        id: u.id,
        username: u.username,
        name: u.name,
        role: (u.username === 'admin' || u.role === 'Admin' || u.role === 'Super Administrator')
          ? 'Super Administrator'
          : 'Administrator',
        actualRole: u.role,
        email: u.email,
        department: u.department,
        status: u.status,
        createdAt: u.createdAt
      }));

      res.json({ success: true, data: sanitized });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  // 15. POST /api/cms/admins - Create new CMS administrator
  app.post('/api/cms/admins', async (req: Request, res: Response) => {
    try {
      const { username, password, name, role = 'Administrator', email, department } = req.body;

      if (!username || !password || !name) {
        return res.status(400).json({
          success: false,
          error: 'Nama Pengguna, Kata Laluan, dan Nama Penuh wajib diisi.'
        });
      }

      const cleanUser = String(username).trim().toLowerCase();
      const cleanPass = String(password).trim();
      const cleanName = String(name).trim();

      const users = await ensureUsersStore();
      if (users.find((u) => u.username.toLowerCase() === cleanUser)) {
        return res.status(400).json({
          success: false,
          error: `Nama pengguna "${cleanUser}" telah digunakan.`
        });
      }

      const newUser: UserRecord = {
        id: `admin-${Date.now()}`,
        username: cleanUser,
        password: cleanPass,
        name: cleanName,
        role: role === 'Super Administrator' ? 'Super Administrator' : 'Administrator',
        email: email ? String(email).trim() : `${cleanUser}@jkr.gov.my`,
        department: department ? String(department).trim() : 'Bahagian Komunikasi Korporat JKR NS',
        status: 'Aktif',
        createdAt: new Date().toLocaleDateString('ms-MY', { day: '2-digit', month: 'short', year: 'numeric' })
      };

      users.push(newUser);
      await writeUsersStore(users);
      await logCmsAudit('Daftar Pentadbir', 'Pengguna CMS', 'Super Admin', `Mendaftarkan pentadbir baharu ${cleanName} (${newUser.role})`);

      const { password: _, ...safeUser } = newUser;
      res.status(201).json({
        success: true,
        message: `Pentadbir baharu "${cleanName}" telah berjaya didaftarkan.`,
        data: safeUser
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  // 16. PUT /api/cms/admins/:id - Update CMS administrator
  app.put('/api/cms/admins/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, role, email, department, status, password } = req.body;

      const users = await ensureUsersStore();
      const idx = users.findIndex((u) => u.id === id);
      if (idx === -1) {
        return res.status(404).json({ success: false, error: 'Pentadbir tidak ditemui.' });
      }

      if (name) users[idx].name = String(name).trim();
      if (role) users[idx].role = role;
      if (email) users[idx].email = String(email).trim();
      if (department) users[idx].department = String(department).trim();
      if (status) users[idx].status = status;
      if (password && String(password).trim()) {
        users[idx].password = String(password).trim();
      }

      await writeUsersStore(users);
      await logCmsAudit('Kemaskini Pentadbir', 'Pengguna CMS', 'Super Admin', `Mengemaskini maklumat pentadbir ${users[idx].name}`);

      const { password: _, ...safeUser } = users[idx];
      res.json({
        success: true,
        message: `Maklumat pentadbir "${safeUser.name}" telah dikemaskini.`,
        data: safeUser
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  // 17. DELETE /api/cms/admins/:id - Delete CMS administrator
  app.delete('/api/cms/admins/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const users = await ensureUsersStore();
      const target = users.find((u) => u.id === id);

      if (!target) {
        return res.status(404).json({ success: false, error: 'Pentadbir tidak ditemui.' });
      }

      if (target.username === 'admin') {
        return res.status(400).json({
          success: false,
          error: 'Akaun Pentadbir Utama asal tidak boleh dipadamkan demi keselamatan sistem.'
        });
      }

      const updated = users.filter((u) => u.id !== id);
      await writeUsersStore(updated);
      await logCmsAudit('Padam Pentadbir', 'Pengguna CMS', 'Super Admin', `Memadamkan pentadbir ${target.name}`);

      res.json({
        success: true,
        message: `Pentadbir "${target.name}" telah dipadamkan.`
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  // Mount Vite development server or serve built assets in production
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[JKR NS Backend] Express + Cloudflare storage server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

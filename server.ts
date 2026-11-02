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

// Data structure for e-Aduan
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

// Local cache / persistence directory
const DATA_DIR = path.resolve(__dirname, 'data');
const DATA_FILE = path.resolve(DATA_DIR, 'aduan-store.json');

async function ensureDataStore(): Promise<AduanRecord[]> {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      await fsPromises.mkdir(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
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
      await fsPromises.writeFile(DATA_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const content = await fsPromises.readFile(DATA_FILE, 'utf-8');
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
    await fsPromises.writeFile(DATA_FILE, JSON.stringify(records, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Storage Error] Failed writing local aduan store:', err);
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
    } else {
      console.warn('[Cloudflare D1] Migration response warning:', json.errors);
      return false;
    }
  } catch (error) {
    console.error('[Cloudflare D1] Table verification failed:', error);
    return false;
  }
}

async function persistToCloudflare(record: AduanRecord): Promise<{ success: boolean; provider: string; error?: string }> {
  const config = getCloudflareConfig();

  // Mode 1: Cloudflare D1 SQL Database
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
      } else {
        const errMsg = json.errors?.[0]?.message || 'Cloudflare D1 query error';
        return { success: false, provider: 'Cloudflare D1', error: errMsg };
      }
    } catch (err: any) {
      return { success: false, provider: 'Cloudflare D1', error: err?.message || String(err) };
    }
  }

  // Mode 2: Cloudflare Custom Worker Endpoint
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

  // Mode 3: Cloudflare KV Namespace
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

  // Default fallback
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

  // GET /api/aduan - List all complaints
  app.get('/api/aduan', async (req: Request, res: Response) => {
    try {
      const cfRecords = await fetchFromCloudflare();
      if (cfRecords && cfRecords.length > 0) {
        return res.json({ success: true, source: 'cloudflare', data: cfRecords });
      }

      const localRecords = await ensureDataStore();
      res.json({ success: true, source: 'local', data: localRecords });
    } catch (err: any) {
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

  // POST /api/aduan - Create new complaint and store into Cloudflare
  app.post('/api/aduan', async (req: Request, res: Response) => {
    try {
      const { name, phone, district, category, gps, description, image } = req.body;

      if (!name || !phone || !district || !category || !description) {
        return res.status(400).json({
          success: false,
          error: 'Semua medan mandatori (nama, phone, district, category, description) mesti diisi.'
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
        name: String(name).trim(),
        phone: String(phone).trim(),
        district: String(district).trim(),
        category: String(category).trim(),
        gps: String(gps || '2.6922° N, 101.9056° E').trim(),
        description: String(description).trim(),
        image: image || undefined,
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

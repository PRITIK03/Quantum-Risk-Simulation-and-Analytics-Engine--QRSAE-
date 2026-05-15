import { logger } from '../utils/logger';

export interface FetchOptions {
  timeout?: number;
  headers?: Record<string, string>;
}

export async function postJSON(url: string, body: any, options: FetchOptions = {}): Promise<any> {
  const controller = new AbortController();
  const timeout = options.timeout ?? 15000;
  const timer = setTimeout(() => controller.abort(), timeout);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`HTTP ${res.status} ${res.statusText} - ${text}`);
    }

    const data = await res.json().catch(async () => {
      // If not a JSON response, fallback to text
      const t = await (await fetch(url)).text().catch(() => '');
      return t;
    });

    return data;
  } catch (err) {
    logger.error('postJSON failed', err);
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

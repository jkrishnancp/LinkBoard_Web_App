import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface LinkStatus {
  id: string;
  link_id: string;
  url: string;
  status: 'up' | 'down' | 'checking';
  last_checked: string;
  response_time?: number;
  created_at: string;
  updated_at: string;
}

export interface LinkCache {
  id: string;
  link_id: string;
  url: string;
  screenshot_url?: string;
  preview_html?: string;
  title?: string;
  description?: string;
  favicon?: string;
  cached_at: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

export async function checkLinkStatus(url: string): Promise<'up' | 'down'> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      mode: 'no-cors',
    });

    clearTimeout(timeout);
    return 'up';
  } catch (error) {
    return 'down';
  }
}

export async function updateLinkStatus(
  linkId: string,
  url: string
): Promise<LinkStatus | null> {
  const status = await checkLinkStatus(url);

  const { data, error } = await supabase
    .from('link_status')
    .upsert(
      {
        link_id: linkId,
        url,
        status,
        last_checked: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'link_id',
      }
    )
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error updating link status:', error);
    return null;
  }

  return data;
}

export async function getLinkStatus(linkId: string): Promise<LinkStatus | null> {
  const { data, error } = await supabase
    .from('link_status')
    .select('*')
    .eq('link_id', linkId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching link status:', error);
    return null;
  }

  return data;
}

export async function getLinkCache(linkId: string): Promise<LinkCache | null> {
  const { data, error } = await supabase
    .from('link_cache')
    .select('*')
    .eq('link_id', linkId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching link cache:', error);
    return null;
  }

  const now = new Date();
  const expiresAt = data?.expires_at ? new Date(data.expires_at) : null;

  if (data && expiresAt && expiresAt < now) {
    return null;
  }

  return data;
}

export async function updateLinkCache(
  linkId: string,
  url: string,
  metadata: {
    title?: string;
    description?: string;
    favicon?: string;
    screenshot_url?: string;
  }
): Promise<LinkCache | null> {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 8 * 60 * 60 * 1000);

  const { data, error } = await supabase
    .from('link_cache')
    .upsert(
      {
        link_id: linkId,
        url,
        ...metadata,
        cached_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
        updated_at: now.toISOString(),
      },
      {
        onConflict: 'link_id',
      }
    )
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error updating link cache:', error);
    return null;
  }

  return data;
}

export async function fetchLinkMetadata(url: string): Promise<{
  title?: string;
  description?: string;
  favicon?: string;
}> {
  try {
    const response = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}`);
    const data = await response.json();

    if (data.status === 'success') {
      return {
        title: data.data.title,
        description: data.data.description,
        favicon: data.data.logo?.url || data.data.image?.url,
      };
    }
  } catch (error) {
    console.error('Error fetching metadata:', error);
  }

  return {};
}

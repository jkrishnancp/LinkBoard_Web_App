import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
});

export type Database = {
  public: {
    Tables: {
      dashboard_config: {
        Row: {
          id: string;
          user_id: string;
          state: any;
          version: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          state: any;
          version?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          state?: any;
          version?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      media_config: {
        Row: {
          id: string;
          user_id: string;
          server_ip: string;
          qbittorrent_port: string;
          docker_port: string;
          jellyfin_port: string;
          refresh_interval: number;
          qb_username: string;
          qb_password: string;
          jellyfin_api_key: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          server_ip?: string;
          qbittorrent_port?: string;
          docker_port?: string;
          jellyfin_port?: string;
          refresh_interval?: number;
          qb_username?: string;
          qb_password?: string;
          jellyfin_api_key?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          server_ip?: string;
          qbittorrent_port?: string;
          docker_port?: string;
          jellyfin_port?: string;
          refresh_interval?: number;
          qb_username?: string;
          qb_password?: string;
          jellyfin_api_key?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};

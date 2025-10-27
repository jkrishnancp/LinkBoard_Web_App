import { supabase } from './supabase';
import { AppState } from './validators';

const DEFAULT_USER_ID = 'default-user';

interface DashboardConfig {
  user_id: string;
  state: AppState;
  version: number;
}

interface MediaConfig {
  user_id: string;
  server_ip: string;
  qbittorrent_port: string;
  docker_port: string;
  jellyfin_port: string;
  refresh_interval: number;
  qb_username: string;
  qb_password: string;
  jellyfin_api_key: string;
}

/**
 * Dashboard State Persistence
 */
export class DashboardPersistence {
  private userId: string;
  private syncInterval: NodeJS.Timeout | null = null;

  constructor(userId: string = DEFAULT_USER_ID) {
    this.userId = userId;
  }

  /**
   * Load dashboard state from database
   */
  async load(): Promise<AppState | null> {
    try {
      const { data, error } = await supabase
        .from('dashboard_config')
        .select('state, version')
        .eq('user_id', this.userId)
        .maybeSingle();

      if (error) {
        console.error('Error loading dashboard state:', error);
        return null;
      }

      if (!data) {
        console.log('No dashboard state found, using defaults');
        return null;
      }

      console.log(`✓ Dashboard state loaded from database (version ${data.version})`);
      return data.state as AppState;
    } catch (error) {
      console.error('Failed to load dashboard state:', error);
      return null;
    }
  }

  /**
   * Save dashboard state to database
   */
  async save(state: AppState): Promise<boolean> {
    try {
      // Get current version
      const { data: current } = await supabase
        .from('dashboard_config')
        .select('version')
        .eq('user_id', this.userId)
        .maybeSingle();

      const newVersion = (current?.version || 0) + 1;

      // Upsert with version increment
      const { error } = await supabase
        .from('dashboard_config')
        .upsert(
          {
            user_id: this.userId,
            state: state as any,
            version: newVersion,
          },
          {
            onConflict: 'user_id',
          }
        );

      if (error) {
        console.error('Error saving dashboard state:', error);
        return false;
      }

      console.log(`✓ Dashboard state saved to database (version ${newVersion})`);
      return true;
    } catch (error) {
      console.error('Failed to save dashboard state:', error);
      return false;
    }
  }

  /**
   * Migrate from localStorage to database
   */
  async migrateFromLocalStorage(): Promise<boolean> {
    try {
      const localData = localStorage.getItem('linkboard-state');
      if (!localData) {
        console.log('No localStorage data to migrate');
        return false;
      }

      const state = JSON.parse(localData) as AppState;
      console.log('Migrating dashboard state from localStorage to database...');

      const success = await this.save(state);
      if (success) {
        console.log('✓ Migration completed successfully');
        console.log('localStorage data preserved as backup');
      }

      return success;
    } catch (error) {
      console.error('Failed to migrate from localStorage:', error);
      return false;
    }
  }

  /**
   * Start automatic sync
   */
  startAutoSync(getState: () => AppState, intervalMs: number = 5000) {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncInterval = setInterval(async () => {
      const state = getState();
      await this.save(state);
    }, intervalMs);

    console.log(`✓ Auto-sync started (interval: ${intervalMs}ms)`);
  }

  /**
   * Stop automatic sync
   */
  stopAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      console.log('✓ Auto-sync stopped');
    }
  }
}

/**
 * Media Config Persistence
 */
export class MediaConfigPersistence {
  private userId: string;

  constructor(userId: string = DEFAULT_USER_ID) {
    this.userId = userId;
  }

  /**
   * Load media config from database
   */
  async load(): Promise<MediaConfig | null> {
    try {
      const { data, error } = await supabase
        .from('media_config')
        .select('*')
        .eq('user_id', this.userId)
        .maybeSingle();

      if (error) {
        console.error('Error loading media config:', error);
        return null;
      }

      if (!data) {
        console.log('No media config found, using defaults');
        return null;
      }

      console.log('✓ Media config loaded from database');
      return data as MediaConfig;
    } catch (error) {
      console.error('Failed to load media config:', error);
      return null;
    }
  }

  /**
   * Save media config to database
   */
  async save(config: Partial<MediaConfig>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('media_config')
        .upsert(
          {
            user_id: this.userId,
            ...config,
          },
          {
            onConflict: 'user_id',
          }
        );

      if (error) {
        console.error('Error saving media config:', error);
        return false;
      }

      console.log('✓ Media config saved to database');
      return true;
    } catch (error) {
      console.error('Failed to save media config:', error);
      return false;
    }
  }

  /**
   * Migrate from localStorage to database
   */
  async migrateFromLocalStorage(): Promise<boolean> {
    try {
      const localData = localStorage.getItem('media-server-config');
      if (!localData) {
        console.log('No localStorage media config to migrate');
        return false;
      }

      const config = JSON.parse(localData);
      console.log('Migrating media config from localStorage to database...');

      const success = await this.save({
        server_ip: config.ip || '10.6.3.70',
        qbittorrent_port: config.qbport || '8080',
        docker_port: config.dockerport || '2375',
        jellyfin_port: config.jellyfinport || '8096',
        refresh_interval: parseInt(config.refreshInterval || '3'),
        qb_username: config.qbUsername || '',
        qb_password: config.qbPassword || '',
        jellyfin_api_key: config.jellyfinApiKey || '',
      });

      if (success) {
        console.log('✓ Media config migration completed successfully');
        console.log('localStorage data preserved as backup');
      }

      return success;
    } catch (error) {
      console.error('Failed to migrate media config from localStorage:', error);
      return false;
    }
  }
}

/**
 * Fallback storage using localStorage when database is unavailable
 */
export class FallbackStorage {
  static save(key: string, data: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      console.log(`✓ Saved to localStorage fallback: ${key}`);
    } catch (error) {
      console.error(`Failed to save to localStorage: ${key}`, error);
    }
  }

  static load<T>(key: string): T | null {
    try {
      const data = localStorage.getItem(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (error) {
      console.error(`Failed to load from localStorage: ${key}`, error);
      return null;
    }
  }
}

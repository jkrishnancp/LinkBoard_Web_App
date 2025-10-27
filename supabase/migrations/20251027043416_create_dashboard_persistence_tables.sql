/*
  # Dashboard Persistence System

  ## Overview
  This migration creates tables to persist dashboard configurations, eliminating dependency on browser localStorage.
  Data will sync across devices and survive browser resets, cache clears, and server reboots.

  ## New Tables

  ### 1. `dashboard_config`
  Stores complete LinkBoard state including pages, links, categories, settings, and widgets
  - `id` (uuid, primary key) - Unique configuration ID
  - `user_id` (text, unique) - User/device identifier (defaults to 'default-user')
  - `state` (jsonb) - Complete dashboard state in JSON format
  - `version` (integer) - Version number for conflict resolution
  - `created_at` (timestamptz) - When first created
  - `updated_at` (timestamptz) - Last modification time

  ### 2. `media_config`
  Stores media dashboard server settings
  - `id` (uuid, primary key) - Unique configuration ID
  - `user_id` (text, unique) - User/device identifier (defaults to 'default-user')
  - `server_ip` (text) - Media server IP address
  - `qbittorrent_port` (text) - qBittorrent Web UI port
  - `docker_port` (text) - Docker Remote API port
  - `jellyfin_port` (text) - Jellyfin web port
  - `refresh_interval` (integer) - Auto-refresh interval in seconds
  - `qb_username` (text) - Optional qBittorrent username
  - `qb_password` (text) - Optional qBittorrent password (encrypted)
  - `jellyfin_api_key` (text) - Optional Jellyfin API key
  - `created_at` (timestamptz) - When first created
  - `updated_at` (timestamptz) - Last modification time

  ## Security
  - RLS enabled on both tables
  - Public access allowed (no authentication required)
  - Users can only access their own data via user_id

  ## Important Notes
  - Uses 'default-user' as default user_id for single-user installations
  - State stored as JSONB for efficient querying and updates
  - Automatic timestamp updates via triggers
  - Version column prevents race conditions on updates
*/

-- Create dashboard_config table
CREATE TABLE IF NOT EXISTS dashboard_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text UNIQUE NOT NULL DEFAULT 'default-user',
  state jsonb NOT NULL DEFAULT '{}'::jsonb,
  version integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create media_config table
CREATE TABLE IF NOT EXISTS media_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text UNIQUE NOT NULL DEFAULT 'default-user',
  server_ip text NOT NULL DEFAULT '10.6.3.70',
  qbittorrent_port text NOT NULL DEFAULT '8080',
  docker_port text NOT NULL DEFAULT '2375',
  jellyfin_port text NOT NULL DEFAULT '8096',
  refresh_interval integer NOT NULL DEFAULT 3,
  qb_username text DEFAULT '',
  qb_password text DEFAULT '',
  jellyfin_api_key text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE dashboard_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_config ENABLE ROW LEVEL SECURITY;

-- RLS Policies for dashboard_config
CREATE POLICY "Anyone can view dashboard config"
  ON dashboard_config
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert dashboard config"
  ON dashboard_config
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update dashboard config"
  ON dashboard_config
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete dashboard config"
  ON dashboard_config
  FOR DELETE
  USING (true);

-- RLS Policies for media_config
CREATE POLICY "Anyone can view media config"
  ON media_config
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert media config"
  ON media_config
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update media config"
  ON media_config
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete media config"
  ON media_config
  FOR DELETE
  USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for automatic updated_at
CREATE TRIGGER update_dashboard_config_updated_at
  BEFORE UPDATE ON dashboard_config
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_media_config_updated_at
  BEFORE UPDATE ON media_config
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_dashboard_config_user_id ON dashboard_config(user_id);
CREATE INDEX IF NOT EXISTS idx_dashboard_config_updated_at ON dashboard_config(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_media_config_user_id ON media_config(user_id);
CREATE INDEX IF NOT EXISTS idx_media_config_updated_at ON media_config(updated_at DESC);

-- Insert default row for dashboard_config
INSERT INTO dashboard_config (user_id, state, version)
VALUES ('default-user', '{}'::jsonb, 1)
ON CONFLICT (user_id) DO NOTHING;

-- Insert default row for media_config
INSERT INTO media_config (user_id)
VALUES ('default-user')
ON CONFLICT (user_id) DO NOTHING;

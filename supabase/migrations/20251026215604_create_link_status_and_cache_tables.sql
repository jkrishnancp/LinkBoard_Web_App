/*
  # Create Link Status and Cache Tables

  ## Overview
  Creates tables for tracking link status monitoring and caching webpage metadata.

  ## New Tables
  
  ### `link_status`
  Tracks the up/down status of links with response time monitoring
  - `id` (uuid, primary key) - Unique identifier
  - `link_id` (text, unique) - Reference to the link in localStorage
  - `url` (text) - The URL being monitored
  - `status` (text) - Current status: 'up', 'down', or 'checking'
  - `last_checked` (timestamptz) - When status was last checked
  - `response_time` (integer) - Response time in milliseconds
  - `created_at` (timestamptz) - Record creation time
  - `updated_at` (timestamptz) - Last update time

  ### `link_cache`
  Stores cached webpage metadata including screenshots and previews
  - `id` (uuid, primary key) - Unique identifier
  - `link_id` (text, unique) - Reference to the link in localStorage
  - `url` (text) - The URL being cached
  - `screenshot_url` (text) - URL to cached screenshot
  - `preview_html` (text) - Cached HTML preview
  - `title` (text) - Page title
  - `description` (text) - Page description
  - `favicon` (text) - Favicon URL
  - `cached_at` (timestamptz) - When cache was created
  - `expires_at` (timestamptz) - When cache expires (8 hours after cached_at)
  - `created_at` (timestamptz) - Record creation time
  - `updated_at` (timestamptz) - Last update time

  ## Security
  - Enable RLS on both tables
  - Public read access for all authenticated users
  - Public write access for cache updates and status checks
  
  ## Indexes
  - Index on `link_id` for fast lookups
  - Index on `expires_at` for cache cleanup queries
  - Index on `last_checked` for status refresh queries
*/

-- Create link_status table
CREATE TABLE IF NOT EXISTS link_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id text UNIQUE NOT NULL,
  url text NOT NULL,
  status text NOT NULL DEFAULT 'checking',
  last_checked timestamptz DEFAULT now(),
  response_time integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create link_cache table
CREATE TABLE IF NOT EXISTS link_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id text UNIQUE NOT NULL,
  url text NOT NULL,
  screenshot_url text,
  preview_html text,
  title text,
  description text,
  favicon text,
  cached_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_link_status_link_id ON link_status(link_id);
CREATE INDEX IF NOT EXISTS idx_link_status_last_checked ON link_status(last_checked);
CREATE INDEX IF NOT EXISTS idx_link_cache_link_id ON link_cache(link_id);
CREATE INDEX IF NOT EXISTS idx_link_cache_expires_at ON link_cache(expires_at);

-- Enable Row Level Security
ALTER TABLE link_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE link_cache ENABLE ROW LEVEL SECURITY;

-- Create policies for link_status
CREATE POLICY "Anyone can read link status"
  ON link_status FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert link status"
  ON link_status FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update link status"
  ON link_status FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete old link status"
  ON link_status FOR DELETE
  USING (true);

-- Create policies for link_cache
CREATE POLICY "Anyone can read link cache"
  ON link_cache FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert link cache"
  ON link_cache FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update link cache"
  ON link_cache FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete old link cache"
  ON link_cache FOR DELETE
  USING (true);

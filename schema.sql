CREATE TABLE IF NOT EXISTS campaigns (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  target_industry TEXT,
  target_location TEXT,
  offer TEXT,
  mode TEXT DEFAULT 'business',
  niche TEXT,
  affiliate_url TEXT,
  auto_research BOOLEAN DEFAULT false,
  auto_write BOOLEAN DEFAULT false,
  auto_outreach BOOLEAN DEFAULT false,
  auto_qualify BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  campaign_id INTEGER REFERENCES campaigns(id),
  client_id INTEGER,
  business_name TEXT,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  industry TEXT,
  location TEXT,
  notes TEXT,
  status TEXT DEFAULT 'new',
  qualification_score INTEGER,
  mode TEXT DEFAULT 'business',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  lead_id INTEGER REFERENCES leads(id),
  agent TEXT,
  role TEXT,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS call_briefs (
  id SERIAL PRIMARY KEY,
  lead_id INTEGER REFERENCES leads(id),
  brief TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS daily_briefings (
  id SERIAL PRIMARY KEY,
  briefing JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS clients (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT,
  business_name TEXT,
  plan TEXT DEFAULT 'none',
  plan_type TEXT DEFAULT 'business',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  subscription_status TEXT DEFAULT 'inactive',
  leads_limit INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS client_campaigns (
  id SERIAL PRIMARY KEY,
  client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
  campaign_id INTEGER REFERENCES campaigns(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

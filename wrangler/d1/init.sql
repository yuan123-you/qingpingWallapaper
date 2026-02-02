CREATE TABLE IF NOT EXISTS wallpaper (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  class_id INTEGER NOT NULL,
  pic_url TEXT NOT NULL,
  pic_base64 TEXT,
  title TEXT,
  tags TEXT,
  desc TEXT,
  score REAL DEFAULT 0,
  score_count INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  favorite_count INTEGER DEFAULT 0,
  status INTEGER DEFAULT 1,
  create_time INTEGER NOT NULL,
  update_time INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_wallpaper_class_id ON wallpaper(class_id);
CREATE INDEX IF NOT EXISTS idx_wallpaper_status ON wallpaper(status);
CREATE INDEX IF NOT EXISTS idx_wallpaper_create_time ON wallpaper(create_time);
CREATE INDEX IF NOT EXISTS idx_wallpaper_score ON wallpaper(score);

CREATE TABLE IF NOT EXISTS classify (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  cover_url TEXT NOT NULL,
  cover_base64 TEXT,
  desc TEXT,
  sort INTEGER DEFAULT 0,
  wall_count INTEGER DEFAULT 0,
  update_time INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_classify_sort ON classify(sort);

CREATE TABLE IF NOT EXISTS banner (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pic_url TEXT NOT NULL,
  pic_base64 TEXT,
  jump_url TEXT,
  sort INTEGER DEFAULT 0,
  status INTEGER DEFAULT 1,
  create_time INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_banner_sort ON banner(sort);
CREATE INDEX IF NOT EXISTS idx_banner_status ON banner(status);

CREATE TABLE IF NOT EXISTS notice (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  type TEXT DEFAULT 'system',
  content TEXT NOT NULL,
  status INTEGER DEFAULT 1,
  create_time INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_notice_type ON notice(type);
CREATE INDEX IF NOT EXISTS idx_notice_status ON notice(status);
CREATE INDEX IF NOT EXISTS idx_notice_create_time ON notice(create_time);

CREATE TABLE IF NOT EXISTS user_behavior (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  openid TEXT,
  wall_id INTEGER NOT NULL,
  type TEXT NOT NULL,
  create_time INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_user_behavior_openid ON user_behavior(openid);
CREATE INDEX IF NOT EXISTS idx_user_behavior_wall_id ON user_behavior(wall_id);
CREATE INDEX IF NOT EXISTS idx_user_behavior_type ON user_behavior(type);

CREATE TABLE IF NOT EXISTS admin (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  token TEXT,
  token_expire INTEGER,
  lock_status INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_admin_username ON admin(username);

INSERT INTO admin (username, password) VALUES ('admin', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9') ON CONFLICT(username) DO NOTHING;
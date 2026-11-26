-- One row per UTC day and list key. A counter only: no IP, user agent, cookie, id or timestamp finer than a day.
CREATE TABLE IF NOT EXISTS list_views (
  day TEXT NOT NULL,
  list TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (day, list)
);

-- Run in the intended PostHog project's SQL editor with authorized read access.
-- Replace the literal start/end dates together; timestamps below are Israel time.
-- These are capped per-page activity counts, NOT people, retention or attribution proof.
-- No raw URLs, searches, locations, identities or conversations are selected.

-- Activity by event/day. Labelled smoke events are a different event name.
SELECT toDate(toTimeZone(timestamp, 'Asia/Jerusalem')) AS day,
       event,
       count() AS activity_events
FROM events
WHERE timestamp >= toDateTime('2026-11-18 00:00:00', 'Asia/Jerusalem')
  AND timestamp < toDateTime('2026-11-21 00:00:00', 'Asia/Jerusalem')
  AND event LIKE 'history_map_%'
  AND properties.app = 'history-map'
  AND (properties.internal_test IS NULL OR properties.internal_test != true)
GROUP BY day, event
ORDER BY day, event;

-- Acquisition labels after the separate attribution implementation is released.
-- The original publication tag may survive forwarding. It does not identify a teacher/person.
SELECT properties.attribution_source AS source,
       properties.attribution_publication AS publication,
       count() AS tagged_page_loads
FROM events
WHERE timestamp >= toDateTime('2026-11-18 00:00:00', 'Asia/Jerusalem')
  AND timestamp < toDateTime('2026-11-21 00:00:00', 'Asia/Jerusalem')
  AND event = 'history_map_app_open'
  AND properties.app = 'history-map'
  AND notEmpty(toString(properties.attribution_publication))
  AND (properties.internal_test IS NULL OR properties.internal_test != true)
GROUP BY source, publication
ORDER BY tagged_page_loads DESC;

-- Receipt of deliberately separate synthetic events. Never add these to usage totals.
SELECT event, count() AS synthetic_events, max(timestamp) AS last_received
FROM events
WHERE timestamp >= toDateTime('2026-11-18 00:00:00', 'Asia/Jerusalem')
  AND timestamp < toDateTime('2026-11-21 00:00:00', 'Asia/Jerusalem')
  AND event = 'internal_smoke_test'
  AND properties.app = 'history-map'
  AND properties.internal_test = true
GROUP BY event;

-- Coarse device class (phone/tablet/desktop) per page load. Events before the device_class release have none.
-- Counts page loads, not people.
SELECT properties.device_class AS device_class,
       count() AS page_loads
FROM events
WHERE timestamp >= toDateTime('2026-11-26 18:00:00', 'Asia/Jerusalem')
  AND event = 'history_map_app_open'
  AND properties.app = 'history-map'
  AND (properties.internal_test IS NULL OR properties.internal_test != true)
GROUP BY device_class
ORDER BY page_loads DESC;

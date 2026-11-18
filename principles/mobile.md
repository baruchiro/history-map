# Map-first mobile experience

The map is the product's primary surface. The originator's ability to understand it is a baseline, not a substitute for testing with new people.

- Use the entire viewport for the map. Float a small year control, share/world-reset icons and timeline above it. Icons need accessible labels and 44px or larger targets. Tapping the year exposes direct entry.
- One finger drags the map; two fingers pinch. A drag must not accidentally select a territory or event.
- A background map tap may hide/reveal the title and gesture hint. Feature selection, controls and dragging must not accidentally trigger that toggle. Keep navigation recoverable.
- Sharing opens the native share sheet when supported; otherwise show an explicit copy-link dialog. Canceling native sharing must not automatically send or copy. Never choose a recipient or send automatically.
- Keep progressive disclosure inside settings too: a short content/display/about switcher, direct controls rather than instruction paragraphs, and selected states that explain themselves. Hide contribution prompts and long source/method details behind deliberate secondary reveals. Do not replace clear control labels with unexplained icons. Progressive disclosure is not removal.
- Do not force landscape or maintain a separate mobile product without evidence. Support narrow portrait, desktop and landscape.
- The Hebrew timeline runs from early dates on the right to later dates on the left. Labels, fill and playback direction must agree.
- Preserve exact shared views through UI revisions. Historical boundaries remain approximate and visibly qualified.
- Avoid named presets whose meaning is unclear. A selected year is not proof of an empire's maximum extent.
- Inspect real rendered pixels and actual touch behavior, including tap targets, scrolling, year entry, copy success/failure and drawer discoverability.

Current first screen opens at 1969 with a visible public event marker on narrow portrait. `All world` fits the whole world rather than imposing a portrait crop. This framing is a reversible implementation choice, not a historical or business principle.

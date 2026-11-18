# Historical territories layer

Data: Cliopatria, Ed Chalstrey, James Bennett and the Seshat Global History Databank, CC BY 4.0.

Source: https://github.com/Seshat-Global-History-Databank/cliopatria
Pinned revision: 5f433377139a6eeaeacbdc894b70f8805b72c8b5
Paper: https://www.nature.com/articles/s41597-025-04516-9
License: https://creativecommons.org/licenses/by/4.0/

13,797 source records retain their inclusive FromYear/ToYear periods. Supported range: 3400 BCE to 2024 CE, no year zero in the interface. Geometry is not interpolated between source periods. Country/empire names remain in the source language, English. Tap a territory for its source period. Lack of a polygon is not evidence of absence of settlement or political organization.

This is one historical reconstruction. Coverage, temporal resolution and spatial accuracy vary. Most early borders are approximate zones of control. Source uncertainties and disputes are not encoded. The paper describes raster-derived geometry and alignment limits. Coastlines underneath are modern, not a reconstruction of the selected year.

Derived geometry is simplified with Shapely at 0.2 degrees, preserving topology within individual features, then rounded to 0.05 degrees and projected to SVG. Adjacent features are simplified independently and can have gaps/overlaps. This is a world-scale overview, not a survey or territorial claim. The 13 Achaemenid Empire periods are preserved, not replaced with a single maximum extent.

To reproduce, download the archive from the pinned upstream revision, install shapely in an isolated environment, then run:

```sh
python3 scripts/build_borders.py --archive cliopatria.geojson.zip --revision 5f433377139a6eeaeacbdc894b70f8805b72c8b5 --out docs/site/borders
```

No upstream script is executed. Source names are inserted as text, never as HTML. Data is split into lazy-loaded time chunks and cached in the browser for the page session. Failed or stale requests do not replace the currently selected year. Event points, list catalog and personal libraries remain separate.

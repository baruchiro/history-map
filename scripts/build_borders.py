import json,zipfile,hashlib
from pathlib import Path
from shapely.geometry import shape
import argparse
parser=argparse.ArgumentParser(description='Simplify an explicitly downloaded Cliopatria archive. Requires shapely.');parser.add_argument('--archive',required=True);parser.add_argument('--revision',required=True);parser.add_argument('--out',required=True);args=parser.parse_args()
root=Path(args.out);root.mkdir(exist_ok=True,parents=True)
z=zipfile.ZipFile(args.archive);data=json.loads(z.read(z.namelist()[0]));rows=[]
def ring_path(ring):
 points=[(round((p[0]+180)*2,1),round((90-p[1])*2,1)) for p in ring.coords]
 return 'M'+'L'.join(f'{x:g},{y:g}' for x,y in points)+'Z'
for i,f in enumerate(data['features']):
 p=f['properties'];g=shape(f['geometry']).simplify(.2,preserve_topology=True)
 if g.is_empty:continue
 polys=[g] if g.geom_type=='Polygon' else list(g.geoms)
 path=''.join(ring_path(poly.exterior)+''.join(ring_path(r) for r in poly.interiors) for poly in polys if poly.geom_type=='Polygon')
 if not path:continue
 rows.append({'id':i,'name':p['Name'],'from':p['FromYear'],'to':p['ToYear'],'d':path})
for start,end in [(x,x+499) for x in range(-3500,1500,500)]+[(x,x+99) for x in range(1500,2100,100)]:
 part=[x for x in rows if x['from']<=end and x['to']>=start]
 (root/f'{start}.json').write_text(json.dumps(part,separators=(',',':'),ensure_ascii=False))
meta={'source':'Cliopatria / Seshat Global History Databank','revision':args.revision,'license':'CC BY 4.0','sourceUrl':'https://github.com/Seshat-Global-History-Databank/cliopatria','min':-3400,'max':2024,'records':len(rows),'changes':'Geometry simplified with Shapely tolerance 0.2 degrees, topology preserved within each feature; coordinates rounded to 0.05 degrees and projected to equirectangular SVG. No new borders or dates inferred.'}
(root/'provenance.json').write_text(json.dumps(meta,indent=2))
print('records',len(rows),'size',sum(p.stat().st_size for p in root.glob('*.json')),'max chunk',max(p.stat().st_size for p in root.glob('*.json')))

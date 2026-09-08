const cache = new Map<string, [number, number][]>();

export async function getRoadPath(waypoints: [number, number][]): Promise<[number, number][]> {
  if (waypoints.length < 2) return waypoints;

  const key = waypoints.map(([lat, lng]) => `${lat},${lng}`).join('|');
  if (cache.has(key)) return cache.get(key)!;

  // Single OSRM call with all waypoints — fastest approach
  const coords = waypoints.map(([lat, lng]) => `${lng},${lat}`).join(';');
  const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson&steps=false&annotations=false`;

  try {
    const res = await fetch(url);
    if (!res.ok) return waypoints;
    const data = await res.json();
    if (data.code !== 'Ok' || !data.routes?.[0]) return waypoints;
    const result: [number, number][] = data.routes[0].geometry.coordinates.map(
      ([lng, lat]: [number, number]) => [lat, lng]
    );
    cache.set(key, result);
    return result;
  } catch {
    return waypoints;
  }
}

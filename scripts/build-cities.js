/**
 * @file scripts/build-cities.js
 * @description Builds data/cities.json, the compact city list used by the prayer
 *              location picker. Source: GeoNames cities15000.txt + countryInfo.txt
 *              (https://download.geonames.org/export/dump/, CC BY 4.0).
 *              Keeps populated places (no city sections) with population >= 50,000
 *              plus every capital and first-level admin seat, sorted by population.
 *              Usage: node scripts/build-cities.js <cities15000.txt> <countryInfo.txt> data/cities.json [minPopulation]
 * @project shortSurahs
 * @story US-13: Accurate prayer times and location
 * @created 2026-11-07
 */
const fs = require('fs');
const [, , citiesPath, countryPath, outPath, minPopArg] = process.argv;
const MIN_POP = Number(minPopArg || 50000);
const KEEP = new Set(['PPL', 'PPLA', 'PPLA2', 'PPLA3', 'PPLC', 'PPLG']);
const countries = {};
for (const line of fs.readFileSync(countryPath, 'utf8').split('\n')) {
  if (!line || line.startsWith('#')) continue;
  const c = line.split('\t');
  countries[c[0]] = c[4];
}
const rows = [];
for (const line of fs.readFileSync(citiesPath, 'utf8').split('\n')) {
  if (!line) continue;
  const f = line.split('\t');
  const [name, ascii, lat, lng, fcode, cc, pop, tz] = [f[1], f[2], +f[4], +f[5], f[7], f[8], +f[14], f[17]];
  if (!KEEP.has(fcode) || !tz || !countries[cc]) continue;
  const isSeat = fcode === 'PPLC' || fcode === 'PPLA';
  if (pop < MIN_POP && !isSeat) continue;
  rows.push({ name, ascii, lat, lng, cc, pop, tz });
}
rows.sort((a, b) => b.pop - a.pop);
const tzList = [...new Set(rows.map((r) => r.tz))].sort();
const tzIndex = new Map(tzList.map((t, i) => [t, i]));
const usedCc = [...new Set(rows.map((r) => r.cc))].sort();
const out = {
  source: 'GeoNames cities15000 (https://www.geonames.org), CC BY 4.0',
  timezones: tzList,
  countries: Object.fromEntries(usedCc.map((cc) => [cc, countries[cc]])),
  // [name, countryCode, latitude, longitude, timezoneIndex, asciiName?]
  cities: rows.map((r) => {
    const row = [r.name, r.cc, Math.round(r.lat * 1000) / 1000, Math.round(r.lng * 1000) / 1000, tzIndex.get(r.tz)];
    if (r.ascii && r.ascii !== r.name) row.push(r.ascii);
    return row;
  }),
};
fs.writeFileSync(outPath, JSON.stringify(out));
console.log(`cities=${rows.length} timezones=${tzList.length} countries=${usedCc.length} bytes=${fs.statSync(outPath).size}`);

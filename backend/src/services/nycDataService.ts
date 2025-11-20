import type { NYC311Incident, NYPDComplaint, NormalizedIncident } from '../types/index.js';

const NYC_BOUNDS = {
  lat: { min: 40.4, max: 40.9 },
  lon: { min: -74.3, max: -73.7 }
};

const CATEGORY_MAP: Record<string, string[]> = {
  'ASSAULT': ['ASSAULT', 'ASSAULT 3', 'ASSAULT 2', 'ASSAULT 1'],
  'THEFT': ['GRAND LARCENY', 'PETIT LARCENY', 'LARCENY', 'THEFT'],
  'BURGLARY': ['BURGLARY'],
  'ROBBERY': ['ROBBERY'],
  'VEHICLE': ['VEHICLE', 'AUTO', 'CAR'],
  'DRUGS': ['DRUG', 'NARCOTICS'],
  'VANDALISM': ['VANDALISM', 'CRIMINAL MISCHIEF'],
  'HARASSMENT': ['HARASSMENT', 'STALKING'],
  'OTHER': []
};

function normalizeCategory(description: string | undefined): string {
  if (!description) return 'OTHER';
  const upper = description.toUpperCase();
  for (const [category, keywords] of Object.entries(CATEGORY_MAP)) {
    if (keywords.some(keyword => upper.includes(keyword))) {
      return category;
    }
  }
  return 'OTHER';
}

function normalizeDate(dateStr: string | undefined): Date {
  if (!dateStr) return new Date();
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? new Date() : date;
}

function normalizeCoords(lat: string | undefined, lon: string | undefined): [number, number] | null {
  const latNum = parseFloat(lat || '');
  const lonNum = parseFloat(lon || '');
  
  if (isNaN(latNum) || isNaN(lonNum)) return null;
  
  if (
    latNum < NYC_BOUNDS.lat.min || latNum > NYC_BOUNDS.lat.max ||
    lonNum < NYC_BOUNDS.lon.min || lonNum > NYC_BOUNDS.lon.max
  ) {
    return null;
  }
  
  return [latNum, lonNum];
}

async function fetchWithTimeout(url: string, timeout: number = 10000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      }
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export async function fetch311Data(): Promise<NormalizedIncident[]> {
  try {
    // Socrata API requires literal $ in $limit parameter
    const url = 'https://data.cityofnewyork.us/resource/erm2-nwe9.json?$limit=50&agency=NYPD';
    console.log('Fetching 311 data from:', url);
    
    const response = await fetchWithTimeout(url, 15000);
    
    if (!response.ok) {
      throw new Error(`311 API failed: ${response.status} ${response.statusText}`);
    }
    
    const data: NYC311Incident[] = await response.json();
    console.log(`Successfully fetched ${data.length} 311 records`);
    
    return data
      .map(item => {
        const coords = normalizeCoords(item.latitude, item.longitude);
        if (!coords) return null;
        
        return {
          id: item.unique_key || `311-${Math.random()}`,
          type: '311' as const,
          date: normalizeDate(item.created_date),
          description: item.complaint_type || item.descriptor || '311 Service Request',
          category: normalizeCategory(item.complaint_type || item.descriptor),
          coords,
          raw: item
        };
      })
      .filter((item): item is NormalizedIncident => item !== null);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching 311 data:', errorMessage);
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Request timed out after 15 seconds');
    }
    return [];
  }
}

export async function fetchNYPDData(): Promise<NormalizedIncident[]> {
  try {
    // Socrata API requires literal $ in $limit parameter
    const url = 'https://data.cityofnewyork.us/resource/5uac-w243.json?$limit=50';
    console.log('Fetching NYPD data from:', url);
    
    const response = await fetchWithTimeout(url, 15000);
    
    if (!response.ok) {
      throw new Error(`NYPD API failed: ${response.status} ${response.statusText}`);
    }
    
    const data: NYPDComplaint[] = await response.json();
    console.log(`Successfully fetched ${data.length} NYPD records`);
    
    return data
      .map(item => {
        const coords = normalizeCoords(item.latitude, item.longitude);
        if (!coords) return null;
        
        return {
          id: item.cmplnt_num || `nypd-${Math.random()}`,
          type: 'NYPD' as const,
          date: normalizeDate(item.cmplnt_fr_dt || item.rpt_dt),
          description: item.ofns_desc || item.pd_desc || 'NYPD Complaint',
          category: normalizeCategory(item.ofns_desc || item.pd_desc),
          coords,
          raw: item
        };
      })
      .filter((item): item is NormalizedIncident => item !== null);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching NYPD data:', errorMessage);
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Request timed out after 15 seconds');
    }
    return [];
  }
}

export async function fetchAllData(): Promise<NormalizedIncident[]> {
  console.log('Fetching all data from NYC Open Data APIs...');
  
  const [data311, dataNYPD] = await Promise.all([
    fetch311Data(),
    fetchNYPDData()
  ]);

  console.log(`Combined: ${data311.length} 311 records, ${dataNYPD.length} NYPD records`);
  
  const combined = [...data311, ...dataNYPD];
  combined.sort((a, b) => b.date.getTime() - a.date.getTime()); // Newest first
  
  console.log(`Total normalized incidents: ${combined.length}`);
  
  return combined;
}


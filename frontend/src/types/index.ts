export interface NormalizedIncident {
  id: string;
  type: '311' | 'NYPD';
  date: string; // ISO string from API
  description: string;
  category: string;
  coords: [number, number];
  raw: unknown;
}

export interface ApiResponse {
  success: boolean;
  count: number;
  data: NormalizedIncident[];
  error?: string;
  message?: string;
}


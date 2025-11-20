export interface NYC311Incident {
  unique_key?: string;
  created_date?: string;
  complaint_type?: string;
  descriptor?: string;
  latitude?: string;
  longitude?: string;
  agency?: string;
}

export interface NYPDComplaint {
  cmplnt_num?: string;
  cmplnt_fr_dt?: string;
  rpt_dt?: string;
  ofns_desc?: string;
  pd_desc?: string;
  latitude?: string;
  longitude?: string;
}

export interface NormalizedIncident {
  id: string;
  type: '311' | 'NYPD';
  date: Date;
  description: string;
  category: string;
  coords: [number, number];
  raw: NYC311Incident | NYPDComplaint;
}


import { Router } from 'express';
import { fetchAllData } from '../services/nycDataService.js';

const router = Router();

// Test connectivity to NYC APIs
router.get('/health-check', async (req, res) => {
  try {
    const testUrl = 'https://data.cityofnewyork.us/resource/erm2-nwe9.json?$limit=1';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(testUrl, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    res.json({
      success: true,
      connected: response.ok,
      status: response.status,
      message: 'Successfully connected to NYC Open Data API'
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(503).json({
      success: false,
      connected: false,
      error: 'Cannot reach NYC Open Data API',
      message: errorMessage,
      suggestion: 'Please check your internet connection and DNS settings'
    });
  }
});

router.get('/incidents', async (req, res) => {
  try {
    const incidents = await fetchAllData();
    
    if (incidents.length === 0) {
      console.warn('No incidents fetched - APIs may be unavailable or network issue');
      return res.json({
        success: false,
        count: 0,
        data: [],
        error: 'No data available',
        message: 'Unable to fetch data from NYC Open Data APIs. This may be due to network connectivity issues, API unavailability, or DNS resolution problems. Please check your internet connection and try again.'
      });
    }
    
    res.json({
      success: true,
      count: incidents.length,
      data: incidents.map(incident => ({
        ...incident,
        date: incident.date.toISOString()
      }))
    });
  } catch (error) {
    console.error('Error fetching incidents:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const isNetworkError = errorMessage.includes('ENOTFOUND') || 
                          errorMessage.includes('getaddrinfo') ||
                          errorMessage.includes('fetch failed');
    
    res.status(500).json({
      success: false,
      count: 0,
      data: [],
      error: 'Failed to fetch incidents',
      message: isNetworkError 
        ? 'Network error: Unable to reach NYC Open Data APIs. Please check your internet connection and DNS settings.'
        : errorMessage
    });
  }
});

export default router;


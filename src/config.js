// API URL - empty string for Vercel (same domain), localhost for development
export const API_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000';

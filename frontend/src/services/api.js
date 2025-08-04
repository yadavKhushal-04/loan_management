import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // adjust port if needed
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;

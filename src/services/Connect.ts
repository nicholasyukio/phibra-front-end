import axios from 'axios';

const API_URL = 'http://localhost:5169/api/entry';

export const getEntry = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const addEntry = async (forecast: { date: string; type: string; value: number; user: string }) => {
    const response = await axios.post(API_URL, forecast);
    return response.data;
};
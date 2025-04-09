import axios from 'axios';

const API_URL = 'http://localhost:5000/api/weatherforecast';

export const getWeather = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const addWeather = async (forecast: { date: string; temperatureC: number; summary: string }) => {
    const response = await axios.post(API_URL, forecast);
    return response.data;
};
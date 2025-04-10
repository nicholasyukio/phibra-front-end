import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL!;
console.log('API_URL:', API_URL);


export const getEntry = async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Erro na requisição GET:', error);
      throw error;
    }
  };
  
export const addEntry = async (forecast: { date: string; type: string; value: number; user: string }) => {
try {
    const response = await axios.post(API_URL, forecast);
    return response.data;
} catch (error) {
    console.error('Erro na requisição POST:', error);
    throw error;
}
};
  
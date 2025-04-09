import React, { useEffect, useState } from 'react';
import { getWeather, addWeather } from '../services/Connect';

const Weather = () => {
    const [forecasts, setForecasts] = useState<any[]>([]);
    const [newForecast, setNewForecast] = useState({ date: '', temperatureC: 0, summary: '' });

    useEffect(() => {
        getWeather().then(setForecasts);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // await addWeather(newForecast);
        // setForecasts(await getWeather());
    };

    return (
        <div>
            <h1>Weather Forecast</h1>
            <form onSubmit={handleSubmit}>
                <input type="date" value={newForecast.date} onChange={e => setNewForecast({ ...newForecast, date: e.target.value })} />
                <input type="number" value={newForecast.temperatureC} onChange={e => setNewForecast({ ...newForecast, temperatureC: parseInt(e.target.value) })} />
                <input type="text" value={newForecast.summary} onChange={e => setNewForecast({ ...newForecast, summary: e.target.value })} />
                <button type="submit">Add Forecast</button>
            </form>
            <ul>
                {forecasts.map(f => (
                    <li key={f.id}>{f.date} - {f.temperatureC}°C - {f.summary}</li>
                ))}
            </ul>
        </div>
    );
};

export default Weather;
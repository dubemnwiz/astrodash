import React, { useState, useEffect } from 'react';
import './AstroCard.css';

const AstroCard = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [moonPhaseFilter, setMoonPhaseFilter] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const key = import.meta.env.VITE_WEATHERBIT_KEY;
      const city = 'Raleigh,NC';
  
      try {
        const res = await fetch(
          `https://api.weatherbit.io/v2.0/forecast/daily?days=15&city=${encodeURIComponent(city)}&key=${key}`
        );
        const json = await res.json();
  
        const transformed = json.data.map((item, idx) => ({
          date: item.valid_date,
          temp: item.temp,
          moonRise: item.sunrise || '06:00',
          moonSet: item.sunset || '18:00',
          moonPhaseIndex: idx % 8,
          moonPhaseIcon: ['🌑','🌒','🌓','🌔','🌕','🌖','🌗','🌘'][idx % 8]
        }));
  
        setData(transformed);
      } catch (err) {
        console.error('Failed to fetch forecast data:', err);
      }
    };
  
    fetchData();
  }, []);
  
  
  const filteredData = data
    .filter((item) => item.date.includes(searchQuery))
    .filter((item) => item.moonPhaseIndex >= moonPhaseFilter);

  const summaryStats = {
    count: data.length,
    avgTemp:
      data.reduce((acc, item) => acc + parseFloat(item.temp), 0) / (data.length || 1),
    earliestMoonRise: data.reduce((earliest, item) => {
      return item.moonRise < earliest ? item.moonRise : earliest;
    }, data[0]?.moonRise || '23:59:59'),
  };

  return (
    <div className="astro-container">
      <aside className="sidebar">
        <nav className="sidebar-nav">
          <a href="#">Dashboard</a>
          <a href="#">Search</a>
          <a href="#">About</a>
        </nav>
      </aside>
  
      <main className="main-content">
        <h1>🌕 AstroDash</h1>
        <div className="stats">
          <div className="card">
            <p className="value">{summaryStats.avgTemp.toFixed(1)}°F</p>
            <p>Avg Temp</p>
          </div>
          <div className="card">
            <p className="value">{summaryStats.earliestMoonRise}</p>
            <p>Earliest Moon Rise</p>
          </div>
          <div className="card">
            <p className="value">{summaryStats.count}</p>
            <p>Total Records</p>
          </div>
        </div>
  
        <div className="filters">
        <label>Search by Date:</label>
        <input
          type="text"
          placeholder="Enter date (e.g. 2025-04-06 or 04)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
  
          <label>Moon Phase:</label>
          <input
            type="range"
            min="0"
            max="7"
            value={moonPhaseFilter}
            onChange={(e) => setMoonPhaseFilter(Number(e.target.value))}
          />
        </div>
  
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Temperature</th>
                <th>Moon Rise</th>
                <th>Moon Set</th>
                <th>Moon Phase</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.date}</td>
                  <td>{item.temp}°F</td>
                  <td>{item.moonRise}</td>
                  <td>{item.moonSet}</td>
                  <td>{item.moonPhaseIcon}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );  
};

export default AstroCard;

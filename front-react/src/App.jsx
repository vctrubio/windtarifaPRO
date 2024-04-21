import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'


function showRow(row) {
  function formatKey(key) {
    return key
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  const windDData = [];
  const windSData = [];
  const temperatureData = [];
  const rainData = [];
  const cloudData = [];
  const time = row.t_hour;
  Object.entries(row)
    .filter(([key]) => !key.startsWith('t_'))
    .forEach(([key, value]) => {
      console.log('key: ', key);
      if (key.includes('wind_direction')) {
        windDData.push(<p key={key}>{formatKey(key)}: {value}</p>);
      }
      else if (key.includes('wind_speed')) {
        windSData.push(<p key={key}>{formatKey(key)}: {value}</p>);
      }
      else if (key.includes('temperature')) {
        temperatureData.push(<p key={key}>{formatKey(key)}: {value}</p>);
      }

      else if (key.includes('rain')) {
        rainData.push(<p key={key}>{formatKey(key)}: {value}</p>);
      } else if (key.includes('cloud')) {
        cloudData.push(<p key={key}>{formatKey(key)}: {value}</p>);
      }
    });

  return (
    <div>
      <h2>{time}:hrs</h2>
      <div>{windDData}</div>
      <br></br>
      <div>{windSData}</div>
      <br></br>
      <div>{cloudData}</div>
      <br></br>
      <div>{temperatureData}</div>
      <br></br>
      <div>{rainData}</div>
    </div>
  );
}

function App() {
  const [rows, setRows] = useState({});
  const [date, setDate] = useState(new Date().toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' }));
  const [time, setTime] = useState(new Date().getHours());
  
  useEffect(() => {
    axios.get('http://localhost:3000')
    .then(response => {
        console.log('response status to api: ', response.status)
        setRows(response.data);
      })
      .catch(error => {
        console.error('Error fetching rows', error);
      });
    }, []);
    
    window.rows = rows;
    window.date = date;
    window.time = time;
    
  const dayLightSaving = 22;
  return (
    <div className='d-flex justify-content-start flex-row' >
      <h1>Wind Tarifa</h1>
      <p>{date}</p>
      <br></br>
      {rows[date] &&
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', width: '100%', margin: '0px 10px' }}>
          {
            [...Array(Math.min(5, dayLightSaving - time))].map((_, i) => showRow(rows[date][time + i]))
          }
        </div>
      }
    </div>
  )
}

export default App

import { useState, useEffect } from 'react'
import { returnDataJson } from './ApiCall.js'
import { ViewAll } from './ForAllPage.jsx'
import { FrontPage } from './FrontPage.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'


function App() {
  const [rows, setRows] = useState({});
  const [date, setDate] = useState(new Date().toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' }));
  const [time, setTime] = useState(new Date().getHours());

  window.row = rows;
  
  const routes = [
    { path: '/wind', element: <ViewAll rows={rows} date={date} time={time} /> },
    { path: '/', element: <FrontPage rows={rows} date={date} time={time}/> },
  ];

  useEffect(() => {
    returnDataJson()
      .then(data => {
        setRows(data);
      })
      .catch(error => {
        console.error('Error fetching rows', error);
      });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {routes.map((route) => (
          <Route key={route.path} {...route} />
        ))}
      </Routes>
    </BrowserRouter>
  );
}

export default App

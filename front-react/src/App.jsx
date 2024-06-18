import { useState, useEffect } from 'react'
import { returnDataJson } from './ApiCall.js'
import { ViewAll } from './ForAllPage.jsx'
import { FrontPage } from './FrontPage.jsx'
import ErrorPage from "./error-page.jsx";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'

function App() {
  const [rows, setRows] = useState({});
  const [date, setDate] = useState(new Date().toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' }));
  const [time, setTime] = useState(new Date().getHours());

  const routes = [
    {
      path: '/',
      element: <FrontPage rows={rows} date={date} time={time} />
    },
    {
      path: '/wind',
      element: <ViewAll rows={rows} date={date} time={time} />,
    },
    { path: '*', element: <ErrorPage /> }, // This will match any path that hasn't been matched by previous routes
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
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
    </BrowserRouter>
  );
}

export default App

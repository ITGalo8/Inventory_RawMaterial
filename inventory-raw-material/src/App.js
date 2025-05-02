import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './Auth/LoginScreen';
import Dashboard from './screens/Dashboard/Dashboard';


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/Dashboard" element={<Dashboard />} />
    </Routes>
  );
};

export default App;

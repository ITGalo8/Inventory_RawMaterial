import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './Auth/LoginScreen';
// import AdminPage from './pages/AdminPage';


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      {/* <Route path="/admin" element={<AdminPage />} /> */}
    </Routes>
  );
};

export default App;

import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './screens/Sidebar/Sidebar';
import LoginPage from './Auth/LoginScreen';
import Dashboard from './screens/Dashboard/Dashboard';
import AllDefective from './screens/Dashboard/AllDefectiveData/AllDefective';

const App = () => {
  const location = useLocation();

  const hideSidebarRoutes = ['/'];

  const shouldShowSidebar = !hideSidebarRoutes.includes(location.pathname);

  return (
    <div style={{ display: 'flex' }}>
      {shouldShowSidebar && <Sidebar />}
      <div style={{ flex: 1, padding: 20 }}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/AllDefective" element={<AllDefective />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;

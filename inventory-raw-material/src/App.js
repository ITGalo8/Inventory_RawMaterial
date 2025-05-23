// import React from 'react';
// import { Routes, Route, useLocation } from 'react-router-dom';
// import Sidebar from './screens/Sidebar/Sidebar';
// import LoginPage from './Auth/LoginScreen';
// import Dashboard from './screens/Dashboard/Dashboard';
// import AllDefective from './screens/Dashboard/AllDefectiveData/AllDefective';

// const App = () => {
//   const location = useLocation();

//   const hideSidebarRoutes = ['/'];

//   const shouldShowSidebar = !hideSidebarRoutes.includes(location.pathname);

//   return (
//     <div style={{ display: 'flex' }}>
//       {shouldShowSidebar && <Sidebar />}
//       <div style={{ flex: 1, padding: 20 }}>
//         <Routes>
//           <Route path="/" element={<LoginPage />} />
//           <Route path="/Dashboard" element={<Dashboard />} />
//           <Route path="/AllDefective" element={<AllDefective />} />
//         </Routes>
//       </div>
//     </div>
//   );
// };

// export default App;


import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './Auth/LoginScreen';
import Dashboard from './screens/Dashboard/Dashboard';
import AllDefective from './screens/Dashboard/AllDefectiveData/AllDefective';
import Sidebar from './screens/Sidebar/Sidebar';
import Bom from './screens/Bom/Bom';
import ProductCount from './screens/ProductCount/ProductCount';
import EmptyBomStock from './screens/ProductCount/InsufficientRawMaterials/EmptyBomStock';
import Repair from './screens/Repair/Repair';
import RepairHistory from './screens/Repair/RepairHistory/RepairHistory';
import Reject from './screens/Reject/Reject';
import RejectHistory from './screens/Reject/RejectHistory/RejectHistory';
import AddItem from './screens/AddItem/AddItem';
import AddRawMaterial from './screens/Add Raw Material/AddRawMaterial';
import BomStock from './screens/Bom Stock/BomStock';
import UpdateStockMaterial from './screens/Bom Stock/UpdateStockMaterial/UpdateStockMaterial';
import NewProduction from './screens/New Production/NewProduction';


const App = () => {
  console.log(process.env.REACT_APP_API_URL);

  return (
    <div style={{ padding: 20 }}>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/AllDefective" element={<AllDefective />} />
        <Route path="/Sidebar" element={<Sidebar />} />
        <Route path="/Bom" element={<Bom/>} />
        <Route path="/ProductCount" element={<ProductCount/>} />
        <Route path="/EmptyBomStock" element={<EmptyBomStock/>} />
        <Route path="/Repair" element={<Repair/>} />
        <Route path="/RepairHistory" element={<RepairHistory/>} />
        <Route path="/Reject" element={<Reject/>} />
        <Route path="/RejectHistory" element={<RejectHistory/>} />
        <Route path="/AddItem" element={<AddItem/>} />
        <Route path="/AddRawMaterial" element={<AddRawMaterial/>} />
        <Route path="/BomStock" element={<BomStock/>} />
        <Route path="/UpdateStockMaterial" element={<UpdateStockMaterial/>} />
        <Route path="/NewProduction" element={<NewProduction/>} />
        

      </Routes>
    </div>
  );
};

export default App;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StoreIcon from '@mui/icons-material/Store';
import AddBoxIcon from '@mui/icons-material/AddBox';
import SubtitlesIcon from '@mui/icons-material/Subtitles';
import BuildIcon from '@mui/icons-material/Build';
import DeleteIcon from '@mui/icons-material/Delete';
import ListIcon from '@mui/icons-material/List';
import HistoryIcon from '@mui/icons-material/History';
import HistoryToggleOffIcon from '@mui/icons-material/HistoryToggleOff';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Logout from './Logout';
import logo from '../assets/images/Galo.png';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'http://88.222.214.93:5000/admin/showDefectiveItemsOfWarehouse',
        );
        setData(response.data.data);
      } catch (error) {
        console.log('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleMoreInfo = (itemType) => {
    navigate('/all-defective-data', { state: { itemType } });
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loading) {
    return (
      <div className="loader">
        <div className="spinner"></div>
      </div>
    );
  }

  const menuItems = [
    {
      icon: <StoreIcon />,
      title: 'Bom Stock',
      onPress: () => navigate('/stock'),
    },
    {
      icon: <AddBoxIcon />,
      title: 'AddItem',
      onPress: () => navigate('/add-item'),
    },
    {
      icon: <SubtitlesIcon />,
      title: 'Add Raw Material',
      onPress: () => navigate('/add-sub-item'),
    },
    {
      icon: <BuildIcon />,
      title: 'Repair',
      onPress: () => navigate('/repair'),
    },
    {
      icon: <DeleteIcon />,
      title: 'Reject',
      onPress: () => navigate('/reject'),
    },
    {
      icon: <ListIcon />,
      title: 'BOM',
      onPress: () => navigate('/bom'),
    },
    {
      icon: <HistoryIcon />,
      title: 'Repair History',
      onPress: () => navigate('/repair-history'),
    },
    {
      icon: <HistoryToggleOffIcon />,
      title: 'Reject History',
      onPress: () => navigate('/reject-history'),
    },
    {
      icon: <AccountBoxIcon />,
      title: 'Product Count',
      onPress: () => navigate('/product-count'),
    },
    {
      icon: <ProductionQuantityLimitsIcon />,
      title: 'New Making Product',
      onPress: () => navigate('/new-making-item'),
    },
  ];

  return (
    <div className="dashboard-container">
      <div className="header">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo-image" />
          <h1 className="header-text">RMS ADMIN</h1>
        </div>
        <div className="header-controls">
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            ☰
          </button>
          <Logout />
        </div>
      </div>

      <Sidebar 
        isOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar} 
        menuItems={menuItems} 
      />

      <div className="main-content">
        <div className="cards-container">
          <div className="card-wrapper">
            <button
              className="more-info-button"
              onClick={() => handleMoreInfo('Pump')}
            >
              More Info
            </button>
            <Card
              backgroundColor="#E1341E"
              title="Pump"
              content="Total Defective"
              quantity={
                data?.totalsByGroup?.find((item) => item.item === 'Pump')
                  ?.defectiveCount || 0
              }
            />
          </div>

          <div className="card-wrapper">
            <button
              className="more-info-button"
              onClick={() => handleMoreInfo('Controller')}
            >
              More Info
            </button>
            <Card
              backgroundColor="#97bcc7"
              title="Controller"
              content="Total Defective"
              quantity={
                data?.totalsByGroup?.find((item) => item.item === 'Controller')
                  ?.defectiveCount || 0
              }
            />
          </div>

          <div className="card-wrapper">
            <button
              className="more-info-button"
              onClick={() => handleMoreInfo('Motor')}
            >
              More Info
            </button>
            <Card
              backgroundColor="#FFAEBC"
              title="Motor"
              content="Total Defective"
              quantity={
                data?.totalsByGroup?.find((item) => item.item === 'Motor')
                  ?.defectiveCount || 0
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import pumpIcon from '../../assets/Galo.png';

const SimpleCard = ({ backgroundColor, title, content, quantity }) => (
  <div className="card" style={{ backgroundColor }}>
    <h2>{title}</h2>
    <p>{content}</p>
    <h3>{quantity}</h3>
  </div>
);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const itemTypes = [
    { title: 'Pump', color: '#E1341E' },
    { title: 'Controller', color: '#97bcc7' },
    { title: 'Motor', color: '#FFAEBC' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'http://88.222.214.93:5000/admin/showDefectiveItemsOfWarehouse'
        );
        setData(response.data.data);
      } catch (err) {
        const errMsg = err.response?.data?.message || err.message || 'Unknown error';
        setError(errMsg);
        alert('Error: ' + errMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleMoreInfo = (itemType) => {
    navigate('/AllDefective', { state: { itemType } });
  };

  if (loading) {
    return (
      <div className="loader">
        <div className="spinner" role="status" aria-live="polite"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="header">
        <div className="logo-container">
          <img src={pumpIcon} alt="Logo" className="logo-image" />
          <h1 className="header-text">RMS ADMIN</h1>
        </div>
      </div>

      <div className="main-content">
        <div className="cards-container">
          {itemTypes.map(({ title, color }) => {
            const itemData = data?.totalsByGroup?.find(item => item.item === title);
            return (
              <div className="card-wrapper" key={title}>
                <button className="more-info-button" onClick={() => handleMoreInfo(title)}>
                  More Info
                </button>
                <SimpleCard
                  backgroundColor={color}
                  title={title}
                  content="Total Defective"
                  quantity={itemData?.defectiveCount || 0}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

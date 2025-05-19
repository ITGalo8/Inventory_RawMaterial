import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';
import Api from '../../../Auth/Api';
import './AllDefective.css';

const AllDefective = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { itemType } = location.state || {};
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchDefectiveData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await Api.get(
        `/admin/showDefectiveItemsList?itemName=${itemType}`,
        { withCredentials: true }
      );
      setData(response.data.data || []);
    } catch (err) {
      const backendError = err.response?.data?.message || err.response?.data?.error || err.message;
      setError(backendError);
      
      if (retryCount < 3 && !err.response) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDefectiveData();
  }, [itemType, retryCount]);

  if (loading) {
    return (
      <div className="centered-container">
        <div className="spinner"></div>
        <p>Loading {itemType} items...</p>
        {retryCount > 0 && (
          <p className="retry-message">Attempting to reconnect... ({retryCount}/3)</p>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className="centered-container">
        <div className="error-display">
          <FaExclamationTriangle className="error-icon" />
          <h3>Error Loading Data</h3>
          <p className="error-message">{error}</p>
          <div className="error-actions">
            <button 
              onClick={() => {
                setRetryCount(0);
                fetchDefectiveData();
              }}
              className="retry-button"
            >
              Retry
            </button>
            <button 
              onClick={() => navigate(-1)}
              className="back-button"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="all-defective-container">
      <h1 className="centered-header">{itemType} Defective Items</h1>

      <div className="content">
        {data.length === 0 ? (
          <div className="no-data">
            <p>No defective items found for {itemType}</p>
            <button 
              onClick={() => fetchDefectiveData()}
              className="refresh-button"
            >
              Refresh Data
            </button>
          </div>
        ) : (
          <div className="defective-items-table">
            <div className="table-header">
              <span className="item-name">Item Name</span>
              <span className="defective-count">Defective Count</span>
            </div>
            <div className="table-body">
              {data.map((item, index) => (
                <div key={`${item.itemId || index}`} className="table-row">
                  <span className="item-name">{item.itemName}</span>
                  <span className="defective-count">{item.defective}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllDefective;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './AllDefective.css'; 

const AllDefective = () => {
  const { itemType } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDefectiveData = async () => {
      try {
        const response = await axios.get(
          `http://88.222.214.93:5000/admin/showDefectiveItemsList?itemName=${itemType}`
        );
        setData(response.data.data || []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDefectiveData();
  }, [itemType]);

  if (loading) {
    return (
      <div className="centered-container">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="centered-container">
        <p className="error-text">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="all-defective-container">
      <div className="header">
        <button onClick={() => navigate(-1)} className="back-button">
          ←
        </button>
        <h1>{itemType} Defective Items</h1>
      </div>

      <div className="content">
        {data.length === 0 ? (
          <p className="no-data-text">No defective items found for {itemType}</p>
        ) : (
          <ul className="defective-list">
            {data.map((item, index) => (
              <li key={index} className="defective-item">
                <span className="item-name">{item.itemName}</span>
                <span className="defective-count">{item.defective}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AllDefective;

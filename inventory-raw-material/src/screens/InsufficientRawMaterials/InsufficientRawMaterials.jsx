import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './InsufficientRawMaterials.css';

const InsufficientRawMaterials = () => {
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState(null);
  const [insufficientMaterials, setInsufficientMaterials] = useState([]);
  const [error, setError] = useState(null);

  const location = useLocation();
  const { itemId } = location.state || {};

  useEffect(() => {
    const fetchInsufficientMaterials = async () => {
      try {
        const response = await axios.get(
          `http://88.222.214.93:5000/admin/getInsufficientRawMaterials?itemId=${itemId}`
        );
        setItem(response.data.item);
        setInsufficientMaterials(response.data.insufficientMaterials);
      } catch (err) {
        console.error('Error:', err);
        setError(err.response?.data?.message || err.message);
        alert('Error: ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };

    if (itemId) {
      fetchInsufficientMaterials();
    } else {
      setError('Item ID is missing');
      setLoading(false);
    }
  }, [itemId]);

  if (loading) {
    return (
      <div className="center">
        <div className="spinner" role="status" />
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="center">
        <p className="error">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="header">Insufficient Raw Materials</h2>
      {item && <p className="sub-header">For Item: {item.itemName}</p>}
      <div className="list">
        {insufficientMaterials.map(material => (
          <div className="card" key={material.rawMaterialId}>
            <h4 className="name">{material.rawMaterialName}</h4>
            <p className="text">Available Stock: {material.availableStock}</p>
            <p className="text">Required Quantity: {material.requiredQuantity}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsufficientRawMaterials;

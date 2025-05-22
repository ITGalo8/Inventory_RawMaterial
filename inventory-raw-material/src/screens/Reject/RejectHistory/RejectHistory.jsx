import React, { useState, useEffect } from 'react';
import './RejectHistory.css'; // Assuming you have a CSS file for styles
import Api from '../../../Auth/Api'

const RejectHistory = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await Api.get(
        '/admin/getRejectedServiceRecords'
      );
      console.log('API Response:', response.data.data);
      setOrders(response.data.data || []);
      setFilteredOrders(response.data.data || []);
    } catch (error) {
      console.error('Fetch error:', error);
      alert('Error: Unable to fetch orders');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter(
        order =>
          order.item?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.serialNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.repairedRejectedBy?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredOrders(filtered);
    }
  }, [searchQuery, orders]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return isNaN(date)
        ? 'Invalid Date'
        : `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    } catch (e) {
      return 'N/A';
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const OrderItem = ({ item }) => (
    <div className="card">
      <p className="info-text">
        <span className="title-text">Item Name: </span>
        <span className="data-text">{item.item || 'N/A'}</span>
      </p>

      {item.subItem && (
        <p className="info-text">
          <span className="title-text">Sub Item: </span>
          <span className="data-text">{item.subItem}</span>
        </p>
      )}

      <p className="info-text">
        <span className="title-text">Quantity: </span>
        <span className="data-text">{item.quantity || 'N/A'}</span>
      </p>

      <p className="info-text">
        <span className="title-text">Serial Number: </span>
        <span className="data-text">{item.serialNumber || 'N/A'}</span>
      </p>

      {item.faultAnalysis && (
        <p className="info-text">
          <span className="title-text">Fault Analysis: </span>
          <span className="data-text">{item.faultAnalysis}</span>
        </p>
      )}

      {item.repairedRejectedBy && (
        <p className="info-text">
          <span className="title-text">Reject By: </span>
          <span className="data-text">{item.repairedRejectedBy}</span>
        </p>
      )}

      {item.remarks && (
        <p className="info-text">
          <span className="title-text">Remarks: </span>
          <span className="data-text">{item.remarks}</span>
        </p>
      )}

      {item.repairedParts?.length > 0 && (
        <div className="repaired-parts-container">
          <p className="title-text" style={{ marginBottom: '5px' }}>
            Repaired Parts:
          </p>
          {item.repairedParts.map((part, index) => (
            <div key={`${item._id}-part-${index}`} className="part-item">
              <p className="info-text">
                <span className="title-text">Material: </span>
                <span className="data-text">
                  {part.rawMaterialName || 'N/A'}
                </span>
              </p>
              <p className="info-text">
                <span className="title-text">Quantity: </span>
                <span className="data-text">{part.quantity || 'N/A'}</span>
                <span className="data-text">{part.unit}</span>
              </p>
              <p className="info-text">
                <span className="title-text">Serviced At: </span>
                <span className="data-text">
                  {formatDate(item.servicedAt) || 'Not specified'}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="container">
      <h1 className="header">Reject History</h1>

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search by item, serial, or technician"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button className="clear-button" onClick={clearSearch}>
            ×
          </button>
        )}
      </div>

      {loading ? (
        <div className="loading-indicator">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="list-container">
          {filteredOrders.length === 0 ? (
            <p className="empty-text">No rejected items found.</p>
          ) : (
            filteredOrders.map((item) => (
              <OrderItem key={item._id || Math.random()} item={item} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default RejectHistory;
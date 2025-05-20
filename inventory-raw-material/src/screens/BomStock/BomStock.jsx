import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import './BomStock.css';
import Api from '../../Auth/Api';

const BomStock = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItemType, setSelectedItemType] = useState(null);
  const navigate = useNavigate();

  const itemTypes = [
    { label: 'Motor', value: 'Motor' },
    { label: 'Pump', value: 'Pump' },
    { label: 'Controller', value: 'Controller' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Api.get(
          '/admin/getItemsProducibleCount'
        );
        setData(response.data.results);
        setFilteredData(response.data.results);
      } catch (err) {
        alert(
          'Error: ' + JSON.stringify(err.response?.data?.message || err.message)
        );
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleItemTypeChange = (selectedOption) => {
    setSelectedItemType(selectedOption);
    if (selectedOption) {
      const filtered = data.filter(item =>
        item.itemName?.toLowerCase().includes(selectedOption.value.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  };

  const renderItem = (item) => (
    <div 
      className="item-container"
      onClick={() => navigate('/EmptyBomStock', {
        state: { itemId: item.itemId }
      })}
    >
      <div className="item-info">
        <div className="item-name">{item.itemName}</div>
        <div className="item-units">
          Max producible: {item.maxProducibleUnits}
        </div>
      </div>
      {item?.maxProducibleUnits ? (
        <div className="available" />
      ) : (
        <div className="unavailable" />
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="center">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="dropdown-container">
        <Select
          options={itemTypes}
          onChange={handleItemTypeChange}
          placeholder="Select an item type..."
          isClearable
          value={selectedItemType}
          menuPortalTarget={document.body}
          styles={{
            control: (provided) => ({
              ...provided,
              fontSize: '16px',
              padding: '6px 10px',
              border: '1px solid gray',
              borderRadius: '8px',
              backgroundColor: '#fff',
              marginBottom: '20px',
              width: '100%',
              maxWidth: '400px',
              minHeight: '40px',
            }),
            menuPortal: base => ({ ...base, zIndex: 9999 }),
            menu: provided => ({ ...provided, zIndex: 9999 }),
            option: (provided, state) => ({
              ...provided,
              backgroundColor: state.isSelected ? '#2684FF' : 'white',
              color: state.isSelected ? 'white' : 'black',
              '&:hover': {
                backgroundColor: '#DEEBFF',
              },
            }),
          }}
          components={{
            DropdownIndicator: () => (
              <div style={{ padding: '0 8px' }}>▼</div>
            ),
            IndicatorSeparator: () => null
          }}
        />
      </div>
      <div className="header">Product Availability</div>
      <div className="list">
        {filteredData.map(item => (
          <React.Fragment key={item.itemId?.toString()}>
            {renderItem(item)}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default BomStock;
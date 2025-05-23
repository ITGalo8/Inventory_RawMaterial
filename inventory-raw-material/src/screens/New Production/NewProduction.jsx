import React, { useState, useEffect } from 'react';
import Api from '../../Auth/Api';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import './NewProduction.css';

const NewProduction = () => {
  const navigate = useNavigate();
  const [selectedItemType, setSelectedItemType] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemName, setSelectedItemName] = useState('');
  const [selectedDefectiveItemName, setSelectedDefectiveItemName] = useState('');
  const [items, setItems] = useState([]);
  const [defectiveItems, setDefectiveItems] = useState([]);
  const [selectedDefectiveItem, setSelectedDefectiveItem] = useState(null);
  const [quantityProduced, setQuantityProduced] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const itemTypes = [
    { label: 'Motor', value: 'Motor' },
    { label: 'Pump', value: 'Pump' },
    { label: 'Controller', value: 'Controller' },
  ];

  useEffect(() => {
    if (selectedItemType) {
      fetchItems(selectedItemType);
    } else {
      resetSelections();
    }
  }, [selectedItemType]);

  const resetSelections = () => {
    setItems([]);
    setSelectedItem(null);
    setSelectedItemName('');
    setDefectiveItems([]);
    setSelectedDefectiveItem(null);
    setSelectedDefectiveItemName('');
    setQuantityProduced('');
  };

  const fetchItems = async (itemName) => {
    setLoading(true);
    setError(null);
    try {
      const response = await Api.get(`/admin/getItemsByName?searchQuery=${itemName}`);
      setItems(response.data.data || []);
    } catch (err) {
      setError('Failed to fetch items');
      alert(`Error: ${err?.response?.data?.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchDefectiveItems = async (itemType, subItem) => {
    setLoading(true);
    setError(null);
    try {
      const response = await Api.get(`/admin/showDefectiveItemsList?itemName=${subItem}`);
      if (response.data.success) {
        setDefectiveItems(response.data.data || []);
      } else {
        setError(response.data.message || 'No defective items found');
      }
    } catch (err) {
      setError('Failed to fetch defective items');
      alert(`Error: ${err?.response?.data?.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleProceed = async () => {
    if (!selectedDefectiveItem) {
      alert('Please select a defective item to proceed');
      return;
    }

    if (!quantityProduced || isNaN(quantityProduced) || Number(quantityProduced) <= 0) {
      alert('Please enter a valid quantity produced');
      return;
    }

    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');

      const payload = {
        itemId: selectedItem,
        subItem: selectedDefectiveItemName,
        quantityProduced: Number(quantityProduced),
        userId: userId,
      };

      const response = await Api.post('/admin/produceNewItem', payload);

      if (response.data.success) {
        alert('New item produced successfully!');
        resetSelections();
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert(`Error: ${error?.response?.data?.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="heading">New Making Product</h1>

      <div className="dropdown-container">
        <Select
          onChange={(option) => {
            resetSelections();
            setSelectedItemType(option?.value);
          }}
          options={itemTypes}
          placeholder="Select an item type..."
          styles={customSelectStyles}
          value={itemTypes.find(opt => opt.value === selectedItemType)}
        />
      </div>

      {loading && <div className="loader">Loading...</div>}
      {error && <div className="error-text">{error}</div>}

      {items.length > 0 && (
        <div className="dropdown-container">
          <Select
            onChange={(option) => {
              const selected = items.find(item => item.id === option?.value);
              setSelectedItem(option?.value);
              setSelectedItemName(selected?.name || '');
              fetchDefectiveItems(selectedItemType, selected?.name || '');
            }}
            options={items.map(item => ({
              label: item.name,
              value: item.id,
            }))}
            placeholder="Select a specific item..."
            styles={customSelectStyles}
            value={items.find(item => item.id === selectedItem)}
          />
        </div>
      )}

      {defectiveItems.length > 0 && (
        <>
          <div className="dropdown-container">
            <Select
              onChange={(option) => {
                const selected = defectiveItems.find(item => item._id === option?.value);
                setSelectedDefectiveItem(option?.value);
                setSelectedDefectiveItemName(selected?.itemName || '');
              }}
              options={defectiveItems.map(item => ({
                label: item.itemName,
                value: item._id,
              }))}
              placeholder="Select a defective item..."
              styles={customSelectStyles}
              value={defectiveItems.find(item => item._id === selectedDefectiveItem)}
            />
          </div>

          <input
            className="input"
            placeholder="Enter quantity produced"
            type="number"
            value={quantityProduced}
            onChange={(e) => setQuantityProduced(e.target.value)}
          />

          <button
            className={`proceed-button ${
              (!selectedDefectiveItem || !quantityProduced) ? 'disabled-button' : ''
            }`}
            onClick={handleProceed}
            disabled={!selectedDefectiveItem || !quantityProduced}
          >
            Proceed to Repair
          </button>
        </>
      )}
    </div>
  );
};

const customSelectStyles = {
  control: (provided) => ({
    ...provided,
    fontSize: '16px',
    minHeight: '48px',
    height: '48px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    color: 'black',
    width: '100%',
    boxShadow: 'none',
  }),
  valueContainer: (provided) => ({
    ...provided,
    height: '48px',
    padding: '0 10px',
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    height: '48px',
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
};

export default NewProduction;

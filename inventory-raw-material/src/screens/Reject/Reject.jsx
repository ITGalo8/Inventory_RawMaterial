import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Reject.css'; // We'll create this CSS file for styling
import Api from '../../Auth/Api'

const Reject = () => {
  const [selectedItemType, setSelectedItemType] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState('1');
  const [serialNumber, setSerialNumber] = useState('');
  const [faultType, setFaultType] = useState('');
  const [faultAnalysis, setFaultAnalysis] = useState('');
  const [repairedBy, setRepairedBy] = useState('');
  const [remark, setRemark] = useState('');

  const [itemList, setItemList] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [units, setUnits] = useState([]);
  const [materialUnits, setMaterialUnits] = useState({});

  const [loading, setLoading] = useState(false);
  const [loadingMaterials, setLoadingMaterials] = useState(false);
  const [loadingUnits, setLoadingUnits] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [backendErrors, setBackendErrors] = useState({});

  const itemTypes = [
    { label: 'Motor', value: 'Motor' },
    { label: 'Pump', value: 'Pump' },
    { label: 'Controller', value: 'Controller' },
  ];

  const faultTypes = [
    'Controller IGBT Issue',
    'Controller Display Issue',
    'Winding Problem',
    'Bush Problem',
    'Stamping Damaged',
    'Thrust Plate Damage',
    'Shaft and Rotor Damaged',
    'Bearing Plate Damaged',
    'Oil Seal Damaged',
    'Other',
  ];

  useEffect(() => {
    const fetchUnits = async () => {
      setLoadingUnits(true);
      try {
        const response = await Api.get('/admin/showUnit');
        if (response.data.success) {
          setUnits(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching units:', error);
      } finally {
        setLoadingUnits(false);
      }
    };

    fetchUnits();
  }, []);

  useEffect(() => {
    if (selectedItemType) {
      fetchItemList(selectedItemType);
    } else {
      setItemList([]);
      setSelectedItem(null);
    }
  }, [selectedItemType]);

  useEffect(() => {
    const fetchItems = async () => {
      if (!selectedItem) {
        setAllItems([]);
        setFilteredItems([]);
        return;
      }

      setLoadingMaterials(true);
      setBackendErrors(prev => ({ ...prev, materials: null }));
      try {
        const response = await Api.get(
          `/admin/getItemRawMaterials?subItem=${encodeURIComponent(
            selectedItem.itemName,
          )}`,
        );

        if (response.data.success) {
          const items = response.data.data.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
          }));
          setAllItems(items);
          setFilteredItems(items);
        } else {
          setBackendErrors(prev => ({
            ...prev,
            materials: response.data.message || 'Failed to load materials',
          }));
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          'Failed to fetch materials';
        setBackendErrors(prev => ({
          ...prev,
          materials: errorMessage,
        }));
        console.log('Error fetching materials:', error);
      } finally {
        setLoadingMaterials(false);
      }
    };

    fetchItems();
  }, [selectedItem]);

  const fetchItemList = async itemType => {
    const storedUserId = localStorage.getItem('userId');
    setLoading(true);
    setError(null);
    setBackendErrors(prev => ({ ...prev, items: null }));
    try {
      const response = await Api.get(
        `/admin/showDefectiveItemsList?itemName=${itemType}`,
      );
      if (response.data && response.data.data) {
        setItemList(response.data.data);
      } else {
        setItemList([]);
        setBackendErrors(prev => ({
          ...prev,
          items: response.data.message || `No ${itemType} items found`,
        }));
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        `Failed to fetch ${itemType} items`;
      setBackendErrors(prev => ({
        ...prev,
        items: errorMessage,
      }));
      console.error('Error fetching item list:', err);
      setItemList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleItemSelect = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setSelectedItems(selected);
    
    const newQuantities = { ...quantities };
    const newUnits = { ...materialUnits };
    
    selected.forEach(itemId => {
      if (!newQuantities[itemId]) {
        newQuantities[itemId] = '';
      }
      if (!newUnits[itemId] && units.length > 0) {
        newUnits[itemId] = units[0].id;
      }
    });
    
    setQuantities(newQuantities);
    setMaterialUnits(newUnits);
  };

  const handleUnitChange = (itemId, unitId) => {
    setMaterialUnits(prev => ({
      ...prev,
      [itemId]: unitId,
    }));
  };

  const handleSearch = (e) => {
    const text = e.target.value;
    if (text) {
      const filtered = allItems.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(allItems);
    }
  };

  const handleQuantityChange = (itemId, value) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBackendErrors({});

    // Frontend validation
    const validationErrors = {};

    if (!selectedItemType) {
      validationErrors.itemType = 'Please select an item type';
    }

    if (!selectedItem) {
      validationErrors.item = 'Please select a specific item';
    }

    if (!quantity || isNaN(parseFloat(quantity))) {
      validationErrors.quantity = 'Please enter a valid quantity';
    } else if (parseFloat(quantity) <= 0) {
      validationErrors.quantity = 'Quantity must be greater than 0';
    } else if (parseFloat(quantity) > selectedItem?.defective) {
      validationErrors.quantity = `Quantity cannot exceed ${selectedItem.defective}`;
    }

    if (!faultType) {
      validationErrors.faultType = 'Please select a fault type';
    }

    if (faultType === 'Other' && !faultAnalysis) {
      validationErrors.faultAnalysis = 'Please provide fault analysis details';
    }

    if (!repairedBy) {
      validationErrors.repairedBy = 'Please enter the repair person name';
    }

    // Validate raw materials quantities
    for (const itemId of selectedItems) {
      const qty = quantities[itemId];
      if (!qty || isNaN(parseFloat(qty)) || parseFloat(qty) <= 0) {
        const item = allItems.find(i => i.id === itemId);
        validationErrors[
          `material_${itemId}`
        ] = `Please enter a valid quantity for ${item?.name}`;
      }
    }

    if (Object.keys(validationErrors).length > 0) {
      setBackendErrors(validationErrors);
      return;
    }

    const userId = localStorage.getItem('userId');
    const rejectData = {
      item: selectedItemType,
      subItem: selectedItem.itemName,
      quantity: parseFloat(quantity),
      serialNumber,
      faultAnalysis: faultType === 'Other' ? faultAnalysis : faultType,
      isRepaired: false,
      repairedRejectedBy: repairedBy,
      remarks: remark,
      userId,
      repairedParts: selectedItems.map(itemId => {
        const item = allItems.find(i => i.id === itemId);
        const unit = units.find(u => u.id === materialUnits[itemId]);
        return {
          rawMaterialId: itemId,
          quantity: parseFloat(quantities[itemId]) || 0,
          unit: unit?.name || '',
        };
      }),
    };

    try {
      setSubmitting(true);
      const response = await Api.post(
        '/admin/addServiceRecord',
        rejectData,
      );

      if (response.data.success) {
        alert('Success', 'Repair data submitted successfully');
        // Reset form
        setSelectedItemType(null);
        setSelectedItem(null);
        setQuantity('');
        setSerialNumber('');
        setFaultType('');
        setFaultAnalysis('');
        setRepairedBy('');
        setRemark('');
        setSelectedItems([]);
        setQuantities({});
        setMaterialUnits({});
        setBackendErrors({});
      } else {
        throw new Error(response.data.message || 'Submission failed');
      }
    } catch (error) {
      console.log(
        'Error fetching data:',
        error.response?.data || error.message,
      );
      alert('Error', JSON.stringify(error.response.data?.message));

      let errorMessage = 'Submission failed';
      if (error.response) {
        if (error.response.data.errors) {
          const serverErrors = {};
          Object.keys(error.response.data.errors).forEach(key => {
            serverErrors[key] = error.response.data.errors[key].msg;
          });
          setBackendErrors(serverErrors);
          return;
        }
        errorMessage = error.response.data.message || errorMessage;
      } else {
        errorMessage = error.message || errorMessage;
      }

      alert('Error', errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="form-container">
        <h1 className="heading">Reject Data Entry</h1>
        
        <div className="section">
          <label className="label">Item Type*</label>
          <select
            value={selectedItemType || ''}
            onChange={e => {
              setSelectedItemType(e.target.value);
              setSelectedItem(null);
              setBackendErrors(prev => ({ ...prev, itemType: null }));
            }}
            className={`select ${backendErrors.itemType ? 'error' : ''}`}
          >
            <option value="">Select item type</option>
            {itemTypes.map((item, index) => (
              <option key={index} value={item.value}>{item.label}</option>
            ))}
          </select>
          {backendErrors.itemType && (
            <div className="error-text">{backendErrors.itemType}</div>
          )}
        </div>

        {selectedItemType && itemList.length > 0 && (
          <div className="section">
            <label className="label">Select {selectedItemType}*</label>
            <select
              value={selectedItem ? selectedItem.itemName : ''}
              onChange={e => {
                const selected = itemList.find(item => item.itemName === e.target.value);
                setSelectedItem(selected);
                setBackendErrors(prev => ({ ...prev, item: null }));
              }}
              className={`select ${backendErrors.item ? 'error' : ''}`}
            >
              <option value="">Select {selectedItemType}</option>
              {itemList.map((item, index) => (
                <option key={index} value={item.itemName}>
                  {item.itemName} (Defective: {item.defective})
                </option>
              ))}
            </select>
            {backendErrors.item && (
              <div className="error-text">{backendErrors.item}</div>
            )}
          </div>
        )}

        {selectedItem && !loadingMaterials && (
          <div className="section">
            <label className="label">Select Raw Materials:</label>
            {backendErrors.materials && (
              <div className="error-text">{backendErrors.materials}</div>
            )}
            <input
              type="text"
              placeholder="Search Raw Materials..."
              onChange={handleSearch}
              className="search-input"
            />
            <select
              multiple
              value={selectedItems}
              onChange={handleItemSelect}
              className="multi-select"
            >
              {filteredItems.map(item => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedItems.length > 0 && (
          <div className="scroll-container">
            {selectedItems.map(itemId => {
              const item = allItems.find(i => i.id === itemId);
              const errorKey = `material_${itemId}`;

              return (
                <div key={itemId} className="section">
                  <label className="label">{item?.name}</label>
                  <div className="quantity-row">
                    <input
                      type="number"
                      value={quantities[itemId] || ''}
                      onChange={e => {
                        handleQuantityChange(itemId, e.target.value);
                        setBackendErrors(prev => ({ ...prev, [errorKey]: null }));
                      }}
                      className={`quantity-input ${backendErrors[errorKey] ? 'error' : ''}`}
                      placeholder="Qty"
                      step="any"
                    />
                    {loadingUnits ? (
                      <div className="loading">Loading...</div>
                    ) : (
                      <select
                        value={materialUnits[itemId] || ''}
                        onChange={e => handleUnitChange(itemId, e.target.value)}
                        className="unit-select"
                      >
                        {units.map(unit => (
                          <option key={unit.id} value={unit.id}>
                            {unit.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  
                  {backendErrors[errorKey] && (
                    <div className="error-text">{backendErrors[errorKey]}</div>
                  )}
                </div>
              );
            })}

            <div className="section">
              <label className="label">Serial Number</label>
              <input
                type="text"
                className="input"
                value={serialNumber}
                onChange={e => setSerialNumber(e.target.value)}
                placeholder="Enter serial number"
              />
            </div>

            <div className="section">
              <label className="label">Fault Type*</label>
              <select
                value={faultType}
                onChange={e => {
                  setFaultType(e.target.value);
                  setBackendErrors(prev => ({ ...prev, faultType: null }));
                }}
                className={`select ${backendErrors.faultType ? 'error' : ''}`}
              >
                <option value="">Select fault type</option>
                {faultTypes.map((fault, index) => (
                  <option key={index} value={fault}>{fault}</option>
                ))}
              </select>
              {backendErrors.faultType && (
                <div className="error-text">{backendErrors.faultType}</div>
              )}
            </div>

            {faultType === 'Other' && (
              <div className="section">
                <label className="label">Fault Analysis Details*</label>
                <textarea
                  className={`textarea ${backendErrors.faultAnalysis ? 'error' : ''}`}
                  placeholder="Describe the fault..."
                  value={faultAnalysis}
                  onChange={e => {
                    setFaultAnalysis(e.target.value);
                    setBackendErrors(prev => ({ ...prev, faultAnalysis: null }));
                  }}
                  rows={4}
                />
                {backendErrors.faultAnalysis && (
                  <div className="error-text">{backendErrors.faultAnalysis}</div>
                )}
              </div>
            )}

            <div className="section">
              <label className="label">Reject By*</label>
              <input
                type="text"
                className={`input ${backendErrors.repairedBy ? 'error' : ''}`}
                placeholder="Enter technician name"
                value={repairedBy}
                onChange={e => {
                  setRepairedBy(e.target.value);
                  setBackendErrors(prev => ({ ...prev, repairedBy: null }));
                }}
              />
              {backendErrors.repairedBy && (
                <div className="error-text">{backendErrors.repairedBy}</div>
              )}
            </div>

            <div className="section">
              <label className="label">Remarks</label>
              <textarea
                className="textarea"
                placeholder="Any additional notes..."
                value={remark}
                onChange={e => setRemark(e.target.value)}
                rows={3}
              />
            </div>

            <button
              type="submit"
              className={`button ${submitting ? 'disabled' : ''}`}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Data'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Reject;
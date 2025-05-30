// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import Select from 'react-select';
// import './Repair.css';
// import Api from '../../Auth/Api'

// const Repair = () => {
//   const [selectedItemType, setSelectedItemType] = useState(null);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [quantity, setQuantity] = useState('1');
//   const [serialNumber, setSerialNumber] = useState('');
//   const [faultType, setFaultType] = useState('');
//   const [faultAnalysis, setFaultAnalysis] = useState('');
//   const [repairedBy, setRepairedBy] = useState('');
//   const [remark, setRemark] = useState('');

//   const [itemList, setItemList] = useState([]);
//   const [allItems, setAllItems] = useState([]);
//   const [filteredItems, setFilteredItems] = useState([]);
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [quantities, setQuantities] = useState({});
//   const [units, setUnits] = useState([]);
//   const [materialUnits, setMaterialUnits] = useState({});

//   const [loading, setLoading] = useState(false);
//   const [loadingMaterials, setLoadingMaterials] = useState(false);
//   const [loadingUnits, setLoadingUnits] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState(null);
//   const [backendErrors, setBackendErrors] = useState({});
//   const navigate = useNavigate();

//   const itemTypes = [
//     { label: 'Motor', value: 'Motor' },
//     { label: 'Pump', value: 'Pump' },
//     { label: 'Controller', value: 'Controller' },
//   ];

//   const faultTypes = [
//     'Controller IGBT Issue',
//     'Controller Display Issue',
//     'Winding Problem',
//     'Bush Problem',
//     'Stamping Damaged',
//     'Thrust Plate Damage',
//     'Shaft and Rotor Damaged',
//     'Bearing Plate Damaged',
//     'Oil Seal Damaged',
//     'Other',
//   ];

//   useEffect(() => {
//     const fetchUnits = async () => {
//       setLoadingUnits(true);
//       try {
//         const response = await Api.get('/admin/showUnit');
//         if (response.data.success) {
//           setUnits(response.data.data);
//         }
//       } catch (error) {
//         console.error('Error fetching units:', error);
//       } finally {
//         setLoadingUnits(false);
//       }
//     };

//     fetchUnits();
//   }, []);

//   useEffect(() => {
//     if (selectedItemType) {
//       fetchItemList(selectedItemType);
//     } else {
//       setItemList([]);
//       setSelectedItem(null);
//     }
//   }, [selectedItemType]);

//   useEffect(() => {
//     const fetchItems = async () => {
//       if (!selectedItem) {
//         setAllItems([]);
//         setFilteredItems([]);
//         return;
//       }

//       setLoadingMaterials(true);
//       setBackendErrors(prev => ({ ...prev, materials: null }));
//       try {
//         const response = await Api.get(
//           `/admin/getItemRawMaterials?subItem=${encodeURIComponent(
//             selectedItem.itemName,
//           )}`,
//         );

//         if (response.data.success) {
//           const items = response.data.data.map(item => ({
//             id: item.id,
//             name: item.name,
//             quantity: item.quantity,
//           }));
//           setAllItems(items);
//           setFilteredItems(items);
//         } else {
//           setBackendErrors(prev => ({
//             ...prev,
//             materials: response.data.message || 'Failed to load materials',
//           }));
//         }
//       } catch (error) {
//         const errorMessage =
//           error.response?.data?.message ||
//           error.message ||
//           'Failed to fetch materials';
//         setBackendErrors(prev => ({
//           ...prev,
//           materials: errorMessage,
//         }));
//         console.log('Error fetching materials:', error);
//       } finally {
//         setLoadingMaterials(false);
//       }
//     };

//     fetchItems();
//   }, [selectedItem]);

//   const fetchItemList = async itemType => {
//     const storedUserId = localStorage.getItem('userId');
//     setLoading(true);
//     setError(null);
//     setBackendErrors(prev => ({ ...prev, items: null }));
//     try {
//       const response = await Api.get(
//         `/admin/showDefectiveItemsList?itemName=${itemType}`,
//       );
//       if (response.data && response.data.data) {
//         setItemList(response.data.data);
//       } else {
//         setItemList([]);
//         setBackendErrors(prev => ({
//           ...prev,
//           items: response.data.message || `No ${itemType} items found`,
//         }));
//       }
//     } catch (err) {
//       const errorMessage =
//         err.response?.data?.message ||
//         err.message ||
//         `Failed to fetch ${itemType} items`;
//       setBackendErrors(prev => ({
//         ...prev,
//         items: errorMessage,
//       }));
//       console.error('Error fetching item list:', err);
//       setItemList([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleItemSelect = (selectedOptions) => {
//     const selectedIds = selectedOptions.map(option => option.value);
//     setSelectedItems(selectedIds);
    
//     const newQuantities = { ...quantities };
//     const newUnits = { ...materialUnits };
    
//     selectedIds.forEach(itemId => {
//       if (!newQuantities[itemId]) {
//         newQuantities[itemId] = '';
//       }
//       if (!newUnits[itemId] && units.length > 0) {
//         newUnits[itemId] = units[0].id;
//       }
//     });
    
//     setQuantities(newQuantities);
//     setMaterialUnits(newUnits);
//   };

//   const handleUnitChange = (itemId, unitId) => {
//     setMaterialUnits(prev => ({
//       ...prev,
//       [itemId]: unitId,
//     }));
//   };

//   const handleQuantityChange = (itemId, value) => {
//     setQuantities(prev => ({
//       ...prev,
//       [itemId]: value,
//     }));
//   };

//   const handleSubmit = async () => {
//     setBackendErrors({});

//     // Frontend validation
//     const validationErrors = {};

//     if (!selectedItemType) {
//       validationErrors.itemType = 'Please select an item type';
//     }

//     if (!selectedItem) {
//       validationErrors.item = 'Please select a specific item';
//     }

//     if (!quantity || isNaN(parseFloat(quantity))) {
//       validationErrors.quantity = 'Please enter a valid quantity';
//     } else if (parseFloat(quantity) <= 0) {
//       validationErrors.quantity = 'Quantity must be greater than 0';
//     } else if (parseFloat(quantity) > selectedItem?.defective) {
//       validationErrors.quantity = `Quantity cannot exceed ${selectedItem.defective}`;
//     }

//     if (!faultType) {
//       validationErrors.faultType = 'Please select a fault type';
//     }

//     if (faultType === 'Other' && !faultAnalysis) {
//       validationErrors.faultAnalysis = 'Please provide fault analysis details';
//     }

//     if (!repairedBy) {
//       validationErrors.repairedBy = 'Please enter the repair person name';
//     }

//     // Validate raw materials quantities
//     for (const itemId of selectedItems) {
//       const qty = quantities[itemId];
//       if (!qty || isNaN(parseFloat(qty))) {
//         const item = allItems.find(i => i.id === itemId);
//         validationErrors[
//           `material_${itemId}`
//         ] = `Please enter a valid quantity for ${item?.name}`;
//       }
//     }

//     if (Object.keys(validationErrors).length > 0) {
//       setBackendErrors(validationErrors);
//       return;
//     }

//     const userId = localStorage.getItem('userId');
//     const repairData = {
//       item: selectedItemType,
//       subItem: selectedItem.itemName,
//       quantity: parseFloat(quantity),
//       serialNumber,
//       faultAnalysis: faultType === 'Other' ? faultAnalysis : faultType,
//       isRepaired: true,
//       repairedRejectedBy: repairedBy,
//       remarks: remark,
//       userId,
//       repairedParts: selectedItems.map(itemId => {
//         const item = allItems.find(i => i.id === itemId);
//         const unit = units.find(u => u.id === materialUnits[itemId]);
//         return {
//           rawMaterialId: itemId,
//           quantity: parseFloat(quantities[itemId]) || 0,
//           unit: unit?.name || '',
//         };
//       }),
//     };

//     try {
//       setSubmitting(true);
//       const response = await Api.post(
//         '/admin/addServiceRecord',
//         repairData,
//       );

//       if (response.data.success) {
//         alert('Repair data submitted successfully');
//         // Reset form
//         setSelectedItemType(null);
//         setSelectedItem(null);
//         setQuantity('1');
//         setSerialNumber('');
//         setFaultType('');
//         setFaultAnalysis('');
//         setRepairedBy('');
//         setRemark('');
//         setSelectedItems([]);
//         setQuantities({});
//         setMaterialUnits({});
//         setBackendErrors({});
//         navigate(-1);
//       } else {
//         throw new Error(response.data.message || 'Submission failed');
//       }
//     } catch (error) {
//       console.log(
//         'Error fetching data:',
//         error.response?.data || error.message,
//       );

//       let errorMessage = 'Submission failed';
//       if (error.response) {
//         if (error.response.data.errors) {
//           const serverErrors = {};
//           Object.keys(error.response.data.errors).forEach(key => {
//             serverErrors[key] = error.response.data.errors[key].msg;
//           });
//           setBackendErrors(serverErrors);
//           return;
//         }
//         errorMessage = error.response.data.message || errorMessage;
//       } else {
//         errorMessage = error.message || errorMessage;
//       }

//       alert(errorMessage);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="repair-container">
//       <div className="repair-form-container">
//         <h1 className="repair-heading">Repair Data Entry</h1>
        
//         <div className="form-section">
//           <label className="form-label">Item Type*</label>
//           <select
//             value={selectedItemType || ''}
//             onChange={e => {
//               setSelectedItemType(e.target.value);
//               setSelectedItem(null);
//               setBackendErrors(prev => ({ ...prev, itemType: null }));
//             }}
//             className={`form-select ${backendErrors.itemType ? 'error' : ''}`}
//           >
//             <option value="">Select item type</option>
//             {itemTypes.map((item, index) => (
//               <option key={index} value={item.value}>{item.label}</option>
//             ))}
//           </select>
//           {backendErrors.itemType && (
//             <div className="error-message">{backendErrors.itemType}</div>
//           )}
//         </div>

//         {selectedItemType && itemList.length > 0 && (
//           <div className="form-section">
//             <label className="form-label">Select {selectedItemType}*</label>
//             <select
//               value={selectedItem ? JSON.stringify(selectedItem) : ''}
//               onChange={e => {
//                 setSelectedItem(e.target.value ? JSON.parse(e.target.value) : null);
//                 setBackendErrors(prev => ({ ...prev, item: null }));
//               }}
//               className={`form-select ${backendErrors.item ? 'error' : ''}`}
//             >
//               <option value="">Select {selectedItemType}</option>
//               {itemList.map((item, index) => (
//                 <option 
//                   key={index} 
//                   value={JSON.stringify(item)}
//                 >
//                   {`${item.itemName}`}
//                 </option>
//               ))}
//             </select>
//             {backendErrors.item && (
//               <div className="error-message">{backendErrors.item}</div>
//             )}
//           </div>
//         )}

//         {selectedItem && !loadingMaterials && (
//           <div className="form-section">
//             <label className="form-label">Select Raw Materials:</label>
//             {backendErrors.materials && (
//               <div className="error-message">{backendErrors.materials}</div>
//             )}
//             <Select
//               isMulti
//               options={filteredItems.map(item => ({ 
//                 value: item.id, 
//                 label: item.name 
//               }))}
//               value={filteredItems
//                 .filter(item => selectedItems.includes(item.id))
//                 .map(item => ({ 
//                   value: item.id, 
//                   label: item.name 
//                 }))
//               }
//               onChange={handleItemSelect}
//               placeholder="Pick Raw Materials"
//               className="multi-select"
//               classNamePrefix="select"
//             />
//           </div>
//         )}

//         {selectedItems.length > 0 && (
//           <div className="form-scroll-content">
//             {selectedItems.map(itemId => {
//               const item = allItems.find(i => i.id === itemId);
//               const errorKey = `material_${itemId}`;

//               return (
//                 <div key={itemId} className="form-section">
//                   <label className="form-label">{item?.name}</label>
//                   <div className="quantity-row">
//                     <input
//                       type="text"
//                       value={quantities[itemId] || ''}
//                       onChange={e => {
//                         handleQuantityChange(itemId, e.target.value);
//                         setBackendErrors(prev => ({ ...prev, [errorKey]: null }));
//                       }}
//                       className={`form-input ${backendErrors[errorKey] ? 'error' : ''}`}
//                       placeholder="Quantity"
//                     />
//                     {loadingUnits ? (
//                       <div>Loading...</div>
//                     ) : (
//                       <select
//                         value={materialUnits[itemId] || ''}
//                         onChange={e => handleUnitChange(itemId, e.target.value)}
//                         className="form-select"
//                       >
//                         {units.map(unit => (
//                           <option key={unit.id} value={unit.id}>{unit.name}</option>
//                         ))}
//                       </select>
//                     )}
//                   </div>
                  
//                   {backendErrors[errorKey] && (
//                     <div className="error-message">{backendErrors[errorKey]}</div>
//                   )}
//                 </div>
//               );
//             })}

//             <div className="form-section">
//               <label className="form-label">Quantity*</label>
//               <input
//                 type="number"
//                 className={`form-input ${backendErrors.quantity ? 'error' : ''}`}
//                 value={quantity}
//                 onChange={e => {
//                   setQuantity(e.target.value);
//                   setBackendErrors(prev => ({ ...prev, quantity: null }));
//                 }}
//                 placeholder="Enter quantity"
//                 min="1"
//                 max={selectedItem?.defective || ''}
//               />
//               {backendErrors.quantity && (
//                 <div className="error-message">{backendErrors.quantity}</div>
//               )}
//             </div>

//             <div className="form-section">
//               <label className="form-label">Serial Number</label>
//               <input
//                 type="text"
//                 className="form-input"
//                 value={serialNumber}
//                 onChange={e => setSerialNumber(e.target.value)}
//                 placeholder="Enter serial number"
//               />
//             </div>

//             <div className="form-section">
//               <label className="form-label">Fault Type*</label>
//               <select
//                 value={faultType}
//                 onChange={e => {
//                   setFaultType(e.target.value);
//                   setBackendErrors(prev => ({ ...prev, faultType: null }));
//                 }}
//                 className={`form-select ${backendErrors.faultType ? 'error' : ''}`}
//               >
//                 <option value="">Select fault type</option>
//                 {faultTypes.map((fault, index) => (
//                   <option key={index} value={fault}>{fault}</option>
//                 ))}
//               </select>
//               {backendErrors.faultType && (
//                 <div className="error-message">{backendErrors.faultType}</div>
//               )}
//             </div>

//             {faultType === 'Other' && (
//               <div className="form-section">
//                 <label className="form-label">Fault Analysis Details*</label>
//                 <textarea
//                   className={`form-textarea ${backendErrors.faultAnalysis ? 'error' : ''}`}
//                   placeholder="Describe the fault..."
//                   value={faultAnalysis}
//                   onChange={e => {
//                     setFaultAnalysis(e.target.value);
//                     setBackendErrors(prev => ({ ...prev, faultAnalysis: null }));
//                   }}
//                   rows={4}
//                 />
//                 {backendErrors.faultAnalysis && (
//                   <div className="error-message">{backendErrors.faultAnalysis}</div>
//                 )}
//               </div>
//             )}

//             <div className="form-section">
//               <label className="form-label">Repaired By*</label>
//               <input
//                 type="text"
//                 className={`form-input ${backendErrors.repairedBy ? 'error' : ''}`}
//                 placeholder="Enter technician name"
//                 value={repairedBy}
//                 onChange={e => {
//                   setRepairedBy(e.target.value);
//                   setBackendErrors(prev => ({ ...prev, repairedBy: null }));
//                 }}
//               />
//               {backendErrors.repairedBy && (
//                 <div className="error-message">{backendErrors.repairedBy}</div>
//               )}
//             </div>

//             <div className="form-section">
//               <label className="form-label">Remarks</label>
//               <textarea
//                 className="form-textarea"
//                 placeholder="Any additional notes..."
//                 value={remark}
//                 onChange={e => setRemark(e.target.value)}
//                 rows={3}
//               />
//             </div>

//             <button
//               className={`submit-button ${submitting ? 'disabled' : ''}`}
//               onClick={handleSubmit}
//               disabled={submitting}>
//               {submitting ? (
//                 <span>Submitting...</span>
//               ) : (
//                 <span>Submit Repair Data</span>
//               )}
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Repair;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import './Repair.css';
import Api from '../../Auth/Api';

const Repair = () => {
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
  const navigate = useNavigate();

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

  const handleItemSelect = (selectedOptions, { action, option, removedValue }) => {
    if (action === 'select-option' && option && option.value === 'select-all') {
      // Select all options
      const allItemIds = filteredItems.map(item => item.id);
      setSelectedItems(allItemIds);
      
      const newQuantities = { ...quantities };
      const newUnits = { ...materialUnits };
      
      allItemIds.forEach(itemId => {
        if (!newQuantities[itemId]) {
          newQuantities[itemId] = '';
        }
        if (!newUnits[itemId] && units.length > 0) {
          newUnits[itemId] = units[0].id;
        }
      });
      
      setQuantities(newQuantities);
      setMaterialUnits(newUnits);
    } else if (action === 'deselect-option' && option && option.value === 'select-all') {
      // Deselect all options
      setSelectedItems([]);
      setQuantities({});
      setMaterialUnits({});
    } else if (action === 'remove-value' && removedValue && removedValue.value === 'select-all') {
      // Deselect all options when "Select All" is removed
      setSelectedItems([]);
      setQuantities({});
      setMaterialUnits({});
    } else {
      // Normal selection/deselection
      const selectedIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
      // Filter out the 'select-all' option if present
      const filteredSelectedIds = selectedIds.filter(id => id !== 'select-all');
      
      setSelectedItems(filteredSelectedIds);
      
      const newQuantities = { ...quantities };
      const newUnits = { ...materialUnits };
      
      filteredSelectedIds.forEach(itemId => {
        if (!newQuantities[itemId]) {
          newQuantities[itemId] = '';
        }
        if (!newUnits[itemId] && units.length > 0) {
          newUnits[itemId] = units[0].id;
        }
      });
      
      setQuantities(newQuantities);
      setMaterialUnits(newUnits);
    }
  };

  const handleUnitChange = (itemId, unitId) => {
    setMaterialUnits(prev => ({
      ...prev,
      [itemId]: unitId,
    }));
  };

  const handleQuantityChange = (itemId, value) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: value,
    }));
  };

  const handleSubmit = async () => {
    setBackendErrors({});

    // Frontend validation
    const validationErrors = {};

    if (!selectedItemType) {
      validationErrors.itemType = 'Please select an item type';
    }

    if (!selectedItem) {
      validationErrors.item = 'Please select a specific item';
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
      if (!qty || isNaN(parseFloat(qty))) {
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
    const repairData = {
      item: selectedItemType,
      subItem: selectedItem.itemName,
      quantity: parseFloat(quantity),
      serialNumber,
      faultAnalysis: faultType === 'Other' ? faultAnalysis : faultType,
      isRepaired: true,
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
        repairData,
      );

      if (response.data.success) {
        alert('Repair data submitted successfully');
        // Reset form
        setSelectedItemType(null);
        setSelectedItem(null);
        setQuantity('1');
        setSerialNumber('');
        setFaultType('');
        setFaultAnalysis('');
        setRepairedBy('');
        setRemark('');
        setSelectedItems([]);
        setQuantities({});
        setMaterialUnits({});
        setBackendErrors({});
        navigate(-1);
      } else {
        throw new Error(response.data.message || 'Submission failed');
      }
    } catch (error) {
      console.log(
        'Error fetching data:',
        error.response?.data?.message || error.message);
        alert(error.response?.data?.message);

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

      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="repair-container">
      <div className="repair-form-container">
        <h1 className="repair-heading">Repair Data Entry</h1>
        
        <div className="form-section">
          <label className="form-label">Item Type*</label>
          <select
            value={selectedItemType || ''}
            onChange={e => {
              setSelectedItemType(e.target.value);
              setSelectedItem(null);
              setBackendErrors(prev => ({ ...prev, itemType: null }));
            }}
            className={`form-select ${backendErrors.itemType ? 'error' : ''}`}
          >
            <option value="">Select item type</option>
            {itemTypes.map((item, index) => (
              <option key={index} value={item.value}>{item.label}</option>
            ))}
          </select>
          {backendErrors.itemType && (
            <div className="error-message">{backendErrors.itemType}</div>
          )}
        </div>

        {selectedItemType && itemList.length > 0 && (
          <div className="form-section">
            <label className="form-label">Select {selectedItemType}*</label>
            <select
              value={selectedItem ? JSON.stringify(selectedItem) : ''}
              onChange={e => {
                setSelectedItem(e.target.value ? JSON.parse(e.target.value) : null);
                setBackendErrors(prev => ({ ...prev, item: null }));
              }}
              className={`form-select ${backendErrors.item ? 'error' : ''}`}
            >
              <option value="">Select {selectedItemType}</option>
              {itemList.map((item, index) => (
                <option 
                  key={index} 
                  value={JSON.stringify(item)}
                >
                  {`${item.itemName}`}
                </option>
              ))}
            </select>
            {backendErrors.item && (
              <div className="error-message">{backendErrors.item}</div>
            )}
          </div>
        )}

        {selectedItem && !loadingMaterials && (
          <div className="form-section">
            <label className="form-label">Select Raw Materials:</label>
            {backendErrors.materials && (
              <div className="error-message">{backendErrors.materials}</div>
            )}
            <Select
              isMulti
              options={[
                { value: 'select-all', label: 'Select All' },
                ...filteredItems.map(item => ({ 
                  value: item.id, 
                  label: item.name 
                }))
              ]}
              value={[
                ...(selectedItems.length === filteredItems.length && filteredItems.length > 0 
                  ? [{ value: 'select-all', label: 'All Selected' }] 
                  : []),
                ...filteredItems
                  .filter(item => selectedItems.includes(item.id))
                  .map(item => ({ 
                    value: item.id, 
                    label: item.name 
                  }))
              ]}
              onChange={handleItemSelect}
              placeholder="Pick Raw Materials"
              className="multi-select"
              classNamePrefix="select"
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
            />
          </div>
        )}

        {selectedItems.length > 0 && (
          <div className="form-scroll-content">
            {selectedItems.map(itemId => {
              const item = allItems.find(i => i.id === itemId);
              const errorKey = `material_${itemId}`;

              return (
                <div key={itemId} className="form-section">
                  <label className="form-label">{item?.name}</label>
                  <div className="quantity-row">
                    <input
                      type="text"
                      value={quantities[itemId] || ''}
                      onChange={e => {
                        handleQuantityChange(itemId, e.target.value);
                        setBackendErrors(prev => ({ ...prev, [errorKey]: null }));
                      }}
                      className={`form-input ${backendErrors[errorKey] ? 'error' : ''}`}
                      placeholder="Quantity"
                    />
                    {loadingUnits ? (
                      <div>Loading...</div>
                    ) : (
                      <select
                        value={materialUnits[itemId] || ''}
                        onChange={e => handleUnitChange(itemId, e.target.value)}
                        className="form-select"
                      >
                        {units.map(unit => (
                          <option key={unit.id} value={unit.id}>{unit.name}</option>
                        ))}
                      </select>
                    )}
                  </div>
                  
                  {backendErrors[errorKey] && (
                    <div className="error-message">{backendErrors[errorKey]}</div>
                  )}
                </div>
              );
            })}

            <div className="form-section">
              <label className="form-label">Quantity*</label>
              <input
                type="number"
                className={`form-input ${backendErrors.quantity ? 'error' : ''}`}
                value={quantity}
                onChange={e => {
                  setQuantity(e.target.value);
                  setBackendErrors(prev => ({ ...prev, quantity: null }));
                }}
                placeholder="Enter quantity"
                min="1"
                max={selectedItem?.defective || ''}
              />
              {backendErrors.quantity && (
                <div className="error-message">{backendErrors.quantity}</div>
              )}
            </div>

            <div className="form-section">
              <label className="form-label">Serial Number</label>
              <input
                type="text"
                className="form-input"
                value={serialNumber}
                onChange={e => setSerialNumber(e.target.value)}
                placeholder="Enter serial number"
              />
            </div>

            <div className="form-section">
              <label className="form-label">Fault Type*</label>
              <select
                value={faultType}
                onChange={e => {
                  setFaultType(e.target.value);
                  setBackendErrors(prev => ({ ...prev, faultType: null }));
                }}
                className={`form-select ${backendErrors.faultType ? 'error' : ''}`}
              >
                <option value="">Select fault type</option>
                {faultTypes.map((fault, index) => (
                  <option key={index} value={fault}>{fault}</option>
                ))}
              </select>
              {backendErrors.faultType && (
                <div className="error-message">{backendErrors.faultType}</div>
              )}
            </div>

            {faultType === 'Other' && (
              <div className="form-section">
                <label className="form-label">Fault Analysis Details*</label>
                <textarea
                  className={`form-textarea ${backendErrors.faultAnalysis ? 'error' : ''}`}
                  placeholder="Describe the fault..."
                  value={faultAnalysis}
                  onChange={e => {
                    setFaultAnalysis(e.target.value);
                    setBackendErrors(prev => ({ ...prev, faultAnalysis: null }));
                  }}
                  rows={4}
                />
                {backendErrors.faultAnalysis && (
                  <div className="error-message">{backendErrors.faultAnalysis}</div>
                )}
              </div>
            )}

            <div className="form-section">
              <label className="form-label">Repaired By*</label>
              <input
                type="text"
                className={`form-input ${backendErrors.repairedBy ? 'error' : ''}`}
                placeholder="Enter technician name"
                value={repairedBy}
                onChange={e => {
                  setRepairedBy(e.target.value);
                  setBackendErrors(prev => ({ ...prev, repairedBy: null }));
                }}
              />
              {backendErrors.repairedBy && (
                <div className="error-message">{backendErrors.repairedBy}</div>
              )}
            </div>

            <div className="form-section">
              <label className="form-label">Remarks</label>
              <textarea
                className="form-textarea"
                placeholder="Any additional notes..."
                value={remark}
                onChange={e => setRemark(e.target.value)}
                rows={3}
              />
            </div>

            <button
              className={`submit-button ${submitting ? 'disabled' : ''}`}
              onClick={handleSubmit}
              disabled={submitting}>
              {submitting ? (
                <span>Submitting...</span>
              ) : (
                <span>Submit Repair Data</span>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Repair;
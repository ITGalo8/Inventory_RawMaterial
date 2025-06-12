// import React, { useState, useEffect } from 'react';
// import Api from '../../Auth/Api';
// import Select from 'react-select';
// import { useNavigate } from 'react-router-dom';
// import './NewProduction.css';

// const NewProduction = () => {
//   const navigate = useNavigate();
//   const [selectedItemType, setSelectedItemType] = useState(null);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [selectedItemName, setSelectedItemName] = useState('');
//   const [selectedDefectiveItemName, setSelectedDefectiveItemName] = useState('');
//   const [items, setItems] = useState([]);
//   const [defectiveItems, setDefectiveItems] = useState([]);
//   const [selectedDefectiveItem, setSelectedDefectiveItem] = useState(null);
//   const [quantityProduced, setQuantityProduced] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const itemTypes = [
//     { label: 'Motor', value: 'Motor' },
//     { label: 'Pump', value: 'Pump' },
//     { label: 'Controller', value: 'Controller' },
//   ];

//   useEffect(() => {
//     if (selectedItemType) {
//       fetchItems(selectedItemType);
//     } else {
//       resetSelections();
//     }
//   }, [selectedItemType]);

//   const resetSelections = () => {
//     setItems([]);
//     setSelectedItem(null);
//     setSelectedItemName('');
//     setDefectiveItems([]);
//     setSelectedDefectiveItem(null);
//     setSelectedDefectiveItemName('');
//     setQuantityProduced('');
//   };

//   const resetDefectiveItems = () => {
//     setDefectiveItems([]);
//     setSelectedDefectiveItem(null);
//     setSelectedDefectiveItemName('');
//     setQuantityProduced('');
//   };

//   const fetchItems = async (itemName) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await Api.get(`/admin/getItemsByName?searchQuery=${itemName}`);
//       setItems(response.data.data || []);
//     } catch (err) {
//       setError('Failed to fetch items');
//       console.log(`Error: ${err?.response?.data?.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchDefectiveItems = async (itemType, subItem) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await Api.get(`/admin/showDefectiveItemsList?itemName=${subItem}`);
//       if (response.data.success) {
//         // Add unique identifiers to distinguish similar items
//         const itemsWithUniqueValues = response.data.data.map((item, index) => ({
//           ...item,
//           uniqueId: `${item._id}-${index}-${Date.now()}` // Create truly unique ID
//         }));
//         setDefectiveItems(itemsWithUniqueValues);
//       } else {
//         setError(response.data.message || 'No defective items found');
//       }
//     } catch (err) {
//       setError(err?.response?.data?.message);
//       console.log(`Error: ${err?.response?.data?.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleProceed = async () => {
//     if (!selectedDefectiveItem) {
//       alert('Please select a defective item to proceed');
//       return;
//     }

//     if (!quantityProduced || isNaN(quantityProduced) || Number(quantityProduced) <= 0) {
//       alert('Please enter a valid quantity produced');
//       return;
//     }

//     try {
//       setLoading(true);
//       const userId = localStorage.getItem('userId');
      
//       // Find the original item using the uniqueId
//       const selectedItem = defectiveItems.find(item => item.uniqueId === selectedDefectiveItem);

//       const payload = {
//         itemId: selectedItem._id, // Use the original ID
//         subItem: selectedItem.itemName,
//         quantityProduced: Number(quantityProduced),
//         userId: userId,
//       };

//       console.log("playload data: ", payload)

//       const response = await Api.post('/admin/produceNewItem', payload);

//       if (response.data.success) {
//         alert('New item produced successfully!');
//         resetDefectiveItems();
//       } else {
//         alert(response.data.message);
//       }
//     } catch (error) {
//       alert(`Error: ${error?.response?.data?.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container">
//       <h1 className="heading">New Making Product</h1>

//       <div className="dropdown-container">
//         <Select
//           onChange={(option) => {
//             setSelectedItemType(option?.value);
//             resetSelections();
//           }}
//           options={itemTypes}
//           placeholder="Select an item type..."
//           styles={customSelectStyles}
//           value={selectedItemType ? itemTypes.find(opt => opt.value === selectedItemType) : null}
//           isClearable={true}
//         />
//       </div>

//       {loading && <div className="loader">Loading...</div>}
//       {error && <div className="error-text">{error}</div>}

//       {selectedItemType && items.length > 0 && (
//         <div className="dropdown-container">
//           <Select
//             onChange={(option) => {
//               const selected = items.find(item => item.id === option?.value);
//               setSelectedItem(option?.value);
//               setSelectedItemName(selected?.name || '');
//               resetDefectiveItems();
//               if (selected) {
//                 fetchDefectiveItems(selectedItemType, selected.name);
//               }
//             }}
//             options={items.map(item => ({
//               label: item.name,
//               value: item.id,
//             }))}
//             placeholder="Select a specific item..."
//             styles={customSelectStyles}
//             value={selectedItem ? {
//               label: items.find(item => item.id === selectedItem)?.name,
//               value: selectedItem
//             } : null}
//             isClearable={true}
//             isSearchable={true}
//           />
//         </div>
//       )}

//       {selectedItem && defectiveItems.length > 0 && (
//         <>
//           <div className="dropdown-container">
//             <Select
//               onChange={(option) => {
//                 setSelectedDefectiveItem(option?.value);
//                 const selected = defectiveItems.find(item => item.uniqueId === option?.value);
//                 setSelectedDefectiveItemName(selected?.itemName || '');
//               }}
//               options={defectiveItems.map(item => ({
//                 // label: `${item.itemName} (${item.specifications || item.voltage || 'N/A'})`, // Include distinguishing info
//                 label: `${item.itemName}`,
//                 value: item.uniqueId,
//                 originalId: item._id
//               }))}
//               placeholder="Select..."
//               styles={customSelectStyles}
//               value={selectedDefectiveItem ? {
//                 label: defectiveItems.find(item => item.uniqueId === selectedDefectiveItem)?.itemName,
//                 value: selectedDefectiveItem
//               } : null}
//               isClearable={true}
//               isSearchable={true}
//               getOptionValue={(option) => option.value}
//               getOptionLabel={(option) => option.label}
//             />
//           </div>

//           <input
//             className="input"
//             placeholder="Enter quantity produced"
//             type="number"
//             value={quantityProduced}
//             onChange={(e) => setQuantityProduced(e.target.value)}
//             min="1"
//           />

//           <button
//             className={`proceed-button ${
//               (!selectedDefectiveItem || !quantityProduced) ? 'disabled-button' : ''
//             }`}
//             onClick={handleProceed}
//             disabled={!selectedDefectiveItem || !quantityProduced}
//           >
//             New Production
//           </button>
//         </>
//       )}
//     </div>
//   );
// };

// const customSelectStyles = {
//   control: (provided, state) => ({
//     ...provided,
//     fontSize: '16px',
//     minHeight: '48px',
//     height: '48px',
//     border: '1px solid #ccc',
//     borderRadius: '8px',
//     color: 'black',
//     width: '100%',
//     boxShadow: 'none',
//     '&:hover': {
//       borderColor: state.isFocused ? '#2684FF' : '#999',
//     },
//     borderColor: state.isFocused ? '#2684FF' : '#ccc',
//   }),
//   valueContainer: (provided) => ({
//     ...provided,
//     height: '48px',
//     padding: '0 10px',
//   }),
//   indicatorsContainer: (provided) => ({
//     ...provided,
//     height: '48px',
//   }),
//   menu: (provided) => ({
//     ...provided,
//     zIndex: 9999,
//   }),
//   option: (provided, state) => ({
//     ...provided,
//     backgroundColor: state.isSelected ? '#007bff' : state.isFocused ? '#e6f7ff' : 'white',
//     color: state.isSelected ? 'white' : 'black',
//     '&:hover': {
//       backgroundColor: state.isSelected ? '#007bff' : '#f0f0f0',
//     },
//   }),
//   singleValue: (provided) => ({
//     ...provided,
//     color: 'black',
//   }),
//   placeholder: (provided) => ({
//     ...provided,
//     color: '#999',
//   }),
// };

// export default NewProduction;

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

  const resetDefectiveItems = () => {
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
      console.log(`Error: ${err?.response?.data?.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchDefectiveItems = async (itemName) => {
    setLoading(true);
    setError(null);
    try {
      const response = await Api.get(`/admin/showDefectiveItemsList?itemName=${itemName}`);
      if (response.data.success) {
        const itemsWithUniqueValues = response.data.data.map((item, index) => ({
          ...item,
          uniqueId: `${item._id}-${index}-${Date.now()}`
        }));
        setDefectiveItems(itemsWithUniqueValues);
      } else {
        setError(response.data.message || 'No defective items found');
      }
    } catch (err) {
      setError(err?.response?.data?.message);
      console.log(`Error: ${err?.response?.data?.message}`);
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
      
      const selectedDefectiveItemData = defectiveItems.find(item => item.uniqueId === selectedDefectiveItem);
      const selectedItemData = items.find(item => item.id === selectedItem);

      if (!selectedItemData || !selectedDefectiveItemData) {
        throw new Error('Selected item data not found');
      }

      const payload = {
        itemId: selectedItemData.id,
        // defectiveItemId: selectedDefectiveItemData._id,
        subItem: selectedDefectiveItemData.itemName,
        quantityProduced: Number(quantityProduced),
        userId: userId,
      };

      console.log("Production payload:", payload);

      const response = await Api.post('/admin/produceNewItem', payload);

      if (response.data.success) {
        alert('New item produced successfully!');
        resetDefectiveItems();
      } else {
        alert(response.data.message || 'Production failed');
      }
    } catch (error) {
      alert(`Error: ${error?.response?.data?.message}`);
      console.log('Production error:', error?.response?.data?.message);
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
            setSelectedItemType(option?.value);
            resetSelections();
          }}
          options={itemTypes}
          placeholder="Select an item type..."
          styles={customSelectStyles}
          value={selectedItemType ? itemTypes.find(opt => opt.value === selectedItemType) : null}
          isClearable={true}
        />
      </div>

      {loading && <div className="loader">Loading...</div>}
      {error && <div className="error-text">{error}</div>}

      {selectedItemType && items.length > 0 && (
        <div className="dropdown-container">
          <Select
            onChange={(option) => {
              const selected = items.find(item => item.id === option?.value);
              setSelectedItem(option?.value);
              setSelectedItemName(selected?.name || '');
              resetDefectiveItems();
              if (selected) {
                fetchDefectiveItems(selected.name);
              }
            }}
            options={items.map(item => ({
              label: item.name,
              value: item.id,
            }))}
            placeholder="Select a specific item..."
            styles={customSelectStyles}
            value={selectedItem ? {
              label: items.find(item => item.id === selectedItem)?.name,
              value: selectedItem
            } : null}
            isClearable={true}
            isSearchable={true}
          />
        </div>
      )}

      {selectedItem && defectiveItems.length > 0 && (
        <>
          <div className="dropdown-container">
            <Select
              onChange={(option) => {
                setSelectedDefectiveItem(option?.value);
                const selected = defectiveItems.find(item => item.uniqueId === option?.value);
                setSelectedDefectiveItemName(selected?.itemName || '');
              }}
              options={defectiveItems.map(item => ({
                label: `${item.itemName}`,
                value: item.uniqueId,
              }))}
              placeholder="Select item..."
              styles={customSelectStyles}
              value={selectedDefectiveItem ? {
                label: defectiveItems.find(item => item.uniqueId === selectedDefectiveItem)?.itemName,
                value: selectedDefectiveItem
              } : null}
              isClearable={true}
              isSearchable={true}
            />
          </div>

          <input
            className="input"
            placeholder="Enter quantity produced"
            type="number"
            value={quantityProduced}
            onChange={(e) => setQuantityProduced(e.target.value)}
            min="1"
          />

          <button
            className={`proceed-button ${
              (!selectedDefectiveItem || !quantityProduced) ? 'disabled-button' : ''
            }`}
            onClick={handleProceed}
            disabled={!selectedDefectiveItem || !quantityProduced}
          >
            {loading ? 'Processing...' : 'New Production'}
          </button>
        </>
      )}
    </div>
  );
};

const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    fontSize: '16px',
    minHeight: '48px',
    height: '48px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    color: 'black',
    width: '100%',
    boxShadow: 'none',
    '&:hover': {
      borderColor: state.isFocused ? '#2684FF' : '#999',
    },
    borderColor: state.isFocused ? '#2684FF' : '#ccc',
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
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#007bff' : state.isFocused ? '#e6f7ff' : 'white',
    color: state.isSelected ? 'white' : 'black',
    '&:hover': {
      backgroundColor: state.isSelected ? '#007bff' : '#f0f0f0',
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: 'black',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#999',
  }),
};

export default NewProduction;
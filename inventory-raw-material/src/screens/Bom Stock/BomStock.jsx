import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import { FiSearch, FiChevronRight, FiX, FiAlertCircle, FiPackage } from 'react-icons/fi';
import './BomStock.css';
import Api from '../../Auth/Api'

const BomStock = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setError(null);
      const storedUserId = localStorage.getItem('userId');
      console.log('Stored User ID:', storedUserId);
      setUserId(storedUserId);
      
      const response = await Api.get('/admin/showRawMaterials', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      if (response.data && response.data.data) {
        const sortedData = response.data.data.sort((a, b) => 
          a.name.localeCompare(b.name)
        );
        setData(sortedData);
        setFilteredData(sortedData);
      } else {
        throw new Error('Invalid data format received');
      }
    } catch (error) {
      console.log('Error fetching data:', error);
      setError(error.response?.data?.message || error.message || 'Failed to fetch data');
      
      if (error.response?.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = debounce((query) => {
    if (query) {
      const filtered = data.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, 300);

  const handleItemPress = (item) => {
    if (!userId) {
      alert('Error: User ID not found. Please login again.');
      return;
    }
    
    navigate('/UpdateStockMaterial', { 
      state: {
        rawMaterialId: item.id,
        itemName: item.name,
        currentStock: item.stock,
        userId: userId,
        unit: item.unit,
        threshold: item.threshold
      }
    });
  };

const renderItem = (item) => (
  <div 
    key={item.id}
    className={`Bomcard ${item.stockIsLow ? 'low-stock-card' : 'high-stock-card'}`}
    onClick={() => handleItemPress(item)}
  >
    <div className="card-header">
      <div className="name-container">
        <div className={item.stockIsLow ? 'low-stock-indicator' : 'high-stock-indicator'} />
        <span className="name">{item.name}</span>
      </div>
      <div className="stock-info">
        <span className={`stock ${item.stockIsLow ? 'low-stock-text' : ''}`}>
          {item.stock} {item.unit || ''}
        </span>
        <FiChevronRight size={20} color="#7f8c8d" />
      </div>
    </div>
    {item.threshold != null && (
      <div className="threshold-container">
        <span className="threshold-label">Threshold:</span>
        <span className={`threshold-value ${item.stock <= item.threshold ? 'threshold-warning' : ''}`}>
          {item.threshold}
        </span>
      </div>
    )}
  </div>
);


  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="bom-stock-container">
      <h1 className="bom-header ">Raw Materials</h1>
      
      <div className="search-container">
        <FiSearch size={20} color="#7f8c8d" className="search-icon" />
        <input
          className="search-input"
          placeholder="Search materials..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            handleSearch(e.target.value);
          }}
        />
        {searchQuery && (
          <button 
            className="clear-search-button"
            onClick={() => {
              setSearchQuery('');
              setFilteredData(data);
            }}
          >
            <FiX size={20} color="#e74c3c" />
          </button>
        )}
      </div>

      {error ? (
        <div className="error-container">
          <FiAlertCircle size={40} color="#e74c3c" />
          <p className="error-text">{error}</p>
          <button 
            className="retry-button"
            onClick={fetchData}
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="card-grid-container">
        <div className="card-grid">
          {filteredData.length > 0 ? (
            filteredData.map(item => renderItem(item))
          ) : (
            <div className="empty-container">
              <FiPackage size={50} color="#95a5a6" />
              <p className="empty-text">No materials found</p>
              {searchQuery && (
                <button
                  className="clear-search-button"
                  onClick={() => {
                    setSearchQuery('');
                    setFilteredData(data);
                  }}
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>
        </div>
      )}
    </div>
  );
};

export default BomStock;

// import React, { useEffect, useState, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { debounce } from 'lodash';
// import { FiSearch, FiChevronRight, FiX, FiAlertCircle, FiPackage } from 'react-icons/fi';
// import './BomStock.css';
// import Api from '../../Auth/Api'

// const BomStock = () => {
//   const [data, setData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [userId, setUserId] = useState(null);
//   const [error, setError] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const navigate = useNavigate();

//   const fetchData = async () => {
//     try {
//       setError(null);
//       const storedUserId = localStorage.getItem('userId');
//       console.log('Stored User ID:', storedUserId);
//       setUserId(storedUserId);
      
//       const response = await Api.get('/admin/showRawMaterials', {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('authToken')}`
//         }
//       });
      
//       if (response.data && response.data.data) {
//         const sortedData = response.data.data.sort((a, b) => 
//           a.name.localeCompare(b.name)
//         ).map(item => ({
//           ...item,
//           stockIsLow: item.threshold != null && item.stock <= item.threshold
//         }));
//         setData(sortedData);
//         setFilteredData(sortedData);
//       } else {
//         throw new Error('Invalid data format received');
//       }
//     } catch (error) {
//       console.log('Error fetching data:', error);
//       setError(error.response?.data?.message || error.message || 'Failed to fetch data');
      
//       if (error.response?.status === 401) {
//         localStorage.removeItem('authToken');
//         localStorage.removeItem('userId');
//         navigate('/login');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleSearch = debounce((query) => {
//     if (query) {
//       const filtered = data.filter(item =>
//         item.name.toLowerCase().includes(query.toLowerCase())
//       );
//       setFilteredData(filtered);
//     } else {
//       setFilteredData(data);
//     }
//   }, 300);

//   const handleItemPress = (item) => {
//     if (!userId) {
//       alert('Error: User ID not found. Please login again.');
//       return;
//     }
    
//     navigate('/UpdateStockMaterial', { 
//       state: {
//         rawMaterialId: item.id,
//         itemName: item.name,
//         currentStock: item.stock,
//         userId: userId,
//         unit: item.unit,
//         threshold: item.threshold
//       }
//     });
//   };

//   const renderItem = (item) => (
//     <div 
//       key={item.id}
//       className={`bom-card ${item.stockIsLow ? 'low-stock-card' : 'high-stock-card'}`}
//       onClick={() => handleItemPress(item)}
//     >
//       <div className="card-header">
//         <div className="name-container">
//           <div className={item.stockIsLow ? 'low-stock-indicator' : 'high-stock-indicator'} />
//           <span className="name">{item.name}</span>
//         </div>
//         <div className="stock-info">
//           <span className={`stock ${item.stockIsLow ? 'low-stock-text' : ''}`}>
//             {item.stock} {item.unit || ''}
//           </span>
//           <FiChevronRight size={20} color="#7f8c8d" />
//         </div>
//       </div>
//       {item.threshold != null && (
//         <div className="threshold-container">
//           <span className="threshold-label">Threshold:</span>
//           <span className={`threshold-value ${item.stock <= item.threshold ? 'threshold-warning' : ''}`}>
//             {item.threshold}
//           </span>
//         </div>
//       )}
//     </div>
//   );

//   if (loading) {
//     return (
//       <div className="loader-container">
//         <div className="spinner"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="bom-stock-container">
//       <h1 className="bom-header">Raw Materials</h1>
      
//       <div className="search-container">
//         <FiSearch size={20} color="#7f8c8d" className="search-icon" />
//         <input
//           className="search-input"
//           placeholder="Search materials..."
//           value={searchQuery}
//           onChange={(e) => {
//             setSearchQuery(e.target.value);
//             handleSearch(e.target.value);
//           }}
//         />
//         {searchQuery && (
//           <button 
//             className="clear-search-button"
//             onClick={() => {
//               setSearchQuery('');
//               setFilteredData(data);
//             }}
//           >
//             <FiX size={20} color="#e74c3c" />
//           </button>
//         )}
//       </div>

//       {error ? (
//         <div className="error-container">
//           <FiAlertCircle size={40} color="#e74c3c" />
//           <p className="error-text">{error}</p>
//           <button 
//             className="retry-button"
//             onClick={fetchData}
//           >
//             Try Again
//           </button>
//         </div>
//       ) : (
//         <div className="card-grid-container">
//           <div className="card-grid">
//             {filteredData.length > 0 ? (
//               filteredData.map(item => renderItem(item))
//             ) : (
//               <div className="empty-container">
//                 <FiPackage size={50} color="#95a5a6" />
//                 <p className="empty-text">No materials found</p>
//                 {searchQuery && (
//                   <button
//                     className="clear-search-button"
//                     onClick={() => {
//                       setSearchQuery('');
//                       setFilteredData(data);
//                     }}
//                   >
//                     Clear search
//                   </button>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BomStock;
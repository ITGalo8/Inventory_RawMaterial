// import React, { useEffect, useState } from 'react';
// import Api from '../../../Auth/Api';
// import './EmptyBomStock.css';
// import { useNavigate, useLocation } from 'react-router-dom';

// const EmptyBomStock = () => {
//     const location = useLocation();
//   const navigate = useNavigate();
//   const { itemId } = location.state || {};
//   console.log("Item Id", itemId);
//   const [loading, setLoading] = useState(true);
//   const [item, setItem] = useState(null);
//   const [insufficientMaterials, setInsufficientMaterials] = useState([]);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchInsufficientMaterials = async () => {
//       try {
//         const response = await Api.get(
//           `/admin/getInsufficientRawMaterials?itemId=${itemId}`
//         );
//         setItem(response.data.item);
//         setInsufficientMaterials(response.data.insufficientMaterials);
//       } catch (err) {
//         console.log(err);
//         alert(err.response?.data?.message || err.message);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchInsufficientMaterials();
//   }, [itemId]);

//   const renderMaterial = (material) => (
//     <div key={material.rawMaterialId} className="card">
//       <div className="name">{material.rawMaterialName}</div>
//       <div className="text">Available Stock: {material.availableStock}</div>
//       <div className="text">Required Quantity: {material.requiredQuantity}</div>
//     </div>
//   );

//   if (loading) {
//     return (
//       <div className="center">
//         <div className="loader">Loading...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="center">
//         <div className="error">Error: {error}</div>
//       </div>
//     );
//   }

//   return (
//     <div className="container">
//       <h1 className="header">Insufficient Raw Materials</h1>
//       {item && <h2 className="subHeader">For Item: {item.itemName}</h2>}
//       <div className="list">
//         {insufficientMaterials.map(material => renderMaterial(material))}
//       </div>
//     </div>
//   );
// };

// export default EmptyBomStock;


import React, { useEffect, useState } from 'react';
import Api from '../../../Auth/Api';
import './EmptyBomStock.css';
import { useNavigate, useLocation } from 'react-router-dom';

const EmptyBomStock = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { itemId } = location.state || {};
  console.log("Item Id", itemId);
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState(null);
  const [insufficientMaterials, setInsufficientMaterials] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInsufficientMaterials = async () => {
      try {
        const response = await Api.get(
          `/admin/getInsufficientRawMaterials?itemId=${itemId}`
        );
        setItem(response.data.item);
        setInsufficientMaterials(response.data.insufficientMaterials);
      } catch (err) {
        console.log(err);
        alert(err.response?.data?.message || err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInsufficientMaterials();
  }, [itemId]);

  // Function to chunk the materials into groups of 3 for each row
  const chunkMaterials = (materials, size) => {
    const chunked = [];
    for (let i = 0; i < materials.length; i += size) {
      chunked.push(materials.slice(i, i + size));
    }
    return chunked;
  };

  const materialRows = chunkMaterials(insufficientMaterials, 3);

  const renderMaterial = (material) => (
    <div key={material.rawMaterialId} className="material-card">
      <div className="name">{material.rawMaterialName}</div>
      <div className="text">Available Stock: {material.availableStock}</div>
      <div className="text">Required Quantity: {material.requiredQuantity}</div>
      <div className="difference">
        Shortage: {material.requiredQuantity - material.availableStock}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="center">
        <div className="loader">Loading...</div>
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
      <h1 className="header">Insufficient Raw Materials</h1>
      {item && <h2 className="subHeader">For Item: {item.itemName}</h2>}
      
      <div className="materials-grid">
        {materialRows.map((row, rowIndex) => (
          <div key={rowIndex} className="material-row">
            {row.map(material => renderMaterial(material))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmptyBomStock;
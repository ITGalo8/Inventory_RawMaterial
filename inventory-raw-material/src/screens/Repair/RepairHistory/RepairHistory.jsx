// import React from "react";
// import { useState, useEffect } from "react";
// import Api from "../../../Auth/Api";
// import "./RepairHistory.css";

// const RepairHistory = () => {
//   const [repairData, setRepairData] = useState([]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchRepairData = async () => {
//       try {
//         const response = await Api.get(`/admin/getRepairedServiceRecords`, {
//           withCredentials: true,
//         });
//         console.log("Repair Data", response?.data?.data);
//         setRepairData(response?.data?.data);
//       } catch (error) {
//         console.log(
//           "Error fetching Repair Data",
//           error?.response?.data?.message
//         );
//         setError(
//           error?.response?.data?.message || "Failed to fetch repair history"
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRepairData();
//   }, []);

//   const formatDate = (dateString) => {
//     const options = {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   if (loading) {
//     return <div className="container">Loading repair history...</div>;
//   }

//   if (error) {
//     return <div className="container">Error: {error}</div>;
//   }

//   if (repairData.length === 0) {
//     return <div className="container">No repair history found</div>;
//   }

//   return (
//     <div className="container">
//       <div className="header">
//         <h1>Repair History</h1>
//       </div>

//       {repairData.map((item, index) => (
//         <div key={item.id} className="form-design repair-card">
//           <div className="repair-header">
//             <h3>Repair Record #{index + 1}</h3>
//             <span className="repair-date">
//               Serviced on: {formatDate(item.servicedAt)}
//             </span>
//           </div>

//           <div className="repair-details compact-details">
//             <div className="detail-row">
//               <span className="detail-label">Item Name:</span>
//               <span className="detail-value">{item?.item || "N/A"}</span>
//             </div>
//             <div className="detail-row">
//               <span className="detail-label">Sub Item:</span>
//               <span className="detail-value">{item?.subItem || "N/A"}</span>
//             </div>
//             <div className="detail-row">
//               <span className="detail-label">Quantity:</span>
//               <span className="detail-value">{item?.quantity || "N/A"}</span>
//             </div>
//             <div className="detail-row">
//               <span className="detail-label">Serial Number:</span>
//               <span className="detail-value">
//                 {item?.serialNumber || "N/A"}
//               </span>
//             </div>
//             <div className="detail-row">
//               <span className="detail-label">Fault Analysis:</span>
//               <span className="detail-value">
//                 {item?.faultAnalysis || "N/A"}
//               </span>
//             </div>
//             <div className="detail-row">
//               <span className="detail-label">Repaired By:</span>
//               <span className="detail-value">
//                 {item?.repairedRejectedBy || "N/A"}
//               </span>
//             </div>
//             <div className="detail-row">
//               <span className="detail-label">Remarks:</span>
//               <span className="detail-value">{item?.remarks || "N/A"}</span>
//             </div>
//           </div>

//           {item.repairedParts && item.repairedParts.length > 0 && (
//             <div className="repaired-parts-section">
//               <h4>Repaired Parts Used:</h4>
//               <table className="parts-table">
//                 <thead>
//                   <tr>
//                     <th>Part Name</th>
//                     <th>Quantity</th>
//                     <th>Unit</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {item.repairedParts.map((part, partIndex) => (
//                     <tr key={`${item.id}-${partIndex}`}>
//                       <td>{part.rawMaterialName}</td>
//                       <td>{part.quantity}</td>
//                       <td>{part.unit}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default RepairHistory;

import React from "react";
import { useState, useEffect } from "react";
import Api from "../../../Auth/Api";
import "./RepairHistory.css";

const RepairHistory = () => {
  const [repairData, setRepairData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRepairData = async () => {
      try {
        const response = await Api.get(`/admin/getRepairedServiceRecords`, {
          withCredentials: true,
        });
        console.log("Repair Data", response?.data?.data);
        setRepairData(response?.data?.data);
      } catch (error) {
        console.log(
          "Error fetching Repair Data",
          error?.response?.data?.message
        );
        setError(
          error?.response?.data?.message || "Failed to fetch repair history"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRepairData();
  }, []);

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <div className="repair-history-container">Loading repair history...</div>;
  }

  if (error) {
    return <div className="repair-history-container">Error: {error}</div>;
  }

  if (repairData.length === 0) {
    return <div className="repair-history-container">No repair history found</div>;
  }

  return (
    <div className="repair-history-container">
      <div className="repair-history-header">
        <h1>Repair History</h1>
      </div>

      {repairData.map((item, index) => (
        <div key={item.id} className="repair-history-card">
          <div className="repair-history-card-header">
            <h3>Repair Record #{index + 1}</h3>
            <span className="repair-history-date">
              Serviced on: {formatDate(item.servicedAt)}
            </span>
          </div>

          <div className="repair-history-details">
            <div className="repair-history-detail-row">
              <span className="repair-history-detail-label">Item Name:</span>
              <span className="repair-history-detail-value">{item?.item || "N/A"}</span>
            </div>
            <div className="repair-history-detail-row">
              <span className="repair-history-detail-label">Sub Item:</span>
              <span className="repair-history-detail-value">{item?.subItem || "N/A"}</span>
            </div>
            <div className="repair-history-detail-row">
              <span className="repair-history-detail-label">Quantity:</span>
              <span className="repair-history-detail-value">{item?.quantity || "N/A"}</span>
            </div>
            <div className="repair-history-detail-row">
              <span className="repair-history-detail-label">Serial Number:</span>
              <span className="repair-history-detail-value">
                {item?.serialNumber || "N/A"}
              </span>
            </div>
            <div className="repair-history-detail-row">
              <span className="repair-history-detail-label">Fault Analysis:</span>
              <span className="repair-history-detail-value">
                {item?.faultAnalysis || "N/A"}
              </span>
            </div>
            <div className="repair-history-detail-row">
              <span className="repair-history-detail-label">Repaired By:</span>
              <span className="repair-history-detail-value">
                {item?.repairedRejectedBy || "N/A"}
              </span>
            </div>
            <div className="repair-history-detail-row">
              <span className="repair-history-detail-label">Remarks:</span>
              <span className="repair-history-detail-value">{item?.remarks || "N/A"}</span>
            </div>
          </div>

          {item.repairedParts && item.repairedParts.length > 0 && (
            <div className="repair-history-parts-section">
              <h4>Repaired Parts Used:</h4>
              <table className="repair-history-parts-table">
                <thead>
                  <tr>
                    <th>Part Name</th>
                    <th>Quantity</th>
                    <th>Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {item.repairedParts.map((part, partIndex) => (
                    <tr key={`${item.id}-${partIndex}`}>
                      <td>{part.rawMaterialName}</td>
                      <td>{part.quantity}</td>
                      <td>{part.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default RepairHistory;
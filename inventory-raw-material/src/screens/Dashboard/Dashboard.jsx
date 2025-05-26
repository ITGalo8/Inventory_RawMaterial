// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import pumpIcon from "../../assets/Galo.png";
// import Api from "../../Auth/Api";
// import Logout from "../../Auth/Logout";
// import "./Dashboard.css";
// import Sidebar from "../Sidebar/Sidebar";

// const SimpleCard = ({ backgroundColor, title, content, quantity, onMoreInfo }) => (
//   <div className="card" style={{ backgroundColor }}>
//     <div className="card-header">
//       <h2>{title}</h2>
//       <button
//         className="more-info-button"
//         onClick={onMoreInfo}
//       >
//         More Info
//       </button>
//     </div>
//     <div className="card-content">
//       <p>{content}</p>
//       <h3>{quantity}</h3>
//     </div>
//   </div>
// );

// const Dashboard = () => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [retryCount, setRetryCount] = useState(0);
//   const navigate = useNavigate();

//   const itemTypes = [
//     { title: "Pump", color: "#E1341E" },
//     { title: "Controller", color: "#97bcc7" },
//     { title: "Motor", color: "#FFAEBC" },

//   ];

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await Api.get("/admin/showDefectiveItemsOfWarehouse");
//       setData(response.data.data);
//     } catch (err) {
//       const errMsg =
//         err.response?.data?.message || err.message || "Unknown error";
//       setError(errMsg);
//       console.log("Dashboard fetch error:", err);

//       if (retryCount < 3) {
//         setTimeout(() => {
//           setRetryCount((prev) => prev + 1);
//         }, 2000);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [retryCount]);

//   const handleMoreInfo = (itemType) => {
//     navigate("/AllDefective", { state: { itemType } });
//   };

//   if (loading && retryCount === 0) {
//     return (
//       <div className="loader-container">
//         <div className="spinner" aria-busy="true" aria-label="Loading dashboard data"></div>
//         <p>Loading dashboard...</p>
//       </div>
//     );
//   }

//   if (error && retryCount >= 3) {
//     return (
//       <div className="error-container">
//         <div className="error-message">
//           <p>Failed to load dashboard data: {error}</p>
//           <button
//             onClick={() => {
//               setRetryCount(0);
//               fetchData();
//             }}
//             className="retry-button"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="dashboard-container">
//       <div className="header">
//         <div className="header-left">
//           <Sidebar />
//         </div>
//         <div className="header-center">
//           <div className="logo-title">
//             <img src={pumpIcon} alt="Logo" className="logo-image" />
//             <h1 className="header-text">RMS ADMIN</h1>
//           </div>
//         </div>
//         <div className="header-right">
//           <Logout />
//         </div>
//       </div>

//       <div className="main-content">
//         <div className="cards-container">
//           {itemTypes.map(({ title, color }) => {
//             const itemData = data?.totalsByGroup?.find(
//               (item) => item.item === title
//             );
//             return (
//               <div className="card-wrapper" key={title}>
//                 <SimpleCard
//                   backgroundColor={color}
//                   title={title}
//                   content="Total Defective"
//                   quantity={itemData?.defectiveCount || 0}
//                   onMoreInfo={() => handleMoreInfo(title)}
//                 />
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import pumpIcon from "../../assets/Galo.png";
// import Api from "../../Auth/Api";
// import Logout from "../../Auth/Logout";
// import "./Dashboard.css";
// import Sidebar from "../Sidebar/Sidebar";

// const SimpleCard = ({
//   backgroundColor,
//   title,
//   content,
//   quantity,
//   onMoreInfo,
// }) => (
//   <div className="card" style={{ backgroundColor }}>
//     <div className="card-header">
//       <h2>{title}</h2>
//       <button className="more-info-button" onClick={onMoreInfo}>
//         More Info
//       </button>
//     </div>
//     <div className="card-content">
//       <p>{content}</p>
//       <h3>{quantity}</h3>
//     </div>
//   </div>
// );

// const Dashboard = () => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [retryCount, setRetryCount] = useState(0);
//   const navigate = useNavigate();

//   const itemTypes = [
//     { title: "Pump", color: "#E1341E" },
//     { title: "Controller", color: "#97bcc7" },
//     { title: "Motor", color: "#FFAEBC" },
//   ];

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await Api.get("/admin/showDefectiveItemsOfWarehouse");
//       setData(response.data.data);
//     } catch (err) {
//       const errMsg =
//         err.response?.data?.message || err.message || "Unknown error";
//       setError(errMsg);
//       if (retryCount < 3) {
//         setTimeout(() => setRetryCount((prev) => prev + 1), 2000);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [retryCount]);

//   const handleMoreInfo = (itemType) => {
//     navigate("/AllDefective", { state: { itemType } });
//   };

//   if (loading && retryCount === 0) {
//     return (
//       <div className="loader-container">
//         <div className="spinner"></div>
//         <p>Loading dashboard...</p>
//       </div>
//     );
//   }

//   if (error && retryCount >= 3) {
//     return (
//       <div className="error-container">
//         <div className="error-message">
//           <p>Failed to load dashboard data: {error}</p>
//           <button
//             onClick={() => {
//               setRetryCount(0);
//               fetchData();
//             }}
//             className="retry-button"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="dashboard-container">
//       <div className="header">
//         <div className="header-left">
//           <Sidebar />
//         </div>
//         <div className="header-center">
//           <div className="logo-title">
//             <img src={pumpIcon} alt="Logo" className="logo-image" />
//             <h1 className="header-text">RMS ADMIN</h1>
//           </div>
//         </div>
//         <div className="header-right">
//           <Logout />
//         </div>
//       </div>

//       <div className="main-content">
//         <div className="cards-container">
//           {itemTypes.map(({ title, color }) => {
//             const itemData = data?.totalsByGroup?.find(
//               (item) => item.item === title
//             );
//             return (
//               <div className="card-wrapper" key={title}>
//                 <SimpleCard
//                   backgroundColor={color}
//                   title={title}
//                   content="Total Defective"
//                   quantity={itemData?.defectiveCount || 0}
//                   onMoreInfo={() => handleMoreInfo(title)}
//                 />
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import pumpIcon from "../../assets/Galo.png";
import Api from "../../Auth/Api";
import Logout from "../../Auth/Logout";
import "./Dashboard.css";
import Sidebar from "../Sidebar/Sidebar";

const SimpleCard = ({
  backgroundColor,
  title,
  content,
  quantity,
  subContent,
  onMoreInfo,
}) => (
  <div className="card" style={{ backgroundColor }}>
    <div className="card-header">
      <h2>{title}</h2>
      {onMoreInfo && (
        <button className="more-info-button" onClick={onMoreInfo}>
          More Info
        </button>
      )}
    </div>
    <div className="card-content">
      <p>{content}</p>
      <h3>{quantity}</h3>
      {subContent && <p className="sub-content">{subContent}</p>}
    </div>
  </div>
);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [serviceData, setServiceData] = useState(null);
  const [rejectedData, setRejectedData] = useState(null);
  const [productionData, setProductionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const navigate = useNavigate();

  const itemTypes = [
    { title: "Pump", color: "#E1341E" },
    { title: "Controller", color: "#97bcc7" },
    { title: "Motor", color: "#FFAEBC" },
  ];

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      const defectiveResponse = await Api.get("/admin/showDefectiveItemsOfWarehouse");
      setData(defectiveResponse.data.data);

      const serviceResponse = await Api.get("/admin/showOverallServiceData?isRepaired=1");
      setServiceData(serviceResponse.data);

      const rejectedResponse = await Api.get("/admin/showOverallServiceData?isRepaired=0");
      setRejectedData(rejectedResponse.data);

      const productionResponse = await Api.get("/admin/showProductionSummary");
      setProductionData(productionResponse.data);

    } catch (err) {
      const errMsg =
        err.response?.data?.message || err.message || "Unknown error";
      setError(errMsg);
      if (retryCount < 3) {
        setTimeout(() => setRetryCount((prev) => prev + 1), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
    // eslint-disable-next-line
  }, [retryCount]);

  const handleMoreInfo = (itemType) => {
    navigate("/AllDefective", { state: { itemType } });
  };

  if (loading && retryCount === 0) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error && retryCount >= 3) {
    return (
      <div className="error-container">
        <div className="error-message">
          <p>Failed to load dashboard data: {error}</p>
          <button
            onClick={() => {
              setRetryCount(0);
              fetchAllData();
            }}
            className="retry-button"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="header">
        <div className="header-left">
          <Sidebar />
        </div>
        <div className="header-center">
          <div className="logo-title">
            <img src={pumpIcon} alt="Logo" className="logo-image" />
            <h1 className="header-text">RMS ADMIN</h1>
          </div>
        </div>
        <div className="header-right">
          <Logout />
        </div>
      </div>

      <div className="main-content">
        <div className="cards-container">
          {serviceData && (
            <div className="card-wrapper">
              <SimpleCard
                backgroundColor="#b6e2d3"
                title="Repaired Items"
                content={`Total: ${serviceData.total}`}
                quantity={`Monthly: ${serviceData.monthly}`}
                subContent={`Weekly: ${serviceData.weekly} | Daily: ${serviceData.daily}`}
              />
            </div>
          )}

          {rejectedData && (
            <div className="card-wrapper">
              <SimpleCard
                backgroundColor="#b6e2d3"
                title="Rejected Items"
                content={`Total: ${rejectedData.total}`}
                quantity={`Monthly: ${rejectedData.monthly}`}
                subContent={`Weekly: ${rejectedData.weekly} | Daily: ${rejectedData.daily}`}
              />
            </div>
          )}

          {productionData && (
            <div className="card-wrapper">
              <SimpleCard
                backgroundColor="#b6e2d3"
                title="Total Production"
                content={`Total: ${productionData.total}`}
                quantity={`Monthly: ${productionData.monthly}`}
                subContent={`Weekly: ${productionData.weekly} | Daily: ${productionData.daily}`}
              />
            </div>
          )}

          {itemTypes.map(({ title, color }) => {
            const itemData = data?.totalsByGroup?.find(
              (item) => item.item === title
            );
            return (
              <div className="card-wrapper" key={title}>
                <SimpleCard
                  backgroundColor={color}
                  title={title}
                  content="Total Defective"
                  quantity={itemData?.defectiveCount || 0}
                  onMoreInfo={() => handleMoreInfo(title)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

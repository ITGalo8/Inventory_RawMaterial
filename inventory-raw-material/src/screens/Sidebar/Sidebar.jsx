// import React, { useState, useEffect } from "react";
// import { NavLink } from "react-router-dom";
// import "./Sidebar.css";

// const Sidebar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [userName, setUserName] = useState("User");
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem("user")) || { name: "Admin" };
//     setUserName(user.name);

//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768);
//       if (window.innerWidth >= 768) setIsOpen(true);
//     };

//     window.addEventListener("resize", handleResize);
//     handleResize();
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const toggleSidebar = () => setIsOpen(!isOpen);

//   useEffect(() => {
//     if (!isMobile || !isOpen) return;

//     const handleClickOutside = (event) => {
//       if (
//         !event.target.closest(".sidebar") &&
//         !event.target.closest(".toggle-btn")
//       ) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [isOpen, isMobile]);

//   return (
//     <>
//       {isMobile && (
//         <button className="toggle-btn" onClick={toggleSidebar}>
//           ☰
//         </button>
//       )}

//       <div
//         className={`sidebar ${
//           isOpen ? "open" : isMobile ? "closed" : "desktop-closed"
//         }`}
//       >
//         <div className="user-info">
//           <div className="user-avatar">{userName.charAt(0).toUpperCase()}</div>
//           <div className="user-name">{userName}</div>
//         </div>

//         <nav className="uppermenu">
//           <NavLink
//             to="/Dashboard"
//             className={({ isActive }) =>
//               `sidebar-link ${isActive ? "active" : ""}`
//             }
//             onClick={() => isMobile && setIsOpen(false)}
//           >
//             <span className="link-text">Dashboard</span>
//           </NavLink>

//           <NavLink
//             to="/Bom"
//             className={({ isActive }) =>
//               `sidebar-link ${isActive ? "active" : ""}`
//             }
//             onClick={() => isMobile && setIsOpen(false)}
//           >
//             <span className="link-text">Bom</span>
//           </NavLink>

//           <NavLink
//             to="/InsufficientRawMaterials"
//             className={({ isActive }) =>
//               `sidebar-link ${isActive ? "active" : ""}`
//             }
//             onClick={() => isMobile && setIsOpen(false)}
//           >
//             <span className="link-text">Insufficient Raw Materials</span>
//           </NavLink>
//         </nav>
//       </div>
//     </>
//   );
// };

// export default Sidebar;

import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("User");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")) || { name: "Admin" };
    setUserName(user.name);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setIsOpen(true);
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (!isMobile || !isOpen) return;

    const handleClickOutside = (event) => {
      if (
        !event.target.closest(".sidebar") &&
        !event.target.closest(".hamburger")
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, isMobile]);

  return (
    <>
      <div className={`hamburger ${isOpen ? "open" : ""}`} onClick={toggleSidebar}>
        <div className="hamburger-line"></div>
        <div className="hamburger-line"></div>
        <div className="hamburger-line"></div>
      </div>

      <div
        className={`sidebar ${
          isOpen ? "open" : isMobile ? "closed" : "desktop-closed"
        }`}
      >
        <div className="user-info">
          <div className="user-avatar">{userName.charAt(0).toUpperCase()}</div>
          <div className="user-name">{userName}</div>
        </div>

        <nav className="uppermenu">
          <NavLink
            to="/Dashboard"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
            onClick={() => isMobile && setIsOpen(false)}
          >
            <span className="link-text">Dashboard</span>
          </NavLink>

          <NavLink
            to="/Bom"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
            onClick={() => isMobile && setIsOpen(false)}
          >
            <span className="link-text">Bom</span>
          </NavLink>

          <NavLink
            to="/BomStock"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
            onClick={() => isMobile && setIsOpen(false)}
          >
            <span className="link-text">Bom Stock</span>
          </NavLink>

          <NavLink
            to="/Repair"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
            onClick={() => isMobile && setIsOpen(false)}
          >
            <span className="link-text">Repair</span>
          </NavLink>

           <NavLink
            to="/Reject"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
            onClick={() => isMobile && setIsOpen(false)}
          >
            <span className="link-text">Reject</span>
          </NavLink>

           <NavLink
            to="/RepairHistory"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
            onClick={() => isMobile && setIsOpen(false)}
          >
            <span className="link-text">Repair History</span>
          </NavLink>

          <NavLink
            to="/RejectHistory"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
            onClick={() => isMobile && setIsOpen(false)}
          >
            <span className="link-text">Reject History</span>
          </NavLink>

         
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
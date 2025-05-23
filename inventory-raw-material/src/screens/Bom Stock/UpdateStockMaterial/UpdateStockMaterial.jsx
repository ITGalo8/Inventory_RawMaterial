import React, { useState } from "react";
import Api from "../../../Auth/Api";
import { useNavigate, useLocation } from "react-router-dom";

const UpdateStockMaterial = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { itemName, rawMaterialId, userId, currentStock } =
    location.state || {};
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);

  console.log("Item Name:", itemName);
  console.log("Raw Material ID:", rawMaterialId);
  console.log("User ID:", userId);
  console.log("Current Stock:", currentStock);
  console.log("Quantity:", quantity);

  const handleSubmit = async () => {
    if (!quantity) {
      alert("Please enter a quantity");
      return;
    }

    const quantityValue = parseInt(quantity);
    if (isNaN(quantityValue)) {
      alert("Quantity must be a number");
      return;
    }

    if (quantityValue <= 0) {
      alert("Quantity must be greater than 0");
      return;
    }

    const itemData = {
      rawMaterialId,
      userId,
      quantity: quantityValue,
      type: "IN",
    };

    setLoading(true);
    try {
      const response = await Api.post(
        "/admin/updateRawMaterialStock",
        itemData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Response:", response.data);
      alert("Stock added successfully!");
      setQuantity("");
    } catch (error) {
      console.error("Error updating stock:", error);
      if (error.response) {
        alert(error.response.data.message || "Failed to update stock");
      } else {
        alert("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Add Stock: {itemName}</h2>
      <p style={styles.label}>Current Stock: {currentStock}</p>

      <label style={styles.label}>Quantity to Add:</label>
      <input
        type="number"
        style={styles.input}
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        placeholder="Enter quantity to add"
      />

      <button onClick={handleSubmit} style={styles.button} disabled={loading}>
        {loading ? "Adding..." : "Add to Stock"}
      </button>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "0 auto",
    padding: "30px",
    backgroundColor: "#f5f5f5",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  header: {
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "20px",
    textAlign: "center",
    color: "#333",
  },
  label: {
    fontSize: "16px",
    fontWeight: "600",
    margin: "10px 0",
    display: "block",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    marginBottom: "15px",
  },
  button: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    fontWeight: "bold",
    backgroundColor: "#2c3e50",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default UpdateStockMaterial;

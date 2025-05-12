import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AddSubItemName = () => {
  const [rawMaterialName, setRawMaterialName] = useState('');
  const [selectedUnitName, setSelectedUnitName] = useState('');
  const [loading, setLoading] = useState(false);
  const [unit, setUnit] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://88.222.214.93:5000/admin/showUnit');
        setUnit(response.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to fetch unit');
      } finally {
        setFetching(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!rawMaterialName.trim()) {
      alert('Item name cannot be empty or just spaces.');
      return;
    }

    if (!selectedUnitName) {
      alert('Please select a unit.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://88.222.214.93:5000/admin/addRawMaterial', {
        rawMaterialName: rawMaterialName.trim(),
        unit: selectedUnitName,
      });

      alert('Item added successfully!');
      setRawMaterialName('');
      setSelectedUnitName('');
    } catch (error) {
      console.error('Error adding item:', error);
      const errorMessage =
        error.response?.data?.message || 'An unexpected error occurred. Please try again.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [rawMaterialName, selectedUnitName]);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Add Raw Material</h2>

      <label style={styles.label}>New Item Name*:</label>
      <input
        type="text"
        value={rawMaterialName}
        onChange={(e) => setRawMaterialName(e.target.value)}
        placeholder="Enter new item name"
        style={styles.input}
      />

      <label style={styles.label}>Select Unit*:</label>
      {fetching ? (
        <p>Loading units...</p>
      ) : (
        <select
          value={selectedUnitName}
          onChange={(e) => setSelectedUnitName(e.target.value)}
          style={styles.select}
        >
          <option value="">Select a unit...</option>
          {unit.map((unit) => (
            <option key={unit.id} value={unit.name}>
              {unit.name}
            </option>
          ))}
        </select>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading || !rawMaterialName.trim() || !selectedUnitName}
        style={{
          ...styles.button,
          ...(loading || !rawMaterialName.trim() || !selectedUnitName
            ? styles.disabledButton
            : {}),
        }}
      >
        {loading ? 'Adding...' : 'Add Item'}
      </button>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 400,
    margin: '50px auto',
    padding: 20,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  },
  heading: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: '24px',
  },
  label: {
    display: 'block',
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#333',
    fontSize: '16px',
  },
  input: {
    width: '100%',
    padding: 10,
    fontSize: '16px',
    borderRadius: 6,
    border: '1px solid #ccc',
    marginBottom: 15,
  },
  select: {
    width: '100%',
    padding: 10,
    fontSize: '16px',
    borderRadius: 6,
    border: '1px solid #ccc',
    marginBottom: 15,
  },
  button: {
    width: '100%',
    padding: 12,
    fontSize: '16px',
    backgroundColor: '#070604',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
  },
  disabledButton: {
    backgroundColor: '#999',
    cursor: 'not-allowed',
  },
};

export default AddSubItemName;

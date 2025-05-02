import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import solarPanelImage from '../assets/Solar Panel.png';
import galoImage from '../assets/Galo.png';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`http://88.222.214.93:5000/auth/login`, {
        email,
        password,
        roleId: '8290551b-9d0c-4005-91a8-abe6c841ae4d',
      });

      const userData = response.data.data;
      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('userId', userData.id);

      alert('Successfully Logged In');
      navigate('/dashboard');
    } catch (error) {
      alert(error?.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Please enter email and password.');
      return;
    }
    fetchData();
  };

  return (
    <div style={styles.mainContainer}>
      <div style={styles.imageContainer}>
        <img 
          src={solarPanelImage} 
          alt="Solar Panel" 
          style={styles.sideImage}
        />
      </div>
   
      <div style={styles.formContainer}>
        <div style={styles.loginBox}>
          <img src={galoImage} alt="Logo" style={styles.logo} />
          <h2 style={styles.heading}>Welcome Back!</h2>
          <p style={styles.subTitle}>
            We are happy to see you again. Please enter your Email and Password.
          </p>

          <form onSubmit={handleSubmit} style={styles.form}>
            <label style={styles.label}>Email</label>
            <div style={styles.inputContainer}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                style={styles.input}
                disabled={loading}
              />
            </div>

            <label style={styles.label}>Password</label>
            <div style={styles.inputContainer}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={styles.input}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.toggleButton}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>

            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  mainContainer: {
    display: 'flex',
    height: '100vh',
    width: '100vw',
    overflow: 'hidden',
  },
  imageContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8b6fe5',
    position: 'relative',
    overflow: 'hidden',
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
  sideImage: {
    width: '80%',
    height: 'auto',
    maxHeight: '80%',
    objectFit: 'contain',
    padding: '2rem',
  },
  formContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    backgroundColor: '#ffffff',
    minWidth: '320px',
  },
  loginBox: {
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logo: {
    width: '80px',
    height: '80px',
    marginBottom: '20px',
    objectFit: 'contain',
  },
  heading: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    textAlign: 'center',
    color: '#333',
  },
  subTitle: {
    fontSize: '1rem',
    color: '#666',
    marginBottom: '2rem',
    textAlign: 'center',
    maxWidth: '300px',
  },
  form: {
    width: '100%',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500',
    color: '#333',
  },
  inputContainer: {
    position: 'relative',
    marginBottom: '1.5rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    boxSizing: 'border-box',
  },
  toggleButton: {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.2rem',
    padding: '0',
  },
  button: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#000',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    marginTop: '1rem',
    transition: 'background-color 0.3s',
  },
  signupLink: {
    textAlign: 'center',
    marginTop: '1.5rem',
    color: '#666',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
};

export default LoginScreen;
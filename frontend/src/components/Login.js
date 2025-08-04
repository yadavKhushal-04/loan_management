import React, { useState } from 'react';
import API from '../services/api';

const Login = () => {
  const [form, setForm] = useState({ userName: '', password: '' });
  const [response, setResponse] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const res = await API.post('/auth/login', form);
      setResponse(res.data);
      localStorage.setItem('accessToken', res.data.accessToken);
    } catch (err) {
      setResponse(err.response?.data || { error: 'Login failed' });
    }
  };
 
  return (
    <div>
      <h2>Login</h2>
      <input name="userName" placeholder="Username" onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} />
      <button onClick={handleLogin}>Login</button>
      <pre>{JSON.stringify(response, null, 2)}</pre>
    </div>
  );
};

export default Login;

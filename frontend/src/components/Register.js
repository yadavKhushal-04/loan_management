import React, { useState } from 'react';
import API from '../services/api';

const Register = () => {
  const [form, setForm] = useState({ userName: '', fullName: '', password: '' });
  const [response, setResponse] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      const res = await API.post('/auth/register', form);
      setResponse(res.data);
    } catch (err) {
      setResponse(err.response?.data || { error: 'Request failed' });
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <input name="userName" placeholder="Username" onChange={handleChange} />
      <input name="fullName" placeholder="Full Name" onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} />
      <button onClick={handleRegister}>Register</button>
      <pre>{JSON.stringify(response, null, 2)}</pre>
    </div>
  );
};

export default Register;

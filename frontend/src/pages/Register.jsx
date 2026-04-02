import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/api/auth/register', formData);
      alert('Registration successful.');
      navigate('/login');
    } catch {
      alert('Registration failed.');
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/background.png')" }}
    >
      <div className="bg-black/60 p-6 rounded w-full max-w-md">
        <form className="bg-white p-6 shadow-md rounded text-black" onSubmit={handleSubmit}>
          <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>

          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full mb-4 p-2 border rounded text-black"
          />

          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full mb-4 p-2 border rounded text-black"
          />

          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full mb-4 p-2 border rounded text-black"
          />

          <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;

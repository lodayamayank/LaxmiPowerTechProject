import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/logo.png";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

 const handleLogin = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    const res = await fetch('http://192.168.29.92:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.message || 'Login failed');
      setLoading(false);
      return;
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('loginTime', Date.now());

    navigate('/dashboard');

  } catch (err) {
    console.error('Login error:', err);
    setError('Something went wrong');
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <img
        src={logo}
        alt="Laxmi Powertech"
        className="w-48 mb-6"
      />

      <form onSubmit={handleLogin} className="w-full max-w-sm">
        <h2 className="text-center text-md font-bold text-gray-800 mb-6 tracking-wide">
          LOGIN TO YOUR ACCOUNT
        </h2>

        {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}

        <input
          type="email"
          placeholder="Name"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-2 px-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
          required
        />

        <div className="text-right text-sm text-gray-600 mb-6">
          <a href="#" className="hover:underline">Forgot Password ?</a>
        </div>

        <button
          type="submit"
          className="w-full mb-3 bg-orange-500 text-white font-bold py-2 rounded-full shadow-md hover:bg-orange-600 transition"
        >
          LOG IN
        </button>

        <button
          type="button"
          className="w-full bg-orange-500 text-white font-bold py-2 rounded-full shadow-md hover:bg-orange-600 transition"
          onClick={() => alert('Staff login pending functionality')}
        >
          STAFF LOG IN
        </button>
      </form>
    </div>
  );
};

export default Login;

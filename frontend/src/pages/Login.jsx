import { useState } from 'react';
import logo from '../assets/logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.user.role);
      window.location.href = '/dashboard';
    } else {
      alert(data.message || 'Login failed');
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-sm px-4">
        <img src={logo} alt="Logo" className="w-72 mx-auto mb-6" />

        <form
          onSubmit={handleLogin}
          className="bg-white p-6 rounded shadow-md"
        >
          <h2 className="text-center font-semibold mb-6 text-gray-800 tracking-widest">
            LOGIN TO YOUR ACCOUNT
          </h2>

          <input
            type="email"
            placeholder="Name"
            className="w-full bg-gray-100 p-3 rounded-lg mb-4 text-sm outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full bg-gray-100 p-3 rounded-lg mb-2 text-sm outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="text-right text-sm text-gray-500 mb-4 cursor-pointer hover:underline">
            Forgot Password ?
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-orange-600 transition"
          >
            LOG IN
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

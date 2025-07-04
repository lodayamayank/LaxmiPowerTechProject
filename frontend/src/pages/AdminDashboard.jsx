import DashboardLayout from '../layouts/DashboardLayout';
import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';

const Dashboard = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'labour',
    password: 'default123'
  });

  const [attendances, setAttendances] = useState([]);
  const token = localStorage.getItem('token');

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:5000/api/users/register', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('✅ User registered successfully!');
      setFormData({ name: '', email: '', role: 'labour', password: 'default123' });
    } catch (err) {
      console.error(err);
      alert('❌ User registration failed');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/attendance', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAttendances(res.data);
      } catch (err) {
        console.error('Failed to fetch attendance', err);
      }
    };
    fetchData();
  }, [token]);

  return (
    <DashboardLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

        {/* Register User */}
        <div className="bg-white shadow rounded p-4 mb-8">
          <h2 className="text-lg font-semibold mb-2">Register New User</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <input
              className="border p-2 rounded"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
              className="border p-2 rounded"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <input
              className="border p-2 rounded"
              placeholder="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <select
              className="border p-2 rounded"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="labour">Labour</option>
              <option value="supervisor">Supervisor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            onClick={handleRegister}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Register User
          </button>
        </div>

        {/* Attendance Table */}
        <div className="overflow-x-auto">
          <h2 className="text-lg font-semibold mb-2">Attendance Records</h2>
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Name</th>
                <th className="border p-2">Type</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Time</th>
                <th className="border p-2">Location</th>
                <th className="border p-2">Selfie</th>
              </tr>
            </thead>
            <tbody>
              {attendances.map((item) => (
                <tr key={item._id}>
                  <td className="border p-2">{item.user?.name || 'N/A'}</td>
                  <td className="border p-2 capitalize">{item.punchType}</td>
                  <td className="border p-2">{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td className="border p-2">{new Date(item.createdAt).toLocaleTimeString()}</td>
                  <td className="border p-2">
                    {item.lat && item.lng ? `${item.lat.toFixed(4)}, ${item.lng.toFixed(4)}` : 'N/A'}
                  </td>
                  <td className="border p-2">
                    {item.selfieUrl ? (
                      <img
                        src={`http://localhost:5000${item.selfieUrl}`}
                        alt="selfie"
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      'N/A'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

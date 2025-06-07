import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';

const PunchIn = () => {
  const [selfie, setSelfie] = useState(null);
  const [location, setLocation] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [punchType, setPunchType] = useState('in');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { replace: true });
    }

    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    window.addEventListener('online', syncOfflinePunches);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
      window.removeEventListener('online', syncOfflinePunches);
    };
  }, [navigate]);

  const handleSelfie = (e) => {
    setSelfie(e.target.files[0]);
  };

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => setStatus('❌ Location access denied'),
      { enableHighAccuracy: true }
    );
  };

  const handleSubmit = async () => {
    if (!selfie || !location) {
      setStatus('❌ Please provide selfie and allow location');
      return;
    }

    const punchData = {
      lat: location.lat,
      lng: location.lng,
      type: punchType,
      timestamp: new Date().toISOString(),
    };

    if (!isOnline) {
      const reader = new FileReader();
      reader.onloadend = () => {
        punchData.selfieBase64 = reader.result;
        const existing = JSON.parse(localStorage.getItem('offlinePunches') || '[]');
        existing.push(punchData);
        localStorage.setItem('offlinePunches', JSON.stringify(existing));
        setStatus('✅ Saved offline. Will sync when online.');
      };
      reader.readAsDataURL(selfie);
      return;
    }

    const formData = new FormData();
    formData.append('selfie', selfie);
    formData.append('lat', location.lat);
    formData.append('lng', location.lng);
    formData.append('type', punchType);

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.post('/api/attendance/punch', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setStatus('✅ Punch successful');
    } catch (error) {
      console.error(error);
      setStatus('❌ Punch failed');
    } finally {
      setLoading(false);
    }
  };

  const syncOfflinePunches = async () => {
    const stored = JSON.parse(localStorage.getItem('offlinePunches') || '[]');
    if (stored.length === 0) return;

    const token = localStorage.getItem('token');

    for (const item of stored) {
      try {
        const blob = await (await fetch(item.selfieBase64)).blob();
        const formData = new FormData();
        formData.append('selfie', blob, 'selfie.jpg');
        formData.append('lat', item.lat);
        formData.append('lng', item.lng);
        formData.append('type', item.type);

        await axios.post('/api/attendance/punch', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error('Failed to sync punch:', error);
        return;
      }
    }

    localStorage.removeItem('offlinePunches');
    setStatus('✅ Offline punches synced successfully');
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-2xl font-bold mb-4">Punch {punchType === 'in' ? 'In' : 'Out'}</h1>

      <p className="text-sm mb-4 text-gray-600">
        Status: <span className={isOnline ? 'text-green-600' : 'text-red-600'}>
          {isOnline ? 'Online' : 'Offline'}
        </span>
      </p>

      <div className="mb-4">
        <label className="block mb-2">Upload Selfie</label>
        <input
          type="file"
          accept="image/*"
          capture={isOnline ? 'user' : undefined}
          onChange={handleSelfie}
        />
      </div>

      <div className="mb-4">
        <button
          onClick={getLocation}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Get Location
        </button>
      </div>

      <div className="mb-4">
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Punch'}
        </button>
      </div>

      <p className="text-sm text-gray-700">{status}</p>
    </div>
  );
};

export default PunchIn;

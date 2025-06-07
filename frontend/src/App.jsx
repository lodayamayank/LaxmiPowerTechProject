import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import RoleBasedDashboard from './pages/RoleBasedDashboard';
import PunchIn from './pages/PunchIn';
import PrivateRoute from './components/PrivateRoute';
import { useEffect } from 'react';
import { syncOfflineAttendance } from './utils/syncAttendance';
import MyAttendance from './pages/MyAttendance';


function App() {
  useEffect(() => {
    if (navigator.onLine) {
      syncOfflineAttendance();
    }

    const onOnline = () => syncOfflineAttendance();
    window.addEventListener('online', onOnline);

    return () => window.removeEventListener('online', onOnline);
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/my-attendance" element={<MyAttendance />} />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <RoleBasedDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/punch"
        element={
          <PrivateRoute>
            <PunchIn />
          </PrivateRoute>
        }
      />
    </Routes>
    
  );
}

export default App;
